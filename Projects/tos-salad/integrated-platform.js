const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { TheVerifier } = require('./the-verifier');
const { GeminiWithVerifier } = require('./gemini-with-verifier');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs').promises;

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize components - using EXISTING code found in codebase
const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

const verifier = new TheVerifier();
const geminiVerifier = new GeminiWithVerifier();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.use(express.static('public'));
app.use(express.json());

// EXISTING API ENDPOINTS (preserve working functionality)
app.get('/api/companies', async (req, res) => {
  try {
    const { data: companies, error } = await supabase
      .from('tos_analysis_companies')
      .select(`
        *,
        tos_analysis_results (
          transparency_score,
          user_friendliness_score,
          privacy_score,
          manipulation_risk_score,
          concerning_clauses,
          key_concerns,
          recommendations,
          executive_summary
        )
      `)
      .order('name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/company/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: company, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .eq('id', id)
      .single();

    if (companyError) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .select('*')
      .eq('company_id', id)
      .single();

    const { data: analysis, error: analysisError } = await supabase
      .from('tos_analysis_results')
      .select('*')
      .eq('company_id', id)
      .single();

    res.json({
      company,
      document,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// NEW VERIFIER ENDPOINTS (integrate existing Verifier component)
app.post('/api/verifier/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('🛡️ Processing file verification...');
    const report = await verifier.generateVerificationReport(req.file.buffer, 'file');

    res.json(report);
  } catch (error) {
    console.error('Verifier upload error:', error);
    res.status(500).json({ error: 'Verification failed: ' + error.message });
  }
});

app.post('/api/verifier/url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    console.log('🛡️ Processing URL verification...');
    const report = await verifier.generateVerificationReport(url, 'url');

    res.json(report);
  } catch (error) {
    console.error('Verifier URL error:', error);
    res.status(500).json({ error: 'URL verification failed: ' + error.message });
  }
});

// NEW AI AGENT ENDPOINTS (integrate existing GeminiWithVerifier)
app.post('/api/agent/analyze', async (req, res) => {
  try {
    const { input, analysisType = 'auto' } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input required' });
    }

    console.log('🤖 Processing AI Agent analysis...');
    const result = await geminiVerifier.analyzeContent(input, analysisType);

    res.json(result);
  } catch (error) {
    console.error('AI Agent error:', error);
    res.status(500).json({ error: 'Analysis failed: ' + error.message });
  }
});

app.post('/api/agent/tos-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    console.log('📜 Processing live ToS analysis...');
    const result = await geminiVerifier.analyzeContent(url, 'tos_document');

    res.json(result);
  } catch (error) {
    console.error('ToS URL analysis error:', error);
    res.status(500).json({ error: 'ToS analysis failed: ' + error.message });
  }
});

