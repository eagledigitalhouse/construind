import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Calendar, CheckCircle } from 'lucide-react';
import { zapSignAPI, ZapSignTemplate } from '@/lib/zapsign';
import { showToast } from '@/lib/toast';
import ModalMapeamentoVariaveis from './ModalMapeamentoVariaveis';
import type { PreInscricaoExpositor } from '@/types/supabase';

interface ModalSelecaoModeloZapSignProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string, templateName: string, mappedData?: Record<string, string>) => void;
  preInscricaoId: string;
  preInscricao: PreInscricaoExpositor;
}

const ModalSelecaoModeloZapSign: React.FC<ModalSelecaoModeloZapSignProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  preInscricaoId,
  preInscricao
}) => {
  const [templates, setTemplates] = useState<ZapSignTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);

  // Carregar modelos do ZapSign quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    console.log('Iniciando carregamento de templates ZapSign');
    setLoading(true);
    try {
      console.log('Chamando API ZapSign para listar templates...');
      const zapSignTemplates = await zapSignAPI.listTemplates();
      console.log('Templates recebidos:', zapSignTemplates);
      setTemplates(zapSignTemplates);
    } catch (error) {
      console.error('Erro ao carregar modelos ZapSign:', error);
      showToast.error('Erro ao carregar modelos do ZapSign. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
      console.log('Carregamento de templates finalizado');
    }
  };

  const handleSelectTemplate = () => {
    if (!selectedTemplateId) {
      showToast.error('Selecione um modelo');
      return;
    }

    console.log('ModalSelecaoModeloZapSign: selectedTemplateId:', selectedTemplateId);
    console.log('ModalSelecaoModeloZapSign: templates disponíveis:', templates);
    
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    if (!selectedTemplate) {
      console.error('Modelo não encontrado com ID:', selectedTemplateId);
      showToast.error('Modelo não encontrado');
      return;
    }

    console.log('ModalSelecaoModeloZapSign: Template selecionado:', selectedTemplate);
    
    // Armazenar o nome do template e abrir modal de mapeamento
    setSelectedTemplateName(selectedTemplate.name);
    setShowMappingModal(true);
  };

  // Função chamada quando o mapeamento é confirmado
  const handleMappingConfirm = async (mappedData: Record<string, string>) => {
    setGenerating(true);
    try {
      console.log('ModalSelecaoModeloZapSign: Chamando onSelectTemplate com dados mapeados:', mappedData);
      await onSelectTemplate(selectedTemplateId, selectedTemplateName, mappedData);
      
      // Fechar ambos os modais
      setShowMappingModal(false);
      handleClose();
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Função para fechar o modal de mapeamento
  const handleMappingClose = () => {
    setShowMappingModal(false);
  };

  const handleClose = () => {
    if (!generating) {
      setSelectedTemplateId('');
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Selecionar Modelo ZapSign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando modelos do ZapSign...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum modelo encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Não foram encontrados modelos ativos no ZapSign.
              </p>
              <Button onClick={loadTemplates} variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Selecione um modelo do ZapSign para gerar o contrato.
                  Os dados da pré-inscrição serão automaticamente preenchidos no modelo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplateId === template.id
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-medium">
                          {template.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {selectedTemplateId === template.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                          <Badge
                            variant={template.status === 'active' ? 'default' : 'secondary'}
                          >
                            {template.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>Tipo: {template.type.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Criado em: {formatDate(template.created_at)}</span>
                        </div>
                        {template.updated_at !== template.created_at && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Atualizado em: {formatDate(template.updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={generating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSelectTemplate}
                  disabled={!selectedTemplateId || generating}
                >
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Modal de Mapeamento de Variáveis */}
    <ModalMapeamentoVariaveis
      isOpen={showMappingModal}
      onClose={handleMappingClose}
      onConfirm={handleMappingConfirm}
      templateId={selectedTemplateId}
      templateName={selectedTemplateName}
      preInscricao={preInscricao}
    />
  </>
  );
};

export default ModalSelecaoModeloZapSign;