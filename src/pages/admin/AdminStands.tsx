import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import MetricCard from '@/components/ui/metric-card';
import PageHeader from '@/components/layout/PageHeader';

import { 
  Building2, 
  RefreshCw,
  Edit, 
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Trash2,
  Link,
  Settings,
  User,
  Mail,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { formatarMoedaBrasileira, converterPrecoParaNumero } from '@/lib/utils';

interface Stand {
  id: number;
  numero_stand: string;
  categoria: string;
  tamanho: string;
  preco: string | null;
  status: string;
  reservado_por?: string;
  data_reserva?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Dados da pré-inscrição vinculada
  pre_inscricao?: {
    id: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    razao_social?: string;
    nome_pf?: string;
    sobrenome_pf?: string;
    tipo_pessoa: 'fisica' | 'juridica';
    email_empresa?: string;
    email_pf?: string;
    is_temporary: boolean;
  };
}

const AdminStands: React.FC = () => {
  const [stands, setStands] = useState<Stand[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroStands, setFiltroStands] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    disponiveis: 0,
    reservados: 0,
    ocupados: 0,
    receitaTotalPotencial: 0
  });

  // Estados do modal
  const [editingStand, setEditingStand] = useState<Stand | null>(null);
  const [deletingStand, setDeletingStand] = useState<Stand | null>(null);
  const [preInscricoesDisponiveis, setPreInscricoesDisponiveis] = useState<any[]>([]);
  const [standForm, setStandForm] = useState({
    numero_stand: '',
    categoria: '',
    tamanho: '3x3m',
    preco: 'R$ 3.300,00',
    status: 'disponivel',
    observacoes: '',
    vinculado_pre_inscricao: 'remover'
  });

  // Estados para gerenciar categorias
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingNewCategory, setCreatingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ nome: '' });

  // FUNÇÃO: Normalizar status para apenas 3 estados
  const normalizeStatus = (stand: Stand): 'disponivel' | 'reservado' | 'ocupado' => {
    const currentStatus = stand.status || 'disponivel';
    
    // Se tem pré-inscrição aprovada = ocupado
    if (stand.pre_inscricao?.status === 'aprovado') {
      return 'ocupado';
    }
    
    // Se tem pré-inscrição pendente = reservado
    if (stand.pre_inscricao?.status === 'pendente') {
      return 'reservado';
    }
    
    // Status da tabela stands_construind
    if (currentStatus === 'ocupado') return 'ocupado';
    if (currentStatus === 'reservado') return 'reservado';
    
    return 'disponivel';
  };

  // CARREGAR STANDS COM PRÉ-INSCRIÇÕES (CORRIGIDO)
  const loadStands = async () => {
    setLoading(true);
    try {
      console.log('Carregando stands...');

      // 1. Carregar stands
      const { data: standsData, error: standsError } = await supabase
        .from('stands_construind')
        .select('*')
        .order('categoria')
        .order('numero_stand');

      if (standsError) throw standsError;

      // 2. Carregar TODAS as pré-inscrições (temporárias e definitivas)
      const { data: preInscricoesData, error: preInscricoesError } = await supabase
        .from('pre_inscricao_expositores')
        .select('*');

      if (preInscricoesError) throw preInscricoesError;

      // 3. Carregar pré-inscrições disponíveis para vinculação
      const { data: preInscricoesDisponiveis, error: preDispError } = await supabase
        .from('pre_inscricao_expositores')
        .select('*')
        .eq('is_temporary', false);

      if (preDispError) throw preDispError;
      setPreInscricoesDisponiveis(preInscricoesDisponiveis || []);

      // 4. Combinar dados
      const standsComPreInscricoes = standsData?.map(stand => {
        const preInscricao = preInscricoesData?.find(p => p.numero_stand === stand.numero_stand);
        return {
          ...stand,
          pre_inscricao: preInscricao || null
        };
      }) || [];

      setStands(standsComPreInscricoes);

      // 5. Calcular estatísticas com os 3 status simplificados
      const receitaTotal = standsComPreInscricoes.reduce((total, stand) => {
        if (!stand.preco) return total;
        const preco = converterPrecoParaNumero(stand.preco);
        return total + preco;
      }, 0);

      const newStats = {
        total: standsComPreInscricoes.length,
        disponiveis: standsComPreInscricoes.filter(s => normalizeStatus(s) === 'disponivel').length,
        reservados: standsComPreInscricoes.filter(s => normalizeStatus(s) === 'reservado').length,
        ocupados: standsComPreInscricoes.filter(s => normalizeStatus(s) === 'ocupado').length,
        receitaTotalPotencial: receitaTotal
      };
      setStats(newStats);

      console.log(`${standsComPreInscricoes.length} stands carregados`);
    } catch (error) {
      console.error('Erro ao carregar stands:', error);
      showToast.error('Erro ao carregar stands');
    } finally {
      setLoading(false);
    }
  };

  // RENOMEAR CATEGORIA
  const updateCategoryName = async (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) {
      setEditingCategory(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('stands_construind')
        .update({ categoria: newName.trim() })
        .eq('categoria', oldName);

      if (error) throw error;

      showToast.success(`Categoria "${oldName}" renomeada para "${newName}"`);
      setEditingCategory(null);
      setNewCategoryName('');
      loadStands();
    } catch (error: any) {
      console.error('Erro ao renomear categoria:', error);
      showToast.error('Erro ao renomear categoria: ' + error.message);
    }
  };

  // ADICIONAR NOVO STAND EM CATEGORIA EXISTENTE (COM NÚMERO MANUAL)
  const addStandToCategory = (categoria: string) => {
    // Resetar formulário e abrir modal
    setStandForm({
      numero_stand: '',
      categoria: categoria,
      tamanho: '3x3m', 
      preco: 'R$ 3.300,00',
      status: 'disponivel',
      observacoes: '',
      vinculado_pre_inscricao: 'remover'
    });
    setEditingStand({} as Stand); // Modal para criação
  };

  // SALVAR STAND (CRIAR OU EDITAR)
  const saveStand = async () => {
    if (!standForm.numero_stand || !standForm.categoria) {
      showToast.error('Número do stand e categoria são obrigatórios');
      return;
    }

    try {
      // Verificar duplicação de número (somente ao criar)
      if (!editingStand?.id) {
        const { data: existing } = await supabase
          .from('stands_construind')
          .select('numero_stand')
          .eq('numero_stand', standForm.numero_stand);

        if (existing && existing.length > 0) {
          showToast.error(`Stand ${standForm.numero_stand} já existe!`);
          return;
        }
      }

      const standData = {
        numero_stand: standForm.numero_stand,
        categoria: standForm.categoria,
        tamanho: standForm.tamanho,
        preco: standForm.preco,
        status: standForm.status,
        observacoes: standForm.observacoes || null
      };

      if (editingStand?.id) {
        // Atualizar
        const { error } = await supabase
          .from('stands_construind')
          .update(standData)
          .eq('id', editingStand.id);

        if (error) throw error;
        showToast.success('Stand atualizado!');
      } else {
        // Criar
        const { error } = await supabase
          .from('stands_construind')
          .insert(standData);

        if (error) throw error;
        showToast.success(`Stand ${standForm.numero_stand} criado!`);
      }

      // Vincular pré-inscrição se selecionada
      if (standForm.vinculado_pre_inscricao && standForm.vinculado_pre_inscricao !== 'remover') {
        await vincularPreInscricao(standForm.numero_stand, standForm.vinculado_pre_inscricao);
      }

      setEditingStand(null);
      loadStands();
    } catch (error: any) {
      console.error('Erro ao salvar stand:', error);
      showToast.error('Erro ao salvar: ' + error.message);
    }
  };

  // 🆕 CRIAR NOVA CATEGORIA
  const createNewCategory = async () => {
    if (!newCategory.nome.trim()) {
      showToast.error('Por favor, digite o nome da categoria');
      return;
    }

    const categories = [...new Set(stands.map(s => s.categoria).filter(Boolean))];
    if (categories.includes(newCategory.nome)) {
      showToast.error('Esta categoria já existe');
      return;
    }

    try {
      setCreatingNewCategory(true);
      
      const maxStand = stands.reduce((max, stand) => {
        const num = parseInt(stand.numero_stand);
        return num > max ? num : max;
      }, 0);

      const newStandData = {
        numero_stand: String(maxStand + 1).padStart(2, '0'),
        categoria: newCategory.nome,
        tamanho: '3x3m',
        preco: 'R$ 3.300,00',
        status: 'disponivel',
        observacoes: null
      };

      const { error } = await supabase
        .from('stands_construind')
        .insert(newStandData);

      if (error) throw error;

      showToast.success(`Nova categoria "${newCategory.nome}" criada!`);
      setNewCategory({ nome: '' });
      loadStands();
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      showToast.error('Erro ao criar categoria: ' + error.message);
    } finally {
      setCreatingNewCategory(false);
    }
  };

  // APROVAR/REJEITAR PRÉ-INSCRIÇÃO - NOVA LÓGICA COM STATUS
  const updatePreInscricaoStatus = async (preInscricaoId: string, newStatus: 'aprovado' | 'rejeitado', standNumero: string) => {
    try {
      // 1. Buscar dados da pré-inscrição
      const { data: preInscricao, error: fetchError } = await supabase
        .from('pre_inscricao_expositores')
        .select('*')
        .eq('id', preInscricaoId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Atualizar status da pré-inscrição
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .update({ status: newStatus })
        .eq('id', preInscricaoId);

      if (error) throw error;

      // 3. NOVA LÓGICA: Atualizar STATUS da tabela stands_construind
      const nomeExpositor = preInscricao.tipo_pessoa === 'fisica' 
        ? preInscricao.nome_pf 
        : preInscricao.razao_social || `${preInscricao.nome_responsavel} ${preInscricao.sobrenome_responsavel}`;

      if (newStatus === 'aprovado') {
        // APROVADO: status = 'ocupado' + vincular expositor
        await supabase
          .from('stands_construind')
          .update({
            status: 'ocupado',
            reservado_por: nomeExpositor,
            data_reserva: new Date().toISOString(),
            observacoes: `APROVADO - ${nomeExpositor}`,
            updated_at: new Date().toISOString()
          })
          .eq('numero_stand', standNumero);
      } else {
        // REJEITADO: status = 'disponivel' + limpar vinculação
        await supabase
          .from('stands_construind')
          .update({
            status: 'disponivel',
            reservado_por: null,
            data_reserva: null,
            observacoes: null,
            updated_at: new Date().toISOString()
          })
          .eq('numero_stand', standNumero);
      }

      showToast.success(`Pré-inscrição do stand ${standNumero} ${newStatus === 'aprovado' ? 'aprovada' : 'rejeitada'}!`);
      
      // Forçar atualização e disparar real-time
      console.log(`[ADMIN] Pré-inscrição ${newStatus} - Stand ${standNumero} atualizado`);
      loadStands();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      showToast.error('Erro: ' + error.message);
    }
  };

  // VINCULAR PRÉ-INSCRIÇÃO AO STAND
  const vincularPreInscricao = async (numeroStand: string, preInscricaoId: string) => {
    try {
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .update({ numero_stand: numeroStand })
        .eq('id', preInscricaoId);

      if (error) throw error;
      showToast.success('Pré-inscrição vinculada ao stand!');
    } catch (error: any) {
      console.error('Erro ao vincular:', error);
      showToast.error('Erro ao vincular: ' + error.message);
    }
  };

  // EXCLUIR STAND
  const deleteStand = async (stand: Stand) => {
    try {
      // Verificar se tem pré-inscrição vinculada
      if (stand.pre_inscricao) {
        showToast.error('Não é possível excluir stand com pré-inscrição vinculada!');
        return;
      }

      const { error } = await supabase
        .from('stands_construind')
        .delete()
        .eq('id', stand.id);

      if (error) throw error;

      showToast.success(`Stand ${stand.numero_stand} excluído!`);
      setDeletingStand(null);
      loadStands();
    } catch (error: any) {
      console.error('Erro ao excluir stand:', error);
      showToast.error('Erro ao excluir: ' + error.message);
    }
  };

  // ABRIR MODAL DE EDIÇÃO
  const openEditStand = (stand: Stand) => {
    setStandForm({
      numero_stand: stand.numero_stand,
      categoria: stand.categoria,
      tamanho: stand.tamanho,
      preco: stand.preco,
      status: stand.status,
      observacoes: stand.observacoes || '',
      vinculado_pre_inscricao: stand.pre_inscricao?.id || 'remover'
    });
    setEditingStand(stand);
  };

  // DESVINCULAR PRÉ-INSCRIÇÃO
  const desvincularPreInscricao = async (preInscricaoId: string, standNumero: string) => {
    try {
      const { error } = await supabase
        .from('pre_inscricao_expositores')
        .update({ 
          numero_stand: '', // String vazia em vez de null
          status: 'pendente' // Volta para pendente quando desvincula
        })
        .eq('id', preInscricaoId);

      if (error) throw error;

      // NOVO: Liberar stand na tabela stands_construind
      await supabase
        .from('stands_construind')
        .update({
          status: 'disponivel',
          reservado_por: null,
          data_reserva: null,
          observacoes: null,
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', standNumero);

      showToast.success(`Expositor desvinculado do stand ${standNumero}!`);
      loadStands();
    } catch (error: any) {
      console.error('Erro ao desvincular:', error);
      showToast.error('Erro ao desvincular: ' + error.message);
    }
  };

  // 🟡 RESERVAR STAND (USANDO COLUNA STATUS)
  const preReservarStand = async (numeroStand: string) => {
    try {
      // ATUALIZAR status = 'reservado' (SEM timeout)
      const { error } = await supabase
        .from('stands_construind')
        .update({
          status: 'reservado',
          reservado_por: 'RESERVADO PELO PRODUTOR',
          data_reserva: new Date().toISOString(),
          observacoes: 'Reservado manualmente pelo produtor via sistema administrativo - SEM timeout',
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', numeroStand);

      if (error) throw error;

      showToast.success(`Stand ${numeroStand} reservado pelo produtor!`);
      loadStands();
    } catch (error: any) {
      console.error('Erro ao pré-reservar:', error);
      showToast.error('Erro ao pré-reservar: ' + error.message);
    }
  };

  // 🟢 LIBERAR STAND (USANDO COLUNA STATUS)
  const liberarStand = async (numeroStand: string) => {
    try {
      // ATUALIZAR status = 'disponivel' para liberar stand
      const { error } = await supabase
        .from('stands_construind')
        .update({
          status: 'disponivel',
          reservado_por: null,
          data_reserva: null,
          observacoes: null,
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', numeroStand);

      if (error) throw error;

      showToast.success(`Stand ${numeroStand} liberado!`);
      loadStands();
    } catch (error: any) {
      console.error('Erro ao liberar:', error);
      showToast.error('Erro ao liberar: ' + error.message);
    }
  };

  // SISTEMA REAL-TIME COMPLETO
  useEffect(() => {
    loadStands();

    // REAL-TIME: Escutar mudanças nas tabelas stands e pré-inscrições
    const canalStands = supabase
      .channel('admin-stands-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'stands_construind'
      }, (payload) => {
        console.log('[ADMIN] Mudança detectada na tabela stands_construind:', payload);
        loadStands();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pre_inscricao_expositores'
      }, (payload) => {
        console.log('[ADMIN] Mudança detectada na tabela pre_inscricao_expositores:', payload);
        loadStands();
      })
      .subscribe((status) => {
        console.log('[ADMIN] Status do canal real-time:', status);
      });

    return () => {
      canalStands.unsubscribe();
    };
  }, []);

  // Agrupar stands por categoria
  const categories = [...new Set(stands.map(s => s.categoria).filter(Boolean))];

  if (loading && stands.length === 0) {
    return (
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[#ff3c00]/5 via-black to-[#3d3d3d]/10 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff3c00] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 animate-spin text-white" />
            </div>
            <p className="text-gray-300 text-lg">Carregando stands...</p>
          </div>
        </div>
      </div>
    );
  }

  const estatisticas = [
    {
      titulo: 'Total de Stands',
      valor: stats.total.toString(),
      icone: Building2,
      cor: 'laranja' as const
    },
    {
      titulo: 'Disponíveis',
      valor: stats.disponiveis.toString(),
      icone: CheckCircle,
      cor: 'verde' as const
    },
    {
      titulo: 'Reservados',
      valor: stats.reservados.toString(),
      icone: XCircle,
      cor: 'amarelo' as const
    },
    {
      titulo: 'Ocupados',
      valor: stats.ocupados.toString(),
      icone: User,
      cor: 'azul' as const
    }
  ];

  const acoes = [
    {
      label: 'Novo Stand',
      icone: Plus,
      onClick: () => setShowCreateModal(true)
    },
    {
      label: 'Atualizar',
      icone: RefreshCw,
      onClick: loadStands,
      carregando: loading
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] rounded-xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestão de <span className="text-[#ff3c00]">Stands</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie todos os stands do evento com controle total de status e vinculações
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] hover:from-[#e63600] hover:to-[#e55a2b] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Stand
            </Button>
            <Button
              onClick={loadStands}
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total de Stands</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-gray-600 text-sm font-medium mb-2">Disponíveis</p>
                <p className="text-3xl font-bold text-gray-900">{stats.disponiveis}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Reservados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.reservados}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Ocupados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.ocupados}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Receita Total Potencial</p>
                <p className="text-3xl font-bold text-gray-900">{formatarMoedaBrasileira(stats.receitaTotalPotencial)}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BARRA DE BUSCA DE STANDS */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar stands por número, categoria ou status..."
                value={filtroStands}
                onChange={(e) => setFiltroStands(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff3c00]"
              />
            </div>
            <Button
              onClick={() => setFiltroStands('')}
              variant="outline"
              className="px-4"
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">

        {/* GERENCIAMENTO DE CATEGORIAS */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff3c00] to-[#ff8c00] rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                Stands por Categoria
              </CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da nova categoria"
                  value={newCategory.nome}
                  onChange={(e) => setNewCategory({ nome: e.target.value })}
                  className="w-48 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff3c00]"
                  onKeyDown={(e) => e.key === 'Enter' && createNewCategory()}
                />
                <Button 
                  onClick={createNewCategory}
                  disabled={creatingNewCategory || !newCategory.nome.trim()}
                  className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] hover:from-[#ff3c00]/90 hover:to-[#ff8c00]/90 text-white"
                >
                  {creatingNewCategory ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Nova Categoria
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">Nenhum stand encontrado</p>
                <p className="text-gray-500 text-sm mt-2">Crie uma nova categoria para começar</p>
              </div>
            ) : (
            categories.map(categoria => {
              // Filtrar stands por categoria e depois aplicar filtro de busca
              let standsCategoria = stands.filter(s => s.categoria === categoria);
              
              // Aplicar filtro de busca se houver texto
              if (filtroStands.trim()) {
                standsCategoria = standsCategoria.filter(stand => 
                  stand.numero_stand.toLowerCase().includes(filtroStands.toLowerCase()) ||
                  stand.categoria.toLowerCase().includes(filtroStands.toLowerCase()) ||
                  stand.status.toLowerCase().includes(filtroStands.toLowerCase()) ||
                  (stand.reservado_por && stand.reservado_por.toLowerCase().includes(filtroStands.toLowerCase())) ||
                  (stand.pre_inscricao?.razao_social && stand.pre_inscricao.razao_social.toLowerCase().includes(filtroStands.toLowerCase())) ||
                  (stand.pre_inscricao?.nome_pf && `${stand.pre_inscricao.nome_pf} ${stand.pre_inscricao.sobrenome_pf || ''}`.toLowerCase().includes(filtroStands.toLowerCase()))
                );
              }
              
              // Ordenar stands numericamente dentro da categoria
              standsCategoria.sort((a, b) => {
                const numeroA = parseInt(a.numero_stand.replace(/\D/g, '')) || 0;
                const numeroB = parseInt(b.numero_stand.replace(/\D/g, '')) || 0;
                return numeroA - numeroB;
              });
              
              const isEditing = editingCategory === categoria;

              if (standsCategoria.length === 0) return null;

              return (
                <div key={categoria} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    {isEditing ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Novo nome da categoria"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateCategoryName(categoria, newCategoryName);
                            } else if (e.key === 'Escape') {
                              setEditingCategory(null);
                              setNewCategoryName('');
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => updateCategoryName(categoria, newCategoryName)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(null);
                            setNewCategoryName('');
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-[#0a2856] flex items-center gap-2 leading-none">
                          <Building2 className="w-5 h-5" />
                          {categoria} ({standsCategoria.length} stands)
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(categoria);
                              setNewCategoryName(categoria);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => addStandToCategory(categoria)}
                            className="bg-[#00d856] hover:bg-[#00d856]/90"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Novo Stand
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* STANDS DA CATEGORIA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {standsCategoria.map(stand => {
                      // Informações do expositor
                      const expositor = stand.pre_inscricao ? {
                        nome: stand.pre_inscricao.tipo_pessoa === 'juridica' 
                          ? (stand.pre_inscricao.razao_social || 'Empresa')
                          : `${stand.pre_inscricao.nome_pf || 'Nome'} ${stand.pre_inscricao.sobrenome_pf || ''}`.trim(),
                        email: stand.pre_inscricao.tipo_pessoa === 'juridica'
                          ? stand.pre_inscricao.email_empresa
                          : stand.pre_inscricao.email_pf,
                        status: stand.pre_inscricao.status,
                        tipo: stand.pre_inscricao.tipo_pessoa
                      } : null;

                      // NOVA LÓGICA: Baseada na coluna status normalizada
                      const getStatusColor = () => {
                        const standStatus = normalizeStatus(stand);
                        
                        switch (standStatus) {
                          case 'reservado':
                            return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg';
                          case 'ocupado':
                            return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg';
                          case 'disponivel':
                          default:
                            return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg';
                        }
                      };

                      const getStatusText = () => {
                        const standStatus = normalizeStatus(stand);
                        
                        switch (standStatus) {
                          case 'reservado':
                            return 'Reservado';
                          case 'ocupado':
                            return 'Ocupado';
                          case 'disponivel':
                          default:
                            return 'Disponível';
                        }
                      };

                      const getCardBorderColor = () => {
                        const standStatus = normalizeStatus(stand);
                        
                        switch (standStatus) {
                          case 'reservado':
                            return 'border-l-yellow-500 hover:border-l-yellow-600';
                          case 'ocupado':
                            return 'border-l-gray-500 hover:border-l-gray-600';
                          case 'disponivel':
                          default:
                            return 'border-l-green-500 hover:border-l-green-600';
                        }
                      };

                      return (
                        <Card key={stand.id} className={`relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${getCardBorderColor()} cursor-pointer bg-white shadow-md`} onClick={() => openEditStand(stand)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0a2856] to-[#1e3d72] flex items-center justify-center shadow-lg">
                                  <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl font-bold text-[#0a2856] leading-none mb-0">
                                    Stand {stand.numero_stand}
                                  </CardTitle>
                                  <CardDescription className="text-sm text-gray-600 font-medium leading-none mt-1">
                                    {stand.categoria}
                                  </CardDescription>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={`${getStatusColor()} border-0 px-3 py-1 text-sm font-semibold rounded-full`}>
                                  {getStatusText()}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-red-100 rounded-full transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingStand(stand);
                                  }}
                                  disabled={!!stand.pre_inscricao}
                                  title={stand.pre_inscricao ? 'Stand com expositor não pode ser excluído' : 'Excluir stand'}
                                >
                                  <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0 space-y-3">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200 shadow-sm">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700 leading-none">{stand.tamanho}</span>
                                </div>
                                <span className="font-bold text-green-600 text-lg leading-none">
                                  {stand.preco && stand.preco.toString().startsWith('R$') 
                                    ? stand.preco 
                                    : formatarMoedaBrasileira(parseFloat(stand.preco) || 0)}
                                </span>
                              </div>
                            </div>
                
                            {expositor ? (
                                                              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                                 {/* Header com Avatar e Nome */}
                                 <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                   <div className="flex items-center gap-3">
                                     <div className="relative">
                                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                         <User className="w-5 h-5 text-white" />
                                       </div>
                                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                         expositor.status === 'aprovado' ? 'bg-green-500' :
                                         expositor.status === 'pendente' ? 'bg-yellow-500' : 'bg-red-500'
                                       }`}></div>
                                     </div>
                                     <div className="min-w-0 flex-1">
                                       <h4 className="font-semibold text-gray-900 text-sm truncate leading-none mb-0">{expositor.nome}</h4>
                                       <p className="text-xs text-gray-500 capitalize leading-none mt-1">
                                         {expositor.tipo === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                                       </p>
                                     </div>
                                   </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-red-50 rounded-full flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      desvincularPreInscricao(stand.pre_inscricao!.id, stand.numero_stand);
                                    }}
                                    title="Desvincular expositor"
                                  >
                                    <XCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                  </Button>
                                </div>

                                                                 {/* Informações de Contato */}
                                 <div className="p-3 space-y-2">
                                   <div className="flex items-center gap-2">
                                     <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                     <span className="text-xs text-gray-600 truncate leading-none">{expositor.email}</span>
                                   </div>
                                   
                                   <div className="flex items-center gap-2">
                                     <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                     <span className="text-xs text-gray-600 leading-none">
                                       Stand {stand.numero_stand} • {stand.categoria}
                                     </span>
                                   </div>

                                   {/* Badge de Status */}
                                   <div className="flex items-center justify-between pt-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs font-medium ${
                                        expositor.status === 'aprovado' 
                                          ? 'bg-green-50 text-green-700 border-green-200'
                                          : expositor.status === 'pendente'
                                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                          : 'bg-red-50 text-red-700 border-red-200'
                                      }`}
                                    >
                                      {expositor.status === 'aprovado' ? 'Aprovado' :
                expositor.status === 'pendente' ? 'Pendente' : 'Rejeitado'}
                                    </Badge>
                                    
                                    {/* Ações para status pendente */}
                                    {expositor.status === 'pendente' && (
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md shadow-sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updatePreInscricaoStatus(stand.pre_inscricao!.id, 'aprovado', stand.numero_stand);
                                          }}
                                          title="Aprovar pré-inscrição"
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="h-7 px-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md shadow-sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updatePreInscricaoStatus(stand.pre_inscricao!.id, 'rejeitado', stand.numero_stand);
                                          }}
                                          title="Rejeitar pré-inscrição"
                                        >
                                          <XCircle className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : normalizeStatus(stand) === 'ocupado' && !stand.pre_inscricao ? (
                              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border-2 border-gray-300 p-4 text-center shadow-sm">
                                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm text-gray-800 font-bold leading-none mb-0">Stand Ocupado</p>
                                <p className="text-xs text-gray-600 mt-1 leading-none">Sem expositor vinculado</p>
                                
                                {/* Botão de Liberar Stand */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-3 w-full bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    liberarStand(stand.numero_stand);
                                  }}
                                  title="Liberar este stand"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Liberar Stand
                                </Button>
                              </div>
                            ) : normalizeStatus(stand) === 'reservado' ? (
                              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl border-2 border-yellow-200 p-3 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                      <Settings className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-yellow-900 text-sm leading-none">
                                      {stand.observacoes?.includes('Timeout') 
                                        ? 'RESERVA EM ANDAMENTO' 
                                        : 'Reservado pelo Produtor'
                                      }
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 hover:bg-red-100 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      liberarStand(stand.numero_stand);
                                    }}
                                    title="Liberar pré-reserva"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="bg-yellow-100 rounded-lg p-2 mb-1">
                                  <p className="text-xs text-yellow-800 font-medium leading-none">
                                    {stand.observacoes?.includes('Timeout') 
                                      ? 'Usuário preenchendo formulário (10min timeout)' 
                                      : 'Aguardando cadastro via formulário'
                                    }
                                  </p>
                                </div>
                                {stand.data_reserva && (
                                  <p className="text-xs text-yellow-700 font-medium leading-none">
                                    Reservado em {new Date(stand.data_reserva).toLocaleString('pt-BR')}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 p-4 text-center shadow-sm">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm text-green-800 font-bold leading-none mb-0">Stand Disponível</p>
                                <p className="text-xs text-green-700 mt-1 leading-none">Pronto para reserva</p>
                                
                                {/* Botão de Pré-Reservar */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-3 w-full bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    preReservarStand(stand.numero_stand);
                                  }}
                                  title="Pré-reservar este stand"
                                >
                                  <Link className="w-4 h-4 mr-2" />
                                  Pré-Reservar
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* MODAL DE EDIÇÃO/CRIAÇÃO */}
      <Dialog open={!!editingStand} onOpenChange={() => setEditingStand(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#0a2856] flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#0a2856]">
                  {editingStand?.id ? `Stand ${editingStand.numero_stand}` : 'Novo Stand'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {editingStand?.id 
                    ? 'Gerencie status, vinculações e configurações do stand' 
                    : 'Configure um novo stand com número personalizado'
                  }
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            {/* COLUNA 1: STATUS & EXPOSITOR */}
            <div className="space-y-4">
              {/* CONTROLE DO STATUS */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border-2 border-blue-200">
                <h3 className="font-bold text-[#0a2856] mb-2 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Status no Formulário
                </h3>
                
                {/* Status Atual */}
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    {editingStand && normalizeStatus(editingStand) === 'ocupado' ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                        <span className="font-medium text-gray-700">Ocupado</span>
                      </>
                    ) : editingStand && normalizeStatus(editingStand) === 'reservado' ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="font-medium text-yellow-700">Reservado</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="font-medium text-green-700">Disponível</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Como aparece no formulário público
                  </p>
                </div>

                {/* Ações de Controle */}
                {editingStand && !editingStand?.pre_inscricao && normalizeStatus(editingStand) === 'disponivel' && (
                  <Button
                    onClick={() => preReservarStand(editingStand?.numero_stand!)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    size="sm"
                  >
                    🟡 Pré-reservar Stand
                  </Button>
                )}
                
                {editingStand && normalizeStatus(editingStand) === 'reservado' && (
                  <Button
                    onClick={() => liberarStand(editingStand.numero_stand)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    🟢 Liberar Stand
                  </Button>
                )}
              </div>

              {/* EXPOSITOR VINCULADO */}
              {editingStand?.pre_inscricao && (
                <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                  <h3 className="font-bold text-[#0a2856] mb-1.5 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Expositor Vinculado
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-green-900">
                            {editingStand.pre_inscricao.nome_pf === 'RESERVADO' 
                              ? '🟡 Reservado pelo Produtor'
                              : editingStand.pre_inscricao.tipo_pessoa === 'juridica' 
                              ? (editingStand.pre_inscricao.razao_social || 'Empresa')
                              : `${editingStand.pre_inscricao.nome_pf || 'Nome'} ${editingStand.pre_inscricao.sobrenome_pf || ''}`
                            }
                          </p>
                          <p className="text-xs text-green-700">
                            {editingStand.pre_inscricao.email_empresa || editingStand.pre_inscricao.email_pf}
                          </p>
                        </div>
                        <Badge 
                          variant={editingStand.pre_inscricao.status === 'pendente' ? 'default' : 
                                 editingStand.pre_inscricao.status === 'aprovado' ? 'secondary' : 'destructive'}
                        >
                          {editingStand.pre_inscricao.status === 'pendente' ? 'Aguardando' :
                           editingStand.pre_inscricao.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </div>
                      
                      {editingStand.pre_inscricao.status === 'pendente' && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-green-200">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              updatePreInscricaoStatus(editingStand.pre_inscricao!.id, 'aprovado', editingStand.numero_stand);
                              // Status será atualizado automaticamente via real-time
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              updatePreInscricaoStatus(editingStand.pre_inscricao!.id, 'rejeitado', editingStand.numero_stand);
                              // Status será atualizado automaticamente via real-time
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        desvincularPreInscricao(editingStand.pre_inscricao!.id, editingStand.numero_stand);
                        setStandForm(prev => ({ ...prev, vinculado_pre_inscricao: 'remover' }));
                      }}
                      className="w-full text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Desvincular Expositor
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* COLUNA 2: CONFIGURAÇÕES */}
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
              <h3 className="font-bold text-[#0a2856] mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Configurações
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Número</Label>
                    <Input
                      value={standForm.numero_stand}
                      onChange={(e) => setStandForm(prev => ({ ...prev, numero_stand: e.target.value }))}
                      placeholder="Ex: 01, 15, 99..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Categoria</Label>
                    <Select
                      value={standForm.categoria}
                      onValueChange={(value) => setStandForm(prev => ({ ...prev, categoria: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tamanho</Label>
                    <Select
                      value={standForm.tamanho}
                      onValueChange={(value) => setStandForm(prev => ({ ...prev, tamanho: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3x3m">3x3m</SelectItem>
                        <SelectItem value="5x5m">5x5m</SelectItem>
                        <SelectItem value="6x6m">6x6m</SelectItem>
                        <SelectItem value="10x10m">10x10m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Preço</Label>
                    <Input
                      value={standForm.preco}
                      onChange={(e) => setStandForm(prev => ({ ...prev, preco: e.target.value }))}
                      placeholder="R$ 3.300,00"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Observações</Label>
                  <Textarea
                    value={standForm.observacoes}
                    onChange={(e) => setStandForm(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Anotações internas sobre este stand..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="disponivel"
                    checked={standForm.status === 'disponivel'}
                    onChange={(e) => setStandForm(prev => ({ ...prev, status: e.target.checked ? 'disponivel' : 'ocupado' }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="disponivel" className="text-sm font-medium text-blue-900">
                    Stand visível no formulário público
                  </Label>
                </div>
              </div>
            </div>

            {/* COLUNA 3: VINCULAR EXPOSITOR */}
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
              <h3 className="font-bold text-[#0a2856] mb-4 flex items-center gap-2">
                <Link className="h-5 w-5" />
                Vincular Expositor
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Escolher Expositor</Label>
                  <Select
                    value={standForm.vinculado_pre_inscricao}
                    onValueChange={(value) => setStandForm(prev => ({ ...prev, vinculado_pre_inscricao: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar expositor..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remover">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Sem expositor</span>
                        </div>
                      </SelectItem>
                      {preInscricoesDisponiveis.map(pre => (
                        <SelectItem key={pre.id} value={pre.id}>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {pre.tipo_pessoa === 'juridica' 
                                ? (pre.razao_social || 'Empresa') 
                                : `${pre.nome_pf || 'Nome'} ${pre.sobrenome_pf || ''}`.trim()
                              }
                            </div>
                            <div className="text-xs text-gray-500">
                              {pre.tipo_pessoa === 'juridica' ? pre.email_empresa : pre.email_pf} • {pre.status}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* PREVIEW DO EXPOSITOR SELECIONADO */}
                {standForm.vinculado_pre_inscricao && standForm.vinculado_pre_inscricao !== 'remover' && (() => {
                  const expositorSelecionado = preInscricoesDisponiveis.find(p => p.id === standForm.vinculado_pre_inscricao);
                  return expositorSelecionado ? (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">
                          {expositorSelecionado.tipo_pessoa === 'juridica' 
                            ? (expositorSelecionado.razao_social || 'Empresa')
                            : `${expositorSelecionado.nome_pf || 'Nome'} ${expositorSelecionado.sobrenome_pf || ''}`.trim()
                          }
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 mb-2">
                        {expositorSelecionado.tipo_pessoa === 'juridica' 
                          ? expositorSelecionado.email_empresa 
                          : expositorSelecionado.email_pf
                        }
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {expositorSelecionado.tipo_pessoa === 'juridica' ? 'Empresa' : 'Pessoa Física'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {expositorSelecionado.status}
                        </Badge>
                      </div>
                    </div>
                  ) : null;
                })()}

                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <strong>Dica:</strong> Qualquer expositor pode ser vinculado a stands, independente do status. Expositores aprovados podem ser realocados para outros stands.
                </div>
              </div>
            </div>
          </div>

          {/* AÇÕES PRINCIPAIS */}
          <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
            <Button onClick={saveStand} className="flex-1 bg-[#00d856] hover:bg-[#00d856]/90 text-white font-semibold py-3">
              <CheckCircle className="w-5 h-5 mr-2" />
              {editingStand?.id ? 'Salvar Alterações' : 'Criar Stand'}
            </Button>
            <Button variant="outline" onClick={() => setEditingStand(null)} className="px-8 py-3">
              <XCircle className="w-5 h-5 mr-2" />
              Cancelar
            </Button>
            {editingStand?.id && !editingStand.pre_inscricao && (
              <Button 
                variant="outline" 
                onClick={() => setDeletingStand(editingStand)}
                className="px-8 py-3 text-red-600 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Excluir Stand
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <AlertDialog open={!!deletingStand} onOpenChange={() => setDeletingStand(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Stand</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o stand {deletingStand?.numero_stand}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingStand && deleteStand(deletingStand)}
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

export default AdminStands;