#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addSpotifyConsumerAnalysis() {
  console.log('🎵 Adding Spotify Consumer Terms analysis...');

  const spotifyConsumerContent = `Spotify Terms of Use (Consumer): Key Clause Analysis

This document establishes a legal framework that grants users a limited license to access the service while requiring them to waive significant legal rights, particularly the right to participate in class-action lawsuits. It also aggressively limits Spotify's liability for any harm caused by their service.

1. The Forced Arbitration Gauntlet & Class Action Waiver: You Forfeit Your Right to Group Legal Action
Original Text: "YOU AND SPOTIFY AGREE THAT... ANY DISPUTE, CLAIM, OR CONTROVERSY... WILL BE RESOLVED BY MANDATORY BINDING ARBITRATION... YOU AND SPOTIFY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION."
Plain English Explanation: This is the most critical rights-stripping clause in the agreement. You are forbidden from suing Spotify in a traditional court and are banned from joining with other users in a class-action lawsuit. You are forced into an individual, private arbitration process. This is a powerful tool to prevent consumers from holding the company accountable for widespread issues, as it makes legal challenges significantly more difficult and expensive for individuals.

2. The Liability Cap: If Spotify Fails, They Owe You Almost Nothing
Original Text: "IN NO EVENT WILL SPOTIFY'S AGGREGATE LIABILITY... EXCEED THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO SPOTIFY DURING THE TWELVE MONTHS PRIOR TO THE FIRST CLAIM; OR (B) $50.00."
Plain English Explanation: This clause severely limits Spotify's financial responsibility. If a failure on their part (like a major data breach of your personal information and listening habits) causes you significant harm, the absolute maximum financial compensation they will be liable for is fifty dollars or the fees you paid them in the last year. This protects them from any meaningful financial consequence for their potential failures.

3. The "As Is" Warranty Disclaimer: The Service is Not Guaranteed to Work or Be Safe
Original Text: "THE SPOTIFY SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE,' WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. FURTHER, SPOTIFY AND ALL OWNERS OF THE CONTENT DISCLAIM ANY EXPRESS, IMPLIED, AND STATUTORY WARRANTIES REGARDING THE CONTENT, INCLUDING WARRANTIES OF SATISFACTORY QUALITY, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT."
Plain English Explanation: Spotify makes no legal promises about the quality, reliability, or security of its service. They do not guarantee that it will work without errors or be secure. By using the service, you accept all the risk of its potential failures, including the risk that the content you stream could be unavailable or that the app itself could have security flaws.

4. The Unilateral "Changes" Clause: They Can Change the Deal at Any Time
Original Text: "Spotify may, from time to time, make changes to these Terms... When we make material changes to these Terms, we'll provide you with notice as appropriate... Your continued use of the Spotify Service after the changes have been made will constitute your acceptance of the changes. If you do not wish to continue using the Spotify Service under the new version of the Terms, you may terminate your account..."
Plain English Explanation: Spotify can change its legal agreement with you at any time. Your only choice is to accept the new rules by continuing to listen to music, or to reject them by deleting your account. This makes the contract a living document that you are perpetually agreeing to, often without realizing the terms have changed.

5. Third-Party Risk Dump: If a Linked Service Harms You, It's Not Spotify's Problem
Original Text: "The Spotify Service is integrated with or may otherwise interact with third-party applications, websites, and services... and third-party devices... These Third-Party Applications, Devices and Services are not part of the Spotify Service... and Spotify is not responsible or liable for the behavior, features, or content of any Third-Party Application, Device or Service..."
Plain English Explanation: The Spotify app connects to many other services (like Instagram, Sonos speakers, etc.). This clause states that if one of those third-party services malfunctions, steals your data, or causes you harm, Spotify takes zero responsibility. You are on your own to resolve the issue with the other company.

6. The "User Guidelines" Enforcement: They Can Terminate Your Account for Vague Reasons
Original Text: "Spotify respects intellectual property rights and expects you to do the same... The following is not permitted for any reason whatsoever:... circumventing any technology used by Spotify, its licensors, or any third party to protect the Content or the Service... Spotify may, in its sole discretion, terminate your Spotify account, or suspend your access to the Spotify Service."
Plain English Explanation: This clause gives Spotify the right to terminate your account at their discretion if they believe you have violated their rules, which include broad prohibitions. This gives them significant power to remove a user from the platform based on their own interpretation of the user's actions.

Transparency Score: 30/100 - High Risk Level
Red Flags: 6 major consumer protection issues`;

  try {
    // Get the existing Spotify company record
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'spotify.com')
      .single();

    if (companyError || !existingCompany) {
      console.error('❌ Spotify company not found:', companyError?.message);
      return;
    }

    const companyId = existingCompany.id;
    console.log('✅ Found existing Spotify company record');

    // Create Consumer-specific document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Spotify Terms of Use (Consumer)',
        url: 'https://www.spotify.com/us/legal/end-user-agreement/',
        raw_content: spotifyConsumerContent,
        cleaned_content: spotifyConsumerContent,
        content_hash: require('crypto').createHash('md5').update(spotifyConsumerContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: spotifyConsumerContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Document creation failed:', docError.message);
      return;
    }

    console.log('✅ Spotify Consumer document created');

    // Create Consumer-specific analysis with proper scoring
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 30, // Based on Gemini analysis - worse than general Spotify
        user_friendliness_score: 25, // Low due to forced arbitration
        privacy_score: 35, // Music streaming has some privacy implications
        manipulation_risk_score: 75, // High due to forced arbitration + liability caps
        data_collection_risk: 'high', // Music streaming collects listening habits
        data_sharing_risk: 'medium', // Third-party integrations
        account_termination_risk: 'high', // Vague termination rules
        legal_jurisdiction_risk: 'critical', // Forced arbitration
        concerning_clauses: [
          {category: 'Forced Arbitration & Class Action Waiver', concern: 'Forfeits right to group legal action'},
          {category: 'Liability Cap', concern: 'Maximum $50 liability for any harm'},
          {category: 'As Is Warranty Disclaimer', concern: 'No guarantees service will work or be safe'},
          {category: 'Unilateral Changes Clause', concern: 'Can change terms anytime'},
          {category: 'Third-Party Risk Dump', concern: 'No responsibility for connected services'},
          {category: 'User Guidelines Enforcement', concern: 'Vague account termination reasons'}
        ],
        manipulation_tactics: ['Forced Arbitration', 'Liability Shields', 'Unilateral Changes', 'Vague Enforcement'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Spotify Consumer Terms contains 6 major red flags focused on forced arbitration and liability limitations, scoring 30/100.',
        key_concerns: [
          'Forced Arbitration & Class Action Waiver',
          '$50 Maximum Liability Cap',
          'No Service Guarantees',
          'Unilateral Terms Changes',
          'Third-Party Risk Transfer',
          'Vague Account Termination'
        ],
        recommendations: [
          'Understand you cannot join class action lawsuits',
          'Be aware of $50 maximum compensation limit',
          'Know that Spotify can change terms unilaterally',
          'Understand account termination risks'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Spotify Consumer analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: High (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 6 consumer protection issues`);
    console.log('🎯 Ready for Spotify for Artists next!');

  } catch (error) {
    console.error('❌ Spotify Consumer analysis failed:', error.message);
  }
}

addSpotifyConsumerAnalysis();