import { useState, useEffect } from 'react'
import { supabase, type Patrocinador } from '@/lib/supabase'
import { toast } from 'sonner'

export const usePatrocinadores = () => {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar patrocinadores
  const fetchPatrocinadores = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('patrocinadores')
        .select('*')
        .order('posicao', { ascending: true })

      if (error) throw error

      setPatrocinadores(data || [])
    } catch (err) {
      console.error('Erro ao carregar patrocinadores:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      toast.error('Erro ao carregar patrocinadores')
    } finally {
      setLoading(false)
    }
  }

  // Adicionar patrocinador
  const adicionarPatrocinador = async (patrocinador: Omit<Patrocinador, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Buscar a maior posição atual na categoria
      const { data: patrocinadorExistente } = await supabase
        .from('patrocinadores')
        .select('posicao')
        .eq('categoria_id', patrocinador.categoria_id)
        .order('posicao', { ascending: false })
        .limit(1)

      const proximaPosicao = patrocinadorExistente && patrocinadorExistente.length > 0 
        ? (patrocinadorExistente[0].posicao || 0) + 1 
        : 1

      const { data, error } = await supabase
        .from('patrocinadores')
        .insert([{ ...patrocinador, posicao: proximaPosicao }])
        .select()
        .single()

      if (error) throw error

      // Recarregar todos os dados para manter a ordenação
      await fetchPatrocinadores()
      toast.success('Patrocinador adicionado com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao adicionar patrocinador:', err)
      toast.error('Erro ao adicionar patrocinador')
      throw err
    }
  }

  // Atualizar patrocinador
  const atualizarPatrocinador = async (id: string, updates: Partial<Patrocinador>) => {
    try {
      console.log('🔄 Atualizando patrocinador:', id, 'com dados:', updates)
      
      const { data, error } = await supabase
        .from('patrocinadores')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Erro do Supabase:', error)
        throw error
      }

      console.log('✅ Patrocinador atualizado no banco:', data)
      
      setPatrocinadores(prev => 
        prev.map(p => p.id === id ? data : p)
      )
      
      console.log('✅ Estado local atualizado')
      return data
    } catch (err) {
      console.error('❌ Erro ao atualizar patrocinador:', err)
      toast.error('Erro ao atualizar patrocinador')
      throw err
    }
  }

  // Remover patrocinador
  const removerPatrocinador = async (id: string) => {
    try {
      console.log('🗑️ Iniciando remoção do patrocinador:', id)
      
      // Verificar se o patrocinador existe antes de tentar remover
      const { data: patrocinadorExistente, error: errorVerificacao } = await supabase
        .from('patrocinadores')
        .select('id, nome')
        .eq('id', id)
        .single()
      
      if (errorVerificacao) {
        console.error('❌ Erro ao verificar patrocinador:', errorVerificacao)
        throw new Error(`Patrocinador não encontrado: ${errorVerificacao.message}`)
      }
      
      console.log('✅ Patrocinador encontrado:', patrocinadorExistente)
      
      // Tentar remover o patrocinador
      const { data, error } = await supabase
        .from('patrocinadores')
        .delete()
        .eq('id', id)
        .select() // Retorna os dados removidos
      
      console.log('🔄 Resultado da remoção:', { data, error })
      
      if (error) {
        console.error('❌ Erro na remoção:', error)
        throw error
      }
      
      console.log('✅ Patrocinador removido do banco:', data)
      
      // Atualizar estado local
      const estadoAnterior = patrocinadores.length
      setPatrocinadores(prev => {
        const novoEstado = prev.filter(p => p.id !== id)
        console.log(`📊 Estado atualizado: ${estadoAnterior} → ${novoEstado.length} patrocinadores`)
        return novoEstado
      })
      
      toast.success('Patrocinador removido com sucesso!')
      
      // Recarregar dados para garantir sincronização
      console.log('🔄 Recarregando dados para sincronização...')
      await fetchPatrocinadores()
      
    } catch (err) {
      console.error('❌ Erro ao remover patrocinador:', err)
      toast.error(`Erro ao remover patrocinador: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
      throw err
    }
  }

  // Filtrar por categoria ID
  const patrocinadorPorCategoria = (categoriaId: string) => {
    return patrocinadores.filter(p => p.categoria_id === categoriaId)
  }



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
    patrocinadorPorCategoria
  }
}