import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, BarChart3, Settings, Plus, Edit, Eye, MessageSquare, LayoutDashboard,
  Search, Bell, TrendingUp, TrendingDown, Activity, Calendar, Clock, CheckCircle, 
  AlertCircle, RefreshCw, FileText, Download, HelpCircle, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatrocinadores } from '@/hooks/usePatrocinadores';
import { useExpositores } from '@/hooks/useExpositores';
import { useCotasPatrocinio } from '@/hooks/useCotasPatrocinio';
import { useCRM } from '@/hooks/useCRM';
import { toast } from 'sonner';

// Componentes dos módulos
import AdminPatrocinadores from './AdminPatrocinadores';
import AdminExpositores from './AdminExpositores';
import AdminCRM from './AdminCRM';

interface EstatisticaCard {
  titulo: string;
  valor: number;
  mudanca: number;
  icone: React.ReactNode;
  cor: string;
  tendencia: 'up' | 'down' | 'stable';
}

interface AtividadeRecente {
  id: string;
  tipo: 'patrocinador' | 'expositor' | 'contato' | 'sistema';
  descricao: string;
  tempo: string;
  status: 'sucesso' | 'pendente' | 'erro';
}

const AdminDashboard: React.FC = () => {
  const [abaSelecionada, setAbaSelecionada] = useState('visao-geral');
  const [termoBusca, setTermoBusca] = useState('');
  const [notificacoes, setNotificacoes] = useState(3);
  const [atualizandoDados, setAtualizandoDados] = useState(false);
  
  // Hooks dos módulos
  const { patrocinadores, loading: loadingPatrocinadores, patrocinadorPorCategoria } = usePatrocinadores();
  const { expositores, loading: loadingExpositores } = useExpositores();
  const { cotas, loading: loadingCotas } = useCotasPatrocinio();
  const { contatos, estatisticas, loading: loadingCRM } = useCRM();
  
  // Estados para estatísticas
  const [estatisticasCards, setEstatisticasCards] = useState<EstatisticaCard[]>([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  
  useEffect(() => {
    carregarEstatisticas();
    carregarAtividadesRecentes();
  }, [patrocinadores, expositores, contatos]);
  
  const carregarEstatisticas = () => {
    const totalPatrocinadores = patrocinadores?.length || 0;
    const totalExpositores = expositores?.length || 0;
    const totalContatos = contatos?.length || 0;
    const contatosNovos = contatos?.filter(c => c.status === 'novo').length || 0;

    const novasEstatisticas: EstatisticaCard[] = [
      {
        titulo: 'Total Patrocinadores',
        valor: totalPatrocinadores,
        mudanca: 12,
        icone: <Building2 className="w-6 h-6" />,
        cor: 'text-blue-600',
        tendencia: 'up'
      },
      {
        titulo: 'Total Expositores',
        valor: totalExpositores,
        mudanca: 8,
        icone: <Users className="w-6 h-6" />,
        cor: 'text-green-600',
        tendencia: 'up'
      },
      {
        titulo: 'Contatos Recebidos',
        valor: totalContatos,
        mudanca: 15,
        icone: <MessageSquare className="w-6 h-6" />,
        cor: 'text-purple-600',
        tendencia: 'up'
      },
      {
        titulo: 'Contatos Novos',
        valor: contatosNovos,
        mudanca: -5,
        icone: <Bell className="w-6 h-6" />,
        cor: 'text-orange-600',
        tendencia: 'down'
      }
    ];

    setEstatisticasCards(novasEstatisticas);
  };
  
  const carregarAtividadesRecentes = () => {
    const atividades: AtividadeRecente[] = [
      {
        id: '1',
        tipo: 'patrocinador',
        descricao: 'Novo patrocinador cadastrado: Empresa XYZ',
        tempo: 'há 2 horas',
        status: 'sucesso'
      },
      {
        id: '2',
        tipo: 'contato',
        descricao: 'Novo contato recebido via formulário',
        tempo: 'há 4 horas',
        status: 'pendente'
      },
      {
        id: '3',
        tipo: 'expositor',
        descricao: 'Expositor atualizado: Academia Fitness',
        tempo: 'há 6 horas',
        status: 'sucesso'
      },
      {
        id: '4',
        tipo: 'sistema',
        descricao: 'Backup automático realizado',
        tempo: 'há 8 horas',
        status: 'sucesso'
      }
    ];

    setAtividadesRecentes(atividades);
  };
  
  const atualizarDados = async () => {
    setAtualizandoDados(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      carregarEstatisticas();
      carregarAtividadesRecentes();
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    } finally {
      setAtualizandoDados(false);
    }
  };
  
  const obterIconeStatus = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pendente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'erro':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const obterCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'patrocinador':
        return 'bg-blue-100 text-blue-800';
      case 'expositor':
        return 'bg-green-100 text-green-800';
      case 'contato':
        return 'bg-purple-100 text-purple-800';
      case 'sistema':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total de Patrocinadores',
      value: loadingPatrocinadores ? '...' : patrocinadores.length,
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-blue-500',
      link: '/admin/patrocinadores'
    },
    {
      title: 'Total de Expositores',
      value: loadingExpositores ? '...' : expositores.length,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
      link: '/admin/expositores'
    },
    {
      title: cotas.length > 0 ? `Cota ${cotas[0]?.nome}` : 'Primeira Cota',
      value: loadingPatrocinadores || loadingCotas ? '...' : (cotas.length > 0 ? patrocinadorPorCategoria(cotas[0].id).length : 0),
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-yellow-500',
      link: '/admin/patrocinadores'
    },
    {
      title: 'Categorias Ativas',
      value: loadingExpositores ? '...' : new Set(expositores.map(e => e.categoria)).size,
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-purple-500',
      link: '/admin/expositores'
    }
  ];

  const quickActions = [
    {
      title: 'Gerenciar Patrocinadores',
      description: 'Adicionar, editar ou remover patrocinadores do evento',
      icon: <Building2 className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/patrocinadores',
      actions: [
        { label: 'Ver todos', icon: <Eye className="w-4 h-4" />, link: '/admin/patrocinadores' },
        { label: 'Adicionar novo', icon: <Plus className="w-4 h-4" />, link: '/admin/patrocinadores' }
      ]
    },
    {
      title: 'Gerenciar Expositores',
      description: 'Adicionar, editar ou remover expositores do evento',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/expositores',
      actions: [
        { label: 'Ver todos', icon: <Eye className="w-4 h-4" />, link: '/admin/expositores' },
        { label: 'Adicionar novo', icon: <Plus className="w-4 h-4" />, link: '/admin/expositores' }
      ]
    },
    {
      title: 'Sistema CRM',
      description: 'Gerenciar contatos e formulários recebidos',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/crm',
      actions: [
        { label: 'Ver contatos', icon: <Eye className="w-4 h-4" />, link: '/admin/crm' },
        { label: 'Gerenciar formulários', icon: <Settings className="w-4 h-4" />, link: '/admin/crm' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Header Elegante */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Painel Administrativo
                  </h1>
                  <p className="text-sm text-gray-600">FESPIN 2025 - Sistema de Gestão</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                Sistema Online
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Barra de Busca Elegante */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Buscar em todo o sistema..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="pl-12 pr-4 py-2 w-80 bg-white/70 border-gray-200/50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-xl"
                />
              </div>
              
              {/* Notificações Elegantes */}
              <Button variant="ghost" size="sm" className="relative hover:bg-blue-50 rounded-xl p-3">
                <Bell className="w-5 h-5 text-gray-600" />
                {notificacoes > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium animate-bounce">
                    {notificacoes}
                  </div>
                )}
              </Button>
              
              {/* Botão Atualizar Elegante */}
              <Button 
                variant="ghost"
                size="sm" 
                onClick={atualizarDados}
                disabled={atualizandoDados}
                className="hover:bg-blue-50 rounded-xl px-4 py-2 transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 text-gray-600 ${atualizandoDados ? 'animate-spin text-blue-500' : ''}`} />
                <span className="text-gray-700 font-medium">Atualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Principal Elegante */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="space-y-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <TabsList className="grid w-full grid-cols-6 bg-transparent gap-1">
              <TabsTrigger 
                value="visao-geral" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-white/50"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-medium">Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger 
                value="patrocinadores" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-white/50"
              >
                <Building2 className="w-4 h-4" />
                <span className="font-medium">Patrocinadores</span>
              </TabsTrigger>
              <TabsTrigger 
                value="expositores" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-white/50"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Expositores</span>
              </TabsTrigger>
              <TabsTrigger 
                value="crm" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-white/50"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">CRM</span>
              </TabsTrigger>
              <TabsTrigger 
                value="relatorios" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-white/50"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Relatórios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="configuracoes" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 hover:bg-white/50"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Config</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Visão Geral */}
          <TabsContent value="visao-geral" className="space-y-8">
            {/* Cards de Estatísticas Elegantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {estatisticasCards.map((stat, index) => (
                <Card key={index} className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.titulo}</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {stat.valor}
                        </p>
                      </div>
                      <div className={`${stat.cor} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icone}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {stat.tendencia === 'up' ? (
                          <div className="flex items-center px-2 py-1 bg-emerald-100 rounded-full">
                            <TrendingUp className="w-3 h-3 text-emerald-600 mr-1" />
                            <span className="text-xs font-semibold text-emerald-600">
                              +{stat.mudanca}%
                            </span>
                          </div>
                        ) : stat.tendencia === 'down' ? (
                          <div className="flex items-center px-2 py-1 bg-red-100 rounded-full">
                            <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                            <span className="text-xs font-semibold text-red-600">
                              {stat.mudanca}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full">
                            <Activity className="w-3 h-3 text-gray-600 mr-1" />
                            <span className="text-xs font-semibold text-gray-600">
                              {stat.mudanca}%
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">vs mês anterior</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Atividade Recente */}
              <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Atividades Recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {atividadesRecentes.map((atividade) => (
                      <div key={atividade.id} className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border border-gray-100/50">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            {obterIconeStatus(atividade.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-2">{atividade.descricao}</p>
                          <div className="flex items-center gap-3">
                            <Badge className={`${obterCorTipo(atividade.tipo)} px-2 py-1 text-xs font-medium rounded-full`} variant="outline">
                              {atividade.tipo}
                            </Badge>
                            <span className="text-xs text-gray-500 font-medium">{atividade.tempo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-medium rounded-xl">
                    Ver Todas as Atividades
                  </Button>
                </CardContent>
              </Card>

              {/* Status do Sistema */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Status do Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Banco de Dados</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full">
                        Online
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">API Supabase</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full">
                        Conectado
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Activity className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Último Backup</span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">há 2 horas</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Próxima Manutenção</span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">em 3 dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acesso Rápido aos Módulos */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Acesso Rápido aos Módulos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200/50"
                    onClick={() => setAbaSelecionada('patrocinadores')}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Patrocinadores</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-emerald-200/50"
                    onClick={() => setAbaSelecionada('expositores')}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Expositores</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-purple-200/50"
                    onClick={() => setAbaSelecionada('crm')}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">CRM</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div 
                    className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-amber-200/50"
                    onClick={() => setAbaSelecionada('relatorios')}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Relatórios</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Módulo Patrocinadores */}
          <TabsContent value="patrocinadores">
            <AdminPatrocinadores />
          </TabsContent>

          {/* Módulo Expositores */}
          <TabsContent value="expositores">
            <AdminExpositores />
          </TabsContent>

          {/* Módulo CRM */}
          <TabsContent value="crm">
            <AdminCRM />
          </TabsContent>

          {/* Módulo Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Relatórios e Análises</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Relatório de Patrocinadores</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-emerald-200/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Relatório de Expositores</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-purple-200/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Relatório de Contatos</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-amber-200/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Análise de Vendas</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-100 hover:from-teal-100 hover:to-cyan-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-teal-200/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Relatório Mensal</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 hover:from-slate-100 hover:to-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-slate-200/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Exportar Dados</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Módulo Configurações */}
          <TabsContent value="configuracoes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Configurações Gerais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Configurações da Aplicação</span>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border border-emerald-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Gerenciar Usuários</span>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border border-purple-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Configurar Notificações</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Manutenção</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="group bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border border-amber-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <RefreshCw className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Limpar Cache</span>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border border-green-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Backup Manual</span>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 border border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Logs do Sistema</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;