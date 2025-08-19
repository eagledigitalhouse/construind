// Tipos relacionados à pré-inscrição de expositores

export interface PreInscricaoExpositor {
  id: string;
  nome_empresa: string;
  cnpj?: string | null;
  nome_fantasia?: string | null;
  razao_social?: string | null;
  inscricao_estadual?: string | null;
  endereco_empresa?: string | null;
  numero_empresa?: string | null;
  complemento_empresa?: string | null;
  bairro_empresa?: string | null;
  cidade_empresa?: string | null;
  estado_empresa?: string | null;
  cep_empresa?: string | null;
  telefone_empresa?: string | null;
  email_empresa: string;
  nome_responsavel: string;
  sobrenome_responsavel?: string | null;
  email_responsavel?: string | null;
  contato_responsavel?: string | null;
  isWhatsApp?: boolean;
  nome_responsavel_stand?: string | null;
  sobrenome_responsavel_stand?: string | null;
  email_responsavel_stand?: string | null;
  telefone_responsavel_stand?: string | null;
  area_stand_id?: string | null;
  servicos_necessarios?: string[] | null;
  informacoes_adicionais?: string | null;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'contrato_enviado' | 'contrato_assinado' | 'stand_reservado';
  observacoes_admin?: string | null;
  created_at: string;
  updated_at: string;
  // Campos para patrocínio
  interesse_patrocinio?: boolean;
  tipo_patrocinio?: 'master' | 'diamante' | 'ouro' | 'telao_led' | null;
  // Campos para pagamento
  condicao_pagamento?: string | null;
  forma_pagamento?: 'pix' | 'boleto' | null;
  valor_total?: number | null;
  // Relacionamentos (se necessário, adicione IDs de outras tabelas)
  // categoria_id: string; // Exemplo: se houver uma tabela de categorias de expositores
}

export type FormFieldType = 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'date' | 'cnpj' | 'cep' | 'currency';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: { label: string; value: string | number | boolean }[]; // For select, radio, checkbox
  // Adicionar validações ou outras propriedades específicas de campo
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  sections: FormSection[];
  created_at?: string;
  updated_at?: string;
}