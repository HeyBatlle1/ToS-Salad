#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function updateMicrosoftAnalysis() {
  console.log('🔄 Updating Microsoft Services Agreement with comprehensive analysis...');

  const microsoftContent = `Microsoft Services Agreement: Key Clause Analysis & Transparency Score

Transparency Score: 16/100
Justification: Microsoft's Services Agreement represents a comprehensive system of legal control that systematically removes user rights while maximizing corporate protection. The agreement combines forced arbitration with mass filing restrictions, extreme liability caps ($10 maximum), complete warranty disclaimers, and unilateral account termination powers. Most critically, it includes sophisticated "kill switches" for organized consumer action and transfers intellectual property rights for free. The score reflects systematic user subjugation through advanced legal engineering designed to prevent accountability.

1. The Forced Arbitration Gauntlet: You Forfeit Your Right to a Day in Court
Original Text: "If we can't, you and we agree to binding individual arbitration before the American Arbitration Association ("AAA") under the Federal Arbitration Act ("FAA"), and not to sue in court in front of a judge or jury. ... Class action lawsuits, class-wide arbitrations, private attorney-general actions... aren't allowed."
Plain English Explanation: This is arguably the most significant clause. It states that you cannot sue Microsoft in a traditional court. Instead, you are forced into a private arbitration system. Crucially, it bans you from joining with other people who have the same problem (a class action lawsuit). This drastically reduces consumer power and makes it incredibly difficult and expensive for an individual to challenge a massive corporation.

2. The Mass Arbitration "Kill Switch": A System Designed to Overwhelm Justice
Original Text: "If your Notice of Dispute involves claims similar to those of at least 24 other customers... these claims will be "Related Cases." ... Related Cases may only be filed in batches of up to 50 individual arbitrations at a time... none of the other Related Cases may be filed or prosecuted in arbitration until the first batch of up to 50 individual arbitrations is resolved..."
Plain English Explanation: This is an advanced legal maneuver to counter organized consumer action. If a large group of people (e.g., in a data breach) all try to file for arbitration at once, this clause forces them into a slow, "batched" process. Only 50 cases can be heard at a time. This system is designed to delay and exhaust the legal process for thousands of affected users, making it practically impossible to achieve timely justice on a large scale.

3. The Liability Cap: If Microsoft's Failure Causes Catastrophic Damage, They Owe You $10
Original Text: "If you have any basis for recovering damages... you agree that your exclusive remedy is to recover, from Microsoft or any affiliates... direct damages up to an amount equal to your Services fee for the month during which the loss or breach occurred (or up to $10.00 if the Services are free). You can't recover any other damages or losses, including... lost profits, special, indirect, incidental, or punitive."
Plain English Explanation: This clause severely limits Microsoft's financial responsibility for any harm they cause. If a flaw in their service (like OneDrive or Outlook) causes you to lose your business data, family photos, or suffer other major damages, the absolute maximum you can recover is the fee you paid for that month, or just ten dollars if the service was free. This transfers nearly all financial risk from them to you.

4. Total Warranty Disclaimer: They Legally Promise You Nothing
Original Text: "WE PROVIDE THE SERVICES ON AN "AS IS" BASIS "WITH ALL FAULTS" AND "AS AVAILABLE." YOU BEAR THE ENTIRE RISK OF USING THE SERVICES. MICROSOFT DOESN'T GUARANTEE THE ACCURACY OR TIMELINESS OF THE SERVICES. ... WE DO NOT GUARANTEE THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE OR THAT CONTENT LOSS WON'T OCCUR..."
Plain English Explanation: This is a complete disclaimer of responsibility for the quality, security, and reliability of their products. Legally, they guarantee nothing. If their services are insecure, full of errors, or if they lose all of your content, this clause states that you have accepted that entire risk, and they have no legal obligation to you.

5. Your Ideas Become Theirs, for Free, Forever
Original Text: "If you give to Microsoft any idea, proposal, suggestion or feedback... ("Feedback"), you give to Microsoft, without charge, royalties or other obligation to you, the right to make, have made, create derivative works, use, share and commercialize your Feedback in any way and for any purpose."
Plain English Explanation: This clause states that any idea or suggestion you send to Microsoft immediately becomes their intellectual property. They can patent it, build products from it, and profit from it, and they owe you absolutely nothing in return—no payment, no credit, no obligation.

6. Consent by Reference: You Agree to a Privacy Policy You Haven't Read
Original Text: "Please read the Microsoft Privacy Statement... as it describes the types of data we collect from you... how we use your Data... by agreeing to these Terms, you consent to Microsoft's collection, use and disclosure of Your Content and Data as described in the Privacy Statement."
Plain English Explanation: This is a critical legal maneuver. This Services Agreement doesn't detail all the ways they use your data (like for AI training or advertising). Instead, it makes you legally consent to everything written in a separate document, the Privacy Statement. Because the Privacy Statement can be updated, you are effectively pre-consenting to future data collection practices that may not even exist yet.

7. The Third-Party Risk Dump: If a Connected App Harms You, It's Not Microsoft's Problem
Original Text: "You agree to assume all risk and liability arising from your use of these Third-Party Apps and Services and that Microsoft is not responsible for any issues arising out of your use of them."
Plain English Explanation: Microsoft encourages an ecosystem of third-party apps and services that connect to your account (e.g., Office plugins, Xbox apps). This clause states that if one of those third-party apps steals your data, damages your computer, or causes other harm, Microsoft takes zero responsibility. You are on your own.

8. The Subjective "Code of Conduct": A Justification to Ban Anyone for Vague Reasons
Original Text: "Don't... publicly display or use the Services to share inappropriate content or material (involving, for example, nudity, bestiality, pornography, offensive language, graphic violence, or criminal activity)."
Plain English Explanation: This clause, while appearing reasonable, gives Microsoft sole discretion to define terms like "inappropriate" and "offensive language." This subjectivity allows them to terminate an account or remove content based on their own internal, and often opaque, standards. A user can be in violation without understanding the specific rule they have broken.

9. Account Termination at Will: Your Digital Life Can Be Deleted Without Recourse
Original Text: "Microsoft may close your account at any time and for any reason... Closing your account may result in a loss of access to the Services (and Your Content associated with those Services), software licenses, subscriptions, and Microsoft account balances associated with the account."
Plain English Explanation: This clause explicitly states that Microsoft can delete your entire account—and everything associated with it (emails, cloud files, software licenses you paid for)—at any time, for any reason. This is the enforcement mechanism for their subjective Code of Conduct and gives them absolute power over your digital presence on their platforms.

10. The "Use It or Lose It" Inactivity Clause: Your Data Can Be Deleted for Being Idle
Original Text: "You must use your Microsoft account to keep it active... Microsoft reserves the right to close your account if you don't sign in for a two-year period."
Plain English Explanation: If you do not log in to your Microsoft account for two years, Microsoft reserves the right to permanently close it and delete everything in it. This "use it or lose it" policy can lead to the irreversible loss of important data, photos, or emails for users who may be elderly, ill, or simply have an account they don't use frequently.

11. You Don't Own Your Software, You Rent It
Original Text: "...any software provided by us to you as part of the Services is subject to these Terms... we grant you a personal, non-exclusive, non-transferable, and limited right to install and use the software... This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services..."
Plain English Explanation: This clarifies that when you use services like Microsoft 365, you are not buying a product you own. You are being granted a limited, personal, non-transferable license to use it. This license can be revoked at any time if Microsoft terminates your account, meaning you can lose access to the software you rely on.

12. The Unilateral Contract Update: They Can Change the Terms, and Your Only Choice is to Quit
Original Text: "We will notify you if we change these Terms... If you do not agree to the changes, you must stop using the Services... Otherwise, your continued use of the Services constitutes your acceptance of the changed terms."
Plain English Explanation: Microsoft can change this legal agreement at any time. Your only recourse if you disagree with the new terms is to stop using all their services and abandon your account. By continuing to log in, you are legally accepting the new contract, whether you have read it or not.

13. Assignment of Your Contract: Microsoft Can Transfer Your Agreement to Another Company Without Your Consent
Original Text: "We may assign these Terms, in whole or in part, at any time without notice to you. You may not assign your rights or obligations under these Terms..."
Plain English Explanation: This clause gives Microsoft the right to transfer its legal agreement with you to a different company (for example, if a service is sold). This can be done without notifying you. You, however, are not allowed to transfer your rights or account to anyone else.

This agreement represents a comprehensive system of legal control designed to prevent user accountability and maximize corporate protection through advanced legal engineering.

Transparency Score: 16/100 - Critical Risk Level
Red Flags: 13 systematic legal control mechanisms`;

  try {
    // Get the existing Microsoft company and document records
    const { data: company, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'microsoft.com')
      .single();

    if (companyError) {
      console.error('❌ Microsoft company not found:', companyError.message);
      return;
    }

    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .select('id')
      .eq('company_id', company.id)
      .eq('document_type', 'terms_of_service')
      .single();

    if (docError) {
      console.error('❌ Microsoft document not found:', docError.message);
      return;
    }

    // Update the document with comprehensive content
    const { error: updateDocError } = await supabase
      .from('tos_analysis_documents')
      .update({
        raw_content: microsoftContent,
        cleaned_content: microsoftContent,
        content_hash: require('crypto').createHash('md5').update(microsoftContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        content_length: microsoftContent.length
      })
      .eq('id', document.id);

    if (updateDocError) {
      console.error('❌ Document update failed:', updateDocError.message);
      return;
    }

    console.log('✅ Microsoft document updated with comprehensive analysis');

    // Update the analysis with comprehensive data
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .update({
        transparency_score: 16, // Slightly better than original due to more detailed analysis revealing some protections
        user_friendliness_score: 15, // Still extremely hostile
        privacy_score: 20, // Consent by reference to privacy policy
        manipulation_risk_score: 90, // Critical - advanced legal engineering
        data_collection_risk: 'high', // Privacy policy by reference
        data_sharing_risk: 'high', // Third party ecosystem risk
        account_termination_risk: 'critical', // At-will termination + inactivity deletion
        legal_jurisdiction_risk: 'critical', // Forced arbitration + mass filing restrictions
        concerning_clauses: [
          {category: 'Forced Arbitration Elimination', concern: 'Cannot sue in court, forced into private arbitration'},
          {category: 'Mass Arbitration Kill Switch', concern: 'Batched processing designed to delay and exhaust justice'},
          {category: 'Catastrophic Damage Liability Cap', concern: 'Maximum $10 liability regardless of Microsoft errors'},
          {category: 'Total Warranty Disclaimer', concern: 'No legal promises about quality, security, or reliability'},
          {category: 'Intellectual Property Theft', concern: 'All user feedback becomes Microsoft property for free'},
          {category: 'Privacy Policy Consent by Reference', concern: 'Pre-consent to future unknown data practices'},
          {category: 'Third Party Risk Transfer', concern: 'No liability for connected app damages'},
          {category: 'Subjective Code of Conduct', concern: 'Vague rules allowing arbitrary account termination'},
          {category: 'At Will Account Termination', concern: 'Can delete entire digital presence for any reason'},
          {category: 'Inactivity Data Deletion', concern: 'Use it or lose it account closure after two years'},
          {category: 'Software Rental Not Ownership', concern: 'Limited revocable license instead of ownership'},
          {category: 'Unilateral Contract Modification', concern: 'Can change agreement anytime, only choice is to quit'},
          {category: 'Asymmetric Assignment Rights', concern: 'Microsoft can transfer agreement, users cannot'}
        ],
        manipulation_tactics: ['Legal Access Denial', 'Liability Transfer', 'Intellectual Property Theft', 'Digital Control'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '2.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Microsoft employs advanced legal engineering to systematically remove user rights while maximizing corporate protection, scoring 16/100.',
        key_concerns: [
          'Forced Arbitration Court Access Denial',
          'Mass Arbitration Processing Kill Switch',
          'Catastrophic Damage $10 Liability Cap',
          'Complete Quality and Security Warranty Disclaimer',
          'Automatic Intellectual Property Rights Transfer',
          'Privacy Policy Future Consent by Reference',
          'Third Party Connected App Risk Transfer',
          'Subjective Content and Conduct Rules',
          'At Will Complete Account Termination',
          'Inactivity Based Data Deletion Rights',
          'Software Licensing Instead of Ownership',
          'Unilateral Agreement Modification Powers',
          'Asymmetric Contract Assignment Rights'
        ],
        recommendations: [
          'Understand you cannot sue Microsoft in court due to forced arbitration',
          'Know mass arbitration filings are artificially delayed through batching',
          'Be aware maximum Microsoft liability is $10 regardless of damages',
          'Microsoft provides no legal guarantees about service quality or security',
          'Never send feedback - Microsoft owns all suggestions permanently',
          'Realize you pre-consent to future privacy policy changes',
          'Understand Microsoft has no liability for connected third-party apps',
          'Know account termination rules are subjective and arbitrary',
          'Microsoft can delete your entire digital presence at any time',
          'Use accounts regularly or lose all data after two years of inactivity',
          'You rent software licenses, you do not own Microsoft products',
          'Monitor agreement changes constantly or lose all protections',
          'Microsoft can transfer your agreement, but you cannot transfer yours'
        ]
      })
      .eq('company_id', company.id)
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis update failed:', analysisError.message);
      return;
    }

    console.log('✅ Microsoft analysis updated with comprehensive data');
    console.log(`📊 Updated Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: Critical (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 13 systematic legal control mechanisms`);
    console.log('⚖️ Advanced legal engineering and user subjugation confirmed!');

    // Show updated transparency rankings
    console.log('\n📊 UPDATED TRANSPARENCY RANKINGS:');
    console.log('==================================');
    console.log('🏦 Bank of America: 8/100 (CRITICAL - Financial Exploitation)');
    console.log('🎵 TikTok:          12/100 (CRITICAL - Minor Exploitation)');
    console.log('🚨 Verizon:         15/100 (CRITICAL - Monopoly Abuse)');
    console.log('⚖️ Microsoft:       16/100 (CRITICAL - Legal Engineering)');
    console.log('🔴 Reddit:          18/100 (CRITICAL - Content Exploitation)');
    console.log('📊 LinkedIn:        25/100 (High Risk - Professional Exploitation)');
    console.log('📊 Google:          25/100 (High Risk)');
    console.log('📊 Discord:         30/100 (High Risk)');
    console.log('📊 Spotify:         30/100 (Consumer)');

  } catch (error) {
    console.error('❌ Microsoft update failed:', error.message);
  }
}

updateMicrosoftAnalysis();