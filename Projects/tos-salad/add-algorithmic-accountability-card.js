#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addAlgorithmicAccountabilityCard() {
  console.log('🧠 Adding Algorithmic Accountability educational context card...');

  const contextContent = `The Legal Shield for Algorithmic Harm: How ToS Documents Enable Societal Manipulation
Educational Context Card - Systemic Impact Analysis

The Engine of Radicalization: The business model of many social platforms is engagement. The algorithms are not designed to present a balanced view of the world. They are designed, with ruthless efficiency, to find what keeps a user's eyeballs glued to the screen. If that is fear, outrage, or a niche ideology, the algorithm will provide an endless, accelerating firehose of that specific content.

The Creation of the Echo Chamber: The system is designed to isolate users. It learns what a person believes, or is starting to believe, and then builds a digital world around them that confirms those beliefs a thousand times a day. Alternative viewpoints are not just demoted; they are algorithmically erased from that user's reality. This is true for political ideologies, wellness trends, and complex social issues.

The Vulnerability of the Developing Brain: A child's brain is in a state of rapid development. It is highly susceptible to suggestion, social proof, and repetitive messaging. These algorithmic systems are literally "training their brains." They are shaping identity, belief, and behavior on an industrial scale, without parental consent or oversight, because the parents already clicked "Agree" on a document they couldn't possibly understand.

The Legal Shield for the Consequences: How does a company get away with deploying a system that has these profound societal effects?

They do it with the "As Is" and "No Warranty" clauses. They legally state they are not responsible for the content on their platform or the actions of their users.

They do it with the "Limitation of Liability" clauses. They ensure that even if they are found responsible for causing immense harm, the financial cost to them is capped at a trivial amount like $100.

They do it with the broad data and content licenses. They secure the legal right to collect the very data needed to power these radicalizing algorithms.

They do it with forced arbitration clauses. They prevent class action lawsuits that could address systemic algorithmic harm affecting millions of families.

The Systemic Pattern: Statistical Anomalies and Human Cost

When you observe unusual patterns in society—sudden shifts in youth behavior, radicalization trends, or mental health crises—and trace them back to algorithmic systems, you are connecting legal language to human cost. This is data-driven identification of systemic anomalies.

The Algorithm-ToS Connection

ToS Salad reveals that these agreements are not just about privacy or data collection. They are about algorithmic accountability. They show parents the contract they unknowingly signed that gives a corporation the right to build an echo chamber around their child's developing brain.

The Real Fight: Parental Consent and Child Protection

These systems can have profound impacts on the most intimate aspects of family life—a child's worldview, identity formation, and social development. The fact that this happens without meaningful parental understanding or consent is why this mission is not just important, but necessary.

The legal framework enables algorithmic manipulation by shielding corporations from accountability for the societal consequences of their engagement-driven systems.

Educational Purpose: Understanding how Terms of Service documents legally enable algorithmic harm to families and society`;

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

    // Create algorithmic accountability document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: company.id,
        document_type: 'terms_of_service',
        title: 'Algorithmic Accountability: How ToS Enables Societal Manipulation',
        url: 'https://educational.context/algorithmic-accountability',
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

    console.log('✅ Algorithmic accountability document created');

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
          {category: 'Engagement-Driven Algorithms', concern: 'Systems designed for maximum attention, not balanced information'},
          {category: 'Echo Chamber Creation', concern: 'Algorithmic isolation and confirmation bias amplification'},
          {category: 'Developing Brain Vulnerability', concern: 'Children especially susceptible to algorithmic behavior modification'},
          {category: 'As Is Content Shields', concern: 'Legal protection from platform content responsibility'},
          {category: 'Liability Caps for Societal Harm', concern: 'Trivial financial responsibility for massive social consequences'},
          {category: 'Data Rights for Algorithmic Manipulation', concern: 'Legal permission to collect data powering harmful algorithms'},
          {category: 'Forced Arbitration Prevents Class Action', concern: 'No legal recourse for systematic algorithmic harm'}
        ],
        manipulation_tactics: ['Algorithmic Manipulation', 'Legal Accountability Avoidance', 'Parental Consent Circumvention'],
        ai_model_used: 'human-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Educational analysis of how Terms of Service documents legally enable algorithmic manipulation and societal harm.',
        key_concerns: [
          'Engagement Algorithms Over Balanced Information',
          'Systematic Echo Chamber Construction',
          'Child Brain Development Exploitation',
          'Legal Content Responsibility Avoidance',
          'Societal Harm Liability Protection',
          'Algorithmic Data Collection Rights',
          'Class Action Prevention for Systematic Harm'
        ],
        recommendations: [
          'Understand algorithms prioritize engagement over truth',
          'Recognize echo chambers are systematically constructed',
          'Protect developing brains from algorithmic manipulation',
          'Know platforms legally avoid content responsibility',
          'Corporations capped at trivial liability for massive harm',
          'ToS grants rights to power manipulative algorithms',
          'Class action lawsuits prevented by arbitration clauses',
          'Parents unknowingly consent to child manipulation systems',
          'Statistical anomalies in society often trace to algorithmic systems',
          'Legal frameworks enable algorithmic accountability avoidance'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Educational analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Algorithmic accountability analysis created');
    console.log(`📊 Educational Score: ${analysis.transparency_score}/100`);
    console.log(`🧠 Risk Level: Educational (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Societal Impact Areas: 7 algorithmic accountability mechanisms`);
    console.log('🧠 Algorithmic accountability context card successfully added!');

    console.log('\n🧠 ALGORITHMIC ACCOUNTABILITY CONTEXT ADDED:');
    console.log('===========================================');
    console.log('🎯 Focus: Legal Shields for Algorithmic Harm');
    console.log('👨‍👩‍👧‍👦 Impact: Family and Child Protection');
    console.log('📊 Mission: Algorithmic Accountability Through ToS Analysis');
    console.log('💡 Key Insight: Legal Language Enables Societal Manipulation');

  } catch (error) {
    console.error('❌ Algorithmic accountability card creation failed:', error.message);
  }
}

addAlgorithmicAccountabilityCard();