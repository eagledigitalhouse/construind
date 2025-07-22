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
import { Upload, FileText, Building2, User, Phone, Mail, CreditCard, MapPin, Calendar, CheckCircle, Search, Loader2, Users, Target, Info } from 'lucide-react';
import { toast } from 'sonner';
import MapViewer from '@/components/pages/MapViewer';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/uploadImage';

/*
🔹 SISTEMA DE RESERVAS TEMPORÁRIAS DE STANDS:

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

✅ RESULTADO: O produtor só vê cards quando o formulário é realmente enviado!
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
    cartaoCnpj: null as File | null,
    
    // Responsável Legal
    nomeResponsavel: '',
    sobrenomeResponsavel: '',
    emailResponsavel: '',
    contatoResponsavel: '',
    isWhatsApp: '',
    
    // Responsável pelo Stand
    nomeResponsavelStand: '',
    sobrenomeResponsavelStand: '',
    emailResponsavelStand: '',
    
    // Serviços
    numeroStand: '',
    desejaPatrocinio: '',
    categoriaPatrocinio: '',
    condicaoPagamento: '',
    formaPagamento: '',
    
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

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Limpeza de stands com timeout expirado (>10 minutos)
  const cleanupOnlyExpiredStands = async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      const { data: expiredStands, error: fetchError } = await supabase
        .from('stands_fespin')
        .select('numero_stand, data_reserva, observacoes')
        .eq('status', 'reservado')
        .not('data_reserva', 'is', null)
        .like('observacoes', '%Timeout%')
        .lt('data_reserva', tenMinutesAgo.toISOString());

      if (fetchError) return;

      if (expiredStands && expiredStands.length > 0) {
        await supabase
          .from('stands_fespin')
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

  // 🚀 SISTEMA TEMPO REAL APRIMORADO - REAÇÃO INSTANTÂNEA
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
        console.log('🔄 Mudança detectada na tabela pre_inscricao_expositores:', payload);
        carregarStands();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'stands_fespin'
      }, (payload) => {
        console.log('🔄 Mudança detectada na tabela stands_fespin:', payload);
        carregarStands();
      })
      .subscribe((status) => {
        console.log('📡 Status do canal real-time:', status);
      });

    // Limpeza automática apenas de stands realmente expirados (>10min)
    const cleanupInterval = setInterval(() => {
      cleanupOnlyExpiredStands();
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      console.log('🔌 Desconectando canal real-time');
      canalRealtime.unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, []);



  const carregarStands = async () => {
    console.log(`🔄 Carregando stands... ${new Date().toLocaleTimeString('pt-BR')}`);
    setIsLoadingStands(true);
    
    try {
      // Buscar stands com todas as informações de status
      const { data: standsData } = await supabase
        .from('stands_fespin')
        .select('numero_stand, categoria, tamanho, preco, disponivel, status, reservado_por, data_reserva, observacoes');

      if (!standsData) {
        console.log('❌ Nenhum dado de stand encontrado');
        setIsLoadingStands(false);
        return;
      }

      // 🔹 LÓGICA APRIMORADA: Baseada no status com verificação de pré-inscrições
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
      
      console.log(`✅ Stands atualizados em ${new Date().toLocaleTimeString('pt-BR')}`);
      
    } catch (error) {
      console.error('❌ Erro ao carregar stands:', error);
    } finally {
      setIsLoadingStands(false);
    }
  };

  const condicoesPagamento = [
    {
      value: 'a_vista_desconto',
      label: 'À vista com 5% desconto',
      description: 'Pagamento até 30/08/2025 com desconto de 5%',
      highlight: true
    },
    {
      value: 'sinal_3_parcelas',
      label: '20% sinal + 3 parcelas',
      description: '20% na assinatura + parcelas em agosto, setembro e outubro'
    },
    {
      value: 'sinal_saldo',
      label: '20% sinal + saldo restante',
      description: '20% na assinatura + saldo restante até 20/10/2025'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🎯 LÓGICA ORIGINAL: Apenas permitir deselecionar o próprio stand selecionado
  const handleStandSelection = async (standNumber: string) => {
    const stand = standsDisponiveis.find(s => s.numero_stand === standNumber);
    
    // 🔹 SE É O MEU STAND SELECIONADO: Permitir deselecionar
    if (formData.numeroStand === standNumber) {
      try {
        // Deselecionar meu stand
        const { error } = await supabase
          .from('stands_fespin')
          .update({
            status: 'disponivel',
            reservado_por: null,
            data_reserva: null,
            observacoes: null,
            updated_at: new Date().toISOString()
          })
          .eq('numero_stand', standNumber);

        if (error) throw error;

        // Limpar seleção local
        handleInputChange('numeroStand', '');
        toast.success(`🟢 Stand ${standNumber} foi liberado!`);
        return;
      } catch (error) {
        console.error('Erro ao deselecionar stand:', error);
        toast.error('Erro ao liberar stand');
        return;
      }
    }
    
    // 🔹 LÓGICA ORIGINAL: Verificar disponibilidade
    if (!stand || !stand.podeSelecionar) {
      toast.error(`Stand ${standNumber} não está disponível`);
      return;
    }

    try {
      // 1. Liberar stand anterior (se houver)
      if (formData.numeroStand) {
        await supabase
          .from('stands_fespin')
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
        .from('stands_fespin')
        .update({
          status: 'reservado',
          reservado_por: 'Usuário do Formulário',
          data_reserva: new Date().toISOString(),
          observacoes: `Reservado até ${expirationTime.toLocaleString('pt-BR')} - Timeout 10min`,
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', standNumber);

      if (error) throw error;

      // 3. Atualizar seleção local
      handleInputChange('numeroStand', standNumber);
      toast.success(`🟡 Stand ${standNumber} pré-reservado por 10 minutos!`);

    } catch (error) {
      console.error('Erro ao selecionar stand:', error);
      toast.error('Erro ao selecionar stand');
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
      'Academias': '#B6FF72',
      'Bem-Estar': '#FF776C', 
      'Artigos Esportivos': '#A6CFFF',
      'Saúde e Nutrição': '#38FFB8',
      'Área Livre': '#FFE27F',
      'Patrocinadores': '#59B275'
    };
    return cores[categoria] || '#CCCCCC';
  };

  const handleFileUpload = (file: File | null) => {
    setFormData(prev => ({ ...prev, cartaoCnpj: file }));
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
      toast.error('CNPJ deve ter 14 dígitos');
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
      
      toast.success(`Dados da empresa "${razaoSocial}" preenchidos automaticamente via ${apiUsed}!`);
      
    } catch (error: any) {
      console.error('Erro ao buscar CNPJ:', error);
      toast.error(`${error.message || 'Erro ao buscar dados do CNPJ. Verifique o número digitado.'}`);
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
      toast.error('CEP deve ter 8 dígitos');
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
      
      toast.success(`CEP encontrado! Endereço preenchido automaticamente.`);
      
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      toast.error(`${error.message || 'Erro ao buscar CEP. Verifique o número digitado.'}`);
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
      toast.error('CEP deve ter 8 dígitos');
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
      
      toast.success(`CEP encontrado! Endereço preenchido automaticamente.`);
      
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error);
      toast.error(`${error.message || 'Erro ao buscar CEP. Verifique o número digitado.'}`);
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
        if (!formData.cartaoCnpj) {
          throw new Error('Por favor, faça upload do cartão CNPJ');
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

      if (!formData.desejaPatrocinio) {
        throw new Error('Por favor, informe se deseja ser patrocinador');
      }
      // Fazer upload do arquivo CNPJ se existir
      let cartaoCnpjUrl = null;
      if (formData.cartaoCnpj) {
        toast.info('Fazendo upload do arquivo...');
        cartaoCnpjUrl = await uploadImage(formData.cartaoCnpj, 'cartao-cnpj');
        if (!cartaoCnpjUrl) {
          throw new Error('Erro ao fazer upload do arquivo CNPJ');
        }
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
        cartao_cnpj_url: cartaoCnpjUrl,
        
        // Responsável Legal
        nome_responsavel: formData.nomeResponsavel,
        sobrenome_responsavel: formData.sobrenomeResponsavel,
        email_responsavel: formData.emailResponsavel || null,
        contato_responsavel: formData.contatoResponsavel,
        is_whatsapp: formData.isWhatsApp,
        
        // Responsável pelo Stand
        nome_responsavel_stand: formData.nomeResponsavelStand,
        sobrenome_responsavel_stand: formData.sobrenomeResponsavelStand,
        email_responsavel_stand: formData.emailResponsavelStand,
        
        // Serviços
        numero_stand: formData.numeroStand,
        deseja_patrocinio: formData.desejaPatrocinio,
        categoria_patrocinio: formData.categoriaPatrocinio || null,
        condicao_pagamento: formData.condicaoPagamento,
        forma_pagamento: formData.formaPagamento,
        
        // Informações Adicionais
        observacoes: formData.observacoes || null,
        
        // Dados de controle
        ip_address: userIP,
      };

      // 🎯 CRIAR pré-inscrição normal (SEM registros temporários)
      const { data, error } = await supabase
        .from('pre_inscricao_expositores')
        .insert({
          ...dataToInsert,
          status: 'pendente',
          is_temporary: false // 🔹 SEMPRE definitivo - APARECE NO PAINEL
        })
        .select();

      if (error) {
        throw error;
      }

      // 🔹 ATUALIZAR stand para aguardar aprovação (mantém status reservado)
      const nomeExpositor = formData.tipoPessoa === 'fisica' 
        ? formData.nomePF 
        : formData.razaoSocial || `${formData.nomeResponsavel} ${formData.sobrenomeResponsavel}`;

      await supabase
        .from('stands_fespin')
        .update({
          status: 'reservado', // Continua reservado até aprovação
          reservado_por: nomeExpositor,
          data_reserva: new Date().toISOString(),
          observacoes: `Inscrição enviada - Aguardando aprovação do organizador`,
          updated_at: new Date().toISOString()
        })
        .eq('numero_stand', formData.numeroStand);

      // 🎉 Sucesso - pré-inscrição enviada
      if (formData.numeroStand) {
        toast.success(`✅ Pré-inscrição enviada com sucesso!`, {
          description: `Stand ${formData.numeroStand} pré-reservado. Aguarde aprovação do organizador.`,
          duration: 5000
        });
      } else {
        toast.success('Pré-inscrição enviada com sucesso! Entraremos em contato em breve.');
      }
      
      // 🎯 Formulário enviado com sucesso - Redirecionar para página de confirmação
      
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
        numeroProtocolo: `FESPIN-${Date.now().toString().slice(-8)}`
      };

      // Navegar para página de confirmação com os dados
      navigate('/confirmacao-pre-inscricao', { 
        state: { dadosSubmissao: dadosConfirmacao } 
      });
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast.error(error.message || 'Erro ao enviar formulário. Tente novamente.');
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
    <div className="min-h-screen bg-white relative">
      {/* Degradê mais visível que aparece conforme scroll */}
      <div 
        className="fixed inset-0 transition-opacity duration-1000 ease-out pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            rgba(0, 216, 86, ${0.25 * scrollProgress}) 0%, 
            rgba(177, 247, 39, ${0.35 * scrollProgress}) 60%, 
            rgba(10, 40, 86, ${0.15 * scrollProgress}) 100%
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
      `}</style>
      
      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          {/* Hero Header */}
          <div className="text-center mb-16">
            {/* Logo FESPIN */}
            <div className="mb-6 relative overflow-hidden opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              <img 
                src="/LOGO HORIZONTAL AZUL DEGRADE.svg" 
                alt="Logo FESPIN" 
                className="h-12 md:h-16 lg:h-18 mx-auto object-contain relative z-10"
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
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0a2856]/10 to-[#00d856]/10 rounded-full mb-6 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              <Target className="w-4 h-4 text-[#0a2856]" />
              <span className="text-sm font-semibold text-[#0a2856]">Seja um expositor</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0a2856] leading-tight mb-4 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
              Pré-inscrição
              <br />
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">
                FESPIN 2025
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.8s_forwards] text-center">
                Manifeste seu interesse em participar da maior feira fitness do interior paulista e conecte-se com milhares de visitantes.
              </p>
              
              <div className="inline-block bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 border border-[#0a2856]/20 rounded-lg px-4 py-3 text-[#0a2856] text-sm max-w-2xl opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00d856]" />
                  <div>
                    <p className="font-medium mb-1 text-[#0a2856]">Informação Importante</p>
                    <p className="text-xs leading-relaxed text-[#0a2856]/80">
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
            <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                          <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
              <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#0a2856] rounded-xl">
                <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                    TIPO DE PESSOA
                  </CardTitle>
                  <CardDescription className="text-gray-600 -mt-1 leading-tight">
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
                  className="flex flex-col items-center p-6 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 peer-checked:border-[#00d856] peer-checked:bg-[#00d856]/5 transition-all duration-300"
                >
                  <User className="w-12 h-12 text-[#0a2856] mb-3" />
                  <h3 className="text-[#0a2856] font-bold text-lg mb-2">PESSOA FÍSICA</h3>
                  <p className="text-gray-600 text-center text-sm">
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
                  className="flex flex-col items-center p-6 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 peer-checked:border-[#00d856] peer-checked:bg-[#00d856]/5 transition-all duration-300"
                >
                  <Building2 className="w-12 h-12 text-[#0a2856] mb-3" />
                  <h3 className="text-[#0a2856] font-bold text-lg mb-2">PESSOA JURÍDICA</h3>
                  <p className="text-gray-600 text-center text-sm">
                      Para empresas e organizações
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

        {/* DADOS PESSOA FÍSICA - Condicional */}
        {formData.tipoPessoa === 'fisica' && (
          <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
            <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#0a2856] rounded-xl">
                  <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                                            <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                          DADOS PESSOAIS
                        </CardTitle>
                        <CardDescription className="text-gray-600 -mt-1 leading-tight">
                        Suas informações pessoais
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nomePF" className="text-sm font-semibold text-[#0a2856]">
                      NOME COMPLETO *
                      </Label>
                      <Input
                        id="nomePF"
                        value={formData.nomePF}
                        onChange={(e) => handleInputChange('nomePF', e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-sm font-semibold text-[#0a2856]">
                      CPF *
                      </Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                      />
                    </div>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emailPF" className="text-sm font-semibold text-[#0a2856] flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                      E-MAIL *
                      </Label>
                      <Input
                        id="emailPF"
                        type="email"
                        value={formData.emailPF}
                        onChange={(e) => handleInputChange('emailPF', e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="telefonePF" className="text-sm font-semibold text-[#0a2856] flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                      TELEFONE *
                      </Label>
                      <Input
                        id="telefonePF"
                        value={formData.telefonePF}
                        onChange={(e) => handleInputChange('telefonePF', formatPhone(e.target.value))}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>

                  {/* Campos de Endereço Separados - Pessoa Física */}
                  <div className="space-y-2">
                    <Label htmlFor="cepPF" className="text-sm font-semibold text-[#0a2856]">
                      CEP * <span className="text-xs text-gray-500 font-normal">(preenchimento automático)</span>
                    </Label>
                    <div className="relative">
                    <Input
                        id="cepPF"
                        value={formData.cepPF}
                        onChange={(e) => handleInputChange('cepPF', formatCEP(e.target.value))}
                        onBlur={handleCEPBlurPF}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg pr-12"
                        placeholder="00000-000"
                        maxLength={9}
                      required
                    />
                      {isSearchingCEP && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-5 h-5 text-[#00d856] animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Digite o CEP e aguarde o preenchimento automático
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-2">
                      <Label htmlFor="logradouroPF" className="text-sm font-semibold text-[#0a2856]">
                        LOGRADOURO *
                      </Label>
                      <Input
                        id="logradouroPF"
                        value={formData.logradouroPF}
                        onChange={(e) => handleInputChange('logradouroPF', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Rua, Avenida, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numeroPF" className="text-sm font-semibold text-[#0a2856]">
                        NÚMERO *
                      </Label>
                      <Input
                        id="numeroPF"
                        value={formData.numeroPF}
                        onChange={(e) => handleInputChange('numeroPF', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="complementoPF" className="text-sm font-semibold text-[#0a2856]">
                        COMPLEMENTO
                      </Label>
                      <Input
                        id="complementoPF"
                        value={formData.complementoPF}
                        onChange={(e) => handleInputChange('complementoPF', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Apto, Casa, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bairroPF" className="text-sm font-semibold text-[#0a2856]">
                        BAIRRO *
                      </Label>
                      <Input
                        id="bairroPF"
                        value={formData.bairroPF}
                        onChange={(e) => handleInputChange('bairroPF', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cidadePF" className="text-sm font-semibold text-[#0a2856]">
                        CIDADE *
                      </Label>
                      <Input
                        id="cidadePF"
                        value={formData.cidadePF}
                        onChange={(e) => handleInputChange('cidadePF', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estadoPF" className="text-sm font-semibold text-[#0a2856]">
                        ESTADO *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('estadoPF', value)} value={formData.estadoPF}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-[#00d856] rounded-lg">
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
            <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
              <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                  <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#0a2856] rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                        DADOS DA EMPRESA
                      </CardTitle>
                      <CardDescription className="text-gray-600 -mt-1 leading-tight">
                        Informações básicas da empresa expositora
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
              <CardContent className="p-6 space-y-6">
                  {/* CNPJ com busca automática */}
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-sm font-semibold text-[#0a2856]">
                    CNPJ * <span className="text-xs text-gray-500 font-normal">(preenchimento automático)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                        onBlur={handleCNPJBlur}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg pr-12"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                        required
                      />
                      {isSearchingCNPJ && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-5 h-5 text-[#00d856] animate-spin" />
                        </div>
                      )}
                      {!isSearchingCNPJ && formData.cnpj && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Search className="w-5 h-5 text-[#00d856]" />
                        </div>
                      )}
                    </div>
                  <p className="text-xs text-gray-500">
                    Digite o CNPJ e aguarde o preenchimento automático dos dados
                    </p>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial" className="text-sm font-semibold text-[#0a2856]">
                      RAZÃO SOCIAL *
                      </Label>
                      <Input
                        id="razaoSocial"
                        value={formData.razaoSocial}
                        onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="nomeSocial" className="text-sm font-semibold text-[#0a2856]">
                        NOME FANTASIA
                      </Label>
                      <Input
                        id="nomeSocial"
                        value={formData.nomeSocial}
                        onChange={(e) => handleInputChange('nomeSocial', e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Preenchido automaticamente"
                      />
                    </div>
                  </div>

                                  {/* Campos de Endereço Separados */}
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-sm font-semibold text-[#0a2856]">
                      CEP * <span className="text-xs text-gray-500 font-normal">(preenchimento automático)</span>
                    </Label>
                    <div className="relative">
                    <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => handleInputChange('cep', formatCEP(e.target.value))}
                        onBlur={handleCEPBlur}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg pr-12"
                        placeholder="00000-000"
                        maxLength={9}
                        required
                      />
                      {isSearchingCEP && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-5 h-5 text-[#00d856] animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Digite o CEP e aguarde o preenchimento automático
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-2">
                      <Label htmlFor="logradouro" className="text-sm font-semibold text-[#0a2856]">
                        LOGRADOURO *
                      </Label>
                      <Input
                        id="logradouro"
                        value={formData.logradouro}
                        onChange={(e) => handleInputChange('logradouro', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Rua, Avenida, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numero" className="text-sm font-semibold text-[#0a2856]">
                        NÚMERO *
                      </Label>
                      <Input
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => handleInputChange('numero', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="complemento" className="text-sm font-semibold text-[#0a2856]">
                        COMPLEMENTO
                      </Label>
                      <Input
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Apto, Sala, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bairro" className="text-sm font-semibold text-[#0a2856]">
                        BAIRRO *
                      </Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                      placeholder="Preenchido automaticamente"
                      required
                    />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-sm font-semibold text-[#0a2856]">
                        CIDADE *
                      </Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="Preenchido automaticamente"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-sm font-semibold text-[#0a2856]">
                        ESTADO *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('estado', value)} value={formData.estado}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-[#00d856] rounded-lg">
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
                    <Label htmlFor="telefoneEmpresa" className="text-sm font-semibold text-[#0a2856] flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                      TELEFONE *
                      </Label>
                      <Input
                        id="telefoneEmpresa"
                        value={formData.telefoneEmpresa}
                        onChange={(e) => handleInputChange('telefoneEmpresa', formatPhone(e.target.value))}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    
                  <div className="space-y-2">
                    <Label htmlFor="emailEmpresa" className="text-sm font-semibold text-[#0a2856] flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                      E-MAIL *
                      </Label>
                      <Input
                        id="emailEmpresa"
                        type="email"
                        value={formData.emailEmpresa}
                        onChange={(e) => handleInputChange('emailEmpresa', e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="contato@empresa.com.br"
                        required
                      />
                    </div>
                  </div>

                {/* Upload Cartão CNPJ */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#0a2856] flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                    CARTÃO CNPJ *
                    </Label>
                    <div className="relative">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00d856]/10 rounded-xl mb-4">
                        <Upload className="w-6 h-6 text-[#00d856]" />
                          </div>
                      <h3 className="text-lg font-semibold text-[#0a2856] mb-2">Faça upload do Cartão CNPJ</h3>
                      <p className="text-gray-600 mb-2">Arraste o arquivo aqui ou clique para selecionar</p>
                      <p className="text-sm text-gray-500">PDF, JPG, PNG • Máx. 5MB</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="cartaoCnpj"
                        />
                        {formData.cartaoCnpj && (
                        <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">{formData.cartaoCnpj.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Resto das seções só aparecem depois de escolher o tipo de pessoa */}
          {formData.tipoPessoa && (
            <>
              {/* RESPONSÁVEL LEGAL */}
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.4s_forwards]">
              <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                  <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#0a2856] rounded-xl">
                    <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                        RESPONSÁVEL LEGAL
                      </CardTitle>
                        <CardDescription className="text-gray-600 -mt-1 leading-tight">
                          Informações da pessoa que irá assinar o contrato
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nomeResponsavel" className="text-sm font-semibold text-[#0a2856]">
                        NOME *
                        </Label>
                        <Input
                          id="nomeResponsavel"
                          value={formData.nomeResponsavel}
                          onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                          placeholder="Nome do responsável"
                          required
                        />
                      </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="sobrenomeResponsavel" className="text-sm font-semibold text-[#0a2856]">
                        SOBRENOME *
                        </Label>
                        <Input
                          id="sobrenomeResponsavel"
                          value={formData.sobrenomeResponsavel}
                          onChange={(e) => handleInputChange('sobrenomeResponsavel', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                          placeholder="Sobrenome do responsável"
                          required
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emailResponsavel" className="text-sm font-semibold text-[#0a2856]">
                          E-MAIL DO RESPONSÁVEL
                        </Label>
                        <Input
                          id="emailResponsavel"
                          type="email"
                          value={formData.emailResponsavel}
                          onChange={(e) => handleInputChange('emailResponsavel', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                          placeholder="responsavel@empresa.com.br"
                        />
                      </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="contatoResponsavel" className="text-sm font-semibold text-[#0a2856]">
                        TELEFONE DO RESPONSÁVEL *
                        </Label>
                        <Input
                          id="contatoResponsavel"
                          value={formData.contatoResponsavel}
                          onChange={(e) => handleInputChange('contatoResponsavel', formatPhone(e.target.value))}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                          placeholder="De preferência WhatsApp"
                          required
                        />
                      </div>
                    </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-[#0a2856]">É WHATSAPP?</Label>
                      <RadioGroup
                        value={formData.isWhatsApp}
                        onValueChange={(value) => handleInputChange('isWhatsApp', value)}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <RadioGroupItem value="sim" id="whatsapp-sim" className="text-[#00d856]" />
                        <Label htmlFor="whatsapp-sim" className="cursor-pointer text-[#0a2856] font-medium">SIM</Label>
                        </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <RadioGroupItem value="nao" id="whatsapp-nao" className="text-[#00d856]" />
                        <Label htmlFor="whatsapp-nao" className="cursor-pointer text-[#0a2856] font-medium">NÃO</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

              {/* RESPONSÁVEL PELO STAND */}
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.6s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0a2856] rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                          RESPONSÁVEL PELO STAND
                        </CardTitle>
                        <CardDescription className="text-gray-600 -mt-1 leading-tight">
                          Funcionário responsável pelas comunicações da FESPIN 2025
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nomeResponsavelStand" className="text-sm font-semibold text-[#0a2856]">
                        NOME *
                        </Label>
                        <Input
                          id="nomeResponsavelStand"
                          value={formData.nomeResponsavelStand}
                          onChange={(e) => handleInputChange('nomeResponsavelStand', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                          placeholder="Nome do responsável"
                          required
                        />
                      </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="sobrenomeResponsavelStand" className="text-sm font-semibold text-[#0a2856]">
                        SOBRENOME *
                        </Label>
                        <Input
                          id="sobrenomeResponsavelStand"
                          value={formData.sobrenomeResponsavelStand}
                          onChange={(e) => handleInputChange('sobrenomeResponsavelStand', e.target.value)}
                        className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                          placeholder="Sobrenome do responsável"
                          required
                        />
                      </div>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailResponsavelStand" className="text-sm font-semibold text-[#0a2856]">
                      E-MAIL *
                      </Label>
                      <Input
                        id="emailResponsavelStand"
                        type="email"
                        value={formData.emailResponsavelStand}
                        onChange={(e) => handleInputChange('emailResponsavelStand', e.target.value)}
                      className="h-12 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg"
                        placeholder="responsavel.stand@empresa.com.br"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

              {/* MAPA DO EVENTO */}
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.8s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0a2856] rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
              </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                        MAPA DO EVENTO
                      </CardTitle>
                      <CardDescription className="text-gray-600 -mt-1 leading-tight">
                        Visualize a localização dos stands antes de escolher
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="w-full">
                    <MapViewer 
                      mapImage="/mapa fespin.png"
                      title="Mapa da FESPIN 2025"
                      description="Clique e arraste para navegar pelo mapa do evento"
                      showDownloadButton={false}
                      showFullscreenButton={false}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SERVIÇOS E STAND */}
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0a2856] rounded-xl">
                      <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                          ESCOLHA SEU STAND
                        </CardTitle>
                        <CardDescription className="text-gray-600 -mt-1 leading-tight">
                          Selecione o estande ideal para sua empresa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-8">
                  
                  {/* Legenda das cores dos stands - MOVIDA PARA O TOPO */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="text-sm font-bold text-gray-800 mb-2">LEGENDA DOS STANDS</div>
                    <div className="text-xs text-gray-600 mb-4">
                      Cada cor indica o status atual do stand disponível para reserva.
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                                              <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 shadow-sm"></div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Disponível</div>
                            <div className="text-xs text-gray-600">Pode ser selecionado</div>
                          </div>
                        </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-sm"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">Pré-reservado</div>
                          <div className="text-xs text-gray-600">Indisponível temporariamente</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-500 shadow-sm"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">Ocupado</div>
                          <div className="text-xs text-gray-600">Stand já confirmado</div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-8">
                    {/* Seletor de Stand com bolinhas coloridas */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-[#0a2856]">
                          NÚMERO DO STAND *
                        </Label>
                        {!isLoadingStands && standsDisponiveis.length === 0 && (
                          <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            ⚠️ Execute o SQL no Supabase para ativar o sistema
                          </div>
                        )}
                      </div>
                      

                      
                                              {formData.numeroStand && (
                        <div className="bg-[#00d856]/10 border border-[#00d856]/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-[#00d856]"></div>
                            <span className="font-medium text-[#0a2856]">
                              Stand {formData.numeroStand} selecionado
                            </span>
                            <span className="text-gray-600">
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
                                <h4 className="text-sm font-semibold text-gray-700">
                                  ESTANDES {categoria.toUpperCase()} {stands[0]?.tamanho || '3X3M'}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  ({stands[0]?.preco || 'Preço não definido'})
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
                                            ? 'ring-2 ring-blue-400 scale-110 shadow-lg' 
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
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
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
                    <Label className="text-sm font-semibold text-[#0a2856]">DESEJA SER PATROCINADOR?</Label>
                     <RadioGroup
                       value={formData.desejaPatrocinio}
                       onValueChange={(value) => handleInputChange('desejaPatrocinio', value)}
                       className="flex space-x-6"
                     >
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <RadioGroupItem value="sim" id="patrocinio-sim" className="text-[#00d856]" />
                        <Label htmlFor="patrocinio-sim" className="cursor-pointer text-[#0a2856] font-medium">SIM</Label>
                       </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <RadioGroupItem value="nao" id="patrocinio-nao" className="text-[#00d856]" />
                        <Label htmlFor="patrocinio-nao" className="cursor-pointer text-[#0a2856] font-medium">NÃO</Label>
                       </div>
                     </RadioGroup>
                  </div>
                  
                  {formData.desejaPatrocinio === 'sim' && (
                    <div className="space-y-2">
                      <Label htmlFor="categoriaPatrocinio" className="text-sm font-semibold text-[#0a2856]">
                            CATEGORIA DE PATROCÍNIO
                          </Label>
                          <Select onValueChange={(value) => handleInputChange('categoriaPatrocinio', value)}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-[#00d856] rounded-lg">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronze">
                            <div className="flex items-center justify-between w-full">
                              <span>Bronze</span>
                              <span className="ml-4 text-[#00d856] font-semibold">R$ 5.000</span>
                        </div>
                          </SelectItem>
                          <SelectItem value="prata">
                            <div className="flex items-center justify-between w-full">
                              <span>Prata</span>
                              <span className="ml-4 text-[#00d856] font-semibold">R$ 10.000</span>
                    </div>
                          </SelectItem>
                          <SelectItem value="ouro">
                            <div className="flex items-center justify-between w-full">
                              <span>Ouro</span>
                              <span className="ml-4 text-[#00d856] font-semibold">R$ 12.000</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="telao_led">
                            <div className="flex items-center justify-between w-full">
                              <span>Telão de LED</span>
                              <span className="ml-4 text-[#00d856] font-semibold">R$ 500</span>
                          </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                        </div>
                  )}
                  </CardContent>
                </Card>

              {/* CONDIÇÕES E FORMAS DE PAGAMENTO */}
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2.2s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0a2856] rounded-xl">
                      <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                          CONDIÇÕES DE PAGAMENTO
                        </CardTitle>
                        <CardDescription className="text-gray-600 -mt-1 leading-tight">
                          Escolha a forma de pagamento que melhor se adequa à sua empresa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                <CardContent className="p-6 space-y-8">
                  {/* Condições de Pagamento */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-[#0a2856]">
                      CONDIÇÃO DE PAGAMENTO *
                    </Label>
                    <RadioGroup
                      value={formData.condicaoPagamento}
                      onValueChange={(value) => handleInputChange('condicaoPagamento', value)}
                      className="space-y-4"
                    >
                      {condicoesPagamento.map((condicao) => (
                        <div key={condicao.value} className="relative">
                          <input
                            type="radio"
                            id={condicao.value}
                            value={condicao.value}
                            name="condicaoPagamento"
                            className="sr-only peer"
                            onChange={(e) => handleInputChange('condicaoPagamento', e.target.value)}
                          />
                          <label
                            htmlFor={condicao.value}
                            className={`block p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 peer-checked:border-[#00d856] peer-checked:bg-[#00d856]/5 transition-all duration-300 ${condicao.highlight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gray-50'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-[#0a2856] font-bold text-lg mb-1">
                                  {condicao.label}
                                  {condicao.highlight && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                      DESCONTO
                                    </span>
                                  )}
                                </h3>
                                <p className="text-gray-600 text-sm">{condicao.description}</p>
                        </div>
                        </div>
                          </label>
                      </div>
                      ))}
                    </RadioGroup>
                    </div>

                  {/* Forma de Pagamento */}
                        <div className="space-y-4">
                    <Label className="text-sm font-semibold text-[#0a2856]">
                      FORMA DE PAGAMENTO *
                    </Label>
                          <RadioGroup
                      value={formData.formaPagamento}
                      onValueChange={(value) => handleInputChange('formaPagamento', value)}
                            className="flex space-x-6"
                          >
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value="pix" id="pagamento-pix" className="text-[#00d856]" />
                        <Label htmlFor="pagamento-pix" className="cursor-pointer text-[#0a2856] font-medium text-lg">PIX</Label>
                            </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value="boleto" id="pagamento-boleto" className="text-[#00d856]" />
                        <Label htmlFor="pagamento-boleto" className="cursor-pointer text-[#0a2856] font-medium text-lg">BOLETO</Label>
                            </div>
                          </RadioGroup>
                        </div>
                </CardContent>
              </Card>

              {/* INFORMAÇÕES ADICIONAIS */}
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_2.4s_forwards]">
                <CardHeader className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0a2856] rounded-xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#0a2856] mb-0 leading-tight">
                        INFORMAÇÕES ADICIONAIS
                      </CardTitle>
                      <CardDescription className="text-gray-600 -mt-1 leading-tight">
                        Conte-nos mais sobre sua empresa e objetivos no evento
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="observacoes" className="text-sm font-semibold text-[#0a2856]">
                      OBSERVAÇÕES E SOLICITAÇÕES ESPECIAIS
                        </Label>
                        <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      className="border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]/20 rounded-lg min-h-[120px]"
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
                className="bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00c851] hover:to-[#a0e620] text-white px-12 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[250px]"
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