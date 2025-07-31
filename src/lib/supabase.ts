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

// Interfaces para contratos
export interface ModeloContrato {
  id: string
  nome: string
  descricao: string | null
  conteudo: string
  status: 'ativo' | 'inativo'
  tipo: 'padrao' | 'premium'
  variaveis_disponiveis: string[]
  created_at: string
  updated_at: string
}

export interface ContratoGerado {
  id: string
  pre_inscricao_id: string
  modelo_contrato_id: string
  numero_contrato: string
  conteudo_preenchido: string
  status: 'rascunho' | 'enviado_assinatura' | 'assinado_produtor' | 'totalmente_assinado' | 'cancelado'

  url_assinatura_produtor: string | null
  url_assinatura_expositor: string | null
  data_assinatura_produtor: string | null
  data_assinatura_expositor: string | null
  url_arquivo_final: string | null
  dados_preenchimento: any
  created_at: string
  updated_at: string
}

export interface ContratoHistorico {
  id: string
  contrato_id: string
  acao: string
  status_anterior: string | null
  status_novo: string | null
  observacoes: string | null
  usuario_id: string | null
  created_at: string
}

export interface PreInscricaoExpositor {
  id: string
  nome_empresa: string
  nome_responsavel: string
  email: string
  telefone: string
  cnpj: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  categoria_id: string
  descricao_produtos: string
  area_desejada: string | null
  necessidades_especiais: string | null
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'contrato_enviado' | 'contrato_assinado'
  observacoes_admin: string | null
  created_at: string
  updated_at: string
}

// Database type definitions
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
      contratos_gerados: {
        Row: ContratoGerado
        Insert: Omit<ContratoGerado, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          status?: ContratoGerado['status']

          url_assinatura_produtor?: string | null
          url_assinatura_expositor?: string | null
          data_assinatura_produtor?: string | null
          data_assinatura_expositor?: string | null
          url_arquivo_final?: string | null
          dados_preenchimento?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ContratoGerado, 'id'>>
        Relationships: [
          {
            foreignKeyName: "contratos_gerados_modelo_contrato_id_fkey"
            columns: ["modelo_contrato_id"]
            isOneToOne: false
            referencedRelation: "modelos_contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_gerados_pre_inscricao_id_fkey"
            columns: ["pre_inscricao_id"]
            isOneToOne: false
            referencedRelation: "pre_inscricao_expositores"
            referencedColumns: ["id"]
          }
        ]
      }
      contratos_historico: {
        Row: ContratoHistorico
        Insert: Omit<ContratoHistorico, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<ContratoHistorico, 'id'>>
        Relationships: [
          {
            foreignKeyName: "contratos_historico_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos_gerados"
            referencedColumns: ["id"]
          }
        ]
      }
      modelos_contratos: {
        Row: ModeloContrato
        Insert: Omit<ModeloContrato, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          status?: ModeloContrato['status']
          tipo?: ModeloContrato['tipo']
          variaveis_disponiveis?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ModeloContrato, 'id'>>
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