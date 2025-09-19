const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

// The 9 companies with GENUINE analysis that should be preserved
const VALID_COMPANIES = [
  'bankofamerica.com',
  'fathom.video',
  'github.com',
  'otter.ai',
  'reddit.com',
  'telegram.org',
  'tiktok.com',
  'verizon.com',
  'youtube.com'
];

async function cleanDatabase() {
  console.log('🧹 CLEANING FAKE DATA - PRESERVING COMPANY CARDS');
  console.log('=================================================\n');

  try {
    // 1. DELETE FAKE 100/100 TRANSPARENCY SCORES (analysis data only)
    console.log('1. 🗑️ Deleting fake 100/100 transparency scores...');

    const { data: fakeScores, error: fakeError } = await supabase
      .from('tos_analysis_results')
      .delete()
      .eq('transparency_score', 100);

    if (fakeError) {
      console.error('❌ Error deleting fake scores:', fakeError);
    } else {
      console.log(`✅ Deleted analysis entries with fabricated 100/100 scores`);
    }

    // 2. DELETE PLACEHOLDER ANALYSIS DATA (under 300 characters) - KEEP COMPANY CARDS
    console.log('\n2. 🗑️ Deleting placeholder analysis data under 300 characters...');

    // Get documents with short content
    const { data: shortDocs, error: shortError } = await supabase
      .from('tos_analysis_documents')
      .select('id, title, raw_content, company_id')
      .not('raw_content', 'is', null);

    if (shortError) {
      console.error('❌ Error fetching documents:', shortError);
    } else {
      const placeholderDocs = shortDocs.filter(doc =>
        doc.raw_content && doc.raw_content.length < 300
      );

      console.log(`Found ${placeholderDocs.length} documents with placeholder content`);

      for (const doc of placeholderDocs) {
        console.log(`   Clearing analysis data: ${doc.title} (${doc.raw_content.length} chars)`);

        // Delete analysis results first (foreign key constraint)
        await supabase
          .from('tos_analysis_results')
          .delete()
          .eq('document_id', doc.id);

        // Clear document content but keep the document record for company card
        await supabase
          .from('tos_analysis_documents')
          .update({
            raw_content: null,
            cleaned_content: null,
            is_analyzed: false
          })
          .eq('id', doc.id);
      }

      console.log(`✅ Cleared ${placeholderDocs.length} placeholder documents (kept company cards)`);
    }

    // 3. DELETE GENERIC ANALYSIS CONTENT - PRESERVE COMPANY STRUCTURE
    console.log('\n3. 🗑️ Clearing generic analysis content...');

    const genericIndicators = [
      'ToS document analysis would be performed here',
      'Analysis would be performed',
      'placeholder',
      'Generic analysis',
      'This is a test'
    ];

    const { data: allDocs, error: allDocsError } = await supabase
      .from('tos_analysis_documents')
      .select('id, title, raw_content, company_id')
      .not('raw_content', 'is', null);

    if (allDocsError) {
      console.error('❌ Error fetching all documents:', allDocsError);
    } else {
      let clearedGeneric = 0;

      for (const doc of allDocs) {
        const content = doc.raw_content || '';
        const hasGenericContent = genericIndicators.some(indicator =>
          content.toLowerCase().includes(indicator.toLowerCase())
        );

        if (hasGenericContent) {
          console.log(`   Clearing generic content: ${doc.title}`);

          // Delete analysis results first
          await supabase
            .from('tos_analysis_results')
            .delete()
            .eq('document_id', doc.id);

          // Clear document content but keep record for company card
          await supabase
            .from('tos_analysis_documents')
            .update({
              raw_content: null,
              cleaned_content: null,
              is_analyzed: false
            })
            .eq('id', doc.id);

          clearedGeneric++;
        }
      }

      console.log(`✅ Cleared ${clearedGeneric} documents with generic content (kept company cards)`);
    }

    // 4. IDENTIFY REMAINING VALID COMPANIES
    console.log('\n4. 📊 Checking remaining valid companies...');

    const { data: companies, error: compError } = await supabase
      .from('tos_analysis_companies')
      .select(`
        *,
        tos_analysis_documents (
          id,
          title,
          raw_content
        ),
        tos_analysis_results (
          id,
          transparency_score,
          concerning_clauses
        )
      `)
      .order('name');

    if (compError) {
      console.error('❌ Error fetching companies:', compError);
    } else {
      const validRemaining = [];
      const needsCleaning = [];

      for (const company of companies) {
        const hasDoc = company.tos_analysis_documents && company.tos_analysis_documents.length > 0;
        const hasAnalysis = company.tos_analysis_results && company.tos_analysis_results.length > 0;
        const isValid = VALID_COMPANIES.includes(company.domain);

        if (hasDoc && hasAnalysis && isValid) {
          const doc = company.tos_analysis_documents[0];
          const analysis = company.tos_analysis_results[0];

          if (doc.raw_content && doc.raw_content.length > 1000) {
            validRemaining.push({
              name: company.name,
              domain: company.domain,
              score: analysis.transparency_score,
              redFlags: analysis.concerning_clauses?.length || 0,
              contentLength: doc.raw_content.length
            });
          } else {
            needsCleaning.push(company.name);
          }
        } else if (!isValid && (hasDoc || hasAnalysis)) {
          needsCleaning.push(company.name);
        }
      }

      console.log(`\n✅ VALID COMPANIES REMAINING (${validRemaining.length}):`);
      validRemaining.forEach(company => {
        console.log(`   • ${company.name} - Score: ${company.score}/100, Red Flags: ${company.redFlags}, Content: ${company.contentLength} chars`);
      });

      if (needsCleaning.length > 0) {
        console.log(`\n⚠️ COMPANIES NEEDING CLEANUP (${needsCleaning.length}):`);
        needsCleaning.forEach(name => console.log(`   • ${name}`));
      }
    }

    // 5. CLEAR EDUCATIONAL/META ENTRIES DATA (keep company cards)
    console.log('\n5. 🗑️ Clearing educational/meta entries data...');

    const metaDomains = [
      'gemini-analysis.context',
      'tos-salad.verifier.education',
      'tos-salad.signal.counter-narrative.education',
      'tos-salad.spotify.dual-analysis.education'
    ];

    for (const domain of metaDomains) {
      const { data: metaCompany } = await supabase
        .from('tos_analysis_companies')
        .select('id')
        .eq('domain', domain)
        .single();

      if (metaCompany) {
        // Delete analysis results
        await supabase
          .from('tos_analysis_results')
          .delete()
          .eq('company_id', metaCompany.id);

        // Clear documents but keep company card
        await supabase
          .from('tos_analysis_documents')
          .update({
            raw_content: null,
            cleaned_content: null,
            is_analyzed: false
          })
          .eq('company_id', metaCompany.id);

        console.log(`   Cleared data: ${domain} (kept company card)`);
      }
    }

    console.log('\n🎯 DATABASE CLEANING COMPLETE');
    console.log('==============================');
    console.log('✅ Removed all fabricated 100/100 scores');
    console.log('✅ Cleared placeholder content under 300 chars');
    console.log('✅ Eliminated generic analysis content');
    console.log('✅ Cleared educational meta entries data');
    console.log('✅ PRESERVED ALL COMPANY CARDS for real data insertion');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Update platform to show only validated companies');
    console.log('2. Mark incomplete companies as "Analysis Pending"');
    console.log('3. Request real Gemini analysis for priority companies');

  } catch (error) {
    console.error('❌ Database cleaning failed:', error);
  }
}

// Run the cleaning
if (require.main === module) {
  cleanDatabase();
}

module.exports = { cleanDatabase };