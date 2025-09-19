#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addTelegramCriminalEnablementCard() {
  console.log('🚨 Adding Telegram Criminal Enablement educational context card...');

  const contextContent = `The Telegram Paradox: How Strategic Legal Omission Creates a Criminal Paradise
Educational Context Card - Systemic Criminal Enablement Analysis

The Central Irony: The features that make Telegram a haven for dissidents and privacy advocates are the exact same features that make it a paradise for predators. The minimalist, vague Terms of Service is not a document that fails to prevent criminal activity—it is the document that enables it.

The Sovereignty of the Channel: Criminal Territory Creation

The ToS gives almost absolute power to channel and group administrators. Because there is no broad content license or monitoring clause for what happens inside these spaces, they become sovereign digital territories. A scammer can create a group, invite thousands of people, and run sophisticated phishing or pump-and-dump crypto schemes with almost no platform oversight defined in the terms.

These channels become lawless territories where criminals operate with impunity, leveraging Telegram's infrastructure to reach victims at scale while the platform maintains plausible deniability through legal omission.

The Legal Black Hole: No Recourse for Victims

This is the most critical enabling mechanism. The ToS has no liability clause, no warranty disclaimer for the core service, and no defined dispute process. What does this mean for criminal operations?

Victims who lose their life savings in scams orchestrated entirely on Telegram's platform have no contractual path to hold Telegram responsible. Telegram has given itself no contractual obligation to intervene, investigate, or even respond to user complaints about financial crimes happening on its service. The risk is 100% on the user, 0% on the platform.

The Illusion of Total Privacy: Weaponized Reputation

The brand is built on "privacy," but the world-class encryption only applies to one-on-one "secret chats." The massive groups and channels where scams fester are not end-to-end encrypted. Scammers leverage the platform's reputation for privacy to lure victims into these less secure environments, creating a false sense of security that enables sophisticated fraud operations.

The Weaponized API: Industrial-Scale Criminal Operations

The ToS references the API for bots and developers. For legitimate developers, this is a great tool. For criminals, it is a force multiplier. It allows them to build automated "scam agents"—bots that can manage thousands of victims, distribute phishing links at scale, and create sophisticated illusions of legitimate financial operations.

The Neutral Protocol Defense

Telegram has chosen, through its legal and technical architecture, to be a "neutral protocol" rather than a responsible platform. By omitting standard clauses of corporate responsibility, they have created a low-consequence environment that is predictably and inevitably exploited by criminals.

The Systematic Enablement Pattern

1. Channel Sovereignty: Criminal territories with no oversight
2. Legal Black Hole: No recourse for victims
3. Privacy Illusion: False security reputation
4. API Weaponization: Industrial-scale criminal automation
5. Neutral Protocol Shield: Plausible deniability through omission

The Tragic Reality

The technology could be used for immense good, and often is. But the refusal to build accountability into the legal foundation has made it the weapon of choice for those who prey on the vulnerable. When users engage with a service with a ToS like this, they are walking into a digital jungle with no map, no guide, and no one to call if they get hurt.

This is the real cost of strategic legal omission: it creates systematic criminal enablement through designed accountability avoidance.

Educational Purpose: Understanding how strategic legal omission enables systematic criminal activity`;

  try {
    // Get the existing educational context company
    const { data: company, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'gemini-analysis.context')
      .single();

    if (companyError) {
      console.error('❌ Educational context company not found:', companyError.message);
      return;
    }

    console.log('✅ Found educational context company');

    // Create criminal enablement document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: company.id,
        document_type: 'terms_of_service',
        title: 'Telegram Paradox: Strategic Legal Omission Enables Criminal Activity',
        url: 'https://educational.context/telegram-criminal-enablement',
        raw_content: contextContent,
        cleaned_content: contextContent,
        content_hash: require('crypto').createHash('md5').update(contextContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: contextContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Context document creation failed:', docError.message);
      return;
    }

    console.log('✅ Criminal enablement document created');

    // Create educational analysis entry
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: company.id,
        transparency_score: 100, // Educational content
        user_friendliness_score: 100, // Educational resource
        privacy_score: 100, // Educational content
        manipulation_risk_score: 0, // Educational context
        data_collection_risk: 'low', // Educational content
        data_sharing_risk: 'low', // Educational content
        account_termination_risk: 'low', // Educational content
        legal_jurisdiction_risk: 'low', // Educational content
        concerning_clauses: [
          {category: 'Channel Sovereignty Enablement', concern: 'Criminal territories with no platform oversight'},
          {category: 'Legal Black Hole Creation', concern: 'No recourse pathway for crime victims'},
          {category: 'Privacy Illusion Weaponization', concern: 'False security reputation enables fraud'},
          {category: 'API Criminal Force Multiplication', concern: 'Automated tools for industrial-scale scams'},
          {category: 'Neutral Protocol Criminal Shield', concern: 'Plausible deniability through legal omission'},
          {category: 'Systematic Accountability Avoidance', concern: 'Designed criminal enablement through strategic omission'}
        ],
        manipulation_tactics: ['Criminal Enablement', 'Systematic Accountability Avoidance', 'Legal Black Hole Creation'],
        ai_model_used: 'human-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Educational analysis of how Telegram strategic legal omission systematically enables criminal activity.',
        key_concerns: [
          'Channel Criminal Territory Sovereignty',
          'Complete Victim Legal Recourse Absence',
          'Privacy Reputation Criminal Weaponization',
          'API Industrial Criminal Automation',
          'Neutral Protocol Accountability Avoidance',
          'Strategic Legal Omission Criminal Enablement'
        ],
        recommendations: [
          'Understand channel sovereignty creates criminal territories',
          'Know victims have no legal recourse for platform-enabled crimes',
          'Recognize privacy reputation is weaponized for criminal fraud',
          'Be aware APIs enable industrial-scale criminal operations',
          'Understand neutral protocol stance avoids accountability',
          'Realize strategic legal omission systematically enables criminals',
          'Approach platform with awareness of criminal enablement design',
          'Understand you are walking into digital jungle with no protection',
          'Know platform has no contractual obligation to help crime victims',
          'Recognize the tragic irony of privacy tools enabling predators'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Educational analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Criminal enablement analysis created');
    console.log(`📊 Educational Score: ${analysis.transparency_score}/100`);
    console.log(`🚨 Risk Level: Educational (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Criminal Enablement Mechanisms: 6 systematic patterns`);
    console.log('🚨 Telegram criminal enablement context card successfully added!');

    console.log('\n🚨 CRIMINAL ENABLEMENT CONTEXT ADDED:');
    console.log('====================================');
    console.log('📱 Focus: Telegram Strategic Legal Omission');
    console.log('🎯 Impact: Systematic Criminal Enablement');
    console.log('⚖️ Pattern: Legal Black Hole Creation');
    console.log('💡 Key Insight: Privacy Tools Become Predator Weapons');

  } catch (error) {
    console.error('❌ Criminal enablement card creation failed:', error.message);
  }
}

addTelegramCriminalEnablementCard();