const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function debugDatabase() {
  console.log('🔍 DEBUGGING DATABASE STRUCTURE...');
  
  // 1. Show table structure
  const { data: companies, error: compError } = await supabase
    .from('tos_analysis_companies')
    .select('*')
    .limit(1);
  
  if (companies && companies[0]) {
    console.log('\n📊 tos_analysis_companies columns:');
    console.log(Object.keys(companies[0]));
  }

  const { data: documents, error: docError } = await supabase
    .from('tos_analysis_documents')
    .select('*')
    .limit(1);
  
  if (documents && documents[0]) {
    console.log('\n📄 tos_analysis_documents columns:');
    console.log(Object.keys(documents[0]));
    console.log('raw_content length:', documents[0].raw_content?.length || 0);
    console.log('cleaned_content length:', documents[0].cleaned_content?.length || 0);
  }

  const { data: results, error: resError } = await supabase
    .from('tos_analysis_results')
    .select('*')
    .limit(1);
  
  if (results && results[0]) {
    console.log('\n📈 tos_analysis_results columns:');
    console.log(Object.keys(results[0]));
    console.log('key_concerns type:', typeof results[0].key_concerns);
    console.log('concerning_clauses type:', typeof results[0].concerning_clauses);
    console.log('manipulation_tactics type:', typeof results[0].manipulation_tactics);
  }

  // 2. Find company with longest raw_content (likely has quotes)
  const { data: fullContent, error: fullError } = await supabase
    .from('tos_analysis_results')
    .select(`
      id,
      tos_analysis_companies!inner(name),
      tos_analysis_documents!inner(raw_content, cleaned_content)
    `)
    .order('id', { ascending: true })
    .limit(5);

  if (fullContent) {
    console.log('\n🔍 CONTENT ANALYSIS:');
    fullContent.forEach(item => {
      const rawLength = item.tos_analysis_documents.raw_content?.length || 0;
      const cleanedLength = item.tos_analysis_documents.cleaned_content?.length || 0;
      console.log(`${item.tos_analysis_companies.name}: raw=${rawLength}, cleaned=${cleanedLength}`);
      
      if (rawLength > 1000) {
        console.log(`  📜 Sample from ${item.tos_analysis_companies.name}:`);
        console.log(`  ${item.tos_analysis_documents.raw_content.substring(0, 200)}...`);
      }
    });
  }
}

debugDatabase();
