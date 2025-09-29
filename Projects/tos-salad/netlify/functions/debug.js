exports.handler = async (event, context) => {
  try {
    // Basic diagnostic information
    const debug = {
      timestamp: new Date().toISOString(),
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        headers: Object.keys(event.headers || {}),
        queryStringParameters: event.queryStringParameters
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'undefined',
        NETLIFY: process.env.NETLIFY || 'undefined',
        DATABASE_URL_SET: !!process.env.DATABASE_URL,
        NETLIFY_DATABASE_URL_SET: !!process.env.NETLIFY_DATABASE_URL,
        GOOGLE_GEMINI_API_KEY_SET: !!process.env.GOOGLE_GEMINI_API_KEY,
      },
      process: {
        platform: process.platform,
        version: process.version,
        cwd: process.cwd(),
        memory: process.memoryUsage()
      },
      context: {
        functionName: context.functionName,
        functionVersion: context.functionVersion,
        awsRequestId: context.awsRequestId,
        remainingTimeInMillis: context.getRemainingTimeInMillis()
      }
    };

    // Test database URL parsing
    let dbUrlTest = 'not-tested';
    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

    if (dbUrl) {
      try {
        const url = new URL(dbUrl);
        dbUrlTest = `parsed-ok: ${url.protocol}//${url.hostname}:${url.port || 'default'}`;
      } catch (parseError) {
        dbUrlTest = `parse-error: ${parseError.message}`;
      }
    } else {
      dbUrlTest = 'no-database-url-found';
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'netlify-function-working',
        debug,
        dbUrlTest,
        message: 'Netlify serverless function is operational'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'function-error',
        error: error.message,
        stack: error.stack?.substring(0, 500)
      })
    };
  }
};