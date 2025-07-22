import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Check, 
  Upload, 
  ExternalLink, 
  GripVertical, 
  Building2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { usePatrocinadores } from '../../hooks/usePatrocinadores';
import { useCotasPatrocinio, type CotaPatrocinio } from '../../hooks/useCotasPatrocinio';
import { uploadImage } from '../../lib/uploadImage';
import { type Patrocinador } from '../../lib/supabase';

const AdminPatrocinadores: React.FC = () => {
  const { 
    patrocinadores, 
    loading, 
    error, 
    fetchPatrocinadores,
    adicionarPatrocinador, 
    atualizarPatrocinador, 
    removerPatrocinador 
  } = usePatrocinadores();
  

  
  const { 
    cotas, 
    loading: loadingCotas, 
    error: errorCotas, 
    adicionarCategoria, 
    atualizarCategoria, 
    removerCategoria 
  } = useCotasPatrocinio();

  // Estados para formulários
  const [mostrarFormulario, setMostrarFormulario] = useState<string | null>(null);
  const [novoPatrocinador, setNovoPatrocinador] = useState<Partial<Patrocinador>>({});
  const [editandoPatrocinador, setEditandoPatrocinador] = useState<Patrocinador | null>(null);
  
  // Estados para nova categoria
  const [mostrandoFormularioNovaCota, setMostrandoFormularioNovaCota] = useState(false);
  const [novaCota, setNovaCota] = useState({ nome: '', cor: '#3B82F6', icone: 'Star' });
  
  // Estados para edição de categoria
  const [editandoNomeCota, setEditandoNomeCota] = useState<string | null>(null);
  const [novoNomeCota, setNovoNomeCota] = useState('');
  
  // Estados para drag and drop
  const [draggedPatrocinador, setDraggedPatrocinador] = useState<Patrocinador | null>(null);
  const [dragOverCota, setDragOverCota] = useState<string | null>(null);
  const [dragOverPatrocinador, setDragOverPatrocinador] = useState<string | null>(null);
  
  // Estados de controle
  const [salvando, setSalvando] = useState(false);

  // Funções auxiliares
  const filtrarPatrocinadores = (cotaId: string) => {
    return patrocinadores
      .filter(p => p.categoria_id === cotaId)
      .sort((a, b) => (a.posicao || 0) - (b.posicao || 0));
  };

  const obterTamanhoLogo = (tamanho: string) => {
    switch (tamanho) {
      case 'grande': return 'w-32 h-20';
      case 'medio': return 'w-24 h-16';
      case 'pequeno': return 'w-20 h-12';
      default: return 'w-24 h-16';
    }
  };

  // Handlers para upload de imagem
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file, 'patrocinadores');
      
      if (isEdit && editandoPatrocinador) {
        setEditandoPatrocinador(prev => prev ? { ...prev, logo: imageUrl } : null);
      } else {
        setNovoPatrocinador(prev => ({ ...prev, logo: imageUrl }));
      }
      
      toast.success('Logo carregado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
    }
  };

  const handleLogoUrl = (url: string, isEdit: boolean = false) => {
    if (!url.trim()) return;
    
    if (isEdit && editandoPatrocinador) {
      setEditandoPatrocinador(prev => prev ? { ...prev, logo: url } : null);
    } else {
      setNovoPatrocinador(prev => ({ ...prev, logo: url }));
    }
    
    toast.success('Logo adicionado!');
  };

  // Handlers para patrocinadores
  const adicionarPatrocinadorHandler = async (cotaId: string) => {
    if (!novoPatrocinador.nome || !novoPatrocinador.logo) {
      toast.error('Nome e logo são obrigatórios');
      return;
    }

    try {
      await adicionarPatrocinador({
        ...novoPatrocinador,
        categoria_id: cotaId,
        tamanho_logo: novoPatrocinador.tamanho_logo || 'medio'
      } as Patrocinador);
      
      setNovoPatrocinador({});
      setMostrarFormulario(null);
      toast.success('Patrocinador adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar patrocinador');
    }
  };

  const salvarEdicaoPatrocinador = async () => {
    if (!editandoPatrocinador) return;

    try {
      await atualizarPatrocinador(editandoPatrocinador.id, editandoPatrocinador);
      setEditandoPatrocinador(null);
      toast.success('Patrocinador atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar patrocinador');
    }
  };

  const removerPatrocinadorHandler = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este patrocinador?')) return;

    try {
      await removerPatrocinador(id);
      toast.success('Patrocinador removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover patrocinador');
    }
  };

  // Handlers para categorias
  const adicionarNovaCota = async () => {
    if (!novaCota.nome.trim()) {
      toast.error('O nome da categoria é obrigatório');
      return;
    }

    try {
      await adicionarCategoria({
        nome: novaCota.nome,
        cor: novaCota.cor,
        icone: novaCota.icone,
        ordem: cotas.length + 1,
        ativo: true
      });
      
      setNovaCota({ nome: '', cor: '#3B82F6', icone: 'Star' });
      setMostrandoFormularioNovaCota(false);
      toast.success('Nova categoria adicionada!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const iniciarEdicaoNomeCota = (cotaId: string, nomeAtual: string) => {
    setEditandoNomeCota(cotaId);
    setNovoNomeCota(nomeAtual);
  };

  const salvarNomeCota = async (cotaId: string) => {
    if (!novoNomeCota.trim()) return;

    try {
      const cota = cotas.find(c => c.id === cotaId);
      if (cota) {
        await atualizarCategoria(cotaId, { ...cota, nome: novoNomeCota });
        toast.success('Nome da categoria atualizado!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
    }
    
    setEditandoNomeCota(null);
    setNovoNomeCota('');
  };

  const cancelarEdicaoNomeCota = () => {
    setEditandoNomeCota(null);
    setNovoNomeCota('');
  };

  const removerCotaHandler = async (cotaId: string) => {
    const patrocinadoresdaCota = filtrarPatrocinadores(cotaId);
    
    if (patrocinadoresdaCota.length > 0) {
      toast.error('Não é possível remover uma categoria que possui patrocinadores');
      return;
    }

    if (!confirm('Tem certeza que deseja remover esta categoria?')) return;

    try {
      await removerCategoria(cotaId);
      toast.success('Categoria removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover categoria');
    }
  };

  // Handlers para drag and drop
  const handleDragStart = (e: React.DragEvent, patrocinador: Patrocinador) => {
    // Iniciando drag para patrocinador
    
    // Configurar o dataTransfer
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', patrocinador.id);
      e.dataTransfer.setData('application/json', JSON.stringify(patrocinador));
    }
    
    setDraggedPatrocinador(patrocinador);
    // Estado draggedPatrocinador definido
  };

  const handleDragOver = (e: React.DragEvent, cotaId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (dragOverCota !== cotaId) {
      // Drag over categoria
      setDragOverCota(cotaId);
    }
  };

  const handleDragEnter = (e: React.DragEvent, cotaId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCota(cotaId);
  };

  const handleDragLeave = (e: React.DragEvent, cotaId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Só remove o dragOver se realmente saiu da área da categoria
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      // Saindo da categoria
      setDragOverCota(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, novaCotaId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Drop na categoria
    
    setDragOverCota(null);

    if (!draggedPatrocinador) {
      return;
    }

    if (draggedPatrocinador.categoria_id === novaCotaId) {
       setDraggedPatrocinador(null);
       toast.success(`${draggedPatrocinador.nome} já está nesta categoria.`);
       return;
     }

    try {
      // Movendo patrocinador para nova categoria
      
      await atualizarPatrocinador(draggedPatrocinador.id, {
        ...draggedPatrocinador,
        categoria_id: novaCotaId
      });
      
      // Estado local já é atualizado pela função atualizarPatrocinador
      
      toast.success(`${draggedPatrocinador.nome} movido com sucesso!`);
      // Patrocinador movido com sucesso
    } catch (error) {
      console.error('Erro ao mover patrocinador:', error);
      toast.error('Erro ao mover patrocinador');
    }
    
    setDraggedPatrocinador(null);
  };

  // Handler para drop sobre outro patrocinador (reordenação e mudança de categoria)
  const handleDropOnPatrocinador = async (e: React.DragEvent, targetPatrocinador: Patrocinador) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 Drop sobre patrocinador:', targetPatrocinador.nome);
    
    if (!draggedPatrocinador || draggedPatrocinador.id === targetPatrocinador.id) {
      console.log('❌ Não é possível mover para si mesmo');
      return;
    }

    try {
      const sourcePatrocinadores = filtrarPatrocinadores(draggedPatrocinador.categoria_id);
      const targetPatrocinadores = filtrarPatrocinadores(targetPatrocinador.categoria_id);
      
      // Mudança de categoria
      if (draggedPatrocinador.categoria_id !== targetPatrocinador.categoria_id) {
        console.log('🔄 Movendo patrocinador para nova categoria:', {
          patrocinador: draggedPatrocinador.nome,
          categoriaOrigem: draggedPatrocinador.categoria_id,
          categoriaDestino: targetPatrocinador.categoria_id,
          novaPosicao: targetPatrocinador.posicao
        });

        // Atualizar categoria e posição
        await atualizarPatrocinador(draggedPatrocinador.id, {
          categoria_id: targetPatrocinador.categoria_id,
          posicao: targetPatrocinador.posicao
        });

        // Atualizar posições dos outros patrocinadores na categoria de destino
        const patrocinadoresToUpdate = targetPatrocinadores
          .filter(p => p.id !== targetPatrocinador.id && (p.posicao || 0) >= (targetPatrocinador.posicao || 0))
          .map(p => ({ ...p, posicao: (p.posicao || 0) + 1 }));

        for (const patrocinador of patrocinadoresToUpdate) {
          await atualizarPatrocinador(patrocinador.id, { posicao: patrocinador.posicao });
        }
        
        toast.success(`${draggedPatrocinador.nome} foi movido para a categoria de ${targetPatrocinador.nome}`);
      } else {
        // Reordenação na mesma categoria
        console.log('🔄 Reordenando na mesma categoria:', {
          patrocinador: draggedPatrocinador.nome,
          posicaoOrigem: draggedPatrocinador.posicao,
          posicaoDestino: targetPatrocinador.posicao
        });

        const draggedPos = draggedPatrocinador.posicao || 0;
        const targetPos = targetPatrocinador.posicao || 0;

        if (draggedPos !== targetPos) {
          // Atualizar posição do patrocinador arrastado
          await atualizarPatrocinador(draggedPatrocinador.id, { posicao: targetPos });

          // Atualizar posições dos outros patrocinadores
          const patrocinadoresToUpdate = sourcePatrocinadores.filter(p => {
            if (p.id === draggedPatrocinador.id) return false;
            const pos = p.posicao || 0;
            return draggedPos < targetPos ? 
              (pos > draggedPos && pos <= targetPos) : 
              (pos >= targetPos && pos < draggedPos);
          });

          for (const patrocinador of patrocinadoresToUpdate) {
            const newPos = draggedPos < targetPos ? 
              (patrocinador.posicao || 0) - 1 : 
              (patrocinador.posicao || 0) + 1;
            await atualizarPatrocinador(patrocinador.id, { posicao: newPos });
          }
          
          toast.success(`${draggedPatrocinador.nome} reordenado com sucesso!`);
        } else {
          toast.info(`${draggedPatrocinador.nome} já está na posição correta`);
        }
      }

      // Estado local já é atualizado pela função atualizarPatrocinador
      console.log('✅ Operação concluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao processar drag and drop:', error);
      toast.error('Erro ao reordenar patrocinador');
    }
    
    setDraggedPatrocinador(null);
    setDragOverCota(null);
    setDragOverPatrocinador(null);
  };

  // Handlers para drag over patrocinador
  const handleDragOverPatrocinador = (e: React.DragEvent, patrocinadorId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPatrocinador(patrocinadorId);
  };

  const handleDragLeavePatrocinador = (e: React.DragEvent, patrocinadorId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverPatrocinador === patrocinadorId) {
      setDragOverPatrocinador(null);
    }
  };

  if (loading || loadingCotas) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Patrocinadores</h1>
            <p className="text-gray-600">
              {patrocinadores.length} patrocinador{patrocinadores.length !== 1 ? 'es' : ''} cadastrado{patrocinadores.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMostrandoFormularioNovaCota(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Categoria
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Estados de erro */}
        {(error || errorCotas) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="subtitle-small text-red-800">Erro ao carregar dados</h3>
                <p className="text-small text-red-600">{error || errorCotas}</p>
              </div>
            </div>
          </div>
        )}



        {/* Lista de Categorias */}
        <div className="space-y-6">
          {cotas.map((cota) => {
            const patrocinadoresdaCota = filtrarPatrocinadores(cota.id);
            const isDragOver = dragOverCota === cota.id;
            
            return (
              <div 
                key={cota.id} 
                className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onDragOver={(e) => handleDragOver(e, cota.id)}
                onDragEnter={(e) => handleDragEnter(e, cota.id)}
                onDragLeave={(e) => handleDragLeave(e, cota.id)}
                onDrop={(e) => handleDrop(e, cota.id)}
              >
                {/* Header da Categoria */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg shadow-sm`} style={{ backgroundColor: cota.cor }}></div>
                      <div>
                        {editandoNomeCota === cota.id ? (
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={novoNomeCota}
                              onChange={(e) => setNovoNomeCota(e.target.value)}
                              className="text-xl font-bold text-gray-900 bg-white border-2 border-blue-500 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  salvarNomeCota(cota.id);
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => salvarNomeCota(cota.id)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelarEdicaoNomeCota}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 group">
                            <h2 className="subtitle-medium text-gray-900">{cota.nome}</h2>
                            <button
                              onClick={() => iniciarEdicaoNomeCota(cota.id, cota.nome)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                              title="Editar nome da categoria"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {cotas.length > 1 && (
                              <button
                                onClick={() => removerCotaHandler(cota.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Remover categoria"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-small text-gray-600">
                            {patrocinadoresdaCota.length} patrocinador{patrocinadoresdaCota.length !== 1 ? 'es' : ''}
                          </p>
                          {isDragOver && (
                            <span className="text-small bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              Solte aqui para mover
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setMostrarFormulario(mostrarFormulario === cota.id ? null : cota.id)}
                      className={`font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm ${
                        mostrarFormulario === cota.id
                          ? 'bg-gray-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      {mostrarFormulario === cota.id ? 'Fechar Formulário' : 'Adicionar Patrocinador'}
                    </button>
                  </div>
                </div>

                {/* Formulário para Novo Patrocinador */}
                {mostrarFormulario === cota.id && (
                  <div className="p-6 bg-blue-50 border-b border-gray-200">
                    <h3 className="subtitle-small text-gray-900 spacing-subtitle">
                      Novo Patrocinador - {cota.nome}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-caption text-gray-700">
                          Nome da Empresa *
                        </label>
                        <input
                          type="text"
                          value={novoPatrocinador.nome || ''}
                          onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, nome: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Digite o nome da empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-caption text-gray-700">
                          Categoria
                        </label>
                        <input
                          type="text"
                          value={novoPatrocinador.categoria || ''}
                          onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, categoria: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ex: Equipamentos Esportivos"
                        />
                      </div>
                      <div>
                        <label className="block text-caption text-gray-700">
                          Website
                        </label>
                        <input
                          type="url"
                          value={novoPatrocinador.website || ''}
                          onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="https://exemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-caption text-gray-700">
                          Tamanho do Logo
                        </label>
                        <select
                          value={novoPatrocinador.tamanho_logo || 'medio'}
                          onChange={(e) => setNovoPatrocinador(prev => ({ ...prev, tamanho_logo: e.target.value as 'grande' | 'medio' | 'pequeno' }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="grande">Grande</option>
                          <option value="medio">Médio</option>
                          <option value="pequeno">Pequeno</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-caption text-gray-700">
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
                          Logo da Empresa *
                        </label>
                        <div className="space-y-4">
                          {/* Upload de arquivo */}
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, false)}
                              className="hidden"
                              id={`upload-novo-${cota.id}`}
                            />
                            <label
                              htmlFor={`upload-novo-${cota.id}`}
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
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                        onClick={() => adicionarPatrocinadorHandler(cota.id)}
                        disabled={!novoPatrocinador.nome || !novoPatrocinador.logo}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                  {patrocinadoresdaCota.length === 0 ? (
                    <div className={`text-center py-12 transition-all duration-300 rounded-lg ${
                      isDragOver ? 'bg-blue-100 border-2 border-dashed border-blue-300' : 'text-gray-500'
                    }`}>
                      <Building2 className={`w-16 h-16 mx-auto mb-4 ${
                        isDragOver ? 'text-blue-400' : 'text-gray-300'
                      }`} />
                      <p className="text-gray-500">
                        Nenhum patrocinador nesta categoria ainda.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {patrocinadoresdaCota.map((patrocinador) => (
                        <div 
                          key={patrocinador.id} 
                          className={`relative bg-white rounded-lg shadow-sm border transition-all duration-300 cursor-move group select-none overflow-hidden ${
                            draggedPatrocinador?.id === patrocinador.id 
                              ? 'border-blue-400 bg-blue-50 shadow-lg opacity-50 transform rotate-1 scale-105' 
                              : dragOverPatrocinador === patrocinador.id
                              ? draggedPatrocinador?.categoria_id === patrocinador.categoria_id
                                ? 'border-green-400 bg-green-50 shadow-lg ring-2 ring-green-200 scale-105'
                                : 'border-orange-400 bg-orange-50 shadow-lg ring-2 ring-orange-200 scale-105'
                              : 'border-gray-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-1'
                          }`}
                          draggable={true}
                          onDragStart={(e) => {
                            console.log('🎯 DragStart chamado para:', patrocinador.nome);
                            e.stopPropagation();
                            handleDragStart(e, patrocinador);
                          }}
                          onDragEnd={(e) => {
                            console.log('🏁 DragEnd chamado para:', patrocinador.nome);
                            e.stopPropagation();
                            setDraggedPatrocinador(null);
                            setDragOverCota(null);
                            setDragOverPatrocinador(null);
                          }}
                          onDragOver={(e) => handleDragOverPatrocinador(e, patrocinador.id)}
                          onDragLeave={(e) => handleDragLeavePatrocinador(e, patrocinador.id)}
                          onDrop={(e) => handleDropOnPatrocinador(e, patrocinador)}
                          onMouseDown={(e) => {
                            console.log('🖱️ MouseDown em:', patrocinador.nome);
                          }}
                          style={{ touchAction: 'none' }}
                        >
                          {/* Header com Drag Handle e Ações */}
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                            <div className="flex items-center">
                              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1.5 shadow-sm">
                                <GripVertical className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setEditandoPatrocinador(patrocinador);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 bg-blue-500/90 hover:bg-blue-600 text-white p-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-sm"
                                title="Editar patrocinador"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  removerPatrocinadorHandler(patrocinador.id);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-sm"
                                title="Remover patrocinador"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Logo Section */}
                          <div className="pt-10 pb-3 px-3">
                            <div className="w-full h-32 bg-white rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center">
                              <img
                                src={patrocinador.logo}
                                alt={patrocinador.nome}
                                className="max-w-full max-h-full object-contain pointer-events-none"
                                draggable={false}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="flex items-center justify-center text-gray-400">
                                        <div class="text-center">
                                          <div class="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                            </svg>
                                          </div>
                                          <div class="text-xs">Logo não disponível</div>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* Informações */}
                          <div className="px-3 pb-3 space-y-2">
                            <div className="text-center">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight">{patrocinador.nome}</h4>
                              {patrocinador.categoria && (
                                <p className="text-xs text-gray-600 mt-1">{patrocinador.categoria}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                patrocinador.tamanho_logo === 'grande' ? 'bg-purple-100 text-purple-800' :
                                patrocinador.tamanho_logo === 'medio' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {patrocinador.tamanho_logo === 'grande' ? 'Grande' : 
                                 patrocinador.tamanho_logo === 'medio' ? 'Médio' : 'Pequeno'}
                              </span>
                            </div>

                            {patrocinador.website && (
                              <div className="flex justify-center mt-2">
                                <a 
                                  href={patrocinador.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors pointer-events-auto"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span className="max-w-24 truncate">{patrocinador.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                              </div>
                            )}

                            {patrocinador.descricao && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 text-center">
                                  {patrocinador.descricao}
                                </p>
                              </div>
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
      </div>

      {/* Modal para Nova Categoria */}
      {mostrandoFormularioNovaCota && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Nova Categoria de Patrocínio
              </h2>
              <button
                onClick={() => setMostrandoFormularioNovaCota(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Categoria *
                  </label>
                  <input
                    type="text"
                    value={novaCota.nome}
                    onChange={(e) => setNovaCota(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ex: Bronze, Apoiador Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor da Categoria
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={novaCota.cor}
                      onChange={(e) => setNovaCota(prev => ({ ...prev, cor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={novaCota.cor}
                      onChange={(e) => setNovaCota(prev => ({ ...prev, cor: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={adicionarNovaCota}
                  disabled={!novaCota.nome.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Criar Categoria
                </button>
                <button
                  onClick={() => {
                    setMostrandoFormularioNovaCota(false);
                    setNovaCota({ nome: '', cor: '#3B82F6', icone: 'Star' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editandoPatrocinador && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
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
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    value={editandoPatrocinador.nome || ''}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="https://exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho do Logo
                  </label>
                  <select
                    value={editandoPatrocinador.tamanho_logo || 'medio'}
                    onChange={(e) => setEditandoPatrocinador(prev => prev ? { ...prev, tamanho_logo: e.target.value as 'grande' | 'medio' | 'pequeno' } : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                    Logo da Empresa *
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
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
    </div>
  );
};

export default AdminPatrocinadores;