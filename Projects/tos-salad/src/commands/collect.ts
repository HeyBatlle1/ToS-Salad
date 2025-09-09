import puppeteer from 'puppeteer';
import crypto from 'crypto';
import { TosSaladDB } from '../database/supabase';

interface CollectOptions {
  type: string;
  verbose?: boolean;
}

export async function collectCommand(db: TosSaladDB, domain: string, options: CollectOptions) {
  console.log(`🔍 Collecting ToS documents from ${domain}...`);
  
  try {
    // Check if company exists, create if not
    let company = await db.getCompanyByDomain(domain);
    if (!company) {
      console.log(`📝 Creating new company record for ${domain}`);
      company = await db.createCompany({
        name: domain.replace(/\.(com|org|net|io)$/, '').toUpperCase(),
        domain: domain
      });
    }
    
    // Launch browser for scraping
    console.log(`🚀 Launching browser to scrape ${domain}...`);
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    try {
      // Common ToS URL patterns to try
      const urlPatterns = [
        `https://${domain}/terms`,
        `https://${domain}/terms-of-service`,
        `https://${domain}/tos`,
        `https://${domain}/legal/terms`,
        `https://${domain}/legal/terms-of-service`,
        `https://www.${domain}/terms`,
        `https://www.${domain}/terms-of-service`
      ];
      
      let documentFound = false;
      
      for (const url of urlPatterns) {
        if (options.verbose) {
          console.log(`🔎 Trying URL: ${url}`);
        }
        
        try {
          const page = await browser.newPage();
          
          // Set user agent to avoid blocking
          await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
          
          const response = await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 15000 
          });
          
          if (response && response.status() === 200) {
            console.log(`✅ Found ToS document at: ${url}`);
            
            // Extract content
            const content = await page.evaluate(() => {
              // Remove script and style elements
              const scripts = document.querySelectorAll('script, style, nav, header, footer');
              scripts.forEach((el: any) => el.remove());
              
              // Get main content
              const main = document.querySelector('main, article, .content, .terms, .legal-content');
              return main ? (main as any).innerText : (document.body as any).innerText;
            });
            
            // Get page title
            const title = await page.title();
            
            // Create content hash for change detection
            const contentHash = crypto.createHash('md5').update(content).digest('hex');
            
            // Save document to database
            const savedDocument = await db.createDocument({
              company_id: company.id,
              document_type: options.type as any,
              title: title,
              url: url,
              raw_content: content,
              cleaned_content: content.replace(/\s+/g, ' ').trim(),
              content_hash: contentHash,
              scraped_at: new Date().toISOString(),
              http_status: response.status(),
              content_length: content.length,
              content_type: response.headers()['content-type'] || 'text/html',
              is_analyzed: false
            });
            
            console.log(`💾 Saved document: ${savedDocument.id}`);
            console.log(`📄 Content length: ${content.length} characters`);
            console.log(`🔗 URL: ${url}`);
            
            documentFound = true;
            await page.close();
            break;
          }
          
          await page.close();
        } catch (error) {
          if (options.verbose) {
            console.log(`❌ Failed to load ${url}: ${(error as Error).message}`);
          }
        }
      }
      
      if (!documentFound) {
        console.log(`⚠️  No ToS document found for ${domain}`);
        console.log(`💡 Try manually providing a specific URL or check the company's website`);
      }
      
    } finally {
      await browser.close();
    }
    
    // Update company last scraped timestamp
    console.log(`✅ Collection complete for ${domain}`);
    
  } catch (error) {
    console.error(`❌ Collection failed for ${domain}:`, (error as Error).message);
    process.exit(1);
  }
}