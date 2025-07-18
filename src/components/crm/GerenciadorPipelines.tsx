import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown,
  Settings,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { useCRM, type PipelineFormulario, type EtapaPipeline, type TipoFormulario } from '@/hooks/useCRM';

interface GerenciadorPipelinesProps {
  onClose?: () => void;
}

const GerenciadorPipelines: React.FC<GerenciadorPipelinesProps> = ({ onClose }) => {
  const {
    pipelines,
    etapas,
    tiposFormulario,
    fetchPipelines,
    fetchEtapas,
    fetchTiposFormulario,
    criarPipeline,
    atualizarPipeline,
    criarEtapa,
    atualizarEtapa,
    reordenarEtapas
  } = useCRM();

  const [pipelineSelecionado, setPipelineSelecionado] = useState<PipelineFormulario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEtapaAberto, setModalEtapaAberto] = useState(false);
  const [editandoPipeline, setEditandoPipeline] = useState(false);
  const [editandoEtapa, setEditandoEtapa] = useState<EtapaPipeline | null>(null);

  // Estados para formulários
  const [formPipeline, setFormPipeline] = useState({
    nome: '',
    descricao: '',
    tipo_formulario_id: ''
  });

  const [formEtapa, setFormEtapa] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6',
    ordem: 1
  });

  useEffect(() => {
    fetchPipelines();
    fetchEtapas();
    fetchTiposFormulario();
  }, []);

  // Obter etapas de um pipeline específico
  const obterEtapasPipeline = (pipelineId: string) => {
    return etapas
      .filter(etapa => etapa.pipeline_id === pipelineId)
      .sort((a, b) => a.ordem - b.ordem);
  };

  // Abrir modal para criar/editar pipeline
  const abrirModalPipeline = (pipeline?: PipelineFormulario) => {
    if (pipeline) {
      setFormPipeline({
        nome: pipeline.nome,
        descricao: pipeline.descricao || '',
        tipo_formulario_id: pipeline.tipo_formulario_id
      });
      setEditandoPipeline(true);
      setPipelineSelecionado(pipeline);
    } else {
      setFormPipeline({
        nome: '',
        descricao: '',
        tipo_formulario_id: ''
      });
      setEditandoPipeline(false);
      setPipelineSelecionado(null);
    }
    setModalAberto(true);
  };

  // Abrir modal para criar/editar etapa
  const abrirModalEtapa = (etapa?: EtapaPipeline) => {
    if (!pipelineSelecionado) {
      toast.error('Selecione um pipeline primeiro');
      return;
    }

    if (etapa) {
      setFormEtapa({
        nome: etapa.nome,
        descricao: etapa.descricao || '',
        cor: etapa.cor,
        ordem: etapa.ordem
      });
      setEditandoEtapa(etapa);
    } else {
      const etapasPipeline = obterEtapasPipeline(pipelineSelecionado.id);
      setFormEtapa({
        nome: '',
        descricao: '',
        cor: '#3B82F6',
        ordem: etapasPipeline.length + 1
      });
      setEditandoEtapa(null);
    }
    setModalEtapaAberto(true);
  };

  // Salvar pipeline
  const salvarPipeline = async () => {
    try {
      if (editandoPipeline && pipelineSelecionado) {
        await atualizarPipeline(pipelineSelecionado.id, formPipeline);
        toast.success('Pipeline atualizado!');
      } else {
        await criarPipeline(formPipeline);
        toast.success('Pipeline criado!');
      }
      setModalAberto(false);
      fetchPipelines();
    } catch (error) {
      toast.error('Erro ao salvar pipeline');
    }
  };

  // Salvar etapa
  const salvarEtapa = async () => {
    try {
      if (!pipelineSelecionado) return;
      
      if (editandoEtapa) {
        await atualizarEtapa(editandoEtapa.id, formEtapa);
        toast.success('Etapa atualizada!');
      } else {
        await criarEtapa({
          ...formEtapa,
          pipeline_id: pipelineSelecionado.id
        });
        toast.success('Etapa criada!');
      }
      setModalEtapaAberto(false);
      fetchEtapas();
    } catch (error) {
      toast.error('Erro ao salvar etapa');
    }
  };

  // Mover etapa para cima/baixo
  const moverEtapa = async (etapa: EtapaPipeline, direcao: 'up' | 'down') => {
    try {
      if (!pipelineSelecionado) return;
      
      const etapasPipeline = obterEtapasPipeline(pipelineSelecionado.id);
      const indiceAtual = etapasPipeline.findIndex(e => e.id === etapa.id);
      
      if (direcao === 'up' && indiceAtual === 0) return;
      if (direcao === 'down' && indiceAtual === etapasPipeline.length - 1) return;
      
      const novaOrdem = direcao === 'up' ? etapa.ordem - 1 : etapa.ordem + 1;
      
      await reordenarEtapas(pipelineSelecionado.id, etapa.id, novaOrdem);
    } catch (error) {
      toast.error('Erro ao reordenar etapa');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Gerenciar Pipelines</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => abrirModalPipeline()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Pipeline
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna de Pipelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Pipelines por Formulário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelines.map((pipeline) => {
              const tipoFormulario = tiposFormulario.find(t => t.id === pipeline.tipo_formulario_id);
              const etapasPipeline = obterEtapasPipeline(pipeline.id);
              
              return (
                <div 
                  key={pipeline.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    pipelineSelecionado?.id === pipeline.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPipelineSelecionado(pipeline)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{pipeline.nome}</h3>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalPipeline(pipeline);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary">
                      {tipoFormulario?.nome || 'Tipo não encontrado'}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {etapasPipeline.length} etapas configuradas
                    </p>
                    {pipeline.descricao && (
                      <p className="text-sm text-gray-500">{pipeline.descricao}</p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {pipelines.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Workflow className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pipeline configurado</p>
                <p className="text-sm">Crie um pipeline para começar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coluna de Etapas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="w-5 h-5" />
              Etapas do Pipeline
              {pipelineSelecionado && (
                <Badge variant="outline">{pipelineSelecionado.nome}</Badge>
              )}
            </CardTitle>
            {pipelineSelecionado && (
              <Button 
                size="sm" 
                onClick={() => abrirModalEtapa()}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Etapa
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {pipelineSelecionado ? (
              <div className="space-y-3">
                {obterEtapasPipeline(pipelineSelecionado.id).map((etapa, index) => (
                  <div 
                    key={etapa.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: etapa.cor }}
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{etapa.nome}</h4>
                      {etapa.descricao && (
                        <p className="text-sm text-gray-600">{etapa.descricao}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => moverEtapa(etapa, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => moverEtapa(etapa, 'down')}
                        disabled={index === obterEtapasPipeline(pipelineSelecionado.id).length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => abrirModalEtapa(etapa)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {obterEtapasPipeline(pipelineSelecionado.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ArrowUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma etapa configurada</p>
                    <p className="text-sm">Adicione etapas ao pipeline</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um pipeline</p>
                <p className="text-sm">Escolha um pipeline para ver suas etapas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Pipeline */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editandoPipeline ? 'Editar Pipeline' : 'Novo Pipeline'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Pipeline</Label>
              <Input
                id="nome"
                value={formPipeline.nome}
                onChange={(e) => setFormPipeline(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Pipeline Expositores"
              />
            </div>
            
            <div>
              <Label htmlFor="tipo_formulario">Tipo de Formulário</Label>
              <Select 
                value={formPipeline.tipo_formulario_id} 
                onValueChange={(value) => setFormPipeline(prev => ({ ...prev, tipo_formulario_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de formulário" />
                </SelectTrigger>
                <SelectContent>
                  {tiposFormulario.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formPipeline.descricao}
                onChange={(e) => setFormPipeline(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o objetivo deste pipeline..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={salvarPipeline} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {editandoPipeline ? 'Atualizar' : 'Criar'}
              </Button>
              <Button variant="outline" onClick={() => setModalAberto(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Etapa */}
      <Dialog open={modalEtapaAberto} onOpenChange={setModalEtapaAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editandoEtapa ? 'Editar Etapa' : 'Nova Etapa'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome_etapa">Nome da Etapa</Label>
              <Input
                id="nome_etapa"
                value={formEtapa.nome}
                onChange={(e) => setFormEtapa(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Qualificação"
              />
            </div>
            
            <div>
              <Label htmlFor="descricao_etapa">Descrição</Label>
              <Textarea
                id="descricao_etapa"
                value={formEtapa.descricao}
                onChange={(e) => setFormEtapa(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva esta etapa do processo..."
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  type="color"
                  value={formEtapa.cor}
                  onChange={(e) => setFormEtapa(prev => ({ ...prev, cor: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  min="1"
                  value={formEtapa.ordem}
                  onChange={(e) => setFormEtapa(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={salvarEtapa} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {editandoEtapa ? 'Atualizar' : 'Criar'}
              </Button>
              <Button variant="outline" onClick={() => setModalEtapaAberto(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciadorPipelines;