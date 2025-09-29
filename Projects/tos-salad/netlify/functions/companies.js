const { Pool } = require('pg');

// Create connection pool that persists across function invocations
let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL not found');
    }

    console.log('Creating PostgreSQL pool for companies function');

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for Neon
      },
      max: 1, // Single connection for serverless
      min: 0, // Allow scaling to zero
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      application_name: 'tos-salad-netlify-companies'
    });
  }
  return pool;
}

exports.handler = async (event, context) => {
  // Enable keep-alive for connection reuse
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    console.log('Companies function called:', {
      method: event.httpMethod,
      path: event.path,
      query: event.queryStringParameters
    });

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      console.log('Connected to database, executing query...');

      // Query companies with their latest analysis
      const companiesQuery = `
        SELECT
          c.id,
          c.name,
          c.domain,
          c.industry,
          c.headquarters,
          c.founded_year,
          c.employee_count_range,
          c.revenue_range,
          c.business_model,
          c.tos_url,
          c.created_at,
          c.updated_at
        FROM tos_analysis_companies c
        ORDER BY c.updated_at DESC
        LIMIT 50
      `;

      const result = await client.query(companiesQuery);
      console.log(`Found ${result.rows.length} companies`);

      // Get analysis data for each company
      const companies = await Promise.all(
        result.rows.map(async (company) => {
          try {
            const analysisQuery = `
              SELECT
                transparency_score,
                user_friendliness_score,
                privacy_score,
                manipulation_risk_score,
                analyzed_at,
                red_flags
              FROM tos_analysis_results
              WHERE company_id = $1
              ORDER BY analyzed_at DESC
              LIMIT 1
            `;

            const analysisResult = await client.query(analysisQuery, [company.id]);

            return {
              ...company,
              latestAnalysis: analysisResult.rows[0] || null
            };
          } catch (error) {
            console.error(`Failed to get analysis for company ${company.id}:`, error);
            return {
              ...company,
              latestAnalysis: null
            };
          }
        })
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          companies,
          timestamp: new Date().toISOString(),
          count: companies.length
        })
      };

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Companies function error:', error);

    return {
      statusCode: 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Database connection failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        environment: {
          DATABASE_URL_SET: !!process.env.DATABASE_URL,
          NETLIFY_DATABASE_URL_SET: !!process.env.NETLIFY_DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      })
    };
  }
};