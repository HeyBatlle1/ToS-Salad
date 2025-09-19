const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function verifyDatabaseContent() {
  console.log('🔍 Checking current database content...\n');

  // Check companies
  const { data: companies, error: compError } = await supabase
    .from('tos_analysis_companies')
    .select('*');

  console.log('📊 Companies in database:', companies?.length || 0);
  if (companies) {
    companies.forEach(company => {
      console.log(`  - ${company.name} (${company.domain})`);
    });
  }

  // Check documents
  const { data: documents, error: docError } = await supabase
    .from('tos_analysis_documents')
    .select('*');

  console.log('\n📄 Documents in database:', documents?.length || 0);
  if (documents) {
    documents.forEach(doc => {
      console.log(`  - ${doc.title}`);
      console.log(`    Content length: ${doc.raw_content?.length || 0} chars`);
      console.log(`    Has analysis: ${doc.is_analyzed ? 'Yes' : 'No'}`);
    });
  }

  // Check analyses
  const { data: analyses, error: anaError } = await supabase
    .from('tos_analysis_results')
    .select('*');

  console.log('\n🔍 Analyses in database:', analyses?.length || 0);
  if (analyses) {
    analyses.forEach(analysis => {
      console.log(`  - Transparency Score: ${analysis.transparency_score}/100`);
      console.log(`    Concerning clauses: ${analysis.concerning_clauses?.length || 0}`);
      console.log(`    Company ID: ${analysis.company_id}`);
    });
  }

  // Find Reddit specifically
  console.log('\n🔴 Looking for Reddit analysis...');
  const { data: redditCompany } = await supabase
    .from('tos_analysis_companies')
    .select('*')
    .eq('domain', 'reddit.com')
    .single();

  if (redditCompany) {
    console.log('✅ Reddit company found:', redditCompany.name);

    const { data: redditDoc } = await supabase
      .from('tos_analysis_documents')
      .select('*')
      .eq('company_id', redditCompany.id)
      .single();

    if (redditDoc) {
      console.log('✅ Reddit document found:', redditDoc.title);
      console.log('📝 Content length:', redditDoc.raw_content?.length || 0);

      const { data: redditAnalysis } = await supabase
        .from('tos_analysis_results')
        .select('*')
        .eq('company_id', redditCompany.id)
        .single();

      if (redditAnalysis) {
        console.log('✅ Reddit analysis found');
        console.log('📊 Transparency Score:', redditAnalysis.transparency_score);
        console.log('🚩 Red Flags:', redditAnalysis.concerning_clauses?.length || 0);
      } else {
        console.log('❌ No Reddit analysis found');
      }
    } else {
      console.log('❌ No Reddit document found');
    }
  } else {
    console.log('❌ No Reddit company found');
  }
}

verifyDatabaseContent().catch(console.error);