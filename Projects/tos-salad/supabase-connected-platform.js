#!/usr/bin/env node

/**
 * ToS Salad Platform - PROPERLY CONNECTED TO SUPABASE
 * Connects to the actual database with 38+ companies instead of reading files
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

function generateDatabaseConnectedHTML(companies) {
  console.log(`📊 Generating HTML for ${companies.length} companies from database`);

  const analysisCards = companies.map(company => {
    const companyData = company.tos_analysis_companies;
    const documentData = company.tos_analysis_documents;

    const scoreColor = company.transparency_score >= 90 ? '#00ff88' :
                      company.transparency_score >= 50 ? '#ffaa00' :
                      company.transparency_score >= 20 ? '#ff6666' : '#ff3333';

    const category = company.transparency_score >= 90 ? 'EXEMPLARY' :
                    company.transparency_score >= 50 ? 'ACCEPTABLE' :
                    company.transparency_score >= 20 ? 'PREDATORY' : 'HORROR MOVIE';

    // Parse concerning clauses if they exist
    const concerningClauses = Array.isArray(company.concerning_clauses)
      ? company.concerning_clauses
      : [];

    const clauseCards = concerningClauses.slice(0, 2).map(clause => `
      <div class="mini-clause">
        <div class="mini-title">${clause.category || 'Concerning Clause'}</div>
        <div class="mini-analysis">${clause.concern || 'Analysis not available'}</div>
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
          ${company.executive_summary || 'Analysis available in database'}
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
            <strong>Key Concerns:</strong>
            <ul>${topConcerns}</ul>
          </div>
        ` : ''}

        ${clauseCards ? `
          <div class="concerning-clauses">
            ${clauseCards}
          </div>
        ` : ''}

        <div class="card-actions">
          <button class="expand-btn" onclick="viewFullAnalysis(${company.id}, '${companyData.name.replace(/'/g, "\\'")}')">
            View Complete Analysis
          </button>
          ${companyData.tos_url ? `
            <a href="${companyData.tos_url}" target="_blank" class="tos-link">
              View Original ToS
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
    <title>🥗 ToS Salad - Database Connected Platform</title>
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

        .section {
            display: none;
        }

        .section.active {
            display: block;
        }

        .section-header {
            margin-bottom: 2rem;
            text-align: center;
        }

        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
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

        .mini-analysis {
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
            padding: 0.6rem 1rem;
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
            padding: 0.6rem 1rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: background 0.3s ease;
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

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
        }

        .modal-content {
            background: #1a1a1a;
            margin: 3% auto;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 900px;
            max-height: 85%;
            overflow-y: auto;
            border: 1px solid #333;
        }

        .close-modal {
            float: right;
            font-size: 2rem;
            cursor: pointer;
            color: #888;
        }

        .close-modal:hover {
            color: #fff;
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
        }
    </style>
</head>
<body>
    <nav class="top-nav">
        <div class="logo">🥗 ToS Salad</div>
        <div class="database-status">📊 Connected to Database: ${stats.total} Companies</div>
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
        <!-- Analysis Section -->
        <div id="analysis-section" class="section active">
            <div class="section-header">
                <h2>📊 Complete ToS Analysis Database</h2>
                <p>All ${stats.total} companies from our Supabase database with full transparency research</p>
            </div>

            <div class="search-filter">
                <input type="text" class="search-input" placeholder="Search companies, industries, or concerns..." id="searchInput">
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

        <!-- Verifier Section -->
        <div id="verifier-section" class="section">
            <div class="section-header">
                <h2>🔍 The Verifier</h2>
                <p>Content verification tools integrated with our transparency research</p>
            </div>
            <p style="text-align: center; color: #888;">Verifier interface would be displayed here</p>
        </div>

        <!-- Chat Section -->
        <div id="chat-section" class="section">
            <div class="section-header">
                <h2>💬 AI Agent</h2>
                <p>Chat about any of the ${stats.total} companies in our database</p>
            </div>
            <p style="text-align: center; color: #888;">AI chat interface would be displayed here</p>
        </div>
    </div>

    <!-- Modal for full analysis -->
    <div id="analysisModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <div id="modalContent"></div>
        </div>
    </div>

    <script>
        let allCompanies = ${JSON.stringify(companies)};

        function showSection(sectionName) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            document.getElementById(sectionName + '-section').classList.add('active');
            event.target.classList.add('active');
        }

        function viewFullAnalysis(companyId, companyName) {
            const company = allCompanies.find(c => c.id === companyId);
            const modal = document.getElementById('analysisModal');
            const modalContent = document.getElementById('modalContent');

            if (company) {
                const keyConcerns = Array.isArray(company.key_concerns) ? company.key_concerns : [];
                const recommendations = Array.isArray(company.recommendations) ? company.recommendations : [];
                const concerningClauses = Array.isArray(company.concerning_clauses) ? company.concerning_clauses : [];

                modalContent.innerHTML = \`
                    <h2>\${companyName} - Complete Analysis</h2>
                    <div style="margin: 1rem 0;">
                        <strong>Transparency Score:</strong> \${company.transparency_score}/100<br>
                        <strong>Privacy Score:</strong> \${company.privacy_score}/100<br>
                        <strong>Manipulation Risk:</strong> \${company.manipulation_risk_score}/100
                    </div>

                    <h3>Executive Summary</h3>
                    <p style="margin-bottom: 1.5rem;">\${company.executive_summary || 'No summary available'}</p>

                    \${keyConcerns.length > 0 ? \`
                        <h3>Key Concerns</h3>
                        <ul>\${keyConcerns.map(concern => \`<li>\${concern}</li>\`).join('')}</ul>
                    \` : ''}

                    \${concerningClauses.length > 0 ? \`
                        <h3>Concerning Clauses</h3>
                        \${concerningClauses.map(clause => \`
                            <div style="background: rgba(255, 107, 107, 0.1); border-left: 4px solid #ff6b6b; padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                                <strong>\${clause.category || 'Clause'}</strong><br>
                                \${clause.concern || 'No details available'}
                            </div>
                        \`).join('')}
                    \` : ''}

                    \${recommendations.length > 0 ? \`
                        <h3>Recommendations</h3>
                        <ul>\${recommendations.map(rec => \`<li>\${rec}</li>\`).join('')}</ul>
                    \` : ''}
                \`;
            } else {
                modalContent.innerHTML = '<h2>Analysis not found</h2><p>Could not load analysis for this company.</p>';
            }

            modal.style.display = 'block';
        }

        function closeModal() {
            document.getElementById('analysisModal').style.display = 'none';
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
            const modal = document.getElementById('analysisModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>
  `;
}

async function startSupabaseConnectedPlatform() {
  const PORT = 3008;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('🔄 Loading all companies from Supabase database...');
      const companies = await getAllCompaniesFromDatabase();
      const html = generateDatabaseConnectedHTML(companies);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
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
    console.log('🚀 Supabase-Connected ToS Salad Platform Started!');
    console.log(`🌐 Database Connected: http://localhost:${PORT}`);
    console.log(`📊 API Endpoint: http://localhost:${PORT}/api/companies`);
    console.log('🗃️ Now showing ALL companies from the actual database!');
  });
}

startSupabaseConnectedPlatform();