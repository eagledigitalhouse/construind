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