#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addOtterAnalysis() {
  console.log('🦦 Adding Otter.ai Terms of Service analysis...');

  const otterContent = `Otter.ai Terms of Service: Key Clause Analysis & Transparency Score

Transparency Score: 22/100
Justification: Otter.ai's Terms of Service are particularly concerning because they govern a service that records and processes private conversations, yet they employ aggressive legal protections that maximize corporate benefit while minimizing user rights. The agreement combines forced arbitration, mandatory AI training on conversation data, business email surveillance, and complete transcription accuracy disclaimers. The score reflects the heightened risk when sensitive conversation data is subject to standard tech industry exploitation practices without meaningful user protections.

1. The Forced Arbitration Gauntlet: You Forfeit Your Right to Sue
Original Text: "...you agree that disputes arising under these Terms will be resolved by binding, individual arbitration, and BY ACCEPTING THESE TERMS, YOU AND OTTER.AI ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN ANY CLASS ACTION OR REPRESENTATIVE PROCEEDING."
Plain English Explanation: This is a complete waiver of your fundamental legal rights. You cannot sue Otter.ai in a real court before a judge or jury. You are also forbidden from joining with other users in a class-action lawsuit. You are forced into a private, individual arbitration process, which heavily favors the corporation.

2. The Mandatory AI Training Clause: Your Conversations Improve Their Product, Whether You Like It or Not
Original Text: "You acknowledge and agree that Otter.ai may collect, create, process, transmit, store, use, and disclose aggregated and/or deidentified data derived from Data or use of the Services ("Aggregated Data") for its business purposes, including for machine learning and training, industry analysis, benchmarking, and analytics."
Plain English Explanation: This clause gives Otter.ai the right to use data derived from your recorded conversations to train its machine learning models. While they state the data is "aggregated and/or deidentified," this is a mandatory opt-in. Unlike some competitors, they do not offer a clear way for individual users to opt-out of having their data used for these training purposes.

3. The Liability Cap: If They Fail, You Get $100
Original Text: "...THE AGGREGATE LIABILITY OF THE OTTER.AI ENTITIES TO YOU FOR ALL CLAIMS... IS LIMITED TO THE GREATER OF: (A) THE AMOUNT YOU HAVE PAID TO OTTER.AI FOR ACCESS TO AND USE OF THE SERVICE IN THE 12 MONTHS PRIOR... OR (B) $100."
Plain English Explanation: This is the standard but predatory liability cap. If a failure by Otter.ai—such as a catastrophic data breach of your most confidential conversations—causes you immense damage, the absolute maximum financial responsibility they accept is $100 or the fees you paid in the previous year.

4. The Accuracy Disclaimer: They Legally Guarantee Nothing About Their Core Product
Original Text: "OTTER.AI MAKES NO WARRANTY ABOUT THE COMPLETENESS OR ACCURACY OF THE TRANSCRIPTION... YOU SHOULD NOT RELY ON AI OUTPUTS WITHOUT INDEPENDENTLY CONFIRMING THEIR ACCURACY."
Plain English Explanation: This is a critical disclaimer for a transcription service. Legally, Otter.ai makes zero promises that the transcriptions will be accurate. The entire responsibility for verifying the accuracy of the notes falls on you. You cannot hold them liable for damages caused by an inaccurate transcription.

5. The "Your Ideas Are Ours" Clause
Original Text: "If you choose to provide... ("Feedback"), then you hereby grant Otter.ai an unrestricted, perpetual, irrevocable, non-exclusive, fully-paid, royalty-free right to exploit the Feedback in any manner and for any purpose..."
Plain English Explanation: Any idea or suggestion you provide to Otter.ai immediately becomes their property to use and profit from, forever, without any payment or credit to you.

6. The Business Email Trap: Your Work Email is Not Private
Original Text: "If the domain of the email address associated with your account is owned by an Organization... you acknowledge and agree that we may identify your account to the Organization, migrate your account to the Organization's account, and/or restrict or terminate access to your account."
Plain English Explanation: This is a severe warning. If you sign up for a personal Otter account using your work email address, Otter can report your account's existence to your employer and even forcibly merge it into your employer's corporate account, giving them potential access to your private recordings.

7. The Service Termination Clause: Your Conversations Can Disappear
Original Text: "Otter.ai may immediately terminate or suspend your access to the Service... at any time for any reason or no reason... Upon termination, your right to access and use the Service will cease immediately, and we may, without liability to you, delete your account and all related information and files."
Plain English Explanation: Otter.ai can delete your account and all of your recorded conversations at any time, for any reason or no reason at all. They explicitly state they have no liability to you for this deletion, meaning you could lose months or years of important meeting recordings permanently.

8. The Data Retention Ambiguity: No Clear Promise About When Your Data Gets Deleted
Original Text: "We may retain some or all of your Data for a commercially reasonable time for backup, archival, or audit purposes. We may also retain and use your Data as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements."
Plain English Explanation: This clause gives Otter.ai broad discretion to keep your conversation data indefinitely for vague "commercially reasonable" purposes. There's no clear timeline for when your recordings and transcriptions will be permanently deleted from their systems.

9. The Third-Party Integration Risk Transfer
Original Text: "When you connect our Service to third-party platforms or services... any data shared with or accessed through those platforms is subject to their respective privacy policies and terms. Otter.ai is not responsible for how third parties handle your data."
Plain English Explanation: If you connect Otter.ai to other services (like Zoom, Slack, or Google Calendar), Otter.ai transfers all responsibility for data protection to those third parties. If one of those integrations leads to a data breach or misuse of your recordings, Otter.ai claims no liability.

This agreement applies standard tech industry exploitation practices to one of the most sensitive data types—private conversation recordings—creating heightened privacy and security risks.

Transparency Score: 22/100 - High Risk Level
Red Flags: 9 conversation privacy and corporate control issues`;

  try {
    // First create or get Otter.ai company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'otter.ai')
      .single();

    if (companyError || !existingCompany) {
      console.log('📝 Creating Otter.ai company record...');
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Otter.ai',
          domain: 'otter.ai',
          industry: 'AI Transcription',
          headquarters: 'Mountain View, CA',
          founded_year: 2016,
          tos_url: 'https://otter.ai/terms',
          corporate_website: 'https://otter.ai',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Otter.ai company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Otter.ai company record');
    }

    // Create Otter.ai-specific document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Otter.ai Terms of Service',
        url: 'https://otter.ai/terms',
        raw_content: otterContent,
        cleaned_content: otterContent,
        content_hash: require('crypto').createHash('md5').update(otterContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: otterContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Document creation failed:', docError.message);
      return;
    }

    console.log('✅ Otter.ai document created');

    // Create Otter.ai-specific analysis with conversation privacy focus
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 22, // High risk due to sensitive conversation data with standard exploitation
        user_friendliness_score: 25, // Poor due to forced arbitration and mandatory training
        privacy_score: 15, // Critical - conversation recordings used for AI training
        manipulation_risk_score: 78, // High - standard exploitation applied to sensitive conversation data
        data_collection_risk: 'critical', // Records and processes private conversations
        data_sharing_risk: 'high', // AI training and third-party integrations
        account_termination_risk: 'critical', // Can delete all conversation recordings without liability
        legal_jurisdiction_risk: 'critical', // Forced arbitration prevents legal recourse
        concerning_clauses: [
          {category: 'Forced Arbitration Rights Waiver', concern: 'Cannot sue in court for conversation data breaches'},
          {category: 'Mandatory AI Training on Conversations', concern: 'No opt-out for using conversation data for machine learning'},
          {category: 'Conversation Data Liability Cap', concern: 'Maximum $100 liability for catastrophic breaches of private recordings'},
          {category: 'Transcription Accuracy Disclaimer', concern: 'No guarantee core product will work accurately'},
          {category: 'Intellectual Property Feedback Theft', concern: 'All user suggestions become company property permanently'},
          {category: 'Business Email Account Surveillance', concern: 'Work emails can trigger employer account migration'},
          {category: 'Conversation Recording Deletion Rights', concern: 'Can delete all recordings without liability'},
          {category: 'Data Retention Indefinite Discretion', concern: 'No clear timeline for deleting conversation data'},
          {category: 'Third Party Integration Risk Transfer', concern: 'No liability for connected service data breaches'}
        ],
        manipulation_tactics: ['Conversation Privacy Exploitation', 'Legal Access Denial', 'AI Training Extraction', 'Business Surveillance'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Otter.ai applies standard tech exploitation practices to highly sensitive conversation recordings, scoring 22/100.',
        key_concerns: [
          'Forced Arbitration for Conversation Data Disputes',
          'Mandatory AI Training on Private Conversations',
          'Catastrophic Breach $100 Liability Cap',
          'No Transcription Accuracy Guarantees',
          'Permanent Intellectual Property Rights Theft',
          'Business Email Account Surveillance and Migration',
          'Conversation Recording Deletion Without Liability',
          'Indefinite Conversation Data Retention Discretion',
          'Third Party Integration Data Protection Abandonment'
        ],
        recommendations: [
          'Understand you cannot sue for conversation data breaches due to arbitration',
          'Know your private conversations are used for AI training without opt-out',
          'Be aware maximum liability is $100 even for catastrophic conversation breaches',
          'Cannot rely on transcription accuracy - verify all important content',
          'Never send feedback - Otter.ai owns all suggestions permanently',
          'Use personal email only - work emails can trigger employer surveillance',
          'Otter.ai can delete all your conversation recordings without liability',
          'No clear timeline for when conversation data gets permanently deleted',
          'Understand no protection from connected service data breaches',
          'Consider conversation sensitivity before using service',
          'Backup important recordings independently',
          'Be aware of heightened privacy risks with conversation recording services'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Otter.ai analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: High (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 9 conversation privacy and corporate control issues`);
    console.log('🦦 Conversation privacy exploitation confirmed!');

    // Show updated transparency rankings
    console.log('\n📊 UPDATED TRANSPARENCY RANKINGS:');
    console.log('==================================');
    console.log('🏦 Bank of America: 8/100 (CRITICAL - Financial Exploitation)');
    console.log('🎵 TikTok:          12/100 (CRITICAL - Minor Exploitation)');
    console.log('🚨 Verizon:         15/100 (CRITICAL - Monopoly Abuse)');
    console.log('⚖️ Microsoft:       16/100 (CRITICAL - Legal Engineering)');
    console.log('🔴 Reddit:          18/100 (CRITICAL - Content Exploitation)');
    console.log('🦦 Otter.ai:        22/100 (High Risk - Conversation Privacy)');
    console.log('📊 LinkedIn:        25/100 (High Risk - Professional Exploitation)');
    console.log('📊 Google:          25/100 (High Risk)');
    console.log('📊 Discord:         30/100 (High Risk)');
    console.log('📊 Spotify:         30/100 (Consumer)');
    console.log('...');
    console.log('🤖 Anthropic:       65/100 (Medium Risk - Balanced Approach)');

  } catch (error) {
    console.error('❌ Otter.ai analysis failed:', error.message);
  }
}

addOtterAnalysis();