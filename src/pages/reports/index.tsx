import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  Share,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Users,
  DollarSign,
  Target,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import PageHeader from '@/components/layout/PageHeader';


// Mock data - same structure as EventAll
const revenueData = [
  { month: 'Jan', receita: 65000, meta: 70000, eventos: 8 },
  { month: 'Fev', receita: 72000, meta: 75000, eventos: 9 },
  { month: 'Mar', receita: 68000, meta: 72000, eventos: 7 },
  { month: 'Abr', receita: 85000, meta: 80000, eventos: 11 },
  { month: 'Mai', receita: 92000, meta: 85000, eventos: 12 },
  { month: 'Jun', receita: 78000, meta: 82000, eventos: 10 },
  { month: 'Jul', receita: 95000, meta: 90000, eventos: 13 },
  { month: 'Ago', receita: 88000, meta: 88000, eventos: 11 },
  { month: 'Set', receita: 102000, meta: 95000, eventos: 14 },
  { month: 'Out', receita: 96000, meta: 92000, eventos: 12 },
  { month: 'Nov', receita: 108000, meta: 100000, eventos: 15 },
  { month: 'Dez', receita: 115000, meta: 105000, eventos: 16 },
];

const eventsByCategory = [
  { name: 'Corporativo', value: 45, color: '#8B5CF6' },
  { name: 'Social', value: 30, color: '#10B981' },
  { name: 'Educacional', value: 15, color: '#06B6D4' },
  { name: 'Cultural', value: 10, color: '#F59E0B' },
];

const topEvents = [
  { name: 'Conferência Tech 2024', participants: 1250, revenue: 125000, satisfaction: 4.8 },
  { name: 'Workshop Marketing Digital', participants: 850, revenue: 85000, satisfaction: 4.6 },
  { name: 'Seminário Inovação', participants: 650, revenue: 65000, satisfaction: 4.7 },
  { name: 'Treinamento Liderança', participants: 420, revenue: 42000, satisfaction: 4.5 },
  { name: 'Palestra Sustentabilidade', participants: 380, revenue: 38000, satisfaction: 4.4 },
];

const documentsData = [
  { mes: 'Jan', assinados: 12, renovados: 8, cancelados: 2 },
  { mes: 'Fev', assinados: 15, renovados: 10, cancelados: 1 },
  { mes: 'Mar', assinados: 18, renovados: 12, cancelados: 3 },
  { mes: 'Abr', assinados: 22, renovados: 15, cancelados: 2 },
  { mes: 'Mai', assinados: 25, renovados: 18, cancelados: 4 },
  { mes: 'Jun', assinados: 20, renovados: 14, cancelados: 2 },
];

const entitiesGrowth = [
  { mes: 'Jan', total: 1250, novos: 85 },
  { mes: 'Fev', total: 1335, novos: 92 },
  { mes: 'Mar', total: 1427, novos: 78 },
  { mes: 'Abr', total: 1505, novos: 105 },
  { mes: 'Mai', total: 1610, novos: 118 },
  { mes: 'Jun', total: 1728, novos: 95 },
];

