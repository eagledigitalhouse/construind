import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Receipt,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { getFinancialSummary, getCashflowData, getUrgentActions } from "@/data/financialData";

export default function FinancialCenter() {
  const navigate = useNavigate();

  // Fetch financial data
  const { data: financialSummary = {}, isLoading } = useQuery<{
    totalBalance: number;
    totalReceivable: number;
    totalPayable: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    invoicesCount: { total: number; paid: number; pending: number; overdue: number };
    expensesCount: { total: number; paid: number; pending: number; overdue: number };
  }>({
    queryKey: ["/api/financial/summary"],
  });

  const { data: cashflowData = [] } = useQuery<Array<{
    date: string;
    inflow: number;
    outflow: number;
    balance: number;
  }>>({
    queryKey: ["/api/financial/cashflow"],
  });

  const { data: urgentActions = [] } = useQuery<Array<{
    type: 'invoice' | 'expense';
    id: number;
    title: string;
    amount: number;
    dueDate: string;
    status: string;
  }>>({
    queryKey: ["/api/financial/urgent-actions"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="flex">
        <main className="flex-1 p-6 lg:px-8 xl:px-16 2xl:px-24">
          <div className="max-w-none space-y-6 lg:space-y-8">
            
            {/* Page Header */}
            <PageHeader 
              title="Centro Financeiro"
              description="Visão completa das suas finanças"
              icon={DollarSign}
              actions={[
                {
                  label: "Relatórios",
                  icon: BarChart3,
                  variant: "outline",
                  onClick: () => navigate("/financial/reports")
                },
                {
                  label: "Gerenciar Faturas",
                  icon: FileText,
                  variant: "default",
                  onClick: () => navigate("/financial/invoices")
                }
              ]}
            />

            {/* Acesso Rápido - Minimalista */}
            <div className="mb-10 mt-4">
              <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="bg-gray-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                    </span>
                    Acesso Rápido
                  </h2>
                  <span className="text-sm text-gray-400">Gerencie suas finanças com facilidade</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card Faturas */}
                  <button
                    onClick={() => navigate("/financial/invoices")}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-5 w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <span className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Faturas</span>
                        <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 font-medium">{financialSummary.invoicesCount?.total || 0}</span>
                      </div>
                      <span className="text-xs text-gray-500">Gerencie suas cobranças</span>
                    </div>
                  </button>
                  {/* Card Despesas */}
                  <button
                    onClick={() => navigate("/financial/expenses")}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-5 w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <span className="bg-red-100 p-2 rounded-lg">
                      <Receipt className="h-5 w-5 text-red-500" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Despesas</span>
                        <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 font-medium">{financialSummary.expensesCount?.total || 0}</span>
                      </div>
                      <span className="text-xs text-gray-500">Controle seus gastos</span>
                    </div>
                  </button>
                  {/* Card Relatórios */}
                  <button
                    onClick={() => navigate("/financial/reports")}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition p-5 w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <span className="bg-purple-100 p-2 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Relatórios</span>
                        <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 font-medium">Analytics</span>
                      </div>
                      <span className="text-xs text-gray-500">Analise seus dados</span>
                    </div>
                  </button>
                  {/* Card Nova Fatura */}
                  <button
                    onClick={() => navigate("/financial/invoices?action=create")}
                    className="flex items-center gap-4 bg-green-600 hover:bg-green-700 transition text-white rounded-xl shadow-sm p-5 w-full text-left focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    <span className="bg-white/20 p-2 rounded-lg">
                      <Plus className="h-5 w-5 text-white" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Nova Fatura</span>
                        <span className="text-xs bg-white/20 text-white rounded px-2 py-0.5 font-medium">Novo</span>
                      </div>
                      <span className="text-xs text-white/90">Criar agora</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Métricas com gráficos minimalistas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card Saldo Atual */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">SALDO ATUAL</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(financialSummary.totalBalance || 0)}</div>
                    <div className="text-xs text-gray-400">Disponível para uso</div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="w-full h-14 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { valor: 8 }, { valor: 12 }, { valor: 6 }, { valor: 16 }, { valor: 10 }, { valor: 14 }
                    ]}>
                      <Bar dataKey="valor" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                    </div>
                    </div>
              {/* Card A Receber */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">A RECEBER</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(financialSummary.totalReceivable || 0)}</div>
                    <div className="text-xs text-gray-400">Faturas pendentes</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <ArrowDownRight className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="w-full h-14 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { valor: 5 }, { valor: 7 }, { valor: 6 }, { valor: 10 }, { valor: 8 }, { valor: 12 }
                    ]}>
                      <Line type="monotone" dataKey="valor" stroke="#818cf8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                    </div>
                    </div>
              {/* Card A Pagar */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">A PAGAR</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(financialSummary.totalPayable || 0)}</div>
                    <div className="text-xs text-gray-400">Despesas pendentes</div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <ArrowUpRight className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="w-full h-14 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { valor: 4 }, { valor: 9 }, { valor: 7 }, { valor: 5 }, { valor: 11 }, { valor: 6 }
                    ]}>
                      <Bar dataKey="valor" fill="#f472b6" radius={[6, 6, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts and Actions Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Cashflow Chart */}
              <div className="xl:col-span-2">
                <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">Fluxo de Caixa - Próximos 30 Dias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={cashflowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelFormatter={(label) => `Data: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="inflow" 
                          stackId="1"
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.6}
                          name="Entradas"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="outflow" 
                          stackId="2"
                          stroke="#EF4444" 
                          fill="#EF4444" 
                          fillOpacity={0.6}
                          name="Saídas"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Urgent Actions */}
              <div>
                <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                      Ações Urgentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {urgentActions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p className="font-medium">Tudo em dia!</p>
                        <p className="text-sm">Nenhuma ação urgente necessária</p>
                      </div>
                    ) : (
                      urgentActions.map((action) => (
                        <div key={`${action.type}-${action.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              action.type === 'invoice' ? 'bg-blue-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                              <p className="text-xs text-gray-500">
                                Vence em {formatDate(action.dueDate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">
                              {formatCurrency(action.amount)}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {action.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}