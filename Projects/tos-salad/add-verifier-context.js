#!/usr/bin/env node

/**
 * Add The Verifier Educational Context to ToS Salad Database
 *
 * This script integrates The Verifier's educational content into the existing
 * ToS Salad database structure, maintaining consistency with the Gemini analysis format.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addVerifierContext() {
  console.log('🛡️ Adding The Verifier educational context to ToS Salad...');

  const contextContent = `The Verifier: Reforging Deception Tools into Public Shields
Educational Context Card - Integrated Content Verification System

Mission Statement: This is not just a feature; it's a statement. It takes the very tools used for deception and reforges them into shields for the public.

The Digital Literacy Crisis

In an era where AI-generated content is indistinguishable from reality, where deepfakes spread faster than truth, and where digital manipulation is democratized, users are defenseless. They share content without understanding what information it contains, post on platforms without knowing what rights they're surrendering, and navigate digital spaces without the tools that the platforms themselves use to monitor them.

The Verifier addresses this asymmetric information problem by providing users with the same analytical capabilities that platforms have, but in service of transparency rather than control.

Core Functions of The Verifier Agent

1. AI-Generated Media Detection (The Deepfake Detector)
   - Analyzes pixels, compression artifacts, and subtle inconsistencies
   - Provides AI Genesis Score (0-100% probability of AI origin)
   - Uses traffic-light system: Green (likely authentic), Yellow (signs of editing), Red (high probability AI)
   - Never claims absolute certainty - provides evidence and probabilities

2. Digital Provenance Check (Reverse Image Search on Steroids)
   - Scans internet for other appearances of the media
   - Provides Source History report showing first online appearance
   - Helps debunk false context (e.g., "local tragedy" video from different country)
   - Identifies stolen or misrepresented content

3. Metadata Analysis (The Digital Fingerprints)
   - Examines hidden EXIF data within files
   - Reveals camera information, timestamps, GPS locations, editing software
   - Includes critical warning: metadata easily faked and often stripped
   - Focuses on privacy implications rather than absolute proof

4. Link & File Safety Scan (The Phishing Detector)
   - Scans URLs for malicious domains and phishing attempts
   - Analyzes files for hidden executable code
   - Checks against known malicious patterns
   - Provides clear safety verdicts with recommendations

Integration with ToS Salad Mission

The Verifier perfectly extends ToS Salad's transparency mission:

Legal Code Analysis → Digital Content Analysis
- ToS Salad analyzes the legal code that governs our digital lives
- The Verifier analyzes the digital content itself
- Together they provide complete transparency about digital platform interactions

Cross-Platform Risk Assessment:
- Understand how verified content risks relate to specific platform ToS
- Identify potential violations before sharing content
- Correlate content characteristics with platform policies

Educational Transparency:
- No absolute certainty claims - always provides probabilities
- Complete method transparency - all techniques documented
- Privacy paramount - files deleted immediately after analysis

The Asymmetric Information Solution

Platforms have sophisticated tools to analyze user content:
- AI detection algorithms
- Reverse image search capabilities
- Metadata extraction systems
- Threat detection mechanisms

Users have historically had none of these tools. The Verifier changes this dynamic.

This levels the playing field by giving users insight into:
- What information their content actually contains
- How platforms might analyze their submissions
- What risks they face when sharing content
- How to make informed decisions about digital platform use

Ethical Guardrails

1. No Absolute Certainty Principle
   - Always presents probabilities, not verdicts
   - Empowers critical thinking rather than replacing it
   - Example: "98% probability of AI generation" not "This is a deepfake"

2. Privacy Paramount Policy
   - All files analyzed in secure, isolated environment
   - Permanent deletion immediately after analysis
   - No storage of user content or identifying information

3. Complete Transparency Commitment
   - All analysis methods documented and explained
   - Data sources and APIs clearly identified
   - Open about limitations and potential errors

The Statement This Makes

By integrating The Verifier into ToS Salad, we make a clear statement:

"The tools of deception can be reforged into shields of protection. The same technologies used to manipulate and mislead can be turned toward transparency and truth. We refuse to accept an information asymmetry where platforms have all the analytical power and users have none."

This is digital literacy as resistance. This is transparency as empowerment.

Source: The Verifier Integration Team
Educational Purpose: Understanding content verification in the context of digital platform transparency`;

  try {
    // Get or create The Verifier educational company record with clear ToS labeling
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'tos-salad.verifier.education')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'ToS Salad: The Verifier Educational Module',
          domain: 'tos-salad.verifier.education',
          industry: 'ToS Analysis & Content Verification Education',
          headquarters: 'ToS Salad Educational Resource',
          founded_year: 2024,
          tos_url: 'https://tos-salad.verifier.education/context',
          corporate_website: 'https://tos-salad.verifier.education',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Verifier company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ The Verifier educational company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Verifier educational company');
    }

    // Create educational document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'ToS Salad - The Verifier: Reforging Deception Tools into Public Shields',
        url: 'https://tos-salad.verifier.education/context',
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
      console.error('❌ Verifier document creation failed:', docError.message);
      return;
    }

    console.log('✅ The Verifier educational document created');

    // Create educational analysis entry
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 100, // Perfect transparency - educational content
        user_friendliness_score: 100, // Educational resource
        privacy_score: 100, // Privacy paramount principle
        manipulation_risk_score: 0, // Educational context, no manipulation
        data_collection_risk: 'low', // Educational content
        data_sharing_risk: 'low', // Educational content
        account_termination_risk: 'low', // Educational content
        legal_jurisdiction_risk: 'low', // Educational content
        concerning_clauses: [
          {category: 'Digital Literacy Crisis', concern: 'Users lack tools to analyze content they share on platforms'},
          {category: 'Asymmetric Information Problem', concern: 'Platforms have analytical capabilities users don\'t'},
          {category: 'AI Content Detection', concern: 'Need to identify AI-generated media for transparency'},
          {category: 'Digital Provenance', concern: 'Understanding content source and context is critical'},
          {category: 'Metadata Privacy', concern: 'Hidden data in files can expose private information'},
          {category: 'Security Threats', concern: 'Malicious links and files need identification'},
          {category: 'Platform Policy Correlation', concern: 'Content risks must align with platform ToS understanding'}
        ],
        manipulation_tactics: ['ToS Educational Framework'],
        ai_model_used: 'tos-salad-verifier-system',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'The Verifier integrates content verification into ToS Salad to address digital literacy crisis and information asymmetry between platforms and users.',
        key_concerns: [
          'Digital Literacy Crisis: Users Lack Analytical Tools',
          'Asymmetric Information: Platforms vs Users Capabilities',
          'AI Content Detection: Transparency in AI-Generated Media',
          'Digital Provenance: Understanding Content Source and Context',
          'Metadata Privacy: Hidden Information in Digital Files',
          'Security Threats: Malicious Content Identification',
          'Platform Integration: Content Risks vs ToS Policies'
        ],
        recommendations: [
          'Use The Verifier before sharing content on any platform',
          'Understand content verification as digital literacy skill',
          'Correlate verification results with platform ToS policies',
          'Never rely on single verification method - use all modules',
          'Remember: probabilities not certainties - think critically',
          'Protect privacy by understanding metadata implications',
          'Verify links and files before opening or sharing',
          'Use transparency tools to resist information asymmetry'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Verifier analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ The Verifier educational analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`🛡️ Privacy Score: ${analysis.privacy_score}/100`);
    console.log(`🎓 Educational Modules: 7 core verification concepts`);
    console.log('🎯 The Verifier context successfully integrated!');

    console.log('\n🛡️ THE VERIFIER INTEGRATION COMPLETE:');
    console.log('====================================');
    console.log('🎓 Content Verification Education Added');
    console.log('📊 Source: The Verifier Integration System');
    console.log('🎯 Purpose: Digital Literacy and Transparency');
    console.log('💡 Key Insight: Reforge Deception Tools into Public Shields');
    console.log('🔗 Integration: Content Verification + ToS Analysis');

    console.log('\n✨ ToS Salad now provides:');
    console.log('  📜 Terms of Service transparency (original)');
    console.log('  🛡️ Content verification capabilities (new)');
    console.log('  🔗 Cross-platform risk analysis (integrated)');
    console.log('  🎓 Educational context for both (unified)');

  } catch (error) {
    console.error('❌ The Verifier context creation failed:', error.message);
  }
}

addVerifierContext();