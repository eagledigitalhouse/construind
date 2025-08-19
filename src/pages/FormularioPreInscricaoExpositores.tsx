import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailAutocomplete } from '@/components/ui/email-autocomplete';
import { PhoneInput } from '@/components/ui/phone-input';
import { Upload, FileText, Building2, User, Phone, Mail, CreditCard, MapPin, Calendar, CheckCircle, Search, Loader2, Users, Target, Info } from 'lucide-react';
import { showToast } from '@/lib/toast';
import MapViewer from '@/components/pages/MapViewer';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/uploadImage';
import { formatarMoedaBrasileira, converterPrecoParaNumero } from '@/lib/utils';

/*
// SISTEMA DE RESERVAS TEMPORÁRIAS DE STANDS:

1. RESERVA TEMPORÁRIA (ao clicar no stand):
   - Cria registro na tabela com `is_temporary: true`
   - NÃO APARECE no painel administrativo do produtor
   - Reserva o stand por até 30 minutos

2. RESERVA DEFINITIVA (ao enviar formulário):
   - Converte o registro para `is_temporary: false`
   - AGORA APARECE no painel administrativo 
   - Aguarda aprovação do produtor

3. LIMPEZA AUTOMÁTICA:
   - Remove reservas temporárias antigas (>30min)
   - Libera stands que não foram finalizados

// RESULTADO: O produtor só vê cards quando o formulário é realmente enviado!
*/

