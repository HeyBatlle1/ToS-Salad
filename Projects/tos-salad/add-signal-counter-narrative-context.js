#!/usr/bin/env node

/**
 * Add Signal Counter-Narrative Educational Context
 *
 * This script adds educational context about how Signal proves that
 * predatory ToS clauses are not inevitable - a different way is possible.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addSignalCounterNarrativeContext() {
  console.log('🌟 Adding Signal counter-narrative educational context...');

  const contextContent = `Signal: The Perfect Counter-Narrative - Why "Necessary" Predatory Clauses Are Actually Choices
Educational Context Card - ToS Salad Transparency Research

THE REVELATION: Signal's Terms of Service demolishes the most persistent myth in digital platforms: that predatory clauses are "necessary for modern digital services."

THE ARGUMENT WE CONSTANTLY HEAR:
"We need broad content licenses to make the service work."
"Arbitration clauses are standard practice."
"Liability caps protect small companies."
"Data collection is essential for functionality."
"This is just how the internet has to work."

THE SIGNAL REALITY CHECK:

Signal operates a global communication service used by millions, including journalists, activists, and everyday users. It provides text messaging, voice calls, video calls, group chats, and file sharing. It works reliably across multiple platforms and countries.

And Signal does ALL of this without:
❌ Perpetual content licenses
❌ Forced arbitration clauses
❌ Predatory liability caps
❌ Data mining permissions
❌ Surveillance capitalism terms
❌ Algorithmic manipulation rights

HOW SIGNAL PROVES THE ALTERNATIVES:

1. CONTENT OWNERSHIP MODEL
• Other Platforms: "We need a perpetual, worldwide license to your content to make our service work."
• Signal Reality: Zero content license. End-to-end encryption means they cannot access your content, so they cannot and do not claim rights to it.
• The Lesson: When your technical architecture respects privacy, your legal terms naturally respect ownership.

2. DISPUTE RESOLUTION MODEL
• Other Platforms: "Arbitration is faster and cheaper for everyone."
• Signal Reality: Standard court system in California. Preserves your fundamental right to a jury trial and class action lawsuits.
• The Lesson: Companies that aren't planning to harm users don't need to hide from courts.

3. LIABILITY LIMITATION MODEL
• Other Platforms: "$100 maximum liability no matter how much we damage you."
• Signal Reality: Liability capped at amount paid for service (which is $0 since it's free), but achieved without predatory language.
• The Lesson: Fair liability protection doesn't require insulting damage caps.

4. BUSINESS MODEL IMPACT
• Other Platforms: Surveillance capitalism requires legal permission to monetize your data, attention, and content.
• Signal Reality: Non-profit funded by donations. No need to monetize users means no need for predatory legal terms.
• The Lesson: Business model choice directly determines legal terms necessity.

THE TECHNICAL-LEGAL ALIGNMENT:

Signal's Terms of Service is the legal reflection of their technical choices:
• End-to-end encryption → No content license needed
• Minimal metadata storage → No data sharing clauses
• Non-profit model → No monetization permissions required
• Open source code → No hidden functionality to legally cover

WHAT THIS MEANS FOR EVERY OTHER PLATFORM:

When Google, Meta, Microsoft, or TikTok claims they "need" predatory clauses, Signal proves they're making a choice, not responding to a necessity.

Every predatory clause is a deliberate decision that serves the company's business model, not a technical requirement for digital services.

THE QUESTIONS SIGNAL EMPOWERS YOU TO ASK:

• "Why does Platform X need a perpetual content license when Signal doesn't?"
• "Why does Platform Y force arbitration when Signal allows courts?"
• "Why does Platform Z cap liability at $100 when Signal caps it fairly?"
• "Why does Platform A collect metadata when Signal proves you don't need to?"
• "Why does Platform B need AI training rights when Signal operates without them?"

SIGNAL AS REFERENCE ARCHITECTURE:

Signal serves as proof-of-concept that user-centric digital services are possible:
✅ Global scale communication ✅ Reliable functionality ✅ Privacy by design ✅ User-friendly legal terms

THE COUNTER-NARRATIVE POWER:

Every time a platform claims predatory terms are "industry standard" or "technically necessary," point to Signal.

Every time someone says "this is just how the internet works," point to Signal.

Every time a company argues they "have to" strip your rights, point to Signal.

Signal is living proof that another way is possible.

THE BROADER IMPLICATIONS:

If Signal can operate a global communication platform with user-centric terms, then:
• Social media platforms choose to claim content rights
• Search engines choose to collect excessive data
• Cloud services choose predatory liability caps
• AI companies choose to train on user content without consent

These are business model choices, not technical necessities.

SIGNAL'S GIFT TO DIGITAL RIGHTS:

Signal's greatest contribution may not be their secure messaging, but their demonstration that user-centric business models enable user-centric legal terms.

They prove that when you build technology to serve users rather than exploit them, the legal framework naturally aligns with user interests.

This is the counter-narrative that every digital rights advocate needs: concrete proof that the current state of predatory Terms of Service is not inevitable.

A different way is possible. Signal proves it every day.

Source: ToS Salad Educational Research
Purpose: Demonstrating that predatory clauses are choices, not necessities
Impact: Empowering users to demand better terms by proving alternatives exist`;

  try {
    // Get or create Signal Counter-Narrative educational company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'tos-salad.signal.counter-narrative.education')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'ToS Salad: Signal Counter-Narrative Education',
          domain: 'tos-salad.signal.counter-narrative.education',
          industry: 'ToS Analysis & Counter-Narrative Education',
          headquarters: 'ToS Salad Educational Resource',
          founded_year: 2024,
          tos_url: 'https://tos-salad.signal.counter-narrative.education',
          corporate_website: 'https://tos-salad.signal.counter-narrative.education',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Counter-narrative company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Signal counter-narrative educational company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing counter-narrative educational company');
    }

    // Create educational document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'ToS Salad - Signal Counter-Narrative: Why Predatory Clauses Are Choices',
        url: 'https://tos-salad.signal.counter-narrative.education',
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
      console.error('❌ Counter-narrative document creation failed:', docError.message);
      return;
    }

    console.log('✅ Signal counter-narrative document created');

    // Create educational analysis entry
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 100, // Perfect transparency - educational content
        user_friendliness_score: 100, // Educational resource
        privacy_score: 100, // Privacy education
        manipulation_risk_score: 0, // Educational context, no manipulation
        data_collection_risk: 'low', // Educational content
        data_sharing_risk: 'low', // Educational content
        account_termination_risk: 'low', // Educational content
        legal_jurisdiction_risk: 'low', // Educational content
        concerning_clauses: [
          {category: 'Educational Insight', concern: 'Predatory clauses are business model choices, not technical necessities'},
          {category: 'Signal Proof', concern: 'Signal operates globally without content licenses, forced arbitration, or data mining'},
          {category: 'Technical-Legal Alignment', concern: 'Privacy-first architecture enables privacy-first legal terms'},
          {category: 'Business Model Impact', concern: 'Non-profit model eliminates need for surveillance capitalism terms'},
          {category: 'Counter-Narrative Power', concern: 'Signal proves alternatives to predatory terms are possible'},
          {category: 'User Empowerment', concern: 'Signal enables users to demand better terms by proving alternatives exist'}
        ],
        manipulation_tactics: ['ToS Educational Framework - Counter-Narrative'],
        ai_model_used: 'tos-salad-counter-narrative-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Signal demolishes the myth that predatory ToS clauses are necessary for digital services. Proves that user-centric technical architecture and business models enable user-centric legal terms.',
        key_concerns: [
          'Myth Demolition: Predatory Clauses Are NOT Necessary',
          'Signal Proof: Global Service Without Content Licenses',
          'Technical-Legal Alignment: Privacy Design → Privacy Terms',
          'Business Model Choice: Non-Profit → User-Centric Terms',
          'Counter-Narrative Evidence: Alternatives ARE Possible',
          'User Empowerment: Demand Better by Pointing to Signal'
        ],
        recommendations: [
          'Use Signal as reference when evaluating other platforms',
          'Ask why platforms need predatory clauses when Signal doesn\'t',
          'Understand that surveillance capitalism drives predatory terms',
          'Recognize technical architecture choices impact legal terms',
          'Support services that prove user-centric models work',
          'Challenge "industry standard" arguments with Signal counter-evidence',
          'Demand transparency about why each predatory clause is "necessary"'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Counter-narrative analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Signal counter-narrative analysis created');
    console.log(`📊 Educational Score: ${analysis.transparency_score}/100`);
    console.log(`🎯 Counter-Narrative Impact: Maximum`);
    console.log(`🌟 Signal proves: A different way is possible`);
    console.log('🎓 Counter-narrative context successfully added!');

    console.log('\n🌟 SIGNAL COUNTER-NARRATIVE EDUCATION COMPLETE:');
    console.log('===============================================');
    console.log('🎓 Counter-Narrative Education Added');
    console.log('📊 Source: ToS Salad Educational Research');
    console.log('🎯 Purpose: Proving predatory clauses are choices');
    console.log('💡 Key Insight: Signal demolishes "necessary evil" myth');
    console.log('🔗 Impact: Empowers users to demand better terms');

    console.log('\n✨ Now users can ask every platform:');
    console.log('  🤔 "Why do you need this when Signal doesn\'t?"');
    console.log('  📜 "Why perpetual content license when Signal has none?"');
    console.log('  ⚖️ "Why forced arbitration when Signal allows courts?"');
    console.log('  💰 "Why $100 liability cap when Signal caps fairly?"');
    console.log('  🌍 "Signal proves a different way is possible"');

  } catch (error) {
    console.error('❌ Signal counter-narrative creation failed:', error.message);
  }
}

addSignalCounterNarrativeContext();