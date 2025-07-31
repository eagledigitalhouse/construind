const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const ZAPSIGN_API_BASE = 'https://api.zapsign.com.br/api/v1';
const ZAPSIGN_API_TOKEN = process.env.ZAPSIGN_API_TOKEN;

// Importar funções para processar webhooks
let processarWebhookZapSign;
let setupAssinaturaWebhookRoute;
try {
  // Tentar importar usando require (para CommonJS)
  processarWebhookZapSign = require('./dist/lib/zapsign-webhook').processarWebhookZapSign;
  setupAssinaturaWebhookRoute = require('./dist/api/assinatura-webhook').setupAssinaturaWebhookRoute;
} catch (error) {
  console.warn('Não foi possível importar funções de webhook via require:', error.message);
  // Serão carregadas dinamicamente quando as rotas forem chamadas
}

// Middleware
app.use(cors());
app.use(express.json());

// Proxy para a API do ZapSign
app.use('/api/zapsign-proxy/*', async (req, res) => {
  console.log('Server.js ZapSign Proxy: Recebida requisição', {
    method: req.method,
    url: req.originalUrl,
    path: req.originalUrl.replace('/api/zapsign-proxy', '')
  });

  const path = req.originalUrl.replace('/api/zapsign-proxy', '');
  
  if (!path) {
    console.error('Server.js ZapSign Proxy: Path não fornecido');
    return res.status(400).json({ error: 'Path não fornecido' });
  }

  const apiToken = process.env.ZAPSIGN_API_TOKEN;
  if (!apiToken) {
    console.error('Server.js ZapSign Proxy: Token da API ZapSign não configurado');
    return res.status(500).json({ error: 'Token da API ZapSign não configurado' });
  }
  console.log('Server.js ZapSign Proxy: Token da API configurado:', apiToken ? 'Sim' : 'Não');

  try {
    const apiUrl = `https://api.zapsign.com.br/api/v1${path}`;
    console.log('Server.js ZapSign Proxy: URL da API:', apiUrl);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    };
    console.log('Server.js ZapSign Proxy: Headers configurados (sem mostrar o token)');

    const options = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      options.body = JSON.stringify(req.body);
      console.log('Server.js ZapSign Proxy: Body da requisição:', req.body);
    }

    console.log('Server.js ZapSign Proxy: Iniciando requisição para a API do ZapSign');
    const response = await fetch(apiUrl, options);
    console.log('Server.js ZapSign Proxy: Resposta recebida com status:', response.status);

    const data = await response.json();
    console.log('Server.js ZapSign Proxy: Dados da resposta:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Server.js ZapSign Proxy: Erro ao fazer requisição para a API do ZapSign:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição para a API do ZapSign' });
  }
});

// Webhook do ZapSign
app.post('/api/zapsign/webhook', async (req, res) => {
  console.log('Server.js: Recebido webhook do ZapSign', {
    event: req.body?.event?.name,
    document: req.body?.event?.data?.document?.token
  });

  try {
    // Se não foi possível importar no início, tentar importar dinamicamente
    if (!processarWebhookZapSign) {
      try {
        // Tentar importar usando import() (para ESM)
        const module = await import('./dist/lib/zapsign-webhook.js');
        processarWebhookZapSign = module.processarWebhookZapSign;
      } catch (importError) {
        console.error('Erro ao importar processarWebhookZapSign:', importError);
        return res.status(500).json({ error: 'Erro interno ao carregar módulo de processamento' });
      }
    }

    // Processar o webhook
    await processarWebhookZapSign(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook ZapSign:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

// Webhook genérico de assinatura (para futuras integrações)
app.post('/api/assinatura/webhook', async (req, res) => {
  console.log('Server.js: Recebido webhook de assinatura', {
    body: req.body
  });

  try {
    // Se não foi possível importar no início, tentar importar dinamicamente
    if (!setupAssinaturaWebhookRoute) {
      try {
        // Tentar importar usando import() (para ESM)
        const module = await import('./dist/api/assinatura-webhook.js');
        setupAssinaturaWebhookRoute = module.setupAssinaturaWebhookRoute;
      } catch (importError) {
        console.error('Erro ao importar setupAssinaturaWebhookRoute:', importError);
        return res.status(500).json({ error: 'Erro interno ao carregar módulo de processamento' });
      }
    }

    // Criar um app temporário para processar a requisição
    const tempApp = {
      post: (path, handler) => {
        handler(req, res);
      }
    };

    // Processar o webhook usando a função importada
    setupAssinaturaWebhookRoute(tempApp);
  } catch (error) {
    console.error('Erro ao processar webhook de assinatura:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
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