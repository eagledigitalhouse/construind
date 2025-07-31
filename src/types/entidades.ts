// Tipos para o sistema de Entidades (CRM)

// Tipos básicos
export type TipoEntidade = 'pessoa_fisica' | 'pessoa_juridica';
export type StatusEntidade = 'ativo' | 'inativo' | 'arquivado' | 'bloqueado';
export type PrioridadeEntidade = 'baixa' | 'normal' | 'alta' | 'critica';

// Categorias principais
export type CategoriaEntidade = 
  | 'fornecedores'
  | 'patrocinadores'
  | 'parceiros'
  | 'clientes'
  | 'expositores'
  | 'prestadores_servico'
  | 'midia'
  | 'governo'
  | 'outros';

// Dados específicos para Pessoa Física
export interface DadosPessoaFisica {
  cpf?: string;
  rg?: {
    numero: string;
    orgao_emissor: string;
  };
  data_nascimento?: string;
  estado_civil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  profissao?: string;
  cargo?: string;
  nacionalidade?: string;
}

// Dados específicos para Pessoa Jurídica
export interface DadosPessoaJuridica {
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  tipo_empresa?: 'MEI' | 'LTDA' | 'SA' | 'EIRELI' | 'EI' | 'Cooperativa' | 'Outros';
  porte_empresa?: 'micro' | 'pequena' | 'media' | 'grande';
  ramo_atividade?: string;
  data_fundacao?: string;
  capital_social?: number;
}

// Estrutura de contatos
export interface Contatos {
  email_principal?: string;
  email_secundario?: string;
  email_financeiro?: string;
  email_comercial?: string;
  telefone_celular?: string;
  telefone_fixo?: string;
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  site_pessoal?: string;
  site_oficial?: string;
}

// Estrutura de endereços
export interface Endereco {
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
}

export interface Enderecos {
  residencial?: Endereco;
  comercial?: Endereco;
  correspondencia?: Endereco;
  entrega?: Endereco;
}

// Dados financeiros
export interface DadosFinanceiros {
  banco?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: 'corrente' | 'poupanca' | 'salario';
  pix?: string;
  condicoes_pagamento?: string;
  limite_credito?: number;
}

// Pessoa de contato (para empresas)
export interface PessoaContato {
  id?: string;
  nome: string;
  cargo?: string;
  departamento?: string;
  email_pessoal?: string;
  telefone_direto?: string;
  whatsapp?: string;
  responsabilidades?: string;
  observacoes?: string;
}

// Interface principal da Entidade
export interface Entidade {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Campos básicos obrigatórios
  nome: string;
  tipo: TipoEntidade;
  categoria: CategoriaEntidade;
  status: StatusEntidade;
  
  // Dados específicos por tipo
  dados_pessoa_fisica?: DadosPessoaFisica;
  dados_pessoa_juridica?: DadosPessoaJuridica;
  
  // Informações de contato e localização
  contatos?: Contatos;
  enderecos?: Enderecos;
  
  // Informações financeiras
  dados_financeiros?: DadosFinanceiros;
  
  // Categorização e organização
  tags?: string[];
  subcategoria?: string;
  
  // Observações
  observacoes?: string;
  notas_internas?: string;
  
  // Relacionamentos
  empresa_vinculada?: string;
  pessoas_contato?: string[];
  
  // Metadados
  origem?: string;
  prioridade: PrioridadeEntidade;
  ultimo_contato?: string;
  proximo_contato?: string;
  
  // Imagem
  imagem_url?: string;
  
  // Auditoria
  criado_por?: string;
  atualizado_por?: string;
}

// Histórico de interações
export interface EntidadeHistorico {
  id: string;
  entidade_id: string;
  created_at: string;
  
  tipo_interacao: string;
  titulo: string;
  descricao?: string;
  
  dados_interacao?: Record<string, any>;
  
  evento_relacionado?: string;
  contrato_relacionado?: string;
  
  criado_por?: string;
  anexos?: string[];
}

// Documentos/Anexos
export interface EntidadeDocumento {
  id: string;
  entidade_id: string;
  created_at: string;
  
  nome_arquivo: string;
  tipo_documento: string;
  url_arquivo: string;
  tamanho_arquivo?: number;
  tipo_mime?: string;
  
  descricao?: string;
  tags?: string[];
  criado_por?: string;
}

// Lembretes e Tarefas
export type StatusLembrete = 'pendente' | 'concluido' | 'cancelado';
export type PrioridadeLembrete = 'baixa' | 'normal' | 'alta' | 'urgente';

export interface EntidadeLembrete {
  id: string;
  entidade_id: string;
  created_at: string;
  
  titulo: string;
  descricao?: string;
  data_lembrete: string;
  tipo_lembrete: string;
  
  status: StatusLembrete;
  prioridade: PrioridadeLembrete;
  
  criado_por?: string;
  concluido_por?: string;
  concluido_em?: string;
}

// Formulário de criação/edição
export interface EntidadeFormData {
  // Dados básicos
  nome: string;
  tipo: TipoEntidade;
  categoria: CategoriaEntidade;
  subcategoria?: string;
  status?: StatusEntidade;
  prioridade?: PrioridadeEntidade;
  
  // Dados específicos
  dados_pessoa_fisica?: Partial<DadosPessoaFisica>;
  dados_pessoa_juridica?: Partial<DadosPessoaJuridica>;
  
  // Contatos e endereços
  contatos?: Partial<Contatos>;
  enderecos?: Partial<Enderecos>;
  
  // Financeiro
  dados_financeiros?: Partial<DadosFinanceiros>;
  
  // Organização
  tags?: string[];
  observacoes?: string;
  notas_internas?: string;
  
  // Relacionamentos
  empresa_vinculada?: string;
  
  // Imagem
  imagem_url?: string;
  
  // Datas importantes
  proximo_contato?: string;
}

// Filtros para busca
export interface FiltrosEntidades {
  tipo?: TipoEntidade[];
  categoria?: CategoriaEntidade[];
  status?: StatusEntidade[];
  tags?: string[];
  cidade?: string;
  estado?: string;
  data_cadastro_inicio?: string;
  data_cadastro_fim?: string;
  busca_texto?: string;
}

// Opções de visualização
export type ModoVisualizacao = 'cards' | 'lista' | 'tabela';

// Estatísticas
export interface EstatisticasEntidades {
  total: number;
  por_tipo: Record<TipoEntidade, number>;
  por_categoria: Record<CategoriaEntidade, number>;
  por_status: Record<StatusEntidade, number>;
  crescimento_mensal: Array<{
    mes: string;
    quantidade: number;
  }>;
  distribuicao_geografica: Array<{
    estado: string;
    quantidade: number;
  }>;
}

// Resultado de busca
export interface ResultadoBuscaEntidades {
  entidades: Entidade[];
  total: number;
  pagina: number;
  total_paginas: number;
  estatisticas?: EstatisticasEntidades;
}