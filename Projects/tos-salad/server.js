#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

// Find available port
function findOpenPort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      if (startPort < 3010) {
        resolve(findOpenPort(startPort + 1));
      } else {
        reject(new Error('No open ports found'));
      }
    });
  });
}

async function getTransparencyData() {
  try {
    // Get companies with analysis results
    const { data: results, error } = await supabase
      .from('tos_analysis_results')
      .select(`
        *,
        tos_analysis_companies!inner(name, domain, industry),
        tos_analysis_documents!inner(title, url)
      `)
      .order('transparency_score', { ascending: true });

    if (error) throw error;
    return results || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

function generateHTML(data) {
  const riskLevel = (score) => {
    if (score <= 20) return { class: 'critical', text: 'CRITICAL' };
    if (score <= 35) return { class: 'high', text: 'HIGH RISK' };
    if (score <= 50) return { class: 'medium', text: 'MEDIUM RISK' };
    return { class: 'low', text: 'LOW RISK' };
  };

  const rows = data.map(item => {
    const risk = riskLevel(item.transparency_score);
    const company = item.tos_analysis_companies;
    const document = item.tos_analysis_documents;

    return `
      <tr>
        <td class="company-name">${company.name}</td>
        <td class="industry">${company.industry || 'N/A'}</td>
        <td class="score score-${risk.class}">${item.transparency_score}/100</td>
        <td class="risk-level risk-${risk.class}">${risk.text}</td>
        <td class="manipulation-score">${item.manipulation_risk_score}/100</td>
        <td class="red-flags">${item.key_concerns?.length || 0}</td>
        <td class="analysis-date">${new Date(item.analyzed_at).toLocaleDateString()}</td>
        <td class="actions">
          <a href="${document.url}" target="_blank" class="view-tos">View ToS</a>
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ToS Salad - Transparency Crisis Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', roboto, sans-serif;
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
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            font-size: 1.2em;
            color: #888;
            margin-bottom: 20px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #333;
            text-align: center;
        }

        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-label {
            color: #888;
            font-size: 0.9em;
        }

        .table-container {
            background: #1a1a1a;
            border-radius: 12px;
            border: 1px solid #333;
            overflow: hidden;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #2a2a2a;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            color: #fff;
            border-bottom: 2px solid #333;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #333;
        }

        tr:hover {
            background: #252525;
        }

        .company-name {
            font-weight: 600;
            color: #fff;
        }

        .industry {
            color: #888;
            font-size: 0.9em;
        }

        .score {
            font-weight: bold;
            font-size: 1.1em;
        }

        .score-critical { color: #ff4757; }
        .score-high { color: #ff6b6b; }
        .score-medium { color: #ffa502; }
        .score-low { color: #2ed573; }

        .risk-level {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-align: center;
        }

        .risk-critical {
            background: #ff4757;
            color: white;
        }

        .risk-high {
            background: #ff6b6b;
            color: white;
        }

        .risk-medium {
            background: #ffa502;
            color: white;
        }

        .risk-low {
            background: #2ed573;
            color: white;
        }

        .manipulation-score {
            color: #ff6b6b;
            font-weight: 600;
        }

        .red-flags {
            color: #ff4757;
            font-weight: bold;
        }

        .analysis-date {
            color: #888;
            font-size: 0.9em;
        }

        .view-tos {
            color: #4ecdc4;
            text-decoration: none;
            padding: 4px 8px;
            border: 1px solid #4ecdc4;
            border-radius: 4px;
            font-size: 0.8em;
            transition: all 0.3s;
        }

        .view-tos:hover {
            background: #4ecdc4;
            color: #0a0a0a;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            border-top: 1px solid #333;
        }

        .crisis-alert {
            background: #2d1b1b;
            border: 2px solid #ff4757;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }

        .crisis-alert h3 {
            color: #ff4757;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <p>Making Terms of Service Digestible for Everyone</p>
        <div class="crisis-alert">
            <h3>🚨 TRANSPARENCY CRISIS DETECTED</h3>
            <p>Major platforms systematically destroying informed consent through engineered complexity</p>
        </div>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number" style="color: #ff4757;">${data.filter(d => d.transparency_score <= 20).length}</div>
            <div class="stat-label">Critical Risk Companies</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #ffa502;">${data.length}</div>
            <div class="stat-label">Total Companies Analyzed</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #4ecdc4;">${Math.round(data.reduce((sum, d) => sum + d.transparency_score, 0) / data.length)}</div>
            <div class="stat-label">Average Transparency Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" style="color: #ff6b6b;">${data.reduce((sum, d) => sum + (d.key_concerns?.length || 0), 0)}</div>
            <div class="stat-label">Total Red Flags Identified</div>
        </div>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Transparency Score</th>
                    <th>Risk Level</th>
                    <th>Manipulation Risk</th>
                    <th>Red Flags</th>
                    <th>Analyzed</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>🥗 ToS Salad - Transparency Research Project</p>
        <p>Generated with Gemini AI Analysis • Data sourced from official Terms of Service documents</p>
        <p style="margin-top: 10px; font-size: 0.8em;">
            "Making the opaque transparent, one clause at a time."
        </p>
    </div>
</body>
</html>
  `;
}

async function startServer() {
  try {
    const port = await findOpenPort();
    console.log(`🚀 Starting ToS Salad server on port ${port}...`);

    const server = http.createServer(async (req, res) => {
      if (req.url === '/' || req.url === '/index.html') {
        console.log('📊 Fetching transparency data...');
        const data = await getTransparencyData();
        const html = generateHTML(data);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } else if (req.url === '/api/data') {
        const data = await getTransparencyData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });

    server.listen(port, () => {
      console.log('✅ Server started successfully!');
      console.log(`🌐 View ToS Salad Dashboard: http://localhost:${port}`);
      console.log(`📊 Raw data API: http://localhost:${port}/api/data`);
      console.log('🥗 Transparency crisis dashboard is live!');
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err.message);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
  }
}

startServer();