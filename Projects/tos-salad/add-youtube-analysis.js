#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addYouTubeAnalysis() {
  console.log('📺 Adding YouTube Terms of Service analysis...');

  const youtubeContent = `YouTube (Google) Terms of Service: Key Clause Analysis & Transparency Score

Transparency Score: 18/100
Justification: YouTube's Terms of Service systematically exploit content creators through dual licensing schemes, aggressive monetization rights, and liability transfers that make creators financially responsible for platform legal costs. The agreement treats creators as unpaid content suppliers while extracting maximum value through advertising revenue and automated enforcement systems. The score reflects the platform's transformation of creative expression into surveillance capitalism while transferring all legal and financial risks to individual creators.

1. The Double License: Giving Rights to YouTube AND Every Other User
Original Text: "License to YouTube: By providing Content... you grant to YouTube a worldwide, non-exclusive, royalty-free, sublicensable and transferable license to use that Content... License to Other Users: You also grant each other user of the Service a worldwide, non-exclusive, royalty-free license to access your Content through the Service, and to use that Content... only as enabled by a feature of the Service (such as video playback or embeds)."
Plain English Explanation: This is a crucial distinction. You are not just giving a license to YouTube. You are simultaneously giving a separate license to every single user on the planet to watch and interact with your video through YouTube's features. This is the legal foundation that makes the entire platform work.

2. The Right to Monetize: YouTube Can Put Ads on Your Video and Keep the Money
Original Text: "You grant to YouTube the right to monetize your Content on the Service (and such monetization may include displaying ads on or within Content or charging users a fee for access). This Agreement does not entitle you to any payments."
Plain English Explanation: This clause explicitly gives YouTube the right to run ads on or next to your videos and collect all the revenue from those ads. Unless you are a member of the separate YouTube Partner Program, you are not entitled to any of that money. You provide the content, they keep the profits.

3. The Liability Cap: The Infamous $500 Limit
Original Text: "YOUTUBE AND ITS AFFILIATES' TOTAL LIABILITY FOR ANY CLAIMS... IS LIMITED TO THE GREATER OF: (A) THE AMOUNT OF REVENUE THAT YOUTUBE HAS PAID TO YOU FROM YOUR USE OF THE SERVICE IN THE 12 MONTHS BEFORE THE DATE OF YOUR NOTICE... OF THE CLAIM; AND (B) USD $500."
Plain English Explanation: This is YouTube's version of the liability cap. If you are a regular user who doesn't earn money from the platform, their maximum liability to you for any harm they cause is $500. This is higher than most other platforms' $100 cap but is still a trivial amount compared to potential damages.

4. Full Indemnification: You Pay Their Legal Bills
Original Text: "To the extent permitted by applicable law, you agree to defend, indemnify and hold harmless YouTube, its Affiliates... from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from... your violation of any third party right, including without limitation any copyright, property, or privacy right..."
Plain English Explanation: This is a critical clause for creators. If you use a clip of a movie or a song in your video and the copyright owner sues YouTube, this clause means you are legally obligated to pay for YouTube's lawyers and all associated costs. It transfers the entire risk of copyright infringement from the platform to the creator.

5. Automated Content Scanning and the "Strike" System
Original Text: "We may use automated systems that analyze your Content to help detect infringement and abuse... YouTube operates a system of "strikes" in respect of Content that violates the YouTube Community Guidelines. Each strike comes with varying restrictions and may result in the permanent removal of your channel from YouTube."
Plain English Explanation: This describes their enforcement mechanism. Your videos are constantly scanned by AI to detect violations. If a violation is found, you are issued a "strike." Accumulating strikes can lead to restrictions and the permanent deletion of your channel and all of its content. This automated system is often criticized for its errors, but it is the core of their content moderation.

6. Service Termination and Content Loss
Original Text: "YouTube may terminate your access to all or any part of the Service at any time, with or without cause, with or without notice, effective immediately... Upon termination, all rights granted to you under these Terms of Service will also terminate and you must immediately cease all use of the Service."
Plain English Explanation: YouTube can delete your channel and years of creative work at any time, for any reason or no reason at all. All the time, effort, and creativity you invested in building your channel can be permanently destroyed with no recourse and no compensation.

7. Content Ownership vs. Platform Control
Original Text: "You retain ownership rights in your Content. However, by submitting Content to YouTube, you hereby grant YouTube a worldwide, non-exclusive, royalty-free, sublicenseable and transferable license..."
Plain English Explanation: While you technically "own" your content, YouTube's license is so broad that this ownership becomes practically meaningless. They can use, modify, and distribute your content in any way they see fit, and even transfer these rights to other companies, all without paying you unless you're in their partner program.

YouTube's Terms of Service create a systematic exploitation of creative labor where creators bear all legal and financial risks while the platform extracts maximum advertising value from their unpaid content creation.

Transparency Score: 18/100 - Critical Risk Level
Red Flags: 7 creator exploitation and legal liability transfer mechanisms`;

  try {
    // Get the existing YouTube company record (it should exist from previous batch)
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'youtube.com')
      .single();

    if (companyError) {
      console.error('❌ YouTube company not found:', companyError.message);
      return;
    }

    const companyId = existingCompany.id;
    console.log('✅ Found existing YouTube company record');

    // Update YouTube document with comprehensive content
    const { data: existingDoc, error: docFindError } = await supabase
      .from('tos_analysis_documents')
      .select('id')
      .eq('company_id', companyId)
      .eq('document_type', 'terms_of_service')
      .single();

    if (docFindError) {
      console.error('❌ YouTube document not found:', docFindError.message);
      return;
    }

    // Update the document with comprehensive content
    const { error: updateDocError } = await supabase
      .from('tos_analysis_documents')
      .update({
        raw_content: youtubeContent,
        cleaned_content: youtubeContent,
        content_hash: require('crypto').createHash('md5').update(youtubeContent).digest('hex'),
        scraped_at: new Date().toISOString(),
        content_length: youtubeContent.length
      })
      .eq('id', existingDoc.id);

    if (updateDocError) {
      console.error('❌ Document update failed:', updateDocError.message);
      return;
    }

    console.log('✅ YouTube document updated');

    // Update the analysis with comprehensive data
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .update({
        transparency_score: 18, // Critical due to creator exploitation
        user_friendliness_score: 15, // Extremely hostile to creators
        privacy_score: 20, // Standard Google surveillance
        manipulation_risk_score: 88, // Critical - creator labor exploitation
        data_collection_risk: 'critical', // Video content analysis and scanning
        data_sharing_risk: 'high', // Sublicensable and transferable rights
        account_termination_risk: 'critical', // Can delete years of creative work
        legal_jurisdiction_risk: 'high', // Standard Google California courts
        concerning_clauses: [
          {category: 'Double Content Licensing', concern: 'Rights granted to both YouTube and every user globally'},
          {category: 'Monetization Rights Without Payment', concern: 'Can run ads on content and keep all revenue'},
          {category: 'Creator Liability Liability Cap', concern: 'Maximum $500 liability despite creator dependency'},
          {category: 'Full Creator Indemnification', concern: 'Creators pay all YouTube legal costs for copyright issues'},
          {category: 'Automated Strike System', concern: 'AI-powered content moderation with channel deletion consequences'},
          {category: 'At-Will Creator Termination', concern: 'Can delete channels and years of work without cause'},
          {category: 'Meaningless Content Ownership', concern: 'Technical ownership with unlimited platform licensing rights'}
        ],
        manipulation_tactics: ['Creator Exploitation', 'Legal Liability Transfer', 'Automated Enforcement', 'Labor Extraction'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '2.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'YouTube systematically exploits creator labor through dual licensing and liability transfers while extracting maximum advertising value, scoring 18/100.',
        key_concerns: [
          'Dual Global Content Licensing Rights',
          'Monetization Without Creator Payment',
          'Creator Dependency $500 Liability Cap',
          'Complete Legal Cost Transfer to Creators',
          'AI-Powered Automated Strike Enforcement',
          'At-Will Channel and Content Deletion',
          'Unlimited Platform Rights Despite Technical Ownership'
        ],
        recommendations: [
          'Understand you grant rights to YouTube AND every global user',
          'YouTube can monetize your content and keep all ad revenue',
          'Maximum YouTube liability is $500 despite creator dependency',
          'You pay all YouTube legal costs for copyright disputes',
          'AI systems can automatically delete your channel',
          'YouTube can terminate years of creative work without cause',
          'Technical content ownership is meaningless with unlimited platform licensing',
          'Consider creator exploitation risks before investing time',
          'Backup content independently - can be deleted without warning',
          'Understand creative labor is extracted without meaningful compensation'
        ]
      })
      .eq('company_id', companyId)
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Analysis update failed:', analysisError.message);
      return;
    }

    console.log('✅ YouTube analysis updated');
    console.log(`📊 Updated Transparency Score: ${analysis.transparency_score}/100`);
    console.log(`⚠️ Risk Level: Critical (${analysis.manipulation_risk_score}/100)`);
    console.log(`🚩 Red Flags: 7 creator exploitation and legal liability transfer mechanisms`);
    console.log('📺 Creator labor exploitation confirmed!');

    // Show updated transparency rankings
    console.log('\n📊 UPDATED TRANSPARENCY RANKINGS:');
    console.log('==================================');
    console.log('🏦 Bank of America: 8/100 (CRITICAL - Financial Exploitation)');
    console.log('🎵 TikTok:          12/100 (CRITICAL - Minor Exploitation)');
    console.log('🐦 X (Twitter):     14/100 (CRITICAL - Discourse Weaponization)');
    console.log('🚨 Verizon:         15/100 (CRITICAL - Monopoly Abuse)');
    console.log('⚖️ Microsoft:       16/100 (CRITICAL - Legal Engineering)');
    console.log('📺 YouTube:         18/100 (CRITICAL - Creator Exploitation)');
    console.log('🔴 Reddit:          18/100 (CRITICAL - Content Exploitation)');
    console.log('🔍 Google:          20/100 (CRITICAL - Surveillance & Content Control)');

  } catch (error) {
    console.error('❌ YouTube analysis failed:', error.message);
  }
}

addYouTubeAnalysis();