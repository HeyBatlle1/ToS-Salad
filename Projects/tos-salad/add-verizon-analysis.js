#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addVerizonAnalysis() {
  console.log('📡 Adding Verizon Telecommunications analysis (CRITICAL transparency issues)...');

  const verizonContent = `Verizon Terms of Service (Combined Analysis): Key Clause Analysis & Transparency Score

Transparency Score: 15/100
Justification: This legal framework is a masterclass in corporate self-protection at the direct expense of the consumer. It employs nearly every user-hostile clause possible: mandatory binding arbitration, a complete waiver of class-action rights, aggressive liability caps, sweeping disclaimers of service quality, and broad rights to monitor and use customer data. The complexity, cross-referencing between multiple documents, and the sheer scope of the rights being waived place it firmly in the "horror movie" category of corporate legal agreements.

1. The Ironclad Forced Arbitration & Class Action Waiver: You Have No Right to a Day in Court, Ever
Original Text: "YOU AND VERIZON BOTH AGREE TO RESOLVE DISPUTES ONLY BY ARBITRATION OR IN SMALL CLAIMS COURT... YOU'RE GIVING UP THE RIGHT TO A JURY TRIAL, AND TO PARTICIPATE IN A CLASS ACTION."
Plain English Explanation: This is the foundational clause of the entire agreement, repeated in multiple documents. By using Verizon's service, you permanently and completely waive your right to sue them in a traditional court of law. More importantly, you are explicitly forbidden from joining with other customers in a class-action lawsuit. This is the single most powerful tool a corporation has to prevent widespread accountability for issues like billing errors, data breaches, or service failures.

2. The Absolute Disclaimer of Warranties: They Guarantee Absolutely Nothing
Original Text: "We make no representations or warranties, express or implied, including, to the full extent permitted by applicable law, any implied warranty of merchantability, fitness for a particular purpose... WE DO NOT WARRANT THAT THE SERVICES... WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS."
Plain English Explanation: Verizon makes zero legal promises that their service—the internet and phone connectivity you pay for—will actually work. They do not guarantee it will be reliable, secure, or free from errors. By signing up, you legally accept that you are paying for a service that comes with no guarantees of quality or security, and you bear all the risk of its failure.

3. The Aggressive Limitation of Liability: If Their Failure Causes You Massive Harm, They Are Not Responsible
Original Text: "VERIZON... [IS] NOT LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES OF ANY KIND... INCLUDING LOST PROFITS (REGARDLESS OF WHETHER WE HAVE BEEN NOTIFIED THAT SUCH LOSS MAY OCCUR)..."
Plain English Explanation: This is an ironclad liability shield. If an outage of Verizon's service causes your home business to lose thousands of dollars, or if a failure in their system leads to other major damages, they are not legally or financially responsible for those losses. This clause is specifically designed to protect them from paying for the real-world consequences of their service failures.

4. The Data Monitoring and Sharing Clause: They Watch What You Do and Share It
Original Text: "You agree that Verizon and its third-party service providers have a right to... access your computer and any other device... to monitor, from time to time, your content, and your bandwidth, transmissions and usage to... prevent a breach of these terms... We may also... use, copy, display, store, transmit and reformat data as necessary to provide the Services."
Plain English Explanation: This clause grants Verizon broad rights to monitor your internet activity. They can access your devices, monitor your bandwidth, and analyze your usage patterns. This is framed as a necessity for network management, but it provides them with deep insights into your online behavior, which they can use and share as "necessary to provide the Services."

5. The Automatic Enrollment in "Verizon Up": Your Data is Used for Advertising by Default
Original Text: "By enrolling in a Plan that includes Verizon Up, you are accepting these Verizon Up Terms and Conditions... We and our partners may also use information about you and your activity... to provide you with marketing and advertising about other products and services."
Plain English Explanation: When you sign up for many of Verizon's plans, you are automatically enrolled in their "Verizon Up" rewards program. This clause confirms that by accepting the plan, you are also agreeing to have your data (including location, web browsing, and app usage data as detailed in their privacy policy) used by Verizon and its partners to target you with advertising.

6. The Unilateral "Changes" Clause: They Can Change the Contract Whenever They Want
Original Text: "We may change these Terms of Use, the Services, and/or any prices, fees and other charges at any time. Your continued use of the Services... will mean that you accept any new or changed terms and conditions."
Plain English Explanation: Verizon reserves the absolute right to change the terms of your contract, including the price, at any time. Your only choice is to accept the new terms by continuing to use the service, or to cancel. This creates a one-sided relationship where the terms you originally agreed to are never permanent.

7. The Software License Clause: They Can Install and Modify Software on Your Devices
Original Text: "You agree to allow us and our agents the right to install, access, and/or use the Software on your Equipment... without any further notice or consent... you authorize us to update, upgrade or otherwise modify the Software... at any time, and in our sole discretion..."
Plain English Explanation: For services that require their software (like on a set-top box or router), this clause gives Verizon the right to install and change that software whenever they want, without asking your permission each time. This gives them a persistent presence and control over the equipment in your home.

This analysis reveals a legal framework designed for maximum corporate protection and minimal consumer rights. The mandatory arbitration clause is the cornerstone of this entire structure.

Transparency Score: 15/100 - CRITICAL Risk Level
Red Flags: 7 monopoly power abuse issues`;

  try {
    // Get the existing Verizon company record
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'verizon.com')
      .single();

    if (companyError || !existingCompany) {
      console.error('❌ Verizon company not found:', companyError?.message);
      return;
    }

    const companyId = existingCompany.id;
    console.log('✅ Found existing Verizon company record');

    // Get existing document IDs for Verizon
    const { data: existingDocs, error: docSearchError } = await supabase
      .from('tos_analysis_documents')
      .select('id, title')
      .eq('company_id', companyId);

    if (docSearchError) {
      console.error('❌ Error finding Verizon documents:', docSearchError.message);
      return;
    }

    console.log(`✅ Found ${existingDocs.length} existing Verizon documents`);

    // Update the first document with comprehensive analysis
    if (existingDocs.length > 0) {
      const { data: updatedDoc, error: updateError } = await supabase
        .from('tos_analysis_documents')
        .update({
          title: 'Verizon Terms of Service (Combined Analysis)',
          raw_content: verizonContent,
          cleaned_content: verizonContent,
          content_length: verizonContent.length,
          is_analyzed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingDocs[0].id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Document update failed:', updateError.message);
        return;
      }

      console.log('✅ Verizon document updated with comprehensive analysis');

      // Create CRITICAL analysis results - worst transparency score yet
      const { data: analysis, error: analysisError } = await supabase
        .from('tos_analysis_results')
        .insert({
          document_id: updatedDoc.id,
          company_id: companyId,
          transparency_score: 15, // WORST score - monopoly power abuse
          user_friendliness_score: 10, // Extremely hostile to consumers
          privacy_score: 5, // Massive surveillance and data sharing
          manipulation_risk_score: 95, // Nearly maximum - critical monopoly abuse
          data_collection_risk: 'critical', // Device monitoring, location tracking
          data_sharing_risk: 'critical', // Automatic enrollment in data sharing
          account_termination_risk: 'high', // Service dependency
          legal_jurisdiction_risk: 'critical', // Ironclad forced arbitration
          concerning_clauses: [
            {category: 'Ironclad Forced Arbitration', concern: 'No right to court or class action ever'},
            {category: 'Absolute Disclaimer of Warranties', concern: 'Zero guarantees service will work'},
            {category: 'Aggressive Limitation of Liability', concern: 'Not responsible for any business damages'},
            {category: 'Data Monitoring and Sharing', concern: 'Broad rights to monitor all internet activity'},
            {category: 'Automatic Verizon Up Enrollment', concern: 'Data used for advertising by default'},
            {category: 'Unilateral Changes Clause', concern: 'Can change contract and prices anytime'},
            {category: 'Software License Control', concern: 'Can install/modify software on your devices'}
          ],
          manipulation_tactics: ['Monopoly Power', 'Forced Arbitration', 'Surveillance Capitalism', 'Device Control'],
          ai_model_used: 'gemini-2.0-flash',
          analysis_version: '1.0.0',
          analyzed_at: new Date().toISOString(),
          executive_summary: 'Verizon employs monopoly power to create the most consumer-hostile terms yet analyzed, scoring 15/100 with critical transparency failures.',
          key_concerns: [
            'Complete Elimination of Legal Rights',
            'Zero Service Quality Guarantees',
            'Comprehensive Internet Surveillance',
            'Default Data Sharing with Partners',
            'Unilateral Contract Changes',
            'Direct Device Control Rights',
            'Maximum Corporate Protection'
          ],
          recommendations: [
            'Understand you have NO legal recourse against Verizon',
            'Be aware of comprehensive internet monitoring',
            'Know your data is shared for advertising by default',
            'Understand Verizon can change prices anytime',
            'Consider alternative internet providers if available',
            'Document all service issues for potential small claims'
          ]
        })
        .select()
        .single();

      if (analysisError) {
        console.error('❌ Analysis creation failed:', analysisError.message);
        return;
      }

      console.log('✅ Verizon analysis created');
      console.log(`📊 Transparency Score: ${analysis.transparency_score}/100 - WORST YET!`);
      console.log(`⚠️ Risk Level: CRITICAL (${analysis.manipulation_risk_score}/100)`);
      console.log(`🚩 Red Flags: 7 monopoly power abuse issues`);
      console.log('📡 Telecommunications monopoly transparency crisis confirmed!');

      // Show context of how bad this is
      console.log('\n⚠️ TRANSPARENCY CRISIS ALERT:');
      console.log('===============================');
      console.log('📊 Verizon:    15/100 (CRITICAL - Monopoly Abuse)');
      console.log('📊 Microsoft:  20/100 (Critical)');
      console.log('📊 Discord:    30/100 (High Risk)');
      console.log('📊 Google:     25/100 (High Risk)');
      console.log('\n💡 Insight: Telecommunications monopoly creates worst transparency crisis!');

    } else {
      console.error('❌ No Verizon documents found to update');
    }

  } catch (error) {
    console.error('❌ Verizon analysis failed:', error.message);
  }
}

addVerizonAnalysis();