import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TipoFormulario {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  campos_obrigatorios: any;
  campos_opcionais: any;
  configuracoes: any;
  created_at: string;
  updated_at: string;
}

export interface PipelineFormulario {
  id: string;
  tipo_formulario_id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  tipo_formulario?: TipoFormulario;
  etapas?: EtapaPipeline[];
}

export interface EtapaPipeline {
  id: string;
  pipeline_id: string;
  nome: string;
  descricao: string | null;
  cor: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contato {
  id: string;
  tipo_formulario_id: string | null;
  dados: any;
  status: string | null;
  prioridade: string | null;
  origem: string | null;
  ip_origem: string | null;
  user_agent: string | null;
  observacoes: string | null;
  atendido_por: string | null;
  atendido_em: string | null;
  etapa_pipeline_id: string | null;
  created_at: string;
  updated_at: string;
  tipo_formulario?: TipoFormulario;
  etapa_pipeline?: EtapaPipeline;
}

export interface ContatoHistorico {
  id: string;
  contato_id: string;
  acao: string;
  descricao: string | null;
  dados_anteriores: any;
  dados_novos: any;
  usuario_id: string | null;
  created_at: string;
}

export interface EstatisticasCRM {
  totalContatos: number;
  contatosNovos: number;
  contatosEmAndamento: number;
  contatosFinalizados: number;
  contatosPorFormulario: { [key: string]: number };
  contatosPorMes: { mes: string; total: number }[];
}

export const useCRM = () => {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [tiposFormulario, setTiposFormulario] = useState<TipoFormulario[]>([]);
  const [pipelines, setPipelines] = useState<PipelineFormulario[]>([]);
  const [etapas, setEtapas] = useState<EtapaPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os contatos
  const fetchContatos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contatos')
        .select(`
          *,
          tipo_formulario:tipos_formulario(*),
          etapa_pipeline:etapas_pipeline(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatos(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  // Buscar tipos de formulário
  const fetchTiposFormulario = async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_formulario')
        .select('*')
        .order('nome');

      if (error) throw error;
      setTiposFormulario(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar tipos de formulário');
    }
  };

  // Buscar pipelines
  const fetchPipelines = async () => {
    try {
      const { data, error } = await supabase
        .from('pipelines_formulario')
        .select(`
          *,
          tipo_formulario:tipos_formulario(*),
          etapas:etapas_pipeline(*)
        `)
        .eq('ativo', true)
        .order('created_at');

      if (error) throw error;
      setPipelines(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar pipelines');
    }
  };

  // Buscar etapas
  const fetchEtapas = async () => {
    try {
      const { data, error } = await supabase
        .from('etapas_pipeline')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (error) throw error;
      setEtapas(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar etapas');
    }
  };

  // Mover contato para etapa do pipeline
  const moverContatoParaEtapa = async (contatoId: string, etapaId: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .update({ 
          etapa_pipeline_id: etapaId,
          updated_at: new Date().toISOString()
        })
        .eq('id', contatoId);

      if (error) throw error;

      // Buscar nome da etapa para o histórico
      const etapa = etapas.find(e => e.id === etapaId);
      await registrarHistorico(contatoId, 'etapa_alterada', `Movido para etapa: ${etapa?.nome || 'Desconhecida'}`);
      
      await fetchContatos();
      toast.success('Contato movido com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao mover contato');
    }
  };

  // Funções para gerenciar pipelines
  const criarPipeline = async (dados: Omit<PipelineFormulario, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pipelines_formulario')
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      await fetchPipelines();
      toast.success('Pipeline criado com sucesso!');
      return data;
    } catch (err: any) {
      toast.error('Erro ao criar pipeline');
      throw err;
    }
  };

  const atualizarPipeline = async (id: string, dados: Partial<PipelineFormulario>) => {
    try {
      const { error } = await supabase
        .from('pipelines_formulario')
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchPipelines();
      toast.success('Pipeline atualizado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar pipeline');
      throw err;
    }
  };

  const deletarPipeline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pipelines_formulario')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPipelines();
      toast.success('Pipeline deletado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao deletar pipeline');
      throw err;
    }
  };

  // Funções para gerenciar etapas
  const criarEtapa = async (dados: Omit<EtapaPipeline, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('etapas_pipeline')
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      await fetchEtapas();
      toast.success('Etapa criada com sucesso!');
      return data;
    } catch (err: any) {
      toast.error('Erro ao criar etapa');
      throw err;
    }
  };

  const atualizarEtapa = async (id: string, dados: Partial<EtapaPipeline>) => {
    try {
      const { error } = await supabase
        .from('etapas_pipeline')
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchEtapas();
      toast.success('Etapa atualizada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar etapa');
      throw err;
    }
  };

  const deletarEtapa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('etapas_pipeline')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEtapas();
      toast.success('Etapa deletada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao deletar etapa');
      throw err;
    }
  };

  const reordenarEtapas = async (pipelineId: string, etapaId: string, novaOrdem: number) => {
    try {
      // Buscar todas as etapas do pipeline
      const { data: etapasPipeline, error: fetchError } = await supabase
        .from('etapas_pipeline')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('ordem');

      if (fetchError) throw fetchError;

      // Encontrar a etapa que está sendo movida
      const etapaMovida = etapasPipeline?.find(e => e.id === etapaId);
      if (!etapaMovida) throw new Error('Etapa não encontrada');

      const ordemAtual = etapaMovida.ordem;
      
      // Atualizar as ordens das etapas afetadas
      if (novaOrdem > ordemAtual) {
        // Movendo para baixo - diminuir ordem das etapas entre a posição atual e nova
        for (const etapa of etapasPipeline || []) {
          if (etapa.ordem > ordemAtual && etapa.ordem <= novaOrdem) {
            await supabase
              .from('etapas_pipeline')
              .update({ ordem: etapa.ordem - 1, updated_at: new Date().toISOString() })
              .eq('id', etapa.id);
          }
        }
      } else {
        // Movendo para cima - aumentar ordem das etapas entre a nova posição e atual
        for (const etapa of etapasPipeline || []) {
          if (etapa.ordem >= novaOrdem && etapa.ordem < ordemAtual) {
            await supabase
              .from('etapas_pipeline')
              .update({ ordem: etapa.ordem + 1, updated_at: new Date().toISOString() })
              .eq('id', etapa.id);
          }
        }
      }

      // Atualizar a etapa movida
      await supabase
        .from('etapas_pipeline')
        .update({ ordem: novaOrdem, updated_at: new Date().toISOString() })
        .eq('id', etapaId);

      await fetchEtapas();
      toast.success('Etapas reordenadas com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao reordenar etapas');
      throw err;
    }
  };

  // Atualizar status do contato (mantido para compatibilidade)
  const atualizarStatusContato = async (id: string, status: string, observacoes?: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .update({ 
          status, 
          observacoes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Registrar no histórico
      await registrarHistorico(id, 'status_alterado', `Status alterado para: ${status}`);
      
      await fetchContatos();
      toast.success('Status atualizado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar status');
    }
  };

  // Atualizar prioridade do contato
  const atualizarPrioridadeContato = async (id: string, prioridade: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .update({ 
          prioridade,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await registrarHistorico(id, 'prioridade_alterada', `Prioridade alterada para: ${prioridade}`);
      
      await fetchContatos();
      toast.success('Prioridade atualizada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar prioridade');
    }
  };

  // Registrar histórico
  const registrarHistorico = async (contatoId: string, acao: string, descricao: string) => {
    try {
      const { error } = await supabase
        .from('contatos_historico')
        .insert({
          contato_id: contatoId,
          acao,
          descricao,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao registrar histórico:', err);
    }
  };

  // Buscar histórico de um contato
  const buscarHistoricoContato = async (contatoId: string): Promise<ContatoHistorico[]> => {
    try {
      const { data, error } = await supabase
        .from('contatos_historico')
        .select('*')
        .eq('contato_id', contatoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      toast.error('Erro ao carregar histórico');
      return [];
    }
  };

  // Criar novo tipo de formulário
  const criarTipoFormulario = async (tipoFormulario: Partial<TipoFormulario>) => {
    try {
      const { error } = await supabase
        .from('tipos_formulario')
        .insert({
          ...tipoFormulario,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await fetchTiposFormulario();
      toast.success('Tipo de formulário criado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao criar tipo de formulário');
    }
  };

  // Atualizar tipo de formulário
  const atualizarTipoFormulario = async (id: string, tipoFormulario: Partial<TipoFormulario>) => {
    try {
      const { error } = await supabase
        .from('tipos_formulario')
        .update({
          ...tipoFormulario,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchTiposFormulario();
      toast.success('Tipo de formulário atualizado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar tipo de formulário');
    }
  };

  // Deletar tipo de formulário
  const deletarTipoFormulario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tipos_formulario')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTiposFormulario();
      toast.success('Tipo de formulário deletado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao deletar tipo de formulário');
    }
  };

  // Obter estatísticas
  const obterEstatisticas = async (): Promise<EstatisticasCRM> => {
    try {
      const { data: contatos, error } = await supabase
        .from('contatos')
        .select('*, tipo_formulario:tipos_formulario(nome)');

      if (error) throw error;

      const totalContatos = contatos?.length || 0;
      const contatosNovos = contatos?.filter(c => c.status === 'novo').length || 0;
      const contatosEmAndamento = contatos?.filter(c => c.status === 'em_andamento').length || 0;
      const contatosFinalizados = contatos?.filter(c => c.status === 'finalizado').length || 0;

      const contatosPorFormulario: { [key: string]: number } = {};
      contatos?.forEach(contato => {
        const nomeFormulario = contato.tipo_formulario?.nome || 'Sem tipo';
        contatosPorFormulario[nomeFormulario] = (contatosPorFormulario[nomeFormulario] || 0) + 1;
      });

      // Contatos por mês (últimos 6 meses)
      const contatosPorMes: { mes: string; total: number }[] = [];
      const agora = new Date();
      for (let i = 5; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const proximoMes = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1);
        
        const contatosDoMes = contatos?.filter(c => {
          const dataContato = new Date(c.created_at);
          return dataContato >= data && dataContato < proximoMes;
        }).length || 0;

        contatosPorMes.push({
          mes: data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          total: contatosDoMes
        });
      }

      return {
        totalContatos,
        contatosNovos,
        contatosEmAndamento,
        contatosFinalizados,
        contatosPorFormulario,
        contatosPorMes
      };
    } catch (err: any) {
      toast.error('Erro ao obter estatísticas');
      return {
        totalContatos: 0,
        contatosNovos: 0,
        contatosEmAndamento: 0,
        contatosFinalizados: 0,
        contatosPorFormulario: {},
        contatosPorMes: []
      };
    }
  };

  useEffect(() => {
    fetchContatos();
    fetchTiposFormulario();
    fetchPipelines();
    fetchEtapas();
  }, []);

  return {
    contatos,
    tiposFormulario,
    pipelines,
    etapas,
    loading,
    error,
    fetchContatos,
    fetchTiposFormulario,
    fetchPipelines,
    fetchEtapas,
    moverContatoParaEtapa,
    atualizarStatusContato,
    atualizarPrioridadeContato,
    buscarHistoricoContato,
    criarTipoFormulario,
    atualizarTipoFormulario,
    deletarTipoFormulario,
    criarPipeline,
    atualizarPipeline,
    deletarPipeline,
    criarEtapa,
    atualizarEtapa,
    deletarEtapa,
    reordenarEtapas,
    obterEstatisticas
  };
};