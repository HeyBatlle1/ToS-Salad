#!/usr/bin/env node

/**
 * ENHANCED GEMINI WITH THE VERIFIER INTEGRATION
 *
 * This integrates The Verifier's content verification capabilities
 * directly into ToS Salad's existing Gemini analysis system.
 *
 * Now ToS Salad can analyze both:
 * 1. Legal documents (Terms of Service) - original functionality
 * 2. Digital content (images, videos, links) - The Verifier functionality
 *
 * This unified approach aligns with ToS Salad's mission: transparency through analysis.
 */

const { createClient } = require('@supabase/supabase-js');
const { TheVerifier } = require('./the-verifier');
const dotenv = require('dotenv');
const fs = require('fs').promises;

dotenv.config();

class GeminiWithVerifier {
  constructor() {
    this.supabase = createClient(
      'https://fbjjqwfcmzrpmytieajp.supabase.co',
      process.env.SUPABASE_ANON_KEY
    );

    this.verifier = new TheVerifier();
  }

  /**
   * Enhanced analysis that can handle both ToS documents and content verification
   */
  async analyzeContent(input, analysisType = 'auto') {
    console.log('🔍 Starting enhanced Gemini analysis with verification capabilities...');

    try {
      // Determine analysis type if not specified
      if (analysisType === 'auto') {
        analysisType = await this.detectAnalysisType(input);
      }

      switch (analysisType) {
        case 'tos_document':
          return await this.analyzeToSDocument(input);

        case 'content_verification':
          return await this.analyzeContentVerification(input);

        case 'mixed_analysis':
          return await this.analyzeMixed(input);

        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }

    } catch (error) {
      console.error('❌ Enhanced analysis failed:', error.message);
      return {
        error: error.message,
        analysisType: analysisType,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analyze Terms of Service documents (original functionality)
   */
  async analyzeToSDocument(input) {
    console.log('📜 Analyzing Terms of Service document...');

    // This would integrate with existing ToS analysis logic
    // For now, returning a structured response that matches the pattern

    return {
      analysisType: 'tos_document',
      timestamp: new Date().toISOString(),
      result: {
        documentType: 'terms_of_service',
        transparencyScore: null, // Would be calculated by existing logic
        userFriendlinessScore: null,
        privacyScore: null,
        manipulationRiskScore: null,
        concerningClauses: [],
        recommendations: [],
        executiveSummary: 'ToS document analysis would be performed here using existing Gemini logic'
      },
      verificationEnhancements: {
        documentAuthenticity: 'Not applicable for ToS documents',
        sourceVerification: 'Corporate website verification would be performed'
      }
    };
  }

  /**
   * Analyze content for verification (The Verifier functionality)
   */
  async analyzeContentVerification(input) {
    console.log('🛡️ Performing content verification analysis...');

    let buffer;
    let inputType;

    if (typeof input === 'string') {
      if (this.verifier.isURL(input)) {
        inputType = 'url';
        return await this.verifier.generateVerificationReport(input, inputType);
      } else {
        // Assume file path
        buffer = await fs.readFile(input);
        inputType = 'file';
      }
    } else {
      // Assume buffer
      buffer = input;
      inputType = 'file';
    }

    const verificationReport = await this.verifier.generateVerificationReport(buffer, inputType);

    return {
      analysisType: 'content_verification',
      timestamp: new Date().toISOString(),
      verificationReport: verificationReport,
      tosIntegration: {
        relevantToS: await this.findRelevantToSForContent(verificationReport),
        privacyImplications: await this.analyzePrivacyImplications(verificationReport),
        platformRisks: await this.analyzePlatformRisks(verificationReport)
      }
    };
  }

  /**
   * Mixed analysis for complex scenarios
   */
  async analyzeMixed(input) {
    console.log('🔄 Performing mixed analysis...');

    // This would handle cases where we need both ToS analysis and content verification
    // For example, analyzing a platform's ToS while also verifying suspicious content from that platform

    return {
      analysisType: 'mixed_analysis',
      timestamp: new Date().toISOString(),
      components: {
        tosAnalysis: await this.analyzeToSDocument(input.tosDocument || input),
        contentVerification: await this.analyzeContentVerification(input.content || input)
      },
      correlationAnalysis: await this.analyzeToSContentCorrelation(input)
    };
  }

  /**
   * Detect what type of analysis is needed
   */
  async detectAnalysisType(input) {
    if (typeof input === 'string') {
      if (input.includes('terms') || input.includes('privacy') || input.includes('policy')) {
        return 'tos_document';
      }
      if (this.verifier.isURL(input)) {
        return 'content_verification';
      }
      // Check if it's a file path to an image/video
      if (input.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi)$/i)) {
        return 'content_verification';
      }
    }

    if (Buffer.isBuffer(input)) {
      return 'content_verification';
    }

    if (typeof input === 'object' && input.tosDocument && input.content) {
      return 'mixed_analysis';
    }

    // Default to ToS analysis (preserve original behavior)
    return 'tos_document';
  }

  /**
   * Find relevant ToS documents for verified content
   */
  async findRelevantToSForContent(verificationReport) {
    console.log('🔗 Finding relevant ToS documents...');

    try {
      // If we found provenance information, look up ToS for those platforms
      const relevantPlatforms = [];

      if (verificationReport.analysisModules) {
        const provenanceModule = verificationReport.analysisModules.find(m => m.module === 'PROVENANCE_CHECK');

        if (provenanceModule && provenanceModule.sourceHistory) {
          for (const source of provenanceModule.sourceHistory) {
            const domain = this.extractDomain(source.url);
            const platformToS = await this.findToSByDomain(domain);
            if (platformToS) {
              relevantPlatforms.push({
                platform: domain,
                tosAnalysis: platformToS,
                contentRisk: this.assessContentRiskForPlatform(domain, verificationReport)
              });
            }
          }
        }
      }

      return relevantPlatforms;

    } catch (error) {
      console.error('⚠️ Could not find relevant ToS:', error.message);
      return [];
    }
  }

  /**
   * Analyze privacy implications based on verification results
   */
  async analyzePrivacyImplications(verificationReport) {
    const implications = [];

    if (verificationReport.analysisModules) {
      const metadataModule = verificationReport.analysisModules.find(m => m.module === 'METADATA_ANALYSIS');

      if (metadataModule && metadataModule.exifData && metadataModule.exifData.GPS) {
        implications.push({
          type: 'location_privacy',
          risk: 'HIGH',
          description: 'GPS location data embedded in image metadata',
          recommendation: 'Remove location data before sharing on social platforms'
        });
      }

      if (metadataModule && metadataModule.warnings) {
        metadataModule.warnings.forEach(warning => {
          if (warning.includes('privacy')) {
            implications.push({
              type: 'metadata_privacy',
              risk: 'MEDIUM',
              description: warning,
              recommendation: 'Review platform privacy policies for metadata handling'
            });
          }
        });
      }
    }

    return implications;
  }

  /**
   * Analyze platform-specific risks
   */
  async analyzePlatformRisks(verificationReport) {
    const risks = [];

    // Check if this content type has specific risks on major platforms
    if (verificationReport.overallVerdict === 'HIGH_PROBABILITY_AI_GENERATED') {
      risks.push({
        platform: 'Meta (Facebook/Instagram)',
        risk: 'Account termination for AI-generated content without disclosure',
        severity: 'HIGH',
        recommendation: 'Review Meta\'s AI content policies before posting'
      });

      risks.push({
        platform: 'TikTok',
        risk: 'Content may be flagged or removed for misleading AI generation',
        severity: 'MEDIUM',
        recommendation: 'Consider adding AI disclosure tags'
      });
    }

    if (verificationReport.riskLevel === 'HIGH') {
      risks.push({
        platform: 'All major platforms',
        risk: 'High-risk content may violate community guidelines',
        severity: 'HIGH',
        recommendation: 'Do not share until risks are resolved'
      });
    }

    return risks;
  }

  /**
   * Analyze correlation between ToS documents and content verification
   */
  async analyzeToSContentCorrelation(input) {
    // This would analyze how a platform's ToS relates to the content being verified
    // For example, if verifying content from Instagram, check Instagram's ToS for relevant clauses

    return {
      correlationFound: false,
      analysis: 'Correlation analysis would examine how platform ToS clauses relate to verified content risks',
      recommendations: [
        'Cross-reference content risks with platform-specific ToS clauses',
        'Identify potential violations before content sharing',
        'Understand platform rights to user-generated content'
      ]
    };
  }

  // Helper methods
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  }

