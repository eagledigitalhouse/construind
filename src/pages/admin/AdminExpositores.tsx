import React, { useState } from "react";
import { Store, Upload, Edit2, Trash2, Save, X, Plus, Database, ExternalLink, MapPin, Palette, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useExpositores } from "@/hooks/useExpositores";
import { useStandsAprovados } from "@/hooks/useStandsAprovados";
import { showToast } from '@/lib/toast';
import { Expositor } from "@/lib/supabase";
import { uploadImage } from '@/lib/uploadImage';

const AdminExpositores = () => {
  const {
    expositores,
    loading,
    error,
    adicionarExpositor,
    atualizarExpositor,
    removerExpositor,
    expositoresPorCategoria
  } = useExpositores();

  const {
    standsAprovados,
    loading: loadingStands,
    error: errorStands
  } = useStandsAprovados();

  const [editandoExpositor, setEditandoExpositor] = useState<Expositor | null>(null);
  const [novoExpositor, setNovoExpositor] = useState<Partial<Expositor>>({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [standSelecionado, setStandSelecionado] = useState<string>('');
  const [emailSelecionado, setEmailSelecionado] = useState('');
  const [telefoneSelecionado, setTelefoneSelecionado] = useState('');

  const categorias = [
    { id: "academias", nome: "Academias", cor: "#0a2856" },
    { id: "bem-estar", nome: "Bem-Estar", cor: "#00d856" },
    { id: "artigos", nome: "Artigos Esportivos", cor: "#b1f727" },
    { id: "nutricao", nome: "Saúde e Nutrição", cor: "#45b7d1" },
  ];

  // Substituir handleFileUpload para fazer upload no Storage
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        showToast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('O arquivo deve ter no máximo 5MB');
        return;
      }
      // Fazer upload para o Storage
      const url = await uploadImage(file, 'expositores');
      if (!url) {
        showToast.error('Erro ao fazer upload da imagem.');
        return;
      }
      if (isEdit && editandoExpositor) {
        setEditandoExpositor(prev => prev ? { ...prev, logo: url } : null);
      } else {
        setNovoExpositor(prev => ({ ...prev, logo: url }));
      }
    }
  };

  // Adicionar logo via URL
  const handleLogoUrl = (url: string, isEdit: boolean = false) => {
    if (!url) return;
    
    try {
      new URL(url);
    } catch {
      showToast.error('Por favor, insira uma URL válida');
      return;
    }

    if (isEdit && editandoExpositor) {
      setEditandoExpositor(prev => prev ? { ...prev, logo: url } : null);
    } else {
      setNovoExpositor(prev => ({ ...prev, logo: url }));
    }
  };

  // Carregar dados do expositor baseado no stand selecionado
  const handleStandSelection = (numeroStand: string) => {
    setStandSelecionado(numeroStand);
    
    if (!numeroStand) {
      // Limpar dados se nenhum stand for selecionado
      setNovoExpositor(prev => ({
        ...prev,
        nome: '',
        localizacao: '',
        categoria: '',
        email: '',
        telefone: ''
      }));
      setEmailSelecionado('');
      setTelefoneSelecionado('');
      return;
    }

    const standData = standsAprovados.find(stand => stand.numero_stand === numeroStand);
    
    if (standData) {
      // Mapear categoria do stand para categoria do expositor
      const categoriaMap: { [key: string]: string } = {
        'Academias': 'academias',
        'Bem-Estar': 'bem-estar',
        'Artigos Esportivos': 'artigos',
        'Saúde e Nutrição': 'nutricao'
      };

      // Definir email e telefone padrão (primeiro da lista)
      const emailPadrao = standData.emails.length > 0 ? standData.emails[0] : '';
      const telefonePadrao = standData.telefones.length > 0 ? standData.telefones[0] : '';

      setNovoExpositor(prev => ({
        ...prev,
        nome: standData.nome_expositor,
        localizacao: `Estande ${numeroStand}`,
        categoria: categoriaMap[standData.categoria] || 'academias',
        email: emailPadrao,
        telefone: telefonePadrao
      }));

      setEmailSelecionado(emailPadrao);
      setTelefoneSelecionado(telefonePadrao);
      
      showToast.success(`Dados carregados para o ${standData.nome_expositor}`);
    }
  };

  // Adicionar novo expositor
  const handleAdicionarExpositor = async () => {
    if (!standSelecionado) {
      showToast.error('Por favor, selecione um stand aprovado');
      return;
    }
    
    if (!novoExpositor.nome || !novoExpositor.logo || !novoExpositor.localizacao || !novoExpositor.categoria || !novoExpositor.descricao) {
      showToast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSalvando(true);
    try {
      await adicionarExpositor({
        nome: novoExpositor.nome,
        logo: novoExpositor.logo,
        localizacao: novoExpositor.localizacao,
        categoria: novoExpositor.categoria,
        descricao: novoExpositor.descricao,
        cor_primaria: novoExpositor.cor_primaria || '#0a2856',
        cor_secundaria: novoExpositor.cor_secundaria || '#00d856',
        website: novoExpositor.website || '',
        telefone: novoExpositor.telefone || '',
        email: novoExpositor.email || ''
      });
      
      setNovoExpositor({});
      setStandSelecionado('');
      setEmailSelecionado('');
      setTelefoneSelecionado('');
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao adicionar expositor:', error);
    } finally {
      setSalvando(false);
    }
  };

  // Salvar edição do expositor
  const handleSalvarEdicao = async () => {
    if (!editandoExpositor) return;

    setSalvando(true);
    try {
      await atualizarExpositor(editandoExpositor.id, editandoExpositor);
      setEditandoExpositor(null);
    } catch (error) {
      console.error('Erro ao atualizar expositor:', error);
    } finally {
      setSalvando(false);
    }
  };

  // Remover expositor
  const handleRemoverExpositor = async (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja remover o expositor "${nome}"?`)) {
      try {
        await removerExpositor(id);
      } catch (error) {
        console.error('Erro ao remover expositor:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a2856] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando expositores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 font-semibold mb-2">Erro ao carregar dados</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 admin-page">
      {/* Header */}
      <PageHeader
        title="Expositores"
        description="Gerencie os expositores do evento FESPIN"
        icon={Store}
        actions={[
          {
            label: "Novo Expositor",
            icon: Plus,
            onClick: () => setMostrarFormulario(true)
          }
        ]}
      />

        {/* Formulário para novo expositor */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="subtitle-medium text-gray-900 mb-1">Adicionar Novo Expositor</h2>
                <p className="text-sm text-gray-600">
                  Selecione um stand aprovado para carregar automaticamente os dados do expositor (nome, localização, categoria, telefone e email).
                  Você só precisa preencher a descrição e fazer upload do logo.
                </p>
              </div>
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setNovoExpositor({});
                  setStandSelecionado('');
                  setEmailSelecionado('');
                  setTelefoneSelecionado('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-caption text-gray-700 mb-2">
                  Selecionar Stand Aprovado *
                </label>
                <select
                  value={standSelecionado}
                  onChange={(e) => handleStandSelection(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  disabled={loadingStands}
                >
                  <option value="">Selecione um stand aprovado</option>
                  {standsAprovados.map(stand => (
                    <option key={stand.numero_stand} value={stand.numero_stand}>
                      Estande {stand.numero_stand} - {stand.nome_expositor} ({stand.categoria})
                    </option>
                  ))}
                </select>
                {loadingStands && (
                  <p className="text-sm text-gray-500 mt-1">Carregando stands aprovados...</p>
                )}
                {errorStands && (
                  <p className="text-sm text-red-500 mt-1">Erro ao carregar stands: {errorStands}</p>
                )}
                {standsAprovados.length === 0 && !loadingStands && (
                  <p className="text-sm text-yellow-600 mt-1">Nenhum stand aprovado encontrado</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Nome do Expositor *
                </label>
                <input
                  type="text"
                  value={novoExpositor.nome || ''}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  placeholder="Nome da empresa/expositor"
                  readOnly={!!standSelecionado}
                />
                {standSelecionado && (
                  <p className="text-xs text-blue-600 mt-1">Preenchido automaticamente do stand selecionado</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Localização *
                </label>
                <input
                  type="text"
                  value={novoExpositor.localizacao || ''}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, localizacao: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  placeholder="Ex: Estande A12 - Setor Academias"
                  readOnly={!!standSelecionado}
                />
                {standSelecionado && (
                  <p className="text-xs text-blue-600 mt-1">Preenchido automaticamente do stand selecionado</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Categoria *
                </label>
                <select
                  value={novoExpositor.categoria || ''}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  disabled={!!standSelecionado}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
                {standSelecionado && (
                  <p className="text-xs text-blue-600 mt-1">Preenchido automaticamente do stand selecionado</p>
                )}
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  value={novoExpositor.website || ''}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  placeholder="https://exemplo.com"
                />
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Telefone
                </label>
                {standSelecionado && standsAprovados.find(s => s.numero_stand === standSelecionado)?.telefones.length > 1 ? (
                  <select
                    value={telefoneSelecionado}
                    onChange={(e) => {
                      setTelefoneSelecionado(e.target.value);
                      setNovoExpositor(prev => ({ ...prev, telefone: e.target.value }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  >
                    <option value="">Selecione um telefone</option>
                    {standsAprovados.find(s => s.numero_stand === standSelecionado)?.telefones.map((telefone, index) => (
                      <option key={index} value={telefone}>{telefone}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="tel"
                    value={novoExpositor.telefone || ''}
                    onChange={(e) => setNovoExpositor(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    placeholder="(11) 99999-9999"
                    readOnly={!!standSelecionado && standsAprovados.find(s => s.numero_stand === standSelecionado)?.telefones.length === 1}
                  />
                )}
                {standSelecionado && standsAprovados.find(s => s.numero_stand === standSelecionado)?.telefones.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {standsAprovados.find(s => s.numero_stand === standSelecionado)?.telefones.length === 1 
                      ? 'Preenchido automaticamente do stand selecionado'
                      : 'Selecione um dos telefones cadastrados'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Email
                </label>
                {standSelecionado && standsAprovados.find(s => s.numero_stand === standSelecionado)?.emails.length > 1 ? (
                  <select
                    value={emailSelecionado}
                    onChange={(e) => {
                      setEmailSelecionado(e.target.value);
                      setNovoExpositor(prev => ({ ...prev, email: e.target.value }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  >
                    <option value="">Selecione um email</option>
                    {standsAprovados.find(s => s.numero_stand === standSelecionado)?.emails.map((email, index) => (
                      <option key={index} value={email}>{email}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="email"
                    value={novoExpositor.email || ''}
                    onChange={(e) => setNovoExpositor(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    placeholder="contato@exemplo.com"
                    readOnly={!!standSelecionado && standsAprovados.find(s => s.numero_stand === standSelecionado)?.emails.length === 1}
                  />
                )}
                {standSelecionado && standsAprovados.find(s => s.numero_stand === standSelecionado)?.emails.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {standsAprovados.find(s => s.numero_stand === standSelecionado)?.emails.length === 1 
                      ? 'Preenchido automaticamente do stand selecionado'
                      : 'Selecione um dos emails cadastrados'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-caption text-gray-700">
                  Descrição *
                </label>
                <textarea
                  value={novoExpositor.descricao || ''}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                  placeholder="Descrição do expositor e seus produtos/serviços"
                />
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Cor Primária
                </label>
                <input
                  type="color"
                  value={novoExpositor.cor_primaria || '#0a2856'}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, cor_primaria: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-caption text-gray-700">
                  Cor Secundária
                </label>
                <input
                  type="color"
                  value={novoExpositor.cor_secundaria || '#00d856'}
                  onChange={(e) => setNovoExpositor(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-caption text-gray-700">
                  Logo *
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload de Arquivo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                    <div className="flex-1">
                      <input
                        type="url"
                        placeholder="Ou cole a URL da imagem"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                        onBlur={(e) => handleLogoUrl(e.target.value, false)}
                      />
                    </div>
                  </div>
                  {novoExpositor.logo && (
                    <div className="mt-4">
                      <img
                        src={novoExpositor.logo}
                        alt="Preview"
                        className="h-20 w-32 object-contain border border-gray-200 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setNovoExpositor({});
                  setStandSelecionado('');
                  setEmailSelecionado('');
                  setTelefoneSelecionado('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdicionarExpositor}
                disabled={salvando}
                className="bg-[#0a2856] hover:bg-[#0a2856]/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Save className={`w-4 h-4 ${salvando ? 'animate-spin' : ''}`} />
                {salvando ? 'Salvando...' : 'Salvar Expositor'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de expositores por categoria */}
        <div className="space-y-4">
          {categorias.map((categoria) => {
            const expositoresCategoria = expositoresPorCategoria(categoria.id);
            
            return (
              <div key={categoria.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: categoria.cor }}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <h2 className="subtitle-small text-gray-900">{categoria.nome}</h2>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-badge">
                      {expositoresCategoria.length}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {expositoresCategoria.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum expositor nesta categoria ainda.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {expositoresCategoria.map((expositor) => (
                        <div key={expositor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={expositor.logo}
                                alt={expositor.nome}
                                className="h-12 w-16 object-contain rounded"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{expositor.nome}</h3>
                                <p className="text-small text-gray-600 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {expositor.localizacao}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditandoExpositor(expositor)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoverExpositor(expositor.id, expositor.nome)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-small text-gray-600 mb-3">{expositor.descricao}</p>
                          
                          <div className="flex items-center gap-2 text-caption text-gray-500">
                            <div className="flex items-center gap-1">
                              <Palette className="w-3 h-3" />
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: expositor.cor_primaria }}
                              ></div>
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: expositor.cor_secundaria }}
                              ></div>
                            </div>
                            {expositor.website && (
                              <a
                                href={expositor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Site
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de edição */}
        {editandoExpositor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="subtitle-medium text-gray-900">Editar Expositor</h2>
                  <button
                    onClick={() => setEditandoExpositor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption text-gray-700">
                      Nome do Expositor
                    </label>
                    <input
                      type="text"
                      value={editandoExpositor.nome}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, nome: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-caption text-gray-700">
                      Localização
                    </label>
                    <input
                      type="text"
                      value={editandoExpositor.localizacao}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, localizacao: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-caption text-gray-700">
                      Categoria
                    </label>
                    <select
                      value={editandoExpositor.categoria}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, categoria: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    >
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-caption text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editandoExpositor.website || ''}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, website: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-caption text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={editandoExpositor.telefone || ''}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, telefone: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-caption text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editandoExpositor.email || ''}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-caption text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      value={editandoExpositor.descricao}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-caption text-gray-700">
                      Cor Primária
                    </label>
                    <input
                      type="color"
                      value={editandoExpositor.cor_primaria}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, cor_primaria: e.target.value } : null)}
                      className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Secundária
                    </label>
                    <input
                      type="color"
                      value={editandoExpositor.cor_secundaria}
                      onChange={(e) => setEditandoExpositor(prev => prev ? { ...prev, cor_secundaria: e.target.value } : null)}
                      className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload de Arquivo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                        <div className="flex-1">
                          <input
                            type="url"
                            placeholder="Ou cole a URL da imagem"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a2856] focus:border-transparent"
                            onBlur={(e) => handleLogoUrl(e.target.value, true)}
                          />
                        </div>
                      </div>
                      {editandoExpositor.logo && (
                        <div className="mt-4">
                          <img
                            src={editandoExpositor.logo}
                            alt="Preview"
                            className="h-20 w-32 object-contain border border-gray-200 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setEditandoExpositor(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSalvarEdicao}
                    disabled={salvando}
                    className="bg-[#0a2856] hover:bg-[#0a2856]/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <Save className={`w-4 h-4 ${salvando ? 'animate-spin' : ''}`} />
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminExpositores;