import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { converterPrecoParaNumero, formatarMoedaBrasileira } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Store,
  RefreshCw,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EstatisticasDashboard {
  totalStands: number;
  standsDisponiveis: number;
  standsReservados: number;
  totalPreInscricoes: number;
  preInscricoesPendentes: number;
  preInscricoesAprovadas: number;
  taxaOcupacao: number;
  receitaTotalPotencial: number;
  receitaReal: number;
}

const ConstruindDashboard: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasDashboard>({
    totalStands: 0,
    standsDisponiveis: 0,
    standsReservados: 0,
    totalPreInscricoes: 0,
    preInscricoesPendentes: 0,
    preInscricoesAprovadas: 0,
    taxaOcupacao: 0,
    receitaTotalPotencial: 0,
    receitaReal: 0
  });
  const [carregando, setCarregando] = useState(true);

  const buscarEstatisticas = async () => {
    try {
      setCarregando(true);

      // Buscar dados dos stands CONSTRUIND (tabela correta)
      const { data: stands, error: standsError } = await supabase
        .from('stands_construind')
        .select('status, numero_stand, preco');

      if (standsError) throw standsError;

      // Buscar dados das pré-inscrições
      const { data: preInscricoes, error: preInscricoesError } = await supabase
        .from('pre_inscricao_expositores')
        .select('status, numero_stand');

      if (preInscricoesError) throw preInscricoesError;

      // Calcular estatísticas dos stands
      const totalStands = stands?.length || 0;
      const standsDisponiveis = stands?.filter(stand => stand.status === 'disponivel').length || 0;
      const standsReservados = stands?.filter(stand => stand.status === 'reservado').length || 0;
      const standsOcupados = stands?.filter(stand => stand.status === 'ocupado').length || 0;

      // Calcular estatísticas das pré-inscrições
      const totalPreInscricoes = preInscricoes?.length || 0;
      const preInscricoesPendentes = preInscricoes?.filter(inscricao => inscricao.status === 'pendente').length || 0;
      const preInscricoesAprovadas = preInscricoes?.filter(inscricao => inscricao.status === 'aprovado').length || 0;
      const preInscricoesRejeitadas = preInscricoes?.filter(inscricao => inscricao.status === 'rejeitado').length || 0;

      // Calcular taxa de ocupação
      const taxaOcupacao = totalStands > 0 ? Math.round(((standsOcupados + standsReservados) / totalStands) * 100) : 0;

      // Calcular receitas
      const receitaTotalPotencial = stands?.reduce((total, stand) => {
        if (!stand.preco) return total;
        const preco = converterPrecoParaNumero(stand.preco);
        return total + preco;
      }, 0) || 0;

      const receitaReal = stands?.reduce((total, stand) => {
        if (!stand.preco || (stand.status !== 'reservado' && stand.status !== 'ocupado')) return total;
        const preco = converterPrecoParaNumero(stand.preco);
        return total + preco;
      }, 0) || 0;

      setEstatisticas({
        totalStands,
        standsDisponiveis,
        standsReservados: standsReservados + standsOcupados, // Somar reservados + ocupados para mostrar "não disponíveis"
        totalPreInscricoes,
        preInscricoesPendentes,
        preInscricoesAprovadas,
        taxaOcupacao,
        receitaTotalPotencial,
        receitaReal
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      showToast('Erro ao carregar estatísticas', 'error');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarEstatisticas();
  }, []);

  const cardsEstatisticas = [
    {
      titulo: 'Receita Total Potencial',
      valor: formatarMoedaBrasileira(estatisticas.receitaTotalPotencial),
      icone: <DollarSign className="w-8 h-8" />,
      cor: 'green' as const,
      descricao: 'Valor total de todos os stands',
      destaque: true
    },
    {
      titulo: 'Receita Real',
      valor: formatarMoedaBrasileira(estatisticas.receitaReal),
      icone: <DollarSign className="w-8 h-8" />,
      cor: 'orange' as const,
      descricao: 'Valor dos stands reservados/ocupados'
    },
    {
      titulo: 'Total de Stands',
      valor: estatisticas.totalStands,
      icone: <Store className="w-8 h-8" />,
      cor: 'blue' as const,
      descricao: 'Stands cadastrados'
    },
    {
      titulo: 'Stands Disponíveis',
      valor: estatisticas.standsDisponiveis,
      icone: <Store className="w-8 h-8" />,
      cor: 'green' as const,
      descricao: 'Prontos para reserva'
    },
    {
      titulo: 'Stands Ocupados/Reservados',
      valor: estatisticas.standsReservados,
      icone: <Store className="w-8 h-8" />,
      cor: 'orange' as const,
      descricao: 'Não disponíveis'
    },
    {
      titulo: 'Taxa de Ocupação',
      valor: `${estatisticas.taxaOcupacao}%`,
      icone: <TrendingUp className="w-8 h-8" />,
      cor: 'blue' as const,
      descricao: 'Percentual ocupado'
    },
    {
      titulo: 'Total Pré-Inscrições',
      valor: estatisticas.totalPreInscricoes,
      icone: <Users className="w-8 h-8" />,
      cor: 'purple' as const,
      descricao: 'Inscrições recebidas'
    },
    {
      titulo: 'Pendentes',
      valor: estatisticas.preInscricoesPendentes,
      icone: <Calendar className="w-8 h-8" />,
      cor: 'yellow' as const,
      descricao: 'Aguardando análise'
    },
    {
      titulo: 'Aprovadas',
      valor: estatisticas.preInscricoesAprovadas,
      icone: <TrendingUp className="w-8 h-8" />,
      cor: 'green' as const,
      descricao: 'Já aprovadas'
    }
  ];

  const getCoresPorTipo = (cor: string) => {
    const cores = {
      blue: 'from-blue-500 to-indigo-500',
      green: 'from-emerald-500 to-green-500',
      emerald: 'from-emerald-600 to-teal-600',
      orange: 'from-orange-500 to-amber-500',
      purple: 'from-purple-500 to-violet-500',
      yellow: 'from-yellow-400 to-amber-400',
      gray: 'from-gray-500 to-slate-500'
    };
    return cores[cor as keyof typeof cores] || cores.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] rounded-xl shadow-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard <span className="text-[#ff3c00]">CONSTRUIND 2025</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Visão geral do sistema administrativo
              </p>
            </div>
          </div>
          <Button
            onClick={buscarEstatisticas}
            disabled={carregando}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="space-y-6">
        {/* Cards de Receita - Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receita Total Potencial - Verde */}
          {cardsEstatisticas[0] && (
            <Card className="bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 border-l-4 border-l-emerald-500">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-emerald-600 text-lg font-semibold mb-3">{cardsEstatisticas[0].titulo}</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {carregando ? '...' : cardsEstatisticas[0].valor}
                    </p>
                    <p className="text-gray-600 text-base">{cardsEstatisticas[0].descricao}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                    <DollarSign className="w-12 h-12 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Receita Real - Laranja */}
          {cardsEstatisticas[1] && (
            <Card className="bg-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 border-l-4 border-l-orange-500">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-orange-600 text-lg font-semibold mb-3">{cardsEstatisticas[1].titulo}</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {carregando ? '...' : cardsEstatisticas[1].valor}
                    </p>
                    <p className="text-gray-600 text-base">{cardsEstatisticas[1].descricao}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg">
                    <DollarSign className="w-12 h-12 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Grid dos outros cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsEstatisticas.slice(2).map((card, index) => (
            <Card key={index + 2} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{card.titulo}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {carregando ? '...' : card.valor}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{card.descricao}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${getCoresPorTipo(card.cor)} rounded-xl`}>
                    {card.icone}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#ff3c00]" />
              Resumo de Stands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Ocupação:</span>
                <span className="font-semibold">
                  {estatisticas.totalStands > 0 
                    ? `${Math.round((estatisticas.standsReservados / estatisticas.totalStands) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: estatisticas.totalStands > 0 
                      ? `${(estatisticas.standsReservados / estatisticas.totalStands) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ff3c00]" />
              Resumo de Inscrições
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Aprovação:</span>
                <span className="font-semibold">
                  {estatisticas.totalPreInscricoes > 0 
                    ? `${Math.round((estatisticas.preInscricoesAprovadas / estatisticas.totalPreInscricoes) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: estatisticas.totalPreInscricoes > 0 
                      ? `${(estatisticas.preInscricoesAprovadas / estatisticas.totalPreInscricoes) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstruindDashboard;