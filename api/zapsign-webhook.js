const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    console.log('Webhook ZapSign recebido:', JSON.stringify(webhookData, null, 2));

    // Processar diferentes tipos de eventos
    const { event, data } = webhookData;

    switch (event) {
      case 'document_signed':
        await processDocumentSigned(data);
        break;
      case 'document_completed':
        await processDocumentCompleted(data);
        break;
      case 'document_rejected':
        await processDocumentRejected(data);
        break;
      default:
        console.log('Evento não tratado:', event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook ZapSign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function processDocumentSigned(data) {
  console.log('Processando documento assinado:', data);
  
  try {
    // Atualizar status do contrato no banco
    const { error } = await supabase
      .from('contratos')
      .update({ 
        status: 'assinado',
        data_assinatura: new Date().toISOString(),
        webhook_data: data
      })
      .eq('zapsign_document_id', data.document_id);

    if (error) {
      console.error('Erro ao atualizar contrato:', error);
    } else {
      console.log('Contrato atualizado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao processar documento assinado:', error);
  }
}

async function processDocumentCompleted(data) {
  console.log('Processando documento completado:', data);
  
  try {
    // Atualizar status do contrato no banco
    const { error } = await supabase
      .from('contratos')
      .update({ 
        status: 'concluido',
        data_conclusao: new Date().toISOString(),
        webhook_data: data
      })
      .eq('zapsign_document_id', data.document_id);

    if (error) {
      console.error('Erro ao atualizar contrato:', error);
    } else {
      console.log('Contrato completado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao processar documento completado:', error);
  }
}

async function processDocumentRejected(data) {
  console.log('Processando documento rejeitado:', data);
  
  try {
    // Atualizar status do contrato no banco
    const { error } = await supabase
      .from('contratos')
      .update({ 
        status: 'rejeitado',
        data_rejeicao: new Date().toISOString(),
        webhook_data: data
      })
      .eq('zapsign_document_id', data.document_id);

    if (error) {
      console.error('Erro ao atualizar contrato:', error);
    } else {
      console.log('Contrato rejeitado atualizado');
    }
  } catch (error) {
    console.error('Erro ao processar documento rejeitado:', error);
  }
}