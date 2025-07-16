import { useState, useEffect } from 'react';
import { supabase, type Categoria } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CotaPatrocinio {
  id: string;
  nome: string;
  key: string;
  cor: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useCotasPatrocinio = () => {
  const [cotas, setCotas] = useState<CotaPatrocinio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar cotas do banco de dados
  const fetchCotas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('tipo', 'patrocinador')
        .order('ordem', { ascending: true });

      if (error) throw error;

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
    } catch (err) {
      console.error('Erro ao carregar cotas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao carregar cotas de patrocínio');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova cota
  const adicionarCota = async (cota: Omit<CotaPatrocinio, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Buscar a maior ordem atual
      const { data: cotasExistentes } = await supabase
        .from('categorias')
        .select('ordem')
        .eq('tipo', 'patrocinador')
        .order('ordem', { ascending: false })
        .limit(1);

      const proximaOrdem = cotasExistentes && cotasExistentes.length > 0 
        ? cotasExistentes[0].ordem + 1 
        : 1;

      const { data, error } = await supabase
        .from('categorias')
        .insert([{
          nome: cota.nome,
          cor: cota.cor,
          icone: cota.icone,
          tipo: 'patrocinador',
          ordem: proximaOrdem
        }])
        .select()
        .single();

      if (error) throw error;

      const novaCota: CotaPatrocinio = {
        id: data.id,
        nome: data.nome,
        key: data.nome.toLowerCase().replace(/\s+/g, '_'),
        cor: data.cor,
        icone: data.icone,
        ordem: data.ordem || 0,
        ativo: true,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCotas(prev => [...prev, novaCota].sort((a, b) => a.ordem - b.ordem));
      toast.success('Cota adicionada com sucesso!');
      return novaCota;
    } catch (err) {
      console.error('Erro ao adicionar cota:', err);
      toast.error('Erro ao adicionar cota');
      throw err;
    }
  };

  // Atualizar cota existente
  const atualizarCota = async (id: string, updates: Partial<CotaPatrocinio>) => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .update({
          nome: updates.nome,
          cor: updates.cor,
          icone: updates.icone,
          ordem: updates.ordem,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const cotaAtualizada: CotaPatrocinio = {
        id: data.id,
        nome: data.nome,
        key: data.nome.toLowerCase().replace(/\s+/g, '_'),
        cor: data.cor,
        icone: data.icone,
        ordem: data.ordem || 0,
        ativo: true,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCotas(prev => 
        prev.map(c => c.id === id ? cotaAtualizada : c)
          .sort((a, b) => a.ordem - b.ordem)
      );
      toast.success('Cota atualizada com sucesso!');
      return cotaAtualizada;
    } catch (err) {
      console.error('Erro ao atualizar cota:', err);
      toast.error('Erro ao atualizar cota');
      throw err;
    }
  };

  // Remover cota
  const removerCota = async (id: string) => {
    try {
      // Verificar se existem patrocinadores nesta cota
      const { data: patrocinadores } = await supabase
        .from('patrocinadores')
        .select('id')
        .eq('categoria_id', id);

      if (patrocinadores && patrocinadores.length > 0) {
        throw new Error('Não é possível remover uma cota que possui patrocinadores. Remova ou mova os patrocinadores primeiro.');
      }

      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCotas(prev => prev.filter(c => c.id !== id));
      toast.success('Cota removida com sucesso!');
    } catch (err) {
      console.error('Erro ao remover cota:', err);
      toast.error('Erro ao remover cota');
      throw err;
    }
  };

  // Reordenar cotas
  const reordenarCotas = async (cotasReordenadas: CotaPatrocinio[]) => {
    try {
      const updates = cotasReordenadas.map((cota, index) => ({
        id: cota.id,
        ordem: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('categorias')
          .update({ ordem: update.ordem })
          .eq('id', update.id);
      }

      setCotas(cotasReordenadas);
      toast.success('Ordem das cotas atualizada!');
    } catch (err) {
      console.error('Erro ao reordenar cotas:', err);
      toast.error('Erro ao reordenar cotas');
      throw err;
    }
  };



  useEffect(() => {
    fetchCotas();
  }, []);

  return {
    cotas,
    loading,
    error,
    fetchCotas,
    adicionarCota,
    atualizarCota,
    removerCota,
    reordenarCotas
  };
};