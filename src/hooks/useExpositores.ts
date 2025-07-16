import { useState, useEffect } from 'react'
import { supabase, type Expositor } from '@/lib/supabase'
import { toast } from 'sonner'

export const useExpositores = () => {
  const [expositores, setExpositores] = useState<Expositor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar expositores
  const fetchExpositores = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('expositores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setExpositores(data || [])
    } catch (err) {
      console.error('Erro ao carregar expositores:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      toast.error('Erro ao carregar expositores')
    } finally {
      setLoading(false)
    }
  }

  // Adicionar expositor
  const adicionarExpositor = async (expositor: Omit<Expositor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('expositores')
        .insert([expositor])
        .select()
        .single()

      if (error) throw error

      setExpositores(prev => [data, ...prev])
      toast.success('Expositor adicionado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao adicionar expositor:', err)
      toast.error('Erro ao adicionar expositor')
      throw err
    }
  }

  // Atualizar expositor
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
      toast.success('Expositor atualizado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao atualizar expositor:', err)
      toast.error('Erro ao atualizar expositor')
      throw err
    }
  }

  // Remover expositor
  const removerExpositor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expositores')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExpositores(prev => prev.filter(e => e.id !== id))
      toast.success('Expositor removido com sucesso!')
    } catch (err) {
      console.error('Erro ao remover expositor:', err)
      toast.error('Erro ao remover expositor')
      throw err
    }
  }

  // Filtrar por categoria
  const expositoresPorCategoria = (categoria: string) => {
    return expositores.filter(e => e.categoria === categoria)
  }

  // Buscar expositores
  const buscarExpositores = (query: string) => {
    return expositores.filter(e => 
      e.nome.toLowerCase().includes(query.toLowerCase()) ||
      e.localizacao.toLowerCase().includes(query.toLowerCase()) ||
      e.descricao.toLowerCase().includes(query.toLowerCase())
    )
  }

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