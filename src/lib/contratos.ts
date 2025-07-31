import { supabase } from './supabase';
import { 
  ModeloContrato, 
  ContratoGerado, 
  DadosPreenchimentoContrato,
  ContratoHistorico 
} from '@/types/contratos';
// Import PreInscricaoExpositor type from local types file
import type { PreInscricaoExpositor } from '@/types/supabase';
import { zapSignAPI, CreateDocumentFromTemplateRequest, mapZapSignStatusToLocal } from './zapsign';
import jsPDF from 'jspdf';
import 'jspdf/dist/jspdf.es.min.js';

// Funções para converter códigos em texto legível
const getTextoLegivel = {
  condicaoPagamento: (valor: string): string => {
    const opcoes: Record<string, string> = {
      'a_vista_desconto': 'À vista com desconto',
      'sinal_3_parcelas': 'Sinal + 3 parcelas',
      'sinal_saldo': 'Sinal + saldo'
    };
    return opcoes[valor] || valor;
  },
  
  formaPagamento: (valor: string): string => {
    const opcoes: Record<string, string> = {
      'dinheiro': 'Dinheiro',
      'pix': 'PIX',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'transferencia': 'Transferência Bancária',
      'boleto': 'Boleto Bancário'
    };
    return opcoes[valor] || valor;
  },
  
  categoriaPatrocinio: (valor: string): string => {
    const opcoes: Record<string, string> = {
      'ouro': 'Ouro',
      'prata': 'Prata',
      'bronze': 'Bronze',
      'apoio': 'Apoio'
    };
    return opcoes[valor] || valor;
  },
  
  desejaPatrocinio: (valor: string): string => {
    return valor === 'sim' ? 'Sim' : 'Não';
  }
};



