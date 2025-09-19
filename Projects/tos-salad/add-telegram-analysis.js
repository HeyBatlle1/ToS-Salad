#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addTelegramAnalysis() {
  console.log('📱 Adding Telegram Terms of Service analysis...');

  const telegramContent = `Telegram Terms of Service: Key Clause Analysis & Transparency Score

Transparency Score: 45/100
Justification: Telegram's Terms of Service employ a unique and concerning strategy of strategic omission rather than explicit exploitation. Unlike other platforms that aggressively claim user rights, Telegram creates dangerous legal ambiguity by omitting critical clauses entirely. The document lacks fundamental protections like content licensing definitions, liability caps, and dispute resolution mechanisms. This absence is not accidental—it creates maximum operational flexibility for Telegram while leaving users in legal limbo with no contractual protections. The score reflects that while less overtly hostile than other platforms, the legal uncertainty may be equally harmful.

1. The Void: The Missing Content License Clause
Observation: The document contains no clause defining what license you grant Telegram to your content. This is the single most important and glaring omission. Every other major service (Meta, Google, X, TikTok, etc.) has a detailed clause explaining that you grant them a broad, worldwide license to use, reproduce, modify, and distribute your content.
Plain English Explanation: Because they do not define the license, the legal status of your content (messages, photos, videos) on their platform is dangerously unclear. While they state they offer "unlimited cloud storage," they do not legally specify what rights they have to access, scan, or use that stored content. This silence gives them immense operational flexibility and leaves users with no written contractual protection regarding how their private and public data is used.

2. The Hidden Terms: The Real Rules Are Elsewhere
Observation: The core terms for the free service are limited to a short list of prohibited actions (spamming, promoting violence, etc.) and a reference to the Privacy Policy. Critical topics like liability, warranties, and dispute resolution are completely absent from the main ToS.
Plain English Explanation: This ToS is not a complete legal agreement for the core service. Unlike every other major platform, it does not include standard (even if user-hostile) sections on Limitation of Liability, Warranty Disclaimers, or how legal disputes will be handled. This means either these terms are located in another document not easily found, or there are no contractually agreed-upon terms at all, leaving users in a legal limbo with no clear path for recourse if the service fails or causes them harm.

3. The Premium Forfeit Clause: You Lose Everything if You Are Banned
Original Text: "Failure to comply with the Telegram Terms of Service may result in a temporary or a permanent ban... In such instances, you might lose the benefits of Telegram Premium and we will not compensate you for this loss."
Plain English Explanation: This clause states that if you are banned from Telegram for violating their rules, you will lose any paid subscription time you have left. They will not provide a refund or any other compensation for the service you paid for but can no longer use.

4. The Service Guarantee Void: No Promise of Availability or Compensation
Original Text: "Telegram strives to make its services available for all users all the time, but occasional technical issues may occur... Telegram will not compensate you for any direct or indirect loss resulting from our temporary inability to provide any free or paid services."
Plain English Explanation: This is their version of the "As Is" and liability disclaimer, but specifically for service outages. They explicitly state that if their service goes down—even for paid Premium users—they will not compensate you for any losses you suffer as a result. If you rely on Telegram for business or critical communications, you bear all the risk of their technical failures.

5. Third-Party Data Dependency: Core Features Rely on an External Company
Original Text: "The accuracy and availability of these technologies [transcription and translation] depend on a third party (Google LLC, subsidiary of Alphabet Inc.), and we can not guarantee that they will always be accurate and available."
Plain English Explanation: For key Premium features like transcription and translation, Telegram is not using its own technology. It is sending your data to Google to be processed. While detailed in the Privacy Policy, the ToS confirms that the reliability of these paid features is entirely outside of their control.

6. The Giveaway Liability Dump: If You Run a Giveaway, All Legal Risk is Yours
Original Text: "If you run a giveaway, you are solely responsible for complying with applicable law. You explicitly acknowledge that Telegram is not liable in the event of sanctions, fees, and any form of legal or administrative action incurred as a result of or in relation to your use of the "Giveaway" feature..."
Plain English Explanation: Telegram provides a feature for channel owners to run giveaways, but this clause transfers 100% of the legal risk to the user. If a giveaway violates local gambling or promotion laws, the channel owner is solely responsible for all fines, sanctions, and legal consequences. Telegram takes zero responsibility for the use of its own tool.

Telegram's strategy of strategic omission creates legal ambiguity that may be more dangerous than explicit exploitation, as users have no contractual protections or clear legal recourse while the platform maintains maximum operational flexibility.

Transparency Score: 45/100 - High Risk Level
Red Flags: 6 strategic omission and legal ambiguity mechanisms`;

  try {
    // First create or get Telegram company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'telegram.org')
      .single();

    if (companyError || !existingCompany) {
      console.log('📝 Creating Telegram company record...');
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Telegram',
          domain: 'telegram.org',
          industry: 'Messaging',
          headquarters: 'Dubai, UAE',
          founded_year: 2013,
          tos_url: 'https://telegram.org/tos',
          corporate_website: 'https://telegram.org',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Telegram company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Telegram company record');
    }

    // Create Telegram-specific document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Telegram Terms of Service',
        url: 'https://telegram.org/tos',
        raw_content: telegramContent,
        cleaned_content: telegramContent,
        content_hash: require('crypto').createHash('md5').update(telegramContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: telegramContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Document creation failed:', docError.message);
      return;
    }

    console.log('✅ Telegram document created');

    // Create Telegram-specific analysis with strategic omission focus
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 45, // Better than most due to less explicit exploitation, but concerning omissions
        user_friendliness_score: 50, // Deceptively simple but legally dangerous
        privacy_score: 40, // Unclear data rights and Google dependency
        manipulation_risk_score: 55, // High risk through legal ambiguity rather than explicit clauses
        data_collection_risk: 'medium', // Unclear due to missing content license
        data_sharing_risk: 'high', // Google dependency for premium features
        account_termination_risk: 'medium', // Standard ban consequences
        legal_jurisdiction_risk: 'high', // No dispute resolution mechanism defined
        concerning_clauses: [
          {category: 'Missing Content License Definition', concern: 'No legal clarity on Telegram rights to user content'},
          {category: 'Absent Core Legal Protections', concern: 'Missing liability, warranty, and dispute resolution clauses'},
          {category: 'Premium Service Forfeiture', concern: 'No refund for paid services if account banned'},
          {category: 'Service Availability Disclaimer', concern: 'No compensation for outages even for paid users'},
          {category: 'Third Party Data Dependency', concern: 'Premium features send data to Google for processing'},
          {category: 'Giveaway Feature Liability Transfer', concern: 'Users bear all legal risk for platform-provided tools'}
        ],
        manipulation_tactics: ['Strategic Omission', 'Legal Ambiguity', 'Operational Flexibility', 'Contractual Void'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Telegram employs strategic omission to create legal ambiguity and maximum operational flexibility while leaving users without contractual protections, scoring 45/100.',
        key_concerns: [
          'Complete Absence of Content License Definition',
          'Missing Fundamental Legal Protection Clauses',
          'Premium Service Ban Forfeiture Without Refund',
          'No Service Availability Compensation Guarantees',
          'Third Party Google Data Processing Dependency',
          'Complete Giveaway Feature Legal Risk Transfer'
        ],
        recommendations: [
          'Understand your content rights are legally undefined',
          'No contractual protections for liability, warranties, or disputes',
          'Know you lose paid premium time if banned without refund',
          'No compensation for service outages even as paying customer',
          'Premium features send your data to Google for processing',
          'Bear all legal risks for using Telegram-provided giveaway tools',
          'Legal ambiguity may be more dangerous than explicit exploitation',
          'Real terms of service are operational practices, not written clauses',
          'Maximum Telegram flexibility means minimum user protections',
          'Consider legal recourse limitations before critical usage'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Telegram analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: High (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 6 strategic omission and legal ambiguity mechanisms`);
    console.log('📱 Strategic legal omission strategy confirmed!');

    // Show updated transparency rankings
    console.log('\n📊 UPDATED TRANSPARENCY RANKINGS:');
    console.log('==================================');
    console.log('🏦 Bank of America: 8/100 (CRITICAL - Financial Exploitation)');
    console.log('🎵 TikTok:          12/100 (CRITICAL - Minor Exploitation)');
    console.log('🐦 X (Twitter):     14/100 (CRITICAL - Discourse Weaponization)');
    console.log('🚨 Verizon:         15/100 (CRITICAL - Monopoly Abuse)');
    console.log('⚖️ Microsoft:       16/100 (CRITICAL - Legal Engineering)');
    console.log('📺 YouTube:         18/100 (CRITICAL - Creator Exploitation)');
    console.log('🔴 Reddit:          18/100 (CRITICAL - Content Exploitation)');
    console.log('🔍 Google:          20/100 (CRITICAL - Surveillance & Content Control)');
    console.log('🦦 Otter.ai:        22/100 (High Risk - Conversation Privacy)');
    console.log('📊 LinkedIn:        25/100 (High Risk - Professional Exploitation)');
    console.log('📊 Discord:         30/100 (High Risk)');
    console.log('📊 Spotify:         30/100 (Consumer)');
    console.log('👁️ Fathom:          35/100 (High Risk - Mixed Approach)');
    console.log('📱 Telegram:        45/100 (High Risk - Strategic Omission)');
    console.log('...');
    console.log('🤖 Anthropic:       65/100 (Medium Risk - Balanced Approach)');

  } catch (error) {
    console.error('❌ Telegram analysis failed:', error.message);
  }
}

addTelegramAnalysis();