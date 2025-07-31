import { useState, useEffect } from 'react'
import { supabase, type Newsletter } from '@/lib/supabase'
import { showToast } from '@/lib/toast'

export const useNewsletter = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar newsletters - FUNÇÃO ADMIN APENAS
  const fetchNewsletters = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Carregando newsletters...')
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro Supabase ao carregar newsletters:', error)
        setError(error.message)
        showToast.error(`Erro ao carregar newsletters: ${error.message}`)
        return
      }

      console.log('Newsletters carregadas:', data?.length || 0)
      setNewsletters(data || [])
      setError(null)

    } catch (err) {
      console.error('Erro inesperado ao carregar newsletters:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      showToast.error(`Erro inesperado: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Cadastrar email na newsletter - FUNÇÃO PÚBLICA (qualquer usuário pode se cadastrar)
  const cadastrarEmail = async (email: string, nome?: string) => {
    try {
      console.log('Cadastrando email na newsletter:', email)
      
      // Verificar se o email já está cadastrado
      const { data: existingEmail, error: checkError } = await supabase
        .from('newsletters')
        .select('id')
        .eq('email', email)
        .maybeSingle() // Usar maybeSingle ao invés de single para evitar erro se não encontrar

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao verificar email existente:', checkError)
        throw checkError
      }

      if (existingEmail) {
        showToast.error('Este email já está cadastrado na newsletter!')
        return { error: 'Email já cadastrado' }
      }

      const { data, error } = await supabase
        .from('newsletters')
        .insert([{
          email,
          nome: nome || null,
          status: 'ativo',
          origem: 'site'
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao inserir newsletter:', error)
        throw error
      }

      console.log('Email cadastrado com sucesso!')
      showToast.success('Email cadastrado com sucesso na newsletter!')
      return { data, error: null }
      
    } catch (err) {
      console.error('Erro ao cadastrar email:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      showToast.error(`Erro ao cadastrar email: ${errorMessage}`)
      return { error: errorMessage }
    }
  }

  // Atualizar status do newsletter (apenas para admin)
  const atualizarNewsletter = async (id: string, updates: Partial<Newsletter>) => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setNewsletters(prev => 
        prev.map(n => n.id === id ? data : n)
      )
      showToast.success('Newsletter atualizada com sucesso!')
      return data
    } catch (err) {
      console.error('Erro ao atualizar newsletter:', err)
      showToast.error('Erro ao atualizar newsletter')
      throw err
    }
  }

  // Remover email da newsletter (apenas para admin)
  const removerNewsletter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNewsletters(prev => prev.filter(n => n.id !== id))
      showToast.success('Email removido da newsletter!')
    } catch (err) {
      console.error('Erro ao remover newsletter:', err)
      showToast.error('Erro ao remover newsletter')
      throw err
    }
  }

  // Buscar newsletters por status - FUNÇÃO ADMIN
  const newslettersPorStatus = (status: string) => {
    return newsletters.filter(n => n.status === status)
  }

  // Buscar newsletters - FUNÇÃO ADMIN
  const buscarNewsletters = (query: string) => {
    return newsletters.filter(n => 
      n.email.toLowerCase().includes(query.toLowerCase()) ||
      n.nome?.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Carregar dados automaticamente APENAS se estivermos em área administrativa
  useEffect(() => {
    // Verificar se estamos em uma página admin
    if (window.location.pathname.includes('/admin')) {
      console.log('Página admin detectada, carregando newsletters...')
      fetchNewsletters()
    } else {
      console.log('Página pública, não carregando newsletters')
      setLoading(false) // Não carregar em páginas públicas
    }
  }, [])

  return {
    newsletters,
    loading,
    error,
    fetchNewsletters,
    cadastrarEmail, // FUNÇÃO PÚBLICA
    atualizarNewsletter,
    removerNewsletter,
    newslettersPorStatus,
    buscarNewsletters
  }
}