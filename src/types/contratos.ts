// Tipos para o Sistema de Contratos FESPIN

export interface ModeloContrato {
  id: string;
  nome: string;
  descricao?: string;
  conteudo: string; // Conteúdo com variáveis {{VARIAVEL}}
  status: string; // 'ativo', 'inativo', 'arquivado'
  tipo: string; // 'padrao', 'premium', etc
  variaveis_disponiveis: string[]; // Lista de variáveis disponíveis
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ContratoGerado {
  id: string;
  pre_inscricao_id: string;
  modelo_contrato_id: string;
  
  // Dados do contrato
  numero_contrato: string;
  conteudo_preenchido: string;
  
  // Status do contrato
  status: 'rascunho' | 'enviado_assinatura' | 'assinado_produtora' | 'assinado_completo' | 'cancelado';
  
  // Campos específicos do ZapSign
  zapsign_document_id?: string;
  zapsign_document_key?: string;
  zapsign_url?: string;
  zapsign_status?: string;
  zapsign_template_id?: string;
  zapsign_template_name?: string;
  
  // URLs de assinatura
  url_assinatura_produtora?: string;
  url_assinatura_expositor?: string;
  
  // Dados das assinaturas
  assinado_produtora_em?: string;
  assinado_produtora_por?: string;
  assinado_expositor_em?: string;
  assinado_expositor_por?: string;
  
  // Arquivo final
  arquivo_final_url?: string;
  
  // Metadados
  dados_preenchimento: Record<string, any>;
  observacoes?: string;
  
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Dados relacionados (joins)
  modelo_contrato?: ModeloContrato;
  pre_inscricao?: any; // Dados da pré-inscrição
}

export interface ContratoHistorico {
  id: string;
  contrato_id: string;
  acao: string; // 'criado', 'enviado', 'assinado_produtora', 'assinado_expositor', 'cancelado'
  descricao?: string;
  dados_acao: Record<string, any>;
  usuario_id?: string;
  created_at: string;
}



// Tipos para o processo de geração de contrato
export interface DadosPreenchimentoContrato {
  // Dados do expositor
  NOME_EXPOSITOR: string;
  NOME_EMPRESA: string;
  DOCUMENTO_EXPOSITOR: string; // CPF ou CNPJ
  EMAIL_EXPOSITOR: string;
  TELEFONE_EXPOSITOR?: string;
  
  // Dados do stand
  NUMERO_STAND: string;
  CATEGORIA_STAND: string;
  TAMANHO_STAND: string;
  VALOR_STAND: string;
  
  // Condições comerciais
  CONDICAO_PAGAMENTO: string;
  FORMA_PAGAMENTO: string;
  DESEJA_PATROCINIO?: string;
  CATEGORIA_PATROCINIO?: string;
  
  // Responsáveis
  NOME_RESPONSAVEL: string;
  SOBRENOME_RESPONSAVEL: string;
  CONTATO_RESPONSAVEL: string;
  EMAIL_RESPONSAVEL: string;
  
  NOME_RESPONSAVEL_STAND: string;
  SOBRENOME_RESPONSAVEL_STAND: string;
  EMAIL_RESPONSAVEL_STAND: string;
  
  // Endereço
  ENDERECO_COMPLETO: string;
  
  // Outros
  OBSERVACOES?: string;
  DATA_CONTRATO: string;
  
  // Campos adicionais que podem ser necessários
  [key: string]: string | undefined;
}



// Tipos para o modal de seleção de modelo
export interface ModalSelecaoModelo {
  isOpen: boolean;
  preInscricaoId: string;
  modelos: ModeloContrato[];
  onClose: () => void;
  onSelectModelo: (modeloId: string) => void;
}

// Tipos para o status do contrato
export type StatusContrato = {
  status: ContratoGerado['status'];
  label: string;
  color: string;
  icon: string;
  description: string;
};

export const STATUS_CONTRATO_MAP: Record<ContratoGerado['status'], StatusContrato> = {
  rascunho: {
    status: 'rascunho',
    label: 'Rascunho',
    color: 'gray',
    icon: 'FileText',
    description: 'Contrato criado mas ainda não enviado'
  },
  enviado_assinatura: {
    status: 'enviado_assinatura',
    label: 'Enviado para Assinatura',
    color: 'blue',
    icon: 'Send',
    description: 'Contrato enviado para assinatura digital'
  },
  assinado_produtora: {
    status: 'assinado_produtora',
    label: 'Assinado pela Produtora',
    color: 'yellow',
    icon: 'CheckCircle',
    description: 'Produtora assinou, aguardando expositor'
  },
  assinado_completo: {
    status: 'assinado_completo',
    label: 'Assinado Completo',
    color: 'green',
    icon: 'CheckCircle2',
    description: 'Contrato totalmente assinado'
  },
  cancelado: {
    status: 'cancelado',
    label: 'Cancelado',
    color: 'red',
    icon: 'XCircle',
    description: 'Contrato cancelado'
  }
};