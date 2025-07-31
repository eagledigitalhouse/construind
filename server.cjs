const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const ZAPSIGN_API_BASE = 'https://api.zapsign.com.br/api/v1';
const ZAPSIGN_API_TOKEN = process.env.ZAPSIGN_API_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy para a API do ZapSign
app.use('/api/zapsign-proxy', async (req, res) => {
  console.log('Server.cjs ZapSign Proxy: Recebida requisição', {
    method: req.method,
    url: req.originalUrl,
    path: req.originalUrl.replace('/api/zapsign-proxy', ''),
    query: req.query
  });

  // Extrair o path da query string se estiver presente
  let path = '';
  if (req.query.path) {
    path = `/${req.query.path}`;
    console.log('Server.cjs ZapSign Proxy: Path extraído da query:', path);
  } else if (req.originalUrl.includes('/api/zapsign-proxy/')) {
    path = req.originalUrl.replace('/api/zapsign-proxy', '');
    console.log('Server.cjs ZapSign Proxy: Path extraído da URL:', path);
  }
  
  if (!path) {
    console.error('Server.cjs ZapSign Proxy: Path não fornecido');
    return res.status(400).json({ error: 'Path não fornecido' });
  }

  const apiToken = process.env.ZAPSIGN_API_TOKEN;
  if (!apiToken) {
    console.error('Server.cjs ZapSign Proxy: Token da API ZapSign não configurado');
    return res.status(500).json({ error: 'Token da API ZapSign não configurado' });
  }
  console.log('Server.cjs ZapSign Proxy: Token da API configurado:', apiToken ? 'Sim' : 'Não');

  try {
    const apiUrl = `https://api.zapsign.com.br/api/v1${path}`;
    console.log('Server.cjs ZapSign Proxy: URL da API:', apiUrl);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    };
    console.log('Server.cjs ZapSign Proxy: Headers configurados (sem mostrar o token)');

    const options = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      options.body = JSON.stringify(req.body);
      console.log('Server.cjs ZapSign Proxy: Body da requisição:', req.body);
    }

    console.log('Server.cjs ZapSign Proxy: Iniciando requisição para a API do ZapSign');
    const response = await fetch(apiUrl, options);
    console.log('Server.cjs ZapSign Proxy: Resposta recebida com status:', response.status);

    const data = await response.json();
    console.log('Server.cjs ZapSign Proxy: Dados da resposta:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Server.cjs ZapSign Proxy: Erro ao fazer requisição para a API do ZapSign:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição para a API do ZapSign' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
  console.log(`ZapSign API Token configurado: ${ZAPSIGN_API_TOKEN ? 'Sim' : 'Não'}`);
});