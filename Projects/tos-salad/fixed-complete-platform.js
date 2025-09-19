#!/usr/bin/env node

/**
 * ToS Salad Platform - WITH FUNCTIONAL ANALYSIS BUTTONS
 * Now properly displays full educational content with quotes and explanations
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAllCompaniesFromDatabase() {
  try {
    console.log('🔍 Querying Supabase for all companies...');

    const { data: results, error } = await supabase
      .from('tos_analysis_results')
      .select(`
        id,
        transparency_score,
        user_friendliness_score,
        privacy_score,
        manipulation_risk_score,
        key_concerns,
        recommendations,
        executive_summary,
        concerning_clauses,
        manipulation_tactics,
        analyzed_at,
        tos_analysis_companies!inner(
          id,
          name,
          domain,
          industry,
          headquarters,
          founded_year,
          tos_url
        ),
        tos_analysis_documents!inner(
          title,
          raw_content,
          cleaned_content
        )
      `)
      .order('transparency_score', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      return [];
    }

    console.log(`✅ Found ${results?.length || 0} companies in database`);
    return results || [];
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return [];
  }
}

function parseAnalysisContent(rawContent) {
  if (!rawContent) return null;

  // Extract structured analysis from raw content
  const sections = {
    clauses: [],
    summary: '',
    keyFindings: [],
    recommendations: []
  };

  const lines = rawContent.split('\n');
  let currentClause = null;
  let currentSection = null;

  for (let line of lines) {
    line = line.trim();

    // Extract numbered clauses with quotes
    const clauseMatch = line.match(/^(\d+)\.\s*(.+)/);
    if (clauseMatch) {
      if (currentClause) sections.clauses.push(currentClause);
      currentClause = {
        number: clauseMatch[1],
        title: clauseMatch[2],
        originalText: '',
        analysis: '',
        whyPredatory: ''
      };
      continue;
    }

    // Extract original text/quotes
    if (line.startsWith('Original Text:') || line.includes('"') && currentClause) {
      currentClause.originalText = line.replace('Original Text:', '').trim();
      continue;
    }

    // Extract analysis explanations
    if ((line.includes('Analysis:') || line.includes('Predatory Analysis:')) && currentClause) {
      currentClause.analysis = line.split(/Analysis:/)[1]?.trim() || '';
      continue;
    }

    // Extract "Why This Is Predatory"
    if (line.startsWith('Why This Is Predatory:') && currentClause) {
      currentClause.whyPredatory = line.replace('Why This Is Predatory:', '').trim();
      continue;
    }

    // Continue building analysis text
    if (currentClause && currentClause.analysis && !line.includes('Original Text:') &&
        !line.match(/^\d+\./) && line.length > 20) {
      currentClause.analysis += ' ' + line;
    }

    // Executive summary
    if (line.startsWith('EXECUTIVE SUMMARY:')) {
      sections.summary = line.replace('EXECUTIVE SUMMARY:', '').trim();
    }
  }

  if (currentClause) sections.clauses.push(currentClause);

  return sections;
}

function generateEducationalHTML(companies) {
  console.log(`📊 Generating educational HTML for ${companies.length} companies`);

  const analysisCards = companies.map(company => {
    const companyData = company.tos_analysis_companies;
    const documentData = company.tos_analysis_documents;

    const scoreColor = company.transparency_score >= 90 ? '#00ff88' :
                      company.transparency_score >= 50 ? '#ffaa00' :
                      company.transparency_score >= 20 ? '#ff6666' : '#ff3333';

    const category = company.transparency_score >= 90 ? 'EXEMPLARY' :
                    company.transparency_score >= 50 ? 'ACCEPTABLE' :
                    company.transparency_score >= 20 ? 'PREDATORY' : 'HORROR MOVIE';

    // Parse concerning clauses
    const concerningClauses = Array.isArray(company.concerning_clauses)
      ? company.concerning_clauses
      : [];

    const topClauses = concerningClauses.slice(0, 2).map(clause => `
      <div class="mini-clause">
        <div class="mini-title">${clause.category || 'Red Flag'}</div>
        <div class="mini-concern">${(clause.concern || '').substring(0, 120)}...</div>
      </div>
    `).join('');

    // Parse key concerns
    const keyConcerns = Array.isArray(company.key_concerns)
      ? company.key_concerns
      : [];

    const topConcerns = keyConcerns.slice(0, 3).map(concern => `
      <li class="concern-item">• ${concern}</li>
    `).join('');

    return `
      <div class="company-card" data-company-id="${company.id}">
        <div class="card-top">
          <h3>${companyData.name}</h3>
          <div class="score-pill" style="background: ${scoreColor};">
            ${company.transparency_score}/100
          </div>
        </div>

        <div class="company-meta">
          <span class="industry">${companyData.industry || 'Technology'}</span>
          <span class="domain">${companyData.domain}</span>
          ${companyData.headquarters ? `<span class="location">${companyData.headquarters}</span>` : ''}
        </div>

        <div class="category-badge">${category}</div>

        <div class="summary-text">
          ${(company.executive_summary || 'Full analysis available').substring(0, 200)}...
        </div>

        <div class="metrics-mini">
          <div class="metric">
            <span>Transparency:</span> <strong style="color: ${scoreColor};">${company.transparency_score}/100</strong>
          </div>
          <div class="metric">
            <span>Privacy:</span> <strong>${company.privacy_score}/100</strong>
          </div>
          <div class="metric">
            <span>Manipulation Risk:</span> <strong style="color: #ff6666;">${company.manipulation_risk_score}/100</strong>
          </div>
        </div>

        ${topConcerns ? `
          <div class="top-concerns">
            <strong>Key Red Flags:</strong>
            <ul>${topConcerns}</ul>
          </div>
        ` : ''}

        ${topClauses ? `
          <div class="concerning-clauses">
            ${topClauses}
          </div>
        ` : ''}

        <div class="card-actions">
          <button class="expand-btn" onclick="viewFullEducationalAnalysis(${company.id})">
            📚 View Quote & Explain Analysis
          </button>
          ${companyData.tos_url ? `
            <a href="${companyData.tos_url}" target="_blank" class="tos-link">
              📜 Original ToS
            </a>
          ` : ''}
        </div>

        <div class="analysis-date">
          Analyzed: ${new Date(company.analyzed_at).toLocaleDateString()}
        </div>
      </div>
    `;
  }).join('');

  const stats = {
    total: companies.length,
    exemplary: companies.filter(c => c.transparency_score >= 90).length,
    acceptable: companies.filter(c => c.transparency_score >= 50 && c.transparency_score < 90).length,
    predatory: companies.filter(c => c.transparency_score >= 20 && c.transparency_score < 50).length,
    horror: companies.filter(c => c.transparency_score < 20).length
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ToS Salad - Educational Transparency Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: #e8e8e8;
            line-height: 1.5;
        }

        .top-nav {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border-bottom: 1px solid #333;
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .database-status {
            background: rgba(78, 205, 196, 0.2);
            color: #4ecdc4;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .nav-tabs {
            display: flex;
            gap: 1rem;
        }

        .nav-tab {
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid #444;
            color: #e8e8e8;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .nav-tab:hover, .nav-tab.active {
            background: #4ecdc4;
            color: #000;
            border-color: #4ecdc4;
        }

        .stats-bar {
            background: rgba(26, 26, 26, 0.9);
            padding: 1rem 2rem;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }

        .stat-label {
            font-size: 0.8rem;
            color: #888;
        }

        .exemplary { color: #00ff88; }
        .acceptable { color: #ffaa00; }
        .predatory { color: #ff6666; }
        .horror { color: #ff3333; }

        .main-content {
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .search-filter {
            margin-bottom: 2rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }

        .search-input {
            flex: 1;
            min-width: 250px;
            padding: 0.75rem;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 6px;
            color: #e8e8e8;
        }

        .filter-select {
            padding: 0.75rem;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 6px;
            color: #e8e8e8;
        }

        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 1.5rem;
        }

        .company-card {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 1.5rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .company-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            border-color: #4ecdc4;
        }

        .card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .card-top h3 {
            font-size: 1.2rem;
            color: #fff;
            flex: 1;
            margin-right: 1rem;
        }

        .score-pill {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            color: #000;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .company-meta {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .company-meta span {
            background: #333;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            color: #aaa;
        }

        .category-badge {
            background: rgba(78, 205, 196, 0.2);
            color: #4ecdc4;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: inline-block;
        }

        .summary-text {
            color: #ccc;
            margin-bottom: 1rem;
            line-height: 1.4;
            font-size: 0.9rem;
        }

        .metrics-mini {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .metric:last-child {
            margin-bottom: 0;
        }

        .top-concerns {
            margin-bottom: 1rem;
        }

        .top-concerns ul {
            list-style: none;
            margin-top: 0.5rem;
        }

        .concern-item {
            color: #ff6b6b;
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
        }

        .concerning-clauses {
            margin-bottom: 1rem;
        }

        .mini-clause {
            background: rgba(255, 107, 107, 0.1);
            border-left: 3px solid #ff6b6b;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            border-radius: 6px;
        }

        .mini-title {
            font-weight: 600;
            color: #ff6b6b;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
        }

        .mini-concern {
            color: #ccc;
            font-size: 0.8rem;
            line-height: 1.4;
        }

        .card-actions {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .expand-btn {
            background: #4ecdc4;
            color: #000;
            border: none;
            padding: 0.7rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            flex: 1;
            transition: background 0.3s ease;
        }

        .expand-btn:hover {
            background: #45b7d1;
        }

        .tos-link {
            background: #333;
            color: #e8e8e8;
            text-decoration: none;
            padding: 0.7rem 1rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: background 0.3s ease;
            white-space: nowrap;
        }

        .tos-link:hover {
            background: #444;
        }

        .analysis-date {
            text-align: center;
            color: #666;
            font-size: 0.8rem;
            border-top: 1px solid #333;
            padding-top: 1rem;
        }

        /* Modal Styles for Full Analysis */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            overflow-y: auto;
        }

        .modal-content {
            background: #1a1a1a;
            margin: 2% auto;
            padding: 0;
            border-radius: 12px;
            width: 95%;
            max-width: 1000px;
            max-height: 90%;
            overflow: hidden;
            border: 1px solid #333;
        }

        .modal-header {
            background: #2a2a2a;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.5rem;
            color: #fff;
        }

        .close-modal {
            font-size: 2rem;
            cursor: pointer;
            color: #888;
            background: none;
            border: none;
        }

        .close-modal:hover {
            color: #fff;
        }

        .modal-body {
            padding: 2rem;
            overflow-y: auto;
            max-height: calc(90vh - 120px);
        }

        .analysis-section {
            margin-bottom: 2rem;
        }

        .analysis-section h3 {
            color: #4ecdc4;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }

        .clause-full {
            background: linear-gradient(135deg, #2a1e1e, #3a2a2a);
            border: 1px solid #ff6b6b;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .clause-number {
            background: #ff6b6b;
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 1rem;
        }

        .clause-title {
            font-size: 1.2rem;
            color: #fff;
            margin-bottom: 1.5rem;
            font-weight: 600;
        }

        .original-quote {
            background: rgba(255, 107, 107, 0.15);
            border-left: 4px solid #ff6b6b;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
        }

        .quote-label {
            font-weight: 700;
            color: #ff6b6b;
            margin-bottom: 1rem;
            font-size: 1rem;
        }

        .quote-text {
            font-style: italic;
            color: #e8e8e8;
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 6px;
            line-height: 1.6;
        }

        .plain-english {
            background: rgba(78, 205, 196, 0.15);
            border-left: 4px solid #4ecdc4;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .analysis-label {
            font-weight: 700;
            color: #4ecdc4;
            margin-bottom: 1rem;
            font-size: 1rem;
        }

        .analysis-text {
            color: #e8e8e8;
            line-height: 1.6;
        }

        .predatory-explanation {
            background: rgba(255, 165, 0, 0.15);
            border-left: 4px solid #ffaa00;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .predatory-label {
            font-weight: 700;
            color: #ffaa00;
            margin-bottom: 1rem;
            font-size: 1rem;
        }

        @media (max-width: 768px) {
            .top-nav {
                flex-direction: column;
                gap: 1rem;
            }

            .stats-bar {
                gap: 1rem;
            }

            .analysis-grid {
                grid-template-columns: 1fr;
            }

            .search-filter {
                flex-direction: column;
            }

            .search-input {
                min-width: 100%;
            }

            .modal-content {
                width: 98%;
                margin: 1% auto;
            }

            .modal-body {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <nav class="top-nav">
        <div class="logo">🥗 ToS Salad</div>
        <div class="database-status">📚 Educational Platform: ${stats.total} Companies</div>
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showSection('analysis')">📊 Analysis</button>
            <button class="nav-tab" onclick="showSection('verifier')">🔍 Verifier</button>
            <button class="nav-tab" onclick="showSection('chat')">💬 AI Agent</button>
        </div>
    </nav>

    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-number exemplary">${stats.exemplary}</div>
            <div class="stat-label">Exemplary</div>
        </div>
        <div class="stat-item">
            <div class="stat-number acceptable">${stats.acceptable}</div>
            <div class="stat-label">Acceptable</div>
        </div>
        <div class="stat-item">
            <div class="stat-number predatory">${stats.predatory}</div>
            <div class="stat-label">Predatory</div>
        </div>
        <div class="stat-item">
            <div class="stat-number horror">${stats.horror}</div>
            <div class="stat-label">Horror Movie</div>
        </div>
        <div class="stat-item">
            <div class="stat-number" style="color: #4ecdc4;">${stats.total}</div>
            <div class="stat-label">Total Companies</div>
        </div>
    </div>

    <div class="main-content">
        <div class="search-filter">
            <input type="text" class="search-input" placeholder="Search companies, industries, or red flags..." id="searchInput">
            <select class="filter-select" id="scoreFilter">
                <option value="all">All Scores</option>
                <option value="exemplary">Exemplary (90+)</option>
                <option value="acceptable">Acceptable (50-89)</option>
                <option value="predatory">Predatory (20-49)</option>
                <option value="horror">Horror Movie (0-19)</option>
            </select>
        </div>

        <div class="analysis-grid" id="analysisGrid">
            ${analysisCards}
        </div>
    </div>

    <!-- Modal for full educational analysis -->
    <div id="educationalModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">Company Analysis</div>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
                Loading analysis...
            </div>
        </div>
    </div>

    <script>
        let allCompanies = ${JSON.stringify(companies)};

        function showSection(sectionName) {
            // Navigation functionality would go here
            console.log('Navigating to:', sectionName);
        }

        async function viewFullEducationalAnalysis(companyId) {
            const company = allCompanies.find(c => c.id === companyId);
            if (!company) return;

            const modal = document.getElementById('educationalModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            modalTitle.textContent = company.tos_analysis_companies.name + ' - Educational Analysis';
            modalBody.innerHTML = 'Loading detailed analysis...';

            modal.style.display = 'block';

            // Fetch detailed analysis
            try {
                const response = await fetch('/api/full-analysis/' + companyId);
                const data = await response.json();

                if (data.success) {
                    modalBody.innerHTML = data.html;
                } else {
                    modalBody.innerHTML = generateFallbackAnalysis(company);
                }
            } catch (error) {
                console.error('Error loading analysis:', error);
                modalBody.innerHTML = generateFallbackAnalysis(company);
            }
        }

        function generateFallbackAnalysis(company) {
            const keyConcerns = Array.isArray(company.key_concerns) ? company.key_concerns : [];
            const recommendations = Array.isArray(company.recommendations) ? company.recommendations : [];
            const concerningClauses = Array.isArray(company.concerning_clauses) ? company.concerning_clauses : [];

            return \`
                <div class="analysis-section">
                    <h3>📊 Transparency Scores</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: \${company.transparency_score >= 90 ? '#00ff88' : company.transparency_score >= 50 ? '#ffaa00' : '#ff6666'};">\${company.transparency_score}/100</div>
                            <div>Transparency</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: #4ecdc4;">\${company.privacy_score}/100</div>
                            <div>Privacy Protection</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: #ff6666;">\${company.manipulation_risk_score}/100</div>
                            <div>Manipulation Risk</div>
                        </div>
                    </div>
                </div>

                <div class="analysis-section">
                    <h3>📋 Executive Summary</h3>
                    <p style="background: rgba(78, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 1.5rem; border-radius: 8px; line-height: 1.6;">
                        \${company.executive_summary || 'This analysis examines the terms of service for transparency, user rights, and corporate accountability.'}
                    </p>
                </div>

                \${keyConcerns.length > 0 ? \`
                    <div class="analysis-section">
                        <h3>🚨 Key Red Flags</h3>
                        \${keyConcerns.map(concern => \`
                            <div style="background: rgba(255, 107, 107, 0.1); border-left: 4px solid #ff6b6b; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                                • \${concern}
                            </div>
                        \`).join('')}
                    </div>
                \` : ''}

                \${concerningClauses.length > 0 ? \`
                    <div class="analysis-section">
                        <h3>⚖️ Concerning Legal Clauses</h3>
                        \${concerningClauses.map((clause, index) => \`
                            <div class="clause-full">
                                <div class="clause-number">\${index + 1}</div>
                                <div class="clause-title">\${clause.category || 'Legal Concern'}</div>

                                <div class="plain-english">
                                    <div class="analysis-label">🔍 What This Means:</div>
                                    <div class="analysis-text">\${clause.concern || 'Analysis of concerning terms and their implications for users.'}</div>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                \` : ''}

                \${recommendations.length > 0 ? \`
                    <div class="analysis-section">
                        <h3>💡 Recommendations</h3>
                        \${recommendations.map(rec => \`
                            <div style="background: rgba(78, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                                • \${rec}
                            </div>
                        \`).join('')}
                    </div>
                \` : ''}

                <div class="analysis-section">
                    <h3>📚 Educational Purpose</h3>
                    <p style="background: rgba(255, 165, 0, 0.1); border-left: 4px solid #ffaa00; padding: 1.5rem; border-radius: 8px; line-height: 1.6;">
                        This analysis is part of ToS Salad's transparency research project. We examine terms of service to help users understand corporate legal frameworks and make informed decisions about digital services.
                    </p>
                </div>
            \`;
        }

        function closeModal() {
            document.getElementById('educationalModal').style.display = 'none';
        }

        // Search and filter functionality
        function filterCompanies() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const scoreFilter = document.getElementById('scoreFilter').value;
            const cards = document.querySelectorAll('.company-card');

            cards.forEach(card => {
                const companyId = parseInt(card.dataset.companyId);
                const company = allCompanies.find(c => c.id === companyId);

                if (!company) {
                    card.style.display = 'none';
                    return;
                }

                // Text search
                const companyText = (
                    company.tos_analysis_companies.name + ' ' +
                    company.tos_analysis_companies.industry + ' ' +
                    company.tos_analysis_companies.domain + ' ' +
                    (company.executive_summary || '') + ' ' +
                    (company.key_concerns || []).join(' ')
                ).toLowerCase();

                const matchesSearch = !searchTerm || companyText.includes(searchTerm);

                // Score filter
                let matchesScore = true;
                if (scoreFilter !== 'all') {
                    const score = company.transparency_score;
                    switch(scoreFilter) {
                        case 'exemplary':
                            matchesScore = score >= 90;
                            break;
                        case 'acceptable':
                            matchesScore = score >= 50 && score < 90;
                            break;
                        case 'predatory':
                            matchesScore = score >= 20 && score < 50;
                            break;
                        case 'horror':
                            matchesScore = score < 20;
                            break;
                    }
                }

                card.style.display = (matchesSearch && matchesScore) ? 'block' : 'none';
            });
        }

        document.getElementById('searchInput').addEventListener('input', filterCompanies);
        document.getElementById('scoreFilter').addEventListener('change', filterCompanies);

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('educationalModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>
  `;
}

async function startEducationalPlatform() {
  const PORT = 3009;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('📚 Loading educational platform with full analysis...');
      const companies = await getAllCompaniesFromDatabase();
      const html = generateEducationalHTML(companies);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url.startsWith('/api/full-analysis/')) {
      const companyId = req.url.split('/').pop();
      console.log(`📖 Loading full analysis for company ${companyId}`);

      try {
        const { data: company, error } = await supabase
          .from('tos_analysis_results')
          .select(`
            *,
            tos_analysis_companies!inner(*),
            tos_analysis_documents!inner(*)
          `)
          .eq('id', companyId)
          .single();

        if (error || !company) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Company not found' }));
          return;
        }

        // Parse the raw content for structured analysis
        const rawContent = company.tos_analysis_documents.raw_content;
        const parsedAnalysis = parseAnalysisContent(rawContent);

        if (parsedAnalysis && parsedAnalysis.clauses.length > 0) {
          // Generate educational HTML with quotes and explanations
          const clausesHTML = parsedAnalysis.clauses.map((clause, index) => `
            <div class="clause-full">
                <div class="clause-number">${clause.number || index + 1}</div>
                <div class="clause-title">${clause.title}</div>

                ${clause.originalText ? `
                    <div class="original-quote">
                        <div class="quote-label">📜 Original Terms of Service Quote:</div>
                        <div class="quote-text">"${clause.originalText}"</div>
                    </div>
                ` : ''}

                ${clause.analysis ? `
                    <div class="plain-english">
                        <div class="analysis-label">🔍 What This Actually Means (Plain English):</div>
                        <div class="analysis-text">${clause.analysis}</div>
                    </div>
                ` : ''}

                ${clause.whyPredatory ? `
                    <div class="predatory-explanation">
                        <div class="predatory-label">⚠️ Why This Is Problematic:</div>
                        <div class="analysis-text">${clause.whyPredatory}</div>
                    </div>
                ` : ''}
            </div>
          `).join('');

          const fullAnalysisHTML = `
            <div class="analysis-section">
                <h3>📊 Transparency Analysis</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: ${company.transparency_score >= 90 ? '#00ff88' : company.transparency_score >= 50 ? '#ffaa00' : '#ff6666'};">${company.transparency_score}/100</div>
                        <div>Transparency Score</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: #4ecdc4;">${company.privacy_score}/100</div>
                        <div>Privacy Protection</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: #ff6666;">${company.manipulation_risk_score}/100</div>
                        <div>Manipulation Risk</div>
                    </div>
                </div>
            </div>

            <div class="analysis-section">
                <h3>📋 Executive Summary</h3>
                <p style="background: rgba(78, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 1.5rem; border-radius: 8px; line-height: 1.6;">
                    ${company.executive_summary || 'Detailed analysis of terms of service examining corporate power, user rights, and transparency.'}
                </p>
            </div>

            <div class="analysis-section">
                <h3>🎓 Quote & Explain Educational Analysis</h3>
                <p style="margin-bottom: 2rem; color: #888;">
                    This analysis shows original quotes from the terms of service alongside plain English explanations of what they actually mean for users.
                </p>
                ${clausesHTML}
            </div>

            <div class="analysis-section">
                <h3>📚 About This Analysis</h3>
                <p style="background: rgba(255, 165, 0, 0.1); border-left: 4px solid #ffaa00; padding: 1.5rem; border-radius: 8px; line-height: 1.6;">
                    This educational analysis is part of ToS Salad's transparency research project. We examine corporate terms of service to help users understand legal frameworks and make informed decisions about digital services. All quotes are taken directly from the company's official terms of service.
                </p>
            </div>
          `;

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, html: fullAnalysisHTML }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No detailed analysis available' }));
        }
      } catch (error) {
        console.error('Error loading full analysis:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Server error' }));
      }
    } else if (req.url === '/api/companies') {
      const companies = await getAllCompaniesFromDatabase();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(companies, null, 2));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🎓 Educational ToS Salad Platform Started!');
    console.log(`📚 Quote & Explain: http://localhost:${PORT}`);
    console.log(`📊 API Endpoint: http://localhost:${PORT}/api/companies`);
    console.log('✅ Functional "View Complete Analysis" buttons with educational content!');
  });
}

startEducationalPlatform();