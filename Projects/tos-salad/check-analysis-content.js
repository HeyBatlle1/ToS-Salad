#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkAnalysisContent() {
  console.log('🔍 Checking what analysis content we have...');

  try {
    // Get a few examples to see the content structure
    const { data, error } = await supabase
      .from('tos_analysis_results')
      .select(`
        tos_analysis_companies!inner(name),
        tos_analysis_documents!inner(raw_content)
      `)
      .limit(3);

    if (error) throw error;

    data.forEach((item, index) => {
      console.log(`\n=== ${item.tos_analysis_companies.name} ===`);
      const content = item.tos_analysis_documents.raw_content;

      if (content && content.length > 100) {
        console.log('✅ Has structured analysis content');
        console.log('First 200 chars:', content.substring(0, 200) + '...');

        // Check for quote-and-explain format
        const hasOriginalText = content.includes('Original Text:');
        const hasPlainEnglish = content.includes('Plain English Explanation:');
        const hasNumberedSections = /\d+\.\s/.test(content);

        console.log('Quote-and-explain format detected:');
        console.log(`  - Original Text sections: ${hasOriginalText ? '✅' : '❌'}`);
        console.log(`  - Plain English explanations: ${hasPlainEnglish ? '✅' : '❌'}`);
        console.log(`  - Numbered manipulation sections: ${hasNumberedSections ? '✅' : '❌'}`);
      } else {
        console.log('❌ Missing or minimal analysis content');
        console.log('Content:', content || 'NULL');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAnalysisContent();