import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';

interface StandAprovado {
  numero_stand: string;
  categoria: string;
  nome_expositor: string;
  tipo_pessoa: 'fisica' | 'juridica';
  pre_inscricao_id: string;
  emails: string[];
  telefones: string[];
}

export const useStandsAprovados = () => {
  const [standsAprovados, setStandsAprovados] = useState<StandAprovado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarStandsAprovados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar stands com pré-inscrições aprovadas
      const { data: preInscricoesAprovadas, error: preError } = await supabase
        .from('pre_inscricao_expositores')
        .select(`
          id,
          numero_stand,
          razao_social,
          nome_social,
          nome_pf,
          sobrenome_pf,
          tipo_pessoa,
          email_empresa,
          email_pf,
          email_responsavel,
          email_responsavel_stand,
          telefone_empresa,
          telefone_pf,
          contato_responsavel
        `)
        .eq('status', 'aprovado')
        .eq('is_temporary', false)
        .not('numero_stand', 'is', null);

      if (preError) {
        throw preError;
      }

      // Buscar informações dos stands
      const { data: standsData, error: standsError } = await supabase
        .from('stands_fespin')
        .select('numero_stand, categoria');

      if (standsError) {
        throw standsError;
      }

      // Combinar dados
      const standsComDados = preInscricoesAprovadas?.map(preInscricao => {
        const stand = standsData?.find(s => s.numero_stand === preInscricao.numero_stand);
        
        // Determinar nome do expositor
        const nomeExpositor = preInscricao.tipo_pessoa === 'juridica'
          ? preInscricao.razao_social || preInscricao.nome_social || 'Empresa'
          : `${preInscricao.nome_pf || ''} ${preInscricao.sobrenome_pf || ''}`.trim();

        // Coletar todos os emails disponíveis
        const emails = [
          preInscricao.email_empresa,
          preInscricao.email_pf,
          preInscricao.email_responsavel,
          preInscricao.email_responsavel_stand
        ].filter(email => email && email.trim() !== '');

        // Coletar todos os telefones disponíveis
        const telefones = [
          preInscricao.telefone_empresa,
          preInscricao.telefone_pf,
          preInscricao.contato_responsavel
        ].filter(telefone => telefone && telefone.trim() !== '');

        return {
          numero_stand: preInscricao.numero_stand,
          categoria: stand?.categoria || 'Categoria não encontrada',
          nome_expositor: nomeExpositor,
          tipo_pessoa: preInscricao.tipo_pessoa,
          pre_inscricao_id: preInscricao.id,
          emails: emails,
          telefones: telefones
        };
      }) || [];

      setStandsAprovados(standsComDados);
    } catch (err: any) {
      console.error('Erro ao carregar stands aprovados:', err);
      setError(err.message || 'Erro ao carregar stands aprovados');
      showToast.error('Erro ao carregar stands aprovados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarStandsAprovados();
  }, []);

  return {
    standsAprovados,
    loading,
    error,
    recarregar: carregarStandsAprovados
  };
};

export default useStandsAprovados;