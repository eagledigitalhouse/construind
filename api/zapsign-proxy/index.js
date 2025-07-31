const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiToken = process.env.ZAPSIGN_API_TOKEN;
    
    if (!apiToken) {
      console.error('ZAPSIGN_API_TOKEN not configured');
      return res.status(500).json({ error: 'API token not configured' });
    }

    // Extract the path after /api/zapsign-proxy/
    const path = req.url.replace('/api/zapsign-proxy', '') || '/';
    const zapSignUrl = `https://api.zapsign.com.br/api/v1${path}`;
    
    console.log(`Proxying request to: ${zapSignUrl}`);
    console.log(`Method: ${req.method}`);
    console.log(`Headers:`, req.headers);

    const requestOptions = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FESPIN-Proxy/1.0'
      }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      requestOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(zapSignUrl, requestOptions);
    const responseText = await response.text();
    
    console.log(`ZapSign API Response Status: ${response.status}`);
    console.log(`ZapSign API Response:`, responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'ZapSign API Error',
        status: response.status,
        message: responseText
      });
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      return res.status(response.status).json(jsonResponse);
    } catch (parseError) {
      console.error('Failed to parse ZapSign response as JSON:', parseError);
      return res.status(500).json({
        error: 'Invalid JSON response from ZapSign API',
        rawResponse: responseText
      });
    }

  } catch (error) {
    console.error('ZapSign Proxy Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};