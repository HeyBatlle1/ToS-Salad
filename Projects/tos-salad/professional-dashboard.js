#!/usr/bin/env node

/**
 * ToS Salad Professional Dashboard - High-Tech Interactive Analysis Platform
 * Showcases transparency research with professional UI/UX and detailed quote-explain system
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function getDetailedAnalyses() {
  try {
    const { data: results, error } = await supabase
      .from('tos_analysis_results')
      .select(`
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
        tos_analysis_companies!inner(name, domain, industry)
      `)
      .order('transparency_score', { ascending: false });

    if (error) throw error;
    return results || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

function generateProfessionalHTML(data) {
  const analysisCards = data.map((item, index) => {
    const company = item.tos_analysis_companies;

    // Color coding for transparency scores
    const scoreColor = item.transparency_score >= 90 ? '#00ff88' :
                      item.transparency_score >= 50 ? '#ffaa00' :
                      item.transparency_score >= 20 ? '#ff6666' : '#ff3333';

    const scoreLabel = item.transparency_score >= 90 ? 'EXEMPLARY' :
                      item.transparency_score >= 50 ? 'ACCEPTABLE' :
                      item.transparency_score >= 20 ? 'PREDATORY' : 'HORROR MOVIE';

    // Build concerning clauses with quotes and explanations
    const concerningClausesHTML = (item.concerning_clauses || []).map(clause => `
      <div class="clause-analysis">
        <div class="clause-category">${clause.category}</div>
        <div class="clause-concern">${clause.concern}</div>
      </div>
    `).join('');

    // Build manipulation tactics
    const manipulationTacticsHTML = (item.manipulation_tactics || []).map(tactic => `
      <span class="manipulation-tag">${tactic}</span>
    `).join('');

    // Build key concerns
    const keyConcernsHTML = (item.key_concerns || []).map(concern => `
      <li class="concern-item">${concern}</li>
    `).join('');

    // Build recommendations
    const recommendationsHTML = (item.recommendations || []).map(rec => `
      <li class="recommendation-item">${rec}</li>
    `).join('');

    return `
      <div class="analysis-card" data-company="${company.name}">
        <div class="card-header">
          <div class="company-info">
            <h2 class="company-name">${company.name}</h2>
            <div class="company-meta">
              <span class="industry">${company.industry || 'Technology'}</span>
              <span class="domain">${company.domain}</span>
            </div>
          </div>
          <div class="score-badge" style="background: ${scoreColor};">
            <div class="score-number">${item.transparency_score}</div>
            <div class="score-label">${scoreLabel}</div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric">
            <div class="metric-label">Transparency</div>
            <div class="metric-value" style="color: ${scoreColor};">${item.transparency_score}/100</div>
          </div>
          <div class="metric">
            <div class="metric-label">User Friendliness</div>
            <div class="metric-value">${item.user_friendliness_score}/100</div>
          </div>
          <div class="metric">
            <div class="metric-label">Privacy Protection</div>
            <div class="metric-value">${item.privacy_score}/100</div>
          </div>
          <div class="metric">
            <div class="metric-label">Manipulation Risk</div>
            <div class="metric-value manipulation-risk">${item.manipulation_risk_score}/100</div>
          </div>
        </div>

        <div class="executive-summary">
          <h3>Executive Summary</h3>
          <p>${item.executive_summary || 'Analysis in progress...'}</p>
        </div>

        <div class="analysis-sections">
          <div class="section concerning-clauses">
            <h3>🚨 Concerning Clauses Analysis</h3>
            <div class="clauses-container">
              ${concerningClausesHTML || '<p>No concerning clauses identified.</p>'}
            </div>
          </div>

          <div class="section manipulation-tactics">
            <h3>⚠️ Manipulation Tactics Detected</h3>
            <div class="tactics-container">
              ${manipulationTacticsHTML || '<span class="no-tactics">None detected</span>'}
            </div>
          </div>

          <div class="section key-concerns">
            <h3>🔍 Key Concerns</h3>
            <ul class="concerns-list">
              ${keyConcernsHTML || '<li>No major concerns identified.</li>'}
            </ul>
          </div>

          <div class="section recommendations">
            <h3>💡 Recommendations</h3>
            <ul class="recommendations-list">
              ${recommendationsHTML || '<li>No specific recommendations available.</li>'}
            </ul>
          </div>
        </div>

        <div class="analysis-metadata">
          <div class="analyzed-date">Analyzed: ${new Date(item.analyzed_at).toLocaleDateString()}</div>
        </div>
      </div>
    `;
  }).join('');

  const stats = {
    total: data.length,
    exemplary: data.filter(d => d.transparency_score >= 90).length,
    acceptable: data.filter(d => d.transparency_score >= 50 && d.transparency_score < 90).length,
    predatory: data.filter(d => d.transparency_score >= 20 && d.transparency_score < 50).length,
    horror: data.filter(d => d.transparency_score < 20).length
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ToS Salad - Professional Transparency Research Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #e8e8e8;
            line-height: 1.6;
            min-height: 100vh;
        }

        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-bottom: 1px solid #333;
            padding: 2rem;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }

        .header p {
            font-size: 1.2rem;
            color: #888;
            font-weight: 300;
        }

        .stats-dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .stat-card {
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 1rem;
            color: #aaa;
            font-weight: 500;
        }

        .exemplary { color: #00ff88; }
        .acceptable { color: #ffaa00; }
        .predatory { color: #ff6666; }
        .horror { color: #ff3333; }

        .main-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .filter-btn {
            background: #2a2a2a;
            border: 1px solid #444;
            color: #e8e8e8;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .filter-btn:hover, .filter-btn.active {
            background: #4ecdc4;
            border-color: #4ecdc4;
            color: #000;
        }

        .analysis-grid {
            display: grid;
            gap: 2rem;
        }

        .analysis-card {
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border: 1px solid #333;
            border-radius: 16px;
            padding: 2rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .analysis-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
            border-color: #4ecdc4;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
        }

        .company-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 0.5rem;
        }

        .company-meta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .industry, .domain {
            background: #333;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #aaa;
        }

        .score-badge {
            text-align: center;
            padding: 1rem;
            border-radius: 12px;
            min-width: 120px;
        }

        .score-number {
            font-size: 2rem;
            font-weight: 700;
            color: #000;
        }

        .score-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #000;
            margin-top: 0.25rem;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
        }

        .metric {
            text-align: center;
        }

        .metric-label {
            font-size: 0.9rem;
            color: #aaa;
            margin-bottom: 0.5rem;
        }

        .metric-value {
            font-size: 1.5rem;
            font-weight: 700;
        }

        .manipulation-risk {
            color: #ff6666;
        }

        .executive-summary {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(78, 205, 196, 0.1);
            border-left: 4px solid #4ecdc4;
            border-radius: 8px;
        }

        .executive-summary h3 {
            color: #4ecdc4;
            margin-bottom: 1rem;
        }

        .analysis-sections {
            display: grid;
            gap: 2rem;
        }

        .section {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #333;
        }

        .section h3 {
            margin-bottom: 1rem;
            color: #fff;
            font-size: 1.2rem;
        }

        .clause-analysis {
            background: rgba(255, 107, 107, 0.1);
            border-left: 4px solid #ff6b6b;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
        }

        .clause-category {
            font-weight: 700;
            color: #ff6b6b;
            margin-bottom: 0.5rem;
        }

        .clause-concern {
            color: #e8e8e8;
            line-height: 1.5;
        }

        .tactics-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .manipulation-tag {
            background: #ff6b6b;
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .no-tactics {
            color: #4ecdc4;
            font-style: italic;
        }

        .concerns-list, .recommendations-list {
            list-style: none;
        }

        .concern-item, .recommendation-item {
            background: rgba(255, 255, 255, 0.05);
            margin-bottom: 0.5rem;
            padding: 0.75rem;
            border-radius: 8px;
            border-left: 3px solid #4ecdc4;
        }

        .analysis-metadata {
            text-align: center;
            padding-top: 1.5rem;
            border-top: 1px solid #333;
            margin-top: 2rem;
            color: #666;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }

            .stats-dashboard {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                padding: 1rem;
            }

            .main-content {
                padding: 1rem;
            }

            .card-header {
                flex-direction: column;
                gap: 1rem;
            }

            .metrics-grid {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }
        }

        .search-container {
            margin-bottom: 2rem;
        }

        .search-input {
            width: 100%;
            padding: 1rem;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 8px;
            color: #e8e8e8;
            font-size: 1rem;
        }

        .search-input:focus {
            outline: none;
            border-color: #4ecdc4;
            box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <p>Professional Transparency Research Platform - Making Corporate Terms Digestible</p>
    </div>

    <div class="stats-dashboard">
        <div class="stat-card">
            <div class="stat-number exemplary">${stats.exemplary}</div>
            <div class="stat-label">Exemplary Companies</div>
        </div>
        <div class="stat-card">
            <div class="stat-number acceptable">${stats.acceptable}</div>
            <div class="stat-label">Acceptable Terms</div>
        </div>
        <div class="stat-card">
            <div class="stat-number predatory">${stats.predatory}</div>
            <div class="stat-label">Predatory Companies</div>
        </div>
        <div class="stat-card">
            <div class="stat-number horror">${stats.horror}</div>
            <div class="stat-label">Horror Movie Terms</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #4ecdc4;">${stats.total}</div>
            <div class="stat-label">Total Analyzed</div>
        </div>
    </div>

    <div class="main-content">
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search companies, industries, or analysis terms..." id="searchInput">
        </div>

        <div class="filters">
            <button class="filter-btn active" data-filter="all">All Companies</button>
            <button class="filter-btn" data-filter="exemplary">Exemplary (90+)</button>
            <button class="filter-btn" data-filter="acceptable">Acceptable (50-89)</button>
            <button class="filter-btn" data-filter="predatory">Predatory (20-49)</button>
            <button class="filter-btn" data-filter="horror">Horror Movie (0-19)</button>
        </div>

        <div class="analysis-grid" id="analysisGrid">
            ${analysisCards}
        </div>
    </div>

    <script>
        // Filter functionality
        const filterBtns = document.querySelectorAll('.filter-btn');
        const analysisCards = document.querySelectorAll('.analysis-card');
        const searchInput = document.getElementById('searchInput');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                filterCards(filter);
            });
        });

        function filterCards(filter) {
            analysisCards.forEach(card => {
                const companyName = card.dataset.company;
                const scoreElement = card.querySelector('.score-number');
                const score = parseInt(scoreElement.textContent);

                let show = false;

                switch(filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'exemplary':
                        show = score >= 90;
                        break;
                    case 'acceptable':
                        show = score >= 50 && score < 90;
                        break;
                    case 'predatory':
                        show = score >= 20 && score < 50;
                        break;
                    case 'horror':
                        show = score < 20;
                        break;
                }

                card.style.display = show ? 'block' : 'none';
            });
        }

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            analysisCards.forEach(card => {
                const companyName = card.dataset.company.toLowerCase();
                const cardText = card.textContent.toLowerCase();
                const matches = companyName.includes(searchTerm) || cardText.includes(searchTerm);

                // Only show if it matches search AND current filter
                const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
                const scoreElement = card.querySelector('.score-number');
                const score = parseInt(scoreElement.textContent);

                let filterMatch = false;
                switch(currentFilter) {
                    case 'all':
                        filterMatch = true;
                        break;
                    case 'exemplary':
                        filterMatch = score >= 90;
                        break;
                    case 'acceptable':
                        filterMatch = score >= 50 && score < 90;
                        break;
                    case 'predatory':
                        filterMatch = score >= 20 && score < 50;
                        break;
                    case 'horror':
                        filterMatch = score < 20;
                        break;
                }

                card.style.display = (matches && filterMatch) ? 'block' : 'none';
            });
        });

        // Smooth scrolling for better UX
        document.querySelectorAll('.analysis-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });
    </script>
</body>
</html>
  `;
}

async function startProfessionalDashboard() {
  const PORT = 3004;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('🎯 Loading professional transparency research platform...');
      const data = await getDetailedAnalyses();
      const html = generateProfessionalHTML(data);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/api') {
      const data = await getDetailedAnalyses();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data, null, 2));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🚀 Professional ToS Salad Dashboard Started!');
    console.log(`🌐 High-Tech Platform: http://localhost:${PORT}`);
    console.log(`📊 API Endpoint: http://localhost:${PORT}/api`);
    console.log('🥗 Professional transparency research platform is live!');
    console.log('✨ Features: Interactive filtering, search, detailed quote analysis, professional UI');
  });
}

startProfessionalDashboard();