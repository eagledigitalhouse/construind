const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiToken = process.env.ZAPSIGN_API_TOKEN;
    
    if (!apiToken) {
      console.error('ZAPSIGN_API_TOKEN não configurado');
      return res.status(500).json({ error: 'Token da API ZapSign não configurado' });
    }

    // Extrair o path da URL (remover /api/zapsign-proxy/)
    const zapSignPath = req.url.replace('/api/zapsign-proxy/', '');
    const zapSignUrl = `https://api.zapsign.com.br/api/v2/${zapSignPath}`;
    
    console.log('Proxy ZapSign - URL:', zapSignUrl);
    console.log('Proxy ZapSign - Método:', req.method);
    console.log('Proxy ZapSign - Headers:', req.headers);

    // Configurar headers para a requisição
    const headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Configurar opções da requisição
    const fetchOptions = {
      method: req.method,
      headers: headers
    };

    // Adicionar body para métodos que suportam
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    console.log('Proxy ZapSign - Fazendo requisição para:', zapSignUrl);
    
    // Fazer a requisição para a API do ZapSign
    const response = await fetch(zapSignUrl, fetchOptions);
    
    console.log('Proxy ZapSign - Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API ZapSign:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Erro na API ZapSign', 
        status: response.status,
        message: errorText 
      });
    }

    const data = await response.json();
    console.log('Proxy ZapSign - Dados recebidos:', data);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro no proxy ZapSign:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor', 
      message: error.message 
    });
  }
}