// INTEGRATED PLATFORM UI
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToS Salad - Complete Digital Transparency Platform</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 2.5em;
        }
        .header .subtitle {
            color: #7f8c8d;
            margin-top: 10px;
            font-size: 1.2em;
        }
        .nav-tabs {
            display: flex;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            overflow: hidden;
        }
        .nav-tab {
            flex: 1;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            background: #ecf0f1;
            border: none;
            font-size: 1.1em;
            font-weight: 600;
            transition: all 0.3s;
        }
        .nav-tab.active {
            background: #3498db;
            color: white;
        }
        .nav-tab:hover:not(.active) {
            background: #bdc3c7;
        }
        .tab-content {
            display: none;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .tab-content.active {
            display: block;
        }
        .companies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        .company-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .company-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .company-name {
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .score-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            color: white;
            font-weight: 600;
            margin-bottom: 15px;
        }
        .score-critical { background: #e74c3c; }
        .score-high { background: #f39c12; }
        .score-medium { background: #f1c40f; color: #333; }
        .score-good { background: #27ae60; }
        .score-excellent { background: #2ecc71; }
        .view-analysis-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1em;
            width: 100%;
        }
        .upload-area {
            border: 2px dashed #3498db;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            margin-bottom: 20px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .upload-area:hover {
            background: #ecf0f1;
        }
        .upload-area.dragover {
            background: #e8f4fd;
            border-color: #2980b9;
        }
        .url-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 1em;
            margin-bottom: 15px;
        }
        .analyze-btn {
            background: #27ae60;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 600;
        }
        .results-area {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            display: none;
        }
        .results-area.show {
            display: block;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
        }
        .modal-content {
            position: relative;
            background: white;
            margin: 2% auto;
            padding: 30px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            border-radius: 12px;
            overflow-y: auto;
        }
        .close-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            color: #999;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <div class="subtitle">Complete Digital Transparency Platform</div>
        <p>Analysis • Verification • AI Agent</p>
    </div>

    <div class="nav-tabs">
        <button class="nav-tab active" onclick="switchTab('analysis')">📊 ToS Analysis</button>
        <button class="nav-tab" onclick="switchTab('verifier')">🛡️ The Verifier</button>
        <button class="nav-tab" onclick="switchTab('agent')">🤖 AI Agent</button>
    </div>

    <!-- ToS ANALYSIS TAB (existing working functionality) -->
    <div id="analysis-tab" class="tab-content active">
        <h2>Terms of Service Analysis</h2>
        <p>Analyze stored ToS documents with our quote-and-explain methodology.</p>

        <div id="loading" class="loading">Loading analysis data...</div>
        <div id="error" class="error" style="display: none;"></div>
        <div id="companies-container" class="companies-grid" style="display: none;"></div>
    </div>

    <!-- THE VERIFIER TAB (integrated existing component) -->
    <div id="verifier-tab" class="tab-content">
        <h2>The Verifier - Content Verification System</h2>
        <p>Analyze digital content for AI generation, metadata, provenance, and safety.</p>

        <div class="upload-area" id="uploadArea">
            <h3>📁 Upload File for Verification</h3>
            <p>Drop files here or click to select</p>
            <p><small>Supports images, videos, documents (max 50MB)</small></p>
            <input type="file" id="fileInput" style="display: none;" accept="image/*,video/*,application/*">
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <strong>OR</strong>
        </div>

        <div>
            <h3>🔗 Verify URL</h3>
            <input type="url" id="urlInput" class="url-input" placeholder="Enter URL to verify for safety...">
            <button class="analyze-btn" onclick="verifyURL()">🛡️ Verify URL</button>
        </div>

        <div id="verifier-results" class="results-area"></div>
    </div>

    <!-- AI AGENT TAB (integrated existing component) -->
    <div id="agent-tab" class="tab-content">
        <h2>AI Agent - Live Analysis</h2>
        <p>Real-time ToS analysis and content verification using Gemini AI.</p>

        <div>
            <h3>📜 Analyze ToS URL</h3>
            <input type="url" id="tosUrlInput" class="url-input" placeholder="Enter Terms of Service URL...">
            <button class="analyze-btn" onclick="analyzeTosURL()">📜 Analyze ToS</button>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <strong>OR</strong>
        </div>

        <div>
            <h3>🔍 Mixed Analysis</h3>
            <input type="text" id="mixedInput" class="url-input" placeholder="Enter URL, file path, or text for AI analysis...">
            <button class="analyze-btn" onclick="analyzeMixed()">🤖 AI Analyze</button>
        </div>

        <div id="agent-results" class="results-area"></div>
    </div>

    <!-- Modal for detailed analysis -->
    <div id="analysisModal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div id="modalContent"></div>
        </div>
    </div>

    <script>
        // Tab switching functionality
        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');

            // Load content if needed
            if (tabName === 'analysis' && !window.companiesLoaded) {
                loadCompanies();
            }
        }

        // EXISTING ToS ANALYSIS FUNCTIONALITY (preserve working code)
        async function loadCompanies() {
            try {
                const response = await fetch('/api/companies');
                if (!response.ok) {
                    throw new Error('Failed to load companies');
                }
                const companies = await response.json();
                displayCompanies(companies);
                window.companiesLoaded = true;
            } catch (error) {
                document.getElementById('error').style.display = 'block';
                document.getElementById('error').textContent = 'Error loading data: ' + error.message;
                document.getElementById('loading').style.display = 'none';
            }
        }

        function getScoreClass(score) {
            if (score >= 90) return 'score-excellent';
            if (score >= 70) return 'score-good';
            if (score >= 40) return 'score-medium';
            if (score >= 20) return 'score-high';
            return 'score-critical';
        }

        function displayCompanies(companies) {
            const container = document.getElementById('companies-container');
            const validCompanies = companies.filter(company =>
                company.tos_analysis_results && company.tos_analysis_results.length > 0
            );

            validCompanies.sort((a, b) => {
                const scoreA = a.tos_analysis_results[0]?.transparency_score || 0;
                const scoreB = b.tos_analysis_results[0]?.transparency_score || 0;
                return scoreA - scoreB;
            });

            container.innerHTML = validCompanies.map(company => {
                const analysis = company.tos_analysis_results[0];
                const score = analysis.transparency_score;
                const keyConcerns = analysis.key_concerns || [];

                return \`
                    <div class="company-card">
                        <div class="company-name">\${company.name}</div>
                        <div class="score-badge \${getScoreClass(score)}">
                            Transparency: \${score}/100
                        </div>
                        <div style="margin-bottom: 15px;">
                            \${keyConcerns.slice(0, 2).map(concern =>
                                \`<span style="display: inline-block; background: #ecf0f1; color: #2c3e50; padding: 3px 8px; border-radius: 12px; font-size: 0.85em; margin: 2px;">\${concern}</span>\`
                            ).join('')}
                        </div>
                        <button class="view-analysis-btn" onclick="showAnalysis('\${company.id}')">
                            View Complete Analysis
                        </button>
                    </div>
                \`;
            }).join('');

            document.getElementById('loading').style.display = 'none';
            container.style.display = 'grid';
        }

        async function showAnalysis(companyId) {
            try {
                const response = await fetch(\`/api/company/\${companyId}\`);
                if (!response.ok) {
                    throw new Error('Failed to load analysis');
                }
                const data = await response.json();

                const modal = document.getElementById('analysisModal');
                const content = document.getElementById('modalContent');

                content.innerHTML = \`
                    <h2>\${data.company.name} Analysis</h2>
                    <div style="white-space: pre-wrap; line-height: 1.8;">\${data.document.raw_content || 'No analysis content available'}</div>
                \`;

                modal.style.display = 'block';
            } catch (error) {
                alert('Error loading analysis: ' + error.message);
            }
        }

        // THE VERIFIER FUNCTIONALITY (integrate existing component)
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFileUpload(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            handleFileUpload(e.target.files[0]);
        });

        async function handleFileUpload(file) {
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            const resultsArea = document.getElementById('verifier-results');
            resultsArea.innerHTML = '<div class="loading">🛡️ Verifying content...</div>';
            resultsArea.classList.add('show');

            try {
                const response = await fetch('/api/verifier/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error);
                }

                displayVerifierResults(result);
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Verification failed: \${error.message}</div>\`;
            }
        }

        async function verifyURL() {
            const url = document.getElementById('urlInput').value.trim();
            if (!url) {
                alert('Please enter a URL');
                return;
            }

            const resultsArea = document.getElementById('verifier-results');
            resultsArea.innerHTML = '<div class="loading">🛡️ Verifying URL...</div>';
            resultsArea.classList.add('show');

            try {
                const response = await fetch('/api/verifier/url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error);
                }

                displayVerifierResults(result);
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ URL verification failed: \${error.message}</div>\`;
            }
        }

        function displayVerifierResults(result) {
            const resultsArea = document.getElementById('verifier-results');

            let html = \`
                <h3>🛡️ Verification Results</h3>
                <div class="success">
                    <strong>Overall Verdict:</strong> \${result.overallVerdict}<br>
                    <strong>Risk Level:</strong> \${result.riskLevel}
                </div>
            \`;

            if (result.summary) {
                html += '<h4>📋 Analysis Summary:</h4><ul>';
                Object.entries(result.summary).forEach(([key, value]) => {
                    if (value) html += \`<li><strong>\${key}:</strong> \${value}</li>\`;
                });
                html += '</ul>';
            }

            if (result.analysisModules) {
                html += '<h4>🔍 Detailed Analysis:</h4>';
                result.analysisModules.forEach(module => {
                    html += \`
                        <div style="margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                            <strong>\${module.module}:</strong> \${module.verdict || 'Analysis completed'}
                        </div>
                    \`;
                });
            }

            resultsArea.innerHTML = html;
        }

        // AI AGENT FUNCTIONALITY (integrate existing component)
        async function analyzeTosURL() {
            const url = document.getElementById('tosUrlInput').value.trim();
            if (!url) {
                alert('Please enter a ToS URL');
                return;
            }

            const resultsArea = document.getElementById('agent-results');
            resultsArea.innerHTML = '<div class="loading">🤖 Analyzing ToS document...</div>';
            resultsArea.classList.add('show');

            try {
                const response = await fetch('/api/agent/tos-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error);
                }

                displayAgentResults(result);
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ ToS analysis failed: \${error.message}</div>\`;
            }
        }

        async function analyzeMixed() {
            const input = document.getElementById('mixedInput').value.trim();
            if (!input) {
                alert('Please enter input for analysis');
                return;
            }

            const resultsArea = document.getElementById('agent-results');
            resultsArea.innerHTML = '<div class="loading">🤖 Performing AI analysis...</div>';
            resultsArea.classList.add('show');

            try {
                const response = await fetch('/api/agent/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input, analysisType: 'auto' })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error);
                }

                displayAgentResults(result);
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ AI analysis failed: \${error.message}</div>\`;
            }
        }

        function displayAgentResults(result) {
            const resultsArea = document.getElementById('agent-results');

            let html = \`
                <h3>🤖 AI Agent Results</h3>
                <div class="success">
                    <strong>Analysis Type:</strong> \${result.analysisType}<br>
                    <strong>Timestamp:</strong> \${result.timestamp}
                </div>
            \`;

            if (result.error) {
                html += \`<div class="error">Error: \${result.error}</div>\`;
            } else {
                html += '<h4>📊 Analysis Results:</h4>';
                html += \`<pre style="background: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto;">\${JSON.stringify(result, null, 2)}</pre>\`;
            }

            resultsArea.innerHTML = html;
        }

        // Modal controls
        document.querySelector('.close-btn').onclick = function() {
            document.getElementById('analysisModal').style.display = 'none';
        }

        window.onclick = function(event) {
            const modal = document.getElementById('analysisModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        // Load ToS analysis on page load
        loadCompanies();
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ INTEGRATED ToS Salad Platform running at http://localhost:${PORT}`);
  console.log('📊 ToS Analysis: Working database connection with quote-and-explain content');
  console.log('🛡️ The Verifier: Integrated existing content verification system');
  console.log('🤖 AI Agent: Integrated existing Gemini with Verifier capabilities');
  console.log('🎯 All three components accessible through unified interface');
});