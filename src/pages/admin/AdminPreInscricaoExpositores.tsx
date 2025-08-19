import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabase';
import { formatarMoedaBrasileira, converterPrecoParaNumero } from '@/lib/utils';
import * as XLSX from 'xlsx';
import PageHeader from '@/components/layout/PageHeader';
import LayoutPaginaAdmin from '@/components/layout/LayoutPaginaAdmin';
import CardEstatistica from '@/components/admin/CardEstatistica';
import BotaoAcaoAdmin from '@/components/admin/BotaoAcaoAdmin';
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
  Download,
  FileText,
  Store,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import type { PreInscricaoExpositor } from '@/types/supabase';

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
  // Estado para controle de modais e contratos
  // Removido showContratoModal que não é mais usado
  // Estado para stands disponíveis
  const [standsDisponiveis, setStandsDisponiveis] = useState<any[]>([]);
  // Estado para condições de pagamento
  const [condicoesPagamento, setCondicoesPagamento] = useState<any[]>([]);

  // Carregar stands disponíveis
  const loadStandsDisponiveis = async () => {
    try {
      const { data, error } = await supabase
        .from('stands_construind')
        .select('*')
        .eq('status', 'disponivel')
        .order('numero_stand', { ascending: true });

      if (error) {
        console.error('Erro ao carregar stands disponíveis:', error);
        return;
      }

      setStandsDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao carregar stands disponíveis:', error);
    }
  };

  // Carregar condições de pagamento
  const loadCondicoesPagamento = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_conditions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar condições de pagamento:', error);
        return;
      }

      setCondicoesPagamento(data || []);
    } catch (error) {
      console.error('Erro ao carregar condições de pagamento:', error);
    }
  };

  // Carregar pré-inscrições
  const loadPreInscricoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pre_inscricao_expositores')
        .select('*')
        .eq('is_temporary', false) // FILTRAR REGISTROS TEMPORÁRIOS (não aparecem no painel)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar pré-inscrições:', error);
        showToast.error('Erro ao carregar pré-inscrições');
        return;
      }

      setPreInscricoes(data || []);
      // Carregar stands disponíveis e condições de pagamento
      await loadStandsDisponiveis();
      await loadCondicoesPagamento();
    } catch (error) {
      console.error('Erro ao carregar pré-inscrições:', error);
      showToast.error('Erro ao carregar pré-inscrições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreInscricoes();
  }, []);

  // Função para atualizar o stand de uma pré-inscrição
  const updateStand = async (preInscricaoId: string, novoNumeroStand: string) => {
    try {
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .update({ numero_stand: novoNumeroStand })
        .eq('id', preInscricaoId);

      if (error) {
        console.error('Erro ao atualizar stand:', error);
        showToast.error('Erro ao atualizar stand');
        return false;
      }

      showToast.success('Stand atualizado com sucesso!');
      await loadPreInscricoes(); // Recarregar dados
      return true;
    } catch (error) {
      console.error('Erro ao atualizar stand:', error);
      showToast.error('Erro ao atualizar stand');
      return false;
    }
  };


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
        showToast.error('Erro ao buscar dados da pré-inscrição');
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
        showToast.error('Erro ao atualizar status: ' + statusError.message);
        return;
      }

      // 3. ATUALIZAR STATUS DO STAND CONFORME A APROVAÇÃO
      let standUpdate = {};

      if (newStatus === 'aprovado') {
        // APROVADO → Stand fica OCUPADO PERMANENTEMENTE
        standUpdate = {
          status: 'ocupado',
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `APROVADO - Reservado por ${nomeExpositor} - CONSTRUIND 2025`
        };
      } else if (newStatus === 'rejeitado') {
        // REJEITADO → Stand volta DISPONÍVEL
        standUpdate = {
          status: 'disponivel',
          reservado_por: null,
          data_reserva: null,
          observacoes: null
        };
      } else if (newStatus === 'pendente') {
        // PENDENTE → Stand fica PRÉ-RESERVADO
        standUpdate = {
          status: 'reservado',
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `🟡 PRÉ-RESERVADO - ${nomeExpositor} - Aguardando aprovação final`
        };
      }

      // 4. Aplicar atualização no stand
      const { error: standError } = await supabase
        .from('stands_construind')
        .update(standUpdate)
        .eq('numero_stand', inscricao.numero_stand);

      if (standError) {
        console.error('Erro ao atualizar stand:', standError);
        showToast.error('Status atualizado, mas houve erro ao atualizar o stand');
      }

      const statusMessages = {
        aprovado: 'aprovada e stand OCUPADO permanentemente',
        rejeitado: 'rejeitada e stand LIBERADO para nova seleção', 
        pendente: 'marcada como pendente e stand PRÉ-RESERVADO'
      };
      
      const statusEmojis = {
         aprovado: 'Aprovado',
         rejeitado: 'Rejeitado',
          pendente: 'Pendente'
        };

      showToast.success(
        `${statusEmojis[newStatus]} Pré-inscrição ${statusMessages[newStatus]}!`
      );
      
      
      loadPreInscricoes();
      
      // Atualizar dados do modal se estiver aberto
      if (selectedPreInscricao && selectedPreInscricao.id === id) {
        setSelectedPreInscricao(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showToast.error('Erro ao atualizar status');
    }
  };

  // Salvar edições
  const saveEdits = async (localInputs?: Record<string, string>) => {
    if (!selectedPreInscricao) return;
    
    try {
      // Combinar editData com as alterações locais pendentes
      const finalData = localInputs ? { ...editData, ...localInputs } : editData;
      
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .update({
          ...finalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPreInscricao.id);

      if (error) {
        console.error('Erro ao salvar alterações:', error);
        showToast.error('Erro ao salvar alterações: ' + error.message);
        return;
      }

      showToast.success('Alterações salvas!');
      setIsEditing(false);
      
      // Atualizar apenas o item selecionado e a lista local sem recarregar
      const updatedPreInscricao = { ...selectedPreInscricao, ...finalData };
      setSelectedPreInscricao(updatedPreInscricao);
      
      // Atualizar editData com as alterações locais
      if (localInputs) {
        setEditData(prev => ({ ...prev, ...localInputs }));
      }
      
      // Atualizar a lista local sem fazer nova consulta ao banco
      setPreInscricoes(prev => 
        prev.map(item => 
          item.id === selectedPreInscricao.id ? updatedPreInscricao : item
        )
      );
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      showToast.error('Erro ao salvar alterações');
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
        showToast.error('Erro ao excluir pré-inscrição: ' + error.message);
        return;
      }

      showToast.success('Pré-inscrição excluída!');
      setDeleteConfirm(null);
      setShowDetailModal(false);
      loadPreInscricoes();
    } catch (error) {
      console.error('Erro ao excluir pré-inscrição:', error);
      showToast.error('Erro ao excluir pré-inscrição');
    }
  };

  // Abrir modal com dados da pré-inscrição
  const openModal = useCallback(async (inscricao: PreInscricaoExpositor) => {
    setSelectedPreInscricao(inscricao);
    setEditData(inscricao);
    setIsEditing(false);
    setShowDetailModal(true);
  }, []);

  // Abrir modal de seleção de contrato - Unificado com ZapSign
  // Funções relacionadas a contratos foram removidas

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
    // Estatísticas por categoria de stand CONSTRUIND
    stands2x2: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 1 && num <= 18;
    }).length,
    stands3x3Basico: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return [19,20,21,22,23,24,25,26,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,67,68,69,70,71,72,73,74].includes(num);
    }).length,
    stands3x3Acabamentos: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return [27,28,29,30,31,32,33,34,35,36,37,38,55,56,57,58,59,60,61,62,63,64,65,66].includes(num);
    }).length,
    stands5x5: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 75 && num <= 90;
    }).length,
    stands8x8: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 92 && num <= 97;
    }).length,
    stands10x10: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num === 91;
    }).length,
    stands9x10: preInscricoes.filter(p => {
      const num = parseInt(p.numero_stand);
      return num >= 99 && num <= 106;
    }).length
  };

  // Helper functions
  const getStatusBadge = useCallback((status: string) => {
    const variants = {
      pendente: { variant: 'outline' as const, className: 'border-yellow-300 text-yellow-700 bg-yellow-50' },
      aprovado: { variant: 'outline' as const, className: 'border-green-300 text-green-700 bg-green-50' },
      rejeitado: { variant: 'outline' as const, className: 'border-red-300 text-red-700 bg-red-50' }
    };
    const config = variants[status as keyof typeof variants] || variants.pendente;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  }, []);

  const getNome = useCallback((inscricao: PreInscricaoExpositor) => {
    return inscricao.tipo_pessoa === 'juridica' 
      ? (inscricao.razao_social || inscricao.nome_social || 'Sem nome')
      : `${inscricao.nome_pf || ''} ${inscricao.sobrenome_pf || ''}`.trim() || 'Sem nome';
  }, []);

  // Função para obter informações do stand (categoria, cor, preço)
  // Função para converter códigos em texto legível
  const getTextoLegivel = {
    condicaoPagamento: (valor: string) => {
      // Primeiro, tentar buscar na tabela de condições de pagamento (para UUIDs)
      const condicaoEncontrada = condicoesPagamento.find(c => c.id === valor);
      if (condicaoEncontrada) {
        return condicaoEncontrada.label;
      }
      
      // Fallback para códigos antigos (compatibilidade)
      const mapeamento = {
        'a_vista_desconto': 'À vista com 5% desconto',
        'sinal_3_parcelas': '20% sinal + 2 parcelas'
      };
      return mapeamento[valor as keyof typeof mapeamento] || valor;
    },
    formaPagamento: (valor: string) => {
      const mapeamento = {
        'pix': 'PIX',
        'boleto': 'Boleto'
      };
      return mapeamento[valor as keyof typeof mapeamento] || valor;
    },
    tipoPessoa: (valor: string) => {
      return valor === 'fisica' ? 'Pessoa Física' : valor === 'juridica' ? 'Pessoa Jurídica' : valor;
    },
    isWhatsApp: (valor: string) => {
      return valor === 'sim' ? 'Sim' : valor === 'nao' ? 'Não' : valor;
    }
  };

  const getStandInfo = useCallback((numeroStand: string) => {
    const num = parseInt(numeroStand);
    
    // Stands 2x2 (1-18)
    if (num >= 1 && num <= 18) {
      return {
        categoria: '2x2',
        cor: '#0097b2',
        preco: 'R$ 2.600,00',
        tamanho: '2x2m (4m²)',
        segmento: 'Stands 2x2'
      };
    }
    
    // Stands 3x3 Básico
    if ([19,20,21,22,23,24,25,26,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,67,68,69,70,71,72,73,74].includes(num)) {
      return {
        categoria: '3x3 Básico',
        cor: '#004aad',
        preco: 'R$ 3.500,00',
        tamanho: '3x3m (9m²)',
        segmento: 'Stands 3x3 Básico'
      };
    }
    
    // Stands 3x3 Acabamentos
    if ([27,28,29,30,31,32,33,34,35,36,37,38,55,56,57,58,59,60,61,62,63,64,65,66].includes(num)) {
      return {
        categoria: '3x3 Acabamentos',
        cor: '#6cace3',
        preco: 'R$ 3.500,00',
        tamanho: '3x3m (9m²)',
        segmento: 'Stands 3x3 Acabamentos'
      };
    }
    
    // Área 5x5 (75-90)
    if (num >= 75 && num <= 90) {
      return {
        categoria: '5x5',
        cor: '#55a04d',
        preco: 'R$ 5.200,00',
        tamanho: '5x5m (25m²)',
        segmento: 'Área 5x5'
      };
    }
    
    // Área 8x8 (92-97)
    if (num >= 92 && num <= 97) {
      return {
        categoria: '8x8',
        cor: '#ffb600',
        preco: 'R$ 8.500,00',
        tamanho: '8x8m (64m²)',
        segmento: 'Área 8x8'
      };
    }
    
    // Área 10x10 (91)
    if (num === 91) {
      return {
        categoria: '10x10',
        cor: '#ce1c21',
        preco: 'R$ 20.000,00',
        tamanho: '10x10m (100m²)',
        segmento: 'Área 10x10'
      };
    }
    
    // Área 9x10 (99-106)
    if (num >= 99 && num <= 106) {
      return {
        categoria: '9x10',
        cor: '#ff5500',
        preco: 'R$ 9.500,00',
        tamanho: '9x10m (90m²)',
        segmento: 'Área 9x10'
      };
    }
    
    return {
      categoria: 'Stand Personalizado',
      cor: '#CCCCCC',
      preco: 'A consultar',
      tamanho: 'Personalizado',
      segmento: 'Outros'
    };
  }, []);

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
        'WhatsApp': getTextoLegivel.isWhatsApp(inscricao.is_whatsapp || ''),
        'Responsável Stand': `${inscricao.nome_responsavel_stand} ${inscricao.sobrenome_responsavel_stand}`,
        'Email Responsável Stand': inscricao.email_responsavel_stand,
        'Stand Nº': inscricao.numero_stand,
        'Categoria Stand': standInfo.categoria,
        'Segmento': standInfo.segmento,
        'Tamanho': standInfo.tamanho,
        'Valor Stand': standInfo.preco,
        'Condição Pagamento': getTextoLegivel.condicaoPagamento(inscricao.condicao_pagamento || ''),
        'Forma Pagamento': getTextoLegivel.formaPagamento(inscricao.forma_pagamento || ''),
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
      {'Estatística': 'Stands 2x2', 'Valor': stats.stands2x2},
      {'Estatística': 'Stands 3x3 Básico', 'Valor': stats.stands3x3Basico},
      {'Estatística': 'Stands 3x3 Acabamentos', 'Valor': stats.stands3x3Acabamentos},
      {'Estatística': 'Stands 5x5', 'Valor': stats.stands5x5},
      {'Estatística': 'Stands 8x8', 'Valor': stats.stands8x8},
      {'Estatística': 'Stands 10x10', 'Valor': stats.stands10x10},
      {'Estatística': 'Stands 9x10', 'Valor': stats.stands9x10}
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
    const filename = `CONSTRUIND-2025-Pre-Inscricoes-${timestamp}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    const isFiltered = filteredPreInscricoes.length !== preInscricoes.length;
    const approvedCount = filteredPreInscricoes.filter(i => i.status === 'aprovado').length;
    
    showToast.success(
      `Arquivo exportado: ${filename} - ${filteredPreInscricoes.length} registros`
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
          className="bg-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#ff3c00]/20 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-[#ff3c00]/50"
          onClick={() => openModal(inscricao)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-gray-900 mb-2 line-clamp-2">
                  {getNome(inscricao)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(inscricao.status)}
                  <div className="flex items-center gap-1 text-xs text-gray-600">
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
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(inscricao);
                    }}
                    className="text-gray-900 hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-green-600 hover:bg-gray-100"
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
                    className="text-red-600 hover:bg-gray-100"
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
                    className="text-yellow-600 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(inscricao.id, 'pendente');
                    }}
                    disabled={inscricao.status === 'pendente'}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pendente
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    className="text-red-600 hover:bg-gray-100"
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-[#ff3c00]" />
                  <span>Stand: {inscricao.numero_stand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: getStandInfo(inscricao.numero_stand).cor }}
                  >
                    {inscricao.numero_stand}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 pl-6">
                {getStandInfo(inscricao.numero_stand).categoria} • {getStandInfo(inscricao.numero_stand).tamanho} • {getStandInfo(inscricao.numero_stand).preco}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-[#ff3c00]" />
                <span>{inscricao.contato_responsavel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-[#ff3c00]" />
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

    // Estado local para inputs para evitar re-renders durante digitação
    const [localInputs, setLocalInputs] = useState<Record<string, string>>({});

    // Memoizar currentData para evitar recálculos desnecessários
    const currentData = useMemo(() => {
      return isEditing ? editData : selectedPreInscricao;
    }, [isEditing, editData, selectedPreInscricao]);

    // Função para atualizar apenas o estado local (sem debounce)
    const updateFieldWithDebounce = useCallback((fieldName: string, value: string) => {
      // Atualizar apenas o estado local para responsividade
      setLocalInputs(prev => ({ ...prev, [fieldName]: value }));
    }, []);

    // Resetar inputs locais quando mudar de modo de edição
    useEffect(() => {
      if (!isEditing) {
        setLocalInputs({});
      }
    }, [isEditing]);

    // Memoizar função renderField para evitar re-criações
    const renderField = useCallback((label: string, value: string | undefined, fieldName?: string, type: 'text' | 'textarea' | 'select' = 'text', options?: string[]) => {
      // Obter valor atual (local se estiver sendo editado, senão do estado principal)
      const getCurrentValue = () => {
        if (!isEditing || !fieldName) return value || '';
        return localInputs[fieldName] !== undefined 
          ? localInputs[fieldName] 
          : (currentData[fieldName as keyof PreInscricaoExpositor] as string || '');
      };

      return (
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</Label>
          {isEditing && fieldName ? (
            type === 'textarea' ? (
              <Textarea
                value={getCurrentValue()}
                onChange={(e) => updateFieldWithDebounce(fieldName, e.target.value)}
                className="min-h-[60px] text-sm"
              />
            ) : type === 'select' ? (
              <Select 
                value={currentData[fieldName as keyof PreInscricaoExpositor] as string}
                onValueChange={(val) => setEditData(prev => ({ ...prev, [fieldName]: val }))}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options?.map(option => {
                    let displayText = option;
                    
                    if (fieldName === 'condicao_pagamento') {
                      displayText = getTextoLegivel.condicaoPagamento(option);
                    } else if (fieldName === 'forma_pagamento') {
                      displayText = getTextoLegivel.formaPagamento(option);
                    } else if (fieldName === 'is_whatsapp') {
                      displayText = getTextoLegivel.isWhatsApp(option);
                    }
                    
                    return (
                      <SelectItem key={option} value={option}>
                        {displayText}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={getCurrentValue()}
                onChange={(e) => updateFieldWithDebounce(fieldName, e.target.value)}
                className="text-sm"
              />
            )
          ) : (
            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
              {value || 'Não informado'}
            </p>
          )}
        </div>
      );
    }, [isEditing, localInputs, currentData, updateFieldWithDebounce]);

    // Função para salvar edições
    const saveEdits = async (inputs: Record<string, string>) => {
      if (!selectedPreInscricao) return;
      
      try {
        const updatedData = { ...editData };
        
        // Aplicar inputs locais ao editData
        Object.entries(inputs).forEach(([key, value]) => {
          updatedData[key] = value;
        });

        const { error } = await supabase
          .from('pre_inscricao_expositores')
          .update(updatedData)
          .eq('id', selectedPreInscricao.id);

        if (error) throw error;

        // Atualizar lista local
        setPreInscricoes(prev => 
          prev.map(item => 
            item.id === selectedPreInscricao.id 
              ? { ...item, ...updatedData }
              : item
          )
        );

        setIsEditing(false);
        setEditData({});
        setLocalInputs({});
        showToast.success('Pré-inscrição atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar edições:', error);
        showToast.error('Erro ao salvar alterações');
      }
    };

    return (
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0a2856] flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Detalhes da Pré-inscrição
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                  <User className="w-5 h-5" />
                  Dados Pessoais
                </h3>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={() => saveEdits(localInputs)} size="sm" className="bg-[#00d856] hover:bg-[#00d856]/90">
                         <Save className="w-4 h-4 mr-1" />
                         Salvar
                      </Button>
                   </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </>
                )}
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderField('Tipo de Pessoa', getTextoLegivel.tipoPessoa(currentData.tipo_pessoa), 'tipo_pessoa', 'select', ['fisica', 'juridica'])}
                  {currentData.tipo_pessoa === 'fisica' ? (
                    <>
                      {renderField('Nome', currentData.nome_pf, 'nome_pf')}
                      {renderField('CPF', currentData.cpf, 'cpf')}
                      {renderField('Email', currentData.email_pf, 'email_pf')}
                      {renderField('Telefone', currentData.telefone_pf, 'telefone_pf')}
                    </>
                  ) : (
                    <>
                      {renderField('Razão Social', currentData.razao_social, 'razao_social')}
                      {renderField('CNPJ', currentData.cnpj, 'cnpj')}
                      {renderField('Email', currentData.email_empresa, 'email_empresa')}
                      {renderField('Telefone', currentData.telefone_empresa, 'telefone_empresa')}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-center">
                <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentData.tipo_pessoa === 'fisica' ? (
                    <>
                      {renderField('CEP', currentData.cep_pf, 'cep_pf')}
                      {renderField('Logradouro', currentData.logradouro_pf, 'logradouro_pf')}
                      {renderField('Número', currentData.numero_pf, 'numero_pf')}
                      {renderField('Complemento', currentData.complemento_pf, 'complemento_pf')}
                      {renderField('Bairro', currentData.bairro_pf, 'bairro_pf')}
                      {renderField('Cidade', currentData.cidade_pf, 'cidade_pf')}
                      {renderField('Estado', currentData.estado_pf, 'estado_pf')}
                    </>
                  ) : (
                    <>
                      {renderField('CEP', currentData.cep, 'cep')}
                      {renderField('Endereço', currentData.logradouro, 'logradouro')}
                      {renderField('Número', currentData.numero, 'numero')}
                      {renderField('Complemento', currentData.complemento, 'complemento')}
                      {renderField('Bairro', currentData.bairro, 'bairro')}
                      {renderField('Cidade', currentData.cidade, 'cidade')}
                      {renderField('Estado', currentData.estado, 'estado')}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Responsáveis */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-center">
                <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                  <Users className="w-5 h-5" />
                  Responsáveis
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderField('Nome Responsável Legal', currentData.nome_responsavel, 'nome_responsavel')}
                  {renderField('Sobrenome Responsável Legal', currentData.sobrenome_responsavel, 'sobrenome_responsavel')}
                  {renderField('Contato Responsável', currentData.contato_responsavel, 'contato_responsavel')}
                  {renderField('É WhatsApp?', getTextoLegivel.isWhatsApp(currentData.is_whatsapp || ''), 'is_whatsapp', 'select', ['sim', 'nao'])}
                  {renderField('Nome Responsável Stand', currentData.nome_responsavel_stand, 'nome_responsavel_stand')}
                  {renderField('Sobrenome Responsável Stand', currentData.sobrenome_responsavel_stand, 'sobrenome_responsavel_stand')}
                  {renderField('Email Responsável Stand', currentData.email_responsavel_stand, 'email_responsavel_stand')}
                </div>
              </div>
            </div>

            {/* Stand e Pagamento */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-center">
                <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                  <Store className="w-5 h-5" />
                  Stand e Pagamento
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Informações do Stand */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Stand Selecionado: #{currentData.numero_stand}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Categoria:</span>
                      <p className="text-blue-800">{getStandInfo(currentData.numero_stand).categoria}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Segmento:</span>
                      <p className="text-blue-800">{getStandInfo(currentData.numero_stand).segmento}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Tamanho:</span>
                      <p className="text-blue-800">{getStandInfo(currentData.numero_stand).tamanho}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Valor:</span>
                      <p className="text-blue-800 font-bold">{getStandInfo(currentData.numero_stand).preco}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderField('Condição de Pagamento', getTextoLegivel.condicaoPagamento(currentData.condicao_pagamento || ''), 'condicao_pagamento', 'select', ['a_vista_desconto', 'sinal_3_parcelas'])}
                  {renderField('Forma de Pagamento', getTextoLegivel.formaPagamento(currentData.forma_pagamento || ''), 'forma_pagamento', 'select', ['pix', 'boleto'])}
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-center">
                 <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                   <FileText className="w-5 h-5" />
                   Informações Adicionais
                 </h3>
               </div>
              
              <div className="p-4 space-y-4">
                {renderField('Observações', currentData.observacoes, 'observacoes', 'textarea')}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">IP de Origem</Label>
                    <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border mt-1">
                      {selectedPreInscricao.ip_address || 'Não registrado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Última Atualização</Label>
                    <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border mt-1">
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

  const metrics = [
    {
      titulo: 'Total',
      valor: stats.total,
      icone: Users,
      cor: 'azul' as const
    },
    {
      titulo: 'Pendentes',
      valor: stats.pendentes,
      icone: Clock,
      cor: 'laranja' as const
    },
    {
      titulo: 'Aprovadas',
      valor: stats.aprovadas,
      icone: CheckCircle,
      cor: 'verde' as const
    },
    {
      titulo: 'Rejeitadas',
      valor: stats.rejeitadas,
      icone: XCircle,
      cor: 'cinza' as const
    },
    {
      titulo: 'Pessoa Física',
      valor: stats.fisicas,
      icone: User,
      cor: 'roxo' as const
    },
    {
      titulo: 'Pessoa Jurídica',
      valor: stats.juridicas,
      icone: Building2,
      cor: 'laranja' as const
    }
  ];

  const actions = [
    {
      label: 'Exportar Excel',
      onClick: exportToExcel,
      icone: Download,
      variante: 'secundario' as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Expositores <span className="text-[#ff3c00]">CONSTRUIND 2025</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie todas as pré-inscrições recebidas
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportToExcel}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pessoa Física</p>
                <p className="text-3xl font-bold text-gray-900">{stats.fisicas}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pessoa Jurídica</p>
                <p className="text-3xl font-bold text-gray-900">{stats.juridicas}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendentes}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Controles e Filtros */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por nome, CNPJ, CPF ou stand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#ff3c00] focus:ring-[#ff3c00]"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 border-gray-300">
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
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Tipos</SelectItem>
                    <SelectItem value="fisica">Pessoa Física</SelectItem>
                    <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={exportToExcel}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>

                <Button
                  onClick={loadPreInscricoes}
                  disabled={loading}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    onClick={() => setViewMode('cards')}
                    size="sm"
                    className={viewMode === 'cards' 
                      ? "bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'lista' ? 'default' : 'outline'}
                    onClick={() => setViewMode('lista')}
                    size="sm"
                    className={viewMode === 'lista' 
                      ? "bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'tabela' ? 'default' : 'outline'}
                    onClick={() => setViewMode('tabela')}
                    size="sm"
                    className={viewMode === 'tabela' 
                      ? "bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    <Table2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      <div className="space-y-6">
        {/* Estatísticas por Categoria de Stand */}
        {preInscricoes.length > 0 && (
          <Card className="bg-white border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#ff3c00]" />
                Distribuição por Categoria de Stand
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0097b2' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">2x2</div>
                    <div className="text-gray-600">{stats.stands2x2} stands</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#004aad' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">3x3 Básico</div>
                    <div className="text-gray-600">{stats.stands3x3Basico} stands</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6cace3' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">3x3 Acabamentos</div>
                    <div className="text-gray-600">{stats.stands3x3Acabamentos} stands</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#55a04d' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">5x5</div>
                    <div className="text-gray-600">{stats.stands5x5} stands</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ffb600' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">8x8</div>
                    <div className="text-gray-600">{stats.stands8x8} stands</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ce1c21' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">10x10</div>
                    <div className="text-gray-600">{stats.stands10x10} stands</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ff5500' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">9x10</div>
                    <div className="text-gray-600">{stats.stands9x10} stands</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contador de Resultados */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {filteredPreInscricoes.length === preInscricoes.length 
              ? `${filteredPreInscricoes.length} registros`
              : `${filteredPreInscricoes.length} de ${preInscricoes.length} registros`
            }
          </div>
        </div>

        {/* Resultados */}
        {filteredPreInscricoes.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg text-center p-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Nenhuma pré-inscrição encontrada
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Ainda não há pré-inscrições cadastradas.'
                }
              </p>
            </CardContent>
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
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Esta ação não pode ser desfeita. A pré-inscrição será permanentemente removida do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && deletePreInscricao(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default AdminPreInscricaoExpositores;