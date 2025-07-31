import { supabase } from './supabase';
import { ZapSignWebhookData } from './zapsign';
import { mapZapSignStatusToLocal } from './zapsign';

/**
 * Processa os webhooks recebidos do ZapSign
 * Atualiza o status do contrato no banco de dados com base no evento recebido
 * 
 * @param webhookData Dados do webhook recebido do ZapSign
 */
export const processarWebhookZapSign = async (webhookData: ZapSignWebhookData): Promise<void> => {
  try {
    const { event } = webhookData;
    const { document } = event.data;
    
    // Buscar contrato pelo document key (token)
    const { data: contrato, error } = await supabase
      .from('contratos_gerados')
      .select('*')
      .eq('zapsign_document_key', document.token)
      .single();

    if (error || !contrato) {
      console.error('Contrato não encontrado para document key:', document.token);
      return;
    }

    let novoStatus: string = contrato.status;
    let observacoes = '';
    let dadosAtualizacao: any = {
      zapsign_status: document.status,
      updated_at: new Date().toISOString()
    };

    // Processar diferentes tipos de eventos
    switch (event.name) {
      case 'sign':
        // Verificar quem assinou
        const signerAssinado = document.signers.find(s => s.signed);
        if (signerAssinado) {
          if (signerAssinado.email === 'contrato@fespin.com.br') {
            // Produtora assinou
            novoStatus = 'assinado_produtor';
            dadosAtualizacao.data_assinatura_produtor = signerAssinado.signed.signed_at;
            observacoes = 'Contrato assinado pela produtora';
          } else {
            // Expositor assinou
            novoStatus = 'totalmente_assinado';
            dadosAtualizacao.data_assinatura_expositor = signerAssinado.signed.signed_at;
            observacoes = 'Contrato totalmente assinado';
          }
        }
        break;

      case 'close':
        // Documento finalizado
        novoStatus = 'totalmente_assinado';
        dadosAtualizacao.url_arquivo_final = document.downloads?.signed || document.downloads?.original;
        observacoes = 'Contrato finalizado no ZapSign';
        break;

      case 'refuse':
        // Documento recusado
        novoStatus = 'cancelado';
        const signerRecusado = document.signers.find(s => s.refused);
        observacoes = `Contrato recusado por ${signerRecusado?.email || 'usuário desconhecido'}: ${signerRecusado?.refused?.reason || 'Sem motivo especificado'}`;
        break;

      case 'cancel':
        // Documento cancelado
        novoStatus = 'cancelado';
        observacoes = 'Contrato cancelado no ZapSign';
        break;
    }

    // Atualizar status se houve mudança
    if (novoStatus !== contrato.status) {
      dadosAtualizacao.status = novoStatus;
      
      const { error: updateError } = await supabase
        .from('contratos_gerados')
        .update(dadosAtualizacao)
        .eq('id', contrato.id);

      if (updateError) {
        throw new Error('Erro ao atualizar contrato');
      }

      // Registrar no histórico
      await supabase
        .from('contratos_historico')
        .insert({
          contrato_id: contrato.id,
          acao: event.name,
          status_anterior: contrato.status,
          status_novo: novoStatus,
          observacoes
        });
    }

  } catch (error) {
    console.error('Erro ao processar webhook ZapSign:', error);
    throw error;
  }
};