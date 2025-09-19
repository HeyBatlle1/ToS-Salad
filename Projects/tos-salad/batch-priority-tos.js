#!/usr/bin/env node

const { execSync } = require('child_process');

const tosUrls = [
  // Google Ecosystem
  {company: "Google", service: "Main Services", url: "https://policies.google.com/terms?hl=en&fg=1"},
  {company: "YouTube", service: "Main Platform", url: "https://www.youtube.com/t/terms"},

  // AI Platforms
  {company: "OpenAI", service: "Main Platform", url: "https://openai.com/policies/row-terms-of-use/"},

  // Tech Giants
  {company: "Apple", service: "Internet Services", url: "https://www.apple.com/legal/internet-services/terms/site.html"},
  {company: "Amazon", service: "Retail", url: "https://www.amazon.com/gp/help/customer/display.html/?nodeId=508088"},
  {company: "Microsoft", service: "Main Platform", url: "https://www.microsoft.com/en-us/legal/terms-of-use"},

  // Social/Professional
  {company: "LinkedIn", service: "Main Platform", url: "https://www.linkedin.com/legal/user-agreement"},
  {company: "Discord", service: "Main Platform", url: "https://discord.com/terms/", priority: "RESEARCH HEAVY"},

  // Financial Services
  {company: "PayPal", service: "Main Platform", url: "https://www.paypal.com/us/legalhub/paypal/useragreement-full"},
  {company: "Chase", service: "Digital Banking", url: "https://www.chase.com/digital/resources/terms-of-use"},
  {company: "Robinhood", service: "Brokerage", url: "https://brokerage-static.s3.amazonaws.com/assets/robinhood/legal/Robinhood%20Terms%20and%20Conditions.pdf"},
  {company: "Coinbase", service: "Main Platform", url: "https://www.coinbase.com/legal/user_agreement/united_states"},
  {company: "Varo Bank", service: "Banking", url: "https://www.varomoney.com/privacy-legal/varo-bank-general-terms-agreement-effective-as-of-november-6-2023/"},

  // Telecom (Multiple Services)
  {company: "Verizon", service: "Entertainment", url: "https://www.verizon.com/support/entertainment-play-legal/"},
  {company: "Verizon", service: "Mobile", url: "https://www.verizon.com/about/terms-conditions/terms-of-use/mobile"},
  {company: "Verizon", service: "FiOS", url: "https://www.verizon.com/support/fios-customer-agreement/"},

  // Entertainment (Multiple Services)
  {company: "Spotify", service: "End User", url: "https://www.spotify.com/us/legal/end-user-agreement/"},
  {company: "Spotify", service: "Creators", url: "https://www.spotify.com/us/legal/spotify-for-creators-terms/"},

  // Productivity/Dev Tools
  {company: "Slack", service: "Main Platform", url: "https://slack.com/terms-of-service"},
  {company: "Notion", service: "Main Platform", url: "https://notion.online/terms-conditions/"},
  {company: "GitHub", service: "Main Platform", url: "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"},
  {company: "Supabase", service: "Main Platform", url: "https://supabase.com/terms"},
  {company: "VSCode", service: "License", url: "https://code.visualstudio.com/license"},

  // Hardware/Complex
  {company: "Samsung", service: "USA Legal", url: "https://www.samsung.com/us/support/legal/LGL10000282/", note: "Multi-tab interface"},

  // AI Tools (Fixed)
  {company: "Perplexity", service: "Main Platform", url: "https://www.perplexity.ai/hub/terms"},
];

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    console.error(`❌ Invalid URL: ${url}`);
    return null;
  }
}

function runCommand(command, description) {
  console.log(`\n🔍 ${description}`);
  console.log(`📝 Command: ${command}`);

  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    console.log(`✅ Completed: ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function processBatch() {
  console.log('🥗 ToS Salad - Priority Batch Collection');
  console.log('==========================================');
  console.log(`📊 Processing ${tosUrls.length} ToS documents\n`);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };

  // Group by category for organized processing
  const categories = {
    'High Priority (AI/Social)': tosUrls.filter(t =>
      ['OpenAI', 'Discord', 'Google'].includes(t.company)
    ),
    'Tech Giants': tosUrls.filter(t =>
      ['Apple', 'Amazon', 'Microsoft'].includes(t.company)
    ),
    'Financial Services': tosUrls.filter(t =>
      ['PayPal', 'Chase', 'Robinhood', 'Coinbase', 'Varo Bank'].includes(t.company)
    ),
    'Entertainment/Media': tosUrls.filter(t =>
      ['YouTube', 'Spotify'].includes(t.company)
    ),
    'Telecom': tosUrls.filter(t =>
      t.company === 'Verizon'
    ),
    'Productivity Tools': tosUrls.filter(t =>
      ['LinkedIn', 'Slack', 'Notion', 'GitHub', 'Supabase', 'VSCode'].includes(t.company)
    ),
    'Hardware/Complex': tosUrls.filter(t =>
      ['Samsung', 'Perplexity'].includes(t.company)
    )
  };

  for (const [categoryName, urls] of Object.entries(categories)) {
    if (urls.length === 0) continue;

    console.log(`\n🎯 === ${categoryName} ===`);

    for (const tosEntry of urls) {
      if (tosEntry.url === 'NEEDS_CORRECTION') {
        console.log(`⚠️  Skipping ${tosEntry.company} - URL needs correction`);
        results.skipped++;
        continue;
      }

      const domain = extractDomain(tosEntry.url);
      if (!domain) {
        results.failed++;
        continue;
      }

      const displayName = `${tosEntry.company} (${tosEntry.service})`;
      const priorityFlag = tosEntry.priority ? ` [${tosEntry.priority}]` : '';
      const noteFlag = tosEntry.note ? ` (${tosEntry.note})` : '';

      console.log(`\n📄 Processing: ${displayName}${priorityFlag}${noteFlag}`);
      console.log(`🔗 URL: ${tosEntry.url}`);
      console.log(`🌐 Domain: ${domain}`);

      // Use the ToS Salad CLI to collect
      const command = `npx ts-node src/cli.ts collect ${domain} --verbose`;
      const success = runCommand(command, `Collecting ${displayName}`);

      if (success) {
        results.success++;

        // For high priority items, also analyze immediately
        if (tosEntry.priority === 'RESEARCH HEAVY') {
          console.log(`\n🧠 High priority analysis for ${tosEntry.company}...`);
          const analyzeCommand = `npx ts-node src/cli.ts analyze ${domain} --verbose`;
          runCommand(analyzeCommand, `Analyzing ${displayName}`);
        }
      } else {
        results.failed++;
      }

      // Small delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎉 Batch Processing Complete!');
  console.log('================================');
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📊 Total: ${results.success + results.failed + results.skipped}`);

  console.log('\n📋 Next Steps:');
  console.log('1. Review failed collections manually');
  console.log('2. Run analysis: npx ts-node src/cli.ts analyze <domain>');
  console.log('3. Export results: npx ts-node src/cli.ts export --format markdown');
  console.log('\n🚩 High priority items flagged for immediate review:');

  tosUrls.filter(t => t.priority).forEach(t => {
    console.log(`   • ${t.company} (${t.service}) - ${t.priority}`);
  });
}

// Add delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the batch processing
processBatch().catch(error => {
  console.error('❌ Batch processing failed:', error);
  process.exit(1);
});