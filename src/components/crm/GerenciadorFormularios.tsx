import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Settings, 
  Eye,
  EyeOff,
  Copy,
  FileText,
  Code,
  Palette
} from 'lucide-react';
import { type TipoFormulario } from '@/hooks/useCRM';
import { toast } from 'sonner';

interface CampoFormulario {
  id: string;
  nome: string;
  label: string;
  tipo: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  obrigatorio: boolean;
  placeholder?: string;
  opcoes?: string[]; // Para select, checkbox, radio
  validacao?: string; // Regex para validação
  ordem: number;
}

interface ConfiguracaoFormulario {
  titulo: string;
  descricao: string;
  mensagemSucesso: string;
  redirecionarApos: string;
  estiloPersonalizado?: string;
  campos: CampoFormulario[];
}

interface GerenciadorFormulariosProps {
  tiposFormulario: TipoFormulario[];
  onCriarTipo: (dados: Omit<TipoFormulario, 'id' | 'created_at'>) => Promise<void>;
  onAtualizarTipo: (id: string, dados: Partial<TipoFormulario>) => Promise<void>;
  onDeletarTipo: (id: string) => Promise<void>;
}

const GerenciadorFormularios: React.FC<GerenciadorFormulariosProps> = ({
  tiposFormulario,
  onCriarTipo,
  onAtualizarTipo,
  onDeletarTipo
}) => {
  const [formularioSelecionado, setFormularioSelecionado] = useState<TipoFormulario | null>(null);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoFormulario>({
    titulo: '',
    descricao: '',
    mensagemSucesso: 'Obrigado! Sua mensagem foi enviada com sucesso.',
    redirecionarApos: '',
    campos: []
  });
  const [editandoCampo, setEditandoCampo] = useState<CampoFormulario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCampoAberto, setModalCampoAberto] = useState(false);
  const [previewAberto, setPreviewAberto] = useState(false);

  const tiposCampo = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Telefone' },
    { value: 'textarea', label: 'Área de Texto' },
    { value: 'select', label: 'Lista Suspensa' },
    { value: 'checkbox', label: 'Caixa de Seleção' },
    { value: 'radio', label: 'Botão de Opção' }
  ];

  const iniciarEdicao = (formulario?: TipoFormulario) => {
    if (formulario) {
      setFormularioSelecionado(formulario);
      // Tentar parsear a configuração do campo configuracao
      try {
        const config = formulario.configuracao ? JSON.parse(formulario.configuracao) : {};
        setConfiguracao({
          titulo: formulario.nome,
          descricao: formulario.descricao || '',
          mensagemSucesso: config.mensagemSucesso || 'Obrigado! Sua mensagem foi enviada com sucesso.',
          redirecionarApos: config.redirecionarApos || '',
          estiloPersonalizado: config.estiloPersonalizado || '',
          campos: config.campos || []
        });
      } catch {
        setConfiguracao({
          titulo: formulario.nome,
          descricao: formulario.descricao || '',
          mensagemSucesso: 'Obrigado! Sua mensagem foi enviada com sucesso.',
          redirecionarApos: '',
          campos: []
        });
      }
    } else {
      setFormularioSelecionado(null);
      setConfiguracao({
        titulo: '',
        descricao: '',
        mensagemSucesso: 'Obrigado! Sua mensagem foi enviada com sucesso.',
        redirecionarApos: '',
        campos: []
      });
    }
    setModalAberto(true);
  };

  const adicionarCampo = () => {
    setEditandoCampo({
      id: Date.now().toString(),
      nome: '',
      label: '',
      tipo: 'text',
      obrigatorio: false,
      placeholder: '',
      ordem: configuracao.campos.length + 1
    });
    setModalCampoAberto(true);
  };

  const editarCampo = (campo: CampoFormulario) => {
    setEditandoCampo({ ...campo });
    setModalCampoAberto(true);
  };

  const salvarCampo = () => {
    if (!editandoCampo) return;

    if (!editandoCampo.nome || !editandoCampo.label) {
      toast.error('Nome e label são obrigatórios');
      return;
    }

    const camposAtualizados = configuracao.campos.filter(c => c.id !== editandoCampo.id);
    camposAtualizados.push(editandoCampo);
    camposAtualizados.sort((a, b) => a.ordem - b.ordem);

    setConfiguracao(prev => ({ ...prev, campos: camposAtualizados }));
    setModalCampoAberto(false);
    setEditandoCampo(null);
  };

  const removerCampo = (campoId: string) => {
    setConfiguracao(prev => ({
      ...prev,
      campos: prev.campos.filter(c => c.id !== campoId)
    }));
  };

  const salvarFormulario = async () => {
    if (!configuracao.titulo) {
      toast.error('Título é obrigatório');
      return;
    }

    try {
      const dadosFormulario = {
        nome: configuracao.titulo,
        descricao: configuracao.descricao,
        ativo: true,
        configuracao: JSON.stringify({
          mensagemSucesso: configuracao.mensagemSucesso,
          redirecionarApos: configuracao.redirecionarApos,
          estiloPersonalizado: configuracao.estiloPersonalizado,
          campos: configuracao.campos
        })
      };

      if (formularioSelecionado) {
        await onAtualizarTipo(formularioSelecionado.id, dadosFormulario);
        toast.success('Formulário atualizado com sucesso!');
      } else {
        await onCriarTipo(dadosFormulario);
        toast.success('Formulário criado com sucesso!');
      }

      setModalAberto(false);
    } catch (error) {
      toast.error('Erro ao salvar formulário');
    }
  };

  const gerarCodigoHTML = () => {
    const codigo = `
<!-- Formulário ${configuracao.titulo} -->
<form id="formulario-${configuracao.titulo.toLowerCase().replace(/\s+/g, '-')}" class="formulario-contato">
  <h2>${configuracao.titulo}</h2>
  ${configuracao.descricao ? `<p>${configuracao.descricao}</p>` : ''}
  
${configuracao.campos.map(campo => {
  switch (campo.tipo) {
    case 'textarea':
      return `  <div class="campo">
    <label for="${campo.nome}">${campo.label}${campo.obrigatorio ? ' *' : ''}</label>
    <textarea id="${campo.nome}" name="${campo.nome}"${campo.obrigatorio ? ' required' : ''}${campo.placeholder ? ` placeholder="${campo.placeholder}"` : ''}></textarea>
  </div>`;
    case 'select':
      return `  <div class="campo">
    <label for="${campo.nome}">${campo.label}${campo.obrigatorio ? ' *' : ''}</label>
    <select id="${campo.nome}" name="${campo.nome}"${campo.obrigatorio ? ' required' : ''}>
      <option value="">Selecione...</option>
${(campo.opcoes || []).map(opcao => `      <option value="${opcao}">${opcao}</option>`).join('\n')}
    </select>
  </div>`;
    default:
      return `  <div class="campo">
    <label for="${campo.nome}">${campo.label}${campo.obrigatorio ? ' *' : ''}</label>
    <input type="${campo.tipo}" id="${campo.nome}" name="${campo.nome}"${campo.obrigatorio ? ' required' : ''}${campo.placeholder ? ` placeholder="${campo.placeholder}"` : ''} />
  </div>`;
  }
}).join('\n\n')}
  
  <button type="submit">Enviar</button>
</form>

<style>
.formulario-contato {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.campo {
  margin-bottom: 15px;
}

.campo label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.campo input,
.campo textarea,
.campo select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.campo textarea {
  height: 100px;
  resize: vertical;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
${configuracao.estiloPersonalizado || ''}
</style>`;

    return codigo;
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(gerarCodigoHTML());
    toast.success('Código copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      {/* Lista de Formulários */}
      <div className="grid gap-4">
        {tiposFormulario.map((tipo) => (
          <Card key={tipo.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{tipo.nome}</h3>
                    <Badge variant={tipo.ativo ? 'default' : 'secondary'}>
                      {tipo.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  {tipo.descricao && (
                    <p className="text-sm text-gray-600 mb-2">{tipo.descricao}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(tipo.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormularioSelecionado(tipo);
                      try {
                        const config = tipo.configuracao ? JSON.parse(tipo.configuracao) : {};
                        setConfiguracao({
                          titulo: tipo.nome,
                          descricao: tipo.descricao || '',
                          mensagemSucesso: config.mensagemSucesso || 'Obrigado!',
                          redirecionarApos: config.redirecionarApos || '',
                          estiloPersonalizado: config.estiloPersonalizado || '',
                          campos: config.campos || []
                        });
                      } catch {
                        setConfiguracao({
                          titulo: tipo.nome,
                          descricao: tipo.descricao || '',
                          mensagemSucesso: 'Obrigado!',
                          redirecionarApos: '',
                          campos: []
                        });
                      }
                      setPreviewAberto(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => iniciarEdicao(tipo)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletarTipo(tipo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão Criar Novo */}
      <Button onClick={() => iniciarEdicao()} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Criar Novo Formulário
      </Button>

      {/* Modal de Edição/Criação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formularioSelecionado ? 'Editar Formulário' : 'Criar Novo Formulário'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Configurações Básicas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo">Título do Formulário</Label>
                <Input
                  id="titulo"
                  value={configuracao.titulo}
                  onChange={(e) => setConfiguracao(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ex: Contato Geral"
                />
              </div>
              
              <div>
                <Label htmlFor="mensagem-sucesso">Mensagem de Sucesso</Label>
                <Input
                  id="mensagem-sucesso"
                  value={configuracao.mensagemSucesso}
                  onChange={(e) => setConfiguracao(prev => ({ ...prev, mensagemSucesso: e.target.value }))}
                  placeholder="Mensagem após envio"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={configuracao.descricao}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição do formulário"
              />
            </div>

            {/* Campos do Formulário */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Campos do Formulário</h4>
                <Button onClick={adicionarCampo} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Campo
                </Button>
              </div>
              
              <div className="space-y-3">
                {configuracao.campos.map((campo, index) => (
                  <div key={campo.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{campo.label}</span>
                        <Badge variant="outline">{tiposCampo.find(t => t.value === campo.tipo)?.label}</Badge>
                        {campo.obrigatorio && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">Nome: {campo.nome}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarCampo(campo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removerCampo(campo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {configuracao.campos.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum campo adicionado. Clique em "Adicionar Campo" para começar.
                  </p>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormularioSelecionado(null);
                    setPreviewAberto(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                
                <Button
                  variant="outline"
                  onClick={copiarCodigo}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Copiar HTML
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setModalAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarFormulario}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Campo */}
      <Dialog open={modalCampoAberto} onOpenChange={setModalCampoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editandoCampo?.nome ? 'Editar Campo' : 'Adicionar Campo'}
            </DialogTitle>
          </DialogHeader>
          
          {editandoCampo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campo-nome">Nome do Campo</Label>
                  <Input
                    id="campo-nome"
                    value={editandoCampo.nome}
                    onChange={(e) => setEditandoCampo(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    placeholder="Ex: email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="campo-label">Label</Label>
                  <Input
                    id="campo-label"
                    value={editandoCampo.label}
                    onChange={(e) => setEditandoCampo(prev => prev ? { ...prev, label: e.target.value } : null)}
                    placeholder="Ex: Seu Email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campo-tipo">Tipo do Campo</Label>
                  <Select
                    value={editandoCampo.tipo}
                    onValueChange={(value: any) => setEditandoCampo(prev => prev ? { ...prev, tipo: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposCampo.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="campo-obrigatorio"
                    checked={editandoCampo.obrigatorio}
                    onCheckedChange={(checked) => setEditandoCampo(prev => prev ? { ...prev, obrigatorio: checked } : null)}
                  />
                  <Label htmlFor="campo-obrigatorio">Campo Obrigatório</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="campo-placeholder">Placeholder</Label>
                <Input
                  id="campo-placeholder"
                  value={editandoCampo.placeholder || ''}
                  onChange={(e) => setEditandoCampo(prev => prev ? { ...prev, placeholder: e.target.value } : null)}
                  placeholder="Texto de exemplo no campo"
                />
              </div>
              
              {(editandoCampo.tipo === 'select' || editandoCampo.tipo === 'radio' || editandoCampo.tipo === 'checkbox') && (
                <div>
                  <Label htmlFor="campo-opcoes">Opções (uma por linha)</Label>
                  <Textarea
                    id="campo-opcoes"
                    value={(editandoCampo.opcoes || []).join('\n')}
                    onChange={(e) => setEditandoCampo(prev => prev ? { 
                      ...prev, 
                      opcoes: e.target.value.split('\n').filter(o => o.trim()) 
                    } : null)}
                    placeholder="Opção 1\nOpção 2\nOpção 3"
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalCampoAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarCampo}>
                  Salvar Campo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Preview */}
      <Dialog open={previewAberto} onOpenChange={setPreviewAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview do Formulário
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Preview Visual */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-bold mb-2">{configuracao.titulo}</h2>
              {configuracao.descricao && (
                <p className="text-gray-600 mb-4">{configuracao.descricao}</p>
              )}
              
              <div className="space-y-4">
                {configuracao.campos.map((campo) => (
                  <div key={campo.id} className="space-y-1">
                    <label className="block text-sm font-medium">
                      {campo.label}
                      {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {campo.tipo === 'textarea' ? (
                      <textarea
                        className="w-full p-2 border rounded"
                        placeholder={campo.placeholder}
                        rows={3}
                        disabled
                      />
                    ) : campo.tipo === 'select' ? (
                      <select className="w-full p-2 border rounded" disabled>
                        <option>Selecione...</option>
                        {(campo.opcoes || []).map((opcao, idx) => (
                          <option key={idx} value={opcao}>{opcao}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={campo.tipo}
                        className="w-full p-2 border rounded"
                        placeholder={campo.placeholder}
                        disabled
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled
                >
                  Enviar
                </button>
              </div>
            </div>
            
            {/* Código HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Código HTML</h3>
                <Button onClick={copiarCodigo} size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{gerarCodigoHTML()}</code>
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciadorFormularios;