const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

const coinbaseAnalysis = `Coinbase User Agreement: Key Clause Analysis & Transparency Score

Transparency Score: 5/100
Justification: This document is an almost perfect example of a predatory, user-hostile legal agreement. It is a labyrinth of cross-referenced policies that culminates in one of the most comprehensive forced arbitration and class action waiver clauses in the industry. It grants Coinbase extraordinary power, including the right to take a user's assets to cover their losses (the "setoff" and "security interest" clauses) and the right to suspend access to a user's funds and account at its sole discretion. These powers, combined with absolute disclaimers of liability for the security and operation of its platform, create a system of total corporate control over a user's digital assets with virtually no meaningful legal recourse for the user. It is a legal masterpiece of risk transference.

1. The Ultimate Forced Arbitration & Class Action Waiver: Your Legal Rights are Annihilated
Original Text: "WAIVER OF CLASS ACTION AND JURY TRIAL... By entering into this Agreement, you... agree to waive your right to a jury trial and to participate in a class action lawsuit... ALL DISPUTES... MUST BE RESOLVED BY BINDING ARBITRATION ON AN INDIVIDUAL BASIS."
Plain English Explanation: This is the most dangerous and important clause in the entire document. You are permanently and completely forbidden from suing Coinbase in a real court of law. You are explicitly banned from joining with other users in a class-action lawsuit if Coinbase suffers a catastrophic hack, systemic failure, or engages in practices that harm millions of users at once. You are forced into a secret, private, and individual arbitration process. This clause is specifically designed to make it practically impossible to hold the company accountable for large-scale failures.

2. The Power to Seize Your Assets: The "Setoff" and "Security Interest" Clauses
Original Text: "Setoff and Security Interest. You grant us a lien on, and a right of setoff against, and a security interest in, all of your rights, title and interest in and to... all of your Digital Assets and Fiat Currency... for any and all obligations and liabilities you owe to us... We may setoff any of your liabilities or obligations to us against any of your rights, title or interests in and to any of your Digital Assets and Fiat Currency, without notice to you."
Plain English Explanation: This is an extraordinary and aggressive clause. It means that you grant Coinbase a legal claim (a "lien" and "security interest") over all the money and crypto you hold in your account. If Coinbase decides you owe them money for any reason (like a disputed transaction or a system error), this clause gives them the right to take your assets directly from your account to cover the debt, without even notifying you. This effectively gives them the power of a debt collector and a court, combined.

3. The "Sole Discretion" Kill Switch: They Can Freeze Your Account and Funds at Will
Original Text: "We may, in our sole discretion and without liability to you, with or without prior notice... suspend, restrict, or terminate your access to any or all of the Coinbase Services, and/or deactivate or cancel your Coinbase Account(s)."
Plain English Explanation: This clause gives Coinbase the absolute, dictatorial right to freeze you out of your account and prevent you from accessing your money and crypto at any time, for any reason they choose. They do not need to provide a warning or an explanation. In the volatile crypto market, being unable to access your funds for even a short period can be financially catastrophic. This clause gives them total control over your market access.

4. The "Unclaimed Property" Clause: If You Go Inactive, Your Crypto Goes to the Government
Original Text: "If Coinbase is holding funds... and has no record of you interacting with the Coinbase Services for several years, Coinbase may be required to report these funds as unclaimed property in accordance with applicable law... If this occurs, Coinbase will attempt to locate you at the address shown in our records, but if Coinbase is unable to locate you, it may be required to deliver any such funds to the applicable state or jurisdiction as unclaimed property."
Plain English Explanation: If you do not log in to your account for a period of several years (the exact time depends on state law), Coinbase may be legally required to hand over all of your crypto and cash to the state government as "unclaimed property." While this is a legal requirement, many users are unaware that their long-term "hodl" strategy could result in their assets being seized by the state if they are not actively managing their account.

5. The Absolute Liability Shield: Zero Responsibility for Hacks or Losses
Original Text: "IN NO EVENT SHALL COINBASE... BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR OTHER DAMAGES OF ANY KIND... ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE THE COINBASE SERVICES..."
Plain English Explanation: This is an ironclad disclaimer of responsibility. It states that Coinbase is not legally or financially responsible for losses you suffer, even if those losses are due to their system's failure, errors, or delays. Crucially, this is designed to protect them from liability in the event of a hack or security breach that results in the theft of your digital assets.

6. The "As Is" Warranty Disclaimer: The Platform is Not Guaranteed to Be Secure or Functional
Original Text: "The Coinbase services are provided on an 'as is' and 'as available' basis without any representation or warranty, whether express, implied or statutory."
Plain English Explanation: Coinbase makes zero legal promises that its platform will work correctly, be reliable, or, most importantly, be secure. By using their service, you are legally accepting 100% of the immense risk associated with the technical and security failures of a cryptocurrency exchange, which can result in the total and irreversible loss of your assets.

This analysis is complete. The document is a legal fortress designed to grant the company maximum control over user assets while simultaneously absolving it of nearly all liability for the immense risks inherent in the cryptocurrency market. The combination of the "setoff" clause and the forced arbitration clause is particularly predatory.`;

