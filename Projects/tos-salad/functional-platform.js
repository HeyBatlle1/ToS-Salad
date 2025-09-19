const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = 3000;

// Same Supabase connection as Reddit script
const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

app.use(express.static('public'));
app.use(express.json());

// Get all companies with their analysis data - EXACT query pattern from Reddit script
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
      console.error('Database error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(companies);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific company analysis - EXACT query pattern from Reddit script
app.get('/api/company/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get company info - same as Reddit script pattern
    const { data: company, error: companyError } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .eq('id', id)
      .single();

    if (companyError) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get document - same as Reddit script pattern
    const { data: document, error: docError } = await supabase
      .from('tos_analysis_documents')
      .select('*')
      .eq('company_id', id)
      .single();

    // Get analysis - same as Reddit script pattern
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
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToS Salad - Terms of Service Analysis</title>
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
            margin-bottom: 40px;
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
        .companies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .company-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .company-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .company-name {
            font-size: 1.3em;
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
        .key-concerns {
            margin-bottom: 15px;
        }
        .concern-tag {
            display: inline-block;
            background: #ecf0f1;
            color: #2c3e50;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.85em;
            margin: 2px;
        }
        .view-analysis-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1em;
            transition: background 0.2s;
            width: 100%;
        }
        .view-analysis-btn:hover {
            background: #2980b9;
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
        .close-btn:hover {
            color: #333;
        }
        .analysis-content {
            white-space: pre-wrap;
            line-height: 1.8;
        }
        .loading {
            text-align: center;
            padding: 50px;
            color: #7f8c8d;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥗 ToS Salad</h1>
        <div class="subtitle">Making Terms of Service Digestible for Everyone</div>
    </div>

    <div id="loading" class="loading">Loading analysis data...</div>
    <div id="error" class="error" style="display: none;"></div>
    <div id="companies-container" class="companies-grid" style="display: none;"></div>

    <!-- Modal for detailed analysis -->
    <div id="analysisModal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div id="modalContent"></div>
        </div>
    </div>

    <script>
        // Use the exact same API patterns as the Reddit script
        async function loadCompanies() {
            try {
                const response = await fetch('/api/companies');
                if (!response.ok) {
                    throw new Error('Failed to load companies');
                }
                const companies = await response.json();
                displayCompanies(companies);
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

            // Sort by transparency score (lowest first to highlight worst)
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
                        <div class="key-concerns">
                            \${keyConcerns.slice(0, 3).map(concern =>
                                \`<span class="concern-tag">\${concern}</span>\`
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

        // Use the exact same API pattern as Reddit script for individual company
        async function showAnalysis(companyId) {
            try {
                const response = await fetch(\`/api/company/\${companyId}\`);
                if (!response.ok) {
                    throw new Error('Failed to load analysis');
                }
                const data = await response.json();

                const modal = document.getElementById('analysisModal');
                const content = document.getElementById('modalContent');

                // Display the actual stored content - same as Reddit
                content.innerHTML = \`
                    <h2>\${data.company.name} Analysis</h2>
                    <div class="analysis-content">\${data.document.raw_content || 'No analysis content available'}</div>
                \`;

                modal.style.display = 'block';
            } catch (error) {
                alert('Error loading analysis: ' + error.message);
            }
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

        // Load companies on page load - using same pattern as Reddit script
        loadCompanies();
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ ToS Salad platform running at http://localhost:${PORT}`);
  console.log('🔍 Using same database queries as Reddit verification script');
  console.log('📊 Ready to display actual stored analysis content');
});