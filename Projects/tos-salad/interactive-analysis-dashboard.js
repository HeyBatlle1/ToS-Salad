#!/usr/bin/env node

/**
 * Interactive ToS Salad Analysis Dashboard
 * Shows detailed analysis with quotes, explanations, and interactive features
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
        *,
        tos_analysis_companies!inner(name, domain, industry, tos_url),
        tos_analysis_documents!inner(title, url, raw_content)
      `)
      .order('transparency_score', { ascending: false });

    if (error) throw error;
    return results || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

function generateInteractiveHTML(data) {
  const analysisCards = data.map((item, index) => {
    const company = item.tos_analysis_companies;
    const document = item.tos_analysis_documents;
    const isOurKey = ['Signal Technology Foundation', 'CHASE', 'VERIZON', 'LINKEDIN', 'SPOTIFY'].includes(company.name) ||
                     company.name.includes('JPMorgan Chase') ||
                     company.name.includes('Verizon Communications') ||
                     company.name.includes('LinkedIn Corporation');

    if (!isOurKey && !company.name.includes('ToS Salad')) {
      return ''; // Skip non-key analyses for cleaner display
    }

    const riskLevel = item.transparency_score >= 90 ? { color: '#2ed573', level: 'EXCELLENT', bg: '#1a2e1a' } :
                     item.transparency_score >= 50 ? { color: '#ffa502', level: 'MEDIUM RISK', bg: '#2e2a1a' } :
                     item.transparency_score >= 20 ? { color: '#ff6b6b', level: 'HIGH RISK', bg: '#2e1a1a' } :
                     { color: '#ff4757', level: 'CRITICAL RISK', bg: '#2e1a1a' };

    const concernsList = item.concerning_clauses ? item.concerning_clauses.map(clause => `
      <div class="concern-item">
        <div class="concern-category">${clause.category}</div>
        <div class="concern-text">${clause.concern}</div>
        ${clause.originalText ? `<div class="original-text">"${clause.originalText}"</div>` : ''}
      </div>
    `).join('') : '';

    const recommendationsList = item.recommendations ? item.recommendations.map(rec => `
      <li class="recommendation-item">${rec}</li>
    `).join('') : '';

    const keyPoints = item.key_concerns ? item.key_concerns.map(concern => `
      <li class="key-concern">${concern}</li>
    `).join('') : '';

    return `
      <div class="analysis-card" data-score="${item.transparency_score}">
        <div class="card-header" style="border-left: 4px solid ${riskLevel.color}; background: ${riskLevel.bg};">
          <div class="company-info">
            <h2 class="company-name">${company.name}</h2>
            <div class="company-meta">
              <span class="industry">${company.industry}</span>
              <span class="domain">${company.domain}</span>
            </div>
          </div>
          <div class="score-section">
            <div class="transparency-score" style="color: ${riskLevel.color};">
              ${item.transparency_score}/100
            </div>
            <div class="risk-level" style="color: ${riskLevel.color};">
              ${riskLevel.level}
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="executive-summary">
            <h3>Executive Summary</h3>
            <p>${item.executive_summary || 'No summary available'}</p>
          </div>

          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-label">User Friendliness</div>
              <div class="metric-value" style="color: ${item.user_friendliness_score >= 70 ? '#2ed573' : item.user_friendliness_score >= 40 ? '#ffa502' : '#ff4757'}">
                ${item.user_friendliness_score}/100
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Privacy Score</div>
              <div class="metric-value" style="color: ${item.privacy_score >= 70 ? '#2ed573' : item.privacy_score >= 40 ? '#ffa502' : '#ff4757'}">
                ${item.privacy_score}/100
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Manipulation Risk</div>
              <div class="metric-value" style="color: ${item.manipulation_risk_score <= 30 ? '#2ed573' : item.manipulation_risk_score <= 60 ? '#ffa502' : '#ff4757'}">
                ${item.manipulation_risk_score}/100
              </div>
            </div>
          </div>

          <div class="analysis-section">
            <h3>Key Concerns Identified</h3>
            <ul class="key-concerns-list">
              ${keyPoints}
            </ul>
          </div>

          <div class="analysis-section">
            <h3>Concerning Clauses Analysis</h3>
            <div class="concerns-container">
              ${concernsList}
            </div>
          </div>

          <div class="analysis-section">
            <h3>Recommendations</h3>
            <ul class="recommendations-list">
              ${recommendationsList}
            </ul>
          </div>

          <div class="card-footer">
            <div class="analysis-meta">
              <span>Analyzed: ${new Date(item.analyzed_at).toLocaleDateString()}</span>
              <span>Model: ${item.ai_model_used}</span>
            </div>
            <div class="actions">
              <a href="${company.tos_url}" target="_blank" class="view-original">View Original ToS</a>
              <button class="toggle-details" onclick="toggleDetails(${index})">Toggle Details</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).filter(card => card !== '').join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <title>🥗 ToS Salad - Interactive Analysis Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: #e0e0e0;
            line-height: 1.6;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border-radius: 12px;
            border: 1px solid #333;
        }

        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .header p {
            font-size: 1.3em;
            color: #888;
            margin-bottom: 20px;
        }

        .mission-statement {
            background: #2d1b1b;
            border: 2px solid #4ecdc4;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .mission-statement h3 {
            color: #4ecdc4;
            margin-bottom: 10px;
        }

        .filters {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 10px 20px;
            border: 1px solid #333;
            background: #1a1a1a;
            color: #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .filter-btn:hover,
        .filter-btn.active {
            background: #4ecdc4;
            color: #0a0a0a;
            border-color: #4ecdc4;
        }

        .analysis-grid {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .analysis-card {
            background: #1a1a1a;
            border-radius: 12px;
            border: 1px solid #333;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .analysis-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .card-header {
            padding: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .company-name {
            font-size: 1.8em;
            font-weight: bold;
            color: #fff;
            margin-bottom: 5px;
        }

        .company-meta {
            display: flex;
            gap: 15px;
            font-size: 0.9em;
            color: #888;
        }

        .score-section {
            text-align: right;
        }

        .transparency-score {
            font-size: 2.5em;
            font-weight: bold;
            line-height: 1;
        }

        .risk-level {
            font-size: 0.9em;
            font-weight: 600;
            margin-top: 5px;
        }

        .card-body {
            padding: 25px;
            border-top: 1px solid #333;
        }

        .executive-summary {
            margin-bottom: 25px;
            padding: 20px;
            background: #252525;
            border-radius: 8px;
        }

        .executive-summary h3 {
            color: #4ecdc4;
            margin-bottom: 10px;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }

        .metric {
            text-align: center;
            padding: 15px;
            background: #252525;
            border-radius: 8px;
        }

        .metric-label {
            font-size: 0.9em;
            color: #888;
            margin-bottom: 5px;
        }

        .metric-value {
            font-size: 1.5em;
            font-weight: bold;
        }

        .analysis-section {
            margin-bottom: 25px;
        }

        .analysis-section h3 {
            color: #4ecdc4;
            margin-bottom: 15px;
            font-size: 1.2em;
        }

        .key-concerns-list,
        .recommendations-list {
            list-style: none;
        }

        .key-concern,
        .recommendation-item {
            padding: 10px 15px;
            margin-bottom: 8px;
            background: #252525;
            border-radius: 6px;
            border-left: 3px solid #ff6b6b;
        }

        .recommendation-item {
            border-left-color: #4ecdc4;
        }

        .concerns-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .concern-item {
            padding: 15px;
            background: #252525;
            border-radius: 8px;
            border-left: 4px solid #ff6b6b;
        }

        .concern-category {
            font-weight: bold;
            color: #ff6b6b;
            margin-bottom: 5px;
        }

        .concern-text {
            margin-bottom: 10px;
        }

        .original-text {
            font-style: italic;
            color: #888;
            background: #1a1a1a;
            padding: 10px;
            border-radius: 4px;
            border-left: 2px solid #666;
            font-size: 0.9em;
        }

        .card-footer {
            padding: 20px 25px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .analysis-meta {
            font-size: 0.8em;
            color: #666;
            display: flex;
            gap: 15px;
        }

        .actions {
            display: flex;
            gap: 10px;
        }

        .view-original,
        .toggle-details {
            padding: 8px 16px;
            border: 1px solid #4ecdc4;
            background: transparent;
            color: #4ecdc4;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9em;
            cursor: pointer;
            transition: all 0.3s;
        }

        .view-original:hover,
        .toggle-details:hover {
            background: #4ecdc4;
            color: #0a0a0a;
        }

        .counter-narrative {
            background: linear-gradient(135deg, #2d4a2d, #1a2e1a);
            border: 2px solid #2ed573;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }

        .counter-narrative h3 {
            color: #2ed573;
            margin-bottom: 15px;
        }

        @media (max-width: 768px) {
            .card-header {
                flex-direction: column;
                text-align: center;
                gap: 15px;
            }

            .company-meta {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <p>Interactive Transparency Analysis Dashboard</p>

        <div class="mission-statement">
            <h3>🎯 Our Mission</h3>
            <p>"Making the opaque transparent, one clause at a time."</p>
            <p>We analyze Terms of Service to expose corporate manipulation and prove that user-centric alternatives exist.</p>
        </div>
    </div>

    <div class="counter-narrative">
        <h3>🌟 The Signal Counter-Narrative</h3>
        <p><strong>Signal proves that user-centric Terms of Service are possible.</strong> Every predatory clause in other platforms is a <strong>choice, not a necessity</strong>.</p>
        <p>When you see forced arbitration, content appropriation, or liability shields - ask: <em>"Why does this company need this when Signal doesn't?"</em></p>
    </div>

    <div class="filters">
        <button class="filter-btn active" onclick="filterAnalyses('all')">All Analyses</button>
        <button class="filter-btn" onclick="filterAnalyses('excellent')">Excellent (90+)</button>
        <button class="filter-btn" onclick="filterAnalyses('risky')">High Risk (20-50)</button>
        <button class="filter-btn" onclick="filterAnalyses('critical')">Critical (0-20)</button>
    </div>

    <div class="analysis-grid" id="analysisGrid">
        ${analysisCards}
    </div>

    <script>
        function toggleDetails(index) {
            const card = document.querySelectorAll('.analysis-card')[index];
            const sections = card.querySelectorAll('.analysis-section');
            sections.forEach(section => {
                section.style.display = section.style.display === 'none' ? 'block' : 'none';
            });
        }

        function filterAnalyses(filter) {
            const cards = document.querySelectorAll('.analysis-card');
            const buttons = document.querySelectorAll('.filter-btn');

            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            cards.forEach(card => {
                const score = parseInt(card.dataset.score);
                let show = false;

                switch(filter) {
                    case 'all': show = true; break;
                    case 'excellent': show = score >= 90; break;
                    case 'risky': show = score >= 20 && score < 50; break;
                    case 'critical': show = score < 20; break;
                }

                card.style.display = show ? 'block' : 'none';
            });
        }

        // Auto-expand first few cards
        document.addEventListener('DOMContentLoaded', function() {
            const firstThreeCards = document.querySelectorAll('.analysis-card');
            for(let i = 0; i < Math.min(3, firstThreeCards.length); i++) {
                // Keep them expanded by default
            }
        });
    </script>
</body>
</html>
  `;
}

async function startInteractiveDashboard() {
  const PORT = 3003;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('📊 Loading interactive analysis dashboard...');
      const data = await getDetailedAnalyses();
      const html = generateInteractiveHTML(data);

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
    console.log('🎉 Interactive ToS Salad Dashboard Started!');
    console.log(`🌐 Interactive analysis: http://localhost:${PORT}`);
    console.log(`📊 Raw data API: http://localhost:${PORT}/api`);
    console.log('🥗 Full interactive transparency research ready!');
  });
}

startInteractiveDashboard();