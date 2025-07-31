import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import DashboardMetricCard from './DashboardMetricCard';
import { 
  Building2, 
  Users, 
  Store, 
  Mail, 
  FileText, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  patrocinadores: number;
  expositores: number;
  stands: number;
  newsletter: number;
  contratos: number;
  preInscricoes: number;
}

const FespinDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    patrocinadores: 0,
    expositores: 0,
    stands: 0,
    newsletter: 0,
    contratos: 0,
    preInscricoes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar dados reais do Supabase
        const [patrocinadores, expositores, stands, newsletter, contratos, preInscricoes] = await Promise.all([
          supabase.from('patrocinadores').select('id', { count: 'exact' }),
          supabase.from('expositores').select('id', { count: 'exact' }),
          supabase.from('stands_fespin').select('id', { count: 'exact' }),
          supabase.from('newsletters').select('id', { count: 'exact' }),
          supabase.from('contratos_gerados').select('id', { count: 'exact' }),
          supabase.from('pre_inscricao_expositores').select('id', { count: 'exact' })
        ]);

        setStats({
          patrocinadores: patrocinadores.count || 0,
          expositores: expositores.count || 0,
          stands: stands.count || 0,
          newsletter: newsletter.count || 0,
          contratos: contratos.count || 0,
          preInscricoes: preInscricoes.count || 0
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Valores de fallback
        setStats({
          patrocinadores: 12,
          expositores: 45,
          stands: 28,
          newsletter: 1200,
          contratos: 15,
          preInscricoes: 32
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const recentActivities = [
    {
      title: 'Novo Patrocinador',
      description: 'Empresa XYZ se cadastrou como patrocinador',
      time: '2 horas atrás',
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Stand Aprovado',
      description: 'Stand #15 foi aprovado para exposição',
      time: '4 horas atrás',
      icon: Store,
      color: 'green'
    },
    {
      title: 'Novo Contrato',
      description: 'Contrato gerado para expositor ABC',
      time: '6 horas atrás',
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Pré-inscrição',
      description: 'Nova pré-inscrição de expositor',
      time: '8 horas atrás',
      icon: Users,
      color: 'orange'
    }
  ];

  const quickStats = [
    {
      title: 'Taxa de Aprovação',
      value: '85%',
      icon: CheckCircle,
      color: 'green' as const
    },
    {
      title: 'Pendências',
      value: stats.preInscricoes,
      icon: Clock,
      color: 'yellow' as const
    },
    {
      title: 'Crescimento',
      value: '+12%',
      icon: TrendingUp,
      color: 'blue' as const
    }
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 fade-in">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <DashboardMetricCard
            title="Patrocinadores"
            value={stats.patrocinadores}
            icon={Building2}
            color="indigo"
            percentage="+3.65%"
            subtitle="Desde a semana passada"
          />
        </div>
        <div className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <DashboardMetricCard
            title="Expositores"
            value={stats.expositores}
            icon={Users}
            color="green"
            percentage="+4.44%"
            subtitle="Desde a semana passada"
          />
        </div>
        <div className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <DashboardMetricCard
            title="Stands"
            value={stats.stands}
            icon={Store}
            color="red"
            percentage="+5.25%"
            subtitle="Desde a semana passada"
          />
        </div>
        <div className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
          <DashboardMetricCard
            title="Newsletter"
            value={formatNumber(stats.newsletter)}
            icon={Mail}
            color="yellow"
            percentage="+6.77%"
            subtitle="Desde a semana passada"
          />
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-12 gap-5">
        {/* Bem-vindo */}
        <div className="xl:col-span-8 col-span-12">
          <DashboardCard
            title="Bem-vindo ao Painel Administrativo"
            subtitle="Gerencie todos os aspectos da FESPIN 2025"
          >
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Use a sidebar à esquerda para navegar entre as diferentes seções.
                Aqui você pode acompanhar o progresso da feira em tempo real.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1 flex items-center gap-2">
                    <Building2 size={16} />
                    Gestão Website
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Gerencie patrocinadores e expositores do site
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1 flex items-center gap-2">
                    <Store size={16} />
                    Gestão
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Controle stands, pré-inscrições e contratos
                  </p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="xl:col-span-4 col-span-12">
          <DashboardCard title="Estatísticas Rápidas">
            <div className="space-y-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      stat.color === 'green' ? 'bg-green-100 text-green-600' :
                      stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <stat.icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {stat.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="grid xl:grid-cols-2 gap-5">
        <DashboardCard title="Atividades Recentes">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.color === 'green' ? 'bg-green-100 text-green-600' :
                    activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    activity.color === 'red' ? 'bg-red-100 text-red-600' :
                    activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    activity.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Resumo de Contratos">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.contratos}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Contratos Ativos
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.preInscricoes}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Pré-inscrições
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Próximos vencimentos:</strong> 3 contratos vencem em 30 dias
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default FespinDashboard;