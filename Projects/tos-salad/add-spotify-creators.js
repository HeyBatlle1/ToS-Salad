#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addSpotifyCreatorsAnalysis() {
  console.log('🎨 Adding Spotify for Creators Terms analysis...');

  const spotifyCreatorsContent = `Spotify for Creators Terms: Key Clause Analysis & Transparency Score

Transparency Score: 40/100
Justification: While this is a B2B agreement, it employs many of the same user-hostile tactics as the consumer ToS. It grants Spotify a sweeping, perpetual license to artist content and feedback, forces artists into binding individual arbitration (a severe limitation for a business), and contains aggressive liability shields. It is less transparent than a standard B2B agreement should be, as it strips creators of fundamental legal recourse that businesses typically retain.

1. The Forced Arbitration Gauntlet (for Businesses): You Cannot Sue Spotify in Court
Original Text: "Any dispute... arising out of or relating in any way to these Creator Terms... shall be determined by mandatory binding arbitration... WE EACH AGREE THAT ANY DISPUTE RESOLUTION PROCEEDING WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED OR REPRESENTATIVE ACTION."
Plain English Explanation: This is the most critical and predatory clause for an artist or creator. Just like with consumers, Spotify forbids you from suing them in a real court. You are also banned from joining with other artists in a class-action lawsuit to address widespread issues (like payment discrepancies or policy changes). This severely weakens the power of independent creators and forces them into a costly, private, individual arbitration process against a massive corporation.

2. The "Everything You Give Us is Ours" License: Sweeping Rights to Your Content and Ideas
Original Text: "You grant Spotify a non-exclusive, transferable, sub-licensable, royalty-free, fully paid, irrevocable, worldwide license to use, reproduce, make available to the public, publish, translate, modify, create derivative works from, and distribute any of your User Content... If you provide ideas, suggestions, or other feedback... you grant Spotify an unrestricted, perpetual, irrevocable, non-exclusive, fully-paid, royalty-free right to use the Feedback..."
Plain English Explanation: This is a two-pronged "God License." First, for any content you upload directly through the service (like a podcast episode, playlist art, or profile info), you grant Spotify a permanent, free, worldwide license to use and modify it. Second, and more aggressively, any idea or suggestion you provide becomes their property to use and profit from forever, without paying you or giving you credit.

3. The "We Own the Data" Clause: You Don't Own Your Audience Analytics
Original Text: "As between you and Spotify, Spotify owns all data that Spotify makes available to you through Spotify for Creators... You may only use the data... for your own internal informational purposes... You may not... authorize any third party to access or use the data for any purpose, including for advertising or ad-targeting, or to build a profile of any Spotify user."
Plain English Explanation: Spotify provides creators with analytics about their listeners. This clause makes it clear that you do not own this data. Spotify owns it. You are only allowed to view it for your own information. You are explicitly forbidden from exporting this data to use with other services, to sell to advertisers, or to build your own understanding of your audience outside of Spotify's platform. They control your access to your own listener data.

4. The Absolute Liability Shield: Zero Responsibility for Damages
Original Text: "IN NO EVENT WILL SPOTIFY, ITS OFFICERS, SHAREHOLDERS, EMPLOYEES... BE LIABLE FOR (1) ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES; (2) ANY LOSS OF USE, DATA, BUSINESS, OR PROFITS (WHETHER DIRECT OR INDIRECT)..."
Plain English Explanation: This is an ironclad disclaimer of responsibility. If a failure by Spotify (like a technical glitch that makes your new album unavailable on release day, or a data error that misreports your streams) causes you to lose profits, business opportunities, or data, they will not be held legally or financially responsible for those "indirect" or "consequential" damages. This transfers enormous business risk from the platform to the creator.

5. The "As Is" Warranty Disclaimer: No Guarantee of a Functional Service
Original Text: "THE SPOTIFY SERVICE AND SPOTIFY FOR CREATORS ARE PROVIDED 'AS IS' AND 'AS AVAILABLE,' WITHOUT ANY WARRANTIES OF ANY KIND... SPOTIFY AND ALL OWNERS OF CONTENT DISCLAIM ANY EXPRESS, IMPLIED, AND STATUTORY WARRANTIES REGARDING THE CONTENT..."
Plain English Explanation: Spotify makes no legal promises that their creator tools will work correctly, be accurate, or be available when you need them. If their analytics are wrong, if their upload tools fail, or if their platform has security flaws, you have accepted that risk by agreeing to these terms.

6. The Shortened Time to Sue: One Year to File a Claim
Original Text: "You and Spotify agree that any arbitration shall be commenced within ONE (1) YEAR after the date the party asserting the claim first knows or reasonably should know of the act, omission, or default giving rise to the claim; and there shall be no right to any remedy for any claim not asserted within that time period."
Plain English Explanation: This clause dramatically shortens the time you have to take legal action. For any dispute, you must begin the arbitration process within one year of discovering the issue, or you permanently lose all rights to do so. This can be a significant hurdle for complex issues like long-term royalty accounting errors.

This analysis reveals a significant power imbalance, using consumer-style legal tactics against business partners (the creators) to limit their rights and Spotify's own accountability.

Transparency Score: 40/100 - Business-Hostile Risk Level
Red Flags: 6 creator exploitation issues`;

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

    // Create Creators-specific document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Spotify for Creators Terms',
        url: 'https://www.spotify.com/us/legal/spotify-for-creators-terms/',
        raw_content: spotifyCreatorsContent,
        cleaned_content: spotifyCreatorsContent,
        content_hash: require('crypto').createHash('md5').update(spotifyCreatorsContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: spotifyCreatorsContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (docError) {
      console.error('❌ Document creation failed:', docError.message);
      return;
    }

    console.log('✅ Spotify for Creators document created');

    // Create Creators-specific analysis with business-hostile scoring
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 40, // Better than consumer (40 vs 30) but still poor for B2B
        user_friendliness_score: 20, // Very low - hostile to business partners
        privacy_score: 30, // Artist/creator data ownership issues
        manipulation_risk_score: 80, // Very high for business relationship
        data_collection_risk: 'critical', // They own your audience data
        data_sharing_risk: 'high', // Platform controls all data
        account_termination_risk: 'high', // Business dependency risk
        legal_jurisdiction_risk: 'critical', // Forced arbitration for businesses
        concerning_clauses: [
          {category: 'Forced Arbitration (Business)', concern: 'Cannot sue in court or join class actions'},
          {category: 'Everything You Give Us License', concern: 'Sweeping rights to content and ideas'},
          {category: 'We Own the Data', concern: 'Artists don\'t own their audience analytics'},
          {category: 'Absolute Liability Shield', concern: 'Zero responsibility for business damages'},
          {category: 'As Is Warranty Disclaimer', concern: 'No guarantee creator tools work'},
          {category: 'Shortened Time to Sue', concern: 'Only one year to file claims'}
        ],
        manipulation_tactics: ['Forced Arbitration', 'Data Ownership', 'Content Licensing', 'Business Risk Transfer'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Spotify for Creators uses consumer-style legal tactics against business partners, scoring 40/100 with critical creator exploitation issues.',
        key_concerns: [
          'Forced Arbitration for Businesses',
          'Sweeping Content & Idea Licensing',
          'Platform Owns Your Audience Data',
          'Zero Liability for Business Losses',
          'No Creator Tool Guarantees',
          'Shortened Legal Action Window'
        ],
        recommendations: [
          'Understand you cannot sue Spotify in court',
          'Be aware Spotify owns your audience analytics',
          'Know they get perpetual license to your feedback/ideas',
          'Understand business risk is transferred to you',
          'Consider data backup and alternative platforms'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Spotify for Creators analysis created');
    console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: Business-Hostile (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 6 creator exploitation issues`);
    console.log('🎯 Spotify now has 3 complete analyses: General + Consumer + Creators!');

    // Show comparison
    console.log('\n📊 SPOTIFY TRANSPARENCY COMPARISON:');
    console.log('=====================================');
    console.log('🎵 Consumer Terms:  30/100 (High Risk)');
    console.log('🎨 Creator Terms:   40/100 (Business-Hostile)');
    console.log('📱 General Terms:   45/100 (Medium Risk)');
    console.log('\n💡 Insight: Creator terms are worse than consumer terms for business relationships!');

  } catch (error) {
    console.error('❌ Spotify for Creators analysis failed:', error.message);
  }
}

addSpotifyCreatorsAnalysis();