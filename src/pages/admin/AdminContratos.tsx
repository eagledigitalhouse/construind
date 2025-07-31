import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showToast } from '@/lib/toast';
import PageHeader from '@/components/layout/PageHeader';
import {
  FileText,
  Download,
  Eye,
  Send,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  User,
  Building2,
  Calendar,
  Hash,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/ui/metric-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ContratoGerado, STATUS_CONTRATO_MAP } from '@/types/contratos';
import {
  buscarContratosGerados,
  gerarPDFContrato,
  atualizarStatusContrato,
  buscarHistoricoContrato,
  sincronizarStatusZapSign,
  baixarArquivoAssinadoZapSign
} from '@/lib/contratos';
import { enviarContratoParaAssinatura } from '@/lib/assinatura-contratos';
import { getZapSignStatusLabel, getZapSignStatusColor } from '@/lib/zapsign';


const AdminContratos: React.FC = () => {
  const [contratos, setContratos] = useState<ContratoGerado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedContrato, setSelectedContrato] = useState<ContratoGerado | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    rascunho: 0,
    enviado_assinatura: 0,
    assinado_produtora: 0,
    assinado_completo: 0,
    cancelado: 0
  });

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    try {
      setLoading(true);
      const contratosData = await buscarContratosGerados();
      setContratos(contratosData);
      calcularEstatisticas(contratosData);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      showToast.error('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (contratosData: ContratoGerado[]) => {
    const stats = {
      total: contratosData.length,
      rascunho: 0,
      enviado_assinatura: 0,
      assinado_produtora: 0,
      assinado_completo: 0,
      cancelado: 0
    };

    contratosData.forEach(contrato => {
      stats[contrato.status]++;
    });

    setStats(stats);
  };

  const contratosFiltrados = contratos.filter(contrato => {
    const matchesSearch = 
      contrato.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contrato.pre_inscricao?.razao_social || contrato.pre_inscricao?.nome_pf || '')
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || contrato.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadPDF = async (contrato: ContratoGerado) => {
    try {
      const pdfBlob = gerarPDFContrato(contrato.conteudo_preenchido, contrato.numero_contrato);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contrato.numero_contrato}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast.success('PDF baixado!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showToast.error('Erro ao gerar PDF');
    }
  };

  const handleVerDetalhes = (contrato: ContratoGerado) => {
    setSelectedContrato(contrato);
    setShowDetailModal(true);
  };

  const handleVerHistorico = async (contrato: ContratoGerado) => {
    try {
      setLoadingHistorico(true);
      setSelectedContrato(contrato);
      setShowHistoricoModal(true);
      
      const historicoData = await buscarHistoricoContrato(contrato.id);
      setHistorico(historicoData);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      showToast.error('Erro ao carregar histórico');
    } finally {
      setLoadingHistorico(false);
    }
  };

  const handleAtualizarStatus = async (contratoId: string, novoStatus: ContratoGerado['status']) => {
    try {
      if (novoStatus === 'enviado_assinatura') {
        // Buscar o contrato completo para enviar para assinatura
        const contrato = contratos.find(c => c.id === contratoId);
        if (!contrato) {
          throw new Error('Contrato não encontrado');
        }
        
await enviarContratoParaAssinatura(contrato.id, 'contrato_expositor');
        showToast.success('Contrato enviado para assinatura!');
      } else {
        await atualizarStatusContrato(contratoId, novoStatus);
        showToast.success('Status atualizado!');
      }
      
      carregarContratos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showToast.error('Erro ao atualizar status');
    }
  };

  const handleSincronizarZapSign = async (contratoId: string) => {
    try {
      await sincronizarStatusZapSign(contratoId);
      showToast.success('Status sincronizado com ZapSign!');
      carregarContratos();
    } catch (error) {
      console.error('Erro ao sincronizar status ZapSign:', error);
      showToast.error('Erro ao sincronizar status com ZapSign');
    }
  };

  const handleBaixarArquivoZapSign = async (contratoId: string) => {
    try {
      const arquivo = await baixarArquivoAssinadoZapSign(contratoId);
      
      // Criar URL para download
      const url = window.URL.createObjectURL(arquivo);
      const link = document.createElement('a');
      link.href = url;
      
      // Buscar o contrato para obter o número
      const contrato = contratos.find(c => c.id === contratoId);
      const nomeArquivo = `contrato_${contrato?.numero_contrato || contratoId}_assinado.pdf`;
      
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast.success('Arquivo baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar arquivo ZapSign:', error);
      showToast.error('Erro ao baixar arquivo do ZapSign');
    }
  };

  const getStatusBadge = (status: ContratoGerado['status']) => {
    const statusInfo = STATUS_CONTRATO_MAP[status];
    const colorMap = {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colorMap[statusInfo.color as keyof typeof colorMap]}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getNomeExpositor = (contrato: ContratoGerado) => {
    if (!contrato.pre_inscricao) return 'N/A';
    
    return contrato.pre_inscricao.tipo_pessoa === 'juridica'
      ? contrato.pre_inscricao.razao_social || 'Empresa'
      : `${contrato.pre_inscricao.nome_pf || ''} ${contrato.pre_inscricao.sobrenome_pf || ''}`.trim();
  };

  return (
    <div className="container mx-auto p-6 admin-page">
      <div className="space-y-4">
      <PageHeader
        title="Contratos"
        description={`Gerencie todos os contratos de exposição (Total: ${stats.total})`}
        icon={FileText}
        actions={[
          {
            label: "Atualizar",
            variant: "default",
            icon: RefreshCw,
            onClick: carregarContratos,
            disabled: loading
          }
        ]}
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total"
          value={stats.total}
          icon={<FileText className="h-4 w-4" />}
          color="gray"
        />
        
        <MetricCard
          title="Rascunho"
          value={stats.rascunho}
          icon={<Clock className="h-4 w-4" />}
          color="gray"
        />
        
        <MetricCard
          title="Enviados"
          value={stats.enviado_assinatura}
          icon={<Send className="h-4 w-4" />}
          color="blue"
        />
        
        <MetricCard
          title="Produtora"
          value={stats.assinado_produtora}
          icon={<CheckCircle className="h-4 w-4" />}
          color="yellow"
        />
        
        <MetricCard
          title="Completos"
          value={stats.assinado_completo}
          icon={<CheckCircle2 className="h-4 w-4" />}
          color="green"
        />
        
        <MetricCard
          title="Cancelados"
          value={stats.cancelado}
          icon={<XCircle className="h-4 w-4" />}
          color="red"
        />
      </div>



      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por número do contrato ou expositor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="enviado_assinatura">Enviado</SelectItem>
            <SelectItem value="assinado_produtora">Assinado Produtora</SelectItem>
            <SelectItem value="assinado_completo">Completo</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Contratos */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando contratos...</span>
          </div>
        ) : contratosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum contrato encontrado</p>
            </CardContent>
          </Card>
        ) : (
          contratosFiltrados.map((contrato) => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm font-medium">
                          {contrato.numero_contrato}
                        </span>
                      </div>
                      {getStatusBadge(contrato.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2">
                        {contrato.pre_inscricao?.tipo_pessoa === 'juridica' ? (
                          <Building2 className="h-4 w-4 text-gray-400" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="font-medium">{getNomeExpositor(contrato)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(contrato.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {contrato.zapsign_template_name || contrato.modelo_contrato?.nome || 'Modelo não encontrado'}
                          {contrato.zapsign_template_name && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              ZapSign
                            </Badge>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    {/* Informações específicas do ZapSign */}
                    {contrato.zapsign_document_id && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {contrato.zapsign_status && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Status ZapSign:</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs bg-${getZapSignStatusColor(contrato.zapsign_status)}-50 text-${getZapSignStatusColor(contrato.zapsign_status)}-700 border-${getZapSignStatusColor(contrato.zapsign_status)}-200`}
                                >
                                  {getZapSignStatusLabel(contrato.zapsign_status)}
                                </Badge>
                              </div>
                            )}
                          </div>
                          {contrato.zapsign_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(contrato.zapsign_url, '_blank')}
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Abrir no ZapSign
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(contrato)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerDetalhes(contrato)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleVerHistorico(contrato)}>
                          Ver Histórico
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {contrato.zapsign_document_id && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleSincronizarZapSign(contrato.id)}
                            >
                              Sincronizar Status ZapSign
                            </DropdownMenuItem>
                            {contrato.zapsign_status === 'signed' && (
                              <DropdownMenuItem 
                                onClick={() => handleBaixarArquivoZapSign(contrato.id)}
                              >
                                Baixar Arquivo Assinado
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {contrato.status === 'rascunho' && (
                          <DropdownMenuItem 
                            onClick={() => handleAtualizarStatus(contrato.id, 'enviado_assinatura')}
                          >
                            Enviar para Assinatura
                          </DropdownMenuItem>
                        )}
                        {contrato.status !== 'cancelado' && (
                          <DropdownMenuItem 
                            onClick={() => handleAtualizarStatus(contrato.id, 'cancelado')}
                            className="text-red-600"
                          >
                            Cancelar Contrato
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes do Contrato {selectedContrato?.numero_contrato}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContrato && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedContrato.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Expositor</label>
                  <p className="mt-1">{getNomeExpositor(selectedContrato)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Conteúdo do Contrato</label>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {selectedContrato.conteudo_preenchido}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico */}
      <Dialog open={showHistoricoModal} onOpenChange={setShowHistoricoModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Histórico do Contrato {selectedContrato?.numero_contrato}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingHistorico ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Carregando histórico...</span>
              </div>
            ) : historico.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum histórico encontrado
              </p>
            ) : (
              historico.map((item) => (
                <div key={item.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.acao}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  {item.descricao && (
                    <p className="text-sm text-gray-600 mt-1">{item.descricao}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default AdminContratos;