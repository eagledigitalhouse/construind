import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { useToast } from "../../../hooks/use-toast";
import { expenses, getExpensesByStatus, searchExpenses } from "../../../data/financialData";
import PageHeader from "../../../components/layout/PageHeader";
import {
  Receipt,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Download,
  Send,
} from "lucide-react";

interface Expense {
  id: number;
  description: string;
  supplier: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  category: string;
  eventName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExpensesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Use mock data
  const expensesData = expenses;

  // Calculate summary stats
  const totalExpenses = expensesData.length;
  const paidExpenses = expensesData.filter(exp => exp.status === 'paid');
  const pendingExpenses = expensesData.filter(exp => exp.status === 'pending');
  const overdueExpenses = expensesData.filter(exp => exp.status === 'overdue');

  const totalAmount = expensesData.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const paidAmount = paidExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const pendingAmount = pendingExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const overdueAmount = overdueExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Filter expenses based on search
  const filteredExpenses = searchTerm ? searchExpenses(searchTerm) : expensesData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { 
        label: 'A Pagar', 
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Clock 
      },
      paid: { 
        label: 'Paga', 
        className: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle2 
      },
      overdue: { 
        label: 'Vencida', 
        className: 'bg-red-100 text-red-700 border-red-200',
        icon: AlertCircle 
      },
      cancelled: { 
        label: 'Cancelada', 
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: XCircle 
      }
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.className} font-medium px-3 py-1 text-xs rounded-full border`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleExpenseAction = (expense: Expense, action: string) => {
    setSelectedExpense(expense);
    
    switch (action) {
      case 'view':
        setIsDetailModalOpen(true);
        break;
      case 'edit':
        navigate(`/financial/expenses/${expense.id}/edit`);
        break;
      case 'delete':
        toast({
          title: "Despesa excluída",
          description: "A despesa foi excluída com sucesso.",
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <PageHeader 
              title="Lista de Despesas"
              description="Gerencie todas as despesas dos seus eventos"
              icon={Receipt}
              actions={[
                {
                  label: "Voltar",
                  icon: ArrowLeft,
                  variant: "outline",
                  onClick: () => navigate("/financial")
                },
                {
                  label: "Nova Despesa",
                  icon: Plus,
                  variant: "default",
                  onClick: () => navigate("/financial/expenses/create")
                }
              ]}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{totalExpenses} despesas</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pagas</p>
                    <p className="text-2xl font-bold text-gray-900">{paidExpenses.length} despesas</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(paidAmount)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingExpenses.length} despesas</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(pendingAmount)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Vencidas</p>
                    <p className="text-2xl font-bold text-gray-900">{overdueExpenses.length} despesas</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(overdueAmount)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="🔍 pesquisar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Expenses Table */}
            <Card className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 w-16">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">DESCRIÇÃO</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">FORNECEDOR</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">CATEGORIA</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center w-32">VALOR</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center w-32">STATUS</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center w-32">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="py-6 px-6">
                        <span className="font-medium text-gray-900 text-sm">{expense.id.toString().padStart(3, '0')}</span>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{expense.description}</div>
                          {expense.eventName && (
                            <div className="text-sm text-gray-500 mt-1">{expense.eventName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <span className="text-gray-900 font-medium">{expense.supplier}</span>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 px-6 text-center">
                        <span className="font-medium text-gray-900">R$ {Math.round(Number(expense.amount))}</span>
                      </TableCell>
                      <TableCell className="py-6 px-6 text-center">
                        {getStatusBadge(expense.status)}
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExpenseAction(expense, 'view')}
                            className="w-8 h-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExpenseAction(expense, 'edit')}
                            className="w-8 h-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExpenseAction(expense, 'delete')}
                            className="w-8 h-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredExpenses.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'Tente ajustar sua pesquisa' : 'Comece registrando sua primeira despesa'}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => navigate("/financial/expenses/create")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Despesa
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Expense Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Detalhes da Despesa</DialogTitle>
                  <DialogDescription>
                    Informações completas da despesa selecionada
                  </DialogDescription>
                </DialogHeader>
                
                {selectedExpense && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">ID</label>
                        <p className="text-lg font-semibold text-gray-900">#{selectedExpense.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          {getStatusBadge(selectedExpense.status)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fornecedor</label>
                        <p className="text-gray-900">{selectedExpense.supplier}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Valor</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(selectedExpense.amount)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                        <p className="text-gray-900">
                          {new Date(selectedExpense.issueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Vencimento</label>
                        <p className="text-gray-900">
                          {new Date(selectedExpense.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Descrição</label>
                      <p className="text-gray-900 mt-1">{selectedExpense.description}</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 bg-red-600 hover:bg-red-700">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Recibo
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Marcar como Paga
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            
          </div>
        </main>
      </div>
    </div>
  );
}