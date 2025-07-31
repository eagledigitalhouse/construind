import { NextApiRequest, NextApiResponse } from 'next';
import { cors } from '@/lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('ZapSign Proxy: Recebida requisição', {
    method: req.method,
    url: req.url,
    query: req.query
  });

  // Habilitar CORS
  await cors(req, res);

  // Verificar se o path foi fornecido
  const { path } = req.query;
  if (!path) {
    console.error('ZapSign Proxy: Path não fornecido');
    return res.status(400).json({ error: 'Path não fornecido' });
  }

  // Verificar se o token da API está configurado
  const apiToken = process.env.ZAPSIGN_API_TOKEN;
  if (!apiToken) {
    console.error('ZapSign Proxy: Token da API ZapSign não configurado');
    return res.status(500).json({ error: 'Token da API ZapSign não configurado' });
  }

  try {
    // Construir a URL completa para a API do ZapSign
    const apiUrl = `https://api.zapsign.com.br/api/v1${Array.isArray(path) ? path.join('/') : path}`;
    console.log('ZapSign Proxy: URL da API:', apiUrl);

    // Configurar os headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    };
    console.log('ZapSign Proxy: Headers configurados (sem mostrar o token)');

    // Configurar as opções da requisição
    const options: RequestInit = {
      method: req.method,
      headers,
    };

    // Adicionar o corpo da requisição se for POST, PUT ou PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      options.body = JSON.stringify(req.body);
      console.log('ZapSign Proxy: Body da requisição:', req.body);
    }

    console.log('ZapSign Proxy: Iniciando requisição para a API do ZapSign');
    // Fazer a requisição para a API do ZapSign
    const response = await fetch(apiUrl, options);
    console.log('ZapSign Proxy: Resposta recebida com status:', response.status);

    // Obter o corpo da resposta
    const data = await response.json();
    console.log('ZapSign Proxy: Dados da resposta:', data);

    // Retornar a resposta com o mesmo status e corpo
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('ZapSign Proxy: Erro ao fazer requisição para a API do ZapSign:', error);
    return res.status(500).json({ error: 'Erro ao processar requisição para a API do ZapSign' });
  }
}