// Função para buscar contratos gerados
export const buscarContratosGerados = async (): Promise<ContratoGerado[]> => {
  try {
    const { data, error } = await supabase
      .from('contratos_gerados')
      .select(`
        id,
        numero_contrato,
        pre_inscricao_id,
        modelo_contrato_id,
        conteudo_preenchido,
        status,
        dados_preenchimento,
        created_at,
        updated_at,
        modelo_contrato:modelos_contratos(
          id,
          nome,
          descricao,
          tipo
        ),
        pre_inscricao:pre_inscricao_expositores(
          id,
          tipo_pessoa,
          razao_social,
          nome_social,
          nome_pf,
          sobrenome_pf,
          cnpj,
          cpf,
          email_empresa,
          email_pf,
          telefone_empresa,
          telefone_pf
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar contratos gerados:', error);
      throw error;
    }

    // Transform the data to match ContratoGerado interface
    const transformedData = (data || []).map((item: any) => ({
      ...item,
      modelo_contrato: Array.isArray(item.modelo_contrato) ? item.modelo_contrato[0] : item.modelo_contrato,
      pre_inscricao: Array.isArray(item.pre_inscricao) ? item.pre_inscricao[0] : item.pre_inscricao
    }));

    return transformedData as ContratoGerado[];
  } catch (error) {
    console.error('Erro ao buscar contratos gerados:', error);
    throw error;
  }
};

// Função para extrair dados da pré-inscrição e transformar em dados de preenchimento
export const extrairDadosPreInscricao = (preInscricao: any): DadosPreenchimentoContrato => {
  // Determinar nome do expositor
  const nomeExpositor = preInscricao.tipo_pessoa === 'juridica'
    ? preInscricao.razao_social || preInscricao.nome_social || 'Empresa'
    : `${preInscricao.nome_pf || ''} ${preInscricao.sobrenome_pf || ''}`.trim();

  // Determinar documento (CPF ou CNPJ)
  const documento = preInscricao.tipo_pessoa === 'juridica'
    ? preInscricao.cnpj || ''
    : preInscricao.cpf || '';

  // Determinar email
  const email = preInscricao.tipo_pessoa === 'juridica'
    ? preInscricao.email_empresa || preInscricao.email_responsavel || ''
    : preInscricao.email_pf || preInscricao.email_responsavel || '';

  // Determinar telefone
  const telefone = preInscricao.tipo_pessoa === 'juridica'
    ? preInscricao.telefone_empresa || preInscricao.contato_responsavel || ''
    : preInscricao.telefone_pf || preInscricao.contato_responsavel || '';

  // Montar endereço completo
  const endereco = preInscricao.tipo_pessoa === 'juridica'
    ? `${preInscricao.logradouro || ''}, ${preInscricao.numero || ''} ${preInscricao.complemento || ''} - ${preInscricao.bairro || ''} - ${preInscricao.cidade || ''}/${preInscricao.estado || ''} - CEP: ${preInscricao.cep || ''}`
    : `${preInscricao.logradouro_pf || ''}, ${preInscricao.numero_pf || ''} ${preInscricao.complemento_pf || ''} - ${preInscricao.bairro_pf || ''} - ${preInscricao.cidade_pf || ''}/${preInscricao.estado_pf || ''} - CEP: ${preInscricao.cep_pf || ''}`;

  return {
    // Dados do expositor
    NOME_EXPOSITOR: nomeExpositor,
    NOME_EMPRESA: preInscricao.tipo_pessoa === 'juridica' ? (preInscricao.razao_social || preInscricao.nome_social || 'Empresa') : nomeExpositor,
    DOCUMENTO_EXPOSITOR: documento,
    EMAIL_EXPOSITOR: email,
    TELEFONE_EXPOSITOR: telefone,
    
    // Dados do stand (valores padrão - podem ser customizados)
    NUMERO_STAND: preInscricao.numero_stand || '',
    CATEGORIA_STAND: 'Exposição Padrão', // Pode ser obtido de uma tabela de stands
    TAMANHO_STAND: '3x3m', // Valor padrão
    VALOR_STAND: 'R$ 3.300,00', // Valor padrão
    
    // Condições comerciais
    CONDICAO_PAGAMENTO: getTextoLegivel.condicaoPagamento(preInscricao.condicao_pagamento || ''),
    FORMA_PAGAMENTO: getTextoLegivel.formaPagamento(preInscricao.forma_pagamento || ''),
    DESEJA_PATROCINIO: getTextoLegivel.desejaPatrocinio(preInscricao.deseja_patrocinio || ''),
    CATEGORIA_PATROCINIO: preInscricao.categoria_patrocinio ? getTextoLegivel.categoriaPatrocinio(preInscricao.categoria_patrocinio) : 'Não se aplica',
    
    // Responsáveis
    NOME_RESPONSAVEL: preInscricao.nome_responsavel || '',
    SOBRENOME_RESPONSAVEL: preInscricao.sobrenome_responsavel || '',
    CONTATO_RESPONSAVEL: preInscricao.contato_responsavel || '',
    EMAIL_RESPONSAVEL: preInscricao.email_responsavel || '',
    
    NOME_RESPONSAVEL_STAND: preInscricao.nome_responsavel_stand || '',
    SOBRENOME_RESPONSAVEL_STAND: preInscricao.sobrenome_responsavel_stand || '',
    EMAIL_RESPONSAVEL_STAND: preInscricao.email_responsavel_stand || '',
    
    // Endereço
    ENDERECO_COMPLETO: endereco.trim(),
    
    // Outros
    OBSERVACOES: preInscricao.observacoes || 'Nenhuma observação adicional',
    DATA_CONTRATO: new Date().toLocaleDateString('pt-BR')
  };
};

// Função para preencher variáveis no conteúdo do contrato
export const preencherVariaveisContrato = (
  conteudoModelo: string, 
  dados: DadosPreenchimentoContrato | Record<string, string>
): string => {
  try {
    if (!conteudoModelo || typeof conteudoModelo !== 'string') {
      return '';
    }
    
    if (!dados || typeof dados !== 'object') {
      return conteudoModelo;
    }
    
    let conteudoPreenchido = conteudoModelo;
    
    // Substituir cada variável pelos dados correspondentes
    Object.entries(dados).forEach(([chave, valor]) => {
      try {
        const regex = new RegExp(`{{${chave}}}`, 'g');
        const valorSeguro = valor ? String(valor) : '';
        conteudoPreenchido = conteudoPreenchido.replace(regex, valorSeguro);
      } catch (error) {
        console.warn(`Erro ao substituir variável ${chave}:`, error);
      }
    });
    
    // Remover variáveis não preenchidas (opcional)
    conteudoPreenchido = conteudoPreenchido.replace(/{{[^}]+}}/g, '[NÃO INFORMADO]');
    
    return conteudoPreenchido;
  } catch (error) {
    console.error('Erro ao preencher variáveis do contrato:', error);
    return conteudoModelo || '';
  }
};

// Função para gerar PDF do contrato
export const gerarPDFContrato = (conteudoContrato: string, numeroContrato: string): Blob => {
  const doc = new jsPDF();
  
  // Configurações do PDF
  const margemEsquerda = 20;
  const margemTopo = 20;
  const larguraPagina = doc.internal.pageSize.getWidth() - (margemEsquerda * 2);
  const alturaLinha = 7;
  
  // Título
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE PARTICIPAÇÃO - FESPIN 2025', margemEsquerda, margemTopo);
  
  // Número do contrato
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Contrato Nº: ${numeroContrato}`, margemEsquerda, margemTopo + 10);
  
  // Linha separadora
  doc.line(margemEsquerda, margemTopo + 15, margemEsquerda + larguraPagina, margemTopo + 15);
  
  // Conteúdo do contrato
  doc.setFontSize(10);
  const linhas = doc.splitTextToSize(conteudoContrato, larguraPagina);
  
  let posicaoY = margemTopo + 25;
  
  linhas.forEach((linha: string) => {
    // Verificar se precisa de nova página
    if (posicaoY > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      posicaoY = margemTopo;
    }
    
    doc.text(linha, margemEsquerda, posicaoY);
    posicaoY += alturaLinha;
  });
  
  // Rodapé
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${totalPaginas} - FESPIN 2025`,
      margemEsquerda,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  return doc.output('blob');
};

// Função para criar um novo contrato
export const criarContrato = async (
  preInscricaoId: string,
  modeloContratoId: string
): Promise<ContratoGerado> => {
  try {
    // 1. Buscar dados da pré-inscrição
    const { data: preInscricao, error: preInscricaoError } = await supabase
      .from('pre_inscricao_expositores')
      .select('*')
      .eq('id', preInscricaoId)
      .single();

    if (preInscricaoError || !preInscricao) {
      throw new Error('Pré-inscrição não encontrada');
    }

    // 2. Buscar modelo de contrato
    const { data: modelo, error: modeloError } = await supabase
      .from('modelos_contratos')
      .select('*')
      .eq('id', modeloContratoId)
      .single();

    if (modeloError || !modelo) {
      throw new Error('Modelo de contrato não encontrado');
    }

    // 3. Extrair dados e preencher contrato
    const dadosPreenchimento = extrairDadosPreInscricao(preInscricao);
    const conteudoPreenchido = preencherVariaveisContrato(modelo.conteudo, dadosPreenchimento);

    // 4. Gerar número do contrato
    const { data: numeroContrato, error: numeroError } = await supabase
      .rpc('gerar_numero_contrato');

    if (numeroError) {
      throw new Error('Erro ao gerar número do contrato');
    }

    // 5. Criar registro do contrato
    const { data: contrato, error: contratoError } = await supabase
      .from('contratos_gerados')
      .insert({
        pre_inscricao_id: preInscricaoId,
        modelo_contrato_id: modeloContratoId,
        numero_contrato: numeroContrato,
        conteudo_preenchido: conteudoPreenchido,
        status: 'rascunho',
        dados_preenchimento: dadosPreenchimento
      })
      .select()
      .single();

    if (contratoError || !contrato) {
      throw new Error('Erro ao criar contrato: ' + contratoError?.message);
    }

    // 6. Registrar no histórico
    await registrarHistoricoContrato(
      contrato.id,
      'criado',
      'Contrato criado a partir do modelo: ' + modelo.nome,
      { modelo_id: modeloContratoId, pre_inscricao_id: preInscricaoId }
    );

    return contrato;
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    throw error;
  }
};

// Função para registrar histórico do contrato
export const registrarHistoricoContrato = async (
  contratoId: string,
  acao: string,
  descricao?: string,
  dadosAcao: Record<string, any> = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contratos_historico')
      .insert({
        contrato_id: contratoId,
        acao,
        descricao,
        dados_acao: dadosAcao
      });

    if (error) {
      console.error('Erro ao registrar histórico:', error);
    }
  } catch (error) {
    console.error('Erro ao registrar histórico:', error);
  }
};

// Função para atualizar status do contrato
export const atualizarStatusContrato = async (
  contratoId: string,
  novoStatus: ContratoGerado['status'],
  dadosAdicionais: Partial<ContratoGerado> = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contratos_gerados')
      .update({
        status: novoStatus,
        ...dadosAdicionais
      })
      .eq('id', contratoId);

    if (error) {
      throw error;
    }

    // Registrar no histórico
    await registrarHistoricoContrato(
      contratoId,
      `status_alterado_${novoStatus}`,
      `Status alterado para: ${novoStatus}`,
      { status_anterior: dadosAdicionais, status_novo: novoStatus }
    );
  } catch (error) {
    console.error('Erro ao atualizar status do contrato:', error);
    throw error;
  }
};

// Função para buscar histórico de um contrato
export const buscarHistoricoContrato = async (contratoId: string): Promise<ContratoHistorico[]> => {
  try {
    const { data, error } = await supabase
      .from('contratos_historico')
      .select('*')
      .eq('contrato_id', contratoId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico do contrato:', error);
    throw error;
  }
};

// Função para verificar se já existe contrato para uma pré-inscrição
export const verificarContratoExistente = async (preInscricaoId: string): Promise<ContratoGerado | null> => {
  try {
    console.log('Verificando contrato existente para preInscricaoId:', preInscricaoId);
    
    // Primeiro, verificar se a tabela existe
    const { error: tableError } = await supabase
      .from('contratos_gerados')
      .select('count')
      .limit(1);
      
    if (tableError) {
      console.error('Erro ao verificar tabela contratos_gerados:', tableError);
      // Se a tabela não existir, retornar null em vez de lançar erro
      return null;
    }
    
    // Se a tabela existir, continuar com a consulta original
    console.log('Tabela contratos_gerados existe, consultando contratos para preInscricaoId:', preInscricaoId);
    const { data, error } = await supabase
      .from('contratos_gerados')
      .select('*')
      .eq('pre_inscricao_id', preInscricaoId)
      .neq('status', 'cancelado')
      .single();

    console.log('Resultado da consulta:', { data, error });
    
    // Verificar se o erro é de 'nenhum resultado encontrado'
    if (error) {
      console.log('Código do erro:', error.code, 'Mensagem:', error.message);
      if (error.code === 'PGRST116') { // PGRST116 = no rows returned
        console.log('Nenhum contrato encontrado para esta pré-inscrição');
        return null;
      } else {
        console.error('Erro na consulta:', error);
        throw error;
      }
    }

    console.log('Contrato encontrado:', data);
    return data || null;
  } catch (error) {
    console.error('Erro ao verificar contrato existente:', error);
    return null;
  }
};

// Função para mapear dados da pré-inscrição para variáveis do ZapSign
export const mapearDadosParaZapSign = (preInscricao: PreInscricaoExpositor): Record<string, string> => {
  // Determinar nome completo baseado no tipo de pessoa
  const nomeCompleto = preInscricao.tipo_pessoa === 'fisica' 
    ? `${preInscricao.nome_pf || ''} ${preInscricao.sobrenome_pf || ''}`.trim()
    : preInscricao.razao_social || preInscricao.nome_social || '';
  
  // Determinar email baseado no tipo de pessoa
  const email = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.email_pf || preInscricao.email_responsavel || ''
    : preInscricao.email_empresa || preInscricao.email_responsavel || '';
  
  // Determinar telefone baseado no tipo de pessoa
  const telefone = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.telefone_pf || preInscricao.contato_responsavel || ''
    : preInscricao.telefone_empresa || preInscricao.contato_responsavel || '';
  
  // Determinar endereço baseado no tipo de pessoa
  const endereco = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.logradouro_pf || ''
    : preInscricao.logradouro || '';
  
  const numero = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.numero_pf || ''
    : preInscricao.numero || '';
  
  const complemento = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.complemento_pf || ''
    : preInscricao.complemento || '';
  
  const bairro = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.bairro_pf || ''
    : preInscricao.bairro || '';
  
  const cidade = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.cidade_pf || ''
    : preInscricao.cidade || '';
  
  const estado = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.estado_pf || ''
    : preInscricao.estado || '';
  
  const cep = preInscricao.tipo_pessoa === 'fisica' 
    ? preInscricao.cep_pf || ''
    : preInscricao.cep || '';

  const dados: Record<string, string> = {
    // Dados básicos
    nome_completo: nomeCompleto,
    nome_contratante: nomeCompleto,
    email: email,
    telefone: telefone,
    celular: telefone, // Usando o mesmo campo para celular
    
    // Documento
    cpf_cnpj: preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.cpf || '') : (preInscricao.cnpj || ''),
    cpf: preInscricao.cpf || '',
    cnpj: preInscricao.cnpj || '',
    
    // Endereço
    endereco: endereco,
    numero: numero,
    complemento: complemento,
    bairro: bairro,
    cidade: cidade,
    estado: estado,
    cep: cep,
    endereco_completo: `${endereco}, ${numero} ${complemento ? '- ' + complemento : ''}, ${bairro}, ${cidade} - ${estado}, CEP: ${cep}`,
    
    // Dados da empresa (se pessoa jurídica)
    razao_social: preInscricao.razao_social || '',
    nome_fantasia: preInscricao.nome_social || '', // Usando nome_social como nome_fantasia
    inscricao_estadual: '', // Campo não existe na interface atual
    
    // Representante legal
    nome_representante: `${preInscricao.nome_responsavel || ''} ${preInscricao.sobrenome_responsavel || ''}`.trim(),
    cpf_representante: '', // Campo não existe na interface atual
    cargo_representante: '', // Campo não existe na interface atual
    
    // Dados do evento
    categoria_patrocinio: getTextoLegivel.categoriaPatrocinio(preInscricao.categoria_patrocinio || ''),
    condicao_pagamento: getTextoLegivel.condicaoPagamento(preInscricao.condicao_pagamento || ''),
    valor_patrocinio: '0', // Campo não existe na interface atual
    
    // Serviços (campos não disponíveis na interface atual)
    servico_1: '',
    servico_2: '',
    servico_3: '',
    
    // Datas
    data_atual: new Date().toLocaleDateString('pt-BR'),
    data_evento: '2024', // Ajustar conforme necessário
    
    // Outros campos que podem ser úteis
    tipo_pessoa: preInscricao.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
    observacoes: preInscricao.observacoes || ''
  };
  
  return dados;
};

// Função para criar contrato via ZapSign
export const criarContratoZapSign = async (
  preInscricaoId: string,
  templateId: string,
  templateName: string,
  mappedData?: Record<string, string>
): Promise<ContratoGerado> => {
  try {
    // 1. Buscar dados da pré-inscrição
    const { data: preInscricao, error: preInscricaoError } = await supabase
      .from('pre_inscricoes_expositores')
      .select('*')
      .eq('id', preInscricaoId)
      .single();

    if (preInscricaoError || !preInscricao) {
      throw new Error('Pré-inscrição não encontrada');
    }

    // 2. Verificar se já existe contrato para esta pré-inscrição
    const contratoExistente = await verificarContratoExistente(preInscricaoId);
    if (contratoExistente) {
      throw new Error('Já existe um contrato para esta pré-inscrição');
    }

    // 3. Mapear dados da pré-inscrição para variáveis do ZapSign
    // Usar dados mapeados fornecidos ou fazer mapeamento automático
    const dadosMapeados = mappedData || mapearDadosParaZapSign(preInscricao);
    
    console.log('criarContratoZapSign: Usando dados mapeados:', dadosMapeados);

    // 4. Preparar signatários
    const signers = [
      {
        name: preInscricao.nome_completo || '',
        email: preInscricao.email || '',
        phone: preInscricao.celular || preInscricao.telefone || '',
        role: 'signer'
      }
    ];

    // 5. Criar documento no ZapSign
    const nomeCompleto = preInscricao.tipo_pessoa === 'juridica' 
      ? preInscricao.razao_social || preInscricao.nome_social || 'Empresa'
      : `${preInscricao.nome_pf || ''} ${preInscricao.sobrenome_pf || ''}`.trim();
    
    const emailPrincipal = preInscricao.tipo_pessoa === 'juridica'
      ? preInscricao.email_empresa
      : preInscricao.email_pf;
    
    const telefonePrincipal = preInscricao.tipo_pessoa === 'juridica'
      ? preInscricao.telefone_empresa
      : preInscricao.telefone_pf;

    console.log('criarContratoZapSign: Preparando request com templateId:', templateId);
    
    const createRequest: CreateDocumentFromTemplateRequest = {
      template_id: templateId,
      signer_name: nomeCompleto,
      signer_email: emailPrincipal || '',
      signer_phone_country: '+55',
      signer_phone_number: telefonePrincipal || '',
      data: Object.entries(dadosMapeados).map(([key, value]) => ({
        de: `{{${key}}}`,
        para: value
      })),
      send_automatic_email: true,
      send_automatic_whatsapp: false
    };
    
    console.log('criarContratoZapSign: Request preparado:', createRequest);

    const zapSignDocument = await zapSignAPI.createDocumentFromTemplate(createRequest);
    console.log('criarContratoZapSign: Documento criado no ZapSign:', zapSignDocument);

    // 6. Gerar número do contrato
    const { data: numeroData, error: numeroError } = await supabase
      .rpc('gerar_numero_contrato');

    if (numeroError) {
      throw numeroError;
    }

    // 7. Criar registro do contrato no banco
    const novoContrato: Partial<ContratoGerado> = {
      numero_contrato: numeroData,
      pre_inscricao_id: preInscricaoId,
      modelo_contrato_id: null, // Não temos modelo local, é do ZapSign
      conteudo_preenchido: `Contrato gerado via ZapSign - Template: ${templateName}`,
      status: 'enviado_assinatura',
      dados_preenchimento: dadosMapeados,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Dados específicos do ZapSign
      zapsign_document_id: zapSignDocument.open_id?.toString(),
      zapsign_document_key: zapSignDocument.token,
      zapsign_url: zapSignDocument.signers?.[0]?.sign_url,
      zapsign_status: zapSignDocument.status,
      zapsign_template_id: templateId,
      zapsign_template_name: templateName
    };

    const { data: contratoData, error: contratoError } = await supabase
      .from('contratos_gerados')
      .insert(novoContrato)
      .select()
      .single();

    if (contratoError) {
      throw contratoError;
    }

    // 8. Registrar no histórico
    await registrarHistoricoContrato(
      contratoData.id,
      'criado',
      `Contrato criado via ZapSign usando template: ${templateName}`,
      { origem: 'sistema' }
    );

    return contratoData;
  } catch (error) {
    console.error('Erro ao criar contrato ZapSign:', error);
    throw error;
  }
};

// Função para sincronizar status do contrato com ZapSign
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
          data_atualizacao: new Date().toISOString()
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
      
      await registrarHistoricoContrato(
         contratoId,
         'status_atualizado',
         `Status sincronizado com ZapSign: ${getStatusLabel(zapSignStatus.status)}`,
         { status_anterior: contrato.status, status_novo: statusLocal }
       );

      return contratoAtualizado;
    }

    return contrato;
  } catch (error) {
    console.error('Erro ao sincronizar status ZapSign:', error);
    throw error;
  }
};

// Função para baixar arquivo assinado do ZapSign
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