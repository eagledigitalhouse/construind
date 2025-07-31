import React, { useState, useEffect } from 'react';
import { X, Save, User, Building2, Phone, MapPin, CreditCard, FileText, Calendar, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/uploadImage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { PhoneInput } from '../ui/phone-input';
import { useEntidades } from '../../hooks/useEntidades';
import {
  Entidade,
  EntidadeFormData,
  TipoEntidade,
  CategoriaEntidade,
  StatusEntidade,
  PrioridadeEntidade
} from '../../types/entidades';

interface FormularioEntidadeProps {
  entidade?: Entidade | null;
  onClose: () => void;
  onSave: () => void;
}

const FormularioEntidade: React.FC<FormularioEntidadeProps> = ({
  entidade,
  onClose,
  onSave
}) => {
  const { criarEntidade, atualizarEntidade, loading } = useEntidades();
  
  const [formData, setFormData] = useState<EntidadeFormData>({
    nome: '',
    tipo: 'pessoa_fisica',
    categoria: 'outros',
    status: 'ativo',
    prioridade: 'normal',
    dados_pessoa_fisica: {},
    dados_pessoa_juridica: {},
    contatos: {},
    enderecos: {
      residencial: {},
      comercial: {},
      correspondencia: {}
    },
    dados_financeiros: {},
    tags: [],
    observacoes: '',
    notas_internas: ''
  });
  
  const [novaTag, setNovaTag] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('basicos');
  const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string>('');

  // Carregar dados da entidade para edição
  useEffect(() => {
    if (entidade) {
      setFormData({
        nome: entidade.nome,
        tipo: entidade.tipo,
        categoria: entidade.categoria,
        status: entidade.status,
        prioridade: entidade.prioridade,
        dados_pessoa_fisica: entidade.dados_pessoa_fisica || {},
        dados_pessoa_juridica: entidade.dados_pessoa_juridica || {},
        contatos: entidade.contatos || {},
        enderecos: entidade.enderecos || {
          residencial: {},
          comercial: {},
          correspondencia: {}
        },
        dados_financeiros: entidade.dados_financeiros || {},
        tags: entidade.tags || [],
        observacoes: entidade.observacoes || '',
        notas_internas: entidade.notas_internas || '',
        subcategoria: entidade.subcategoria,
        empresa_vinculada: entidade.empresa_vinculada,
        proximo_contato: entidade.proximo_contato,
        imagem_url: entidade.imagem_url
      });
      
      // Carregar preview da imagem existente
      if (entidade.imagem_url) {
        setPreviewImagem(entidade.imagem_url);
      }
    }
  }, [entidade]);

  const handleInputChange = (campo: string, valor: any, secao?: string) => {
    setFormData(prev => {
      if (secao) {
        return {
          ...prev,
          [secao]: {
...(prev[secao as keyof EntidadeFormData] as Record<string, any>),
            [campo]: valor
          }
        };
      }
      return {
        ...prev,
        [campo]: valor
      };
    });
  };

  const handleEnderecoChange = (tipoEndereco: string, campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      enderecos: {
        ...prev.enderecos,
        [tipoEndereco]: {
          ...prev.enderecos?.[tipoEndereco as keyof typeof prev.enderecos],
          [campo]: valor
        }
      }
    }));
  };

  const adicionarTag = () => {
    if (novaTag.trim() && !formData.tags?.includes(novaTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), novaTag.trim()]
      }));
      setNovaTag('');
    }
  };

  const removerTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleImagemSelecionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemSelecionada(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImagem(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = () => {
    setImagemSelecionada(null);
    setPreviewImagem('');
    setFormData(prev => ({
      ...prev,
      imagem_url: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let dadosFinais = { ...formData };
      
      // Upload da imagem se uma nova foi selecionada
      if (imagemSelecionada) {
        const urlImagem = await uploadImage(imagemSelecionada, 'entidades', 'perfil');
        if (urlImagem) {
          dadosFinais.imagem_url = urlImagem;
        }
      }
      
      if (entidade) {
        await atualizarEntidade(entidade.id, dadosFinais);
      } else {
        await criarEntidade(dadosFinais);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar entidade:', error);
    }
  };

  const buscarCEP = async (cep: string, tipoEndereco: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          handleEnderecoChange(tipoEndereco, 'rua', data.logradouro);
          handleEnderecoChange(tipoEndereco, 'bairro', data.bairro);
          handleEnderecoChange(tipoEndereco, 'cidade', data.localidade);
          handleEnderecoChange(tipoEndereco, 'estado', data.uf);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {entidade ? 'Editar Entidade' : 'Nova Entidade'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-hidden p-6 flex flex-col">
            {/* Campo de Upload de Imagem - Círculo no topo */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {previewImagem ? (
                  <div className="relative">
                    <img
                      src={previewImagem}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                      onClick={() => document.getElementById('upload-imagem')?.click()}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                         onClick={() => document.getElementById('upload-imagem')?.click()}>
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    {/* Bolinha de status */}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${
                      formData.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                    } rounded-full border-2 border-white flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={removerImagem}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div 
                      className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      onClick={() => document.getElementById('upload-imagem')?.click()}
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    {/* Bolinha de status */}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${
                      formData.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                    } rounded-full border-2 border-white flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
                <input
                  id="upload-imagem"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagemSelecionada}
                />
              </div>
            </div>

            <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="flex flex-col flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basicos" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Básicos
                </TabsTrigger>
                <TabsTrigger value="contatos" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contatos
                </TabsTrigger>
                <TabsTrigger value="enderecos" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Endereços
                </TabsTrigger>
                <TabsTrigger value="financeiro" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Financeiro
                </TabsTrigger>
                <TabsTrigger value="organizacao" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Organização
                </TabsTrigger>
                <TabsTrigger value="outros" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Outros
                </TabsTrigger>
              </TabsList>

              {/* Aba Dados Básicos */}
              <TabsContent value="basicos" className="space-y-6 overflow-y-auto flex-1 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => handleInputChange('tipo', value as TipoEntidade)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                        <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => handleInputChange('categoria', value as CategoriaEntidade)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fornecedores">Fornecedores</SelectItem>
                        <SelectItem value="patrocinadores">Patrocinadores</SelectItem>
                        <SelectItem value="parceiros">Parceiros</SelectItem>
                        <SelectItem value="clientes">Clientes</SelectItem>
                        <SelectItem value="prestadores_servico">Prestadores de Serviço</SelectItem>
                        <SelectItem value="midia">Mídia</SelectItem>
                        <SelectItem value="governo">Governo</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategoria">Subcategoria</Label>
                    <Input
                      id="subcategoria"
                      value={formData.subcategoria || ''}
                      onChange={(e) => handleInputChange('subcategoria', e.target.value)}
                      placeholder="Ex: Som e Luz, Catering, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value as StatusEntidade)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="arquivado">Arquivado</SelectItem>
                        <SelectItem value="bloqueado">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select
                      value={formData.prioridade}
                      onValueChange={(value) => handleInputChange('prioridade', value as PrioridadeEntidade)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>



                {/* Campos específicos por tipo */}
                {formData.tipo === 'pessoa_fisica' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Dados Pessoais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={formData.dados_pessoa_fisica?.cpf || ''}
                          onChange={(e) => handleInputChange('cpf', e.target.value, 'dados_pessoa_fisica')}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                        <Input
                          id="data_nascimento"
                          type="date"
                          value={formData.dados_pessoa_fisica?.data_nascimento || ''}
                          onChange={(e) => handleInputChange('data_nascimento', e.target.value, 'dados_pessoa_fisica')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profissao">Profissão</Label>
                        <Input
                          id="profissao"
                          value={formData.dados_pessoa_fisica?.profissao || ''}
                          onChange={(e) => handleInputChange('profissao', e.target.value, 'dados_pessoa_fisica')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estado_civil">Estado Civil</Label>
                        <Select
                          value={formData.dados_pessoa_fisica?.estado_civil || ''}
                          onValueChange={(value) => handleInputChange('estado_civil', value, 'dados_pessoa_fisica')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                            <SelectItem value="casado">Casado(a)</SelectItem>
                            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            <SelectItem value="uniao_estavel">União Estável</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {formData.tipo === 'pessoa_juridica' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Dados da Empresa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="razao_social">Razão Social</Label>
                        <Input
                          id="razao_social"
                          value={formData.dados_pessoa_juridica?.razao_social || ''}
                          onChange={(e) => handleInputChange('razao_social', e.target.value, 'dados_pessoa_juridica')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                        <Input
                          id="nome_fantasia"
                          value={formData.dados_pessoa_juridica?.nome_fantasia || ''}
                          onChange={(e) => handleInputChange('nome_fantasia', e.target.value, 'dados_pessoa_juridica')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          value={formData.dados_pessoa_juridica?.cnpj || ''}
                          onChange={(e) => handleInputChange('cnpj', e.target.value, 'dados_pessoa_juridica')}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ramo_atividade">Ramo de Atividade</Label>
                        <Input
                          id="ramo_atividade"
                          value={formData.dados_pessoa_juridica?.ramo_atividade || ''}
                          onChange={(e) => handleInputChange('ramo_atividade', e.target.value, 'dados_pessoa_juridica')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="porte_empresa">Porte da Empresa</Label>
                        <Select
                          value={formData.dados_pessoa_juridica?.porte_empresa || ''}
                          onValueChange={(value) => handleInputChange('porte_empresa', value, 'dados_pessoa_juridica')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="micro">Microempresa</SelectItem>
                            <SelectItem value="pequena">Pequena</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="grande">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Aba Contatos */}
              <TabsContent value="contatos" className="space-y-4 overflow-y-auto flex-1 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email_principal">Email Principal</Label>
                    <Input
                      id="email_principal"
                      type="email"
                      value={formData.contatos?.email_principal || ''}
                      onChange={(e) => handleInputChange('email_principal', e.target.value, 'contatos')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email_secundario">Email Secundário</Label>
                    <Input
                      id="email_secundario"
                      type="email"
                      value={formData.contatos?.email_secundario || ''}
                      onChange={(e) => handleInputChange('email_secundario', e.target.value, 'contatos')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone_celular">Telefone Celular</Label>
                    <PhoneInput
                      id="telefone_celular"
                      value={formData.contatos?.telefone_celular || ''}
                      onChange={(value) => handleInputChange('telefone_celular', value, 'contatos')}
                      placeholder="Digite o número"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone_fixo">Telefone Fixo</Label>
                    <PhoneInput
                      name="telefone_fixo"
                      value={formData.contatos?.telefone_fixo || ''}
                      onChange={(value) => handleInputChange('telefone_fixo', value, 'contatos')}
                      placeholder="Digite o número"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <PhoneInput
                      id="whatsapp"
                      value={formData.contatos?.whatsapp || ''}
                      onChange={(value) => handleInputChange('whatsapp', value, 'contatos')}
                      placeholder="Digite o número"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.contatos?.linkedin || ''}
                      onChange={(e) => handleInputChange('linkedin', e.target.value, 'contatos')}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.contatos?.instagram || ''}
                      onChange={(e) => handleInputChange('instagram', e.target.value, 'contatos')}
                      placeholder="@usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_oficial">Site</Label>
                    <Input
                      id="site_oficial"
                      value={formData.contatos?.site_oficial || ''}
                      onChange={(e) => handleInputChange('site_oficial', e.target.value, 'contatos')}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Aba Endereços */}
              <TabsContent value="enderecos" className="space-y-6 overflow-y-auto flex-1 pr-2">
                {['residencial', 'comercial', 'correspondencia'].map((tipoEndereco) => (
                  <Card key={tipoEndereco}>
                    <CardHeader>
                      <CardTitle className="capitalize">
                        Endereço {tipoEndereco === 'correspondencia' ? 'de Correspondência' : tipoEndereco}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`${tipoEndereco}_cep`}>CEP</Label>
                        <Input
                          id={`${tipoEndereco}_cep`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.cep || ''}
                          onChange={(e) => {
                            const cep = e.target.value.replace(/\D/g, '');
                            handleEnderecoChange(tipoEndereco, 'cep', cep);
                            if (cep.length === 8) {
                              buscarCEP(cep, tipoEndereco);
                            }
                          }}
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`${tipoEndereco}_rua`}>Rua</Label>
                        <Input
                          id={`${tipoEndereco}_rua`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.rua || ''}
                          onChange={(e) => handleEnderecoChange(tipoEndereco, 'rua', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tipoEndereco}_numero`}>Número</Label>
                        <Input
                          id={`${tipoEndereco}_numero`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.numero || ''}
                          onChange={(e) => handleEnderecoChange(tipoEndereco, 'numero', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tipoEndereco}_complemento`}>Complemento</Label>
                        <Input
                          id={`${tipoEndereco}_complemento`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.complemento || ''}
                          onChange={(e) => handleEnderecoChange(tipoEndereco, 'complemento', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tipoEndereco}_bairro`}>Bairro</Label>
                        <Input
                          id={`${tipoEndereco}_bairro`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.bairro || ''}
                          onChange={(e) => handleEnderecoChange(tipoEndereco, 'bairro', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tipoEndereco}_cidade`}>Cidade</Label>
                        <Input
                          id={`${tipoEndereco}_cidade`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.cidade || ''}
                          onChange={(e) => handleEnderecoChange(tipoEndereco, 'cidade', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tipoEndereco}_estado`}>Estado</Label>
                        <Input
                          id={`${tipoEndereco}_estado`}
                          value={formData.enderecos?.[tipoEndereco as keyof typeof formData.enderecos]?.estado || ''}
                          onChange={(e) => handleEnderecoChange(tipoEndereco, 'estado', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Aba Financeiro */}
              <TabsContent value="financeiro" className="space-y-4 overflow-y-auto flex-1 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="banco">Banco</Label>
                    <Input
                      id="banco"
                      value={formData.dados_financeiros?.banco || ''}
                      onChange={(e) => handleInputChange('banco', e.target.value, 'dados_financeiros')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="agencia">Agência</Label>
                    <Input
                      id="agencia"
                      value={formData.dados_financeiros?.agencia || ''}
                      onChange={(e) => handleInputChange('agencia', e.target.value, 'dados_financeiros')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="conta">Conta</Label>
                    <Input
                      id="conta"
                      value={formData.dados_financeiros?.conta || ''}
                      onChange={(e) => handleInputChange('conta', e.target.value, 'dados_financeiros')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo_conta">Tipo de Conta</Label>
                    <Select
                      value={formData.dados_financeiros?.tipo_conta || ''}
                      onValueChange={(value) => handleInputChange('tipo_conta', value, 'dados_financeiros')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Conta Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                        <SelectItem value="salario">Conta Salário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pix">Chave PIX</Label>
                    <Input
                      id="pix"
                      value={formData.dados_financeiros?.pix || ''}
                      onChange={(e) => handleInputChange('pix', e.target.value, 'dados_financeiros')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="limite_credito">Limite de Crédito</Label>
                    <Input
                      id="limite_credito"
                      type="number"
                      value={formData.dados_financeiros?.limite_credito || ''}
                      onChange={(e) => handleInputChange('limite_credito', parseFloat(e.target.value), 'dados_financeiros')}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Aba Organização */}
              <TabsContent value="organizacao" className="space-y-4 overflow-y-auto flex-1 pr-2">
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      placeholder="Digite uma tag e pressione Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          adicionarTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={adicionarTag}>
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removerTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes || ''}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={4}
                    placeholder="Observações gerais sobre a entidade..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="notas_internas">Notas Internas</Label>
                  <Textarea
                    id="notas_internas"
                    value={formData.notas_internas || ''}
                    onChange={(e) => handleInputChange('notas_internas', e.target.value)}
                    rows={4}
                    placeholder="Notas internas (não visíveis para a entidade)..."
                  />
                </div>
              </TabsContent>

              {/* Aba Outros */}
              <TabsContent value="outros" className="space-y-4 overflow-y-auto flex-1 pr-2">
                <div>
                  <Label htmlFor="proximo_contato">Próximo Contato</Label>
                  <Input
                    id="proximo_contato"
                    type="datetime-local"
                    value={formData.proximo_contato || ''}
                    onChange={(e) => handleInputChange('proximo_contato', e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-between items-center gap-4 p-6 border-t bg-gray-50">
            <div className="flex gap-2">
              {abaAtiva !== 'basicos' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const abas = ['basicos', 'contatos', 'enderecos', 'financeiro', 'organizacao', 'outros'];
                    const indiceAtual = abas.indexOf(abaAtiva);
                    if (indiceAtual > 0) {
                      setAbaAtiva(abas[indiceAtual - 1]);
                    }
                  }}
                >
                  Anterior
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              
              {abaAtiva !== 'outros' ? (
                <Button 
                  type="button" 
                  onClick={() => {
                    const abas = ['basicos', 'contatos', 'enderecos', 'financeiro', 'organizacao', 'outros'];
                    const indiceAtual = abas.indexOf(abaAtiva);
                    if (indiceAtual < abas.length - 1) {
                      setAbaAtiva(abas[indiceAtual + 1]);
                    }
                  }}
                >
                  Continuar
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEntidade;