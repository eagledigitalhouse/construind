// Interface para os dados de pré-inscrição de expositores
export interface PreInscricaoExpositor {
  id: string;
  
  // Tipo de Pessoa
  tipo_pessoa: 'fisica' | 'juridica';
  
  // Pessoa Física
  nome_pf?: string;
  sobrenome_pf?: string;
  cpf?: string;
  email_pf?: string;
  telefone_pf?: string;
  cep_pf?: string;
  logradouro_pf?: string;
  numero_pf?: string;
  complemento_pf?: string;
  bairro_pf?: string;
  cidade_pf?: string;
  estado_pf?: string;
  
  // Pessoa Jurídica
  razao_social?: string;
  nome_social?: string;
  cnpj?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  telefone_empresa?: string;
  email_empresa?: string;

  
  // Responsável Legal
  nome_responsavel: string;
  sobrenome_responsavel: string;
  email_responsavel?: string;
  contato_responsavel: string;
  is_whatsapp: 'sim' | 'nao';
  
  // Responsável pelo Stand
  nome_responsavel_stand: string;
  sobrenome_responsavel_stand: string;
  email_responsavel_stand: string;
  
  // Serviços
  numero_stand: string;
  deseja_patrocinio: 'sim' | 'nao';
  categoria_patrocinio?: string;
  condicao_pagamento: string;
  forma_pagamento: string;
  
  // Informações Adicionais
  observacoes?: string;
  
  // Dados de controle
  status: 'pendente' | 'aprovado' | 'rejeitado';
  ip_address?: string;
  created_at: string;
  updated_at: string;
}