  async findToSByDomain(domain) {
    try {
      const { data, error } = await this.supabase
        .from('tos_analysis_companies')
        .select('*')
        .eq('domain', domain)
        .single();

      return error ? null : data;
    } catch {
      return null;
    }
  }

  assessContentRiskForPlatform(domain, verificationReport) {
    // Assess how risky this content would be for this specific platform
    const platformPolicies = {
      'facebook.com': {
        aiContentRisk: 'HIGH',
        metadataRisk: 'MEDIUM',
        provenanceRisk: 'HIGH'
      },
      'instagram.com': {
        aiContentRisk: 'HIGH',
        metadataRisk: 'LOW', // Instagram strips most metadata
        provenanceRisk: 'HIGH'
      },
      'tiktok.com': {
        aiContentRisk: 'MEDIUM',
        metadataRisk: 'LOW',
        provenanceRisk: 'HIGH'
      }
    };

    return platformPolicies[domain] || {
      aiContentRisk: 'MEDIUM',
      metadataRisk: 'MEDIUM',
      provenanceRisk: 'MEDIUM'
    };
  }

  /**
   * Generate educational context about the relationship between ToS and content verification
   */
  async generateEducationalContext(analysisResult) {
    const context = {
      title: 'Understanding the Connection: Terms of Service and Content Verification',
      insights: [
        {
          concept: 'Platform Rights vs User Content',
          explanation: 'ToS documents often claim broad rights over user-generated content. The Verifier helps you understand what you\'re actually giving platforms the right to use.',
          example: 'If you upload AI-generated content, many platforms claim perpetual rights to use it, even if you didn\'t disclose it was AI-generated.'
        },
        {
          concept: 'Verification as User Protection',
          explanation: 'Content verification protects users from unknowingly violating ToS agreements that they never fully understood.',
          example: 'Uploading content with hidden metadata or undisclosed AI generation can violate community guidelines buried in ToS documents.'
        },
        {
          concept: 'The Asymmetric Information Problem',
          explanation: 'Platforms have sophisticated content analysis tools, but users have little insight into what they\'re sharing. The Verifier levels the playing field.',
          example: 'Platforms can detect AI-generated content and metadata, but users are often unaware of what information their content contains.'
        }
      ],
      recommendations: [
        'Always verify content before sharing on platforms with aggressive ToS agreements',
        'Understand that content verification protects you from unintentional ToS violations',
        'Use The Verifier alongside ToS analysis to make informed decisions about platform use',
        'Remember: If you wouldn\'t share something knowing all the facts, you shouldn\'t share it at all'
      ]
    };

    return context;
  }
}

