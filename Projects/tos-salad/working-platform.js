#!/usr/bin/env node

/**
 * ToS Salad Working Platform - ACTUALLY FUNCTIONAL
 * Uses real database content and working button functionality
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function getAllCompanies() {
  try {
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
          name,
          domain,
          industry,
          tos_url
        )
      `)
      .order('transparency_score', { ascending: false });

    if (error) throw error;
    return results || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

async function getCompanyAnalysis(companyId) {
  try {
    const { data: result, error } = await supabase
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
          name,
          domain,
          industry,
          tos_url
        ),
        tos_analysis_documents!inner(
          raw_content,
          cleaned_content
        )
      `)
      .eq('id', companyId)
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Analysis fetch error:', error);
    return null;
  }
}

function generateMainHTML(companies) {
  const companyCards = companies.map(company => {
    const companyData = company.tos_analysis_companies;

    const scoreColor = company.transparency_score >= 90 ? '#00ff88' :
                      company.transparency_score >= 50 ? '#ffaa00' :
                      company.transparency_score >= 20 ? '#ff6666' : '#ff3333';

    const category = company.transparency_score >= 90 ? 'EXEMPLARY' :
                    company.transparency_score >= 50 ? 'ACCEPTABLE' :
                    company.transparency_score >= 20 ? 'PREDATORY' : 'HORROR MOVIE';

    // Parse key concerns safely
    const keyConcerns = Array.isArray(company.key_concerns)
      ? company.key_concerns.slice(0, 3)
      : [];

    const concernsList = keyConcerns.map(concern => `
      <li style="color: #ff6b6b; font-size: 0.85rem; margin-bottom: 0.25rem;">• ${concern}</li>
    `).join('');

    return `
      <div class="company-card">
        <div class="card-header">
          <h3>${companyData.name}</h3>
          <div class="score-badge" style="background: ${scoreColor};">
            ${company.transparency_score}/100
          </div>
        </div>

        <div class="company-meta">
          <span class="industry">${companyData.industry || 'Technology'}</span>
          <span class="domain">${companyData.domain}</span>
        </div>

        <div class="category-badge">${category}</div>

        <div class="metrics">
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

        ${concernsList ? `
          <div class="concerns">
            <strong>Key Red Flags:</strong>
            <ul>${concernsList}</ul>
          </div>
        ` : ''}

        <div class="card-actions">
          <button class="analysis-btn" onclick="loadAnalysis(${company.id})">
            📚 View Complete Analysis
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
    <title>🥗 ToS Salad - Working Platform</title>
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

        .header {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            padding: 2rem;
            text-align: center;
            border-bottom: 1px solid #333;
        }

        .header h1 {
            font-size: 2.5rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .stats-bar {
            background: rgba(26, 26, 26, 0.9);
            padding: 1rem;
            display: flex;
            justify-content: center;
            gap: 2rem;
            border-bottom: 1px solid #333;
            flex-wrap: wrap;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: 700;
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

        .search-bar {
            margin-bottom: 2rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .search-input {
            flex: 1;
            min-width: 300px;
            padding: 1rem;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 8px;
            color: #e8e8e8;
            font-size: 1rem;
        }

        .filter-select {
            padding: 1rem;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 8px;
            color: #e8e8e8;
        }

        .companies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 2rem;
        }

        .company-card {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 2rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .company-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
            border-color: #4ecdc4;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .card-header h3 {
            font-size: 1.3rem;
            color: #fff;
        }

        .score-badge {
            padding: 0.75rem;
            border-radius: 12px;
            font-weight: 700;
            color: #000;
            text-align: center;
        }

        .company-meta {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .company-meta span {
            background: #333;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-size: 0.8rem;
            color: #aaa;
        }

        .category-badge {
            background: rgba(78, 205, 196, 0.2);
            color: #4ecdc4;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: inline-block;
        }

        .metrics {
            background: rgba(0, 0, 0, 0.3);
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
        }

        .metric:last-child {
            margin-bottom: 0;
        }

        .concerns {
            margin-bottom: 1.5rem;
        }

        .concerns ul {
            list-style: none;
            margin-top: 0.5rem;
        }

        .card-actions {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .analysis-btn {
            background: #4ecdc4;
            color: #000;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            flex: 1;
            transition: background 0.3s ease;
        }

        .analysis-btn:hover {
            background: #45b7d1;
        }

        .tos-link {
            background: #333;
            color: #e8e8e8;
            text-decoration: none;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s ease;
        }

        .tos-link:hover {
            background: #444;
        }

        .analysis-date {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            border-top: 1px solid #333;
            padding-top: 1rem;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
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
            padding: 2rem;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.5rem;
            color: #fff;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            color: #888;
            cursor: pointer;
        }

        .close-btn:hover {
            color: #fff;
        }

        .modal-body {
            padding: 2rem;
            overflow-y: auto;
            max-height: calc(90vh - 120px);
        }

        .loading {
            text-align: center;
            padding: 3rem;
            color: #888;
        }

        @media (max-width: 768px) {
            .companies-grid {
                grid-template-columns: 1fr;
            }

            .search-bar {
                flex-direction: column;
            }

            .search-input {
                min-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <p>Transparency Research Platform - ${stats.total} Companies Analyzed</p>
    </div>

    <div class="stats-bar">
        <div class="stat">
            <div class="stat-number exemplary">${stats.exemplary}</div>
            <div class="stat-label">Exemplary</div>
        </div>
        <div class="stat">
            <div class="stat-number acceptable">${stats.acceptable}</div>
            <div class="stat-label">Acceptable</div>
        </div>
        <div class="stat">
            <div class="stat-number predatory">${stats.predatory}</div>
            <div class="stat-label">Predatory</div>
        </div>
        <div class="stat">
            <div class="stat-number horror">${stats.horror}</div>
            <div class="stat-label">Horror Movie</div>
        </div>
    </div>

    <div class="main-content">
        <div class="search-bar">
            <input type="text" class="search-input" placeholder="Search companies..." id="searchInput">
            <select class="filter-select" id="scoreFilter">
                <option value="all">All Scores</option>
                <option value="exemplary">Exemplary (90+)</option>
                <option value="acceptable">Acceptable (50-89)</option>
                <option value="predatory">Predatory (20-49)</option>
                <option value="horror">Horror Movie (0-19)</option>
            </select>
        </div>

        <div class="companies-grid" id="companiesGrid">
            ${companyCards}
        </div>
    </div>

    <!-- Analysis Modal -->
    <div id="analysisModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">Company Analysis</div>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
                <div class="loading">Loading analysis...</div>
            </div>
        </div>
    </div>

    <script>
        // WORKING BUTTON FUNCTIONALITY
        async function loadAnalysis(companyId) {
            const modal = document.getElementById('analysisModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            // Show modal immediately
            modal.style.display = 'block';
            modalBody.innerHTML = '<div class="loading">Loading analysis...</div>';

            try {
                // ACTUAL API CALL TO WORKING ENDPOINT
                const response = await fetch('/api/analysis/' + companyId);
                const data = await response.json();

                if (data.success) {
                    modalTitle.textContent = data.company + ' - Complete Analysis';
                    modalBody.innerHTML = data.html;
                } else {
                    modalBody.innerHTML = '<div style="color: #ff6666; text-align: center; padding: 2rem;">Error loading analysis: ' + data.error + '</div>';
                }
            } catch (error) {
                console.error('Failed to load analysis:', error);
                modalBody.innerHTML = '<div style="color: #ff6666; text-align: center; padding: 2rem;">Failed to load analysis. Please try again.</div>';
            }
        }

        function closeModal() {
            document.getElementById('analysisModal').style.display = 'none';
        }

        // Search functionality
        function filterCompanies() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const scoreFilter = document.getElementById('scoreFilter').value;
            const cards = document.querySelectorAll('.company-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const scoreElement = card.querySelector('.score-badge');
                const score = parseInt(scoreElement.textContent);

                const matchesSearch = !searchTerm || text.includes(searchTerm);

                let matchesScore = true;
                switch(scoreFilter) {
                    case 'exemplary': matchesScore = score >= 90; break;
                    case 'acceptable': matchesScore = score >= 50 && score < 90; break;
                    case 'predatory': matchesScore = score >= 20 && score < 50; break;
                    case 'horror': matchesScore = score < 20; break;
                }

                card.style.display = (matchesSearch && matchesScore) ? 'block' : 'none';
            });
        }

        document.getElementById('searchInput').addEventListener('input', filterCompanies);
        document.getElementById('scoreFilter').addEventListener('change', filterCompanies);

        // Close modal on outside click
        window.onclick = function(event) {
            const modal = document.getElementById('analysisModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>
  `;
}

function generateAnalysisHTML(analysis) {
  const company = analysis.tos_analysis_companies;
  const document = analysis.tos_analysis_documents;

  const scoreColor = analysis.transparency_score >= 90 ? '#00ff88' :
                    analysis.transparency_score >= 50 ? '#ffaa00' :
                    analysis.transparency_score >= 20 ? '#ff6666' : '#ff3333';

  // Parse arrays safely
  const keyConcerns = Array.isArray(analysis.key_concerns) ? analysis.key_concerns : [];
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
  const concerningClauses = Array.isArray(analysis.concerning_clauses) ? analysis.concerning_clauses : [];

  const concernsHTML = keyConcerns.map(concern => `
    <div style="background: rgba(255, 107, 107, 0.1); border-left: 4px solid #ff6b6b; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
      ${concern}
    </div>
  `).join('');

  const clausesHTML = concerningClauses.map(clause => `
    <div style="background: rgba(255, 165, 0, 0.1); border-left: 4px solid #ffaa00; padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 8px;">
      <h4 style="color: #ffaa00; margin-bottom: 1rem;">${clause.category || 'Concerning Clause'}</h4>
      <p>${clause.concern || 'Analysis not available'}</p>
    </div>
  `).join('');

  const recommendationsHTML = recommendations.map(rec => `
    <div style="background: rgba(78, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
      ${rec}
    </div>
  `).join('');

  return `
    <div style="margin-bottom: 2rem;">
      <h3>📊 Transparency Scores</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
        <div style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: ${scoreColor};">${analysis.transparency_score}/100</div>
          <div>Transparency</div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: #4ecdc4;">${analysis.privacy_score}/100</div>
          <div>Privacy Protection</div>
        </div>
        <div style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; color: #ff6666;">${analysis.manipulation_risk_score}/100</div>
          <div>Manipulation Risk</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 2rem;">
      <h3>📋 Executive Summary</h3>
      <div style="background: rgba(78, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
        ${analysis.executive_summary || 'This analysis examines the terms of service for transparency, user rights, and corporate accountability.'}
      </div>
    </div>

    ${keyConcerns.length > 0 ? `
      <div style="margin-bottom: 2rem;">
        <h3>🚨 Key Concerns</h3>
        ${concernsHTML}
      </div>
    ` : ''}

    ${concerningClauses.length > 0 ? `
      <div style="margin-bottom: 2rem;">
        <h3>⚖️ Concerning Clauses</h3>
        ${clausesHTML}
      </div>
    ` : ''}

    ${recommendations.length > 0 ? `
      <div style="margin-bottom: 2rem;">
        <h3>💡 Recommendations</h3>
        ${recommendationsHTML}
      </div>
    ` : ''}

    <div style="background: rgba(255, 165, 0, 0.1); border-left: 4px solid #ffaa00; padding: 1.5rem; border-radius: 8px;">
      <h3>📚 About This Analysis</h3>
      <p>This analysis is part of ToS Salad's transparency research project. We examine terms of service to help users understand corporate legal frameworks and their implications for user rights and privacy.</p>
    </div>
  `;
}

async function startWorkingPlatform() {
  const PORT = 3010;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === '/' || url.pathname === '/index.html') {
      console.log('🔄 Loading companies from database...');
      const companies = await getAllCompanies();
      const html = generateMainHTML(companies);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);

    } else if (url.pathname.startsWith('/api/analysis/')) {
      const companyId = url.pathname.split('/').pop();
      console.log(`📊 Loading analysis for company ${companyId}...`);

      const analysis = await getCompanyAnalysis(companyId);

      if (analysis) {
        const html = generateAnalysisHTML(analysis);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          company: analysis.tos_analysis_companies.name,
          html: html
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Company analysis not found'
        }));
      }

    } else if (url.pathname === '/api/companies') {
      const companies = await getAllCompanies();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(companies, null, 2));

    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🎯 WORKING ToS Salad Platform Started!');
    console.log(`🌐 Functional Interface: http://localhost:${PORT}`);
    console.log(`📊 API Endpoint: http://localhost:${PORT}/api/companies`);
    console.log('✅ Working buttons that load actual database content!');
    console.log('🔗 Proper routing: /api/analysis/[company-id]');
  });
}

startWorkingPlatform();