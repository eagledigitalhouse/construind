import { processarWebhookZapSign } from '@/lib/zapsign-webhook';

/**
 * Endpoint para receber webhooks de serviços de assinatura digital
 * Este arquivo deve ser configurado como um endpoint de API no seu servidor
 * Por exemplo, em Next.js seria em pages/api/assinatura/webhook.ts
 * ou em Express.js como uma rota POST
 */

export async function handleAssinaturaWebhook(request: Request): Promise<Response> {
  try {
    // Verificar se é um POST request
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Obter o corpo da requisição
    const webhookData = await request.json();

    // Processar o webhook (atualmente apenas ZapSign é suportado)
    await processarWebhookZapSign(webhookData);

    // Retornar sucesso
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Erro ao processar webhook de assinatura:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Para uso com Express.js
export function setupAssinaturaWebhookRoute(app: any) {
  app.post('/api/assinatura/webhook', async (req: any, res: any) => {
    try {
      await processarWebhookZapSign(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Erro ao processar webhook de assinatura:', error);
      res.status(500).send('Internal Server Error');
    }
  });
}

// Para uso com Vercel/Next.js API Routes
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await processarWebhookZapSign(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook de assinatura:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}