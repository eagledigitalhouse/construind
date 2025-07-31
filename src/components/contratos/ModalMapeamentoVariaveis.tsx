import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, User, Building2, Mail, Phone, MapPin, CheckCircle, AlertCircle, X, Hash, ArrowLeft } from 'lucide-react';
import { zapSignAPI, ZapSignTemplateDetails, ZapSignTemplateInput } from '@/lib/zapsign';
import { showToast } from '@/lib/toast';
import type { PreInscricaoExpositor } from '@/types/supabase';

interface ModalMapeamentoVariaveisProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mappedData: Record<string, string>) => void;
  templateId: string;
  templateName: string;
  preInscricao: PreInscricaoExpositor;
}

interface VariableMapping {
  variable: string;
  label: string;
  value: string;
  source: 'auto' | 'manual' | 'empty';
  required: boolean;
}

const ModalMapeamentoVariaveis: React.FC<ModalMapeamentoVariaveisProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateId,
  templateName,
  preInscricao
}) => {
  const [loading, setLoading] = useState(false);
  const [templateDetails, setTemplateDetails] = useState<ZapSignTemplateDetails | null>(null);
  const [variableMappings, setVariableMappings] = useState<VariableMapping[]>([]);
  const [generating, setGenerating] = useState(false);

  // Carregar detalhes do template quando o modal abrir
  useEffect(() => {
    if (isOpen && templateId) {
      loadTemplateDetails();
    }
  }, [isOpen, templateId]);

  const loadTemplateDetails = async () => {
    setLoading(true);
    try {
      const details = await zapSignAPI.getTemplateDetails(templateId);
      setTemplateDetails(details);
      
      // Criar mapeamentos iniciais
      const mappings = details.inputs.map(input => {
        const autoValue = getAutoMappedValue(input.variable);
        return {
          variable: input.variable,
          label: input.label || input.variable.replace(/[{}]/g, ''),
          value: autoValue,
          source: autoValue ? 'auto' as const : 'empty' as const,
          required: input.required
        };
      });
      
      setVariableMappings(mappings);
    } catch (error) {
      console.error('Erro ao carregar detalhes do template:', error);
      showToast.error('Erro ao carregar variáveis do template');
    } finally {
      setLoading(false);
    }
  };

  // Função para mapear automaticamente valores baseados no nome da variável
  const getAutoMappedValue = (variable: string): string => {
    const varName = variable.toLowerCase().replace(/[{}]/g, '');
    
    // Determinar dados baseados no tipo de pessoa
    const nomeCompleto = preInscricao.tipo_pessoa === 'fisica' 
      ? `${preInscricao.nome_pf || ''} ${preInscricao.sobrenome_pf || ''}`.trim()
      : preInscricao.razao_social || preInscricao.nome_social || '';
    
    const email = preInscricao.tipo_pessoa === 'fisica' 
      ? preInscricao.email_pf || preInscricao.email_responsavel || ''
      : preInscricao.email_empresa || preInscricao.email_responsavel || '';
    
    const telefone = preInscricao.tipo_pessoa === 'fisica' 
      ? preInscricao.telefone_pf || preInscricao.contato_responsavel || ''
      : preInscricao.telefone_empresa || preInscricao.contato_responsavel || '';
    
    const endereco = preInscricao.tipo_pessoa === 'fisica' 
      ? preInscricao.logradouro_pf || ''
      : preInscricao.logradouro || '';
    
    const cidade = preInscricao.tipo_pessoa === 'fisica' 
      ? preInscricao.cidade_pf || ''
      : preInscricao.cidade || '';
    
    const estado = preInscricao.tipo_pessoa === 'fisica' 
      ? preInscricao.estado_pf || ''
      : preInscricao.estado || '';
    
    const cep = preInscricao.tipo_pessoa === 'fisica' 
      ? preInscricao.cep_pf || ''
      : preInscricao.cep || '';

    // Dados formatados para datas
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR');
    const dataExtenso = hoje.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Mapeamento automático baseado em palavras-chave
    const mappings: Record<string, string> = {
      // Nomes
      'nome': nomeCompleto,
      'nome_completo': nomeCompleto,
      'fullname': nomeCompleto,
      'nome_contratante': nomeCompleto,
      'contratante': nomeCompleto,
      'razao_social': preInscricao.razao_social || '',
      'nome_social': preInscricao.nome_social || '',
      'nome_fantasia': preInscricao.nome_social || '',
      'nome_empresa': preInscricao.nome_social || preInscricao.razao_social || '',
      
      // Documentos
      'cpf': preInscricao.cpf || '',
      'cnpj': preInscricao.cnpj || '',
      'cpf_cnpj': preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.cpf || '') : (preInscricao.cnpj || ''),
      'documento': preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.cpf || '') : (preInscricao.cnpj || ''),
      'documento_cessionaria': preInscricao.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ',
      'numero_documento_cessionaria': preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.cpf || '') : (preInscricao.cnpj || ''),
      'tipo_documento': preInscricao.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ',
      
      // Contato
      'email': email,
      'email_empresa': preInscricao.email_empresa || '',
      'telefone': telefone,
      'telefone_empresa': preInscricao.telefone_empresa || '',
      'celular': telefone,
      'phone': telefone,
      'whatsapp': preInscricao.is_whatsapp === 'sim' ? 'Sim' : 'Não',
      
      // Endereço
      'endereco': endereco,
      'logradouro': endereco,
      'numero': preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.numero_pf || '') : (preInscricao.numero || ''),
      'complemento': preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.complemento_pf || '') : (preInscricao.complemento || ''),
      'bairro': preInscricao.tipo_pessoa === 'fisica' ? (preInscricao.bairro_pf || '') : (preInscricao.bairro || ''),
      'cidade': cidade,
      'estado': estado,
      'cep': cep,
      'endereco_completo': `${endereco}, ${cidade} - ${estado}, CEP: ${cep}`,
      
      // Responsável legal
      'nome_responsavel': preInscricao.nome_responsavel || '',
      'sobrenome_responsavel': preInscricao.sobrenome_responsavel || '',
      'responsavel_nome_completo': `${preInscricao.nome_responsavel || ''} ${preInscricao.sobrenome_responsavel || ''}`.trim(),
      'responsavel': `${preInscricao.nome_responsavel || ''} ${preInscricao.sobrenome_responsavel || ''}`.trim(),
      'responsavel_email': preInscricao.email_responsavel || '',
      'responsavel_contato': preInscricao.contato_responsavel || '',
      'responsavel_telefone': preInscricao.contato_responsavel || '',
      
      // Responsável pelo stand
      'stand_responsavel_nome': preInscricao.nome_responsavel_stand || '',
      'stand_responsavel_sobrenome': preInscricao.sobrenome_responsavel_stand || '',
      'stand_responsavel_nome_completo': `${preInscricao.nome_responsavel_stand || ''} ${preInscricao.sobrenome_responsavel_stand || ''}`.trim(),
      'stand_responsavel_email': preInscricao.email_responsavel_stand || '',
      
      // Informações do stand e serviços
      'numero_stand': preInscricao.numero_stand || '',
      'stand': preInscricao.numero_stand || '',
      'deseja_patrocinio': preInscricao.deseja_patrocinio === 'sim' ? 'Sim' : 'Não',
      'categoria_patrocinio': preInscricao.categoria_patrocinio || '',
      'condicao_pagamento': preInscricao.condicao_pagamento || '',
      'forma_pagamento': preInscricao.forma_pagamento || '',
      
      // Datas
      'data_atual': dataFormatada,
      'data_contrato': dataFormatada,
      'data_hoje': dataFormatada,
      'data_extenso': dataExtenso,
      'ano': hoje.getFullYear().toString(),
      'mes': (hoje.getMonth() + 1).toString().padStart(2, '0'),
      'dia': hoje.getDate().toString().padStart(2, '0'),
      
      // Informações do evento
      'evento_nome': 'FESPIN',
      'evento_ano': hoje.getFullYear().toString(),
      'evento_local': 'Centro de Convenções',
      
      // Status e observações
      'status': preInscricao.status || 'pendente',
      'tipo_pessoa': preInscricao.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
      'observacoes': preInscricao.observacoes || ''
    };

    // Buscar por correspondências parciais
    for (const [key, value] of Object.entries(mappings)) {
      if (varName.includes(key) || key.includes(varName)) {
        return value;
      }
    }

    return '';
  };

  // Atualizar valor de uma variável
  const updateVariableValue = (variable: string, value: string) => {
    setVariableMappings(prev => prev.map(mapping => 
      mapping.variable === variable 
        ? { ...mapping, value, source: value ? 'manual' as const : 'empty' as const }
        : mapping
    ));
  };

  // Mapear variável para campo da pré-inscrição
  const mapToPreInscricaoField = (variable: string, fieldPath: string) => {
    const value = getFieldValue(fieldPath);
    setVariableMappings(prev => prev.map(mapping => 
      mapping.variable === variable 
        ? { ...mapping, value, source: 'auto' as const }
        : mapping
    ));
  };

  // Obter valor de um campo da pré-inscrição
  const getFieldValue = (fieldPath: string): string => {
    const keys = fieldPath.split('.');
    let value: any = preInscricao;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value?.toString() || '';
  };

  // Confirmar mapeamento e gerar contrato
  const handleConfirm = async () => {
    // Verificar se todas as variáveis obrigatórias foram preenchidas
    const missingRequired = variableMappings.filter(mapping => mapping.required && !mapping.value);
    
    if (missingRequired.length > 0) {
      showToast.error(`Preencha as variáveis obrigatórias: ${missingRequired.map(m => m.label).join(', ')}`);
      return;
    }

    setGenerating(true);
    try {
      // Criar objeto com os dados mapeados
      const mappedData: Record<string, string> = {};
      variableMappings.forEach(mapping => {
        mappedData[mapping.variable] = mapping.value;
      });

      await onConfirm(mappedData);
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Opções de campos da pré-inscrição para mapeamento
  const preInscricaoFields = [
    // Dados Pessoa Física
    { label: 'Nome (PF)', value: 'nome_pf', icon: User },
    { label: 'Sobrenome (PF)', value: 'sobrenome_pf', icon: User },
    { label: 'CPF', value: 'cpf', icon: Hash },
    { label: 'Email (PF)', value: 'email_pf', icon: Mail },
    { label: 'Telefone (PF)', value: 'telefone_pf', icon: Phone },
    { label: 'Logradouro (PF)', value: 'logradouro_pf', icon: MapPin },
    { label: 'Número (PF)', value: 'numero_pf', icon: MapPin },
    { label: 'Complemento (PF)', value: 'complemento_pf', icon: MapPin },
    { label: 'Bairro (PF)', value: 'bairro_pf', icon: MapPin },
    { label: 'Cidade (PF)', value: 'cidade_pf', icon: MapPin },
    { label: 'Estado (PF)', value: 'estado_pf', icon: MapPin },
    { label: 'CEP (PF)', value: 'cep_pf', icon: MapPin },
    
    // Dados Pessoa Jurídica
    { label: 'Razão Social', value: 'razao_social', icon: Building2 },
    { label: 'Nome Social', value: 'nome_social', icon: Building2 },
    { label: 'CNPJ', value: 'cnpj', icon: Hash },
    { label: 'Email Empresa', value: 'email_empresa', icon: Mail },
    { label: 'Telefone Empresa', value: 'telefone_empresa', icon: Phone },
    { label: 'Logradouro', value: 'logradouro', icon: MapPin },
    { label: 'Número', value: 'numero', icon: MapPin },
    { label: 'Complemento', value: 'complemento', icon: MapPin },
    { label: 'Bairro', value: 'bairro', icon: MapPin },
    { label: 'Cidade', value: 'cidade', icon: MapPin },
    { label: 'Estado', value: 'estado', icon: MapPin },
    { label: 'CEP', value: 'cep', icon: MapPin },
    
    // Responsável Legal
    { label: 'Nome Responsável', value: 'nome_responsavel', icon: User },
    { label: 'Sobrenome Responsável', value: 'sobrenome_responsavel', icon: User },
    { label: 'Email Responsável', value: 'email_responsavel', icon: Mail },
    { label: 'Contato Responsável', value: 'contato_responsavel', icon: Phone },
    { label: 'É WhatsApp?', value: 'is_whatsapp', icon: Phone },
    
    // Responsável pelo Stand
    { label: 'Nome Responsável Stand', value: 'nome_responsavel_stand', icon: User },
    { label: 'Sobrenome Responsável Stand', value: 'sobrenome_responsavel_stand', icon: User },
    { label: 'Email Responsável Stand', value: 'email_responsavel_stand', icon: Mail },
    
    // Informações do Stand
    { label: 'Número do Stand', value: 'numero_stand', icon: Building2 },
    { label: 'Deseja Patrocínio?', value: 'deseja_patrocinio', icon: FileText },
    { label: 'Categoria Patrocínio', value: 'categoria_patrocinio', icon: FileText },
    { label: 'Condição Pagamento', value: 'condicao_pagamento', icon: FileText },
    { label: 'Forma Pagamento', value: 'forma_pagamento', icon: FileText },
    
    // Outros
    { label: 'Tipo Pessoa', value: 'tipo_pessoa', icon: User },
    { label: 'Status', value: 'status', icon: FileText },
    { label: 'Observações', value: 'observacoes', icon: FileText },
  ];

  const getVariableIcon = (variable: string) => {
    const varName = variable.toLowerCase();
    if (varName.includes('nome') || varName.includes('name')) return User;
    if (varName.includes('email') || varName.includes('mail')) return Mail;
    if (varName.includes('telefone') || varName.includes('phone') || varName.includes('celular')) return Phone;
    if (varName.includes('endereco') || varName.includes('cidade') || varName.includes('cep')) return MapPin;
    if (varName.includes('cpf') || varName.includes('cnpj') || varName.includes('documento')) return Hash;
    if (varName.includes('empresa') || varName.includes('razao')) return Building2;
    if (varName.includes('data') || varName.includes('date')) return FileText;
    return FileText;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mapear Variáveis do Contrato
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Template: <strong>{templateName}</strong>
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando variáveis do template...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Como funciona:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Verde:</strong> Variáveis preenchidas automaticamente</li>
                <li>• <strong>Amarelo:</strong> Variáveis preenchidas manualmente</li>
                <li>• <strong>Vermelho:</strong> Variáveis obrigatórias não preenchidas</li>
                <li>• Você pode editar qualquer valor ou mapear para outros campos da pré-inscrição</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {variableMappings.map((mapping, index) => {
                const Icon = getVariableIcon(mapping.variable);
                const isEmpty = !mapping.value;
                const isRequired = mapping.required;
                
                return (
                  <Card key={mapping.variable} className={`${
                    isEmpty && isRequired ? 'border-red-200 bg-red-50' :
                    mapping.source === 'auto' ? 'border-green-200 bg-green-50' :
                    mapping.source === 'manual' ? 'border-yellow-200 bg-yellow-50' :
                    'border-gray-200'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {mapping.label}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Obrigatório
                            </Badge>
                          )}
                          {mapping.source === 'auto' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {isEmpty && isRequired && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-mono">
                        {mapping.variable}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor={`var-${index}`} className="text-sm font-medium">
                          Valor
                        </Label>
                        <Input
                          id={`var-${index}`}
                          value={mapping.value}
                          onChange={(e) => updateVariableValue(mapping.variable, e.target.value)}
                          placeholder="Digite o valor ou selecione um campo abaixo"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">
                          Ou mapear para campo da pré-inscrição:
                        </Label>
                        <Select onValueChange={(value) => mapToPreInscricaoField(mapping.variable, value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecionar campo" />
                          </SelectTrigger>
                          <SelectContent>
                            {preInscricaoFields.map((field) => {
                              const FieldIcon = field.icon;
                              const fieldValue = getFieldValue(field.value);
                              const hasValue = fieldValue && fieldValue.trim() !== '';
                              
                              return (
                                <SelectItem key={field.value} value={field.value} disabled={!hasValue}>
                                  <div className="flex items-center gap-2 w-full">
                                    <FieldIcon className={`h-4 w-4 ${hasValue ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span className={hasValue ? 'text-gray-900' : 'text-gray-400'}>
                                      {field.label}
                                    </span>
                                    {hasValue && (
                                      <span className="text-xs text-gray-500 ml-auto max-w-32 truncate">
                                        ({fieldValue.substring(0, 20)}{fieldValue.length > 20 ? '...' : ''})
                                      </span>
                                    )}
                                    {!hasValue && (
                                      <span className="text-xs text-gray-400 ml-auto">
                                        (vazio)
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={onClose} disabled={generating}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleConfirm} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Gerando Contrato...
                  </>
                ) : (
                  'Gerar Contrato'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalMapeamentoVariaveis;