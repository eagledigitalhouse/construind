import { ContratoGerado } from '@/types/contratos';
import { supabase } from './supabase';
import { showToast } from './toast';
import { gerarPDFContrato } from './contratos';
import { zapSignAPI } from './zapsign';

/**
 * Função para enviar contrato para assinatura via ZapSign
 * 
 * @param contratoId ID do contrato a ser enviado para assinatura
 * @param tipoContrato Tipo do contrato (contrato_expositor ou contrato_patrocinador)
 */
export const enviarContratoParaAssinatura = async (
  contratoId: string,
  tipoContrato: 'contrato_expositor' | 'contrato_patrocinador' = 'contrato_expositor'
): Promise<void> => {
  try {
    // Buscar dados do contrato
    const { data: contrato, error } = await supabase
      .from('contratos_gerados')
      .select(`
        *,
        pre_inscricao:pre_inscricao_expositores(*)
      `)
      .eq('id', contratoId)
      .single();

    if (error || !contrato) {
      throw new Error('Contrato não encontrado');
    }

    // Verificar se o contrato já tem um PDF gerado
    if (!contrato.conteudo_preenchido) {
      throw new Error('Contrato não tem conteúdo preenchido');
    }

    // Extrair dados do expositor da pré-inscrição
    const preInscricao = contrato.pre_inscricao;
    if (!preInscricao) {
      throw new Error('Dados da pré-inscrição não encontrados');
    }

    // Determinar email e nome do expositor
    const emailExpositor = preInscricao.tipo_pessoa === 'juridica'
      ? preInscricao.email_empresa || preInscricao.email_responsavel
      : preInscricao.email_pf || preInscricao.email_responsavel;

    const nomeExpositor = preInscricao.tipo_pessoa === 'juridica'
      ? preInscricao.razao_social || preInscricao.nome_social
      : `${preInscricao.nome_pf || ''} ${preInscricao.sobrenome_pf || ''}`.trim();

    if (!emailExpositor || !nomeExpositor) {
      throw new Error('Dados de email ou nome do expositor não encontrados');
    }

    // Gerar PDF do contrato (não usado pelo ZapSign, mas mantido para compatibilidade)
    const pdfBlob = gerarPDFContrato(contrato.conteudo_preenchido, contrato.numero_contrato);

    // Verificar se já existe um documento no ZapSign
    if (contrato.zapsign_document_id) {
      throw new Error('Este contrato já foi enviado para o ZapSign');
    }
    
    // Verificar se existe um template configurado para o tipo de contrato
    const { data: templates, error: templatesError } = await supabase
      .from('zapsign_templates')
      .select('*')
      .eq('tipo', tipoContrato)
      .eq('ativo', true)
      .limit(1);
      
    if (templatesError || !templates || templates.length === 0) {
      throw new Error(`Não foi encontrado um template ativo para o tipo de contrato: ${tipoContrato}`);
    }
    
    const template = templates[0];
    
    // Mapear dados para o ZapSign
    const dadosZapSign = {
      template_id: template.template_id,
      signer_name: nomeExpositor,
      signer_email: emailExpositor,
      data: Object.entries(contrato.dados_preenchimento || {}).map(([de, para]) => ({
        de: `{{${de}}}`,
        para: para as string
      })),
      send_automatic_email: true,
      send_automatic_whatsapp: false
    };
    
    // Criar documento no ZapSign
    const zapSignDocument = await zapSignAPI.createDocumentFromTemplate(dadosZapSign);
    
    // Atualizar contrato no banco
    const { error: updateError } = await supabase
      .from('contratos_gerados')
      .update({
        status: 'enviado_assinatura',
        zapsign_document_id: zapSignDocument.open_id?.toString(),
        zapsign_document_key: zapSignDocument.token,
        zapsign_url: zapSignDocument.signers?.[0]?.sign_url,
        zapsign_status: zapSignDocument.status,
        zapsign_template_id: template.template_id,
        zapsign_template_name: template.nome,
        updated_at: new Date().toISOString()
      })
      .eq('id', contratoId);

    if (updateError) {
      throw new Error('Erro ao atualizar status do contrato');
    }

    // Registrar no histórico
    await supabase
      .from('contratos_historico')
      .insert({
        contrato_id: contratoId,
        acao: 'enviado_assinatura',
        status_anterior: contrato.status,
        status_novo: 'enviado_assinatura',
        observacoes: `Documento enviado para ZapSign. ID: ${zapSignDocument.open_id}`
      });

  } catch (error) {
    console.error('Erro ao enviar contrato para assinatura:', error);
    throw error;
  }
};

/**
 * Função para cancelar um contrato no ZapSign
 * 
 * @param contratoId ID do contrato a ser cancelado
 */
export const cancelarContrato = async (contratoId: string): Promise<void> => {
  try {
    // Buscar contrato no banco
    const { data: contrato, error } = await supabase
      .from('contratos_gerados')
      .select('*')
      .eq('id', contratoId)
      .single();

    if (error || !contrato) {
      throw new Error('Contrato não encontrado');
    }

    // Verificar se o contrato foi enviado para o ZapSign
    if (!contrato.zapsign_document_id) {
      throw new Error('Este contrato não foi enviado para o ZapSign');
    }

    // Cancelar documento no ZapSign
    await zapSignAPI.cancelDocument(contrato.zapsign_document_id);

    // Atualizar status no banco
    const { error: updateError } = await supabase
      .from('contratos_gerados')
      .update({
        status: 'cancelado',
        zapsign_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', contratoId);

    if (updateError) {
      throw new Error('Erro ao atualizar status do contrato');
    }

    // Registrar no histórico
    await supabase
      .from('contratos_historico')
      .insert({
        contrato_id: contratoId,
        acao: 'cancelado',
        status_anterior: contrato.status,
        status_novo: 'cancelado',
        observacoes: 'Contrato cancelado no ZapSign'
      });

  } catch (error) {
    console.error('Erro ao cancelar contrato:', error);
    throw error;
  }
};

/**
 * Função para verificar o status de contratos pendentes
 * Busca todos os contratos com status 'enviado_assinatura' e atualiza o status com base no ZapSign
 */
export const verificarStatusContratosPendentes = async (): Promise<void> => {
  try {
    // Buscar contratos pendentes
    const { data: contratos, error } = await supabase
      .from('contratos_gerados')
      .select('*')
      .eq('status', 'enviado_assinatura')
      .not('zapsign_document_id', 'is', null);

    if (error) {
      throw error;
    }

    if (!contratos || contratos.length === 0) {
      console.log('Nenhum contrato pendente encontrado');
      return;
    }

    console.log(`Verificando status de ${contratos.length} contratos pendentes`);

    // Atualizar status de cada contrato
    for (const contrato of contratos) {
      try {
        await sincronizarStatusZapSign(contrato.id);
        console.log(`Status do contrato ${contrato.id} atualizado com sucesso`);
      } catch (err) {
        console.error(`Erro ao atualizar status do contrato ${contrato.id}:`, err);
      }
    }
  } catch (error) {
    console.error('Erro ao verificar status de contratos pendentes:', error);
    throw error;
  }
};

/**
 * Função para sincronizar o status de um contrato com o ZapSign
 * Importada de contratos.ts para centralizar as funções de assinatura
 * 
 * @param contratoId ID do contrato a ser sincronizado
 */
export const sincronizarStatusZapSign = async (contratoId: string): Promise<ContratoGerado> => {
  try {
    // 1. Buscar contrato no banco
    const { data: contrato, error: contratoError } = await supabase
      .from('contratos_gerados')
      .select('*')
      .eq('id', contratoId)
      .single();

    if (contratoError || !contrato) {
      throw new Error('Contrato não encontrado');
    }

    if (!contrato.zapsign_document_id) {
      throw new Error('Contrato não foi criado via ZapSign');
    }

    // 2. Consultar status no ZapSign
    const zapSignStatus = await zapSignAPI.getDocumentStatus(contrato.zapsign_document_id);
    
    // 3. Mapear status do ZapSign para status local
    const statusLocal = mapZapSignStatusToLocal(zapSignStatus.status) as ContratoGerado['status'];
    
    // 4. Atualizar apenas se o status mudou
    if (contrato.status !== statusLocal || contrato.zapsign_status !== zapSignStatus.status) {
      const { data: contratoAtualizado, error: updateError } = await supabase
        .from('contratos_gerados')
        .update({
          status: statusLocal,
          zapsign_status: zapSignStatus.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', contratoId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // 5. Registrar mudança no histórico
      const getStatusLabel = (status: string): string => {
        switch (status) {
          case 'signed':
            return 'Assinado';
          case 'pending':
            return 'Aguardando Assinatura';
          case 'cancelled':
            return 'Cancelado';
          default:
            return 'Rascunho';
        }
      };
      
      await supabase
        .from('contratos_historico')
        .insert({
          contrato_id: contratoId,
          acao: 'status_atualizado',
          status_anterior: contrato.status,
          status_novo: statusLocal,
          observacoes: `Status sincronizado com ZapSign: ${getStatusLabel(zapSignStatus.status)}`
        });

      return contratoAtualizado;
    }

    return contrato;
  } catch (error) {
    console.error('Erro ao sincronizar status ZapSign:', error);
    throw error;
  }
};

/**
 * Função para baixar arquivo assinado do ZapSign
 * Importada de contratos.ts para centralizar as funções de assinatura
 * 
 * @param contratoId ID do contrato para baixar o arquivo assinado
 */
export const baixarArquivoAssinadoZapSign = async (contratoId: string): Promise<Blob> => {
  try {
    // 1. Buscar contrato no banco
    const { data: contrato, error: contratoError } = await supabase
      .from('contratos_gerados')
      .select('*')
      .eq('id', contratoId)
      .single();

    if (contratoError || !contrato) {
      throw new Error('Contrato não encontrado');
    }

    if (!contrato.zapsign_document_id) {
      throw new Error('Contrato não foi criado via ZapSign');
    }

    // 2. Verificar se o documento está assinado
    const status = await zapSignAPI.getDocumentStatus(contrato.zapsign_document_id);
    if (status.status !== 'signed') {
      throw new Error('Documento ainda não foi assinado');
    }

    // 3. Baixar arquivo do ZapSign
    const arquivo = await zapSignAPI.downloadSignedFile(contrato.zapsign_document_id);
    
    return arquivo;
  } catch (error) {
    console.error('Erro ao baixar arquivo assinado:', error);
    throw error;
  }
};

// Reexportar funções e tipos do ZapSign para manter compatibilidade
export { mapZapSignStatusToLocal } from './zapsign';