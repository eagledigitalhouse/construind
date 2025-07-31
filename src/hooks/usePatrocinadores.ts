import { useState, useEffect } from 'react'
import { supabase, type Patrocinador } from '@/lib/supabase'
import { showToast } from '@/lib/toast'

export const usePatrocinadores = () => {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar patrocinadores - FUNÇÃO PÚBLICA, sem necessidade de autenticação
  const fetchPatrocinadores = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Acesso público aos dados dos patrocinadores
      const { data, error } = await supabase
        .from('patrocinadores')
        .select('*')
        .order('posicao', { ascending: true })

      if (error) {
        console.error('Erro ao carregar patrocinadores:', error)
        setError(error.message)
        // NÃO mostrar toast de erro para usuários públicos
      } else {
        setPatrocinadores(data || [])
        setError(null)
      }
    } catch (err) {
      console.error('Erro ao carregar patrocinadores:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      // NÃO mostrar toast de erro para usuários públicos
    } finally {
      setLoading(false)
    }
  }

  // Adicionar patrocinador (requer autenticação - apenas para admin)
  const adicionarPatrocinador = async (patrocinador: Omit<Patrocinador, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patrocinadores')
        .insert([patrocinador])
        .select()
        .single()

      if (error) throw error

      setPatrocinadores(prev => [...prev, data])
      showToast.success('Patrocinador adicionado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao adicionar patrocinador:', err)
      showToast.error('Erro ao adicionar patrocinador')
      throw err
    }
  }

  // Atualizar patrocinador (requer autenticação - apenas para admin)
  const atualizarPatrocinador = async (id: string, updates: Partial<Patrocinador>) => {
    try {
      const { data, error } = await supabase
        .from('patrocinadores')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setPatrocinadores(prev => 
        prev.map(p => p.id === id ? data : p)
      )
      showToast.success('Patrocinador atualizado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao atualizar patrocinador:', err)
      showToast.error('Erro ao atualizar patrocinador')
      throw err
    }
  }

  // Remover patrocinador (requer autenticação - apenas para admin)
  const removerPatrocinador = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patrocinadores')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPatrocinadores(prev => prev.filter(p => p.id !== id))
      showToast.success('Patrocinador removido com sucesso!')
    } catch (err) {
      console.error('Erro ao remover patrocinador:', err)
      showToast.error('Erro ao remover patrocinador')
      throw err
    }
  }

  // Filtrar por categoria - FUNÇÃO PÚBLICA
  const patrocinadorPorCategoria = (categoriaId: string) => {
    return patrocinadores.filter(p => p.categoria_id === categoriaId)
  }

  // Buscar por nome - FUNÇÃO PÚBLICA
  const buscarPatrocinadores = (query: string) => {
    return patrocinadores.filter(p => 
      p.nome.toLowerCase().includes(query.toLowerCase()) || 
      p.descricao?.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Carregar dados automaticamente
  useEffect(() => {
    fetchPatrocinadores()
  }, [])

  return {
    patrocinadores,
    loading,
    error,
    fetchPatrocinadores,
    adicionarPatrocinador,
    atualizarPatrocinador,
    removerPatrocinador,
    patrocinadorPorCategoria,
    buscarPatrocinadores
  }
}