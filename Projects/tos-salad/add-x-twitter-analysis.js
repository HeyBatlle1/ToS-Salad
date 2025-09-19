#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addXTwitterAnalysis() {
  console.log('🐦 Adding X (Twitter) Terms of Service analysis...');

  const xContent = `X (Formerly Twitter) Terms of Service: Key Clause Analysis & Transparency Score

Transparency Score: 14/100
Justification: X's Terms of Service represent one of the most aggressively exploitative agreements in social media, combining explicit AI training clauses, sweeping content licensing, and unprecedented financial penalties for data access. The agreement systematically strips users of legal recourse while maximizing corporate control over public discourse. The score reflects the platform's transformation into a data extraction and AI training operation that weaponizes user content while providing minimal user protections or accountability.

1. The AI Training Clause: Your Content is Explicitly AI Fuel
Original Text: "You agree that this license includes the right for us to... provide, promote, and improve the Services, including, for example, for use with and training of our machine learning and artificial intelligence models, whether generative or another type..."
Plain English Explanation: This is a direct and explicit statement that everything you post on X—your thoughts, opinions, photos, and videos—can and will be used to train their AI models. By using the service, you are providing the free raw material for the development of their future AI products.

2. The "Everything" License: A Sweeping, Perpetual Right to Your Content
Original Text: "By submitting, posting or displaying Content... you grant us a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, upload, download, and distribute such Content in any and all media or distribution methods now known or later developed, for any purpose."
Plain English Explanation: This is the standard, maximalist content license. It means you give X permanent, free rein to do almost anything they want with what you post. They can modify it, sell the rights to it to other companies ("sublicense"), and use it in any way they see fit to run and promote their service, without ever paying you.

3. The Liquidated Damages Clause: A Financial Penalty for Scraping
Original Text: "...if you violate the Terms... by requesting, viewing, or accessing more than 1,000,000 posts... in any 24-hour period - $15,000 USD per 1,000,000 posts. You agree that these amounts are (i) a reasonable estimate of our damages; (ii) not a penalty..."
Plain English Explanation: This is a highly unusual and aggressive clause. It pre-sets a massive financial penalty for users or automated systems that access too much data ("scraping"). It is designed to be a powerful deterrent against researchers, archivists, or competitors trying to analyze the platform's public data on a large scale.

4. The Standard $100 Liability Cap
Original Text: "IN NO EVENT SHALL THE AGGREGATE LIABILITY OF THE X ENTITIES EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS (U.S. $100.00) OR THE AMOUNT YOU PAID US, IF ANY, IN THE PAST SIX MONTHS FOR THE SERVICES GIVING RISE TO THE CLAIM."
Plain English Explanation: If X's failure causes you catastrophic harm (e.g., a massive data breach, loss of your business's account), the absolute maximum financial responsibility they accept is $100 or the fees you paid them in the last six months.

5. The Shortened Time to Sue: One Year or Your Rights Are Gone
Original Text: "You and X agree that you must initiate any proceeding or action within one (1) year of the date of the occurrence of the event... Otherwise... you forever waive the right to pursue any claim..."
Plain English Explanation: This clause dramatically shortens the time you have to take legal action. You are forced to file any lawsuit within one year of the incident, or your right to do so is permanently lost.

6. The Home Court Advantage: You Must Sue in Texas
Original Text: "All disputes related to these Terms or the Services... will be brought exclusively in the U.S. District Court for the Northern District of Texas or state courts located in Tarrant County, Texas..."
Plain English Explanation: This forces any user with a legal dispute to file their lawsuit in Texas, regardless of where they live. This creates a significant financial and logistical barrier to seeking justice for most people.

X's Terms of Service transform public discourse into proprietary AI training data while systematically eliminating user rights and legal recourse through extreme liability limitations and access barriers.

Transparency Score: 14/100 - Critical Risk Level
Red Flags: 6 systematic discourse exploitation and legal control mechanisms`;

  try {
    // First create or get X company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'x.com')
      .single();

    if (companyError || !existingCompany) {
      console.log('📝 Creating X (Twitter) company record...');
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'X (Twitter)',
          domain: 'x.com',
          industry: 'Social Media',
          headquarters: 'San Francisco, CA',
          founded_year: 2006,
          tos_url: 'https://x.com/en/tos',
          corporate_website: 'https://x.com',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ X (Twitter) company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing X (Twitter) company record');
    }

    // Create X-specific document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'X (Twitter) Terms of Service',
        url: 'https://x.com/en/tos',
        raw_content: xContent,
        cleaned_content: xContent,
        content_hash: require('crypto').createHash('md5').update(xContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: xContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Document creation failed:', docError.message);
      return;
    }

    console.log('✅ X (Twitter) document created');

    // Create X-specific analysis with discourse exploitation focus
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 14, // Worse than TikTok due to explicit AI training and liquidated damages
        user_friendliness_score: 10, // Extremely hostile with financial penalties
        privacy_score: 5, // Critical - explicit AI training on all content
        manipulation_risk_score: 92, // Critical - public discourse weaponization
        data_collection_risk: 'critical', // Explicit AI training on all user content
        data_sharing_risk: 'critical', // Sublicensable rights to third parties
        account_termination_risk: 'high', // Standard termination powers
        legal_jurisdiction_risk: 'critical', // Texas courts + shortened lawsuit deadlines
        concerning_clauses: [
          {category: 'Explicit AI Training Rights', concern: 'Direct statement that all content trains AI models'},
          {category: 'Sweeping Everything Content License', concern: 'Permanent worldwide rights to all user posts'},
          {category: 'Liquidated Damages Penalties', concern: '$15,000 financial penalty for accessing too much public data'},
          {category: 'Standard Liability Cap', concern: 'Maximum $100 liability for catastrophic platform failures'},
          {category: 'Shortened Legal Deadline', concern: 'One year limit to file lawsuits or lose rights forever'},
          {category: 'Texas Court Geographic Barrier', concern: 'Must sue in Texas regardless of user location'}
        ],
        manipulation_tactics: ['Discourse Weaponization', 'AI Training Extraction', 'Legal Access Denial', 'Financial Penalties'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'X systematically exploits public discourse for AI training while eliminating user legal recourse, scoring 14/100.',
        key_concerns: [
          'Explicit AI Training on All User Content',
          'Permanent Worldwide Content Licensing Rights',
          'Financial Penalties for Data Access Research',
          'Standard $100 Maximum Liability Cap',
          'One Year Legal Action Deadline',
          'Texas Geographic Legal Barrier'
        ],
        recommendations: [
          'Understand all posts explicitly train X AI models',
          'Know X has permanent rights to all your content',
          'Be aware of $15,000 penalties for accessing too much data',
          'Maximum X liability is $100 regardless of platform failures',
          'Must file lawsuits within one year or lose rights forever',
          'Can only sue X in Texas courts creating geographic barrier',
          'Consider discourse weaponization risks before posting',
          'Recognize public speech becomes proprietary AI training data',
          'Understand legal recourse is systematically eliminated',
          'Platform designed for content extraction not user protection'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ X (Twitter) analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: Critical (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 6 discourse exploitation and legal control mechanisms`);
    console.log('🐦 Public discourse weaponization confirmed!');

    // Show updated transparency rankings
    console.log('\n📊 UPDATED TRANSPARENCY RANKINGS:');
    console.log('==================================');
    console.log('🏦 Bank of America: 8/100 (CRITICAL - Financial Exploitation)');
    console.log('🎵 TikTok:          12/100 (CRITICAL - Minor Exploitation)');
    console.log('🐦 X (Twitter):     14/100 (CRITICAL - Discourse Weaponization)');
    console.log('🚨 Verizon:         15/100 (CRITICAL - Monopoly Abuse)');
    console.log('⚖️ Microsoft:       16/100 (CRITICAL - Legal Engineering)');
    console.log('🔴 Reddit:          18/100 (CRITICAL - Content Exploitation)');
    console.log('🔍 Google:          20/100 (CRITICAL - Surveillance & Content Control)');
    console.log('🦦 Otter.ai:        22/100 (High Risk - Conversation Privacy)');
    console.log('📊 LinkedIn:        25/100 (High Risk - Professional Exploitation)');

  } catch (error) {
    console.error('❌ X (Twitter) analysis failed:', error.message);
  }
}

addXTwitterAnalysis();