const performanceMetrics = [
  { subject: 'Vendas', A: 85, B: 78 },
  { subject: 'Marketing', A: 92, B: 88 },
  { subject: 'Operações', A: 78, B: 82 },
  { subject: 'Suporte', A: 88, B: 85 },
  { subject: 'Qualidade', A: 95, B: 90 },
  { subject: 'Inovação', A: 82, B: 75 },
];

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name?.includes('receita') || entry.name?.includes('meta') 
              ? formatCurrency(entry.value) 
              : formatNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Mock API calls - replace with real API endpoints
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['reports-summary', selectedPeriod],
    queryFn: () => Promise.resolve({
      totalRevenue: 1024000,
      totalEvents: 138,
      totalParticipants: 12450,
      conversionRate: 12.8
    })
  });

  const handleExportReport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
    // Implement export logic here
  };

  const handleRefreshData = () => {
    console.log('Refreshing data...');
    // Implement refresh logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1">
          <div className="p-8 space-y-8">
            {/* Header */}
            <PageHeader 
              title="Relatórios"
              description="Análise completa de performance e métricas"
              icon={BarChart3}
              actions={[
                {
                  label: "Voltar",
                  icon: ArrowLeft,
                  variant: "outline",
                  onClick: () => navigate("/financial")
                },
                {
                  label: "Exportar",
                  icon: Download,
                  variant: "default",
                  onClick: () => handleExportReport('pdf')
                }
              ]}
            />
            
            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex items-center space-x-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedPeriod === 'custom' && (
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Selecionar Período
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={{ from: dateRange.from || undefined, to: dateRange.to || undefined }}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                
                <Button onClick={handleRefreshData} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {summaryData ? formatCurrency(summaryData.totalRevenue) : '...'}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+12.5%</span>
                        <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Eventos Realizados</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {summaryData ? formatNumber(summaryData.totalEvents) : '...'}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+8.2%</span>
                        <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Participantes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {summaryData ? formatNumber(summaryData.totalParticipants) : '...'}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+15.3%</span>
                        <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {summaryData ? `${summaryData.conversionRate}%` : '...'}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600 font-medium">-2.1%</span>
                        <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200">
                  <TabsList className="grid w-full grid-cols-5 bg-transparent h-auto p-0">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent py-4 px-6"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Visão Geral
                    </TabsTrigger>
                    <TabsTrigger 
                      value="revenue" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent py-4 px-6"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Receita
                    </TabsTrigger>
                    <TabsTrigger 
                      value="events" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent py-4 px-6"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Eventos
                    </TabsTrigger>
                    <TabsTrigger 
                      value="entities" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent py-4 px-6"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Entidades
                    </TabsTrigger>
                    <TabsTrigger 
                      value="performance" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none border-b-2 border-transparent py-4 px-6"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Performance
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Evolução da Receita</CardTitle>
                        <CardDescription>Receita mensal vs meta estabelecida</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `R$ ${typeof value === 'number' && !isNaN(value) ? (value/1000).toFixed(0) : '0'}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                              type="monotone" 
                              dataKey="receita" 
                              stroke="#8B5CF6" 
                              fill="#8B5CF6" 
                              fillOpacity={0.2}
                              strokeWidth={2}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="meta" 
                              stroke="#06B6D4" 
                              fill="#06B6D4" 
                              fillOpacity={0.1}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Eventos por Categoria</CardTitle>
                        <CardDescription>Distribuição dos tipos de eventos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={eventsByCategory}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {eventsByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {eventsByCategory.map((category, index) => (
                            <div key={index} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="text-sm text-gray-600">{category.name}</span>
                              <span className="text-sm font-medium text-gray-900 ml-auto">{category.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top 5 Events */}
                  <Card className="border border-gray-200 rounded-2xl">
                    <CardHeader>
                      <CardTitle>Top 5 Eventos</CardTitle>
                      <CardDescription>Eventos com melhor performance no período</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Evento</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-900">Participantes</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-900">Receita</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-900">Satisfação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topEvents.map((event, index) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                      index === 1 ? 'bg-gray-100 text-gray-600' :
                                      index === 2 ? 'bg-orange-100 text-orange-600' :
                                      'bg-blue-100 text-blue-600'
                                    }`}>
                                      {index + 1}
                                    </div>
                                    <span className="font-medium text-gray-900">{event.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600">{formatNumber(event.participants)}</td>
                                <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(event.revenue)}</td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end">
                                    <span className="text-sm font-medium text-gray-900 mr-1">{event.satisfaction}</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-xs ${i < Math.floor(event.satisfaction) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Revenue Tab */}
                <TabsContent value="revenue" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Receita Detalhada</CardTitle>
                        <CardDescription>Análise mensal de receita e metas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `R$ ${typeof value === 'number' && !isNaN(value) ? (value/1000).toFixed(0) : '0'}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="receita" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="meta" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Card className="border border-gray-200 rounded-2xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Resumo Financeiro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Receita Total</span>
                            <span className="font-semibold text-gray-900">R$ 847.200</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Meta Anual</span>
                            <span className="font-semibold text-gray-900">R$ 1.200.000</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">% da Meta</span>
                            <Badge className="bg-green-100 text-green-800">70.6%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ticket Médio</span>
                            <span className="font-semibold text-gray-900">R$ 11.605</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200 rounded-2xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Projeção</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">R$ 1.185.000</div>
                            <div className="text-sm text-gray-600">Receita prevista 2025</div>
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="text-xs text-blue-800 font-medium">98.8% da meta anual</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Events Tab */}
                <TabsContent value="events" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Eventos por Mês</CardTitle>
                        <CardDescription>Quantidade de eventos realizados</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="eventos" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Status dos Eventos</CardTitle>
                        <CardDescription>Distribuição por status atual</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                              <span className="font-medium text-green-900">Concluídos</span>
                            </div>
                            <span className="text-green-600 font-bold">67</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                              <span className="font-medium text-blue-900">Em Andamento</span>
                            </div>
                            <span className="text-blue-600 font-bold">6</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                              <span className="font-medium text-yellow-900">Planejamento</span>
                            </div>
                            <span className="text-yellow-600 font-bold">12</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                              <span className="font-medium text-purple-900">Agendados</span>
                            </div>
                            <span className="text-purple-600 font-bold">8</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Entities Tab */}
                <TabsContent value="entities" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Crescimento de Entidades</CardTitle>
                        <CardDescription>Evolução do banco de entidades</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={entitiesGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                              type="monotone" 
                              dataKey="total" 
                              stroke="#8B5CF6" 
                              strokeWidth={3}
                              dot={{ r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="novos" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Contratos</CardTitle>
                        <CardDescription>Performance dos contratos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={documentsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="assinados" fill="#10B981" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="renovados" fill="#06B6D4" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="cancelados" fill="#EF4444" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-gray-200 rounded-2xl">
                      <CardHeader>
                        <CardTitle>Métricas de Performance</CardTitle>
                        <CardDescription>Análise comparativa trimestral</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={performanceMetrics}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                              name="Q4 2024"
                              dataKey="A"
                              stroke="#8B5CF6"
                              fill="#8B5CF6"
                              fillOpacity={0.2}
                              strokeWidth={2}
                            />
                            <Radar
                              name="Q3 2024"
                              dataKey="B"
                              stroke="#06B6D4"
                              fill="#06B6D4"
                              fillOpacity={0.1}
                              strokeWidth={2}
                            />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Card className="border border-gray-200 rounded-2xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">KPIs Principais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { label: 'ROI Médio', value: '245%', trend: 'up', color: 'green' },
                            { label: 'NPS Score', value: '67', trend: 'up', color: 'blue' },
                            { label: 'Retenção', value: '89%', trend: 'down', color: 'orange' },
                            { label: 'Conversão', value: '12.8%', trend: 'up', color: 'purple' },
                          ].map((kpi, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">{kpi.label}</span>
                              <div className="flex items-center">
                                <span className={`font-bold mr-2 ${
                                  kpi.color === 'green' ? 'text-green-600' :
                                  kpi.color === 'blue' ? 'text-blue-600' :
                                  kpi.color === 'orange' ? 'text-orange-600' :
                                  'text-purple-600'
                                }`}>
                                  {kpi.value}
                                </span>
                                {kpi.trend === 'up' ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200 rounded-2xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Ações Recomendadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="text-sm font-medium text-blue-900">Otimizar conversão</div>
                              <div className="text-xs text-blue-700">Implementar A/B tests nas landing pages</div>
                            </div>
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="text-sm font-medium text-green-900">Expandir marketing</div>
                              <div className="text-xs text-green-700">ROI positivo permite mais investimento</div>
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="text-sm font-medium text-yellow-900">Revisar retenção</div>
                              <div className="text-xs text-yellow-700">Implementar programa de fidelidade</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Export Actions */}
            <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2 text-blue-600" />
                  Exportar Relatórios
                </CardTitle>
                <CardDescription>
                  Baixe os relatórios em diferentes formatos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportReport('pdf')}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportReport('excel')}
                    className="flex items-center"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportReport('csv')}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar por Email
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}