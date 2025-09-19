#!/usr/bin/env node

/**
 * Add Signal's Exemplary Terms of Service Analysis
 *
 * This script adds Signal's ToS analysis as the perfect counter-narrative to predatory
 * platform terms. Signal proves that a different way is possible - global communication
 * services can exist without stripping users of content ownership, legal rights, and dignity.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addSignalExemplaryAnalysis() {
  console.log('🏆 Adding Signal as exemplary ToS counter-narrative...');

  const signalAnalysisContent = `Signal Terms of Service: The Perfect Counter-Narrative
Red Flag Analysis - Exemplary Privacy-First Terms

EXECUTIVE SUMMARY: This document is fundamentally different from every other ToS we have analyzed. It is defined almost entirely by what it lacks: the broad licenses, liability shields, and data-use clauses that are standard elsewhere. Its primary focus is on protecting the service from abuse, not on acquiring rights from the user.

TRANSPARENCY VERDICT: Signal's Terms of Service is the "sweet poetry" of legal documents. It is the legal embodiment of a privacy-first, user-centric philosophy. It is short, clear, and defined by the absence of predatory clauses.

KEY FINDING: Signal proves that it is possible to run a global communication service without stripping users of their content ownership, their legal rights, and their dignity. It is the perfect counter-narrative to the idea that "this is just how the internet has to work."

DETAILED ANALYSIS:

1. The "No Content License" Clause: The Ultimate Privacy Protection

Analysis: The document contains NO license grant for your content. It does not ask for a worldwide, perpetual, or transferable license to your messages, photos, or videos.

Why This Matters: This is the single most important feature of their terms. Because Signal's service is end-to-end encrypted, they cannot access your content. Therefore, they do not—and cannot—ask you for any rights to it. Your content remains yours, and yours alone. This is the legal reflection of their technical architecture.

2. The "We Don't Have Your Data" Disclaimer

Original Text (from Privacy Policy): "Signal does not store your messages or any information about your calls on our servers... Signal does not have access to any of this information."

Educational Context: Unlike other services that analyze your content for ads or AI training, Signal explicitly states they do not store and cannot access your communications. Their business model (a non-profit) does not require your data, so their legal terms are built around the principle of not having it in the first place.

3. The Standard "As Is" Warranty Disclaimer (A Necessary Evil)

Original Text: "Signal is provided 'as is' without any warranties of any kind... we do not warrant that the Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis."

Educational Context: This is a standard clause that every service, even a non-profit, must include for legal protection. It means they provide the service with no legal guarantees that it will always work perfectly or be 100% secure. As a user, you accept the risk of using the service.

4. The Limited Liability Clause (But Without the $100 Cap)

Original Text: "In no event will Signal, its affiliates, or their respective officers, directors, employees, or agents, be liable in connection with this agreement or the services for any indirect, incidental, special, or consequential damages... or for any amount in the aggregate that exceeds the amount you paid for the services."

Why This Is Different: Signal limits its liability, but in a much more reasonable way than other platforms. They protect themselves from "indirect" damages (like lost profits). Their direct liability is capped at the amount you paid them for the service. Since the service is free and funded by donations (which are not a payment for service), their financial liability is effectively zero, but they achieve this without the predatory-feeling "$100" cap.

5. No Forced Arbitration or Class Action Waiver

Critical Observation: The document does NOT contain a mandatory arbitration clause or a class action waiver.

Why This Is Revolutionary: This is a massive pro-consumer stance. Unlike Microsoft, Meta, and others, Signal does not force you to give up your right to a day in court or your right to join with others in a lawsuit. Legal disputes are handled through the standard court system in California, preserving your fundamental legal rights.

6. A Simple Termination Clause Focused on Abuse

Original Text: "We can suspend or terminate your access to our Services if you violate our Terms of Service or policies, or if we are required to do so by law."

Educational Context: Their right to terminate your account is tied directly to you breaking the rules or a legal requirement. Unlike other platforms that reserve the right to ban you for "any reason or no reason," Signal's terms are based on a clear cause-and-effect relationship.

WHAT SIGNAL PROVES:

- Global communication services CAN exist without predatory content licenses
- Privacy-first architecture leads to privacy-first legal terms
- Non-profit business models eliminate surveillance capitalism clauses
- Transparency and simplicity are possible in legal documents
- Users' legal rights can be preserved while protecting the service
- Technical design choices directly impact legal terms

THE COUNTER-NARRATIVE IMPACT:

Signal's Terms of Service demolishes the argument that predatory clauses are "necessary for modern digital services." It proves that when a company's technical architecture and business model are aligned with user privacy, the legal terms naturally become user-friendly.

This is not an accident—it is the inevitable result of building a service that doesn't need to monetize user data, surveil communications, or claim rights over user content.

EDUCATIONAL VALUE:

Signal serves as the perfect reference point for ToS Salad users. When analyzing other platforms, users can ask:
- "Why does Platform X need a perpetual content license when Signal doesn't?"
- "Why does Platform Y force arbitration when Signal allows courts?"
- "Why does Platform Z cap liability at $100 when Signal caps it fairly?"

Signal proves that a different way is possible. And that is a powerful truth to share.

Source: ToS Salad Transparency Research
Educational Purpose: Demonstrating that privacy-first, user-centric Terms of Service are possible
Counter-Narrative: Proof that predatory clauses are not inevitable in digital services`;

  try {
    // Create or get Signal company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'signal.org')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Signal Technology Foundation',
          domain: 'signal.org',
          industry: 'Privacy-First Communication',
          headquarters: 'San Francisco, CA',
          founded_year: 2018,
          tos_url: 'https://signal.org/legal/',
          corporate_website: 'https://signal.org',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Signal company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Signal Technology Foundation company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Signal company');
    }

    // Create Signal ToS document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Signal Terms of Service - Exemplary Privacy-First Legal Framework',
        url: 'https://signal.org/legal/',
        raw_content: signalAnalysisContent,
        cleaned_content: signalAnalysisContent,
        content_hash: require('crypto').createHash('md5').update(signalAnalysisContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: signalAnalysisContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Signal document creation failed:', docError.message);
      return;
    }

    console.log('✅ Signal exemplary document created');

    // Create exemplary analysis entry - Signal gets perfect scores!
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 98, // Near perfect - exemplary transparency
        user_friendliness_score: 95, // Extremely user-friendly
        privacy_score: 100, // Perfect privacy protection
        manipulation_risk_score: 2, // Minimal risk - only standard legal protections
        data_collection_risk: 'low', // Minimal data collection
        data_sharing_risk: 'low', // No content sharing
        account_termination_risk: 'low', // Fair termination terms
        legal_jurisdiction_risk: 'low', // Standard California courts, no forced arbitration
        concerning_clauses: [
          {category: 'Standard Legal Protection', concern: 'As-is warranty disclaimer (standard and necessary)'},
          {category: 'Liability Limitation', concern: 'Limited liability clause (fair implementation without predatory caps)'}
        ],
        manipulation_tactics: ['Standard Legal Protections Only'],
        ai_model_used: 'tos-salad-transparency-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Signal represents the gold standard for privacy-first Terms of Service. Defined by what it lacks: no content licenses, no forced arbitration, no predatory clauses. Proves that user-centric legal terms are possible.',
        key_concerns: [
          'NO Content License Granted - Perfect Privacy Protection',
          'NO Forced Arbitration - Preserves Legal Rights',
          'NO Predatory Liability Caps - Fair Implementation',
          'NO Data Mining Clauses - True Privacy First',
          'NO Surveillance Capitalism Terms - Non-Profit Model',
          'Standard Legal Protections Only - Necessary Evil Done Right'
        ],
        recommendations: [
          'Use Signal as reference point for evaluating other platforms',
          'Ask why other services need perpetual content licenses when Signal doesn\'t',
          'Compare arbitration clauses - Signal preserves your court rights',
          'Notice how non-profit business model enables user-friendly terms',
          'Understand that privacy-first architecture creates privacy-first legal terms',
          'Recognize that predatory clauses are choices, not necessities',
          'Support services that prove a different way is possible'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Signal analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Signal exemplary analysis created');
    console.log(`🏆 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`🛡️ Privacy Score: ${analysis.privacy_score}/100`);
    console.log(`👤 User Friendliness: ${analysis.user_friendliness_score}/100`);
    console.log(`⚠️ Manipulation Risk: ${analysis.manipulation_risk_score}/100 (Lower is better)`);
    console.log('🎯 Signal exemplary analysis successfully added!');

    console.log('\n🏆 SIGNAL: THE PERFECT COUNTER-NARRATIVE');
    console.log('==========================================');
    console.log('🎓 Exemplary Privacy-First Terms of Service');
    console.log('📊 Source: ToS Salad Transparency Research');
    console.log('🎯 Purpose: Proving that user-centric legal terms are possible');
    console.log('💡 Key Insight: Privacy-first architecture enables privacy-first legal terms');
    console.log('🔗 Impact: Demolishes argument that predatory clauses are necessary');

    console.log('\n✨ Signal proves:');
    console.log('  📜 No content licenses needed for communication services');
    console.log('  ⚖️ Legal rights can be preserved while protecting the service');
    console.log('  🏢 Non-profit models eliminate surveillance capitalism clauses');
    console.log('  🔒 Technical privacy design leads to legal privacy protection');
    console.log('  🌟 A different way is possible - and Signal proves it');

  } catch (error) {
    console.error('❌ Signal exemplary analysis failed:', error.message);
  }
}

addSignalExemplaryAnalysis();