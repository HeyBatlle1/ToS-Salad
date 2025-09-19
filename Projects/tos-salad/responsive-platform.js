#!/usr/bin/env node

/**
 * ToS Salad Responsive Platform
 * Fixed layout for web/laptop with proper navigation and sizing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const contentMatch = content.match(/const\s+\w+AnalysisContent\s*=\s*`([\s\S]*?)`/);
    if (!contentMatch) return null;

    const analysisText = contentMatch[1];
    const lines = analysisText.split('\n');
    let company = '';
    let score = 0;
    let category = '';
    let summary = '';
    let clauses = [];
    let currentClause = null;

    for (let line of lines) {
      line = line.trim();

      if (line.includes('Terms of Service:') || line.includes('User Agreement:')) {
        company = line.split(':')[0].trim();
      }

      if (line.includes('TRANSPARENCY SCORE:')) {
        const scoreMatch = line.match(/(\d+)\/100/);
        if (scoreMatch) score = parseInt(scoreMatch[1]);

        if (line.includes('EXEMPLARY')) category = 'EXEMPLARY';
        else if (line.includes('HORROR MOVIE')) category = 'HORROR MOVIE';
        else if (line.includes('PROFESSIONAL PREDATION')) category = 'PROFESSIONAL PREDATION';
        else if (line.includes('PREDATORY')) category = 'PREDATORY';
      }

      if (line.startsWith('EXECUTIVE SUMMARY:')) {
        summary = line.replace('EXECUTIVE SUMMARY:', '').trim();
      }

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

      if (line.startsWith('Original Text:') && currentClause) {
        currentClause.originalText = line.replace('Original Text:', '').trim();
      }

      if (line.includes('Analysis:') && currentClause && !currentClause.analysis) {
        currentClause.analysis = line.split('Analysis:')[1]?.trim() || '';
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
      if (analysis) analyses.push(analysis);
    }
  }
  return analyses.sort((a, b) => b.score - a.score);
}

function generateResponsiveHTML(analyses) {
  const analysisCards = analyses.map(analysis => {
    const scoreColor = analysis.score >= 90 ? '#00ff88' :
                      analysis.score >= 50 ? '#ffaa00' :
                      analysis.score >= 20 ? '#ff6666' : '#ff3333';

    const topClauses = analysis.clauses.slice(0, 2).map(clause => `
      <div class="mini-clause">
        <div class="mini-title">${clause.title}</div>
        <div class="mini-quote">"${clause.originalText.substring(0, 100)}..."</div>
        <div class="mini-analysis">${clause.analysis.substring(0, 150)}...</div>
      </div>
    `).join('');

    return `
      <div class="company-card">
        <div class="card-top">
          <h3>${analysis.company}</h3>
          <div class="score-pill" style="background: ${scoreColor};">
            ${analysis.score}/100
          </div>
        </div>
        <div class="category-badge">${analysis.category}</div>
        <div class="summary-text">${analysis.summary.substring(0, 200)}...</div>
        <div class="top-clauses">
          ${topClauses}
        </div>
        <button class="expand-btn" onclick="expandAnalysis('${analysis.company.replace(/'/g, "\\'")}')">
          View Full Analysis
        </button>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🥗 ToS Salad - Transparency Platform</title>
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
            overflow-x: hidden;
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
            height: 70px;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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

        .main-content {
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            min-height: calc(100vh - 70px);
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

        .section-header h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .section-header p {
            color: #888;
            font-size: 1.1rem;
        }

        /* Analysis Section */
        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
            align-items: center;
            margin-bottom: 1rem;
        }

        .card-top h3 {
            font-size: 1.3rem;
            color: #fff;
        }

        .score-pill {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            color: #000;
            font-size: 0.9rem;
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
            line-height: 1.5;
        }

        .top-clauses {
            margin-bottom: 1rem;
        }

        .mini-clause {
            background: rgba(0, 0, 0, 0.3);
            border-left: 3px solid #ff6b6b;
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            border-radius: 6px;
        }

        .mini-title {
            font-weight: 600;
            color: #fff;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .mini-quote {
            font-style: italic;
            color: #ff6b6b;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
        }

        .mini-analysis {
            color: #ccc;
            font-size: 0.85rem;
        }

        .expand-btn {
            background: #4ecdc4;
            color: #000;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
            transition: background 0.3s ease;
        }

        .expand-btn:hover {
            background: #45b7d1;
        }

        /* Verifier Section */
        .verifier-tools {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .tool-card {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
        }

        .tool-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .tool-card h3 {
            color: #4ecdc4;
            margin-bottom: 1rem;
        }

        .upload-area {
            border: 2px dashed #4ecdc4;
            border-radius: 8px;
            padding: 2rem;
            margin: 1rem 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-area:hover {
            background: rgba(78, 205, 196, 0.1);
        }

        /* Chat Section */
        .chat-container {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 12px;
            height: 500px;
            display: flex;
            flex-direction: column;
            margin-top: 2rem;
        }

        .chat-header {
            background: #2a2a2a;
            padding: 1rem;
            border-bottom: 1px solid #333;
            border-radius: 12px 12px 0 0;
            font-weight: 600;
        }

        .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }

        .message {
            background: rgba(78, 205, 196, 0.1);
            border-left: 3px solid #4ecdc4;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 6px;
        }

        .user-message {
            background: rgba(255, 107, 107, 0.1);
            border-left-color: #ff6b6b;
        }

        .chat-input-area {
            padding: 1rem;
            border-top: 1px solid #333;
            border-radius: 0 0 12px 12px;
        }

        .chat-input {
            width: 100%;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 0.75rem;
            color: #e8e8e8;
            resize: vertical;
            min-height: 60px;
        }

        .chat-input:focus {
            outline: none;
            border-color: #4ecdc4;
        }

        .chat-controls {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .send-btn {
            background: #4ecdc4;
            color: #000;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }

        .clear-btn {
            background: #333;
            color: #e8e8e8;
            border: 1px solid #444;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
        }

        /* Modal for full analysis */
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
            margin: 5% auto;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 80%;
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
                height: auto;
                padding: 1rem;
            }

            .nav-tabs {
                margin-top: 1rem;
                flex-wrap: wrap;
            }

            .main-content {
                padding: 1rem;
            }

            .analysis-grid {
                grid-template-columns: 1fr;
            }

            .verifier-tools {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="top-nav">
        <div class="logo">🥗 ToS Salad</div>
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showSection('analysis')">📊 Analysis</button>
            <button class="nav-tab" onclick="showSection('verifier')">🔍 Verifier</button>
            <button class="nav-tab" onclick="showSection('chat')">💬 AI Agent</button>
        </div>
    </nav>

    <div class="main-content">
        <!-- Analysis Section -->
        <div id="analysis-section" class="section active">
            <div class="section-header">
                <h2>📊 ToS Analysis</h2>
                <p>Quote-and-explain transparency research showing corporate predation spectrum</p>
            </div>

            <div class="analysis-grid">
                ${analysisCards}
            </div>
        </div>

        <!-- Verifier Section -->
        <div id="verifier-section" class="section">
            <div class="section-header">
                <h2>🔍 The Verifier</h2>
                <p>AI-powered content verification and analysis tools</p>
            </div>

            <div class="verifier-tools">
                <div class="tool-card">
                    <div class="tool-icon">🤖</div>
                    <h3>AI Detection</h3>
                    <p>Detect AI-generated images and videos</p>
                    <div class="upload-area" onclick="alert('AI Detection would work here')">
                        <div>Drop files or click to upload</div>
                        <small>Images, videos supported</small>
                    </div>
                </div>

                <div class="tool-card">
                    <div class="tool-icon">🔗</div>
                    <h3>Link Safety</h3>
                    <p>Check URLs for malicious content</p>
                    <div style="margin: 1rem 0;">
                        <input type="url" placeholder="Enter URL to verify..." style="width: 100%; padding: 0.75rem; background: #1a1a1a; border: 1px solid #444; border-radius: 6px; color: #e8e8e8;">
                        <button style="width: 100%; margin-top: 0.5rem; background: #4ecdc4; color: #000; border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer;" onclick="alert('URL verification would work here')">Verify URL</button>
                    </div>
                </div>

                <div class="tool-card">
                    <div class="tool-icon">📊</div>
                    <h3>Metadata Analysis</h3>
                    <p>Extract EXIF and digital fingerprints</p>
                    <div class="upload-area" onclick="alert('Metadata analysis would work here')">
                        <div>Drop files for analysis</div>
                        <small>All file types supported</small>
                    </div>
                </div>

                <div class="tool-card">
                    <div class="tool-icon">🛡️</div>
                    <h3>Provenance Check</h3>
                    <p>Reverse image search and source verification</p>
                    <div class="upload-area" onclick="alert('Provenance check would work here')">
                        <div>Upload image to trace origin</div>
                        <small>Image files only</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Section -->
        <div id="chat-section" class="section">
            <div class="section-header">
                <h2>💬 AI Agent</h2>
                <p>Chat with our Gemini-powered transparency research assistant</p>
            </div>

            <div class="chat-container">
                <div class="chat-header">
                    🤖 ToS Salad AI Agent - Powered by Gemini 2.0-flash
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message">
                        <strong>🤖 AI Agent:</strong> Hello! I can help you understand our ToS analysis, explain The Verifier tools, or discuss transparency research. What would you like to explore?
                    </div>
                </div>
                <div class="chat-input-area">
                    <textarea id="chatInput" class="chat-input" placeholder="Ask about ToS analysis, The Verifier, or transparency research..."></textarea>
                    <div class="chat-controls">
                        <button class="send-btn" onclick="sendMessage()">Send</button>
                        <button class="clear-btn" onclick="clearChat()">Clear</button>
                    </div>
                </div>
            </div>
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
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected section and activate tab
            document.getElementById(sectionName + '-section').classList.add('active');
            event.target.classList.add('active');
        }

        function expandAnalysis(companyName) {
            // Show modal with full analysis
            const modal = document.getElementById('analysisModal');
            const modalContent = document.getElementById('modalContent');

            modalContent.innerHTML = '<h2>' + companyName + '</h2><p>Full analysis would be displayed here with all quote-and-explain content.</p><p>This would show the complete detailed analysis we built together.</p>';

            modal.style.display = 'block';
        }

        function closeModal() {
            document.getElementById('analysisModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('analysisModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        async function sendMessage() {
            const chatInput = document.getElementById('chatInput');
            const chatMessages = document.getElementById('chatMessages');
            const message = chatInput.value.trim();

            if (!message) return;

            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerHTML = '<strong>👤 You:</strong> ' + message;
            chatMessages.appendChild(userMessage);

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate AI response
            setTimeout(() => {
                const aiMessage = document.createElement('div');
                aiMessage.className = 'message';
                aiMessage.innerHTML = '<strong>🤖 AI Agent:</strong> Thank you for your question about "' + message + '". I can help explain our ToS analysis, The Verifier capabilities, or transparency research. The full chat integration with Gemini would work here.';
                chatMessages.appendChild(aiMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }

        function clearChat() {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="message"><strong>🤖 AI Agent:</strong> Hello! I can help you understand our ToS analysis, explain The Verifier tools, or discuss transparency research. What would you like to explore?</div>';
        }

        // Enter key to send message
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    </script>
</body>
</html>
  `;
}

async function startResponsivePlatform() {
  const PORT = 3007;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('🎯 Loading responsive ToS Salad platform...');
      const analyses = loadAllAnalyses();
      const html = generateResponsiveHTML(analyses);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/api/chat' && req.method === 'POST') {
      // Chat API would go here
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response: 'Chat API response would be here' }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🚀 Responsive ToS Salad Platform Started!');
    console.log(`🌐 Web-Optimized: http://localhost:${PORT}`);
    console.log('📱 Responsive design with proper navigation');
    console.log('🥗 Analysis • Verifier • AI Agent - All properly sized!');
  });
}

startResponsivePlatform();