const FormularioPreInscricaoExpositores: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Tipo de Pessoa
    tipoPessoa: '', // 'fisica' ou 'juridica'
    
    // Pessoa Física
    nomePF: '', // Nome completo em campo único
    cpf: '',
    rgPF: '',
    emailPF: '',
    telefonePF: '',
    cepPF: '',
    logradouroPF: '',
    numeroPF: '',
    complementoPF: '',
    bairroPF: '',
    cidadePF: '',
    estadoPF: '',
    
    // Pessoa Jurídica (Dados da Empresa)
    razaoSocial: '',
    nomeSocial: '',
    cnpj: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefoneEmpresa: '',
    emailEmpresa: '',

    
    // Responsável Legal
    nomeResponsavel: '',
    sobrenomeResponsavel: '',
    emailResponsavel: '',
    contatoResponsavel: '',
    isWhatsApp: 'sim',
    
    // Responsável pelo Stand
    nomeResponsavelStand: '',
    sobrenomeResponsavelStand: '',
    emailResponsavelStand: '',
    
    // Serviços
    numeroStand: '',
    condicaoPagamento: '',
    formaPagamento: '',
    
    // Patrocínio
    desejaPatrocinio: '',
    categoriaPatrocinio: '',
    
    // Informações Adicionais
    observacoes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  // Estados para sistema de stands (versão simplificada)
  const [standsDisponiveis, setStandsDisponiveis] = useState<any[]>([]);
  const [standsAgrupados, setStandsAgrupados] = useState<{[key: string]: any[]}>({});
  const [isLoadingStands, setIsLoadingStands] = useState(true);
  
  // Estados para cronômetro de expiração
  const [tempoRestante, setTempoRestante] = useState<number>(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  const [condicoesPagamento, setCondicoesPagamento] = useState<any[]>([]);

  useEffect(() => {
    const fetchCondicoes = async () => {
      const { data, error } = await supabase
        .from('payment_conditions')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching payment conditions:', error);
      } else {
        setCondicoesPagamento(data);
      }
    };
    fetchCondicoes();
  }, []);

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Limpeza de stands com timeout expirado (>10 minutos)
  const cleanupOnlyExpiredStands = async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      const { data: expiredStands, error: fetchError } = await supabase
        .from('stands_construind')
        .select('numero_stand, data_reserva, observacoes')
        .eq('status', 'reservado')
        .not('data_reserva', 'is', null)
        .like('observacoes', '%Timeout%')
        .lt('data_reserva', tenMinutesAgo.toISOString());

      if (fetchError) return;

      if (expiredStands && expiredStands.length > 0) {
        await supabase
          .from('stands_construind')
          .update({
            status: 'disponivel',
            reservado_por: null,
            data_reserva: null,
            observacoes: null,
            updated_at: new Date().toISOString()
          })
          .eq('status', 'reservado')
          .not('data_reserva', 'is', null)
          .like('observacoes', '%Timeout%')
          .lt('data_reserva', tenMinutesAgo.toISOString());
      }
    } catch (error) {
      console.log('Erro na limpeza de stands expirados:', error);
    }
  };

  // SISTEMA TEMPO REAL APRIMORADO - REAÇÃO INSTANTÂNEA
  useEffect(() => {
    carregarStands();
    
    // Canal único com nome específico para evitar conflitos
    const canalRealtime = supabase
      .channel(`formulario-stands-${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pre_inscricao_expositores'
      }, (payload) => {
        console.log('Mudança detectada na tabela pre_inscricao_expositores:', payload);
        carregarStands();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'stands_construind'
      }, (payload) => {
        console.log('Mudança detectada na tabela stands_construind:', payload);
        carregarStands();
      })
      .subscribe((status) => {
        console.log('Status do canal real-time:', status);
      });

    // Limpeza automática apenas de stands realmente expirados (>10min)
    const cleanupInterval = setInterval(() => {
      cleanupOnlyExpiredStands();
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      console.log('Desconectando canal real-time');
      canalRealtime.unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, []);

  // Cronômetro de expiração
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (cronometroAtivo && tempoRestante > 0) {
      intervalId = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            setCronometroAtivo(false);
            // Liberar stand automaticamente quando expirar
            if (formData.numeroStand) {
              handleStandSelection(formData.numeroStand);
              showToast.error('Tempo esgotado! Stand liberado automaticamente.');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [cronometroAtivo, tempoRestante, formData.numeroStand]);



  const carregarStands = async () => {
    console.log(`Carregando stands... ${new Date().toLocaleTimeString('pt-BR')}`);
    setIsLoadingStands(true);
    
    try {
      // Buscar stands com todas as informações de status
      const { data: standsData, error } = await supabase
        .from('stands_construind')
        .select('numero_stand, categoria, preco, status, reservado_por, data_reserva, observacoes, cor, largura, altura');

      if (error) {
        console.error('Erro ao buscar stands:', error);
        setIsLoadingStands(false);
        return;
      }

      if (!standsData) {
        console.log('Nenhum dado de stand encontrado');
        setIsLoadingStands(false);
        return;
      }

      console.log('Dados dos stands carregados:', standsData.length, 'stands encontrados');
      console.log('Primeiro stand:', standsData[0]);

      // LÓGICA APRIMORADA: Baseada no status com verificação de pré-inscrições
      const standsComStatus = standsData.map(stand => {
        const currentStatus = stand.status || 'disponivel';
        

        
        switch (currentStatus) {
          case 'ocupado':
            return {
              ...stand,
              cor: '#6b7280', // Cinza
              podeSelecionar: false,
              status: 'ocupado',
              descricao: `Stand ${stand.numero_stand} - Ocupado`
            };
            
          case 'reservado':
            // Verificar se reserva com timeout ainda é válida
            const isTimeoutValido = stand.data_reserva && stand.observacoes?.includes('Timeout') &&
              new Date(stand.data_reserva) > new Date(Date.now() - 10 * 60 * 1000);
            
            if (stand.observacoes?.includes('Timeout') && !isTimeoutValido) {
              // Timeout expirado - tratar como disponível
              return {
                ...stand,
                cor: '#22c55e', // Verde
                podeSelecionar: true,
                status: 'disponivel',
                descricao: `Stand ${stand.numero_stand} - Disponível`
              };
            }
            
            return {
              ...stand,
              cor: '#eab308', // Amarelo
              podeSelecionar: false,
              status: 'reservado',
              descricao: `Stand ${stand.numero_stand} - Reservado`
            };
            
          case 'disponivel':
          default:
            return {
              ...stand,
              cor: '#22c55e', // Verde
              podeSelecionar: true,
              status: 'disponivel',
              descricao: `Stand ${stand.numero_stand} - Disponível`
            };
        }
      });

      // Ordenar PRIMEIRO por categoria, depois numericamente por stand
      standsComStatus.sort((a, b) => {
        // Primeiro ordenar por categoria
        if (a.categoria !== b.categoria) {
          return a.categoria.localeCompare(b.categoria);
        }
        // Depois ordenar numericamente por número do stand
        const numA = parseInt(a.numero_stand.toString());
        const numB = parseInt(b.numero_stand.toString());
        return numA - numB;
      });

      // Agrupar por categoria (já ordenados)
      const agrupados = standsComStatus.reduce((acc, stand) => {
        if (!acc[stand.categoria]) acc[stand.categoria] = [];
        acc[stand.categoria].push(stand);
        return acc;
      }, {} as {[key: string]: any[]});

      setStandsDisponiveis(standsComStatus);
      setStandsAgrupados(agrupados);
      
      console.log(`Stands atualizados em ${new Date().toLocaleTimeString('pt-BR')}`);
      console.log('Stands processados:', standsComStatus.length);
      console.log('Stands agrupados:', Object.keys(agrupados));
      console.log('Agrupados detalhes:', agrupados);
      
    } catch (error) {
      console.error('Erro ao carregar stands:', error);
    } finally {
      setIsLoadingStands(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para obter dados completos do stand selecionado
  const getDadosStandSelecionado = () => {
    if (!formData.numeroStand) return null;
    
    const stand = standsDisponiveis.find(s => s.numero_stand === formData.numeroStand);
    if (!stand) return null;
    
    // Obter tamanho do stand (largura x altura)
    let metragem = 'Não especificado';
    if (stand.largura && stand.altura) {
      metragem = `${stand.largura}m x ${stand.altura}m`;
    } else if (stand.largura) {
      metragem = `${stand.largura}m`;
    }
    
    return {
      numero: stand.numero_stand,
      categoria: getTamanhoCategoria(stand.categoria),
      valor: stand.preco || 0,
      metragem: metragem
    };
  };

  // LÓGICA ORIGINAL: Apenas permitir deselecionar o próprio stand selecionado
  const handleStandSelection = async (standNumber: string) => {
    const stand = standsDisponiveis.find(s => s.numero_stand === standNumber);
    
    // SE É O MEU STAND SELECIONADO: Permitir deselecionar
    if (formData.numeroStand === standNumber) {
      try {
        // Deselecionar meu stand
        const { error } = await supabase
          .from('stands_construind')
          .update({
            status: 'disponivel',
            reservado_por: null,
            data_reserva: null,
            observacoes: null,
            updated_at: new Date().toISOString()
          })
          .eq('numero_stand', standNumber);

        if (error) throw error;

        // Limpar seleção local e parar cronômetro
        handleInputChange('numeroStand', '');
        setCronometroAtivo(false);
        setTempoRestante(0);
        showToast.success(`Stand ${standNumber} foi liberado!`);
        return;
      } catch (error) {
        console.error('Erro ao deselecionar stand:', error);
        showToast.error('Erro ao liberar stand');
        return;
      }
    }
    
    // LÓGICA ORIGINAL: Verificar disponibilidade
    if (!stand || !stand.podeSelecionar) {
      showToast.error(`Stand ${standNumber} não está disponível`);
      return;
    }

    try {
      // 1. Liberar stand anterior (se houver)
      if (formData.numeroStand) {
        await supabase
          .from('stands_construind')
          .update({
            status: 'disponivel',
            reservado_por: null,
            data_reserva: null,
            observacoes: null,
            updated_at: new Date().toISOString()
          })
          .eq('numero_stand', formData.numeroStand);
      }

      // 2. Reservar novo stand
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 10);

      const { error } = await supabase
        .from('stands_construind')
        .update({
          status: 'reservado',
          reservado_por: 'Usuário do Formulário',
          data_reserva: new Date().toISOString(),
          observacoes: `Reservado até ${expirationTime.toLocaleString('pt-BR')} - Timeout 10min`,
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', standNumber);

      if (error) throw error;

      // 3. Atualizar seleção local e iniciar cronômetro
      handleInputChange('numeroStand', standNumber);
      setTempoRestante(600); // 10 minutos em segundos
      setCronometroAtivo(true);
      showToast.success(`Stand ${standNumber} pré-reservado por 10 minutos!`);

    } catch (error) {
      console.error('Erro ao selecionar stand:', error);
      showToast.error('Erro ao selecionar stand');
    }
  };

  // Verificar se stand pode ser selecionado
  const isStandDisponivel = (standNumber: string): boolean => {
    const stand = standsDisponiveis.find(s => s.numero_stand === standNumber);
    return stand ? stand.podeSelecionar === true : false;
  };

  // Obter cor da categoria
  const getCorCategoria = (categoria: string): string => {
    const cores: {[key: string]: string} = {
      '2x2': '#0097b2',
      '3x3': '#004aad',
      '5x5': '#55a04d',
      '8x8': '#ffb600',
      '10x10': '#ce1c21',
      '9x10': '#ff5500',
      'Patrocinadores': '#59B275'
    };
    return cores[categoria] || '#CCCCCC';
  };

  const getTamanhoCategoria = (categoria: string): string => {
    const tamanhos: {[key: string]: string} = {
      '2x2': '2X2M (4m²)',
      '3x3': '3X3M (9m²)',
      '5x5': '5X5M (25m²)',
      '8x8': '8X8M (64m²)',
      '10x10': '10X10M (100m²)',
      '9x10': '9X10M (90m²)'
    };
    return tamanhos[categoria] || categoria.toUpperCase();
  };





  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  // Busca dados do CNPJ na Receita Federal
  const buscarDadosCNPJ = async (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    if (cleanCNPJ.length !== 14) {
      showToast.error('CNPJ deve ter 14 dígitos');
      return;
    }

    setIsSearchingCNPJ(true);
    
    try {
      // Testando múltiplas APIs para garantir funcionamento
      let data = null;
      let apiUsed = '';
      
      // Tentar primeira API - BrasilAPI
      try {
        const response1 = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
        if (response1.ok) {
          data = await response1.json();
          apiUsed = 'BrasilAPI';
        }
             } catch (e) {
         if (process.env.NODE_ENV === 'development') {
           console.log('BrasilAPI falhou:', e);
         }
       }
       
       // Se falhar, tentar API alternativa
       if (!data) {
         try {
           const response2 = await fetch(`https://receitaws.com.br/v1/cnpj/${cleanCNPJ}`);
           if (response2.ok) {
             const result = await response2.json();
             if (result.status !== 'ERROR') {
               data = result;
               apiUsed = 'ReceitaWS';
             }
           }
         } catch (e) {
           if (process.env.NODE_ENV === 'development') {
             console.log('ReceitaWS falhou:', e);
           }
         }
      }
      
      if (!data) {
        throw new Error('Não foi possível buscar dados do CNPJ. Tente novamente.');
      }
      
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`Resposta da ${apiUsed}:`, data);
      }
      
      // Verificar se há erros na resposta
      if (data.error || data.message || data.status === 'ERROR') {
        throw new Error(data.message || 'CNPJ não encontrado');
      }
      
      // Mapeamento de campos baseado na API utilizada
      let razaoSocial, nomeSocial, telefone, email, cep, logradouro, bairro, cidade, estado;
      
      if (apiUsed === 'ReceitaWS') {
        // Campos da ReceitaWS
        razaoSocial = data.nome || '';
        nomeSocial = data.fantasia || '';
        telefone = data.telefone || '';
        email = data.email || '';
        cep = data.cep || '';
        logradouro = data.logradouro || '';
        bairro = data.bairro || '';
        cidade = data.municipio || '';
        estado = data.uf || '';
      } else {
        // Campos da BrasilAPI ou outras
        razaoSocial = data.company_name || data.legal_name || data.nome_empresarial || data.razao_social || '';
        nomeSocial = data.trade_name || data.nome_fantasia || data.fantasia || '';
        telefone = data.ddd && data.phone ? `(${data.ddd}) ${data.phone}` : data.telefone || '';
        email = data.email || '';
        cep = data.zip || data.zip_code || data.cep || '';
        logradouro = data.street || data.logradouro || '';
        bairro = data.district || data.bairro || '';
        cidade = data.city || data.municipio || data.cidade || '';
        estado = data.state || data.uf || '';
      }
      
      // Preenchendo os campos automaticamente
      setFormData(prev => ({
        ...prev,
        razaoSocial,
        nomeSocial,
        telefoneEmpresa: telefone,
        emailEmpresa: email,
        cep,
        logradouro,
        bairro,
        cidade,
        estado
      }));
      
      showToast.success(`Dados da empresa "${razaoSocial}" preenchidos automaticamente via ${apiUsed}!`);
      
    } catch (error: any) {
      console.error('Erro ao buscar CNPJ:', error);
      showToast.error(`${error.message || 'Erro ao buscar dados do CNPJ. Verifique o número digitado.'}`);
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  // Buscar CNPJ quando o campo perde o foco
  const handleCNPJBlur = () => {
    if (formData.cnpj && formData.cnpj.replace(/\D/g, '').length === 14) {
      buscarDadosCNPJ(formData.cnpj);
    }
  };

  // Busca dados do CEP na ViaCEP
  const buscarDadosCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      showToast.error('CEP deve ter 8 dígitos');
      return;
    }

    setIsSearchingCEP(true);
    
    try {
      // Usando a API pública ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado ou inválido');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      // Preenchendo os campos automaticamente
      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      }));
      
      showToast.success(`CEP encontrado! Endereço preenchido automaticamente.`);
      
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      showToast.error(`${error.message || 'Erro ao buscar CEP. Verifique o número digitado.'}`);
    } finally {
      setIsSearchingCEP(false);
    }
  };

  // Buscar CEP quando o campo perde o foco
  const handleCEPBlur = () => {
    if (formData.cep && formData.cep.replace(/\D/g, '').length === 8) {
      buscarDadosCEP(formData.cep);
    }
  };

  // Busca dados do CEP para Pessoa Física
  const buscarDadosCEPPF = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      showToast.error('CEP deve ter 8 dígitos');
      return;
    }

    setIsSearchingCEP(true);
    
    try {
      // Usando a API pública ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado ou inválido');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      // Preenchendo os campos automaticamente para PF
      setFormData(prev => ({
        ...prev,
        logradouroPF: data.logradouro || '',
        bairroPF: data.bairro || '',
        cidadePF: data.localidade || '',
        estadoPF: data.uf || ''
      }));
      
      showToast.success(`CEP encontrado! Endereço preenchido automaticamente.`);
      
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      showToast.error(`${error.message || 'Erro ao buscar CEP. Verifique o número digitado.'}`);
    } finally {
      setIsSearchingCEP(false);
    }
  };

  // Buscar CEP para PF quando o campo perde o foco
  const handleCEPBlurPF = () => {
    if (formData.cepPF && formData.cepPF.replace(/\D/g, '').length === 8) {
      buscarDadosCEPPF(formData.cepPF);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.tipoPessoa) {
        throw new Error('Por favor, selecione o tipo de pessoa');
      }

      if (!formData.numeroStand) {
        throw new Error('Por favor, selecione um stand');
      }

      if (!formData.condicaoPagamento) {
        throw new Error('Por favor, selecione uma condição de pagamento');
      }

      if (!formData.formaPagamento) {
        throw new Error('Por favor, selecione uma forma de pagamento');
      }

      // Verificar se o stand já está sendo usado por uma inscrição aprovada
      const { data: existingStand, error: standError } = await supabase
        .from('pre_inscricao_expositores')
        .select('id')
        .eq('numero_stand', formData.numeroStand)
        .eq('status', 'aprovado')
        .limit(1);

      if (standError) {
        console.error('Erro ao verificar disponibilidade do stand:', standError);
      } else if (existingStand && existingStand.length > 0) {
        throw new Error(`O stand ${formData.numeroStand} já está ocupado. Por favor, escolha outro stand.`);
      }

      // Validações específicas por tipo de pessoa
      if (formData.tipoPessoa === 'fisica') {
        if (!formData.nomePF || formData.nomePF.trim().length < 3) {
          throw new Error('Por favor, preencha o nome completo');
        }
        if (!formData.cpf) {
          throw new Error('Por favor, preencha o CPF');
        }
        if (!formData.emailPF) {
          throw new Error('Por favor, preencha o e-mail');
        }
        if (!formData.telefonePF) {
          throw new Error('Por favor, preencha o telefone');
        }
      } else {
        if (!formData.razaoSocial) {
          throw new Error('Por favor, preencha a razão social');
        }
        if (!formData.cnpj) {
          throw new Error('Por favor, preencha o CNPJ');
        }
        if (!formData.emailEmpresa) {
          throw new Error('Por favor, preencha o e-mail da empresa');
        }
        if (!formData.telefoneEmpresa) {
          throw new Error('Por favor, preencha o telefone da empresa');
        }

      }

      // Validar responsáveis
      if (!formData.nomeResponsavel || !formData.sobrenomeResponsavel) {
        throw new Error('Por favor, preencha o nome do responsável legal');
      }

      if (!formData.contatoResponsavel) {
        throw new Error('Por favor, preencha o contato do responsável');
      }

      if (!formData.isWhatsApp) {
        throw new Error('Por favor, informe se o contato é WhatsApp');
      }

      if (!formData.nomeResponsavelStand || !formData.sobrenomeResponsavelStand) {
        throw new Error('Por favor, preencha o nome do responsável pelo stand');
      }

      if (!formData.emailResponsavelStand) {
        throw new Error('Por favor, preencha o e-mail do responsável pelo stand');
      }



      // Obter IP do usuário (opcional)
      let userIP = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIP = ipData.ip;
      } catch (ipError) {
        console.log('Não foi possível obter IP do usuário:', ipError);
      }

      // Preparar dados para inserção
      const dataToInsert = {
        // Tipo de Pessoa
        tipo_pessoa: formData.tipoPessoa,
        
        // Pessoa Física
        nome_pf: formData.nomePF || null,
        sobrenome_pf: null, // Campo único de nome completo usado
        cpf: formData.cpf || null,
        email_pf: formData.emailPF || null,
        telefone_pf: formData.telefonePF || null,
        cep_pf: formData.cepPF || null,
        logradouro_pf: formData.logradouroPF || null,
        numero_pf: formData.numeroPF || null,
        complemento_pf: formData.complementoPF || null,
        bairro_pf: formData.bairroPF || null,
        cidade_pf: formData.cidadePF || null,
        estado_pf: formData.estadoPF || null,
        
        // Pessoa Jurídica
        razao_social: formData.razaoSocial || null,
        nome_social: formData.nomeSocial || null,
        cnpj: formData.cnpj || null,
        cep: formData.cep || null,
        logradouro: formData.logradouro || null,
        numero: formData.numero || null,
        complemento: formData.complemento || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        telefone_empresa: formData.telefoneEmpresa || null,
        email_empresa: formData.emailEmpresa || null,

        
        // Responsável Legal
        nome_responsavel: formData.nomeResponsavel,
        sobrenome_responsavel: formData.sobrenomeResponsavel,
        email_responsavel: formData.emailResponsavel || null,
        contato_responsavel: formData.contatoResponsavel,
        is_whatsapp: formData.isWhatsApp === 'sim',
        
        // Responsável pelo Stand
        nome_responsavel_stand: formData.nomeResponsavelStand,
        sobrenome_responsavel_stand: formData.sobrenomeResponsavelStand,
        email_responsavel_stand: formData.emailResponsavelStand,
        
        // Serviços
        numero_stand: formData.numeroStand,
        condicao_pagamento: formData.condicaoPagamento,
        forma_pagamento: formData.formaPagamento,
        
        // Informações Adicionais
        observacoes: formData.observacoes || null,
        
        // Dados de controle
        ip_address: userIP,
      };

      // CRIAR pré-inscrição normal (SEM registros temporários)
      const { data, error } = await supabase
        .from('pre_inscricao_expositores')
        .insert({
          ...dataToInsert,
          status: 'pendente',
          is_temporary: false // SEMPRE definitivo - APARECE NO PAINEL
        })
        .select();

      if (error) {
        throw error;
      }

      // ATUALIZAR stand para aguardar aprovação (mantém status reservado)
      const nomeExpositor = formData.tipoPessoa === 'fisica' 
        ? formData.nomePF 
        : formData.razaoSocial || `${formData.nomeResponsavel} ${formData.sobrenomeResponsavel}`;

      await supabase
        .from('stands_construind')
        .update({
          status: 'reservado', // Continua reservado até aprovação
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `Inscrição enviada - Aguardando aprovação do organizador`,
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', formData.numeroStand);

      // Sucesso - pré-inscrição enviada
      if (formData.numeroStand) {
        showToast.success(`Pré-inscrição enviada com sucesso! Stand ${formData.numeroStand} pré-reservado.`);
      } else {
        showToast.success('Pré-inscrição enviada com sucesso! Entraremos em contato em breve.');
      }
      
      // Formulário enviado com sucesso - Redirecionar para página de confirmação
      
      // Obter dados do stand selecionado
      const dadosStand = getDadosStandSelecionado();
      
      // Obter descrição da condição de pagamento
      const condicaoPagamentoSelecionada = condicoesPagamento.find(c => c.id === formData.condicaoPagamento);
      
      // Preparar dados para a página de confirmação
      const dadosConfirmacao = {
        nome: formData.tipoPessoa === 'fisica' 
          ? formData.nomePF
          : formData.nomeResponsavel ? `${formData.nomeResponsavel} ${formData.sobrenomeResponsavel}` 
          : 'Usuário',
        email: formData.tipoPessoa === 'fisica' 
          ? formData.emailPF 
          : formData.emailResponsavel || formData.emailEmpresa,
        telefone: formData.tipoPessoa === 'fisica' 
          ? formData.telefonePF 
          : formData.contatoResponsavel || formData.telefoneEmpresa,
        empresa: formData.tipoPessoa === 'juridica' ? formData.razaoSocial : undefined,
        tipoPessoa: formData.tipoPessoa,
        dataEnvio: new Date().toLocaleDateString('pt-BR'),
        horarioEnvio: new Date().toLocaleTimeString('pt-BR'),
        numeroProtocolo: `CONSTRUIND-${Date.now().toString().slice(-8)}`,
        // Dados do stand
        standSelecionado: dadosStand,
        // Dados de pagamento
        condicaoPagamento: condicaoPagamentoSelecionada?.label || formData.condicaoPagamento,
        formaPagamento: formData.formaPagamento === 'pix' ? 'PIX' : 'Boleto Bancário',
        // Valor total (stand + patrocínio, se aplicável)
        valorTotal: dadosStand?.valor || 0
      };

      // Navegar para página de confirmação com os dados
      navigate('/confirmacao-pre-inscricao', { 
        state: { dadosSubmissao: dadosConfirmacao } 
      });
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        fullError: error
      });
      
      let errorMessage = 'Erro ao enviar formulário. Tente novamente.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado para controlar o scroll
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular a intensidade do degradê baseado no scroll - mais suave
  const scrollProgress = Math.min(scrollY / 800, 1); // máximo aos 800px de scroll
  
  return (
    <div className="min-h-screen bg-black relative">
      {/* Degradê mais visível que aparece conforme scroll */}
      <div 
        className="fixed inset-0 transition-opacity duration-1000 ease-out pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 60, 0, ${0.25 * scrollProgress}) 0%, 
            rgba(61, 61, 61, ${0.35 * scrollProgress}) 60%, 
            rgba(0, 0, 0, ${0.15 * scrollProgress}) 100%
          )`,
          opacity: scrollProgress
        }}
      />
      
      {/* Animações CSS personalizadas */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-25deg); }
          50% { transform: translateX(100%) skewX(-25deg); }
          100% { transform: translateX(100%) skewX(-25deg); }
        }
        
        /* Remove focus ring padrão e força apenas borda laranja */
        input:focus,
        textarea:focus,
        select:focus,
        button:focus {
          outline: none !important;
          box-shadow: none !important;
          ring: 0 !important;
        }
        
        /* Força apenas borda laranja no focus */
        .focus-orange:focus {
          border-color: #ff3c00 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        /* Estilos para PhoneInput */
        .react-tel-input .form-control {
          background-color: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          color: white !important;
          height: 48px !important;
          border-radius: 8px !important;
          padding-left: 58px !important;
        }
        
        .react-tel-input .form-control:focus {
          border-color: #ff3c00 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        .react-tel-input .flag-dropdown {
          background-color: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 8px 0 0 8px !important;
        }
        
        .react-tel-input .flag-dropdown:hover {
          background-color: #374151 !important;
        }
        
        .react-tel-input .selected-flag {
          background-color: #1f2937 !important;
          border-right: 1px solid #4b5563 !important;
        }
        
        .react-tel-input .selected-flag:hover {
          background-color: #374151 !important;
        }
        
        .react-tel-input .country-list {
          background-color: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 8px !important;
        }
        
        .react-tel-input .country-list .country {
          background-color: #1f2937 !important;
          color: white !important;
        }
        
        .react-tel-input .country-list .country:hover {
          background-color: #ff3c00 !important;
        }
        
        .react-tel-input .country-list .country.highlight {
          background-color: #ff3c00 !important;
        }
      `}</style>
      
      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          {/* Hero Header */}
          <div className="text-center mb-16">
            {/* Logo CONSTRUIND */}
            <div className="w-64 mx-auto mb-6 relative overflow-hidden opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              <img 
                src="/CONSTRUIND.svg" 
                alt="Logo CONSTRUIND" 
                className="w-full h-auto object-contain relative z-10"
              />
              {/* Efeito Glass Reflexo */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full z-20"
                style={{
                  animation: 'shine 3s ease-in-out infinite 1s',
                  transform: 'translateX(-100%) skewX(-25deg)'
                }}
              ></div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff3c00]/20 to-[#3d3d3d]/20 rounded-full mb-6 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              <Target className="w-4 h-4 text-[#ff3c00]" />
              <span className="text-sm font-semibold text-white">Seja um expositor</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
              Pré-inscrição
              <br />
              <span className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] bg-clip-text text-transparent">
                CONSTRUIND 2025
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <div className="subtitle-section mb-4 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.8s_forwards] text-center text-gray-300">
                {/* Texto removido conforme solicitado */}
              </div>
              
              <div className="inline-block bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 border border-[#ff3c00]/30 rounded-lg px-4 py-3 text-white text-sm max-w-2xl opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff3c00]" />
                  <div>
                    <p className="font-medium mb-1 text-white">Informação Importante</p>
                    <p className="text-xs leading-relaxed text-gray-300">
                      Este é um formulário de pré-inscrição. O preenchimento não garante sua participação na feira. 
                      A confirmação será enviada após análise da organização.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* TIPO DE PESSOA */}
            <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                          <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
              <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#ff3c00] rounded-xl">
                <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                    TIPO DE PESSOA
                  </CardTitle>
                  <CardDescription className="text-gray-300 -mt-1 leading-tight">
                    Selecione se você é Pessoa Física ou Jurídica
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
          <CardContent className="p-6">
              <RadioGroup
                value={formData.tipoPessoa}
                onValueChange={(value) => handleInputChange('tipoPessoa', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="relative">
                  <input
                    type="radio"
                    id="fisica"
                    value="fisica"
                    name="tipoPessoa"
                    className="sr-only peer"
                    onChange={(e) => handleInputChange('tipoPessoa', e.target.value)}
                  />
                  <label
                    htmlFor="fisica"
                  className="flex flex-col items-center p-6 bg-gray-800 border-2 border-gray-600 rounded-xl cursor-pointer hover:bg-gray-700 peer-checked:border-[#ff3c00] peer-checked:bg-[#ff3c00]/10 transition-all duration-300"
                >
                  <User className="w-12 h-12 text-[#ff3c00] mb-3" />
                  <h3 className="text-white font-bold text-lg mb-2">PESSOA FÍSICA</h3>
                  <p className="text-gray-300 text-center text-sm">
                      Para pessoas físicas que desejam expor
                    </p>
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="radio"
                    id="juridica"
                    value="juridica"
                    name="tipoPessoa"
                    className="sr-only peer"
                    onChange={(e) => handleInputChange('tipoPessoa', e.target.value)}
                  />
                  <label
                    htmlFor="juridica"
                  className="flex flex-col items-center p-6 bg-gray-800 border-2 border-gray-600 rounded-xl cursor-pointer hover:bg-gray-700 peer-checked:border-[#ff3c00] peer-checked:bg-[#ff3c00]/10 transition-all duration-300"
                >
                  <Building2 className="w-12 h-12 text-[#ff3c00] mb-3" />
                  <h3 className="text-white font-bold text-lg mb-2">PESSOA JURÍDICA</h3>
                  <p className="text-gray-300 text-center text-sm">
                      Para empresas e organizações
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

        {/* DADOS PESSOA FÍSICA - Condicional */}
        {formData.tipoPessoa === 'fisica' && (
          <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
            <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#ff3c00] rounded-xl">
                  <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                                            <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                          DADOS PESSOAIS
                        </CardTitle>
                        <CardDescription className="text-gray-300 -mt-1 leading-tight">
                        Suas informações pessoais
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nomePF" className="text-sm font-semibold text-white">
                      NOME COMPLETO *
                      </Label>
                      <Input
                        id="nomePF"
                        value={formData.nomePF}
                        onChange={(e) => handleInputChange('nomePF', e.target.value)}
                      className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg placeholder:text-gray-400"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-sm font-semibold text-white">
                      CPF *
                      </Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                      className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                      />
                    </div>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emailPF" className="text-sm font-semibold text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                      E-MAIL *
                      </Label>
                      <EmailAutocomplete
                        id="emailPF"
                        value={formData.emailPF}
                        onChange={(value) => handleInputChange('emailPF', value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Digite seu email..."
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="telefonePF" className="text-sm font-semibold text-white flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                      TELEFONE *
                      </Label>
                      <PhoneInput
                        id="telefonePF"
                        value={formData.telefonePF}
                        onChange={(value) => handleInputChange('telefonePF', value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Digite o número"
                        required
                      />
                    </div>
                  </div>

                  {/* Campos de Endereço Separados - Pessoa Física */}
                  <div className="space-y-2">
                    <Label htmlFor="cepPF" className="text-sm font-semibold text-white">
                      CEP * <span className="text-xs text-gray-400 font-normal">(preenchimento automático)</span>
                    </Label>
                    <div className="relative">
                    <Input
                        id="cepPF"
                        value={formData.cepPF}
                        onChange={(e) => handleInputChange('cepPF', formatCEP(e.target.value))}
                        onBlur={handleCEPBlurPF}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus:border-[#ff3c00] focus:ring-0 focus:outline-none rounded-lg pr-12 placeholder:text-gray-400"
                        placeholder="00000-000"
                        maxLength={9}
                      required
                    />
                      {isSearchingCEP && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-5 h-5 text-[#ff3c00] animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Digite o CEP e aguarde o preenchimento automático
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-2">
                      <Label htmlFor="logradouroPF" className="text-sm font-semibold text-white">
                        LOGRADOURO *
                      </Label>
                      <Input
                        id="logradouroPF"
                        value={formData.logradouroPF}
                        onChange={(e) => handleInputChange('logradouroPF', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Rua, Avenida, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numeroPF" className="text-sm font-semibold text-white">
                        NÚMERO *
                      </Label>
                      <Input
                        id="numeroPF"
                        value={formData.numeroPF}
                        onChange={(e) => handleInputChange('numeroPF', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="complementoPF" className="text-sm font-semibold text-white">
                        COMPLEMENTO
                      </Label>
                      <Input
                        id="complementoPF"
                        value={formData.complementoPF}
                        onChange={(e) => handleInputChange('complementoPF', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Apto, Casa, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bairroPF" className="text-sm font-semibold text-white">
                        BAIRRO *
                      </Label>
                      <Input
                        id="bairroPF"
                        value={formData.bairroPF}
                        onChange={(e) => handleInputChange('bairroPF', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cidadePF" className="text-sm font-semibold text-white">
                        CIDADE *
                      </Label>
                      <Input
                        id="cidadePF"
                        value={formData.cidadePF}
                        onChange={(e) => handleInputChange('cidadePF', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estadoPF" className="text-sm font-semibold text-white">
                        ESTADO *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('estadoPF', value)} value={formData.estadoPF}>
                        <SelectTrigger className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosBrasil.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
          )}

          {/* DADOS DA EMPRESA - Condicional para Pessoa Jurídica */}
          {formData.tipoPessoa === 'juridica' && (
            <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
              <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                  <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#ff3c00] rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-0 leading-tight">
                        DADOS DA EMPRESA
                      </CardTitle>
                      <CardDescription className="text-gray-300 -mt-1 leading-tight">
                        Informações básicas da empresa expositora
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
              <CardContent className="p-6 space-y-6">
                  {/* CNPJ com busca automática */}
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-sm font-semibold text-white">
                    CNPJ * <span className="text-xs text-gray-400 font-normal">(preenchimento automático)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                        onBlur={handleCNPJBlur}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus:border-[#ff3c00] focus:ring-0 focus:outline-none rounded-lg pr-12 placeholder:text-gray-400"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                        required
                      />
                      {isSearchingCNPJ && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-5 h-5 text-[#3d3d3d] animate-spin" />
                        </div>
                      )}
                      {!isSearchingCNPJ && formData.cnpj && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Search className="w-5 h-5 text-[#3d3d3d]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Digite o CNPJ e aguarde o preenchimento automático dos dados
                    </p>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial" className="text-sm font-semibold text-white">
                      RAZÃO SOCIAL *
                      </Label>
                      <Input
                        id="razaoSocial"
                        value={formData.razaoSocial}
                        onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="nomeSocial" className="text-sm font-semibold text-white">
                        NOME FANTASIA
                      </Label>
                      <Input
                        id="nomeSocial"
                        value={formData.nomeSocial}
                        onChange={(e) => handleInputChange('nomeSocial', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Preenchido automaticamente"
                      />
                    </div>
                  </div>

                                  {/* Campos de Endereço Separados */}
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-sm font-semibold text-white">
                      CEP * <span className="text-xs text-gray-400 font-normal">(preenchimento automático)</span>
                    </Label>
                    <div className="relative">
                    <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => handleInputChange('cep', formatCEP(e.target.value))}
                        onBlur={handleCEPBlur}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus:border-[#ff3c00] focus:ring-0 focus:outline-none rounded-lg pr-12 placeholder:text-gray-400"
                        placeholder="00000-000"
                        maxLength={9}
                      required
                    />
                      {isSearchingCEP && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-5 h-5 text-[#3d3d3d] animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Digite o CEP e aguarde o preenchimento automático
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-2">
                      <Label htmlFor="logradouro" className="text-sm font-semibold text-white">
                        LOGRADOURO *
                      </Label>
                      <Input
                        id="logradouro"
                        value={formData.logradouro}
                        onChange={(e) => handleInputChange('logradouro', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Rua, Avenida, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numero" className="text-sm font-semibold text-white">
                        NÚMERO *
                      </Label>
                      <Input
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => handleInputChange('numero', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="complemento" className="text-sm font-semibold text-white">
                        COMPLEMENTO
                      </Label>
                      <Input
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Apto, Sala, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bairro" className="text-sm font-semibold text-white">
                        BAIRRO *
                      </Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                      placeholder="Preenchido automaticamente"
                      required
                    />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-sm font-semibold text-white">
                        CIDADE *
                      </Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-sm font-semibold text-white">
                        ESTADO *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('estado', value)} value={formData.estado}>
                        <SelectTrigger className="h-12 bg-gray-800 border-gray-600 text-white focus:border-[#3d3d3d] rounded-lg">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosBrasil.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telefoneEmpresa" className="text-sm font-semibold text-white flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                      TELEFONE *
                      </Label>
                      <PhoneInput
                        id="telefoneEmpresa"
                        value={formData.telefoneEmpresa}
                        onChange={(value) => handleInputChange('telefoneEmpresa', value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                        placeholder="Digite o número"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="emailEmpresa" className="text-sm font-semibold text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                      E-MAIL *
                      </Label>
                      <Input
                        id="emailEmpresa"
                        type="email"
                        value={formData.emailEmpresa}
                        onChange={(e) => handleInputChange('emailEmpresa', e.target.value)}
                      className="h-12 bg-gray-800 border-gray-600 text-white focus:border-[#ff3c00] focus:ring-0 focus:outline-none rounded-lg"
                        placeholder="contato@empresa.com.br"
                        required
                      />
                    </div>
                  </div>


                </CardContent>
              </Card>
          )}

          {/* Resto das seções só aparecem depois de escolher o tipo de pessoa */}
          {formData.tipoPessoa && (
            <>
              {/* RESPONSÁVEL LEGAL */}
              <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.4s_forwards]">
              <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                  <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#ff3c00] rounded-xl">
                    <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                        RESPONSÁVEL LEGAL
                      </CardTitle>
                        <CardDescription className="text-gray-300 -mt-1 leading-tight">
                          Informações da pessoa que irá assinar o contrato
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nomeResponsavel" className="text-sm font-semibold text-white">
                        NOME *
                        </Label>
                        <Input
                          id="nomeResponsavel"
                          value={formData.nomeResponsavel}
                          onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                          placeholder="Nome do responsável"
                          required
                        />
                      </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="sobrenomeResponsavel" className="text-sm font-semibold text-white">
                        SOBRENOME *
                        </Label>
                        <Input
                          id="sobrenomeResponsavel"
                          value={formData.sobrenomeResponsavel}
                          onChange={(e) => handleInputChange('sobrenomeResponsavel', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                          placeholder="Sobrenome do responsável"
                          required
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emailResponsavel" className="text-sm font-semibold text-white">
                          E-MAIL DO RESPONSÁVEL
                        </Label>
                        <Input
                          id="emailResponsavel"
                          type="email"
                          value={formData.emailResponsavel}
                          onChange={(e) => handleInputChange('emailResponsavel', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                          placeholder="responsavel@empresa.com.br"
                        />
                      </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="contatoResponsavel" className="text-sm font-semibold text-white">
                        TELEFONE DO RESPONSÁVEL *
                        </Label>
                        <PhoneInput
                          id="contatoResponsavel"
                          value={formData.contatoResponsavel}
                          onChange={(value) => handleInputChange('contatoResponsavel', value)}
                          className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                          placeholder="Digite o número de telefone"
                          required
                        />
                      </div>
                    </div>


                  </CardContent>
                </Card>

              {/* RESPONSÁVEL PELO STAND */}
              <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.6s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#ff3c00] rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                          RESPONSÁVEL PELO STAND
                        </CardTitle>
                        <CardDescription className="text-gray-300 -mt-1 leading-tight">
                          Funcionário responsável pelas comunicações da CONSTRUIND 2025
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nomeResponsavelStand" className="text-sm font-semibold text-white">
                        NOME *
                        </Label>
                        <Input
                          id="nomeResponsavelStand"
                          value={formData.nomeResponsavelStand}
                          onChange={(e) => handleInputChange('nomeResponsavelStand', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                          placeholder="Nome do responsável"
                          required
                        />
                      </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="sobrenomeResponsavelStand" className="text-sm font-semibold text-white">
                        SOBRENOME *
                        </Label>
                        <Input
                          id="sobrenomeResponsavelStand"
                          value={formData.sobrenomeResponsavelStand}
                          onChange={(e) => handleInputChange('sobrenomeResponsavelStand', e.target.value)}
                        className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg"
                          placeholder="Sobrenome do responsável"
                          required
                        />
                      </div>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailResponsavelStand" className="text-sm font-semibold text-white">
                      E-MAIL *
                      </Label>
                      <Input
                        id="emailResponsavelStand"
                        type="email"
                        value={formData.emailResponsavelStand}
                        onChange={(e) => handleInputChange('emailResponsavelStand', e.target.value)}
                      className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg placeholder:text-gray-400"
                        placeholder="responsavel.stand@empresa.com.br"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

              {/* MAPA DO EVENTO */}
              <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.8s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#ff3c00] rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
              </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                        MAPA DO EVENTO
                      </CardTitle>
                      <CardDescription className="text-gray-300 -mt-1 leading-tight">
                        Visualize a localização dos stands antes de escolher
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="w-full">
                    <MapViewer 
                      mapImage="/mapa-do-evento.png"
                      title="Mapa da CONSTRUIND 2025"
                      description="Clique e arraste para navegar pelo mapa do evento"
                      showDownloadButton={false}
                      showFullscreenButton={false}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SERVIÇOS E STAND */}
              <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#ff3c00] rounded-xl">
                      <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                          ESCOLHA SEU STAND
                        </CardTitle>
                        <CardDescription className="text-gray-300 -mt-1 leading-tight">
                          Selecione o estande ideal para sua empresa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-8">
                  
                  {/* Legenda das cores dos stands - MOVIDA PARA O TOPO */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-500 rounded-xl p-6">
                    <div className="text-sm font-bold text-white mb-2">LEGENDA DOS STANDS</div>
                    <div className="text-xs text-gray-300 mb-4">
                      Cada cor indica o status atual do stand disponível para reserva.
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                                              <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 shadow-sm"></div>
                          <div>
                            <div className="text-sm font-semibold text-white">Disponível</div>
                            <div className="text-xs text-gray-300">Pode ser selecionado</div>
                          </div>
                        </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-sm"></div>
                        <div>
                          <div className="text-sm font-semibold text-white">Pré-reservado</div>
                          <div className="text-xs text-gray-300">Indisponível temporariamente</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-500 shadow-sm"></div>
                        <div>
                          <div className="text-sm font-semibold text-white">Ocupado</div>
                          <div className="text-xs text-gray-300">Stand já confirmado</div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-8">
                    {/* Seletor de Stand com bolinhas coloridas */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-white">
                          NÚMERO DO STAND *
                        </Label>
                        {!isLoadingStands && standsDisponiveis.length === 0 && (
                          <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            Execute o SQL no Supabase para ativar o sistema
                          </div>
                        )}
                      </div>
                      

                      
                                              {formData.numeroStand && (
                        <div className="bg-[#ff3c00]/10 border border-[#ff3c00]/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-[#ff3c00]"></div>
                            <span className="font-medium text-white">
                              Stand {formData.numeroStand} selecionado
                            </span>
                            <span className="text-gray-300">
                              - Complete o formulário para confirmar sua reserva
                            </span>
                          </div>
                        </div>
                      )}


                      
                      <div className="space-y-6">
                        {/* SEÇÃO DINÂMICA - Alimentada pelo banco de dados */}
                        {isLoadingStands ? (
                          // Loading estado
                          <div className="space-y-6">
                            {Array.from({ length: 3 }, (_, i) => (
                              <div key={i} className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                </div>
                                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
                                  {Array.from({ length: 12 }, (_, j) => (
                                    <div key={j} className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : Object.keys(standsAgrupados).length === 0 ? (
                          // Estado vazio
                          <div className="text-center py-8">
                            <div className="text-gray-500">
                              <p className="text-lg font-medium">Nenhum stand encontrado</p>
                              <p className="text-sm mt-1">Configure os stands na área administrativa</p>
                            </div>
                          </div>
                        ) : (
                          // Renderizar categorias dinamicamente
                          Object.entries(standsAgrupados).map(([categoria, stands]) => (
                            <div key={categoria} className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: getCorCategoria(categoria) }}
                                ></div>
                                <h4 className="text-sm font-semibold text-white">
                                  ESTANDES {getTamanhoCategoria(categoria)}
                                </h4>
                                <span className="text-xs text-gray-300">
                                  ({formatarMoedaBrasileira(converterPrecoParaNumero(stands[0]?.preco))})
                                </span>
                              </div>
                              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
                                {stands.map((stand) => {
                                  const isSelected = formData.numeroStand === stand.numero_stand;
                                  
                                  return (
                                    <div key={stand.numero_stand} className="relative">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleStandSelection(stand.numero_stand);
                                        }}
                                        disabled={!stand.podeSelecionar && !isSelected}
                                        title={isSelected ? `Stand ${stand.numero_stand} - Clique para deselecionar` : stand.descricao}
                                        className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-200 ${
                                          !stand.podeSelecionar
                                            ? 'cursor-not-allowed opacity-70'
                                            : 'cursor-pointer hover:scale-105 active:scale-95'
                                        } ${
                                          isSelected 
                                            ? 'ring-2 ring-yellow-400 scale-110 shadow-lg bg-yellow-400' 
                                            : ''
                                        }`}
                                        style={{ 
                                          backgroundColor: stand.cor,
                                          color: stand.status === 'ocupado' ? '#000000' : '#ffffff'
                                        }}
                                      >
                                        {stand.numero_stand}
                                      </button>
                                      {isSelected && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Patrocínio */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-white">DESEJA SER PATROCINADOR?</Label>
                     <RadioGroup
                       value={formData.desejaPatrocinio}
                       onValueChange={(value) => handleInputChange('desejaPatrocinio', value)}
                       className="flex space-x-6"
                     >
                      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <RadioGroupItem value="sim" id="patrocinio-sim" className="text-[#ff3c00]" />
                        <Label htmlFor="patrocinio-sim" className="cursor-pointer text-white font-medium">SIM</Label>
                       </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <RadioGroupItem value="nao" id="patrocinio-nao" className="text-[#ff3c00]" />
                        <Label htmlFor="patrocinio-nao" className="cursor-pointer text-white font-medium">NÃO</Label>
                       </div>
                     </RadioGroup>
                  </div>
                  
                  {formData.desejaPatrocinio === 'sim' && (
                    <div className="space-y-2">
                      <Label htmlFor="categoriaPatrocinio" className="text-sm font-semibold text-white">
                            CATEGORIA DE PATROCÍNIO
                          </Label>
                          <Select onValueChange={(value) => handleInputChange('categoriaPatrocinio', value)}>
                        <SelectTrigger className="h-12 bg-gray-800 border-gray-600 text-white focus-orange rounded-lg">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="master">
                            <div className="flex items-center justify-between w-full">
                              <span>Master</span>
                              <span className="ml-4 text-[#ff3c00] font-semibold">{formatarMoedaBrasileira(20000)}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="diamante">
                            <div className="flex items-center justify-between w-full">
                              <span>Diamante</span>
                              <span className="ml-4 text-[#ff3c00] font-semibold">{formatarMoedaBrasileira(12000)}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="ouro">
                            <div className="flex items-center justify-between w-full">
                              <span>Ouro</span>
                              <span className="ml-4 text-[#ff3c00] font-semibold">{formatarMoedaBrasileira(10000)}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="telao_led">
                            <div className="flex items-center justify-between w-full">
                              <span>Telão de LED</span>
                              <span className="ml-4 text-[#ff3c00] font-semibold">{formatarMoedaBrasileira(600)}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                        </div>
                  )}
                  </CardContent>
                </Card>

              {/* CONDIÇÕES E FORMAS DE PAGAMENTO */}
              <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2.2s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#ff3c00] rounded-xl">
                      <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                          CONDIÇÕES DE PAGAMENTO
                        </CardTitle>
                        <CardDescription className="text-gray-300 -mt-1 leading-tight">
                          Escolha a forma de pagamento que melhor se adequa à sua empresa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-8">
                  {/* Condições de Pagamento */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-white">
                      CONDIÇÃO DE PAGAMENTO *
                    </Label>
                    <RadioGroup
                      value={formData.condicaoPagamento}
                      onValueChange={(value) => handleInputChange('condicaoPagamento', value)}
                      className="space-y-4"
                    >
                      {condicoesPagamento.map((condicao) => (
                        <div key={condicao.id} className="relative">
                          <input
                            type="radio"
                            id={condicao.id}
                            value={condicao.id}
                            name="condicaoPagamento"
                            className="sr-only peer"
                            onChange={(e) => handleInputChange('condicaoPagamento', e.target.value)}
                          />
                          <label
                            htmlFor={condicao.id}
                            className={`block p-4 border-2 border-gray-600 rounded-xl cursor-pointer hover:bg-gray-700 peer-checked:border-[#ff3c00] peer-checked:bg-[#ff3c00]/10 transition-all duration-300 ${condicao.highlight ? 'bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 border-[#ff3c00]/30' : 'bg-gray-800'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">
                                  {condicao.label}
                                  {condicao.highlight && (
                                    <span className="ml-2 px-2 py-1 bg-[#ff3c00]/20 text-[#ff3c00] text-xs font-medium rounded-full">
                                      DESCONTO
                                    </span>
                                  )}
                                </h3>
                                <p className="text-gray-300 text-sm">{condicao.description}</p>
                        </div>
                        </div>
                          </label>
                      </div>
                      ))}
                    </RadioGroup>
                    </div>

                  {/* Forma de Pagamento */}
                        <div className="space-y-4">
                    <Label className="text-sm font-semibold text-white">
                      FORMA DE PAGAMENTO *
                    </Label>
                          <RadioGroup
                      value={formData.formaPagamento}
                      onValueChange={(value) => handleInputChange('formaPagamento', value)}
                            className="flex space-x-6"
                          >
                      <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-600 hover:bg-gray-700 transition-colors">
                        <RadioGroupItem value="pix" id="pagamento-pix" className="text-[#ff3c00]" />
                        <Label htmlFor="pagamento-pix" className="cursor-pointer text-white font-medium text-lg">PIX</Label>
                            </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-600 hover:bg-gray-700 transition-colors">
                        <RadioGroupItem value="boleto" id="pagamento-boleto" className="text-[#ff3c00]" />
                        <Label htmlFor="pagamento-boleto" className="cursor-pointer text-white font-medium text-lg">BOLETO</Label>
                            </div>
                          </RadioGroup>
                        </div>
                </CardContent>
              </Card>

              {/* INFORMAÇÕES ADICIONAIS */}
              <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2.4s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#ff3c00] rounded-xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                        INFORMAÇÕES ADICIONAIS
                      </CardTitle>
                      <CardDescription className="text-gray-300 -mt-1 leading-tight">
                        Conte-nos mais sobre sua empresa e objetivos no evento
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="observacoes" className="text-sm font-semibold text-white">
                      OBSERVAÇÕES E SOLICITAÇÕES ESPECIAIS
                        </Label>
                        <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus-orange rounded-lg min-h-[120px] placeholder:text-gray-400"
                      placeholder="Descreva seus produtos/serviços, objetivos no evento, necessidades especiais do stand, etc..."
                      rows={5}
                        />
                      </div>
                  </CardContent>
                </Card>
            </>
          )}

          {/* Submit Button */}
          {formData.tipoPessoa && (
            <div className="text-center pt-8 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2.6s_forwards]">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                className="bg-gradient-to-r from-[#ff3c00] to-[#3d3d3d] hover:from-[#e63600] hover:to-[#2d2d2d] text-white px-12 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[250px]"
                >
                  {isSubmitting ? (
                      <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    ENVIANDO...
                      </div>
                ) : (
                  'ENVIAR PRÉ-INSCRIÇÃO'
                  )}
                </Button>
              
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-green-800 text-sm">Seus dados estão protegidos e serão tratados com total confidencialidade</span>
              </div>
            </div>
          )}
        </form>
        </div>
      </div>
      
    </div>
  );
};

export default FormularioPreInscricaoExpositores;