import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Building2, Eye, Edit, Trash2, Phone, Mail, MessageCircle, Grid, List, Table, CheckCircle, Building, User, ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import MetricCard from '../../components/ui/metric-card';
import { useEntidades } from '../../hooks/useEntidades';
import FormularioEntidade from '../../components/admin/FormularioEntidade';
import PerfilEntidade from '../../components/admin/PerfilEntidade';
import {
  Entidade,
  FiltrosEntidades,
  TipoEntidade,
  CategoriaEntidade,
  StatusEntidade,
  ModoVisualizacao
} from '../../types/entidades';

const AdminEntidades: React.FC = () => {
  const {
    entidades,
    loading,
    error,
    estatisticas,
    buscarEntidades,
    excluirEntidade,
    buscarEstatisticas
  } = useEntidades();

  const [filtros, setFiltros] = useState<FiltrosEntidades>({});
  const [modoVisualizacao, setModoVisualizacao] = useState<ModoVisualizacao>('cards');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [entidadeSelecionada, setEntidadeSelecionada] = useState<Entidade | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
    buscarEstatisticas();
  }, []);

  // Recarregar quando filtros mudarem
  useEffect(() => {
    carregarDados();
  }, [filtros, paginaAtual]);

  const carregarDados = async () => {
    try {
      const resultado = await buscarEntidades(filtros, paginaAtual, 20);
      setTotalPaginas(resultado.total_paginas);
    } catch (err) {
      console.error('Erro ao carregar entidades:', err);
    }
  };

  const handleBusca = (texto: string) => {
    setFiltros(prev => ({ ...prev, busca_texto: texto }));
    setPaginaAtual(1);
  };

  const handleFiltroChange = (campo: keyof FiltrosEntidades, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaAtual(1);
  };

  const limparFiltros = () => {
    setFiltros({});
    setPaginaAtual(1);
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entidade?')) {
      const sucesso = await excluirEntidade(id);
      if (sucesso) {
        carregarDados();
        buscarEstatisticas();
      }
    }
  };

  const abrirWhatsApp = (numero: string) => {
    const numeroLimpo = numero.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
  };

  const abrirEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const getCategoriaLabel = (categoria: CategoriaEntidade): string => {
    const labels: Record<CategoriaEntidade, string> = {
      fornecedores: 'Fornecedores',
      patrocinadores: 'Patrocinadores',
      parceiros: 'Parceiros',
      clientes: 'Clientes',
      expositores: 'Expositores',
      prestadores_servico: 'Prestadores de Serviço',
      midia: 'Mídia',
      governo: 'Governo',
      outros: 'Outros'
    };
    return labels[categoria];
  };

  const getStatusColor = (status: StatusEntidade): string => {
    const colors: Record<StatusEntidade, string> = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      arquivado: 'bg-yellow-100 text-yellow-800',
      bloqueado: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getNomeEntidade = (entidade: Entidade): string => {
    if (entidade.tipo === 'pessoa_fisica') {
      return entidade.nome || 'Nome não informado';
    } else {
      return entidade.dados_pessoa_juridica?.razao_social || 
             entidade.dados_pessoa_juridica?.nome_fantasia || 
             entidade.nome || 
             'Razão social não informada';
    }
  };

  const renderCardEntidade = (entidade: Entidade) => (
    <Card 
      key={entidade.id} 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden cursor-pointer relative group"
      onClick={() => {
        setEntidadeSelecionada(entidade);
        setMostrarPerfil(true);
      }}
    >
      {/* Ícone de lixeira no hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleExcluir(entidade.id);
          }}
          className="w-8 h-8 p-0 bg-white hover:bg-red-50 border-red-200 hover:border-red-300 shadow-sm"
          title="Excluir entidade"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
      <CardContent className="p-6 text-center">
        {/* Avatar circular com bolinha de status */}
        <div className="relative mb-4 flex justify-center">
          <div className="relative">
            {entidade.imagem_url ? (
              <img
                src={entidade.imagem_url}
                alt={getNomeEntidade(entidade)}
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {getNomeEntidade(entidade).charAt(0).toUpperCase()}
              </div>
            )}
            {/* Bolinha de status */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${
              entidade.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
            } rounded-full border-2 border-white flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Nome centralizado */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {getNomeEntidade(entidade)}
        </h3>
        
        {/* Categoria */}
         <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border-0">
           {getCategoriaLabel(entidade.categoria)}
         </Badge>

        {/* Botões de ação */}
        <div className="flex justify-center gap-3">
          {entidade.contatos?.telefone_celular && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => ligarTelefone(entidade.contatos.telefone_celular)}
              className="w-10 h-10 rounded-full p-0 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              title="Ligar"
            >
              <Phone className="w-4 h-4 text-blue-600" />
            </Button>
          )}
          
          {entidade.contatos?.whatsapp && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => abrirWhatsApp(entidade.contatos.whatsapp)}
              className="w-10 h-10 rounded-full p-0 border-gray-200 hover:bg-green-50 hover:border-green-300"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
            </Button>
          )}
          
          {entidade.contatos?.email_principal && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => abrirEmail(entidade.contatos.email_principal)}
              className="w-10 h-10 rounded-full p-0 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
              title="Email"
            >
              <Mail className="w-4 h-4 text-purple-600" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEntidadeSelecionada(entidade);
              setMostrarFormulario(true);
            }}
            className="w-10 h-10 rounded-full p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            title="Editar"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );



  const ligarTelefone = (telefone: string) => {
    window.open(`tel:${telefone}`, '_blank');
  };

  const renderListaEntidade = (entidade: Entidade) => (
    <div key={entidade.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{getNomeEntidade(entidade)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={entidade.tipo === 'pessoa_fisica' ? 'default' : 'secondary'} className="text-xs">
                  {entidade.tipo === 'pessoa_fisica' ? 'PF' : 'PJ'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getCategoriaLabel(entidade.categoria)}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(entidade.status)}`}>
                  {entidade.status}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600 text-right">
              {entidade.contatos?.email_principal && (
                <p>{entidade.contatos.email_principal}</p>
              )}
              {entidade.contatos?.telefone_celular && (
                <p>{entidade.contatos.telefone_celular}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {entidade.contatos?.whatsapp && (
            <Button variant="outline" size="sm" onClick={() => abrirWhatsApp(entidade.contatos.whatsapp)}>
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEntidadeSelecionada(entidade);
              setMostrarFormulario(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExcluir(entidade.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabelaEntidades = () => (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nome/Razão Social</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Categoria</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Contato</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entidades.map((entidade) => (
            <tr key={entidade.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">{getNomeEntidade(entidade)}</div>
                  {entidade.tipo === 'pessoa_juridica' && entidade.dados_pessoa_juridica?.nome_fantasia && (
                    <div className="text-sm text-gray-500">{entidade.dados_pessoa_juridica.nome_fantasia}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={entidade.tipo === 'pessoa_fisica' ? 'default' : 'secondary'}>
                  {entidade.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline">{getCategoriaLabel(entidade.categoria)}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={getStatusColor(entidade.status)}>
                  {entidade.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  {entidade.contatos?.email_principal && (
                    <div>{entidade.contatos.email_principal}</div>
                  )}
                  {entidade.contatos?.telefone_celular && (
                    <div>{entidade.contatos.telefone_celular}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {entidade.contatos?.whatsapp && (
                    <Button variant="outline" size="sm" onClick={() => abrirWhatsApp(entidade.contatos.whatsapp)}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEntidadeSelecionada(entidade);
                      setMostrarFormulario(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExcluir(entidade.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



  if (loading && entidades.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando entidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 admin-page">
      <div className="space-y-6">
      {/* Cabeçalho */}
      <PageHeader
         title="Entidades"
         description="Gerencie seus contatos e relacionamentos"
         icon={Users}
         actions={[
           {
             label: "Nova Entidade",
             icon: Plus,
             onClick: () => setMostrarFormulario(true)
           }
         ]}
       />

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Entidades"
            value={estatisticas.total}
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <MetricCard
            title="Entidades Ativas"
            value={estatisticas.por_status.ativo}
            icon={<CheckCircle className="h-6 w-6" />}
            color="green"
          />
          <MetricCard
            title="Empresas"
            value={estatisticas.por_tipo.pessoa_juridica}
            icon={<Building className="h-6 w-6" />}
            color="purple"
          />
          <MetricCard
            title="Pessoas Físicas"
            value={estatisticas.por_tipo.pessoa_fisica}
            icon={<User className="h-6 w-6" />}
            color="orange"
          />
        </div>
      )}

      {/* Barra de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email, CPF, CNPJ..."
              className="pl-10"
              value={filtros.busca_texto || ''}
              onChange={(e) => handleBusca(e.target.value)}
            />
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        
        {/* Seletor de modo de visualização */}
        <div className="flex border rounded-lg">
          <Button
            variant={modoVisualizacao === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setModoVisualizacao('cards')}
            className="rounded-r-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={modoVisualizacao === 'lista' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setModoVisualizacao('lista')}
            className="rounded-none border-x-0"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={modoVisualizacao === 'tabela' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setModoVisualizacao('tabela')}
            className="rounded-l-none"
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {mostrarFiltros && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                value={filtros.tipo?.[0] || ''}
                onValueChange={(value) => 
                  handleFiltroChange('tipo', value ? [value as TipoEntidade] : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                  <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filtros.categoria?.[0] || ''}
                onValueChange={(value) => 
                  handleFiltroChange('categoria', value ? [value as CategoriaEntidade] : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
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

              <Select
                value={filtros.status?.[0] || ''}
                onValueChange={(value) => 
                  handleFiltroChange('status', value ? [value as StatusEntidade] : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de entidades */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Visualização em Cards */}
      {modoVisualizacao === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entidades.map(renderCardEntidade)}
        </div>
      )}

      {/* Visualização em Lista */}
      {modoVisualizacao === 'lista' && (
        <div className="space-y-4">
          {entidades.map(renderListaEntidade)}
        </div>
      )}

      {/* Visualização em Tabela */}
      {modoVisualizacao === 'tabela' && renderTabelaEntidades()}

      {entidades.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma entidade encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            {Object.keys(filtros).length > 0
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira entidade'
            }
          </p>
          <Button onClick={() => setMostrarFormulario(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Entidade
          </Button>
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual(prev => prev - 1)}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <Button
            variant="outline"
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual(prev => prev + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Modal de perfil */}
      {mostrarPerfil && entidadeSelecionada && (
        <PerfilEntidade
          entidade={entidadeSelecionada}
          onClose={() => {
            setMostrarPerfil(false);
            setEntidadeSelecionada(null);
          }}
          onEdit={() => {
            setMostrarPerfil(false);
            setMostrarFormulario(true);
          }}
          onDelete={(id) => {
            setMostrarPerfil(false);
            setEntidadeSelecionada(null);
            handleExcluir(id);
          }}
        />
      )}

      {/* Formulário de criação/edição */}
      {mostrarFormulario && (
        <FormularioEntidade
          entidade={entidadeSelecionada}
          onClose={() => {
            setMostrarFormulario(false);
            setEntidadeSelecionada(null);
          }}
          onSave={() => {
            carregarDados();
            buscarEstatisticas();
          }}
        />
      )}
      </div>
    </div>
  );
};

export default AdminEntidades;