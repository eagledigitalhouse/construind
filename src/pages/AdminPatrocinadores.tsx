import React, { useState, useEffect } from "react";
import { Crown, Star, Award, Upload, Edit2, Trash2, Save, X, Plus, Building2, Database, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { popularPatrocinadores, limparPatrocinadores } from "@/utils/populatePatrocinadores";

interface Patrocinador {
  id: string;
  nome: string;
  logo: string;
  website: string;
  categoria: string;
  cota: 'diamante' | 'ouro' | 'prata';
  tamanhoLogo: 'grande' | 'medio' | 'pequeno';
  descricao?: string;
}

interface Cota {
  key: 'diamante' | 'ouro' | 'prata';
  nome: string;
  icon: React.ReactNode;
  cor: string;
  tamanhoLogo: string;
}

const AdminPatrocinadores = () => {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [cotas, setCotas] = useState<Cota[]>([
    {
      key: 'diamante',
      nome: 'Patrocínio Diamante',
      icon: <Crown className="w-5 h-5" />,
      cor: '#0a2856',
      tamanhoLogo: 'h-24 w-40'
    },
    {
      key: 'ouro',
      nome: 'Patrocínio Ouro',
      icon: <Star className="w-5 h-5" />,
      cor: '#00d856',
      tamanhoLogo: 'h-20 w-32'
    },
    {
      key: 'prata',
      nome: 'Patrocínio Prata',
      icon: <Award className="w-5 h-5" />,
      cor: '#6b7280',
      tamanhoLogo: 'h-16 w-28'
    }
  ]);

  const [editandoCota, setEditandoCota] = useState<string | null>(null);
  const [editandoPatrocinador, setEditandoPatrocinador] = useState<Patrocinador | null>(null);
  const [novoPatrocinador, setNovoPatrocinador] = useState<Partial<Patrocinador>>({});
  const [mostrarFormulario, setMostrarFormulario] = useState<'diamante' | 'ouro' | 'prata' | null>(null);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('patrocinadores');
    if (dadosSalvos) {
      setPatrocinadores(JSON.parse(dadosSalvos));
    } else {
      // Dados iniciais vazios - usar localStorage
      const dadosIniciais: Patrocinador[] = [];
      setPatrocinadores(dadosIniciais);
      localStorage.setItem('patrocinadores', JSON.stringify(dadosIniciais));
    }

    const cotasSalvas = localStorage.getItem('cotas');
    if (cotasSalvas) {
      const cotasCarregadas = JSON.parse(cotasSalvas);
      // Reconstituir os ícones
      cotasCarregadas.forEach((cota: any) => {
        if (cota.key === 'diamante') cota.icon = <Crown className="w-5 h-5" />;
        if (cota.key === 'ouro') cota.icon = <Star className="w-5 h-5" />;
        if (cota.key === 'prata') cota.icon = <Award className="w-5 h-5" />;
      });
      setCotas(cotasCarregadas);
    }
  }, []);

  // Salvar dados no localStorage
  const salvarDados = () => {
    localStorage.setItem('patrocinadores', JSON.stringify(patrocinadores));
    localStorage.setItem('cotas', JSON.stringify(cotas));
  };

  // Upload de imagem
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, SVG, etc.)');
        return;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        if (isEdit && editandoPatrocinador) {
          // Atualizar logo na edição
          setEditandoPatrocinador(prev => prev ? { ...prev, logo: imageUrl } : null);
        } else {
          // Novo patrocinador
          setNovoPatrocinador(prev => ({ ...prev, logo: imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Adicionar logo via URL
  const handleLogoUrl = (url: string, isEdit: boolean = false) => {
    if (!url) return;
    
    // Validar se é uma URL válida
    try {
      new URL(url);
    } catch {
      alert('Por favor, insira uma URL válida');
      return;
    }

    if (isEdit && editandoPatrocinador) {
      // Atualizar logo na edição
      setEditandoPatrocinador(prev => prev ? { ...prev, logo: url } : null);
    } else {
      // Novo patrocinador
      setNovoPatrocinador(prev => ({ ...prev, logo: url }));
    }
  };

  // Adicionar novo patrocinador
  const adicionarPatrocinador = (cota: 'diamante' | 'ouro' | 'prata') => {
    if (novoPatrocinador.nome && novoPatrocinador.logo) {
      const novoId = Date.now().toString();
      const patrocinador: Patrocinador = {
        id: novoId,
        nome: novoPatrocinador.nome || '',
        logo: novoPatrocinador.logo || '',
        website: novoPatrocinador.website || '',
        categoria: novoPatrocinador.categoria || '',
        cota,
        tamanhoLogo: novoPatrocinador.tamanhoLogo || 'medio',
        descricao: novoPatrocinador.descricao || ''
      };
      
      setPatrocinadores(prev => [...prev, patrocinador]);
      setNovoPatrocinador({});
      setMostrarFormulario(null);
    }
  };

  // Salvar edição do patrocinador
  const salvarEdicaoPatrocinador = () => {
    if (editandoPatrocinador) {
      setPatrocinadores(prev => 
        prev.map(p => p.id === editandoPatrocinador.id ? editandoPatrocinador : p)
      );
      setEditandoPatrocinador(null);
    }
  };

  // Remover patrocinador
  const removerPatrocinador = (id: string) => {
    setPatrocinadores(prev => prev.filter(p => p.id !== id));
  };

  // Editar nome da cota
  const editarNomeCota = (key: string, novoNome: string) => {
    setCotas(prev => prev.map(c => c.key === key ? { ...c, nome: novoNome } : c));
    setEditandoCota(null);
  };

  // Filtrar patrocinadores por cota
  const patrocinadorPorCota = (cota: 'diamante' | 'ouro' | 'prata') => {
    return patrocinadores.filter(p => p.cota === cota);
  };

  // Obter classe CSS para tamanho do logo
  const obterTamanhoLogo = (tamanho: 'grande' | 'medio' | 'pequeno') => {
    switch (tamanho) {
      case 'grande':
        return 'h-40 w-60'; // Grande - tamanho mais harmônico
      case 'medio':
        return 'h-32 w-48'; // Médio - tamanho anterior do grande
      case 'pequeno':
        return 'h-20 w-32'; // Pequeno - ligeiramente maior
      default:
        return 'h-32 w-48'; // Padrão médio
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                Administração de Patrocinadores
              </h1>
              <p className="text-gray-600">
                Gerencie os patrocinadores e suas cotas de patrocínio
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  popularPatrocinadores();
                  window.location.reload();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Popular Exemplos
              </button>
              <button
                onClick={() => {
                  limparPatrocinadores();
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Dados
              </button>
              <button
                onClick={salvarDados}
                className="bg-[#00d856] hover:bg-[#00d856]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>

        {/* Seções por Cota */}
        <div className="space-y-8">
          {cotas.map((cota) => (
            <div key={cota.key} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header da Cota */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: cota.cor }}
                    >
                      {cota.icon}
                    </div>
                    {editandoCota === cota.key ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={cota.nome}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-lg font-bold"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              editarNomeCota(cota.key, (e.target as HTMLInputElement).value);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => setEditandoCota(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{cota.nome}</h2>
                        <button
                          onClick={() => setEditandoCota(cota.key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setMostrarFormulario(cota.key)}
                    className="bg-[#0a2856] hover:bg-[#0a2856]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Patrocinador
                  </button>
                </div>
              </div>

              {/* Formulário para Novo Patrocinador */}
              {mostrarFormulario === cota.key && (
                <div className="p-6 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Novo Patrocinador - {cota.nome}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={novoPatrocinador.nome || ''}
                        onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Digite o nome da empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <input
                        type="text"
                        value={novoPatrocinador.categoria || ''}
                        onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, categoria: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Ex: Equipamentos Esportivos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={novoPatrocinador.website || ''}
                        onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="https://exemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho do Logo
                      </label>
                      <select
                        value={novoPatrocinador.tamanhoLogo || 'medio'}
                        onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, tamanhoLogo: e.target.value as 'grande' | 'medio' | 'pequeno' }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="grande">Grande</option>
                        <option value="medio">Médio</option>
                        <option value="pequeno">Pequeno</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição da Empresa
                      </label>
                      <textarea
                        value={novoPatrocinador.descricao || ''}
                        onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, descricao: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        placeholder="Descreva a empresa, seus produtos ou serviços..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo da Empresa
                      </label>
                      <div className="space-y-4">
                        {/* Upload de arquivo */}
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, false)}
                            className="hidden"
                            id={`upload-novo-${cota.key}`}
                          />
                          <label
                            htmlFor={`upload-novo-${cota.key}`}
                            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                          >
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Fazer Upload</span>
                          </label>
                          {novoPatrocinador.logo && (
                            <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <img
                                src={novoPatrocinador.logo}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEw0NCA0NE0yMCA0NEw0NCAyMCIgc3Ryb2tlPSIjOUI5QjlCIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                                  target.title = 'Erro ao carregar imagem';
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Ou separador */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <span className="text-sm text-gray-500">ou</span>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* URL da imagem */}
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="Cole a URL da imagem aqui"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleLogoUrl((e.target as HTMLInputElement).value, false);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                              handleLogoUrl(input.value, false);
                              input.value = '';
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => adicionarPatrocinador(cota.key)}
                      disabled={!novoPatrocinador.nome || !novoPatrocinador.logo}
                      className="bg-[#00d856] hover:bg-[#00d856]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Adicionar Patrocinador
                    </button>
                    <button
                      onClick={() => {
                        setMostrarFormulario(null);
                        setNovoPatrocinador({});
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Patrocinadores */}
              <div className="p-6">
                {patrocinadorPorCota(cota.key).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum patrocinador nesta cota ainda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patrocinadorPorCota(cota.key).map((patrocinador) => (
                      <div key={patrocinador.id} className="border border-gray-200 rounded-lg p-4">
                        {/* Logo */}
                        <div className={`flex items-center justify-center mb-4 ${obterTamanhoLogo(patrocinador.tamanhoLogo)} mx-auto bg-gray-50 rounded-lg overflow-hidden border border-gray-200`}>
                          <img
                            src={patrocinador.logo}
                            alt={patrocinador.nome}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                                    <div class="text-center">
                                      <div class="mb-1">📷</div>
                                      <div>Logo não disponível</div>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>

                        {/* Informações */}
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{patrocinador.nome}</h4>
                            <p className="text-sm text-gray-600">{patrocinador.categoria}</p>
                            <p className="text-xs text-gray-500">{patrocinador.website}</p>
                            <p className="text-xs text-blue-600 font-medium">
                              Logo: {patrocinador.tamanhoLogo === 'grande' ? 'Grande' : 
                                    patrocinador.tamanhoLogo === 'medio' ? 'Médio' : 'Pequeno'}
                            </p>
                            {patrocinador.descricao && (
                              <p className="text-xs text-gray-700 mt-2 line-clamp-3">
                                {patrocinador.descricao}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => setEditandoPatrocinador(patrocinador)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 px-2 rounded transition-colors duration-200 flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Editar
                          </button>
                          <button
                            onClick={() => removerPatrocinador(patrocinador.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded transition-colors duration-200 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Edição */}
      {editandoPatrocinador && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-display font-bold text-gray-900">
                Editar Patrocinador
              </h2>
              <button
                onClick={() => setEditandoPatrocinador(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={editandoPatrocinador.nome || ''}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Digite o nome da empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={editandoPatrocinador.categoria || ''}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, categoria: e.target.value } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: Equipamentos Esportivos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={editandoPatrocinador.website || ''}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, website: e.target.value } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho do Logo
                  </label>
                  <select
                    value={editandoPatrocinador.tamanhoLogo || 'medio'}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, tamanhoLogo: e.target.value as 'grande' | 'medio' | 'pequeno' } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="grande">Grande</option>
                    <option value="medio">Médio</option>
                    <option value="pequeno">Pequeno</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Empresa
                  </label>
                  <textarea
                    value={editandoPatrocinador.descricao || ''}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descreva a empresa, seus produtos ou serviços..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo da Empresa
                  </label>
                  <div className="space-y-4">
                    {/* Preview do logo atual */}
                    {editandoPatrocinador.logo && (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <img
                            src={editandoPatrocinador.logo}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEw0NCA0NE0yMCA0NEw0NCAyMCIgc3Ryb2tlPSIjOUI5QjlCIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                              target.title = 'Erro ao carregar imagem';
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">Logo atual</span>
                      </div>
                    )}

                    {/* Upload de arquivo */}
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                        id="upload-edit"
                      />
                      <label
                        htmlFor="upload-edit"
                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Trocar Logo</span>
                      </label>
                    </div>

                    {/* Ou separador */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm text-gray-500">ou</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* URL da imagem */}
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Cole a URL da nova imagem aqui"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleLogoUrl((e.target as HTMLInputElement).value, true);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                          handleLogoUrl(input.value, true);
                          input.value = '';
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Atualizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={salvarEdicaoPatrocinador}
                  disabled={!editandoPatrocinador.nome || !editandoPatrocinador.logo}
                  className="bg-[#00d856] hover:bg-[#00d856]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setEditandoPatrocinador(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPatrocinadores; 