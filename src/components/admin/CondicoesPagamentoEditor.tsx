import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, AlertCircle, DollarSign, Star, Edit3, PlusCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PaymentOption {
  id: string;
  label: string;
  description: string;
  value: string;
  highlight: boolean;
}

const CondicoesPagamentoEditor: React.FC = () => {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentOptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('payment_conditions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPaymentOptions(data || []);
    } catch (err: any) {
      setError('Falha ao carregar as condições de pagamento.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentOptions();
  }, [fetchPaymentOptions]);

  const handleAddNewOption = () => {
    const newOption: PaymentOption = {
      id: `new-${Date.now()}`,
      value: '',
      label: '',
      description: '',
      highlight: false,
    };
    setPaymentOptions([...paymentOptions, newOption]);
  };

  const handleValueChange = (id: string, field: keyof PaymentOption, value: string | boolean) => {
    setPaymentOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    const upsertData = paymentOptions.map(option => {
      const { id, ...data } = option;
      // Se for um item novo (nosso id temporário), não enviamos o campo 'id'
      // para que o Supabase gere um novo UUID.
      // Se for um item existente, incluímos o 'id' para que o upsert o atualize.
      if (id.startsWith('new-')) {
        return data;
      }
      return { id, ...data };
    });

    try {
      const { error } = await supabase.from('payment_conditions').upsert(upsertData);

      if (error) {
        throw error;
      }

      alert('Condições de pagamento salvas com sucesso!');
      // Recarregar os dados para obter os IDs corretos dos novos itens
      fetchPaymentOptions();
    } catch (error) {
      console.error('Erro ao salvar as condições de pagamento:', error);
      alert('Ocorreu um erro ao salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[#ff3c00]/5 via-black to-[#3d3d3d]/10 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff3c00] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <p className="text-gray-300 text-lg">Carregando condições de pagamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 bg-gradient-to-br from-[#ff3c00]/5 via-black to-[#3d3d3d]/10 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-xl max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <p className="font-bold text-red-300">Erro</p>
            </div>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Fundo com gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff3c00]/5 via-black to-[#3d3d3d]/10 pointer-events-none" />
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Header modernizado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff3c00]/20 to-[#3d3d3d]/20 rounded-full mb-6">
            <DollarSign className="w-4 h-4 text-[#ff3c00]" />
            <span className="text-sm font-semibold text-white">Condições de Pagamento</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            <span className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] bg-clip-text text-transparent">
              Editor de Pagamentos
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Configure as opções de pagamento disponíveis para os expositores
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleAddNewOption} 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-[#ff3c00]/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Condição
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] hover:from-[#ff3c00]/90 hover:to-[#ff8c00]/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {paymentOptions.map((option, index) => (
            <Card 
              key={option.id} 
              className={`bg-gray-900/50 border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 rounded-xl ${
                option.highlight 
                  ? 'border-[#ff3c00] shadow-lg shadow-[#ff3c00]/20' 
                  : 'border-gray-700 hover:border-[#ff3c00]/50'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    option.highlight 
                      ? 'bg-gradient-to-br from-[#ff3c00] to-[#ff8c00]' 
                      : 'bg-gray-700'
                  }`}>
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  Opção de Pagamento
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Label 
                    htmlFor={`highlight-switch-${option.id}`} 
                    className={`text-sm font-medium transition-colors ${
                      option.highlight ? 'text-[#ff3c00]' : 'text-gray-400'
                    }`}
                  >
                    Destaque
                  </Label>
                  <Switch
                    id={`highlight-${option.id}`}
                    checked={option.highlight}
                    onCheckedChange={(checked) => handleValueChange(option.id, 'highlight', checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-2 space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor={`value-${option.id}`} 
                    className="text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Identificador Único (value)
                  </Label>
                  <Input
                    id={`value-${option.id}`}
                    value={option.value}
                    onChange={(e) => handleValueChange(option.id, 'value', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#ff3c00]"
                    placeholder="ex: a_vista_10_desconto"
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor={`label-${option.id}`} 
                    className="text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Título da Opção
                  </Label>
                  <Input
                    id={`label-${option.id}`}
                    value={option.label}
                    onChange={(e) => handleValueChange(option.id, 'label', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#ff3c00]"
                    placeholder="Ex: À vista com 10% de desconto"
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor={`description-${option.id}`} 
                    className="text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Descrição Detalhada
                  </Label>
                  <Textarea
                    id={`description-${option.id}`}
                    value={option.description}
                    onChange={(e) => handleValueChange(option.id, 'description', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#ff3c00] min-h-[100px]"
                    placeholder="Descreva os detalhes desta condição de pagamento..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CondicoesPagamentoEditor;
