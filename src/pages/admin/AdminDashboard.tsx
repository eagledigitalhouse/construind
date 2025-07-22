import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, BarChart3, Settings, Plus, Edit, Eye, MessageSquare, LayoutDashboard,
  Search, Bell, TrendingUp, TrendingDown, Activity, Calendar, Clock, CheckCircle,
  AlertCircle, RefreshCw, FileText, Download, HelpCircle, Filter, Mail, LogOut, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatrocinadores } from '@/hooks/usePatrocinadores';
import { useExpositores } from '@/hooks/useExpositores';
import { useCotasPatrocinio } from '@/hooks/useCotasPatrocinio';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

import { toast } from 'sonner';

// Componentes dos módulos
import AdminPatrocinadores from './AdminPatrocinadores';
import AdminExpositores from './AdminExpositores';
import AdminPreInscricaoExpositores from './AdminPreInscricaoExpositores';
import AdminStands from './AdminStands';
import AdminNewsletter from './AdminNewsletter';


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
  tipo: 'patrocinador' | 'expositor' | 'sistema';
  descricao: string;
  tempo: string;
  status: 'sucesso' | 'pendente' | 'erro';
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [termoBusca, setTermoBusca] = useState('');
  const [notificacoes, setNotificacoes] = useState(3);
  const [atualizandoDados, setAtualizandoDados] = useState(false);
  
  // Hooks dos módulos
  const { patrocinadores, loading: loadingPatrocinadores, patrocinadorPorCategoria } = usePatrocinadores();
  const { expositores, loading: loadingExpositores } = useExpositores();
  const { cotas, loading: loadingCotas } = useCotasPatrocinio();
  const { user, signOut } = useAuth();

  // Funções do cabeçalho
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getUserInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || 'AD';
  };

  const getUserDisplayName = (email: string) => {
    return email?.split('@')[0] || 'Admin';
  };
  
  // Estatísticas simples
  const totalPatrocinadores = patrocinadores?.length || 0;
  const totalExpositores = expositores?.length || 0;

  const atualizarDados = async () => {
    setAtualizandoDados(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Dados atualizados!');
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
      title: 'Pré-Inscrições de Expositores',
      description: 'Gerenciar e aprovar pré-inscrições recebidas',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-orange-500',
      link: '/admin/pre-inscricao-expositores',
      actions: [
        { label: 'Ver inscrições', icon: <Eye className="w-4 h-4" />, link: '/admin/pre-inscricao-expositores' },
        { label: 'Pendentes', icon: <Clock className="w-4 h-4" />, link: '/admin/pre-inscricao-expositores?status=pendente' }
      ]
    },
    {
      title: 'Gerenciar Newsletter',
      description: 'Visualize e exporte os emails cadastrados na newsletter',
      icon: <Mail className="w-8 h-8" />,
      color: 'bg-indigo-500',
      link: '/admin/newsletter',
      actions: [
        { label: 'Ver todos', icon: <Eye className="w-4 h-4" />, link: '/admin/newsletter' },
        { label: 'Exportar emails', icon: <Download className="w-4 h-4" />, link: '/admin/newsletter' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="mb-8">
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
            {/* Menu do Usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#00d856] text-white font-medium">
                      {user?.email ? getUserInitials(user.email) : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.email ? getUserDisplayName(user.email) : 'Administrador'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'admin@fespin.com'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="patrocinadores" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Patrocinadores
            </TabsTrigger>
            <TabsTrigger value="expositores" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Expositores
            </TabsTrigger>
            <TabsTrigger value="stands" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Stands
            </TabsTrigger>
            <TabsTrigger value="pre-inscricoes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Pré-Inscrições
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Estatísticas Elegantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Patrocinadores */}
              <Card className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Patrocinadores</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {totalPatrocinadores}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center px-2 py-1 bg-emerald-100 rounded-full">
                      <TrendingUp className="w-3 h-3 text-emerald-600 mr-1" />
                      <span className="text-xs font-semibold text-emerald-600">
                        +12%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Expositores */}
              <Card className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Expositores</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {totalExpositores}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center px-2 py-1 bg-emerald-100 rounded-full">
                        <TrendingUp className="w-3 h-3 text-emerald-600 mr-1" />
                        <span className="text-xs font-semibold text-emerald-600">
                          +8%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cota Principal */}
              <Card className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Cota Principal</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {loadingCotas ? '...' : (cotas.length > 0 ? patrocinadorPorCategoria(cotas[0].id).length : 0)}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center px-2 py-1 bg-emerald-100 rounded-full">
                        <TrendingUp className="w-3 h-3 text-emerald-600 mr-1" />
                        <span className="text-xs font-semibold text-emerald-600">
                          +15%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>
 
               {/* Categorias Ativas */}
               <Card className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                 <CardContent className="relative p-6">
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex-1">
                       <p className="text-sm font-medium text-gray-600 mb-1">Categorias Ativas</p>
                       <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                         {loadingExpositores ? '...' : new Set(expositores.map(e => e.categoria)).size}
                       </p>
                     </div>
                     <div className="bg-purple-100 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                       <Settings className="w-6 h-6 text-purple-600" />
                     </div>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center">
                       <div className="flex items-center px-2 py-1 bg-emerald-100 rounded-full">
                         <TrendingUp className="w-3 h-3 text-emerald-600 mr-1" />
                         <span className="text-xs font-semibold text-emerald-600">
                           +10%
                         </span>
                       </div>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">vs mês anterior</span>
                   </div>
                 </CardContent>
               </Card>
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
                    {/* Placeholder for recent activities */}
                    <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border border-gray-100/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-2">Novo patrocinador cadastrado: Empresa XYZ</p>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full" variant="outline">
                            patrocinador
                          </Badge>
                          <span className="text-xs text-gray-500 font-medium">há 2 horas</span>
                        </div>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border border-gray-100/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-2">Expositor atualizado: Academia Fitness</p>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full" variant="outline">
                            expositor
                          </Badge>
                          <span className="text-xs text-gray-500 font-medium">há 6 horas</span>
                        </div>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border border-gray-100/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-2">Backup automático realizado</p>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-full" variant="outline">
                            sistema
                          </Badge>
                          <span className="text-xs text-gray-500 font-medium">há 8 horas</span>
                        </div>
                      </div>
                    </div>
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
                    onClick={() => setActiveTab('patrocinadores')}
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
                    onClick={() => setActiveTab('expositores')}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-center">Expositores</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patrocinadores Tab */}
          <TabsContent value="patrocinadores" className="space-y-6">
            <AdminPatrocinadores />
          </TabsContent>

          {/* Expositores Tab */}
          <TabsContent value="expositores" className="space-y-6">
            <AdminExpositores />
          </TabsContent>

          {/* Stands Tab */}
          <TabsContent value="stands" className="space-y-6">
            <AdminStands />
          </TabsContent>

          {/* Pré-Inscrições de Expositores Tab */}
          <TabsContent value="pre-inscricoes" className="space-y-6">
            <AdminPreInscricaoExpositores />
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter" className="space-y-6">
            <AdminNewsletter />
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="configuracoes" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;