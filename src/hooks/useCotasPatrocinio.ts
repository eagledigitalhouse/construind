import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface CotaPatrocinio {
  id: string
  nome: string
  key: string
  cor: string
  icone: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export const useCotasPatrocinio = () => {
  const [cotas, setCotas] = useState<CotaPatrocinio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar cotas do banco de dados - FUNÇÃO PÚBLICA, sem necessidade de autenticação
  const fetchCotas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Acesso público aos dados das categorias/cotas
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('tipo', 'patrocinador')
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao carregar cotas:', error);
        setError(error.message);
        // NÃO mostrar toast de erro para usuários públicos
      } else {
        // Mapear dados do banco para o formato esperado
        const cotasFormatadas = data?.map(categoria => ({
          id: categoria.id,
          nome: categoria.nome,
          key: categoria.nome.toLowerCase().replace(/\s+/g, '_'),
          cor: categoria.cor,
          icone: categoria.icone || 'crown',
          ordem: categoria.ordem || 0,
          ativo: true,
          created_at: categoria.created_at,
          updated_at: categoria.updated_at
        })) || [];

        setCotas(cotasFormatadas);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao carregar cotas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      // NÃO mostrar toast de erro para usuários públicos
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova categoria (apenas para admin)
  const adicionarCategoria = async (categoria: Omit<CotaPatrocinio, 'id' | 'created_at' | 'updated_at' | 'key'>) => {
    try {
      // Preparar dados para inserção
      const dadosCategoria = {
        nome: categoria.nome,
        tipo: 'patrocinador',
        cor: categoria.cor || '#0a2856',
        icone: categoria.icone || 'crown',
        ordem: categoria.ordem || 0,
        ativo: true
      };

      const { data, error } = await supabase
        .from('categorias')
        .insert([dadosCategoria])
        .select();

      if (error) throw error;

      // Formatar o dado retornado para o formato da interface
      const novasCategorias = data.map(cat => ({
        id: cat.id,
        nome: cat.nome,
        key: cat.nome.toLowerCase().replace(/\s+/g, '_'),
        cor: cat.cor,
        icone: cat.icone || 'crown',
        ordem: cat.ordem || 0,
        ativo: true,
        created_at: cat.created_at,
        updated_at: cat.updated_at
      }));

      setCotas(prev => [...prev, ...novasCategorias]);
      toast.success('Categoria adicionada com sucesso!');
      
      return novasCategorias[0];
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      toast.error('Erro ao adicionar categoria');
      throw err;
    }
  };

  // Atualizar categoria existente (apenas para admin)
  const atualizarCategoria = async (id: string, atualizacoes: Partial<Omit<CotaPatrocinio, 'id' | 'created_at' | 'updated_at' | 'key'>>) => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .update({
          nome: atualizacoes.nome,
          cor: atualizacoes.cor,
          icone: atualizacoes.icone,
          ordem: atualizacoes.ordem,
          ativo: atualizacoes.ativo
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const categoriaAtualizada = {
          id: data[0].id,
          nome: data[0].nome,
          key: data[0].nome.toLowerCase().replace(/\s+/g, '_'),
          cor: data[0].cor,
          icone: data[0].icone || 'crown',
          ordem: data[0].ordem || 0,
          ativo: data[0].ativo,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at
        };

        setCotas(prev => 
          prev.map(cota => cota.id === id ? categoriaAtualizada : cota)
        );
        toast.success('Categoria atualizada com sucesso!');
        return categoriaAtualizada;
      }
      return null;
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      toast.error('Erro ao atualizar categoria');
      throw err;
    }
  };

  // Remover categoria (apenas para admin)
  const removerCategoria = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCotas(prev => prev.filter(cota => cota.id !== id));
      toast.success('Categoria removida com sucesso!');
    } catch (err) {
      console.error('Erro ao remover categoria:', err);
      toast.error('Erro ao remover categoria');
      throw err;
    }
  };

  // Carregar dados automaticamente
  useEffect(() => {
    fetchCotas();
  }, []);

  return {
    cotas,
    loading,
    error,
    fetchCotas,
    adicionarCategoria,
    atualizarCategoria,
    removerCategoria
  };
};