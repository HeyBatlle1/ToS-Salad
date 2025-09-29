const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Enable keep-alive for connection reuse
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

    if (!dbUrl) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'error',
          message: 'No database URL found',
          env_check: {
            NETLIFY_DATABASE_URL: !!process.env.NETLIFY_DATABASE_URL,
            DATABASE_URL: !!process.env.DATABASE_URL
          }
        })
      };
    }

    console.log('Testing direct PostgreSQL connection...');

    const client = new Client({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 15000,
      query_timeout: 30000,
      statement_timeout: 30000
    });

    try {
      console.log('Connecting to PostgreSQL...');
      await client.connect();
      console.log('Connected! Running test query...');

      const result = await client.query(`
        SELECT
          1 as test,
          NOW() as timestamp,
          version() as pg_version,
          current_database() as database_name,
          current_user as user_name
      `);

      await client.end();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'success',
          message: 'Direct PostgreSQL connection successful',
          result: result.rows[0],
          connection_info: {
            url_length: dbUrl.length,
            ssl_enabled: true,
            timestamp: new Date().toISOString()
          }
        })
      };

    } catch (dbError) {
      console.error('PostgreSQL connection failed:', dbError);

      try {
        await client.end();
      } catch (endError) {
        // Ignore cleanup errors
      }

      return {
        statusCode: 503,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'database_connection_failed',
          message: 'Direct PostgreSQL connection failed',
          error: dbError.message,
          error_code: dbError.code,
          error_detail: dbError.detail,
          connection_info: {
            url_length: dbUrl.length,
            ssl_enabled: true
          }
        })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'function_error',
        message: 'Error in PostgreSQL test function',
        error: error.message,
        stack: error.stack?.substring(0, 500)
      })
    };
  }
};