import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import {
  Users,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  Save,
  X,
  Trash2,
  RefreshCw,
  MoreVertical,
  Grid3X3,
  List,
  Table2,
  CreditCard,
  Target,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// AdminLayout removido

// Interface para os dados
interface PreInscricaoExpositor {
  id: string;
  
  // Tipo de Pessoa
  tipo_pessoa: 'fisica' | 'juridica';
  
  // Pessoa Física
  nome_pf?: string;
  sobrenome_pf?: string;
  cpf?: string;
  email_pf?: string;
  telefone_pf?: string;
  cep_pf?: string;
  logradouro_pf?: string;
  numero_pf?: string;
  complemento_pf?: string;
  bairro_pf?: string;
  cidade_pf?: string;
  estado_pf?: string;
  
  // Pessoa Jurídica
  razao_social?: string;
  nome_social?: string;
  cnpj?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  telefone_empresa?: string;
  email_empresa?: string;
  cartao_cnpj_url?: string;
  
  // Responsável Legal
  nome_responsavel: string;
  sobrenome_responsavel: string;
  email_responsavel?: string;
  contato_responsavel: string;
  is_whatsapp: 'sim' | 'nao';
  
  // Responsável pelo Stand
  nome_responsavel_stand: string;
  sobrenome_responsavel_stand: string;
  email_responsavel_stand: string;
  
  // Serviços
  numero_stand: string;
  deseja_patrocinio: 'sim' | 'nao';
  categoria_patrocinio?: string;
  condicao_pagamento: string;
  forma_pagamento: string;
  
  // Informações Adicionais
  observacoes?: string;
  
  // Dados de controle
  status: 'pendente' | 'aprovado' | 'rejeitado';
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

const AdminPreInscricaoExpositores = () => {
  const [preInscricoes, setPreInscricoes] = useState<PreInscricaoExpositor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'cards' | 'lista' | 'tabela'>('cards');
  const [selectedPreInscricao, setSelectedPreInscricao] = useState<PreInscricaoExpositor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<PreInscricaoExpositor>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Carregar pré-inscrições
  const loadPreInscricoes = async () => {
    try {
      setLoading(true);
          const { data, error } = await supabase
      .from('pre_inscricao_expositores')
      .select('*')
      .eq('is_temporary', false) // 🔹 FILTRAR REGISTROS TEMPORÁRIOS (não aparecem no painel)
      .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar pré-inscrições:', error);
        toast.error('Erro ao carregar pré-inscrições');
        return;
      }

      setPreInscricoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar pré-inscrições:', error);
      toast.error('Erro ao carregar pré-inscrições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreInscricoes();
  }, []);

  // Atualizar status da pré-inscrição E DO STAND (LÓGICA COMPLETA)
  const updateStatus = async (id: string, newStatus: 'aprovado' | 'rejeitado' | 'pendente') => {
    try {
      // 1. Buscar dados da pré-inscrição para obter o stand
      const { data: inscricao, error: fetchError } = await supabase
        .from('pre_inscricao_expositores')
        .select('numero_stand, razao_social, nome_pf, sobrenome_pf, tipo_pessoa')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar pré-inscrição:', fetchError);
        toast.error('Erro ao buscar dados da pré-inscrição');
        return;
      }

      const nomeExpositor = inscricao.tipo_pessoa === 'juridica' 
        ? inscricao.razao_social || 'Empresa'
        : `${inscricao.nome_pf} ${inscricao.sobrenome_pf}`;

      // 2. Atualizar status da pré-inscrição
      const { error: statusError } = await supabase
        .from('pre_inscricao_expositores')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (statusError) {
        console.error('Erro ao atualizar status:', statusError);
        toast.error('Erro ao atualizar status: ' + statusError.message);
        return;
      }

      // 3. ATUALIZAR STATUS DO STAND CONFORME A APROVAÇÃO
      let standUpdate = {};

      if (newStatus === 'aprovado') {
        // APROVADO → Stand fica OCUPADO PERMANENTEMENTE
        standUpdate = {
          disponivel: false,
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `✅ APROVADO - Reservado por ${nomeExpositor} - FESPIN 2025`
        };
      } else if (newStatus === 'rejeitado') {
        // REJEITADO → Stand volta DISPONÍVEL
        standUpdate = {
          disponivel: true,
          reservado_por: null,
          data_reserva: null,
          observacoes: null
        };
      } else if (newStatus === 'pendente') {
        // PENDENTE → Stand fica PRÉ-RESERVADO
        standUpdate = {
          disponivel: false,
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `🟡 PRÉ-RESERVADO - ${nomeExpositor} - Aguardando aprovação final`
        };
      }

      // 4. Aplicar atualização no stand
      const { error: standError } = await supabase
        .from('stands_fespin')
        .update(standUpdate)
        .eq('numero_stand', inscricao.numero_stand);

      if (standError) {
        console.error('Erro ao atualizar stand:', standError);
        toast.error('Status atualizado, mas houve erro ao atualizar o stand');
      }

      const statusMessages = {
        aprovado: 'aprovada e stand OCUPADO permanentemente',
        rejeitado: 'rejeitada e stand LIBERADO para nova seleção', 
        pendente: 'marcada como pendente e stand PRÉ-RESERVADO'
      };
      
      const statusEmojis = {
        aprovado: '✅',
        rejeitado: '❌',
        pendente: '🟡'
      };

      toast.success(
        `${statusEmojis[newStatus]} Pré-inscrição ${statusMessages[newStatus]}!`,
        {
          description: `Stand ${inscricao.numero_stand} atualizado automaticamente`,
          duration: 5000
        }
      );
      
      loadPreInscricoes();
      
      // Atualizar dados do modal se estiver aberto
      if (selectedPreInscricao && selectedPreInscricao.id === id) {
        setSelectedPreInscricao(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  // Salvar edições
  const saveEdits = async () => {
    if (!selectedPreInscricao) return;
    
    try {
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .update({
          ...editData,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPreInscricao.id);

      if (error) {
        console.error('Erro ao salvar alterações:', error);
        toast.error('Erro ao salvar alterações: ' + error.message);
        return;
      }

      toast.success('Alterações salvas com sucesso!');
      setIsEditing(false);
      setSelectedPreInscricao({ ...selectedPreInscricao, ...editData });
      loadPreInscricoes();
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast.error('Erro ao salvar alterações');
    }
  };

  // Excluir pré-inscrição
  const deletePreInscricao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir pré-inscrição:', error);
        toast.error('Erro ao excluir pré-inscrição: ' + error.message);
        return;
      }

      toast.success('Pré-inscrição excluída com sucesso!');
      setDeleteConfirm(null);
      setShowDetailModal(false);
      loadPreInscricoes();
    } catch (error) {
      console.error('Erro ao excluir pré-inscrição:', error);
      toast.error('Erro ao excluir pré-inscrição');
    }
  };

  // Abrir modal com dados da pré-inscrição
  const openModal = (inscricao: PreInscricaoExpositor) => {
    setSelectedPreInscricao(inscricao);
    setEditData(inscricao);
    setIsEditing(false);
    setShowDetailModal(true);
  };

  // Filtrar pré-inscrições
  const filteredPreInscricoes = preInscricoes.filter(inscricao => {
    const matchesSearch = searchTerm === '' || 
      inscricao.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.nome_pf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.nome_responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.cnpj?.includes(searchTerm) ||
      inscricao.cpf?.includes(searchTerm) ||
      inscricao.numero_stand?.includes(searchTerm);

    const matchesStatus = statusFilter === 'todos' || inscricao.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || inscricao.tipo_pessoa === tipoFilter;

    return matchesSearch && matchesStatus && matchesTipo;
  });

  // Estatísticas
  const stats = {
    total: preInscricoes.length,
    pendentes: preInscricoes.filter(p => p.status === 'pendente').length,
    aprovadas: preInscricoes.filter(p => p.status === 'aprovado').length,
    rejeitadas: preInscricoes.filter(p => p.status === 'rejeitado').length,
    fisicas: preInscricoes.filter(p => p.tipo_pessoa === 'fisica').length,
    juridicas: preInscricoes.filter(p => p.tipo_pessoa === 'juridica').length,
    // Estatísticas por categoria de stand
    academias: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 1 && num <= 32;
    }).length,
    bemEstar: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 33 && num <= 36;
    }).length,
    artigos: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return (num >= 37 && num <= 44) || (num >= 53 && num <= 60);
    }).length,
    saude: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return (num >= 45 && num <= 52) || (num >= 61 && num <= 68);
    }).length,
    areaLivre: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 69 && num <= 83;
    }).length
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: { variant: 'outline' as const, className: 'border-yellow-300 text-yellow-700 bg-yellow-50' },
      aprovado: { variant: 'outline' as const, className: 'border-green-300 text-green-700 bg-green-50' },
      rejeitado: { variant: 'outline' as const, className: 'border-red-300 text-red-700 bg-red-50' }
    };
    const config = variants[status as keyof typeof variants] || variants.pendente;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getNome = (inscricao: PreInscricaoExpositor) => {
    return inscricao.tipo_pessoa === 'juridica' 
      ? (inscricao.razao_social || inscricao.nome_social || 'Sem nome')
      : `${inscricao.nome_pf || ''} ${inscricao.sobrenome_pf || ''}`.trim() || 'Sem nome';
  };

  // Função para obter informações do stand (categoria, cor, preço)
  const getStandInfo = (numeroStand: string) => {
    const num = parseInt(numeroStand);
    
    if (num >= 1 && num <= 32) {
      return {
        categoria: 'Academias',
        cor: '#B6FF72',
        preco: 'R$ 3.300,00',
        tamanho: '3x3m',
        segmento: 'Academias'
      };
    }
    
    if (num >= 33 && num <= 36) {
      return {
        categoria: 'Bem-Estar',
        cor: '#FF776C', 
        preco: 'R$ 3.300,00',
        tamanho: '3x3m',
        segmento: 'Bem-Estar'
      };
    }
    
    if ((num >= 37 && num <= 44) || (num >= 53 && num <= 60)) {
      return {
        categoria: 'Artigos Esportivos',
        cor: '#A6CFFF',
        preco: 'R$ 3.300,00', 
        tamanho: '3x3m',
        segmento: 'Artigos Esportivos'
      };
    }
    
    if ((num >= 45 && num <= 52) || (num >= 61 && num <= 68)) {
      return {
        categoria: 'Saúde e Nutrição',
        cor: '#38FFB8',
        preco: 'R$ 3.300,00',
        tamanho: '3x3m', 
        segmento: 'Saúde e Nutrição'
      };
    }
    
    if (num >= 69 && num <= 83) {
      return {
        categoria: 'Área Livre',
        cor: '#FFD700',
        preco: 'R$ 5.500,00',
        tamanho: '5x5m',
        segmento: 'Área Livre'
      };
    }
    
    return {
      categoria: 'Stand Personalizado',
      cor: '#CCCCCC',
      preco: 'A consultar',
      tamanho: 'Personalizado',
      segmento: 'Outros'
    };
  };

  // Exportar para Excel
  const exportToExcel = () => {
    // Dados principais organizados e limpos
    const dadosPrincipais = filteredPreInscricoes.map((inscricao, index) => {
      const standInfo = getStandInfo(inscricao.numero_stand);
      const endereco = inscricao.tipo_pessoa === 'juridica' 
        ? `${inscricao.logradouro || ''} ${inscricao.numero || ''}, ${inscricao.bairro || ''}, ${inscricao.cidade || ''} - ${inscricao.estado || ''}`.replace(/^,\s*|,\s*$/g, '').trim()
        : `${inscricao.logradouro_pf || ''} ${inscricao.numero_pf || ''}, ${inscricao.bairro_pf || ''}, ${inscricao.cidade_pf || ''} - ${inscricao.estado_pf || ''}`.replace(/^,\s*|,\s*$/g, '').trim();
      
      return {
        'Nº': index + 1,
        'Status': inscricao.status.toUpperCase(),
        'Tipo': inscricao.tipo_pessoa === 'juridica' ? 'PESSOA JURÍDICA' : 'PESSOA FÍSICA',
        'Nome/Razão Social': getNome(inscricao),
        'Documento': inscricao.tipo_pessoa === 'juridica' ? inscricao.cnpj : inscricao.cpf,
        'Telefone Principal': inscricao.tipo_pessoa === 'juridica' ? inscricao.telefone_empresa : inscricao.telefone_pf,
        'Email Principal': inscricao.tipo_pessoa === 'juridica' ? inscricao.email_empresa : inscricao.email_pf,
        'Endereço': endereco || 'Não informado',
        'CEP': inscricao.tipo_pessoa === 'juridica' ? inscricao.cep : inscricao.cep_pf,
        'Responsável Legal': `${inscricao.nome_responsavel} ${inscricao.sobrenome_responsavel}`,
        'Contato Responsável': inscricao.contato_responsavel,
        'WhatsApp': inscricao.is_whatsapp === 'sim' ? 'SIM' : 'NÃO',
        'Responsável Stand': `${inscricao.nome_responsavel_stand} ${inscricao.sobrenome_responsavel_stand}`,
        'Email Responsável Stand': inscricao.email_responsavel_stand,
        'Stand Nº': inscricao.numero_stand,
        'Categoria Stand': standInfo.categoria,
        'Segmento': standInfo.segmento,
        'Tamanho': standInfo.tamanho,
        'Valor Stand': standInfo.preco,
        'Deseja Patrocínio': inscricao.deseja_patrocinio === 'sim' ? 'SIM' : 'NÃO',
        'Tipo Patrocínio': inscricao.categoria_patrocinio?.toUpperCase() || '',
        'Condição Pagamento': inscricao.condicao_pagamento?.replace(/_/g, ' ').toUpperCase(),
        'Forma Pagamento': inscricao.forma_pagamento?.toUpperCase(),
        'Observações': inscricao.observacoes || '',
        'Data Inscrição': format(new Date(inscricao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        'Última Atualização': format(new Date(inscricao.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
      };
    });

    // Criar workbook com múltiplas abas
    const wb = XLSX.utils.book_new();

    // Aba principal - Dados gerais
    const ws1 = XLSX.utils.json_to_sheet(dadosPrincipais);
    
    // Configurar largura das colunas
    const colWidths = [
      {wch: 5},   // Nº
      {wch: 10},  // Status  
      {wch: 15},  // Tipo
      {wch: 30},  // Nome
      {wch: 18},  // Documento
      {wch: 15},  // Telefone
      {wch: 30},  // Email
      {wch: 40},  // Endereço
      {wch: 12},  // CEP
      {wch: 25},  // Responsável Legal
      {wch: 15},  // Contato
      {wch: 8},   // WhatsApp
      {wch: 25},  // Responsável Stand
      {wch: 30},  // Email Stand
      {wch: 8},   // Stand Nº
      {wch: 18},  // Categoria
      {wch: 20},  // Segmento
      {wch: 10},  // Tamanho
      {wch: 15},  // Valor
      {wch: 12},  // Patrocínio
      {wch: 15},  // Tipo Patrocínio
      {wch: 20},  // Condição Pagamento
      {wch: 15},  // Forma Pagamento
      {wch: 50},  // Observações
      {wch: 18},  // Data Inscrição
      {wch: 18}   // Última Atualização
    ];
    ws1['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws1, 'Pré-Inscrições Completas');

    // Aba de estatísticas
    const estatisticas = [
      {'Estatística': 'Total de Inscrições', 'Valor': filteredPreInscricoes.length},
      {'Estatística': 'Pendentes', 'Valor': stats.pendentes},
      {'Estatística': 'Aprovadas', 'Valor': stats.aprovadas},
      {'Estatística': 'Rejeitadas', 'Valor': stats.rejeitadas},
      {'Estatística': 'Pessoa Física', 'Valor': stats.fisicas},
      {'Estatística': 'Pessoa Jurídica', 'Valor': stats.juridicas},
      {'Estatística': '', 'Valor': ''}, // linha vazia
      {'Estatística': 'Stands Academias', 'Valor': stats.academias},
      {'Estatística': 'Stands Bem-Estar', 'Valor': stats.bemEstar},
      {'Estatística': 'Stands Artigos Esportivos', 'Valor': stats.artigos},
      {'Estatística': 'Stands Saúde e Nutrição', 'Valor': stats.saude},
      {'Estatística': 'Stands Área Livre', 'Valor': stats.areaLivre}
    ];
    
    const ws2 = XLSX.utils.json_to_sheet(estatisticas);
    ws2['!cols'] = [{wch: 25}, {wch: 10}];
    XLSX.utils.book_append_sheet(wb, ws2, 'Estatísticas');

    // Contatos resumidos (para uso em CRM/marketing)
    const contatos = filteredPreInscricoes
      .filter(i => i.status === 'aprovado') // só aprovados
      .map(inscricao => ({
        'Nome': getNome(inscricao),
        'Email': inscricao.tipo_pessoa === 'juridica' ? inscricao.email_empresa : inscricao.email_pf,
        'Telefone': inscricao.contato_responsavel,
        'WhatsApp': inscricao.is_whatsapp === 'sim' ? 'SIM' : 'NÃO',
        'Empresa/Tipo': inscricao.tipo_pessoa === 'juridica' ? inscricao.razao_social : 'PESSOA FÍSICA',
        'Segmento': getStandInfo(inscricao.numero_stand).segmento,
        'Stand': inscricao.numero_stand
      }));

    if (contatos.length > 0) {
      const ws3 = XLSX.utils.json_to_sheet(contatos);
      ws3['!cols'] = [
        {wch: 30}, // Nome
        {wch: 30}, // Email
        {wch: 15}, // Telefone
        {wch: 8},  // WhatsApp
        {wch: 30}, // Empresa
        {wch: 20}, // Segmento
        {wch: 8}   // Stand
      ];
      XLSX.utils.book_append_sheet(wb, ws3, 'Contatos Aprovados');
    }
    
    // Salvar arquivo
    const timestamp = format(new Date(), 'dd-MM-yyyy-HH-mm');
    const filename = `FESPIN-2025-Pre-Inscricoes-${timestamp}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    const isFiltered = filteredPreInscricoes.length !== preInscricoes.length;
    const approvedCount = filteredPreInscricoes.filter(i => i.status === 'aprovado').length;
    
    toast.success(
      `📊 Arquivo exportado: ${filename}\n${
        isFiltered 
          ? `📋 ${filteredPreInscricoes.length} registros (filtrados)`
          : `📋 ${filteredPreInscricoes.length} registros`
      }\n✅ ${approvedCount} contatos aprovados`,
      { duration: 5000 }
    );
  };

  // Componente de visualização em Lista
  const ListView = () => (
    <div className="space-y-4">
      {filteredPreInscricoes.map((inscricao) => {
        const standInfo = getStandInfo(inscricao.numero_stand);
        return (
          <Card 
            key={inscricao.id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => openModal(inscricao)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0a2856] mb-1">{getNome(inscricao)}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {inscricao.tipo_pessoa === 'juridica' ? 
                            <Building2 className="w-4 h-4" /> : 
                            <User className="w-4 h-4" />
                          }
                          {inscricao.tipo_pessoa === 'juridica' ? 'PJ' : 'PF'}
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: standInfo.cor }}
                          ></div>
                          <span>Stand {inscricao.numero_stand} • {standInfo.categoria}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(inscricao.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(inscricao.status)}
                                             <DropdownMenu>
                         <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                           <Button variant="ghost" size="sm">
                             <MoreVertical className="w-4 h-4" />
                           </Button>
                         </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            openModal(inscricao);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(inscricao.id, 'aprovado');
                            }}
                            disabled={inscricao.status === 'aprovado'}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprovar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(inscricao.id, 'rejeitado');
                            }}
                            disabled={inscricao.status === 'rejeitado'}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeitar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-yellow-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(inscricao.id, 'pendente');
                            }}
                            disabled={inscricao.status === 'pendente'}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Pendente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(inscricao.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Componente de visualização em Tabela
  const TableView = () => (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Nome/Empresa</th>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Tipo</th>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Stand</th>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Categoria</th>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Status</th>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Data</th>
            <th className="text-left p-4 font-semibold text-[#0a2856]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredPreInscricoes.map((inscricao, index) => {
            const standInfo = getStandInfo(inscricao.numero_stand);
            return (
              <tr key={inscricao.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-[#0a2856]">{getNome(inscricao)}</div>
                    <div className="text-sm text-gray-600">{inscricao.contato_responsavel}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {inscricao.tipo_pessoa === 'juridica' ? 
                      <Building2 className="w-4 h-4" /> : 
                      <User className="w-4 h-4" />
                    }
                    {inscricao.tipo_pessoa === 'juridica' ? 'PJ' : 'PF'}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: standInfo.cor }}
                    >
                      {inscricao.numero_stand}
                    </div>
                    <span className="font-mono">{inscricao.numero_stand}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">{standInfo.categoria}</div>
                    <div className="text-gray-600">{standInfo.tamanho} • {standInfo.preco}</div>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(inscricao.status)}</td>
                <td className="p-4 text-sm text-gray-600">
                  {format(new Date(inscricao.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openModal(inscricao)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => updateStatus(inscricao.id, 'aprovado')}
                      className="text-green-600 hover:text-green-700"
                      disabled={inscricao.status === 'aprovado'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => updateStatus(inscricao.id, 'rejeitado')}
                      className="text-red-600 hover:text-red-700"
                      disabled={inscricao.status === 'rejeitado'}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeleteConfirm(inscricao.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Componente de visualização em Cards - CLICÁVEL
  const CardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPreInscricoes.map((inscricao) => (
        <Card 
          key={inscricao.id} 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
          onClick={() => openModal(inscricao)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-[#0a2856] mb-2 line-clamp-2">
                  {getNome(inscricao)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(inscricao.status)}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {inscricao.tipo_pessoa === 'juridica' ? 
                      <Building2 className="w-3 h-3" /> : 
                      <User className="w-3 h-3" />
                    }
                    {inscricao.tipo_pessoa === 'juridica' ? 'PJ' : 'PF'}
                  </div>
                </div>
              </div>
                             <DropdownMenu>
                 <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                     <MoreVertical className="w-4 h-4" />
                   </Button>
                 </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    openModal(inscricao);
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                                     <DropdownMenuItem 
                     className="text-green-600"
                     onClick={(e) => {
                       e.stopPropagation();
                       updateStatus(inscricao.id, 'aprovado');
                     }}
                     disabled={inscricao.status === 'aprovado'}
                   >
                     <CheckCircle className="w-4 h-4 mr-2" />
                     Aprovar
                   </DropdownMenuItem>
                   <DropdownMenuItem 
                     className="text-red-600"
                     onClick={(e) => {
                       e.stopPropagation();
                       updateStatus(inscricao.id, 'rejeitado');
                     }}
                     disabled={inscricao.status === 'rejeitado'}
                   >
                     <XCircle className="w-4 h-4 mr-2" />
                     Rejeitar
                   </DropdownMenuItem>
                   <DropdownMenuItem 
                     className="text-yellow-600"
                     onClick={(e) => {
                       e.stopPropagation();
                       updateStatus(inscricao.id, 'pendente');
                     }}
                     disabled={inscricao.status === 'pendente'}
                   >
                     <Clock className="w-4 h-4 mr-2" />
                     Pendente
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(inscricao.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Stand: {inscricao.numero_stand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: getStandInfo(inscricao.numero_stand).cor }}
                  >
                    {inscricao.numero_stand}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 pl-6">
                {getStandInfo(inscricao.numero_stand).categoria} • {getStandInfo(inscricao.numero_stand).tamanho} • {getStandInfo(inscricao.numero_stand).preco}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{inscricao.contato_responsavel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(inscricao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Modal de detalhes com TUDO em uma visualização + edição
  const DetailModal = () => {
    if (!selectedPreInscricao) return null;

    const currentData = isEditing ? editData : selectedPreInscricao;

    const renderField = (label: string, value: string | undefined, fieldName?: string, type: 'text' | 'textarea' | 'select' = 'text', options?: string[]) => (
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {isEditing && fieldName ? (
          type === 'textarea' ? (
            <Textarea
              value={currentData[fieldName as keyof PreInscricaoExpositor] as string || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, [fieldName]: e.target.value }))}
              className="min-h-[80px]"
            />
          ) : type === 'select' ? (
            <Select 
              value={currentData[fieldName as keyof PreInscricaoExpositor] as string}
              onValueChange={(val) => setEditData(prev => ({ ...prev, [fieldName]: val }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={currentData[fieldName as keyof PreInscricaoExpositor] as string || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, [fieldName]: e.target.value }))}
            />
          )
        ) : (
          <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border min-h-[38px] flex items-center">
            {value || 'Não informado'}
          </p>
        )}
      </div>
    );

    return (
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedPreInscricao.tipo_pessoa === 'juridica' ? 
                  <Building2 className="w-6 h-6 text-[#0a2856]" /> : 
                  <User className="w-6 h-6 text-[#0a2856]" />
                }
                <span className="text-xl text-[#0a2856]">
                  {getNome(selectedPreInscricao)}
                </span>
                {getStatusBadge(selectedPreInscricao.status)}
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={() => {setIsEditing(false); setEditData(selectedPreInscricao);}} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button onClick={saveEdits} size="sm" className="bg-[#00d856] hover:bg-[#00d856]/90">
                      <Save className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Status e Ações Rápidas */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status atual</p>
                  <p className="font-semibold">{selectedPreInscricao.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stand</p>
                  <p className="font-semibold">#{selectedPreInscricao.numero_stand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold">{format(new Date(selectedPreInscricao.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
                </div>
              </div>
              <div className="flex gap-2">
                                 <div className="flex gap-2">
                   <Button 
                     onClick={() => updateStatus(selectedPreInscricao.id, 'aprovado')}
                     className={`${selectedPreInscricao.status === 'aprovado' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                     size="sm"
                     disabled={selectedPreInscricao.status === 'aprovado'}
                   >
                     <CheckCircle className="w-4 h-4 mr-1" />
                     Aprovar
                   </Button>
                   <Button 
                     onClick={() => updateStatus(selectedPreInscricao.id, 'rejeitado')}
                     className={`${selectedPreInscricao.status === 'rejeitado' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                     size="sm"
                     disabled={selectedPreInscricao.status === 'rejeitado'}
                   >
                     <XCircle className="w-4 h-4 mr-1" />
                     Rejeitar
                   </Button>
                   <Button 
                     onClick={() => updateStatus(selectedPreInscricao.id, 'pendente')}
                     className={`${selectedPreInscricao.status === 'pendente' ? 'bg-yellow-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                     size="sm"
                     disabled={selectedPreInscricao.status === 'pendente'}
                   >
                     <Clock className="w-4 h-4 mr-1" />
                     Pendente
                   </Button>
                 </div>
                <Button 
                  onClick={() => setDeleteConfirm(selectedPreInscricao.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Dados Principais */}
            <div>
              <h3 className="text-lg font-semibold text-[#0a2856] mb-4 flex items-center gap-2">
                {selectedPreInscricao.tipo_pessoa === 'juridica' ? 
                  <Building2 className="w-5 h-5" /> : 
                  <User className="w-5 h-5" />
                }
                {selectedPreInscricao.tipo_pessoa === 'juridica' ? 'Dados da Empresa' : 'Dados Pessoais'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPreInscricao.tipo_pessoa === 'juridica' ? (
                  <>
                    {renderField('Razão Social', currentData.razao_social, 'razao_social')}
                    {renderField('Nome Fantasia', currentData.nome_social, 'nome_social')}
                    {renderField('CNPJ', currentData.cnpj, 'cnpj')}
                    {renderField('Telefone', currentData.telefone_empresa, 'telefone_empresa')}
                    {renderField('E-mail', currentData.email_empresa, 'email_empresa')}
                    {renderField('CEP', currentData.cep, 'cep')}
                    {renderField('Logradouro', currentData.logradouro, 'logradouro')}
                    {renderField('Número', currentData.numero, 'numero')}
                    {renderField('Complemento', currentData.complemento, 'complemento')}
                    {renderField('Bairro', currentData.bairro, 'bairro')}
                    {renderField('Cidade', currentData.cidade, 'cidade')}
                    {renderField('Estado', currentData.estado, 'estado')}
                  </>
                ) : (
                  <>
                    {renderField('Nome', currentData.nome_pf, 'nome_pf')}
                    {renderField('Sobrenome', currentData.sobrenome_pf, 'sobrenome_pf')}
                    {renderField('CPF', currentData.cpf, 'cpf')}
                    {renderField('Telefone', currentData.telefone_pf, 'telefone_pf')}
                    {renderField('E-mail', currentData.email_pf, 'email_pf')}
                    {renderField('CEP', currentData.cep_pf, 'cep_pf')}
                    {renderField('Logradouro', currentData.logradouro_pf, 'logradouro_pf')}
                    {renderField('Número', currentData.numero_pf, 'numero_pf')}
                    {renderField('Complemento', currentData.complemento_pf, 'complemento_pf')}
                    {renderField('Bairro', currentData.bairro_pf, 'bairro_pf')}
                    {renderField('Cidade', currentData.cidade_pf, 'cidade_pf')}
                    {renderField('Estado', currentData.estado_pf, 'estado_pf')}
                  </>
                )}
              </div>
            </div>

            {/* Responsáveis */}
            <div>
              <h3 className="text-lg font-semibold text-[#0a2856] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Responsáveis
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Responsável Legal</h4>
                  <div className="space-y-3">
                    {renderField('Nome', currentData.nome_responsavel, 'nome_responsavel')}
                    {renderField('Sobrenome', currentData.sobrenome_responsavel, 'sobrenome_responsavel')}
                    {renderField('E-mail', currentData.email_responsavel, 'email_responsavel')}
                    {renderField('Contato', currentData.contato_responsavel, 'contato_responsavel')}
                    {renderField('É WhatsApp?', currentData.is_whatsapp, 'is_whatsapp', 'select', ['sim', 'nao'])}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Responsável pelo Stand</h4>
                  <div className="space-y-3">
                    {renderField('Nome', currentData.nome_responsavel_stand, 'nome_responsavel_stand')}
                    {renderField('Sobrenome', currentData.sobrenome_responsavel_stand, 'sobrenome_responsavel_stand')}
                    {renderField('E-mail', currentData.email_responsavel_stand, 'email_responsavel_stand')}
                  </div>
                </div>
              </div>
            </div>

                         {/* Stand e Pagamento */}
             <div>
               <h3 className="text-lg font-semibold text-[#0a2856] mb-4 flex items-center gap-2">
                 <MapPin className="w-5 h-5" />
                 Stand e Pagamento
               </h3>
               
               <div className="space-y-6">
                 {/* Informações do Stand com Visual */}
                 <div className="bg-gray-50 rounded-lg p-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div 
                         className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center text-lg font-bold shadow-md"
                         style={{ backgroundColor: getStandInfo(selectedPreInscricao.numero_stand).cor }}
                       >
                         {selectedPreInscricao.numero_stand}
                       </div>
                       <div>
                         <h4 className="font-semibold text-gray-800">{getStandInfo(selectedPreInscricao.numero_stand).categoria}</h4>
                         <p className="text-sm text-gray-600">{getStandInfo(selectedPreInscricao.numero_stand).segmento}</p>
                         <div className="flex items-center gap-3 mt-1">
                           <span className="text-sm bg-white px-2 py-1 rounded border">
                             {getStandInfo(selectedPreInscricao.numero_stand).tamanho}
                           </span>
                           <span className="text-sm font-medium text-[#0a2856]">
                             {getStandInfo(selectedPreInscricao.numero_stand).preco}
                           </span>
                         </div>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-xs text-gray-500">Stand Número</div>
                       <div className="text-2xl font-bold text-[#0a2856]">#{selectedPreInscricao.numero_stand}</div>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {renderField('Deseja Patrocínio?', currentData.deseja_patrocinio, 'deseja_patrocinio', 'select', ['sim', 'nao'])}
                   {currentData.deseja_patrocinio === 'sim' && renderField('Categoria Patrocínio', currentData.categoria_patrocinio, 'categoria_patrocinio', 'select', ['bronze', 'prata', 'ouro', 'telao_led'])}
                   {renderField('Condição de Pagamento', currentData.condicao_pagamento, 'condicao_pagamento', 'select', ['a_vista_desconto', 'sinal_3_parcelas', 'sinal_saldo'])}
                   {renderField('Forma de Pagamento', currentData.forma_pagamento, 'forma_pagamento', 'select', ['pix', 'boleto'])}
                 </div>
               </div>
             </div>

            {/* Informações Adicionais */}
            <div>
              <h3 className="text-lg font-semibold text-[#0a2856] mb-4">Informações Adicionais</h3>
              
              <div className="space-y-4">
                {renderField('Observações', currentData.observacoes, 'observacoes', 'textarea')}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">IP de Origem</Label>
                    <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                      {selectedPreInscricao.ip_address || 'Não registrado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Última Atualização</Label>
                    <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                      {format(new Date(selectedPreInscricao.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Carregando pré-inscrições...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0a2856] mb-2">
                Pré-Inscrições de Expositores
              </h1>
              <p className="text-gray-600">
                Gerencie as pré-inscrições recebidas para a FESPIN 2025
              </p>
            </div>
                         <div className="flex gap-2">
               <Button onClick={exportToExcel} variant="outline" className="border-[#00d856] text-[#00d856] hover:bg-[#00d856] hover:text-white">
                 <Download className="w-4 h-4 mr-2" />
                 Exportar Excel
               </Button>
               <Button onClick={loadPreInscricoes} className="bg-[#0a2856] hover:bg-[#0a2856]/90">
                 <RefreshCw className="w-4 h-4 mr-2" />
                 Atualizar
               </Button>
             </div>
          </div>

                     {/* Estatísticas */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
             <Card>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">Total</p>
                     <p className="text-2xl font-bold text-[#0a2856]">{stats.total}</p>
                   </div>
                   <Users className="w-8 h-8 text-[#0a2856]" />
                 </div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">Pendentes</p>
                     <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                   </div>
                   <Clock className="w-8 h-8 text-yellow-600" />
                 </div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">Aprovadas</p>
                     <p className="text-2xl font-bold text-green-600">{stats.aprovadas}</p>
                   </div>
                   <CheckCircle className="w-8 h-8 text-green-600" />
                 </div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">Rejeitadas</p>
                     <p className="text-2xl font-bold text-red-600">{stats.rejeitadas}</p>
                   </div>
                   <XCircle className="w-8 h-8 text-red-600" />
                 </div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">Pessoa Física</p>
                     <p className="text-2xl font-bold text-[#0a2856]">{stats.fisicas}</p>
                   </div>
                   <User className="w-8 h-8 text-[#0a2856]" />
                 </div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">Pessoa Jurídica</p>
                     <p className="text-2xl font-bold text-[#0a2856]">{stats.juridicas}</p>
                   </div>
                   <Building2 className="w-8 h-8 text-[#0a2856]" />
                 </div>
               </CardContent>
                            </Card>
           </div>

           {/* Estatísticas por Categoria de Stand */}
           {preInscricoes.length > 0 && (
             <div className="mt-6">
               <h3 className="text-sm font-medium text-gray-700 mb-3">Distribuição por Categoria de Stand</h3>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#B6FF72' }}></div>
                   <div className="text-xs">
                     <div className="font-medium">Academias</div>
                     <div className="text-gray-600">{stats.academias} stands</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF776C' }}></div>
                   <div className="text-xs">
                     <div className="font-medium">Bem-Estar</div>
                     <div className="text-gray-600">{stats.bemEstar} stands</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A6CFFF' }}></div>
                   <div className="text-xs">
                     <div className="font-medium">Artigos</div>
                     <div className="text-gray-600">{stats.artigos} stands</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#38FFB8' }}></div>
                   <div className="text-xs">
                     <div className="font-medium">Saúde</div>
                     <div className="text-gray-600">{stats.saude} stands</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFD700' }}></div>
                   <div className="text-xs">
                     <div className="font-medium">Área Livre</div>
                     <div className="text-gray-600">{stats.areaLivre} stands</div>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>

        {/* Filtros e Controles */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, CNPJ, CPF, stand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Tipos</SelectItem>
                  <SelectItem value="fisica">Pessoa Física</SelectItem>
                  <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {filteredPreInscricoes.length === preInscricoes.length 
                  ? `${filteredPreInscricoes.length} registros`
                  : `${filteredPreInscricoes.length} de ${preInscricoes.length} registros`
                }
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  onClick={() => setViewMode('cards')}
                  size="sm"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'lista' ? 'default' : 'outline'}
                  onClick={() => setViewMode('lista')}
                  size="sm"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'tabela' ? 'default' : 'outline'}
                  onClick={() => setViewMode('tabela')}
                  size="sm"
                >
                  <Table2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {filteredPreInscricoes.length === 0 ? (
          <Card className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma pré-inscrição encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Ainda não há pré-inscrições cadastradas.'
              }
            </p>
          </Card>
        ) : (
          <>
            {viewMode === 'cards' && <CardsView />}
            {viewMode === 'lista' && <ListView />}
            {viewMode === 'tabela' && <TableView />}
          </>
        )}

        {/* Modal de Detalhes */}
        <DetailModal />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A pré-inscrição será permanentemente removida do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && deletePreInscricao(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminPreInscricaoExpositores;