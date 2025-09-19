#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function addGeminiContextCard() {
  console.log('🎓 Adding Gemini 2.5 Pro educational context card...');

  const contextContent = `Understanding ToS Patterns: Why Some Companies Are More "Honest" Than Others
Educational Context Card - Analysis by Gemini 2.5 Pro

Key Insight: A Terms of Service document is not just a legal shield. It is the source code of a company's ethics. It is a direct, legally binding reflection of how a company views its users: as partners, as assets, as risks to be managed, or as resources to be harvested.

The "Data Use" vs. "Data Acquisition" Philosophy

Companies like Google and Anthropic build their ToS around a philosophy of Data Use. Their business models (advertising for Google, enterprise/API for Anthropic) require them to process vast amounts of data to provide and improve a service. Their terms are structured to secure the necessary rights to use that data to make their products work. While still lopsided, the "deal" is clearer: you give us data, we give you a powerful service.

The "Horror Movie" ToS (like Meta's, TikTok's, Bank of America's) is often built around a philosophy of Data Acquisition. The goal is not just to use the data to run the service, but to acquire a permanent, irrevocable, asset-like control over the user's content and likeness. The user isn't just a user; they are a content generator, and the ToS is designed to secure the company's rights to that generated content in perpetuity.

The Nature of the "Product"

For Google and Anthropic, the product is primarily the service itself. You use Search, Gmail, or Claude.

For platforms like Meta and TikTok, the product being sold to advertisers is a highly detailed profile of you and your behavior, built from the content you create. Therefore, their ToS must be far more aggressive in securing rights to that content—your photos, videos, likeness, and social graph—because that is the asset.

The Enterprise Halo Effect

Anthropic, in particular, has a strong enterprise focus. Their corporate customers demand clear data ownership, privacy, and security controls. They would never sign a contract that gives Anthropic a perpetual license to all their confidential business data. This ethically-cleaner, business-focused approach inevitably "leaks" into their consumer ToS. It's a matter of brand consistency. They cannot be seen as trustworthy partners to business while being predatory towards individuals.

The Transparency Pattern

Companies with more transparent business models tend to have more transparent ToS agreements. Google's deal has been the same for two decades: an exchange of privacy for unparalleled utility. Their ToS reflects that. It's a vast, all-encompassing license because their services are vast and all-encompassing. It's invasive, but it's not trying to hide its nature.

What ToS Salad reveals is the evidence to support people's gut feelings. People feel the difference between a service that is using their data and a service that is colonizing their digital lives. This analysis provides the chapter and verse to prove that feeling is real.

Source: Gemini 2.5 Pro Analysis
Educational Purpose: Understanding corporate ethics through legal language`;

  try {
    // Get or create educational context company record
    let companyId;
    const { data: existingCompany, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('id')
      .eq('domain', 'gemini-analysis.context')
      .single();

    if (companyError || !existingCompany) {
      const { data: newCompany, error: createError } = await supabase
        .from('tos_analysis_companies')
        .insert({
          name: 'Educational Context: ToS Ethics Patterns',
          domain: 'gemini-analysis.context',
          industry: 'Educational Context',
          headquarters: 'Educational Resource',
          founded_year: 2024,
          tos_url: 'https://educational.context/tos-patterns',
          corporate_website: 'https://educational.context',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Context company creation failed:', createError.message);
        return;
      }
      companyId = newCompany.id;
      console.log('✅ Educational context company created');
    } else {
      companyId = existingCompany.id;
      console.log('✅ Found existing educational context company');
    }

    // Create context document
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .insert({
        company_id: companyId,
        document_type: 'terms_of_service',
        title: 'Understanding ToS Ethics Patterns - Gemini 2.5 Pro Analysis',
        url: 'https://educational.context/tos-patterns',
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
      console.error('❌ Context document creation failed:', docError.message);
      return;
    }

    console.log('✅ Educational context document created');

    // Create educational analysis entry
    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .insert({
        document_id: document.id,
        company_id: companyId,
        transparency_score: 100, // Educational content - perfect score for learning
        user_friendliness_score: 100, // Educational resource
        privacy_score: 100, // No privacy concerns for educational content
        manipulation_risk_score: 0, // Educational context, no manipulation
        data_collection_risk: 'low', // Educational content
        data_sharing_risk: 'low', // Educational content
        account_termination_risk: 'low', // Educational content
        legal_jurisdiction_risk: 'low', // Educational content
        concerning_clauses: [
          {category: 'Educational Insight', concern: 'ToS documents reveal corporate ethics and user relationship philosophy'},
          {category: 'Data Use vs Acquisition', concern: 'Some companies use data for service, others acquire it as permanent assets'},
          {category: 'Product Nature Impact', concern: 'When users are the product, ToS becomes more aggressive'},
          {category: 'Enterprise Halo Effect', concern: 'Business customers demand better terms that can benefit consumers'},
          {category: 'Transparency Correlation', concern: 'Honest business models correlate with honest ToS agreements'}
        ],
        manipulation_tactics: ['Educational Context'],
        ai_model_used: 'gemini-2.0-flash',
        analysis_version: '1.0.0',
        analyzed_at: new Date().toISOString(),
        executive_summary: 'Educational context explaining why some companies have more transparent ToS agreements than others - Gemini 2.5 Pro analysis.',
        key_concerns: [
          'ToS Documents as Corporate Ethics Source Code',
          'Data Use vs Data Acquisition Philosophy Difference',
          'Product Nature Determines ToS Aggressiveness',
          'Enterprise Customer Demands Drive Better Consumer Terms',
          'Business Model Transparency Correlates with ToS Honesty'
        ],
        recommendations: [
          'Understand ToS as reflection of how company views users',
          'Distinguish between data use and data acquisition models',
          'Recognize when you are the product being sold',
          'Look for enterprise halo effect in consumer terms',
          'Trust gut feelings about service relationships',
          'Use this analysis to understand corporate motivation patterns'
        ]
      })
      .select()
      .single();

    if (analysisError) {
      console.error('❌ Educational analysis creation failed:', analysisError.message);
      return;
    }

    console.log('✅ Educational context analysis created');
    console.log(`📊 Educational Score: ${analysis.transparency_score}/100`);
    console.log(`🎓 Risk Level: Educational (${analysis.manipulation_risk_score}/100)`);
    console.log(`📚 Educational Insights: 5 key pattern explanations`);
    console.log('🎓 Gemini 2.5 Pro context card successfully added!');

    console.log('\n📚 EDUCATIONAL CONTEXT ADDED:');
    console.log('================================');
    console.log('🎓 Understanding ToS Ethics Patterns');
    console.log('📊 Source: Gemini 2.5 Pro Analysis');
    console.log('🎯 Purpose: Explaining corporate motivation patterns');
    console.log('💡 Key Insight: ToS = Source Code of Corporate Ethics');

  } catch (error) {
    console.error('❌ Educational context creation failed:', error.message);
  }
}

addGeminiContextCard();