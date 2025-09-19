#!/usr/bin/env node

/**
 * Simple ToS Salad Dashboard - No Frontend Interference
 * Shows our transparency research clearly and simply
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function getOurAnalyses() {
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

function generateSimpleHTML(data) {
  const rows = data.map((item, index) => {
    const company = item.tos_analysis_companies;
    const riskColor = item.transparency_score >= 90 ? '#2ed573' :
                     item.transparency_score >= 50 ? '#ffa502' :
                     item.transparency_score >= 20 ? '#ff6b6b' : '#ff4757';

    const isOurAnalysis = ['Signal Technology Foundation', 'CHASE', 'VERIZON', 'LINKEDIN', 'SPOTIFY'].includes(company.name) ||
                         company.name.includes('ToS Salad');

    return `
      <tr style="${isOurAnalysis ? 'background: #2a2a2a; border-left: 4px solid #4ecdc4;' : ''}">
        <td style="font-weight: bold; color: ${isOurAnalysis ? '#4ecdc4' : '#fff'};">
          ${company.name}
          ${isOurAnalysis ? ' ⭐' : ''}
        </td>
        <td>${company.industry || 'N/A'}</td>
        <td style="font-weight: bold; color: ${riskColor}; font-size: 1.2em;">
          ${item.transparency_score}/100
        </td>
        <td style="color: #ff6b6b; font-weight: bold;">
          ${item.manipulation_risk_score}/100
        </td>
        <td style="color: #888; font-size: 0.9em;">
          ${item.key_concerns?.length || 0} issues
        </td>
        <td style="color: #888; font-size: 0.8em;">
          ${new Date(item.analyzed_at).toLocaleDateString()}
        </td>
      </tr>
    `;
  }).join('');

  const ourAnalyses = data.filter(item =>
    ['Signal Technology Foundation', 'CHASE', 'VERIZON', 'LINKEDIN', 'SPOTIFY'].includes(item.tos_analysis_companies.name) ||
    item.tos_analysis_companies.name.includes('ToS Salad')
  );

  return `
<!DOCTYPE html>
<html>
<head>
    <title>🥗 ToS Salad - Our Transparency Research</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: #e0e0e0;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border-radius: 8px;
            border: 1px solid #333;
        }
        .header h1 {
            font-size: 2.5em;
            margin: 0 0 10px 0;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #333;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .highlight-section {
            background: #2d1b1b;
            border: 2px solid #4ecdc4;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .highlight-section h3 {
            color: #4ecdc4;
            margin-top: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #1a1a1a;
            border-radius: 8px;
            overflow: hidden;
        }
        th {
            background: #2a2a2a;
            padding: 15px;
            text-align: left;
            color: #fff;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #333;
        }
        tr:hover {
            background: #252525;
        }
        .spectrum {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .spectrum-item {
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <p style="font-size: 1.2em; color: #888; margin: 0;">Making Terms of Service Digestible for Everyone</p>
    </div>

    <div class="highlight-section">
        <h3>🎯 Our Transparency Research Results</h3>
        <p>We've analyzed ${data.length} companies and built the complete spectrum from user-centric to predatory:</p>

        <div class="spectrum">
            <div class="spectrum-item" style="border-color: #2ed573; background: #1a2e1a;">
                <strong>🏆 Signal: 98/100</strong><br>
                <small>The Gold Standard - Proves user-centric terms are possible</small>
            </div>
            <div class="spectrum-item" style="border-color: #ffa502; background: #2e2a1a;">
                <strong>📊 Spotify: 35-40/100</strong><br>
                <small>Class-based exploitation - Different terms for consumers vs creators</small>
            </div>
            <div class="spectrum-item" style="border-color: #ff6b6b; background: #2e1a1a;">
                <strong>💼 LinkedIn: 25/100</strong><br>
                <small>Professional predation through career dependency</small>
            </div>
            <div class="spectrum-item" style="border-color: #ff4757; background: #2e1a1a;">
                <strong>📱 Verizon: 15/100</strong><br>
                <small>Horror movie infrastructure capture</small>
            </div>
            <div class="spectrum-item" style="border-color: #ff4757; background: #2e1a1a;">
                <strong>🚩 Chase: 8/100</strong><br>
                <small>Financial surveillance capitalism</small>
            </div>
        </div>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number" style="color: #2ed573;">${data.filter(d => d.transparency_score >= 90).length}</div>
            <div>Gold Standard Companies</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #ff4757;">${data.filter(d => d.transparency_score <= 20).length}</div>
            <div>Critical Risk Companies</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #4ecdc4;">${ourAnalyses.length}</div>
            <div>Our Key Analyses</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #ffa502;">${data.length}</div>
            <div>Total Companies</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Company (⭐ = Our Analysis)</th>
                <th>Industry</th>
                <th>Transparency Score</th>
                <th>Manipulation Risk</th>
                <th>Red Flags</th>
                <th>Analyzed</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>

    <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; border-top: 1px solid #333;">
        <p>🥗 <strong>ToS Salad</strong> - Transparency Research Project</p>
        <p><em>"Making the opaque transparent, one clause at a time."</em></p>
        <p style="margin-top: 15px; font-size: 0.9em;">
            Signal proves user-centric terms are possible. Every other predatory clause is a choice, not a necessity.
        </p>
    </div>
</body>
</html>
  `;
}

async function startSimpleDashboard() {
  const PORT = 3002;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('📊 Fetching our transparency research...');
      const data = await getOurAnalyses();
      const html = generateSimpleHTML(data);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/api') {
      const data = await getOurAnalyses();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data, null, 2));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🎉 Simple ToS Salad Dashboard Started!');
    console.log(`🌐 View our research: http://localhost:${PORT}`);
    console.log(`📊 Raw data: http://localhost:${PORT}/api`);
    console.log('🥗 Our transparency research is ready!');
  });
}

startSimpleDashboard();