const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function auditAnalysisQuality() {
  console.log('🔍 SYSTEMATIC CONTENT VERIFICATION AUDIT');
  console.log('======================================\n');

  try {
    // Get all companies with their analysis data
    const { data: companies, error } = await supabase
      .from('tos_analysis_companies')
      .select(`
        *,
        tos_analysis_documents (
          title,
          raw_content,
          cleaned_content,
          content_length,
          is_analyzed
        ),
        tos_analysis_results (
          transparency_score,
          user_friendliness_score,
          privacy_score,
          manipulation_risk_score,
          concerning_clauses,
          key_concerns,
          recommendations,
          executive_summary,
          ai_model_used,
          analyzed_at
        )
      `)
      .order('name');

    if (error) {
      console.error('❌ Database error:', error);
      return;
    }

    console.log(`📊 Found ${companies.length} companies to audit\n`);

    const auditResults = [];

    for (const company of companies) {
      console.log(`\n🏢 AUDITING: ${company.name} (${company.domain})`);
      console.log('=' + '='.repeat(company.name.length + 20));

      const audit = {
        company: company.name,
        domain: company.domain,
        hasDocument: false,
        hasAnalysis: false,
        transparencyScore: null,
        redFlagCount: null,
        scoreAlignment: null,
        contentQuality: null,
        status: null,
        issues: [],
        recommendations: []
      };

      // Check if company has document
      if (!company.tos_analysis_documents || company.tos_analysis_documents.length === 0) {
        audit.issues.push('No ToS document found');
        audit.status = '❌ Missing Document';
        audit.recommendations.push('Need to scrape and store ToS document');
      } else {
        audit.hasDocument = true;
        const doc = company.tos_analysis_documents[0];
        console.log(`📄 Document: ${doc.title}`);
        console.log(`📝 Content length: ${doc.content_length || 0} chars`);
        console.log(`🔍 Is analyzed: ${doc.is_analyzed ? 'Yes' : 'No'}`);

        // Check document content quality
        if (!doc.raw_content || doc.raw_content.length < 100) {
          audit.issues.push('Document content too short or missing');
        }
      }

      // Check if company has analysis
      if (!company.tos_analysis_results || company.tos_analysis_results.length === 0) {
        audit.issues.push('No analysis results found');
        if (audit.status !== '❌ Missing Document') {
          audit.status = '⚠️ Missing Analysis';
          audit.recommendations.push('Need to perform Gemini analysis on existing document');
        }
      } else {
        audit.hasAnalysis = true;
        const analysis = company.tos_analysis_results[0];

        console.log(`📊 Transparency Score: ${analysis.transparency_score}/100`);
        console.log(`🚩 Concerning Clauses: ${analysis.concerning_clauses?.length || 0}`);
        console.log(`🤖 AI Model: ${analysis.ai_model_used || 'Unknown'}`);
        console.log(`📅 Analyzed: ${analysis.analyzed_at || 'Unknown'}`);

        audit.transparencyScore = analysis.transparency_score;
        audit.redFlagCount = analysis.concerning_clauses?.length || 0;

        // Check transparency score alignment
        const expectedScore = Math.max(0, 100 - (audit.redFlagCount * 10)); // Rough calculation
        const scoreDifference = Math.abs(audit.transparencyScore - expectedScore);

        if (scoreDifference > 30) {
          audit.scoreAlignment = 'Poor';
          audit.issues.push(`Transparency score (${audit.transparencyScore}) doesn't align with red flag count (${audit.redFlagCount})`);
        } else if (scoreDifference > 15) {
          audit.scoreAlignment = 'Fair';
        } else {
          audit.scoreAlignment = 'Good';
        }

        // Check content quality - look for actual quotes and explanations
        let hasQuotes = false;
        let hasExplanations = false;
        let isGeneric = false;

        if (company.tos_analysis_documents && company.tos_analysis_documents[0]) {
          const content = company.tos_analysis_documents[0].raw_content || '';

          // Check for quote-and-explain format
          hasQuotes = content.includes('Original Text:') || content.includes('"') && content.length > 1000;
          hasExplanations = content.includes('Plain English Explanation:') || content.includes('explanation') || content.includes('means');

          // Check for generic content
          const genericIndicators = [
            'ToS document analysis would be performed here',
            'Analysis would be performed',
            'placeholder',
            'Lorem ipsum',
            'This is a test',
            'Generic analysis'
          ];

          isGeneric = genericIndicators.some(indicator =>
            content.toLowerCase().includes(indicator.toLowerCase())
          );

          // Check for proper analysis structure
          if (hasQuotes && hasExplanations && !isGeneric && content.length > 500) {
            audit.contentQuality = 'Genuine';
          } else if (hasQuotes || hasExplanations) {
            audit.contentQuality = 'Partial';
            audit.issues.push('Analysis content appears incomplete');
          } else if (isGeneric) {
            audit.contentQuality = 'Generic';
            audit.issues.push('Analysis contains generic/placeholder content');
          } else {
            audit.contentQuality = 'Poor';
            audit.issues.push('Analysis lacks proper quote-and-explain format');
          }
        }

        // Final status determination
        if (audit.contentQuality === 'Genuine' && audit.scoreAlignment === 'Good') {
          audit.status = '✅ High Quality';
        } else if (audit.contentQuality === 'Genuine' || audit.scoreAlignment === 'Good') {
          audit.status = '⚠️ Needs Improvement';
          audit.recommendations.push('Review and improve analysis quality');
        } else {
          audit.status = '❌ Poor Quality';
          audit.recommendations.push('Replace with proper Gemini analysis');
        }
      }

      // Display audit results for this company
      console.log(`\n📋 AUDIT RESULTS:`);
      console.log(`   Status: ${audit.status}`);
      console.log(`   Document: ${audit.hasDocument ? '✅' : '❌'}`);
      console.log(`   Analysis: ${audit.hasAnalysis ? '✅' : '❌'}`);
      if (audit.hasAnalysis) {
        console.log(`   Content Quality: ${audit.contentQuality}`);
        console.log(`   Score Alignment: ${audit.scoreAlignment}`);
      }

      if (audit.issues.length > 0) {
        console.log(`   Issues: ${audit.issues.join(', ')}`);
      }

      auditResults.push(audit);
    }

    // Generate summary report
    console.log('\n\n📊 COMPREHENSIVE AUDIT SUMMARY');
    console.log('===============================\n');

    const highQuality = auditResults.filter(a => a.status === '✅ High Quality');
    const needsImprovement = auditResults.filter(a => a.status === '⚠️ Needs Improvement');
    const missingAnalysis = auditResults.filter(a => a.status === '⚠️ Missing Analysis');
    const poorQuality = auditResults.filter(a => a.status === '❌ Poor Quality');
    const missingDoc = auditResults.filter(a => a.status === '❌ Missing Document');

    console.log(`✅ HIGH QUALITY (${highQuality.length} companies):`);
    highQuality.forEach(a => console.log(`   • ${a.company} - Score: ${a.transparencyScore}, Red Flags: ${a.redFlagCount}`));

    console.log(`\n⚠️ NEEDS IMPROVEMENT (${needsImprovement.length} companies):`);
    needsImprovement.forEach(a => console.log(`   • ${a.company} - Issues: ${a.issues.join(', ')}`));

    console.log(`\n⚠️ MISSING ANALYSIS (${missingAnalysis.length} companies):`);
    missingAnalysis.forEach(a => console.log(`   • ${a.company} - Has document but no analysis`));

    console.log(`\n❌ POOR QUALITY (${poorQuality.length} companies):`);
    poorQuality.forEach(a => console.log(`   • ${a.company} - Issues: ${a.issues.join(', ')}`));

    console.log(`\n❌ MISSING DOCUMENT (${missingDoc.length} companies):`);
    missingDoc.forEach(a => console.log(`   • ${a.company} - No ToS document found`));

    console.log('\n📈 QUALITY METRICS:');
    console.log(`   Total Companies: ${auditResults.length}`);
    console.log(`   High Quality: ${highQuality.length} (${Math.round(highQuality.length/auditResults.length*100)}%)`);
    console.log(`   Needs Work: ${needsImprovement.length + missingAnalysis.length + poorQuality.length + missingDoc.length} (${Math.round((auditResults.length - highQuality.length)/auditResults.length*100)}%)`);

    console.log('\n🎯 PRIORITY ACTIONS NEEDED:');
    console.log('1. Replace generic/placeholder content with real Gemini analysis');
    console.log('2. Verify transparency scores match red flag counts');
    console.log('3. Ensure all analyses follow quote-and-explain methodology');
    console.log('4. Complete missing analyses for companies with documents');
    console.log('5. Source and analyze missing ToS documents');

    return auditResults;

  } catch (error) {
    console.error('❌ Audit failed:', error);
  }
}

// Run the audit
if (require.main === module) {
  auditAnalysisQuality();
}

module.exports = { auditAnalysisQuality };