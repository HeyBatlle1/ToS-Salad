#!/usr/bin/env node

/**
 * Add Chase Bank's Predatory Terms of Use Analysis
 *
 * This script adds Chase Bank's ToS analysis as a textbook example of corporate
 * surveillance capitalism legal frameworks designed to maximize institutional power
 * and minimize institutional risk while stripping users of fundamental rights.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addChasePredatoryAnalysis() {
  console.log('🚩 Adding Chase Bank predatory ToS analysis...');

  const chaseAnalysisContent = `Chase Bank Terms of Use: Textbook Corporate Predation
Red Flag Analysis - Surveillance Capitalism Legal Framework

EXECUTIVE SUMMARY: This document governs the use of Chase's public websites and digital platforms. It is designed to aggressively limit the bank's liability, assert ownership over user-submitted content, and force users into a binding arbitration process that strips them of their fundamental legal rights.

TRANSPARENCY VERDICT: Chase Bank's Terms of Use is a masterclass in corporate legal predation. Every clause is designed to maximize Chase's power while minimizing their responsibility and stripping customers of legal recourse.

KEY FINDING: This analysis is complete evidence of surveillance capitalism's legal infrastructure - a system designed to extract maximum value from users while providing them with minimal protection or rights.

DETAILED PREDATORY CLAUSE ANALYSIS:

1. The Forced Arbitration Gauntlet: You Forfeit Your Right to a Day in Court

Original Text: "YOU and WE AGREE TO ARBITRATE - ALL DISPUTES... 'Dispute' means any claim, controversy or dispute... 'Dispute' is to be given the broadest possible meaning that will be enforced... YOU ARE WAIVING YOUR RIGHT TO A JURY TRIAL AND YOUR RIGHT TO BRING A LAWSUIT IN COURT... YOU ARE WAIVING YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT."

Predatory Analysis: This is the most critical and user-hostile clause. By using their website, you permanently give up your right to sue Chase in a traditional court of law before a judge or jury. You are also explicitly forbidden from joining with other customers in a class-action lawsuit. You are forced into a private, binding arbitration system for nearly any dispute, which is a process that overwhelmingly favors the corporation and severely limits your legal power.

Why This Is Predatory: Forced arbitration systematically favors corporations. Arbitrators are often repeat players with banks, creating financial incentives to rule in favor of the institution that provides them business. Class action waivers prevent customers from pooling resources to challenge systemic abuse.

2. The "Submissions" Clause: Your Ideas and Content Become Their Property, For Free

Original Text: "...any remarks, suggestions, ideas, graphics, or other information that you communicate to us through this site... become our property. This means that... we don't have to treat any such submission as confidential. You can't sue us for using the ideas you submit. If we use them, or anything like them, we don't have to pay you or anyone else for them. We will have the exclusive ownership of all present and future rights to submissions of any kind."

Predatory Analysis: This is an incredibly aggressive "your ideas are ours" clause. Any suggestion, idea, or feedback you provide to Chase immediately becomes their exclusive property. They can use it, patent it, build products from it, and profit from it, and they explicitly state that they owe you nothing and you cannot sue them for it. You are effectively providing them with free consulting and intellectual property.

Why This Is Predatory: This goes far beyond protecting the company from frivolous lawsuits. It's intellectual property theft disguised as legal protection. Users who provide feedback to improve services become unpaid consultants whose ideas can be monetized without compensation.

3. The Absolute Liability Shield: Zero Responsibility for Any Damages

Original Text: "WE WILL NOT BE RESPONSIBLE FOR ANY DAMAGES OR INJURIES... INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES... THESE INCLUDE (BUT ARE NOT LIMITED TO) DAMAGES OR INJURY CAUSED BY ANY... FAILURE OF PERFORMANCE, ERROR, OMISSION, INTERRUPTION, DEFECT, DELAY... COMPUTER VIRUS, OR LINE FAILURE."

Predatory Analysis: This is an ironclad disclaimer of responsibility. It states that Chase will not be held legally or financially responsible for any damages you suffer from using their website, for any reason. Even if a flaw, error, or computer virus on their own site causes you direct financial loss or damages your computer, this clause is designed to ensure they cannot be held liable.

Why This Is Predatory: This attempts to eliminate all accountability for negligence. Even if Chase's own errors cause financial harm to customers, they claim no responsibility. This shifts all risk to users while Chase retains all control.

4. The "As Is" Warranty Disclaimer: The Site is Not Guaranteed to be Safe or Accurate

Original Text: "THE MATERIALS IN OUR SITES ARE PROVIDED 'AS IS'... THIS MEANS THAT WE DISCLAIM ALL EXPRESS AND IMPLIED WARRANTIES... THIS INCLUDES BUT IS NOT LIMITED TO WARRANTIES... THAT THE SITE IS OF ANY PARTICULAR LEVEL OF QUALITY, FIT FOR A PARTICULAR PURPOSE, ACCURATE, AND ERROR-FREE, OR THAT THE SITE IS SECURE AND NON-INFRINGING."

Predatory Analysis: Chase makes zero legal promises about the quality, accuracy, or security of its own websites. They explicitly state they do not guarantee the site is error-free or secure. By using their site, you, the customer, assume 100% of the risk that the information is wrong or that the site itself could be unsafe.

Why This Is Predatory: A bank disclaiming responsibility for the security and accuracy of their own financial website is breathtaking in its audacity. They want customers to trust them with their money while legally disclaiming any responsibility for providing secure, accurate services.

5. The Unilateral Control Clause: They Can Terminate Your Access at Any Time

Original Text: "J.P. Morgan Chase reserves the right to suspend or deny, in its sole discretion, your access to all or any portion of the Site with or without notice."

Predatory Analysis: This gives Chase the absolute right to block you from accessing their websites and your online accounts at any time, for any reason they choose, without having to provide you with any advance warning or explanation. Your access is a privilege that they can revoke at their sole discretion.

Why This Is Predatory: This creates a power imbalance where customers can be cut off from their own financial information without explanation or recourse. It's digital financial censorship disguised as platform management.

6. The Monitoring Clause: They Can Watch and Record Your Actions

Original Text: "We may monitor your use of this site, and may freely use and disclose any information and materials received from you or collected through your use of the site for any lawful reason or purpose."

Predatory Analysis: This clause grants Chase the right to monitor everything you do on their website. It further states that they can use and disclose any information they collect from your activity for any legal reason they see fit. This provides them with a broad license to use your behavioral data, which is further detailed in their separate privacy policies.

Why This Is Predatory: This enables comprehensive surveillance of customer behavior for profit. "Any lawful reason" is deliberately broad, allowing data monetization, behavioral profiling, and third-party sharing.

SURVEILLANCE CAPITALISM FRAMEWORK ANALYSIS:

Chase's Terms of Use exemplifies the legal infrastructure of surveillance capitalism:

• Data Extraction: Broad monitoring and data collection rights
• Value Appropriation: Free intellectual property acquisition from user submissions
• Risk Socialization: All liability transferred to users
• Power Concentration: Unilateral termination and control rights
• Legal Immunity: Forced arbitration eliminates democratic accountability

THE SIGNAL COUNTER-NARRATIVE COMPARISON:

Signal's Terms of Service: ✅ No content licenses, ✅ Court access preserved, ✅ Minimal liability caps, ✅ No monitoring clauses

Chase Bank's Terms of Use: ❌ Steals your ideas, ❌ Forces arbitration, ❌ Zero liability, ❌ Comprehensive surveillance

WHAT CHASE REVEALS ABOUT SURVEILLANCE CAPITALISM:

Chase proves that predatory terms are not about providing services - they're about extracting maximum value while providing minimum accountability. Every clause is designed to benefit Chase at the customer's expense.

This is surveillance capitalism's legal playbook: monitor everything, own everything, control everything, while being responsible for nothing.

EDUCATIONAL VALUE:

Chase serves as the perfect example of what to avoid. When users see:
- Forced arbitration clauses
- Broad intellectual property grabs
- Absolute liability disclaimers
- Unilateral termination rights
- Comprehensive monitoring permissions

They should ask: "Why does this company need these powers over me?"

The answer is always the same: Because surveillance capitalism requires legal frameworks that prioritize corporate extraction over human rights.

Source: ToS Salad Transparency Research
Educational Purpose: Exposing surveillance capitalism's legal infrastructure
Warning: Textbook example of predatory corporate terms designed to maximize institutional power`;

  try {
    // Create or get Chase Bank company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'chase.com')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'JPMorgan Chase & Co.',
          domain: 'chase.com',
          industry: 'Financial Services',
          headquarters: 'New York, NY',
          founded_year: 1799,
          tos_url: 'https://www.chase.com/digital/resources/terms-of-use',
          corporate_website: 'https://www.chase.com',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Chase company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ JPMorgan Chase company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Chase company');
    }

    // Create Chase ToS document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Chase Bank Terms of Use - Surveillance Capitalism Legal Framework',
        url: 'https://www.chase.com/digital/resources/terms-of-use',
        raw_content: chaseAnalysisContent,
        cleaned_content: chaseAnalysisContent,
        content_hash: require('crypto').createHash('md5').update(chaseAnalysisContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: chaseAnalysisContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Chase document creation failed:', docError.message);
      return;
    }

    console.log('✅ Chase predatory document created');

    // Create predatory analysis entry - Chase gets terrible scores!
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 8, // Terrible transparency - deliberately obfuscated
        user_friendliness_score: 5, // Extremely user-hostile
        privacy_score: 15, // Poor privacy protection
        manipulation_risk_score: 95, // Extreme manipulation risk
        data_collection_risk: 'high', // Comprehensive surveillance
        data_sharing_risk: 'high', // Broad disclosure rights
        account_termination_risk: 'high', // Unilateral termination
        legal_jurisdiction_risk: 'high', // Forced arbitration strips rights
        concerning_clauses: [
          {category: 'Forced Arbitration', concern: 'Complete elimination of right to court trial and class action lawsuits'},
          {category: 'Intellectual Property Theft', concern: 'All user ideas become Chase property without compensation'},
          {category: 'Absolute Liability Shield', concern: 'Zero responsibility for any damages caused by their own negligence'},
          {category: 'Security Disclaimer', concern: 'Bank disclaims responsibility for security of their own financial website'},
          {category: 'Unilateral Termination', concern: 'Can cut off access to your financial information without explanation'},
          {category: 'Comprehensive Surveillance', concern: 'Monitor and monetize all user behavior for any reason'}
        ],
        manipulation_tactics: [
          'Forced Arbitration Clauses',
          'Intellectual Property Appropriation',
          'Liability Shifting',
          'Unilateral Control Rights',
          'Surveillance Monetization',
          'Legal Immunity Shields'
        ],
        ai_model_used: 'tos-salad-predatory-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Chase Bank Terms represent surveillance capitalism legal infrastructure designed to maximize corporate power while stripping customers of fundamental rights. Textbook example of predatory corporate terms.',
        key_concerns: [
          'Forced Arbitration: Complete Elimination of Legal Rights',
          'IP Theft: All User Ideas Become Chase Property',
          'Liability Shield: Zero Responsibility for Own Negligence',
          'Security Disclaimer: Bank Won\'t Guarantee Financial Website Security',
          'Unilateral Control: Cut Off Financial Access Without Explanation',
          'Surveillance Monetization: Monitor Everything for Profit'
        ],
        recommendations: [
          'CRITICAL: Understand you waive all legal rights by using Chase website',
          'WARNING: Any ideas you share become Chase property forever',
          'RISK: Chase accepts no responsibility for website security or accuracy',
          'DANGER: Your access can be terminated without warning or explanation',
          'PRIVACY: All your behavior is monitored and can be monetized',
          'COMPARISON: Signal proves these predatory clauses are choices, not necessities',
          'ACTION: Consider credit unions or banks with less predatory terms'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Chase analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Chase predatory analysis created');
    console.log(`🚩 Transparency Score: ${analysis.transparency_score}/100 (TERRIBLE)`);
    console.log(`⚠️ Manipulation Risk: ${analysis.manipulation_risk_score}/100 (EXTREME)`);
    console.log(`🛡️ Privacy Score: ${analysis.privacy_score}/100 (POOR)`);
    console.log(`👤 User Friendliness: ${analysis.user_friendliness_score}/100 (HOSTILE)`);
    console.log('🚩 Chase predatory analysis successfully added!');

    console.log('\n🚩 CHASE BANK: SURVEILLANCE CAPITALISM EXPOSED');
    console.log('===============================================');
    console.log('🎓 Predatory Corporate Terms Analysis');
    console.log('📊 Source: ToS Salad Transparency Research');
    console.log('🎯 Purpose: Exposing surveillance capitalism legal infrastructure');
    console.log('💡 Key Insight: Every clause designed to benefit Chase at customer expense');
    console.log('🔗 Impact: Textbook example of what users should avoid');

    console.log('\n⚠️ Chase proves surveillance capitalism requires:');
    console.log('  📜 Stealing your intellectual property');
    console.log('  ⚖️ Eliminating your legal rights through forced arbitration');
    console.log('  🛡️ Accepting zero responsibility while demanding total control');
    console.log('  🔍 Monitoring everything for profit');
    console.log('  🏢 Legal frameworks that prioritize extraction over human rights');

  } catch (error) {
    console.error('❌ Chase predatory analysis failed:', error.message);
  }
}

addChasePredatoryAnalysis();