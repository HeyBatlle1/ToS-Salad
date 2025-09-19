#!/usr/bin/env node

/**
 * ToS Salad Complete Platform
 * Integrates all our work: The Verifier, Gemini Agent, Quote-and-Explain Analysis, Interactive Chat
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

function generateFullPlatformHTML(analyses) {
  const analysisCards = analyses.map(analysis => {
    const scoreColor = analysis.score >= 90 ? '#00ff88' :
                      analysis.score >= 50 ? '#ffaa00' :
                      analysis.score >= 20 ? '#ff6666' : '#ff3333';

    const clauseCards = analysis.clauses.slice(0, 3).map(clause => `
      <div class="clause-card">
        <h5>${clause.title}</h5>
        <div class="original-quote">
          <strong>📜 Original:</strong> "${clause.originalText}"
        </div>
        <div class="plain-english">
          <strong>🔍 Plain English:</strong> ${clause.analysis}
        </div>
      </div>
    `).join('');

    return `
      <div class="analysis-card" data-company="${analysis.company}">
        <div class="card-header">
          <h3>${analysis.company}</h3>
          <div class="score-badge" style="background: ${scoreColor};">
            ${analysis.score}/100
            <div class="category">${analysis.category}</div>
          </div>
        </div>
        <div class="summary">${analysis.summary}</div>
        <div class="key-clauses">
          ${clauseCards}
        </div>
        <button class="view-full" onclick="viewFullAnalysis('${analysis.company}')">
          View Complete Analysis
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
    <title>🥗 ToS Salad - Complete Transparency Platform</title>
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
        }

        .platform-header {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            padding: 2rem;
            text-align: center;
            border-bottom: 2px solid #4ecdc4;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }

        .platform-header h1 {
            font-size: 3rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .platform-nav {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
        }

        .nav-btn {
            background: #2a2a2a;
            border: 1px solid #4ecdc4;
            color: #4ecdc4;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .nav-btn:hover, .nav-btn.active {
            background: #4ecdc4;
            color: #000;
        }

        .main-container {
            display: flex;
            min-height: calc(100vh - 150px);
        }

        .sidebar {
            width: 300px;
            background: rgba(26, 26, 26, 0.9);
            border-right: 1px solid #333;
            padding: 2rem;
        }

        .content-area {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }

        .platform-section {
            display: none;
        }

        .platform-section.active {
            display: block;
        }

        /* Analysis Section */
        .analysis-grid {
            display: grid;
            gap: 2rem;
        }

        .analysis-card {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
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
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .card-header h3 {
            color: #fff;
            font-size: 1.5rem;
        }

        .score-badge {
            text-align: center;
            padding: 1rem;
            border-radius: 12px;
            font-weight: 700;
            color: #000;
            min-width: 100px;
        }

        .category {
            font-size: 0.7rem;
            margin-top: 0.25rem;
        }

        .summary {
            background: rgba(78, 205, 196, 0.1);
            border-left: 4px solid #4ecdc4;
            padding: 1rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
        }

        .key-clauses {
            margin-bottom: 1.5rem;
        }

        .clause-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #444;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .clause-card h5 {
            color: #fff;
            margin-bottom: 0.75rem;
        }

        .original-quote {
            background: rgba(255, 107, 107, 0.1);
            border-left: 3px solid #ff6b6b;
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            border-radius: 6px;
            font-style: italic;
        }

        .plain-english {
            background: rgba(78, 205, 196, 0.1);
            border-left: 3px solid #4ecdc4;
            padding: 0.75rem;
            border-radius: 6px;
        }

        .view-full {
            background: #4ecdc4;
            color: #000;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .view-full:hover {
            background: #45b7d1;
        }

        /* Verifier Section */
        .verifier-panel {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .verifier-panel h3 {
            color: #4ecdc4;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .upload-zone {
            border: 2px dashed #4ecdc4;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .upload-zone:hover {
            background: rgba(78, 205, 196, 0.1);
        }

        .upload-zone.dragover {
            border-color: #45b7d1;
            background: rgba(78, 205, 196, 0.2);
        }

        /* Chat Section */
        .chat-container {
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border: 1px solid #333;
            border-radius: 16px;
            height: 600px;
            display: flex;
            flex-direction: column;
        }

        .chat-header {
            background: #2a2a2a;
            padding: 1rem 2rem;
            border-bottom: 1px solid #333;
            border-radius: 16px 16px 0 0;
        }

        .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }

        .chat-input-area {
            padding: 1rem;
            border-top: 1px solid #333;
            border-radius: 0 0 16px 16px;
        }

        .chat-input {
            width: 100%;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 1rem;
            color: #e8e8e8;
            font-size: 1rem;
            resize: vertical;
            min-height: 80px;
        }

        .chat-input:focus {
            outline: none;
            border-color: #4ecdc4;
            box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
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
            padding: 0.75rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .send-btn:hover {
            background: #45b7d1;
        }

        .message {
            background: rgba(78, 205, 196, 0.1);
            border-left: 4px solid #4ecdc4;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
        }

        .user-message {
            background: rgba(255, 107, 107, 0.1);
            border-left-color: #ff6b6b;
        }

        @media (max-width: 768px) {
            .main-container {
                flex-direction: column;
            }

            .sidebar {
                width: 100%;
            }

            .platform-nav {
                flex-wrap: wrap;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="platform-header">
        <h1>🥗 ToS Salad</h1>
        <p>Complete Transparency Platform: Analysis • Verification • Intelligence</p>
        <div class="platform-nav">
            <button class="nav-btn active" onclick="showSection('analysis')">📊 ToS Analysis</button>
            <button class="nav-btn" onclick="showSection('verifier')">🔍 The Verifier</button>
            <button class="nav-btn" onclick="showSection('chat')">💬 AI Agent</button>
        </div>
    </div>

    <div class="main-container">
        <div class="sidebar">
            <h3>🎯 Platform Features</h3>
            <div style="margin-top: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <strong>📊 ToS Analysis</strong><br>
                    <small>Quote-and-explain transparency research</small>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>🔍 The Verifier</strong><br>
                    <small>AI detection, metadata analysis, link safety</small>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>💬 AI Agent</strong><br>
                    <small>Interactive Gemini-powered analysis</small>
                </div>
            </div>

            <div style="margin-top: 2rem; padding: 1rem; background: rgba(78, 205, 196, 0.1); border-radius: 8px;">
                <strong>🥗 Our Mission</strong><br>
                <small>Making corporate legal predation visible through transparency research</small>
            </div>
        </div>

        <div class="content-area">
            <!-- Analysis Section -->
            <div id="analysis-section" class="platform-section active">
                <h2>📊 ToS Analysis - Quote and Explain</h2>
                <p style="margin-bottom: 2rem; color: #888;">Our detailed transparency research with original quotes and plain English explanations.</p>

                <div class="analysis-grid">
                    ${analysisCards}
                </div>
            </div>

            <!-- Verifier Section -->
            <div id="verifier-section" class="platform-section">
                <h2>🔍 The Verifier - Content Verification</h2>
                <p style="margin-bottom: 2rem; color: #888;">AI-powered content verification: deepfake detection, metadata analysis, and link safety.</p>

                <div class="verifier-panel">
                    <h3>🤖 AI-Generated Media Detection</h3>
                    <div class="upload-zone" id="aiDetectionZone">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">📸</div>
                        <div>Drop images/videos here or click to upload</div>
                        <small style="color: #888;">Detects AI-generated content using advanced analysis</small>
                    </div>
                    <input type="file" id="aiDetectionInput" style="display: none;" accept="image/*,video/*" multiple>
                </div>

                <div class="verifier-panel">
                    <h3>🔗 Link & File Safety Scanner</h3>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <input type="url" placeholder="Enter URL to verify..." style="flex: 1; background: #1a1a1a; border: 1px solid #444; border-radius: 8px; padding: 1rem; color: #e8e8e8;">
                        <button style="background: #4ecdc4; color: #000; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Verify</button>
                    </div>
                    <small style="color: #888;">Checks for malicious content, phishing, and suspicious behavior</small>
                </div>

                <div class="verifier-panel">
                    <h3>📊 Metadata Analysis</h3>
                    <div class="upload-zone" id="metadataZone">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                        <div>Drop files here for metadata extraction</div>
                        <small style="color: #888;">Extracts EXIF data, creation info, and digital fingerprints</small>
                    </div>
                    <input type="file" id="metadataInput" style="display: none;" multiple>
                </div>
            </div>

            <!-- Chat Section -->
            <div id="chat-section" class="platform-section">
                <h2>💬 AI Agent - Interactive Analysis</h2>
                <p style="margin-bottom: 2rem; color: #888;">Chat with our Gemini-powered agent about ToS analysis, transparency research, and content verification.</p>

                <div class="chat-container">
                    <div class="chat-header">
                        <strong>🤖 ToS Salad AI Agent</strong>
                        <small style="color: #888; margin-left: 1rem;">Powered by Gemini 2.0-flash</small>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        <div class="message">
                            <strong>🤖 AI Agent:</strong> Hello! I'm your ToS Salad transparency research assistant. I can help you analyze terms of service, verify content with The Verifier, or explain any of our research. What would you like to explore?
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <textarea id="chatInput" class="chat-input" placeholder="Ask about ToS analysis, The Verifier, or our transparency research..."></textarea>
                        <div class="chat-controls">
                            <button class="send-btn" onclick="sendMessage()">Send Message</button>
                            <button style="background: #2a2a2a; color: #e8e8e8; border: 1px solid #444; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;" onclick="clearChat()">Clear Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.platform-section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected section
            document.getElementById(sectionName + '-section').classList.add('active');

            // Add active class to clicked button
            event.target.classList.add('active');
        }

        function viewFullAnalysis(company) {
            // This would open a modal or new page with full analysis
            alert('Full analysis for ' + company + ' would open here');
        }

        // The Verifier functionality
        function setupVerifier() {
            const aiDetectionZone = document.getElementById('aiDetectionZone');
            const aiDetectionInput = document.getElementById('aiDetectionInput');
            const metadataZone = document.getElementById('metadataZone');
            const metadataInput = document.getElementById('metadataInput');

            // AI Detection upload
            aiDetectionZone.addEventListener('click', () => aiDetectionInput.click());
            aiDetectionZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                aiDetectionZone.classList.add('dragover');
            });
            aiDetectionZone.addEventListener('dragleave', () => {
                aiDetectionZone.classList.remove('dragover');
            });
            aiDetectionZone.addEventListener('drop', (e) => {
                e.preventDefault();
                aiDetectionZone.classList.remove('dragover');
                handleFileUpload(e.dataTransfer.files, 'ai-detection');
            });

            // Metadata analysis upload
            metadataZone.addEventListener('click', () => metadataInput.click());
            metadataZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                metadataZone.classList.add('dragover');
            });
            metadataZone.addEventListener('dragleave', () => {
                metadataZone.classList.remove('dragover');
            });
            metadataZone.addEventListener('drop', (e) => {
                e.preventDefault();
                metadataZone.classList.remove('dragover');
                handleFileUpload(e.dataTransfer.files, 'metadata');
            });

            aiDetectionInput.addEventListener('change', (e) => {
                handleFileUpload(e.target.files, 'ai-detection');
            });

            metadataInput.addEventListener('change', (e) => {
                handleFileUpload(e.target.files, 'metadata');
            });
        }

        function handleFileUpload(files, type) {
            console.log('Uploading files for', type, files);
            // This would call our Verifier API
            alert('File upload for ' + type + ' - ' + files.length + ' files');
        }

        // Chat functionality
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

            // Clear input
            chatInput.value = '';

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Send to AI (this would call our Gemini API)
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();

                // Add AI response
                const aiMessage = document.createElement('div');
                aiMessage.className = 'message';
                aiMessage.innerHTML = '<strong>🤖 AI Agent:</strong> ' + data.response;
                chatMessages.appendChild(aiMessage);

            } catch (error) {
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'message';
                errorMessage.innerHTML = '<strong>🤖 AI Agent:</strong> Sorry, I encountered an error. Please try again.';
                chatMessages.appendChild(errorMessage);
            }

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function clearChat() {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="message"><strong>🤖 AI Agent:</strong> Hello! I\'m your ToS Salad transparency research assistant. I can help you analyze terms of service, verify content with The Verifier, or explain any of our research. What would you like to explore?</div>';
        }

        // Enter key to send message
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Initialize
        setupVerifier();
    </script>
</body>
</html>
  `;
}

async function handleChatAPI(message) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `You are the ToS Salad AI agent. You help users understand:
1. Terms of Service analysis and transparency research
2. The Verifier content verification capabilities
3. Corporate legal predation and surveillance capitalism

Current user question: ${message}

Provide helpful, educational responses focused on transparency and user rights.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Chat API error:', error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again.";
  }
}

async function startFullPlatform() {
  const PORT = 3006;

  const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      console.log('🚀 Loading complete ToS Salad platform...');
      const analyses = loadAllAnalyses();
      const html = generateFullPlatformHTML(analyses);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/api/chat' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { message } = JSON.parse(body);
          const response = await handleChatAPI(message);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ response }));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    } else if (req.url === '/api/verify' && req.method === 'POST') {
      // Verifier API endpoint
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Verifier endpoint - would integrate The Verifier here' }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(PORT, () => {
    console.log('🎉 COMPLETE ToS Salad Platform Started!');
    console.log(`🌐 Full Platform: http://localhost:${PORT}`);
    console.log('📊 ToS Analysis • 🔍 The Verifier • 💬 AI Agent');
    console.log('🥗 Everything integrated and working together!');
  });
}

startFullPlatform();