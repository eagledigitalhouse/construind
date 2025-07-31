import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/layout/PageHeader";
import {
  FileText,
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
  MoreVertical,
} from "lucide-react";
import { getInvoices, searchInvoices, filterInvoicesByStatus } from "@/data/financialData";

interface Invoice {
  id: number;
  number: string;
  entityId: number;
  eventId: number;
  
  source: string;
  description: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';
  paymentTerms: number;
  lateFeesPercent: number;
  discountPercent: number;
  discountDueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  notes?: string;
  internalNotes?: string;
  pdfUrl?: string;
  attachments: any[];
  sentAt?: string;
  lastViewedAt?: string;
  remindersSent: number;
  lastReminderAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  entity: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  event: {
    id: number;
    name: string;
    startDate: string;
  };
}

export default function InvoicesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'paid' | 'overdue' | 'draft'>('all');

  // Fetch invoices using mock data
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  // Calculate summary stats
  const totalInvoices = invoices.length;
  const shippedInvoices = invoices.filter(inv => inv.status === 'sent');
  const deliveredInvoices = invoices.filter(inv => inv.status === 'paid');
  const pendingInvoices = invoices.filter(inv => inv.status === 'overdue');

  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const shippedAmount = shippedInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const deliveredAmount = deliveredInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

  // Apply active filter first, then search filter
  const getFilteredInvoices = () => {
    let filtered = invoices;
    
    // Apply status filter
    switch (activeFilter) {
      case 'sent':
        filtered = invoices.filter(inv => inv.status === 'sent');
        break;
      case 'paid':
        filtered = invoices.filter(inv => inv.status === 'paid');
        break;
      case 'overdue':
        filtered = invoices.filter(inv => inv.status === 'overdue');
        break;
      case 'draft':
        filtered = invoices.filter(inv => inv.status === 'draft');
        break;
      case 'all':
      default:
        filtered = invoices;
        break;
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.event.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      draft: { 
        label: 'Rascunho', 
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: FileText 
      },
      sent: { 
        label: 'Enviada', 
        className: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle2 
      },
      paid: { 
        label: 'Paga', 
        className: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: CheckCircle2 
      },
      overdue: { 
        label: 'Vencida', 
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Clock 
      },
      cancelled: { 
        label: 'Cancelada', 
        className: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle 
      }
    };

    const config = configs[status as keyof typeof configs] || configs.draft;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.className} font-medium px-3 py-1 text-xs rounded-full border`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleInvoiceAction = (invoice: Invoice, action: string) => {
    setSelectedInvoice(invoice);
    
    switch (action) {
      case 'view':
        setIsDetailModalOpen(true);
        break;
      case 'edit':
        navigate(`/financial/invoices/${invoice.id}/edit`);
        break;
      case 'delete':
        // Handle delete
        toast({
          title: "Fatura excluída",
          description: "A fatura foi excluída com sucesso.",
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="flex">
        <main className="flex-1 p-6 lg:px-8 xl:px-16 2xl:px-24">
          <div className="max-w-none space-y-6 lg:space-y-8">
            
            {/* Page Header */}
            <PageHeader 
              title="Faturas"
              description="Controle de faturas e pagamentos"
              icon={FileText}
              actions={[
                {
                  label: "Voltar",
                  icon: ArrowLeft,
                  variant: "outline",
                  onClick: () => navigate("/financial")
                },
                {
                  label: "Nova Fatura",
                  icon: Plus,
                  variant: "default",
                  onClick: () => navigate("/financial/invoices/create")
                }
              ]}
            />

            {/* Summary Cards - Abas Filtráveis */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card 
                className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 group ${
                  activeFilter === 'all' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg -translate-y-1' 
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-white/20' 
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <FileText className={`h-6 w-6 ${
                      activeFilter === 'all' ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium uppercase tracking-wide ${
                      activeFilter === 'all' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Total</p>
                    <p className={`text-2xl font-bold transition-colors ${
                      activeFilter === 'all' 
                        ? 'text-white' 
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>{totalInvoices} faturas</p>
                    <p className={`text-lg font-semibold ${
                      activeFilter === 'all' ? 'text-blue-100' : 'text-gray-700'
                    }`}>
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
                {activeFilter === 'all' && (
                  <div className="mt-3 text-xs text-blue-100">
                    ✓ Filtro ativo
                  </div>
                )}
              </Card>

              <Card 
                className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 group ${
                  activeFilter === 'sent' 
                    ? 'bg-green-500 text-white border-green-500 shadow-lg -translate-y-1' 
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-green-300 hover:-translate-y-1'
                }`}
                onClick={() => setActiveFilter('sent')}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    activeFilter === 'sent' 
                      ? 'bg-white/20' 
                      : 'bg-green-100 group-hover:bg-green-200'
                  }`}>
                    <CheckCircle2 className={`h-6 w-6 ${
                      activeFilter === 'sent' ? 'text-white' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium uppercase tracking-wide ${
                      activeFilter === 'sent' ? 'text-green-100' : 'text-gray-600'
                    }`}>Enviadas</p>
                    <p className={`text-2xl font-bold transition-colors ${
                      activeFilter === 'sent' 
                        ? 'text-white' 
                        : 'text-gray-900 group-hover:text-green-600'
                    }`}>{shippedInvoices.length} faturas</p>
                    <p className={`text-lg font-semibold ${
                      activeFilter === 'sent' ? 'text-green-100' : 'text-gray-700'
                    }`}>
                      {formatCurrency(shippedAmount)}
                    </p>
                  </div>
                </div>
                {activeFilter === 'sent' && (
                  <div className="mt-3 text-xs text-green-100">
                    ✓ Filtro ativo
                  </div>
                )}
              </Card>

              <Card 
                className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 group ${
                  activeFilter === 'paid' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg -translate-y-1' 
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1'
                }`}
                onClick={() => setActiveFilter('paid')}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    activeFilter === 'paid' 
                      ? 'bg-white/20' 
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <CheckCircle2 className={`h-6 w-6 ${
                      activeFilter === 'paid' ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium uppercase tracking-wide ${
                      activeFilter === 'paid' ? 'text-blue-100' : 'text-gray-600'
                    }`}>Pagas</p>
                    <p className={`text-2xl font-bold transition-colors ${
                      activeFilter === 'paid' 
                        ? 'text-white' 
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>{deliveredInvoices.length} faturas</p>
                    <p className={`text-lg font-semibold ${
                      activeFilter === 'paid' ? 'text-blue-100' : 'text-gray-700'
                    }`}>
                      {formatCurrency(deliveredAmount)}
                    </p>
                  </div>
                </div>
                {activeFilter === 'paid' && (
                  <div className="mt-3 text-xs text-blue-100">
                    ✓ Filtro ativo
                  </div>
                )}
              </Card>

              <Card 
                className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 group ${
                  activeFilter === 'overdue' 
                    ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg -translate-y-1' 
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-yellow-300 hover:-translate-y-1'
                }`}
                onClick={() => setActiveFilter('overdue')}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    activeFilter === 'overdue' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-100 group-hover:bg-yellow-200'
                  }`}>
                    <Clock className={`h-6 w-6 ${
                      activeFilter === 'overdue' ? 'text-white' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium uppercase tracking-wide ${
                      activeFilter === 'overdue' ? 'text-yellow-100' : 'text-gray-600'
                    }`}>Pendentes</p>
                    <p className={`text-2xl font-bold transition-colors ${
                      activeFilter === 'overdue' 
                        ? 'text-white' 
                        : 'text-gray-900 group-hover:text-yellow-600'
                    }`}>{pendingInvoices.length} faturas</p>
                    <p className={`text-lg font-semibold ${
                      activeFilter === 'overdue' ? 'text-yellow-100' : 'text-gray-700'
                    }`}>
                      {formatCurrency(pendingAmount)}
                    </p>
                  </div>
                </div>
                {activeFilter === 'overdue' && (
                  <div className="mt-3 text-xs text-yellow-100">
                    ✓ Filtro ativo
                  </div>
                )}
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar faturas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.number}</TableCell>
                      <TableCell>{invoice.entity.name}</TableCell>
                              <TableCell>{invoice.event.name || 'Não especificado'}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleInvoiceAction(invoice, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleInvoiceAction(invoice, 'edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleInvoiceAction(invoice, 'delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Detalhes da Fatura */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Fatura</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre a fatura selecionada
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Número</label>
                  <p className="text-lg font-semibold text-gray-900">#{selectedInvoice.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cliente</label>
                  <p className="text-gray-900">{selectedInvoice.entity.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Valor</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(selectedInvoice.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Emissão</label>
                  <p className="text-gray-900">
                    {new Date(selectedInvoice.issueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Vencimento</label>
                  <p className="text-gray-900">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {selectedInvoice.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Descrição</label>
                  <p className="text-gray-900 mt-1">{selectedInvoice.description}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar por Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}