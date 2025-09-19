#!/usr/bin/env node

/**
 * Complete ToS Salad Analysis Dashboard
 * Reads the actual detailed analysis content from our files and displays it properly
 * with full quote-and-explain functionality
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Analysis files that contain our detailed work
const analysisFiles = [
  'add-signal-exemplary-analysis.js',
  'add-chase-predatory-analysis.js',
  'add-verizon-horror-analysis.js',
  'add-linkedin-professional-predation.js',
  'add-spotify-dual-analysis.js'
];

function extractAnalysisContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract the analysis content between backticks in the const declaration
    const contentMatch = content.match(/const\s+\w+AnalysisContent\s*=\s*`([\s\S]*?)`/);
    if (!contentMatch) return null;

    const analysisText = contentMatch[1];

    // Parse the analysis structure
    const lines = analysisText.split('\n');
    let company = '';
    let score = 0;
    let category = '';
    let summary = '';
    let clauses = [];
    let currentClause = null;

    for (let line of lines) {
      line = line.trim();

      // Extract company name from title
      if (line.includes('Terms of Service:') || line.includes('User Agreement:')) {
        company = line.split(':')[0].trim();
      }

      // Extract transparency score
      if (line.includes('TRANSPARENCY SCORE:')) {
        const scoreMatch = line.match(/(\d+)\/100/);
        if (scoreMatch) score = parseInt(scoreMatch[1]);

        if (line.includes('EXEMPLARY')) category = 'EXEMPLARY';
        else if (line.includes('HORROR MOVIE')) category = 'HORROR MOVIE';
        else if (line.includes('PROFESSIONAL PREDATION')) category = 'PROFESSIONAL PREDATION';
        else if (line.includes('PREDATORY')) category = 'PREDATORY';
      }

      // Extract executive summary
      if (line.startsWith('EXECUTIVE SUMMARY:')) {
        summary = line.replace('EXECUTIVE SUMMARY:', '').trim();
      }

      // Extract numbered clauses with quotes and analysis
      const clauseMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (clauseMatch) {
        if (currentClause) clauses.push(currentClause);
        currentClause = {
          number: clauseMatch[1],
          title: clauseMatch[2],
          originalText: '',
          analysis: ''
        };
      }

      // Extract original text
      if (line.startsWith('Original Text:') && currentClause) {
        currentClause.originalText = line.replace('Original Text:', '').trim();
      }

      // Extract analysis
      if (line.includes('Analysis:') && currentClause && !currentClause.analysis) {
        currentClause.analysis = line.split('Analysis:')[1]?.trim() || '';
      }

      // Continue analysis text
      if (currentClause && currentClause.analysis && !line.includes('Original Text:') && !line.match(/^\d+\./) && line.length > 0) {
        currentClause.analysis += ' ' + line;
      }
    }

    if (currentClause) clauses.push(currentClause);

    return {
      company,
      score,
      category,
      summary,
      clauses: clauses.filter(c => c.originalText && c.analysis),
      fullText: analysisText
    };

  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function loadAllAnalyses() {
  const analyses = [];

  for (const fileName of analysisFiles) {
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
      const analysis = extractAnalysisContent(filePath);
      if (analysis) {
        analyses.push(analysis);
      }
    }
  }

  return analyses.sort((a, b) => b.score - a.score);
}

function generateCompleteHTML(analyses) {
  const analysisCards = analyses.map(analysis => {
    const scoreColor = analysis.score >= 90 ? '#00ff88' :
                      analysis.score >= 50 ? '#ffaa00' :
                      analysis.score >= 20 ? '#ff6666' : '#ff3333';

    const clauseCards = analysis.clauses.map(clause => `
      <div class="clause-card">
        <div class="clause-header">
          <h4>${clause.title}</h4>
        </div>
        <div class="original-quote">
          <div class="quote-label">📜 Original Terms:</div>
          <div class="quote-text">"${clause.originalText}"</div>
        </div>
        <div class="plain-english">
          <div class="analysis-label">🔍 What This Actually Means:</div>
          <div class="analysis-text">${clause.analysis}</div>
        </div>
      </div>
    `).join('');

    return `
      <div class="company-analysis">
        <div class="company-header">
          <h2>${analysis.company}</h2>
          <div class="score-badge" style="background: ${scoreColor};">
            <div class="score">${analysis.score}/100</div>
            <div class="category">${analysis.category}</div>
          </div>
        </div>

        <div class="executive-summary">
          <h3>Executive Summary</h3>
          <p>${analysis.summary}</p>
        </div>

        <div class="detailed-analysis">
          <h3>🚨 Detailed Quote & Analysis</h3>
          <div class="clauses-container">
            ${clauseCards}
          </div>
        </div>

        <details class="full-analysis">
          <summary>📄 View Complete Analysis</summary>
          <pre class="full-text">${analysis.fullText}</pre>
        </details>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ToS Salad - Complete Analysis Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: #e8e8e8;
            line-height: 1.6;
        }

        .header {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            padding: 2rem;
            text-align: center;
            border-bottom: 2px solid #4ecdc4;
        }

        .header h1 {
            font-size: 3rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            font-size: 1.2rem;
            color: #888;
        }

        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .company-analysis {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 3rem;
        }

        .company-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #333;
        }

        .company-header h2 {
            font-size: 2rem;
            color: #fff;
        }

        .score-badge {
            text-align: center;
            padding: 1rem;
            border-radius: 12px;
            min-width: 120px;
        }

        .score {
            font-size: 1.8rem;
            font-weight: 700;
            color: #000;
        }

        .category {
            font-size: 0.8rem;
            font-weight: 600;
            color: #000;
            margin-top: 0.25rem;
        }

        .executive-summary {
            background: rgba(78, 205, 196, 0.1);
            border-left: 4px solid #4ecdc4;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border-radius: 8px;
        }

        .executive-summary h3 {
            color: #4ecdc4;
            margin-bottom: 1rem;
        }

        .detailed-analysis {
            margin-bottom: 2rem;
        }

        .detailed-analysis h3 {
            color: #ff6b6b;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }

        .clauses-container {
            display: grid;
            gap: 2rem;
        }

        .clause-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #444;
            border-radius: 12px;
            padding: 1.5rem;
        }

        .clause-header h4 {
            color: #fff;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }

        .original-quote {
            background: rgba(255, 107, 107, 0.1);
            border-left: 4px solid #ff6b6b;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
        }

        .quote-label {
            font-weight: 700;
            color: #ff6b6b;
            margin-bottom: 0.5rem;
        }

        .quote-text {
            font-style: italic;
            color: #e8e8e8;
            background: rgba(0, 0, 0, 0.2);
            padding: 0.75rem;
            border-radius: 6px;
        }

        .plain-english {
            background: rgba(78, 205, 196, 0.1);
            border-left: 4px solid #4ecdc4;
            padding: 1rem;
            border-radius: 8px;
        }

        .analysis-label {
            font-weight: 700;
            color: #4ecdc4;
            margin-bottom: 0.5rem;
        }

        .analysis-text {
            color: #e8e8e8;
            line-height: 1.6;
        }

        .full-analysis {
            margin-top: 2rem;
            border: 1px solid #333;
            border-radius: 8px;
        }

        .full-analysis summary {
            background: #2a2a2a;
            padding: 1rem;
            cursor: pointer;
            border-radius: 8px 8px 0 0;
            font-weight: 600;
        }

        .full-text {
            background: #1a1a1a;
            padding: 1.5rem;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9rem;
            color: #ccc;
            max-height: 400px;
            overflow-y: auto;
            border-radius: 0 0 8px 8px;
        }

        @media (max-width: 768px) {
            .company-header {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }

            .main-content {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <div class="subtitle">Complete Quote-and-Explain Analysis Platform</div>
        <div class="subtitle">Making Corporate Legal Predation Visible</div>
    </div>

    <div class="main-content">
        ${analysisCards}
    </div>
</body>
</html>
  `;
}

async function startCompleteAnalysisDashboard() {
  const PORT = 3005;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('📊 Loading complete analysis content from files...');
      const analyses = loadAllAnalyses();
      const html = generateCompleteHTML(analyses);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/api') {
      const analyses = loadAllAnalyses();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(analyses, null, 2));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🚀 Complete ToS Salad Analysis Dashboard Started!');
    console.log(`🌐 Quote-and-Explain Platform: http://localhost:${PORT}`);
    console.log(`📊 Raw Analysis Data: http://localhost:${PORT}/api`);
    console.log('🥗 All detailed analysis content properly displayed!');
  });
}

startCompleteAnalysisDashboard();