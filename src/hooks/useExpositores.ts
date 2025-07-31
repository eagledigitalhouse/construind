import { useState, useEffect } from 'react'
import { supabase, type Expositor } from '@/lib/supabase'
import { showToast } from '@/lib/toast'

export const useExpositores = () => {
  const [expositores, setExpositores] = useState<Expositor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar expositores - FUNÇÃO PÚBLICA, sem necessidade de autenticação
  const fetchExpositores = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Acesso público aos dados dos expositores
      const { data, error } = await supabase
        .from('expositores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar expositores:', error)
        setError(error.message)
        // NÃO mostrar toast de erro para usuários públicos
      } else {
        setExpositores(data || [])
        setError(null)
      }
    } catch (err) {
      console.error('Erro ao carregar expositores:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      // NÃO mostrar toast de erro para usuários públicos
    } finally {
      setLoading(false)
    }
  }

  // Adicionar expositor (requer autenticação - apenas para admin)
  const adicionarExpositor = async (expositor: Omit<Expositor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('expositores')
        .insert([expositor])
        .select()
        .single()

      if (error) throw error

      setExpositores(prev => [data, ...prev])
      showToast.success('Expositor adicionado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao adicionar expositor:', err)
      showToast.error('Erro ao adicionar expositor')
      throw err
    }
  }

  // Atualizar expositor (requer autenticação - apenas para admin)
  const atualizarExpositor = async (id: string, updates: Partial<Expositor>) => {
    try {
      const { data, error } = await supabase
        .from('expositores')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setExpositores(prev => 
        prev.map(e => e.id === id ? data : e)
      )
      showToast.success('Expositor atualizado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao atualizar expositor:', err)
      showToast.error('Erro ao atualizar expositor')
      throw err
    }
  }

  // Remover expositor (requer autenticação - apenas para admin)
  const removerExpositor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expositores')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExpositores(prev => prev.filter(e => e.id !== id))
      showToast.success('Expositor removido com sucesso!')
    } catch (err) {
      console.error('Erro ao remover expositor:', err)
      showToast.error('Erro ao remover expositor')
      throw err
    }
  }

  // Filtrar por categoria - FUNÇÃO PÚBLICA
  const expositoresPorCategoria = (categoria: string) => {
    return expositores.filter(e => e.categoria === categoria)
  }

  // Buscar expositores - FUNÇÃO PÚBLICA
  const buscarExpositores = (query: string) => {
    return expositores.filter(e => 
      e.nome.toLowerCase().includes(query.toLowerCase()) ||
      e.localizacao.toLowerCase().includes(query.toLowerCase()) ||
      e.descricao.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Carregar dados automaticamente
  useEffect(() => {
    fetchExpositores()
  }, [])

  return {
    expositores,
    loading,
    error,
    fetchExpositores,
    adicionarExpositor,
    atualizarExpositor,
    removerExpositor,
    expositoresPorCategoria,
    buscarExpositores
  }
}