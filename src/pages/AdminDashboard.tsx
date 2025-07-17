import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, BarChart3, Settings, Plus, Edit, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { usePatrocinadores } from '@/hooks/usePatrocinadores';
import { useExpositores } from '@/hooks/useExpositores';
import { useCotasPatrocinio } from '@/hooks/useCotasPatrocinio';

const AdminDashboard: React.FC = () => {
  const { patrocinadores, isLoading: loadingPatrocinadores, patrocinadorPorCategoria } = usePatrocinadores();
  const { expositores, isLoading: loadingExpositores } = useExpositores();
  const { cotas, loading: loadingCotas } = useCotasPatrocinio();

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
      title: 'Visualizar Páginas Públicas',
      description: 'Ver como os dados aparecem nas páginas públicas',
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/expositores',
      actions: [
        { label: 'Página Expositores', icon: <Eye className="w-4 h-4" />, link: '/expositores' },
        { label: 'Página Principal', icon: <Eye className="w-4 h-4" />, link: '/' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie patrocinadores e expositores da FESPIN 2025</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} text-white p-3 rounded-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`${action.color} text-white p-2 rounded-lg`}>
                    {action.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">{action.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {action.actions.map((subAction, subIndex) => (
                    <Link key={subIndex} to={subAction.link}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 hover:bg-gray-50"
                      >
                        {subAction.icon}
                        {subAction.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumo Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Patrocinadores por Cota</h4>
                <div className="space-y-2">
                  {loadingCotas ? (
                    <p className="text-gray-500">Carregando...</p>
                  ) : (
                    cotas.slice(0, 4).map(cota => {
                      const count = loadingPatrocinadores ? 0 : patrocinadorPorCategoria(cota.id).length;
                      return (
                        <div key={cota.id} className="flex justify-between items-center">
                          <span className="text-gray-600">{cota.nome}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Expositores por Categoria</h4>
                <div className="space-y-2">
                  {loadingExpositores ? (
                    <p className="text-gray-500">Carregando...</p>
                  ) : (
                    Array.from(new Set(expositores.map(e => e.categoria))).slice(0, 5).map(categoria => {
                      const count = expositores.filter(e => e.categoria === categoria).length;
                      return (
                        <div key={categoria} className="flex justify-between items-center">
                          <span className="text-gray-600 truncate">{categoria}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;