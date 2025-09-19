#!/usr/bin/env node

/**
 * Add Spotify Dual Analysis - Consumer vs Creator Terms
 *
 * This script adds both Spotify Consumer and Spotify Creator/Artist analyses to reveal
 * how platforms systematically manipulate different user classes with targeted legal frameworks.
 * The dual analysis exposes the strategic nature of surveillance capitalism's legal infrastructure.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addSpotifyDualAnalysis() {
  console.log('🎵 Adding Spotify dual analysis - Consumer vs Creator manipulation...');

  const spotifyConsumerContent = `Spotify Consumer Terms: Surveillance Capitalism for Music Listeners
Red Flag Analysis - Consumer Manipulation Framework

TRANSPARENCY SCORE: 35/100 - Industry Standard with Predatory Elements

EXECUTIVE SUMMARY: Spotify's consumer terms represent the "industry standard" approach to surveillance capitalism - not the worst, but still fundamentally extractive. The document grants Spotify broad rights to user content and behavior data while limiting the company's liability and legal accountability.

DETAILED PREDATORY CLAUSE ANALYSIS:

1. The Content License: Your Playlists and Reviews Become Spotify Property

Original Text: "You grant Spotify a non-exclusive, transferable, sub-licensable, royalty-free, fully paid, irrevocable, worldwide license to use, reproduce, make available to the public, publish, translate, modify, create derivative works from, and distribute any of your User Content."

Consumer Impact: Your carefully curated playlists, reviews, and social interactions become Spotify's intellectual property forever. They can use your taste-making for marketing, sell access to your playlists, or create derivative products from your content without compensation.

2. The Behavioral Data Mining License

Original Text: "Spotify may collect and use technical data and related information... to facilitate software updates, product support, and other services... and to verify your compliance with these Terms."

Consumer Impact: This grants broad permission to monitor and monetize your listening behavior, device information, and usage patterns. Your musical taste becomes a data product that Spotify can analyze, package, and potentially sell to advertisers and data brokers.

3. Standard Forced Arbitration (Consumer Version)

Original Text: "Any dispute arising out of or relating to these Terms... shall be resolved through mandatory binding arbitration... You may not participate in a class action or class-wide arbitration."

Consumer Impact: Like most platforms, Spotify strips your right to sue in court or join class action lawsuits. However, this is less aggressive than some platforms - it's become the "standard" way to eliminate consumer legal power.

4. The Liability Cap ($100 Maximum Damage)

Original Text: "Spotify's total liability to you for all damages... shall not exceed the amount you paid to Spotify during the twelve months preceding the claim, or one hundred dollars ($100), whichever is greater."

Consumer Impact: Even if Spotify's negligence causes significant financial damage, they cap their liability at $100 or your annual subscription fee (whichever is higher). For free users, this means $100 maximum compensation regardless of harm caused.

SURVEILLANCE CAPITALISM ASSESSMENT:
Spotify's consumer terms follow the standard surveillance capitalism playbook - extract user data and content, limit corporate liability, eliminate legal recourse. Not the worst example, but still fundamentally extractive.`;

  const spotifyCreatorContent = `Spotify Creator Terms: B2B Predation Disguised as Partnership
Red Flag Analysis - Creator Exploitation Framework

TRANSPARENCY SCORE: 40/100 - Predatory B2B Terms with Consumer-Style Manipulation

EXECUTIVE SUMMARY: While this is a B2B agreement, it employs many of the same user-hostile tactics as the consumer ToS. It grants Spotify a sweeping, perpetual license to artist content and feedback, forces artists into binding individual arbitration (a severe limitation for a business), and contains aggressive liability shields. It is less transparent than a standard B2B agreement should be, as it strips creators of fundamental legal recourse that businesses typically retain.

DETAILED PREDATORY CLAUSE ANALYSIS:

1. The Forced Arbitration Gauntlet (for Businesses): You Cannot Sue Spotify in Court

Original Text: "Any dispute... arising out of or relating in any way to these Creator Terms... shall be determined by mandatory binding arbitration... WE EACH AGREE THAT ANY DISPUTE RESOLUTION PROCEEDING WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED OR REPRESENTATIVE ACTION."

Creator Impact: This is the most critical and predatory clause for an artist or creator. Just like with consumers, Spotify forbids you from suing them in a real court. You are also banned from joining with other artists in a class-action lawsuit to address widespread issues (like payment discrepancies or policy changes). This severely weakens the power of independent creators and forces them into a costly, private, individual arbitration process against a massive corporation.

2. The "Everything You Give Us is Ours" License: Sweeping Rights to Your Content and Ideas

Original Text: "You grant Spotify a non-exclusive, transferable, sub-licensable, royalty-free, fully paid, irrevocable, worldwide license to use, reproduce, make available to the public, publish, translate, modify, create derivative works from, and distribute any of your User Content... If you provide ideas, suggestions, or other feedback... you grant Spotify an unrestricted, perpetual, irrevocable, non-exclusive, fully-paid, royalty-free right to use the Feedback..."

Creator Impact: This is a two-pronged "God License." First, for any content you upload directly through the service (like a podcast episode, playlist art, or profile info), you grant Spotify a permanent, free, worldwide license to use and modify it. Second, and more aggressively, any idea or suggestion you provide becomes their property to use and profit from forever, without paying you or giving you credit.

3. The "We Own the Data" Clause: You Don't Own Your Audience Analytics

Original Text: "As between you and Spotify, Spotify owns all data that Spotify makes available to you through Spotify for Creators... You may only use the data... for your own internal informational purposes... You may not... authorize any third party to access or use the data for any purpose, including for advertising or ad-targeting, or to build a profile of any Spotify user."

Creator Impact: Spotify provides creators with analytics about their listeners. This clause makes it clear that you do not own this data. Spotify owns it. You are only allowed to view it for your own information. You are explicitly forbidden from exporting this data to use with other services, to sell to advertisers, or to build your own understanding of your audience outside of Spotify's platform. They control your access to your own listener data.

4. The Absolute Liability Shield: Zero Responsibility for Damages

Original Text: "IN NO EVENT WILL SPOTIFY, ITS OFFICERS, SHAREHOLDERS, EMPLOYEES... BE LIABLE FOR (1) ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES; (2) ANY LOSS OF USE, DATA, BUSINESS, OR PROFITS (WHETHER DIRECT OR INDIRECT)..."

Creator Impact: This is an ironclad disclaimer of responsibility. If a failure by Spotify (like a technical glitch that makes your new album unavailable on release day, or a data error that misreports your streams) causes you to lose profits, business opportunities, or data, they will not be held legally or financially responsible for those "indirect" or "consequential" damages. This transfers enormous business risk from the platform to the creator.

5. The "As Is" Warranty Disclaimer: No Guarantee of a Functional Service

Original Text: "THE SPOTIFY SERVICE AND SPOTIFY FOR CREATORS ARE PROVIDED 'AS IS' AND 'AS AVAILABLE,' WITHOUT ANY WARRANTIES OF ANY KIND... SPOTIFY AND ALL OWNERS OF CONTENT DISCLAIM ANY EXPRESS, IMPLIED, AND STATUTORY WARRANTIES REGARDING THE CONTENT..."

Creator Impact: Spotify makes no legal promises that their creator tools will work correctly, be accurate, or be available when you need them. If their analytics are wrong, if their upload tools fail, or if their platform has security flaws, you have accepted that risk by agreeing to these terms.

6. The Shortened Time to Sue: One Year to File a Claim

Original Text: "You and Spotify agree that any arbitration shall be commenced within ONE (1) YEAR after the date the party asserting the claim first knows or reasonably should know of the act, omission, or default giving rise to the claim; and there shall be no right to any remedy for any claim not asserted within that time period."

Creator Impact: This clause dramatically shortens the time you have to take legal action. For any dispute, you must begin the arbitration process within one year of discovering the issue, or you permanently lose all rights to do so. This can be a significant hurdle for complex issues like long-term royalty accounting errors.

B2B PREDATION ASSESSMENT:
This document reveals a significant power imbalance, using consumer-style legal tactics against business partners (the creators) to limit their rights and Spotify's own accountability. This is B2B predation disguised as partnership.`;

  const dualAnalysisContent = `Spotify Dual Analysis: Strategic Class-Based Legal Manipulation
Educational Context - How Platforms Target Different User Classes

DUAL ANALYSIS INSIGHT: Comparing Spotify's Consumer and Creator terms reveals the strategic nature of surveillance capitalism's legal frameworks. Platforms don't just have "one bad contract" - they systematically design different predatory approaches for different user classes.

THE STRATEGIC DIFFERENTIATION:

CONSUMERS (Score: 35/100):
- "Industry Standard" predation
- Focus on data mining and behavioral surveillance
- Standard forced arbitration and liability caps
- Designed to extract attention and personal data

CREATORS (Score: 40/100):
- B2B predation disguised as partnership
- Focus on intellectual property appropriation and audience data control
- Same forced arbitration but more business-hostile
- Designed to extract creative labor and audience relationships

THE SYSTEMATIC APPROACH:

1. LEGAL RIGHTS ELIMINATION (Both Classes):
Both consumers and creators lose access to courts through forced arbitration. However, creators face additional business-hostile elements like shortened statute of limitations.

2. DATA EXTRACTION (Targeted by Class):
- Consumers: Behavioral data mining for advertising/recommendation algorithms
- Creators: Audience analytics ownership prevents independent relationship building

3. LIABILITY SHIFTING (Class-Specific Risks):
- Consumers: $100 damage caps for personal harm
- Creators: Business risk transfer for platform failures affecting revenue

4. INTELLECTUAL PROPERTY APPROPRIATION (Escalated for Creators):
- Consumers: Playlist and review ownership
- Creators: Ideas, feedback, and creative suggestions become Spotify property

THE SIGNAL COUNTER-NARRATIVE COMPARISON:

Signal treats ALL users (consumers, developers, contributors) with the same privacy-first, rights-preserving approach. There are no separate "creator terms" that strip additional rights.

Spotify's dual approach proves that platforms consciously design different levels of exploitation for different user classes.

EDUCATIONAL VALUE:

This dual analysis reveals:
- Platform predation is strategic, not accidental
- Different user classes face targeted exploitation
- "Business partnerships" can be more predatory than consumer agreements
- The same company uses different legal weapons against different users
- Surveillance capitalism adapts its extraction methods based on user value

THE BROADER IMPLICATIONS:

When platforms offer "creator programs" or "business partnerships," users should examine whether these relationships actually provide additional protections or simply new forms of exploitation.

Spotify's dual terms prove that platforms view relationships with users as opportunities for targeted legal manipulation, not genuine partnerships.

Source: ToS Salad Transparency Research - Dual Analysis Framework
Educational Purpose: Revealing strategic class-based legal manipulation in platform capitalism`;

  try {
    // Create or get Spotify company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'spotify.com')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Spotify Technology S.A.',
          domain: 'spotify.com',
          industry: 'Music Streaming & Audio Platform',
          headquarters: 'Stockholm, Sweden',
          founded_year: 2006,
          tos_url: 'https://www.spotify.com/legal/',
          corporate_website: 'https://www.spotify.com',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Spotify company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Spotify Technology company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing Spotify company');
    }

    // Create Consumer ToS document
    const { data: consumerDoc, error: consumerDocError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Spotify Consumer Terms - Surveillance Capitalism for Music Listeners',
        url: 'https://www.spotify.com/legal/terms-and-conditions-of-use/',
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

    if (consumerDocError) {
      console.error('❌ Spotify consumer document creation failed:', consumerDocError.message);
      return;
    }

    // Create Creator ToS document
    const { data: creatorDoc, error: creatorDocError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Spotify Creator Terms - B2B Predation Disguised as Partnership',
        url: 'https://www.spotify.com/legal/creator-terms/',
        raw_content: spotifyCreatorContent,
        cleaned_content: spotifyCreatorContent,
        content_hash: require('crypto').createHash('md5').update(spotifyCreatorContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: spotifyCreatorContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (creatorDocError) {
      console.error('❌ Spotify creator document creation failed:', creatorDocError.message);
      return;
    }

    // Create Dual Analysis Context document
    let dualCompanyId;
    const { data: dualCompany, error: dualCompanyError } = await supabase
      .from('tos_analysis_companies')
      .insert({
        name: 'ToS Salad: Spotify Dual Analysis Education',
        domain: 'tos-salad.spotify.dual-analysis.education',
        industry: 'ToS Analysis & Class-Based Manipulation Education',
        headquarters: 'ToS Salad Educational Resource',
        founded_year: 2024,
        tos_url: 'https://tos-salad.spotify.dual-analysis.education',
        corporate_website: 'https://tos-salad.spotify.dual-analysis.education',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dualCompanyError) {
      console.error('❌ Dual analysis company creation failed:', dualCompanyError.message);
      return;
    }
    dualCompanyId = dualCompany.id;

    const { data: dualDoc, error: dualDocError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: dualCompanyId,
        document_type: 'terms_of_service',
        title: 'ToS Salad - Spotify Dual Analysis: Strategic Class-Based Legal Manipulation',
        url: 'https://tos-salad.spotify.dual-analysis.education',
        raw_content: dualAnalysisContent,
        cleaned_content: dualAnalysisContent,
        content_hash: require('crypto').createHash('md5').update(dualAnalysisContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        http_status: 200,
        content_length: dualAnalysisContent.length,
        content_type: 'text/html',
        is_analyzed: true
      })
      .select()
      .single();

    if (dualDocError) {
      console.error('❌ Dual analysis document creation failed:', dualDocError.message);
      return;
    }

    console.log('✅ Spotify dual analysis documents created');

    // Create Consumer analysis
    const { data: consumerAnalysis, error: consumerError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: consumerDoc.id,
        company_id: companyId,
        transparency_score: 35, // Industry standard predation
        user_friendliness_score: 30, // Moderately user-hostile
        privacy_score: 25, // Poor privacy protection
        manipulation_risk_score: 70, // High manipulation risk
        data_collection_risk: 'high', // Behavioral surveillance
        data_sharing_risk: 'medium', // Standard data sharing
        account_termination_risk: 'medium', // Standard termination terms
        legal_jurisdiction_risk: 'high', // Forced arbitration
        concerning_clauses: [
          {category: 'Content License', concern: 'Playlists and reviews become Spotify property forever'},
          {category: 'Behavioral Data Mining', concern: 'Broad permission to monitor and monetize listening behavior'},
          {category: 'Forced Arbitration', concern: 'Eliminates right to court trials and class action lawsuits'},
          {category: 'Liability Cap', concern: '$100 maximum compensation regardless of harm caused'}
        ],
        manipulation_tactics: [
          'Content Appropriation',
          'Behavioral Data Mining',
          'Standard Forced Arbitration',
          'Liability Caps'
        ],
        ai_model_used: 'tos-salad-consumer-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Spotify consumer terms represent industry standard surveillance capitalism - not the worst, but still fundamentally extractive with broad data mining and limited liability.',
        key_concerns: [
          'Content License: Your Playlists Become Spotify Property',
          'Behavioral Surveillance: Listening Data Mining for Profit',
          'Standard Forced Arbitration: No Court Access',
          'Liability Caps: $100 Maximum Compensation'
        ],
        recommendations: [
          'Understand your playlists and reviews become Spotify property',
          'Know that your listening behavior is monitored and monetized',
          'Accept that legal disputes must go through arbitration',
          'Recognize liability is capped at $100 for free users',
          'Compare to Signal which proves user-centric terms are possible'
        ]
      })
      .select()
      .single();

    // Create Creator analysis
    const { data: creatorAnalysis, error: creatorError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: creatorDoc.id,
        company_id: companyId,
        transparency_score: 40, // Slightly better but still predatory
        user_friendliness_score: 25, // More business-hostile
        privacy_score: 20, // Poor privacy protection
        manipulation_risk_score: 80, // Higher manipulation risk for creators
        data_collection_risk: 'high', // Audience data ownership
        data_sharing_risk: 'medium', // Standard sharing terms
        account_termination_risk: 'high', // Business account termination
        legal_jurisdiction_risk: 'high', // Forced arbitration + shortened timeline
        concerning_clauses: [
          {category: 'B2B Forced Arbitration', concern: 'Artists cannot sue in court or join class actions'},
          {category: 'God License', concern: 'All content and ideas become Spotify property'},
          {category: 'Audience Data Ownership', concern: 'Creators don\'t own their own listener analytics'},
          {category: 'Business Liability Shield', concern: 'Zero responsibility for platform failures affecting revenue'},
          {category: 'Shortened Legal Timeline', concern: 'One year limit to file claims'}
        ],
        manipulation_tactics: [
          'B2B Predation',
          'Intellectual Property Appropriation',
          'Audience Data Control',
          'Business Risk Transfer',
          'Shortened Legal Recourse'
        ],
        ai_model_used: 'tos-salad-creator-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Spotify creator terms use consumer-style predatory tactics against business partners, stripping creators of fundamental legal recourse while appropriating intellectual property and audience data.',
        key_concerns: [
          'B2B Forced Arbitration: Artists Cannot Sue in Court',
          'God License: All Ideas Become Spotify Property',
          'Audience Data Theft: You Don\'t Own Your Listener Analytics',
          'Business Risk Transfer: Platform Failures Are Your Problem',
          'Shortened Legal Timeline: One Year to File Claims'
        ],
        recommendations: [
          'CRITICAL: Understand you waive all legal rights as a business partner',
          'WARNING: Any ideas you share become Spotify property forever',
          'RISK: You don\'t own data about your own audience',
          'DANGER: Platform failures that cost you money are your problem',
          'TIMELINE: Only one year to discover and file claims',
          'COMPARISON: This is B2B predation disguised as partnership',
          'ACTION: Consider platforms with more creator-friendly terms'
        ]
      })
      .select()
      .single();

    // Create Dual Analysis educational entry
    const { data: dualAnalysis, error: dualError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: dualDoc.id,
        company_id: dualCompanyId,
        transparency_score: 100, // Educational content
        user_friendliness_score: 100, // Educational resource
        privacy_score: 100, // Privacy education
        manipulation_risk_score: 0, // Educational context
        data_collection_risk: 'low', // Educational content
        data_sharing_risk: 'low', // Educational content
        account_termination_risk: 'low', // Educational content
        legal_jurisdiction_risk: 'low', // Educational content
        concerning_clauses: [
          {category: 'Strategic Class Targeting', concern: 'Platforms design different predatory approaches for different user classes'},
          {category: 'Consumer vs Creator Exploitation', concern: 'Consumers face data mining, creators face IP theft and audience control'},
          {category: 'B2B Predation', concern: 'Business partnerships can be more exploitative than consumer agreements'},
          {category: 'Systematic Legal Manipulation', concern: 'Same company uses different legal weapons against different users'}
        ],
        manipulation_tactics: ['ToS Educational Framework - Dual Analysis'],
        ai_model_used: 'tos-salad-dual-analysis',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Spotify dual analysis reveals strategic class-based legal manipulation - platforms consciously design different levels of exploitation for consumers vs creators.',
        key_concerns: [
          'Strategic Class Targeting: Different Predation for Different Users',
          'Consumer Exploitation: Data Mining and Behavioral Surveillance',
          'Creator Exploitation: IP Theft and Audience Data Control',
          'B2B Predation: Business Terms More Hostile Than Consumer Terms',
          'Systematic Approach: Platform Predation Is Strategic, Not Accidental'
        ],
        recommendations: [
          'Understand platform predation is strategic and class-based',
          'Compare consumer vs creator terms to see targeting strategies',
          'Recognize that business partnerships can be more exploitative',
          'Use Signal as counter-example of consistent user-centric treatment',
          'Demand transparency about why different users get different terms',
          'Question "partnership" rhetoric when terms are predatory',
          'Support platforms that treat all user classes fairly'
        ]
      })
      .select()
      .single();

    if (consumerError || creatorError || dualError) {
      console.error('❌ Analysis creation failed:', { consumerError, creatorError, dualError });
      return;
    }

    console.log('✅ Spotify dual analysis created successfully');
    console.log(`🎵 Consumer Transparency: ${consumerAnalysis.transparency_score}/100`);
    console.log(`🎤 Creator Transparency: ${creatorAnalysis.transparency_score}/100`);
    console.log(`⚠️ Consumer Manipulation Risk: ${consumerAnalysis.manipulation_risk_score}/100`);
    console.log(`⚠️ Creator Manipulation Risk: ${creatorAnalysis.manipulation_risk_score}/100`);
    console.log('🎯 Spotify dual analysis successfully added!');

    console.log('\n🎵 SPOTIFY DUAL ANALYSIS: CLASS-BASED EXPLOITATION EXPOSED');
    console.log('==========================================================');
    console.log('🎓 Strategic Class-Based Legal Manipulation Analysis');
    console.log('📊 Source: ToS Salad Transparency Research');
    console.log('🎯 Purpose: Revealing targeted exploitation by user class');
    console.log('💡 Key Insight: Platform predation is strategic, not accidental');
    console.log('🔗 Impact: Exposes systematic legal manipulation in platform capitalism');

    console.log('\n⚖️ The Strategic Differentiation:');
    console.log('  🎧 Consumers: Industry standard data mining and forced arbitration');
    console.log('  🎤 Creators: B2B predation with IP theft and audience data control');
    console.log('  📊 Both: Same forced arbitration, different targeted exploitation');
    console.log('  🎯 Result: Proves platforms consciously design class-based predation');

  } catch (error) {
    console.error('❌ Spotify dual analysis failed:', error.message);
  }
}

addSpotifyDualAnalysis();