/**
 * CLI interface for the enhanced Gemini with Verifier
 */
async function runEnhancedGemini() {
  const analyzer = new GeminiWithVerifier();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🎓 ENHANCED GEMINI WITH THE VERIFIER
===================================

ToS Salad now analyzes both legal documents AND digital content!

This is the logical evolution of our transparency mission:
- Analyze the legal code that governs digital platforms (ToS documents)
- Analyze the digital content itself (images, videos, links)

Usage:
  node gemini-with-verifier.js <input> [analysis-type]

Analysis Types:
  tos_document        - Analyze Terms of Service (original functionality)
  content_verification - Verify digital content (The Verifier)
  mixed_analysis      - Both ToS and content analysis
  auto               - Automatically detect (default)

Examples:
  node gemini-with-verifier.js ./suspicious-image.jpg
  node gemini-with-verifier.js https://example.com/terms
  node gemini-with-verifier.js https://suspicious-link.com content_verification
  node gemini-with-verifier.js document.pdf tos_document

The Verifier Features:
  🔍 AI-Generated Media Detection
  🕵️ Digital Provenance Check
  🔬 Metadata Analysis
  🛡️ Link & File Safety Scan

Plus NEW Integration Features:
  🔗 Cross-reference content risks with platform ToS
  📊 Analyze privacy implications across platforms
  🎓 Educational context about ToS-content relationships
    `);
    return;
  }

  const input = args[0];
  const analysisType = args[1] || 'auto';

  try {
    console.log(`🚀 Starting enhanced analysis of: ${input}`);
    console.log(`📊 Analysis type: ${analysisType}`);

    const result = await analyzer.analyzeContent(input, analysisType);

    // Display results
    console.log('\n🎯 ENHANCED ANALYSIS RESULTS');
    console.log('============================');
    console.log(`⏰ Timestamp: ${result.timestamp}`);
    console.log(`📊 Analysis Type: ${result.analysisType}`);

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      return;
    }

    // Display based on analysis type
    switch (result.analysisType) {
      case 'content_verification':
        console.log('\n🛡️ CONTENT VERIFICATION RESULTS:');
        console.log(`Overall Verdict: ${result.verificationReport.overallVerdict}`);
        console.log(`Risk Level: ${result.verificationReport.riskLevel}`);

        if (result.tosIntegration.relevantToS.length > 0) {
          console.log('\n🔗 RELEVANT PLATFORM POLICIES:');
          result.tosIntegration.relevantToS.forEach(platform => {
            console.log(`  ${platform.platform}: ${platform.contentRisk.aiContentRisk} AI content risk`);
          });
        }

        if (result.tosIntegration.privacyImplications.length > 0) {
          console.log('\n🔒 PRIVACY IMPLICATIONS:');
          result.tosIntegration.privacyImplications.forEach(implication => {
            console.log(`  ${implication.type}: ${implication.description}`);
          });
        }
        break;

      case 'tos_document':
        console.log('\n📜 TERMS OF SERVICE ANALYSIS:');
        console.log('(Original ToS analysis functionality would be displayed here)');
        break;

      case 'mixed_analysis':
        console.log('\n🔄 MIXED ANALYSIS RESULTS:');
        console.log('Combined ToS and content verification results');
        break;
    }

    // Generate and display educational context
    const educationalContext = await analyzer.generateEducationalContext(result);
    console.log('\n🎓 EDUCATIONAL CONTEXT:');
    console.log('=======================');
    console.log(educationalContext.title);

    educationalContext.insights.forEach((insight, index) => {
      console.log(`\n${index + 1}. ${insight.concept}:`);
      console.log(`   ${insight.explanation}`);
      console.log(`   Example: ${insight.example}`);
    });

    console.log('\n💡 RECOMMENDATIONS:');
    educationalContext.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

  } catch (error) {
    console.error('❌ Enhanced analysis failed:', error.message);
  }
}

// Export for integration
module.exports = { GeminiWithVerifier };

// CLI execution
if (require.main === module) {
  runEnhancedGemini();
}