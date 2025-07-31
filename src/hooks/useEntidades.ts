import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Entidade,
  EntidadeFormData,
  FiltrosEntidades,
  ResultadoBuscaEntidades,
  EstatisticasEntidades,
  EntidadeHistorico,
  EntidadeDocumento,
  EntidadeLembrete,
  TipoEntidade,
  CategoriaEntidade,
  StatusEntidade
} from '../types/entidades';

export const useEntidades = () => {
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasEntidades | null>(null);

  // Buscar entidades com filtros e paginação
  const buscarEntidades = useCallback(async (
    filtros: FiltrosEntidades = {},
    pagina: number = 1,
    limite: number = 20
  ): Promise<ResultadoBuscaEntidades> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('entidades')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (filtros.tipo && filtros.tipo.length > 0) {
        query = query.in('tipo', filtros.tipo);
      }

      if (filtros.categoria && filtros.categoria.length > 0) {
        query = query.in('categoria', filtros.categoria);
      }

      if (filtros.status && filtros.status.length > 0) {
        query = query.in('status', filtros.status);
      }

      if (filtros.tags && filtros.tags.length > 0) {
        query = query.overlaps('tags', filtros.tags);
      }

      if (filtros.busca_texto) {
        query = query.or(`
          nome.ilike.%${filtros.busca_texto}%,
          observacoes.ilike.%${filtros.busca_texto}%,
          contatos->>email_principal.ilike.%${filtros.busca_texto}%,
          dados_pessoa_fisica->>cpf.ilike.%${filtros.busca_texto}%,
          dados_pessoa_juridica->>cnpj.ilike.%${filtros.busca_texto}%
        `);
      }

      if (filtros.cidade) {
        query = query.or(`
          enderecos->residencial->>cidade.ilike.%${filtros.cidade}%,
          enderecos->comercial->>cidade.ilike.%${filtros.cidade}%
        `);
      }

      if (filtros.estado) {
        query = query.or(`
          enderecos->residencial->>estado.ilike.%${filtros.estado}%,
          enderecos->comercial->>estado.ilike.%${filtros.estado}%
        `);
      }

      if (filtros.data_cadastro_inicio) {
        query = query.gte('created_at', filtros.data_cadastro_inicio);
      }

      if (filtros.data_cadastro_fim) {
        query = query.lte('created_at', filtros.data_cadastro_fim);
      }

      // Paginação
      const inicio = (pagina - 1) * limite;
      query = query.range(inicio, inicio + limite - 1);

      // Ordenação
      query = query.order('updated_at', { ascending: false });

      const { data, error: queryError, count } = await query;

      if (queryError) {
        throw queryError;
      }

      const resultado: ResultadoBuscaEntidades = {
        entidades: data || [],
        total: count || 0,
        pagina,
        total_paginas: Math.ceil((count || 0) / limite)
      };

      setEntidades(data || []);
      return resultado;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar entidades';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar entidade por ID
  const buscarEntidadePorId = useCallback(async (id: string): Promise<Entidade | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('entidades')
        .select('*')
        .eq('id', id)
        .single();

      if (queryError) {
        throw queryError;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar entidade';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova entidade
  const criarEntidade = useCallback(async (dadosEntidade: EntidadeFormData): Promise<Entidade | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('entidades')
        .insert([dadosEntidade])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Atualizar lista local
      setEntidades(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar entidade';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar entidade
  const atualizarEntidade = useCallback(async (
    id: string, 
    dadosAtualizacao: Partial<EntidadeFormData>
  ): Promise<Entidade | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('entidades')
        .update(dadosAtualizacao)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Atualizar lista local
      setEntidades(prev => 
        prev.map(entidade => 
          entidade.id === id ? data : entidade
        )
      );

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar entidade';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir entidade
  const excluirEntidade = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('entidades')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Remover da lista local
      setEntidades(prev => prev.filter(entidade => entidade.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir entidade';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar estatísticas
  const buscarEstatisticas = useCallback(async (): Promise<EstatisticasEntidades | null> => {
    setLoading(true);
    setError(null);

    try {
      // Buscar contagens por tipo, categoria e status
      const { data: entidadesData, error: queryError } = await supabase
        .from('entidades')
        .select('tipo, categoria, status, created_at, enderecos');

      if (queryError) {
        throw queryError;
      }

      const dados = entidadesData || [];
      
      // Calcular estatísticas
      const estatisticas: EstatisticasEntidades = {
        total: dados.length,
        por_tipo: {
          pessoa_fisica: dados.filter(e => e.tipo === 'pessoa_fisica').length,
          pessoa_juridica: dados.filter(e => e.tipo === 'pessoa_juridica').length
        },
        por_categoria: {
          fornecedores: dados.filter(e => e.categoria === 'fornecedores').length,
          patrocinadores: dados.filter(e => e.categoria === 'patrocinadores').length,
          parceiros: dados.filter(e => e.categoria === 'parceiros').length,
          clientes: dados.filter(e => e.categoria === 'clientes').length,
          prestadores_servico: dados.filter(e => e.categoria === 'prestadores_servico').length,
          midia: dados.filter(e => e.categoria === 'midia').length,
          governo: dados.filter(e => e.categoria === 'governo').length,
          outros: dados.filter(e => e.categoria === 'outros').length
        },
        por_status: {
          ativo: dados.filter(e => e.status === 'ativo').length,
          inativo: dados.filter(e => e.status === 'inativo').length,
          arquivado: dados.filter(e => e.status === 'arquivado').length,
          bloqueado: dados.filter(e => e.status === 'bloqueado').length
        },
        crescimento_mensal: [],
        distribuicao_geografica: []
      };

      setEstatisticas(estatisticas);
      return estatisticas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estatísticas';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar histórico de uma entidade
  const buscarHistorico = useCallback(async (entidadeId: string): Promise<EntidadeHistorico[]> => {
    try {
      const { data, error: queryError } = await supabase
        .from('entidades_historico')
        .select('*')
        .eq('entidade_id', entidadeId)
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      return data || [];
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      return [];
    }
  }, []);

  // Adicionar entrada no histórico
  const adicionarHistorico = useCallback(async (
    entidadeId: string,
    dadosHistorico: Omit<EntidadeHistorico, 'id' | 'entidade_id' | 'created_at'>
  ): Promise<boolean> => {
    try {
      const { error: insertError } = await supabase
        .from('entidades_historico')
        .insert([{
          entidade_id: entidadeId,
          ...dadosHistorico
        }]);

      if (insertError) {
        throw insertError;
      }

      return true;
    } catch (err) {
      console.error('Erro ao adicionar histórico:', err);
      return false;
    }
  }, []);

  return {
    // Estado
    entidades,
    loading,
    error,
    estatisticas,
    
    // Operações CRUD
    buscarEntidades,
    buscarEntidadePorId,
    criarEntidade,
    atualizarEntidade,
    excluirEntidade,
    
    // Estatísticas
    buscarEstatisticas,
    
    // Histórico
    buscarHistorico,
    adicionarHistorico,
    
    // Utilitários
    setError
  };
};

export default useEntidades;