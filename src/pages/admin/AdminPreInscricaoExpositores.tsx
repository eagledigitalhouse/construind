import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import PageHeader from '@/components/layout/PageHeader';
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
import { verificarContratoExistente, criarContratoZapSign } from '@/lib/contratos';
import ModalSelecaoModeloZapSign from '@/components/contratos/ModalSelecaoModeloZapSign';
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
  const [contratoExistente, setContratoExistente] = useState<boolean>(false);
  const [showEntidadeModal, setShowEntidadeModal] = useState(false);
  const [showZapSignModal, setShowZapSignModal] = useState(false);
  const [preInscricaoParaContrato, setPreInscricaoParaContrato] = useState<PreInscricaoExpositor | null>(null);
  const [preInscricaoParaEntidade, setPreInscricaoParaEntidade] = useState<PreInscricaoExpositor | null>(null);
  // Estado para stands disponíveis
  const [standsDisponiveis, setStandsDisponiveis] = useState<any[]>([]);

  // Carregar stands disponíveis
  const loadStandsDisponiveis = async () => {
    try {
      const { data, error } = await supabase
        .from('stands_fespin')
        .select('*')
        .eq('disponivel', true)
        .order('numero_stand');

      if (error) {
        console.error('Erro ao carregar stands disponíveis:', error);
        return;
      }

      setStandsDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao carregar stands disponíveis:', error);
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
      // Carregar stands disponíveis também
      await loadStandsDisponiveis();
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

  // Função para adicionar dados à tabela de entidades
  const adicionarAEntidades = async (preInscricao: PreInscricaoExpositor) => {
    try {
      // Verificar se já existe uma entidade para esta pré-inscrição
      const { data: entidadeExistente, error: errorVerificacao } = await supabase
        .from('entidades')
        .select('id')
        .eq('origem', 'pre_inscricao_expositor')
        .like('origem_id', `${preInscricao.id}%`)
        .single();

      if (errorVerificacao && errorVerificacao.code !== 'PGRST116') {
        console.error('Erro ao verificar entidade existente:', errorVerificacao);
        showToast.error('Erro ao verificar entidade existente');
        return false;
      }

      if (entidadeExistente) {
        showToast.error('Já existe uma entidade criada para esta pré-inscrição');
        return false;
      }
      
      let dadosEntidade: any = {
        nome: '',
        tipo: preInscricao.tipo_pessoa === 'fisica' ? 'pessoa_fisica' : 'pessoa_juridica',
        categoria: 'expositores', // Categoria específica para expositores
        subcategoria: `Stand ${preInscricao.numero_stand}`,
        status: 'ativo',
        prioridade: 'normal',
        origem: 'pre_inscricao_expositor',
        origem_id: preInscricao.id, // Identificador da pré-inscrição
        observacoes: `Expositor aprovado para o stand ${preInscricao.numero_stand}. Criado em: ${new Date().toLocaleString('pt-BR')}.`,
        tags: ['expositor', 'fespin-2025', `stand-${preInscricao.numero_stand}`, `pre-inscricao-${preInscricao.id}`]
      };

      if (preInscricao.tipo_pessoa === 'fisica') {
        // Pessoa Física - Mapeamento completo
        dadosEntidade.nome = `${preInscricao.nome_pf} ${preInscricao.sobrenome_pf}`;
        dadosEntidade.dados_pessoa_fisica = {
          cpf: preInscricao.cpf,
          // RG não está disponível na interface PreInscricaoExpositor
          // data_nascimento não está disponível na interface
          // profissao não está disponível na interface
        };
        
        // Contatos completos para pessoa física
        dadosEntidade.contatos = {
          email_principal: preInscricao.email_pf,
          email_secundario: preInscricao.email_responsavel,
          email_comercial: preInscricao.email_responsavel_stand,
          telefone_celular: preInscricao.telefone_pf,
          telefone_fixo: preInscricao.contato_responsavel,
          whatsapp: preInscricao.is_whatsapp === 'sim' ? (preInscricao.contato_responsavel || preInscricao.telefone_pf) : undefined
        };
        
        // Endereço residencial completo
        dadosEntidade.enderecos = {
          residencial: {
            cep: preInscricao.cep_pf,
            rua: preInscricao.logradouro_pf,
            numero: preInscricao.numero_pf,
            complemento: preInscricao.complemento_pf,
            bairro: preInscricao.bairro_pf,
            cidade: preInscricao.cidade_pf,
            estado: preInscricao.estado_pf,
            pais: 'Brasil'
          }
        };
      } else {
        // Pessoa Jurídica - Mapeamento completo
        dadosEntidade.nome = preInscricao.razao_social || preInscricao.nome_social || 'Empresa';
        dadosEntidade.dados_pessoa_juridica = {
          razao_social: preInscricao.razao_social,
          nome_fantasia: preInscricao.nome_social,
          cnpj: preInscricao.cnpj,
          // Removed inscricao_estadual since it's not in PreInscricaoExpositor interface
          // Removed inscricao_municipal since it's not in PreInscricaoExpositor interface
          ramo_atividade: getStandInfo(preInscricao.numero_stand).segmento
        };
        
        // Contatos completos para pessoa jurídica
        dadosEntidade.contatos = {
          email_principal: preInscricao.email_empresa,
          email_secundario: preInscricao.email_responsavel_stand,
          email_comercial: preInscricao.email_responsavel,
          telefone_fixo: preInscricao.telefone_empresa,
          telefone_celular: preInscricao.contato_responsavel,
          whatsapp: preInscricao.is_whatsapp === 'sim' ? preInscricao.contato_responsavel : undefined,
          // Removed site_oficial since site_empresa doesn't exist in PreInscricaoExpositor interface
        };
        
        // Endereço comercial completo
        dadosEntidade.enderecos = {
          comercial: {
            cep: preInscricao.cep,
            rua: preInscricao.logradouro,
            numero: preInscricao.numero,
            complemento: preInscricao.complemento,
            bairro: preInscricao.bairro,
            cidade: preInscricao.cidade,
            estado: preInscricao.estado,
            pais: 'Brasil'
          }
        };
        
        // Adicionar informações do responsável se disponível
        if (preInscricao.nome_responsavel) {
          dadosEntidade.notas_internas = `Responsável: ${preInscricao.nome_responsavel} ${preInscricao.sobrenome_responsavel}\nEmail: ${preInscricao.email_responsavel || 'Não informado'}\nTelefone: ${preInscricao.contato_responsavel || 'Não informado'}`;
        }
      }

      // Inserir na tabela entidades
      const { error } = await supabase
        .from('entidades')
        .insert([dadosEntidade]);

      if (error) {
        console.error('Erro ao adicionar à entidades:', error);
        showToast.error('Erro ao adicionar à entidades: ' + error.message);
        return false;
      }

      showToast.success('Dados adicionados à entidades com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar à entidades:', error);
      showToast.error('Erro ao adicionar à entidades');
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
          disponivel: false,
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `APROVADO - Reservado por ${nomeExpositor} - FESPIN 2025`
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
      
      // Se foi aprovado, perguntar se deseja adicionar à entidades
      if (newStatus === 'aprovado') {
        const preInscricaoCompleta = await supabase
          .from('pre_inscricao_expositores')
          .select('*')
          .eq('id', id)
          .single();
        
        if (preInscricaoCompleta.data) {
          setPreInscricaoParaEntidade(preInscricaoCompleta.data);
          setShowEntidadeModal(true);
        }
      }
      
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
    
    // Verificar se já existe contrato para esta pré-inscrição
    try {
      console.log('openModal: Verificando contrato existente para ID:', inscricao.id);
      const existeContrato = await verificarContratoExistente(inscricao.id);
      console.log('openModal: Resultado da verificação de contrato existente:', existeContrato);
      setContratoExistente(!!existeContrato);
      console.log('openModal: Estado contratoExistente definido como:', !!existeContrato);
    } catch (error) {
      console.error('Erro ao verificar contrato existente:', error);
      setContratoExistente(false);
    }
  }, []);

  // Abrir modal de seleção de contrato - Unificado com ZapSign
  const handleGerarContrato = async () => {
    console.log('handleGerarContrato chamado');
    if (!selectedPreInscricao) {
      console.log('Nenhuma pré-inscrição selecionada');
      return;
    }
    
    console.log('Status da pré-inscrição:', selectedPreInscricao.status);
    
    // Verificar se a pré-inscrição está aprovada
    if (selectedPreInscricao.status !== 'aprovado') {
      console.log('Pré-inscrição não aprovada, mostrando toast de erro');
      showToast.error('Apenas pré-inscrições aprovadas podem gerar contratos');
      return;
    }

    // Verificar se já existe contrato
    try {
      console.log('Verificando contrato existente para ID:', selectedPreInscricao.id);
      const contratoExistente = await verificarContratoExistente(selectedPreInscricao.id);
      console.log('Resultado da verificação de contrato existente:', contratoExistente);
      
      if (contratoExistente) {
        console.log('Contrato já existe, mostrando toast de erro');
        showToast.error('Já existe um contrato para esta pré-inscrição');
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar contrato existente:', error);
      showToast.error('Erro ao verificar contrato existente');
      return;
    }

    // Abrir o modal de seleção de modelo ZapSign
    console.log('Definindo pré-inscrição para contrato:', selectedPreInscricao);
    setPreInscricaoParaContrato(selectedPreInscricao);
    console.log('Abrindo modal ZapSign...');
    setShowZapSignModal(true);
    console.log('Estado showZapSignModal definido como true');
    
    // Verificar se o estado foi atualizado
    setTimeout(() => {
      console.log('Estado showZapSignModal após timeout:', showZapSignModal);
    }, 100);
  };

  // Função para abrir modal de seleção de modelo ZapSign
  const handleGerarContratoZapSign = async (inscricao: PreInscricaoExpositor) => {
    console.log('handleGerarContratoZapSign chamado para:', inscricao.id);
    console.log('Status da pré-inscrição:', inscricao.status);
    console.log('Estado atual showZapSignModal:', showZapSignModal);
    
    // Verificar se a pré-inscrição está aprovada
    if (inscricao.status !== 'aprovado') {
      console.log('Pré-inscrição não aprovada, mostrando toast de erro');
      showToast.error('Apenas pré-inscrições aprovadas podem gerar contratos');
      return;
    }

    // Verificar se já existe contrato
    try {
      console.log('Verificando contrato existente para ID:', inscricao.id);
      const contratoExistente = await verificarContratoExistente(inscricao.id);
      console.log('Resultado da verificação de contrato existente:', contratoExistente);
      
      if (contratoExistente) {
        console.log('Contrato já existe, mostrando toast de erro');
        showToast.error('Já existe um contrato para esta pré-inscrição');
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar contrato existente:', error);
      showToast.error('Erro ao verificar contrato existente');
      return;
    }

    console.log('Definindo pré-inscrição para contrato:', inscricao);
    setPreInscricaoParaContrato(inscricao);
    console.log('Abrindo modal ZapSign...');
    setShowZapSignModal(true);
    console.log('Estado showZapSignModal definido como true');
    
    // Verificar se o estado foi atualizado
    setTimeout(() => {
      console.log('Estado showZapSignModal após timeout:', showZapSignModal);
    }, 100);
  };

  // Função para processar a seleção do template e criar o contrato
  const handleSelectTemplate = async (templateId: string, templateName: string, mappedData?: Record<string, string>) => {
    console.log('AdminPreInscricaoExpositores: handleSelectTemplate chamado com templateId:', templateId, 'templateName:', templateName, 'e mappedData:', mappedData);
    
    if (!preInscricaoParaContrato) {
      console.error('AdminPreInscricaoExpositores: Erro - Pré-inscrição não selecionada');
      showToast.error('Erro: Pré-inscrição não selecionada');
      return;
    }

    console.log('AdminPreInscricaoExpositores: Pré-inscrição selecionada:', preInscricaoParaContrato.id);
    
    try {
      console.log('AdminPreInscricaoExpositores: Chamando criarContratoZapSign com templateId:', templateId);
      const contrato = await criarContratoZapSign(
        preInscricaoParaContrato.id,
        templateId,
        templateName,
        mappedData
      );

      console.log('AdminPreInscricaoExpositores: Contrato criado com sucesso:', contrato);
      showToast.success(`Contrato criado com sucesso! Número: ${contrato.numero_contrato}`);
      
      // Fechar modal e atualizar lista
      setShowZapSignModal(false);
      setPreInscricaoParaContrato(null);
      
      // Atualizar a lista de pré-inscrições para refletir que agora tem contrato
      loadPreInscricoes();
      
      // Se o modal de detalhes estiver aberto, atualizar o status do contrato
      if (selectedPreInscricao?.id === preInscricaoParaContrato.id) {
        setContratoExistente(true);
      }
    } catch (error) {
      console.error('AdminPreInscricaoExpositores: Erro ao criar contrato:', error);
      showToast.error('Erro ao criar contrato: ' + (error as Error).message);
    }
  };

  // Função para fechar modal ZapSign
  const handleCloseZapSignModal = () => {
    setShowZapSignModal(false);
    setPreInscricaoParaContrato(null);
  };

  // Função de callback após criação do contrato foi removida
  // Agora usamos handleSelectTemplate para processar a criação do contrato

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
      const mapeamento = {
        'a_vista_desconto': 'À vista com 5% desconto',
        'sinal_3_parcelas': '20% sinal + 3 parcelas',
        'sinal_saldo': '20% sinal + saldo restante'
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
    categoriaPatrocinio: (valor: string) => {
      const mapeamento = {
        'bronze': 'Bronze (R$ 5.000)',
        'prata': 'Prata (R$ 10.000)',
        'ouro': 'Ouro (R$ 12.000)',
        'telao_led': 'Telão de LED (R$ 500)'
      };
      return mapeamento[valor as keyof typeof mapeamento] || valor;
    },
    desejaPatrocinio: (valor: string) => {
      return valor === 'sim' ? 'Sim' : valor === 'nao' ? 'Não' : valor;
    },
    isWhatsApp: (valor: string) => {
      return valor === 'sim' ? 'Sim' : valor === 'nao' ? 'Não' : valor;
    }
  };

  const getStandInfo = useCallback((numeroStand: string) => {
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
        'Deseja Patrocínio': getTextoLegivel.desejaPatrocinio(inscricao.deseja_patrocinio || ''),
        'Tipo Patrocínio': inscricao.categoria_patrocinio ? getTextoLegivel.categoriaPatrocinio(inscricao.categoria_patrocinio) : '',
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
                    // Converter códigos para texto legível nos dropdowns
                    if (fieldName === 'condicao_pagamento') {
                      displayText = getTextoLegivel.condicaoPagamento(option);
                    } else if (fieldName === 'forma_pagamento') {
                      displayText = getTextoLegivel.formaPagamento(option);
                    } else if (fieldName === 'categoria_patrocinio') {
                      displayText = getTextoLegivel.categoriaPatrocinio(option);
                    } else if (fieldName === 'deseja_patrocinio') {
                      displayText = getTextoLegivel.desejaPatrocinio(option);
                    } else if (fieldName === 'is_whatsapp') {
                      displayText = getTextoLegivel.isWhatsApp(option);
                    }
                    return (
                      <SelectItem key={option} value={option}>{displayText}</SelectItem>
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
            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border min-h-[32px] flex items-center">
              {value || 'Não informado'}
            </p>
          )}
        </div>
      );
    }, [currentData, isEditing, localInputs, updateFieldWithDebounce, setEditData]);

    return (
      <Dialog open={showDetailModal} onOpenChange={(open) => !open && setShowDetailModal(false)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto !fixed !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%]">
          {/* Botão de Fechar Personalizado */}
          <button
            onClick={() => setShowDetailModal(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-[#0a2856] hover:bg-[#0a2856]/90 rounded-full flex items-center justify-center transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <DialogHeader className="pb-3 border-b">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedPreInscricao.tipo_pessoa === 'juridica' ? 
                  <Building2 className="w-5 h-5 text-[#0a2856]" /> : 
                  <User className="w-5 h-5 text-[#0a2856]" />
                }
                <div>
                  <span className="text-lg font-semibold text-[#0a2856] leading-none">
                    {getNome(selectedPreInscricao)}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedPreInscricao.status)}
                    <span className="text-xs text-gray-500">
                      Stand #{selectedPreInscricao.numero_stand} • {format(new Date(selectedPreInscricao.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Detalhes da pré-inscrição do expositor
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Ações Rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b">
              <div className="flex flex-wrap items-center gap-2">
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
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    {/* Botão Gerar Contrato Unificado com ZapSign - só aparece se aprovado */}
                    {selectedPreInscricao.status === 'aprovado' && (
                        <Button 
                          onClick={handleGerarContrato}
                          variant="outline"
                          size="sm"
                          disabled={contratoExistente}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          {contratoExistente ? 'Contrato Gerado' : 'Gerar Contrato'}
                        </Button>
                      )}
                    <Button onClick={() => saveEdits(localInputs)} size="sm" className="bg-[#00d856] hover:bg-[#00d856]/90">
                       <Save className="w-4 h-4 mr-1" />
                       Salvar
                     </Button>
                   </>
                ) : (
                  <>
                    {/* Botão Gerar Contrato Unificado com ZapSign - só aparece se aprovado */}
                    {selectedPreInscricao.status === 'aprovado' && (
                      <Button 
                        onClick={handleGerarContrato}
                        variant="outline"
                        size="sm"
                        disabled={contratoExistente}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        {contratoExistente ? 'Contrato Gerado' : 'Gerar Contrato'}
                      </Button>
                    )}
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      onClick={() => setDeleteConfirm(selectedPreInscricao.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Dados Principais */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-center">
                 <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                   {selectedPreInscricao.tipo_pessoa === 'juridica' ? 
                     <Building2 className="w-5 h-5" /> : 
                     <User className="w-5 h-5" />
                   }
                   {selectedPreInscricao.tipo_pessoa === 'juridica' ? 'Dados da Empresa' : 'Dados Pessoais'}
                 </h3>
               </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedPreInscricao.tipo_pessoa === 'juridica' ? (
                    <>
                      <div className="md:col-span-2">{renderField('Razão Social', currentData.razao_social, 'razao_social')}</div>
                      <div>{renderField('CNPJ', currentData.cnpj, 'cnpj')}</div>
                      <div className="md:col-span-2">{renderField('Nome Fantasia', currentData.nome_social, 'nome_social')}</div>
                      <div>{renderField('Telefone', currentData.telefone_empresa, 'telefone_empresa')}</div>
                      <div className="md:col-span-3">{renderField('E-mail', currentData.email_empresa, 'email_empresa')}</div>
                      
                      <div>{renderField('CEP', currentData.cep, 'cep')}</div>
                      <div className="md:col-span-2">{renderField('Logradouro', currentData.logradouro, 'logradouro')}</div>
                      <div>{renderField('Número', currentData.numero, 'numero')}</div>
                      <div className="md:col-span-2">{renderField('Complemento', currentData.complemento, 'complemento')}</div>
                      <div>{renderField('Bairro', currentData.bairro, 'bairro')}</div>
                      <div>{renderField('Cidade', currentData.cidade, 'cidade')}</div>
                      <div>{renderField('Estado', currentData.estado, 'estado')}</div>
                    </>
                  ) : (
                    <>
                      <div>{renderField('Nome', currentData.nome_pf, 'nome_pf')}</div>
                      <div>{renderField('Sobrenome', currentData.sobrenome_pf, 'sobrenome_pf')}</div>
                      <div>{renderField('CPF', currentData.cpf, 'cpf')}</div>
                      <div>{renderField('Telefone', currentData.telefone_pf, 'telefone_pf')}</div>
                      <div className="md:col-span-2">{renderField('E-mail', currentData.email_pf, 'email_pf')}</div>
                      
                      <div>{renderField('CEP', currentData.cep_pf, 'cep_pf')}</div>
                      <div className="md:col-span-2">{renderField('Logradouro', currentData.logradouro_pf, 'logradouro_pf')}</div>
                      <div>{renderField('Número', currentData.numero_pf, 'numero_pf')}</div>
                      <div className="md:col-span-2">{renderField('Complemento', currentData.complemento_pf, 'complemento_pf')}</div>
                      <div>{renderField('Bairro', currentData.bairro_pf, 'bairro_pf')}</div>
                      <div>{renderField('Cidade', currentData.cidade_pf, 'cidade_pf')}</div>
                      <div>{renderField('Estado', currentData.estado_pf, 'estado_pf')}</div>
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
              
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Responsável Legal */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Responsável Legal</h4>
                    </div>
                    <div className="space-y-3">
                      {renderField('Nome', currentData.nome_responsavel, 'nome_responsavel')}
                      {renderField('Sobrenome', currentData.sobrenome_responsavel, 'sobrenome_responsavel')}
                      {renderField('E-mail', currentData.email_responsavel, 'email_responsavel')}
                      {renderField('Contato', currentData.contato_responsavel, 'contato_responsavel')}
                      {renderField('É WhatsApp?', getTextoLegivel.isWhatsApp(currentData.is_whatsapp || ''), 'is_whatsapp', 'select', ['sim', 'nao'])}
                    </div>
                  </div>
                  
                  {/* Responsável pelo Stand */}
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Responsável pelo Stand</h4>
                    </div>
                    <div className="space-y-3">
                      {renderField('Nome', currentData.nome_responsavel_stand, 'nome_responsavel_stand')}
                      {renderField('Sobrenome', currentData.sobrenome_responsavel_stand, 'sobrenome_responsavel_stand')}
                      {renderField('E-mail', currentData.email_responsavel_stand, 'email_responsavel_stand')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stand e Pagamento */}
            <div className="bg-white rounded-lg border">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-center">
                 <h3 className="flex items-center gap-3 text-base font-bold text-[#0a2856] uppercase">
                   <MapPin className="w-5 h-5" />
                   Stand e Pagamento
                 </h3>
               </div>
              
              <div className="p-4 space-y-4">
                {/* Seleção de Stand */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Selecionar Stand</Label>
                      <Select 
                        value={currentData.numero_stand || ''}
                        onValueChange={(value) => setEditData(prev => ({ ...prev, numero_stand: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um stand disponível" />
                        </SelectTrigger>
                        <SelectContent>
                           {/* Stand atual sempre disponível */}
                           {selectedPreInscricao.numero_stand && (
                             <SelectItem value={selectedPreInscricao.numero_stand}>
                               Stand {selectedPreInscricao.numero_stand} (Atual) - {getStandInfo(selectedPreInscricao.numero_stand).categoria}
                             </SelectItem>
                           )}
                           {/* Stands disponíveis */}
                           {standsDisponiveis.filter(stand => stand.numero_stand && stand.numero_stand.trim() !== '').map((stand) => (
                             <SelectItem key={stand.numero_stand} value={stand.numero_stand}>
                               Stand {stand.numero_stand} - {stand.categoria} ({stand.tamanho}) - {stand.preco}
                             </SelectItem>
                           ))}
                         </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Preview do stand selecionado */}
                    {currentData.numero_stand && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold shadow-sm"
                              style={{ backgroundColor: getStandInfo(currentData.numero_stand).cor }}
                            >
                              {currentData.numero_stand}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">{getStandInfo(currentData.numero_stand).categoria}</h4>
                              <p className="text-xs text-gray-600">{getStandInfo(currentData.numero_stand).segmento}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-white px-2 py-1 rounded border">
                                  {getStandInfo(currentData.numero_stand).tamanho}
                                </span>
                                <span className="text-xs font-medium text-[#0a2856]">
                                  {getStandInfo(currentData.numero_stand).preco}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Stand</div>
                            <div className="text-lg font-bold text-[#0a2856]">#{currentData.numero_stand}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Informações do Stand com Visual */
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold shadow-sm"
                          style={{ backgroundColor: getStandInfo(selectedPreInscricao.numero_stand).cor }}
                        >
                          {selectedPreInscricao.numero_stand}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{getStandInfo(selectedPreInscricao.numero_stand).categoria}</h4>
                          <p className="text-xs text-gray-600">{getStandInfo(selectedPreInscricao.numero_stand).segmento}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-white px-2 py-1 rounded border">
                              {getStandInfo(selectedPreInscricao.numero_stand).tamanho}
                            </span>
                            <span className="text-xs font-medium text-[#0a2856]">
                              {getStandInfo(selectedPreInscricao.numero_stand).preco}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Stand</div>
                        <div className="text-lg font-bold text-[#0a2856]">#{selectedPreInscricao.numero_stand}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderField('Deseja Patrocínio?', getTextoLegivel.desejaPatrocinio(currentData.deseja_patrocinio || ''), 'deseja_patrocinio', 'select', ['sim', 'nao'])}
                  {currentData.deseja_patrocinio === 'sim' && renderField('Categoria Patrocínio', getTextoLegivel.categoriaPatrocinio(currentData.categoria_patrocinio || ''), 'categoria_patrocinio', 'select', ['bronze', 'prata', 'ouro', 'telao_led'])}
                  {renderField('Condição de Pagamento', getTextoLegivel.condicaoPagamento(currentData.condicao_pagamento || ''), 'condicao_pagamento', 'select', ['a_vista_desconto', 'sinal_3_parcelas', 'sinal_saldo'])}
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
      title: 'Total',
      value: stats.total,
      icon: <Users className="w-8 h-8" />,
      color: 'blue' as const
    },
    {
      title: 'Pendentes',
      value: stats.pendentes,
      icon: <Clock className="w-8 h-8" />,
      color: 'yellow' as const
    },
    {
      title: 'Aprovadas',
      value: stats.aprovadas,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'green' as const
    },
    {
      title: 'Rejeitadas',
      value: stats.rejeitadas,
      icon: <XCircle className="w-8 h-8" />,
      color: 'gray' as const
    },
    {
      title: 'Pessoa Física',
      value: stats.fisicas,
      icon: <User className="w-8 h-8" />,
      color: 'purple' as const
    },
    {
      title: 'Pessoa Jurídica',
      value: stats.juridicas,
      icon: <Building2 className="w-8 h-8" />,
      color: 'orange' as const
    }
  ];

  const actions = [
    {
      label: 'Exportar Excel',
      onClick: exportToExcel,
      icon: <Download className="w-4 h-4" />,
      variant: 'secondary' as const
    }
  ];

  return (
    <div className="container mx-auto p-6 admin-page">
      <PageHeader
        title="Pré-Inscrições de Expositores"
        description="Gerencie as pré-inscrições recebidas"
        icon={Users}
        actions={[
          {
            label: "Atualizar",
            icon: RefreshCw,
            onClick: loadPreInscricoes,
            disabled: loading,
            variant: "outline"
          },
          {
            label: "Exportar",
            icon: Download,
            onClick: exportToExcel,
            variant: "outline"
          }
        ]}
      />
      <div className="space-y-6">
        {/* Estatísticas por Categoria de Stand */}
        {preInscricoes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-1.5">Distribuição por Categoria de Stand</h3>
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

        {/* Filtros e Controles */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">
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

        {/* Modal de Seleção de Contrato */}
        

        {/* Modal de Confirmação para Adicionar à Entidades */}
        <AlertDialog open={showEntidadeModal} onOpenChange={setShowEntidadeModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Adicionar à Entidades</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja adicionar os dados desta pré-inscrição aprovada à tabela de entidades?
                <br /><br />
                <strong>Dados que serão adicionados:</strong>
                <br />
                {preInscricaoParaEntidade && (
                  <div className="mt-2 p-3 bg-gray-50 rounded text-sm space-y-1">
                    <div><strong>Nome:</strong> {preInscricaoParaEntidade.tipo_pessoa === 'fisica' 
                      ? `${preInscricaoParaEntidade.nome_pf} ${preInscricaoParaEntidade.sobrenome_pf}`
                      : preInscricaoParaEntidade.razao_social || preInscricaoParaEntidade.nome_social
                    }</div>
                    <div><strong>Tipo:</strong> {preInscricaoParaEntidade.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</div>
                    <div><strong>Stand:</strong> {preInscricaoParaEntidade.numero_stand}</div>
                    <div><strong>Categoria:</strong> Expositores</div>
                    <div><strong>Documento:</strong> {preInscricaoParaEntidade.tipo_pessoa === 'fisica' ? preInscricaoParaEntidade.cpf : preInscricaoParaEntidade.cnpj}</div>
                    <div><strong>Email Principal:</strong> {preInscricaoParaEntidade.tipo_pessoa === 'fisica' ? preInscricaoParaEntidade.email_pf : preInscricaoParaEntidade.email_empresa}</div>
                    <div><strong>Telefone:</strong> {preInscricaoParaEntidade.tipo_pessoa === 'fisica' ? preInscricaoParaEntidade.telefone_pf : preInscricaoParaEntidade.telefone_empresa}</div>
                    <div><strong>Cidade:</strong> {preInscricaoParaEntidade.tipo_pessoa === 'fisica' ? preInscricaoParaEntidade.cidade_pf : preInscricaoParaEntidade.cidade}</div>
                    <div><strong>Observações:</strong> {preInscricaoParaEntidade.observacoes || 'Nenhuma observação'}</div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowEntidadeModal(false);
                setPreInscricaoParaEntidade(null);
              }}>Não, obrigado</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (preInscricaoParaEntidade) {
                    const sucesso = await adicionarAEntidades(preInscricaoParaEntidade);
                    if (sucesso) {
                      setShowEntidadeModal(false);
                      setPreInscricaoParaEntidade(null);
                    }
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Sim, adicionar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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

        {/* Modal de Seleção de Modelo ZapSign */}
        <ModalSelecaoModeloZapSign
          isOpen={showZapSignModal}
          onClose={handleCloseZapSignModal}
          onSelectTemplate={handleSelectTemplate}
          preInscricaoId={preInscricaoParaContrato?.id || ''}
          preInscricao={preInscricaoParaContrato!}
        />
      </div>
    </div>
  );
};

export default AdminPreInscricaoExpositores;