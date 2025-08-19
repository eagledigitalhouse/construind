import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Patrocinador {
  id: string
  nome: string
  logo: string
  website: string
  categoria: string | null // Campo legado, pode ser null
  categoria_id: string // ID da categoria de patrocínio
  tamanho_logo: 'grande' | 'medio' | 'pequeno'
  posicao: number // Posição para ordenação (obrigatório)
  descricao: string
  created_at: string
  updated_at: string
}

export interface Expositor {
  id: string
  nome: string
  logo: string
  localizacao: string
  categoria: string
  descricao: string
  cor_primaria: string
  cor_secundaria: string
  website: string | null
  telefone: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  nome: string
  cor: string
  icone: string
  tipo: 'patrocinador' | 'expositor'
  ordem: number // Ordem de exibição das categorias
  created_at: string
  updated_at: string | null
}

export interface Newsletter {
  id: string
  email: string
  nome?: string | null
  status: 'ativo' | 'inativo' | 'cancelado'
  origem?: string | null
  created_at: string
  updated_at: string | null
}

export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  full_name?: string | null
  avatar_url?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Função para verificar se o usuário é admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', userId)
      .single()
    
    if (error || !data) return false
    
    return data.is_active && ['admin', 'super_admin'].includes(data.role)
  } catch {
    return false
  }
}

// Função para obter o perfil do usuário atual
export const getCurrentUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error || !data) return null
    
    return data as UserProfile
  } catch {
    return null
  }
}



export interface PreInscricaoExpositor {
  id: string
  
  // Tipo de Pessoa
  tipo_pessoa: 'fisica' | 'juridica'
  
  // Pessoa Física
  nome_pf?: string | null
  sobrenome_pf?: string | null
  cpf?: string | null
  email_pf?: string | null
  telefone_pf?: string | null
  cep_pf?: string | null
  logradouro_pf?: string | null
  numero_pf?: string | null
  complemento_pf?: string | null
  bairro_pf?: string | null
  cidade_pf?: string | null
  estado_pf?: string | null
  
  // Pessoa Jurídica
  razao_social?: string | null
  nome_social?: string | null
  cnpj?: string | null
  cep?: string | null
  logradouro?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  telefone_empresa?: string | null
  email_empresa?: string | null
  
  // Responsável Legal
  nome_responsavel: string
  sobrenome_responsavel: string
  email_responsavel?: string | null
  contato_responsavel: string
  is_whatsapp: boolean
  
  // Responsável pelo Stand
  nome_responsavel_stand: string
  sobrenome_responsavel_stand: string
  email_responsavel_stand: string
  
  // Serviços
  numero_stand?: string | null
  deseja_patrocinio: boolean
  categoria_patrocinio?: string | null
  condicao_pagamento: string
  forma_pagamento: string
  
  // Informações Adicionais
  observacoes?: string | null
  
  // Dados de controle
  ip_address?: string | null
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'contrato_enviado' | 'contrato_assinado'
  is_temporary: boolean
  
  created_at: string
  updated_at: string
}

// Interfaces para stands e categorias
export interface StandConstruind {
  id: string
  numero_stand: string
  categoria?: string | null
  preco?: number | null
  status: 'disponivel' | 'reservado' | 'ocupado' | 'manutencao'
  reservado_por?: string | null
  data_reserva?: string | null
  observacoes?: string | null
  posicao_x?: number | null
  posicao_y?: number | null
  largura?: number | null
  altura?: number | null
  cor: string
  created_at: string
  updated_at: string
}

export interface CategoriaStand {
  id: string
  nome: string
  cor: string
  preco_base?: number | null
  descricao?: string | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

// Database type definitions
// Interfaces para configuração do formulário
export interface FormConfig {
  id: string
  name: string
  config: Json
  created_at: string
  updated_at: string
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: Categoria
        Insert: Omit<Categoria, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Categoria, 'id' | 'created_at'>>
        Relationships: []
      }

      pre_inscricao_expositores: {
        Row: PreInscricaoExpositor
        Insert: Omit<PreInscricaoExpositor, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          status?: PreInscricaoExpositor['status']
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<PreInscricaoExpositor, 'id'>>
        Relationships: [
          {
            foreignKeyName: "pre_inscricao_expositores_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }
      expositores: {
        Row: Expositor
        Insert: Omit<Expositor, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Expositor, 'id'>>
        Relationships: []
      }
      patrocinadores: {
        Row: Patrocinador
        Insert: Omit<Patrocinador, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Patrocinador, 'id'>>
        Relationships: []
      }
      newsletters: {
        Row: Newsletter
        Insert: Omit<Newsletter, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Newsletter, 'id'>>
        Relationships: []
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<UserProfile, 'id'>>
        Relationships: []
      }
      form_configs: {
        Row: FormConfig
        Insert: Omit<FormConfig, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<FormConfig, 'id'>>
        Relationships: []
      }
      stands_construind: {
        Row: StandConstruind
        Insert: Omit<StandConstruind, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<StandConstruind, 'id'>>
        Relationships: []
      }
      categorias_stands: {
        Row: CategoriaStand
        Insert: Omit<CategoriaStand, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<CategoriaStand, 'id'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Funções para gerenciar configurações do formulário
export const salvarConfiguracaoFormulario = async (nome: string, configuracao: any) => {
  try {
    const { data, error } = await supabase
      .from('form_configs')
      .insert({
        name: nome,
        config: configuracao
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar configuração:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro ao salvar configuração do formulário:', error)
    throw error
  }
}

export const carregarConfiguracaoFormulario = async (id?: string) => {
  try {
    let query = supabase.from('form_configs').select('*')
    
    if (id) {
      query = query.eq('id', id)
      const { data, error } = await query.single()
      
      if (error) {
        console.error('Erro ao carregar configuração:', error)
        throw error
      }
      
      return data
    } else {
      // Retorna a configuração mais recente se não especificar ID
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) {
        console.error('Erro ao carregar configuração:', error)
        throw error
      }
      
      return data
    }
  } catch (error) {
    console.error('Erro ao carregar configuração do formulário:', error)
    throw error
  }
}

export const listarConfiguracoesFormulario = async () => {
  try {
    const { data, error } = await supabase
      .from('form_configs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao listar configurações:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro ao listar configurações do formulário:', error)
    throw error
  }
}

export const atualizarConfiguracaoFormulario = async (id: string, configuracao: any) => {
  try {
    const { data, error } = await supabase
      .from('form_configs')
      .update({
        config: configuracao,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar configuração:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro ao atualizar configuração do formulário:', error)
    throw error
  }
}