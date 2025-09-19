#!/usr/bin/env node

/**
 * Add Verizon Terms of Service - "Horror Movie" Category Analysis
 *
 * This script adds Verizon's ToS analysis as a prime example of "horror movie"
 * corporate legal frameworks - maximum corporate protection with minimal consumer rights.
 * Transparency Score: 15/100 - Firmly in the predatory category.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addVerizonHorrorAnalysis() {
  console.log('📱 Adding Verizon "Horror Movie" ToS analysis...');

  const verizonAnalysisContent = `Verizon Terms of Service: "Horror Movie" Corporate Legal Framework
Red Flag Analysis - Maximum Corporate Protection, Minimal Consumer Rights

TRANSPARENCY SCORE: 15/100 - HORROR MOVIE CATEGORY

EXECUTIVE SUMMARY: This legal framework is a masterclass in corporate self-protection at the direct expense of the consumer. It employs nearly every user-hostile clause possible: mandatory binding arbitration, a complete waiver of class-action rights, aggressive liability caps, sweeping disclaimers of service quality, and broad rights to monitor and use customer data. The complexity, cross-referencing between multiple documents, and the sheer scope of the rights being waived place it firmly in the "horror movie" category of corporate legal agreements.

HORROR MOVIE ASSESSMENT: Verizon's terms represent the apex of surveillance capitalism's legal predation - a comprehensive system designed to extract maximum value while providing minimal accountability or guarantees.

DETAILED PREDATORY CLAUSE ANALYSIS:

1. The Ironclad Forced Arbitration & Class Action Waiver: You Have No Right to a Day in Court, Ever

Original Text: "YOU AND VERIZON BOTH AGREE TO RESOLVE DISPUTES ONLY BY ARBITRATION OR IN SMALL CLAIMS COURT... YOU'RE GIVING UP THE RIGHT TO A JURY TRIAL, AND TO PARTICIPATE IN A CLASS ACTION."

Horror Analysis: This is the foundational clause of the entire agreement, repeated in multiple documents. By using Verizon's service, you permanently and completely waive your right to sue them in a traditional court of law. More importantly, you are explicitly forbidden from joining with other customers in a class-action lawsuit. This is the single most powerful tool a corporation has to prevent widespread accountability for issues like billing errors, data breaches, or service failures.

Why This Is Horror-Level: Telecommunications services are essential infrastructure. Verizon leverages this dependency to strip fundamental legal rights from customers who have limited alternatives.

2. The Absolute Disclaimer of Warranties: They Guarantee Absolutely Nothing

Original Text: "We make no representations or warranties, express or implied, including, to the full extent permitted by applicable law, any implied warranty of merchantability, fitness for a particular purpose... WE DO NOT WARRANT THAT THE SERVICES... WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS."

Horror Analysis: Verizon makes zero legal promises that their service—the internet and phone connectivity you pay for—will actually work. They do not guarantee it will be reliable, secure, or free from errors. By signing up, you legally accept that you are paying for a service that comes with no guarantees of quality or security, and you bear all the risk of its failure.

Why This Is Horror-Level: Imagine buying a car where the manufacturer legally disclaims any responsibility for whether it actually runs. This is that level of audacious liability avoidance.

3. The Aggressive Limitation of Liability: If Their Failure Causes You Massive Harm, They Are Not Responsible

Original Text: "VERIZON... [IS] NOT LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES OF ANY KIND... INCLUDING LOST PROFITS (REGARDLESS OF WHETHER WE HAVE BEEN NOTIFIED THAT SUCH LOSS MAY OCCUR)..."

Horror Analysis: This is an ironclad liability shield. If an outage of Verizon's service causes your home business to lose thousands of dollars, or if a failure in their system leads to other major damages, they are not legally or financially responsible for those losses. This clause is specifically designed to protect them from paying for the real-world consequences of their service failures.

Why This Is Horror-Level: Verizon wants to control essential communications infrastructure while accepting zero responsibility for the consequences when it fails.

4. The Data Monitoring and Sharing Clause: They Watch What You Do and Share It

Original Text: "You agree that Verizon and its third-party service providers have a right to... access your computer and any other device... to monitor, from time to time, your content, and your bandwidth, transmissions and usage to... prevent a breach of these terms... We may also... use, copy, display, store, transmit and reformat data as necessary to provide the Services."

Horror Analysis: This clause grants Verizon broad rights to monitor your internet activity. They can access your devices, monitor your bandwidth, and analyze your usage patterns. This is framed as a necessity for network management, but it provides them with deep insights into your online behavior, which they can use and share as "necessary to provide the Services."

Why This Is Horror-Level: Your telecommunications provider becomes a comprehensive surveillance apparatus with legal permission to monitor everything you do online.

5. The Automatic Enrollment in "Verizon Up": Your Data is Used for Advertising by Default

Original Text (from Entertainment Play Legal): "By enrolling in a Plan that includes Verizon Up, you are accepting these Verizon Up Terms and Conditions... We and our partners may also use information about you and your activity... to provide you with marketing and advertising about other products and services."

Horror Analysis: When you sign up for many of Verizon's plans, you are automatically enrolled in their "Verizon Up" rewards program. This clause confirms that by accepting the plan, you are also agreeing to have your data (including location, web browsing, and app usage data as detailed in their privacy policy) used by Verizon and its partners to target you with advertising.

Why This Is Horror-Level: Essential telecommunications services become trojan horses for comprehensive behavioral advertising systems.

6. The Unilateral "Changes" Clause: They Can Change the Contract Whenever They Want

Original Text: "We may change these Terms of Use, the Services, and/or any prices, fees and other charges at any time. Your continued use of the Services... will mean that you accept any new or changed terms and conditions."

Horror Analysis: Verizon reserves the absolute right to change the terms of your contract, including the price, at any time. Your only choice is to accept the new terms by continuing to use the service, or to cancel. This creates a one-sided relationship where the terms you originally agreed to are never permanent.

Why This Is Horror-Level: You're locked into a contract that can be changed unilaterally by the other party at any time.

7. The Software License Clause: They Can Install and Modify Software on Your Devices

Original Text: "You agree to allow us and our agents the right to install, access, and/or use the Software on your Equipment... without any further notice or consent... you authorize us to update, upgrade or otherwise modify the Software... at any time, and in our sole discretion..."

Horror Analysis: For services that require their software (like on a set-top box or router), this clause gives Verizon the right to install and change that software whenever they want, without asking your permission each time. This gives them a persistent presence and control over the equipment in your home.

Why This Is Horror-Level: Your telecommunications provider gains backdoor access to modify software in your home without permission.

HORROR MOVIE FRAMEWORK ANALYSIS:

Verizon's Terms represent the complete surveillance capitalism horror story:

• Legal Rights Elimination: Complete removal of court access and class action rights
• Quality Disclaimers: Zero guarantees for essential services you pay for
• Liability Immunity: No responsibility for consequences of their failures
• Device Control: Right to access and modify software in your home
• Behavioral Surveillance: Comprehensive monitoring of all online activity
• Advertising Monetization: Automatic enrollment in data-driven marketing
• Contract Manipulation: Unilateral right to change terms at any time

THE SIGNAL COUNTER-NARRATIVE COMPARISON:

Signal's Terms of Service: ✅ Court access preserved, ✅ No device access, ✅ No monitoring, ✅ No advertising
Verizon's Terms of Service: ❌ Courts forbidden, ❌ Device control claimed, ❌ Comprehensive monitoring, ❌ Advertising by default

WHAT VERIZON REVEALS ABOUT SURVEILLANCE CAPITALISM:

Verizon proves that surveillance capitalism's end game is complete control over essential infrastructure with zero accountability. They want to:
- Control your connectivity while guaranteeing nothing
- Monitor everything while being responsible for nothing
- Access your devices while protecting only themselves
- Change terms unilaterally while binding you permanently

This is the logical endpoint of unchecked corporate power over essential digital infrastructure.

EDUCATIONAL VALUE:

Verizon serves as the perfect example of "horror movie" ToS agreements. When users see:
- Complete legal rights elimination
- Zero service quality guarantees
- Comprehensive surveillance permissions
- Device access and control rights
- Unilateral contract modification powers

They should recognize this as the apex of corporate predation - what happens when surveillance capitalism captures essential infrastructure.

The question every user should ask: "Why does my phone company need more control over my digital life than my own government has?"

Source: ToS Salad Transparency Research
Educational Purpose: Exposing "horror movie" level corporate predation in essential services
Warning: Textbook example of surveillance capitalism's capture of critical infrastructure`;

  try {
    // Create or get Verizon company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'verizon.com')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Verizon Communications Inc.',
          domain: 'verizon.com',
          industry: 'Telecommunications',
          headquarters: 'New York, NY',
          founded_year: 1983,
          tos_url: 'https://www.verizon.com/about/terms-conditions/',
          corporate_website: 'https://www.verizon.com',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Verizon company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Verizon Communications company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Verizon company');
    }

    // Create Verizon ToS document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Verizon Terms of Service - Horror Movie Corporate Legal Framework',
        url: 'https://www.verizon.com/about/terms-conditions/',
        raw_content: verizonAnalysisContent,
        cleaned_content: verizonAnalysisContent,
        content_hash: require('crypto').createHash('md5').update(verizonAnalysisContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: verizonAnalysisContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Verizon document creation failed:', docError.message);
      return;
    }

    console.log('✅ Verizon horror movie document created');

    // Create horror movie analysis entry - Verizon gets TERRIBLE scores!
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 15, // Horror movie level - deliberately obfuscated
        user_friendliness_score: 8, // Extremely user-hostile
        privacy_score: 10, // Terrible privacy protection
        manipulation_risk_score: 92, // Extreme manipulation risk
        data_collection_risk: 'high', // Comprehensive surveillance
        data_sharing_risk: 'high', // Broad sharing with partners
        account_termination_risk: 'high', // Unilateral termination
        legal_jurisdiction_risk: 'high', // Complete elimination of legal rights
        concerning_clauses: [
          {category: 'Ironclad Forced Arbitration', concern: 'Complete elimination of court access and class action rights forever'},
          {category: 'Absolute Warranty Disclaimer', concern: 'Zero guarantees that paid services will actually work'},
          {category: 'Aggressive Liability Shield', concern: 'No responsibility for massive damages caused by service failures'},
          {category: 'Device Access Rights', concern: 'Right to install and modify software on your home equipment'},
          {category: 'Comprehensive Surveillance', concern: 'Monitor all internet activity and device usage'},
          {category: 'Automatic Advertising Enrollment', concern: 'Data used for advertising by default without opt-in'},
          {category: 'Unilateral Contract Changes', concern: 'Can change any terms including price at any time'}
        ],
        manipulation_tactics: [
          'Complete Legal Rights Elimination',
          'Service Quality Disclaimers',
          'Device Control Appropriation',
          'Comprehensive Behavioral Surveillance',
          'Liability Immunity Shields',
          'Automatic Advertising Enrollment',
          'Unilateral Contract Manipulation'
        ],
        ai_model_used: 'tos-salad-horror-movie-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Verizon Terms represent the apex of surveillance capitalism - complete corporate control over essential infrastructure with zero accountability. Horror movie level predation.',
        key_concerns: [
          'Legal Rights Elimination: No Courts, No Class Actions, Ever',
          'Service Disclaimers: Zero Guarantees for Services You Pay For',
          'Device Control: Right to Access and Modify Your Home Equipment',
          'Comprehensive Surveillance: Monitor All Internet Activity',
          'Liability Immunity: No Responsibility for Service Failure Damages',
          'Advertising by Default: Automatic Enrollment in Data Monetization',
          'Contract Manipulation: Unilateral Right to Change Any Terms'
        ],
        recommendations: [
          'CRITICAL: Understand you permanently waive all legal rights',
          'WARNING: Verizon guarantees nothing about services you pay for',
          'PRIVACY: All internet activity monitored and potentially shared',
          'SECURITY: Verizon can access and modify software in your home',
          'LIABILITY: You bear all risk of service failures and damages',
          'ADVERTISING: Your data used for marketing by default',
          'CONTRACTS: Terms can change unilaterally at any time',
          'COMPARISON: Signal proves user-centric infrastructure is possible',
          'ACTION: Consider credit unions, municipal broadband, or competitors with better terms'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Verizon analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Verizon horror movie analysis created');
    console.log(`📱 Transparency Score: ${analysis.transparency_score}/100 (HORROR MOVIE)`);
    console.log(`⚠️ Manipulation Risk: ${analysis.manipulation_risk_score}/100 (EXTREME)`);
    console.log(`🛡️ Privacy Score: ${analysis.privacy_score}/100 (TERRIBLE)`);
    console.log(`👤 User Friendliness: ${analysis.user_friendliness_score}/100 (HOSTILE)`);
    console.log('📱 Verizon horror movie analysis successfully added!');

    console.log('\n📱 VERIZON: "HORROR MOVIE" SURVEILLANCE CAPITALISM');
    console.log('=================================================');
    console.log('🎓 Horror Movie Category Corporate Predation Analysis');
    console.log('📊 Source: ToS Salad Transparency Research');
    console.log('🎯 Purpose: Exposing apex predation in essential infrastructure');
    console.log('💡 Key Insight: Complete corporate control with zero accountability');
    console.log('🔗 Impact: Shows surveillance capitalism capture of critical services');

    console.log('\n💀 Verizon horror movie features:');
    console.log('  ⚖️ Complete elimination of legal rights (no courts, no class actions)');
    console.log('  📱 Zero guarantees for essential services you pay for');
    console.log('  🏠 Right to access and control software in your home');
    console.log('  🔍 Comprehensive surveillance of all online activity');
    console.log('  💰 Automatic enrollment in advertising data monetization');
    console.log('  📄 Unilateral right to change any contract terms at any time');
    console.log('  🎯 The logical endpoint of unchecked corporate power over infrastructure');

  } catch (error) {
    console.error('❌ Verizon horror movie analysis failed:', error.message);
  }
}

addVerizonHorrorAnalysis();