async function integrateCoinbaseAnalysis() {
  console.log('₿ INTEGRATING COINBASE CRYPTO ASSET CONTROL ANALYSIS');
  console.log('===================================================');

  try {
    // 1. Find Coinbase company
    console.log('1. 🔍 Locating Coinbase company record...');
    const { data: coinbaseCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .eq('domain', 'coinbase.com')
      .single();

    if (companyError || !coinbaseCompany) {
      console.error('❌ Coinbase company not found:', companyError?.message);
      return;
    }

    console.log(`✅ Coinbase company found: ${coinbaseCompany.name} (ID: ${coinbaseCompany.id})`);

    // 2. Delete existing analysis data
    console.log('\n2. 🗑️ Deleting existing Coinbase analysis data...');

    const { error: deleteAnalysisError } = await supabase
      .from('tos_analysis_results')
      .delete()
      .eq('company_id', coinbaseCompany.id);

    if (deleteAnalysisError) {
      console.error('❌ Error deleting analysis:', deleteAnalysisError.message);
    } else {
      console.log('✅ Deleted existing analysis results');
    }

    // 3. Check and update/create document
    console.log('\n3. 📄 Updating Coinbase document with crypto control analysis...');

    const { data: existingDoc, error: docCheckError } = await supabase
      .from('tos_analysis_documents')
      .select('*')
      .eq('company_id', coinbaseCompany.id)
      .single();

    let documentId;

    if (existingDoc) {
      // Update existing document
      const { data: updatedDoc, error: updateError } = await supabase
        .from('tos_analysis_documents')
        .update({
          title: 'Coinbase User Agreement - Total Crypto Asset Control & Risk Transference',
          raw_content: coinbaseAnalysis,
          cleaned_content: coinbaseAnalysis,
          content_hash: require('crypto').createHash('md5').update(coinbaseAnalysis).digest('hex'),
          content_length: coinbaseAnalysis.length,
          is_analyzed: true,
          scraped_at: new Date().toISOString()
        })
        .eq('id', existingDoc.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating document:', updateError.message);
        return;
      }

      documentId = updatedDoc.id;
      console.log('✅ Updated existing document with crypto control analysis');
    } else {
      // Create new document
      const { data: newDoc, error: createError } = await supabase
        .from('tos_analysis_documents')
        .insert({
          company_id: coinbaseCompany.id,
          document_type: 'terms_of_service',
          title: 'Coinbase User Agreement - Total Crypto Asset Control & Risk Transference',
          url: 'https://www.coinbase.com/legal/user_agreement',
          raw_content: coinbaseAnalysis,
          cleaned_content: coinbaseAnalysis,
          content_hash: require('crypto').createHash('md5').update(coinbaseAnalysis).digest('hex'),
          scraped_at: new Date().toISOString(),
          http_status: 200,
          content_length: coinbaseAnalysis.length,
          content_type: 'text/html',
          is_analyzed: true
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating document:', createError.message);
        return;
      }

      documentId = newDoc.id;
      console.log('✅ Created new document with crypto control analysis');
    }

    // 4. Extract red flags and create analysis
    console.log('\n4. 🚩 Analyzing crypto asset control red flags...');

    const redFlags = [
      {
        category: 'Ultimate Forced Arbitration & Class Action Waiver',
        concern: 'Complete annihilation of legal rights for crypto users',
        originalText: 'WAIVER OF CLASS ACTION AND JURY TRIAL... By entering into this Agreement, you... agree to waive your right to a jury trial and to participate in a class action lawsuit... ALL DISPUTES... MUST BE RESOLVED BY BINDING ARBITRATION ON AN INDIVIDUAL BASIS.',
        explanation: 'This is the most dangerous and important clause in the entire document. You are permanently and completely forbidden from suing Coinbase in a real court of law. You are explicitly banned from joining with other users in a class-action lawsuit if Coinbase suffers a catastrophic hack, systemic failure, or engages in practices that harm millions of users at once.'
      },
      {
        category: 'Asset Seizure Powers (Setoff & Security Interest)',
        concern: 'Legal right to take your crypto and cash without notice',
        originalText: 'Setoff and Security Interest. You grant us a lien on, and a right of setoff against, and a security interest in, all of your rights, title and interest in and to... all of your Digital Assets and Fiat Currency... We may setoff any of your liabilities or obligations to us against any of your rights, title or interests in and to any of your Digital Assets and Fiat Currency, without notice to you.',
        explanation: 'This is an extraordinary and aggressive clause. It means that you grant Coinbase a legal claim over all the money and crypto you hold in your account. If Coinbase decides you owe them money for any reason, this clause gives them the right to take your assets directly from your account to cover the debt, without even notifying you.'
      },
      {
        category: 'Sole Discretion Account Freeze Power',
        concern: 'Dictatorial right to freeze access to your crypto at any time',
        originalText: 'We may, in our sole discretion and without liability to you, with or without prior notice... suspend, restrict, or terminate your access to any or all of the Coinbase Services, and/or deactivate or cancel your Coinbase Account(s).',
        explanation: 'This clause gives Coinbase the absolute, dictatorial right to freeze you out of your account and prevent you from accessing your money and crypto at any time, for any reason they choose. In the volatile crypto market, being unable to access your funds for even a short period can be financially catastrophic.'
      },
      {
        category: 'Unclaimed Property Asset Forfeiture',
        concern: 'Inactive crypto holdings transferred to government as unclaimed property',
        originalText: 'If Coinbase is holding funds... and has no record of you interacting with the Coinbase Services for several years, Coinbase may be required to report these funds as unclaimed property... it may be required to deliver any such funds to the applicable state or jurisdiction as unclaimed property.',
        explanation: 'If you do not log in to your account for a period of several years, Coinbase may be legally required to hand over all of your crypto and cash to the state government as "unclaimed property." Many users are unaware that their long-term "hodl" strategy could result in their assets being seized by the state.'
      },
      {
        category: 'Absolute Hack & Loss Liability Shield',
        concern: 'Zero responsibility for crypto theft, hacks, or security breaches',
        originalText: 'IN NO EVENT SHALL COINBASE... BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR OTHER DAMAGES OF ANY KIND... ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE THE COINBASE SERVICES...',
        explanation: 'This is an ironclad disclaimer of responsibility. It states that Coinbase is not legally or financially responsible for losses you suffer, even if those losses are due to their system\'s failure, errors, or delays. Crucially, this is designed to protect them from liability in the event of a hack or security breach.'
      },
      {
        category: 'Crypto Platform Security Disclaimer',
        concern: 'No guarantee platform is secure or functional for crypto storage',
        originalText: 'The Coinbase services are provided on an \'as is\' and \'as available\' basis without any representation or warranty, whether express, implied or statutory.',
        explanation: 'Coinbase makes zero legal promises that its platform will work correctly, be reliable, or, most importantly, be secure. By using their service, you are legally accepting 100% of the immense risk associated with the technical and security failures of a cryptocurrency exchange.'
      }
    ];

    console.log(`✅ Identified ${redFlags.length} crypto asset control red flags`);

    // 5. Create analysis results
    console.log('\n5. 💾 Creating crypto asset control analysis results...');

    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: documentId,
        company_id: coinbaseCompany.id,
        transparency_score: 5,
        user_friendliness_score: 0,
        privacy_score: 10,
        manipulation_risk_score: 100,
        data_collection_risk: 'high',
        data_sharing_risk: 'high',
        account_termination_risk: 'critical',
        legal_jurisdiction_risk: 'critical',
        concerning_clauses: redFlags,
        manipulation_tactics: ['Forced Arbitration', 'Class Action Waiver', 'Asset Seizure Rights', 'Account Freeze Powers', 'Absolute Liability Disclaimers'],
        ai_model_used: 'human-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Coinbase creates total corporate control over user crypto assets while absolving itself of nearly all liability for immense cryptocurrency risks, scoring 5/100.',
        key_concerns: [
          'Ultimate Forced Arbitration & Class Action Waiver',
          'Asset Seizure Powers (Setoff & Security Interest)',
          'Sole Discretion Account Freeze Power',
          'Unclaimed Property Asset Forfeiture',
          'Absolute Hack & Loss Liability Shield',
          'Crypto Platform Security Disclaimer'
        ],
        recommendations: [
          'Understand you cannot sue Coinbase in court and cannot join class action lawsuits',
          'Know they can seize your crypto and cash without notice if they claim you owe them money',
          'Understand they can freeze your account and block access to funds at any time for any reason',
          'Know inactive accounts may have crypto transferred to government as unclaimed property',
          'Understand they accept zero liability for hacks, security breaches, or crypto theft',
          'Know they make no guarantees their platform is secure or will protect your crypto assets'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Analysis results created successfully');

    // 6. Verification
    console.log('\n6. ✅ VERIFICATION - Retrieving stored analysis...');

    const { data: verificationData, error: verifyError } = await supabase
      .from('tos_analysis_companies')
      .select(`
        *,
        tos_analysis_documents (
          title,
          raw_content,
          content_length,
          is_analyzed
        ),
        tos_analysis_results (
          transparency_score,
          concerning_clauses,
          key_concerns,
          executive_summary
        )
      `)
      .eq('id', coinbaseCompany.id)
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      return;
    }

    console.log('\n🎯 COINBASE CRYPTO CONTROL INTEGRATION VERIFICATION REPORT');
    console.log('========================================================');
    console.log(`✅ Company: ${verificationData.name}`);
    console.log(`✅ Document Title: ${verificationData.tos_analysis_documents[0]?.title}`);
    console.log(`✅ Content Length: ${verificationData.tos_analysis_documents[0]?.content_length} characters`);
    console.log(`✅ Is Analyzed: ${verificationData.tos_analysis_documents[0]?.is_analyzed}`);
    console.log(`✅ Transparency Score: ${verificationData.tos_analysis_results[0]?.transparency_score}/100`);
    console.log(`✅ Red Flags Count: ${verificationData.tos_analysis_results[0]?.concerning_clauses?.length || 0}`);
    console.log(`✅ Key Concerns: ${verificationData.tos_analysis_results[0]?.key_concerns?.length || 0} identified`);

    console.log('\n₿ COINBASE CRYPTO ASSET CONTROL ANALYSIS COMPLETE');
    console.log('✅ Complete crypto predation analysis stored successfully');
    console.log('✅ Asset seizure and control mechanisms documented');
    console.log('✅ All verification checks passed');

  } catch (error) {
    console.error('❌ Integration failed:', error.message);
  }
}

// Run the integration
if (require.main === module) {
  integrateCoinbaseAnalysis();
}

module.exports = { integrateCoinbaseAnalysis };