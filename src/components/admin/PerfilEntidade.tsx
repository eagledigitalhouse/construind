import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  X, Edit, Phone, Mail, MapPin, CreditCard, Calendar, User, Building2, 
  MessageSquare, Clock, Star, Globe, Instagram, Linkedin, 
  Home, Briefcase, FileText, History, Tag
} from 'lucide-react';
import { Entidade } from '../../types/entidades';

interface PerfilEntidadeProps {
  entidade: Entidade;
  onClose: () => void;
  onEdit: () => void;
}

const PerfilEntidade: React.FC<PerfilEntidadeProps> = ({ entidade, onClose, onEdit }) => {
  const [abaAtiva, setAbaAtiva] = useState('geral');

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return 'Não informado';
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const formatarCPF = (cpf: string) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarCNPJ = (cnpj: string) => {
    if (!cnpj) return 'Não informado';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatarData = (data: string) => {
    if (!data) return 'Não informado';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatarDataHora = (data: string) => {
    if (!data) return 'Não informado';
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800 border-green-200';
      case 'inativo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'arquivado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bloqueado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'baixa': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const renderEndereco = (endereco: any, tipo: string) => {
    if (!endereco || (!endereco.rua && !endereco.cep)) {
      return (
        <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>Endereço {tipo} não cadastrado</p>
        </div>
      );
    }

    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1 capitalize">
              {tipo === 'correspondencia' ? 'Correspondência' : tipo}
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{endereco.rua || 'Rua não informada'}, {endereco.numero || 'S/N'}</p>
              {endereco.complemento && <p>Complemento: {endereco.complemento}</p>}
              <p>{endereco.bairro || 'Bairro não informado'}</p>
              <p>{endereco.cidade || 'Cidade não informada'}/{endereco.estado || 'UF'}</p>
              <p>CEP: {endereco.cep || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full h-[95vh] flex flex-col shadow-2xl border border-gray-100">
        {/* Header clean */}
        <div className="bg-white border-b-2 border-gray-100 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">
                  {entidade.imagem_url ? (
                    <img
                      src={entidade.imagem_url}
                      alt={entidade.nome}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    entidade.nome.charAt(0).toUpperCase()
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${entidade.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'} rounded-full border-2 border-white flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900">{entidade.nome}</h1>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(entidade.status)} border px-3 py-1`}>
                    {entidade.status.charAt(0).toUpperCase() + entidade.status.slice(1)}
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1">
                    {entidade.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <Badge className={`${getPrioridadeColor(entidade.prioridade || 'normal')} border px-3 py-1`}>
                    {(entidade.prioridade || 'normal').charAt(0).toUpperCase() + (entidade.prioridade || 'normal').slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-600 text-lg">
                  {entidade.categoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {entidade.subcategoria && ` • ${entidade.subcategoria}`}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 self-end"
              >
                <X className="w-5 h-5" />
              </Button>
              <Button 
                onClick={onEdit} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 border border-blue-600"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              >
                <Edit className="w-4 h-4 mr-2 text-white" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="h-full flex flex-col">
            {/* Navegação limpa e minimalista */}
            <div className="p-6 bg-white border-b">
              <div className="grid grid-cols-6 gap-4">
                <button
                  onClick={() => setAbaAtiva('geral')}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                    abaAtiva === 'geral' 
                      ? 'border-gray-400 bg-gray-100 text-gray-800' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Geral</span>
                </button>
                <button
                  onClick={() => setAbaAtiva('contatos')}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                    abaAtiva === 'contatos' 
                      ? 'border-gray-400 bg-gray-100 text-gray-800' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-medium">Contatos</span>
                </button>
                <button
                  onClick={() => setAbaAtiva('enderecos')}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                    abaAtiva === 'enderecos' 
                      ? 'border-gray-400 bg-gray-100 text-gray-800' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Endereços</span>
                </button>
                <button
                  onClick={() => setAbaAtiva('financeiro')}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                    abaAtiva === 'financeiro' 
                      ? 'border-gray-400 bg-gray-100 text-gray-800' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">Financeiro</span>
                </button>
                <button
                  onClick={() => setAbaAtiva('organizacao')}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                    abaAtiva === 'organizacao' 
                      ? 'border-gray-400 bg-gray-100 text-gray-800' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Organização</span>
                </button>
                <button
                  onClick={() => setAbaAtiva('historico')}
                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                    abaAtiva === 'historico' 
                      ? 'border-gray-400 bg-gray-100 text-gray-800' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span className="text-sm font-medium">Histórico</span>
                </button>
              </div>
            </div>

            {/* Aba Geral - Layout Inovador */}
            <TabsContent value="geral" className="flex-1 overflow-y-auto p-6">


              {/* Grid de informações detalhadas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Dados específicos por tipo - Design Limpo */}
                {entidade.tipo === 'pessoa_fisica' && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
                        <p className="text-gray-500 text-sm">Informações da pessoa física</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">CPF</label>
                        <p className="text-gray-900 font-mono">{formatarCPF(entidade.dados_pessoa_fisica?.cpf || '')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Data de Nascimento</label>
                        <p className="text-gray-900">{formatarData(entidade.dados_pessoa_fisica?.data_nascimento || '')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Estado Civil</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_fisica?.estado_civil || 'Não informado'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Profissão</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_fisica?.profissao || 'Não informado'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 md:col-span-2">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Nacionalidade</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_fisica?.nacionalidade || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {entidade.tipo === 'pessoa_juridica' && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Dados da Empresa</h3>
                        <p className="text-gray-500 text-sm">Informações da pessoa jurídica</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">CNPJ</label>
                        <p className="text-gray-900 font-mono">{formatarCNPJ(entidade.dados_pessoa_juridica?.cnpj || '')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Razão Social</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_juridica?.razao_social || 'Não informado'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Nome Fantasia</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_juridica?.nome_fantasia || 'Não informado'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Ramo de Atividade</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_juridica?.ramo_atividade || 'Não informado'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 md:col-span-2">
                        <label className="text-sm font-medium text-gray-600 block mb-0.5">Porte da Empresa</label>
                        <p className="text-gray-900">{entidade.dados_pessoa_juridica?.porte_empresa?.replace(/\b\w/g, l => l.toUpperCase()) || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card de informações adicionais */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Informações do Sistema</h3>
                      <p className="text-gray-500 text-sm">Dados de controle e auditoria</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Data de Criação</label>
                      <p className="text-gray-900">{formatarDataHora(entidade.created_at || '')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Última Atualização</label>
                      <p className="text-gray-900">{formatarDataHora(entidade.updated_at || '')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Contatos - Design Limpo */}
            <TabsContent value="contatos" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email & Web - Design Limpo */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email & Web</h3>
                      <p className="text-gray-500 text-sm">Contatos digitais</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Email Principal</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.email_principal || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Email Secundário</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.email_secundario || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Site Oficial</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.site_oficial || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* Telefones - Design Limpo */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Telefones</h3>
                      <p className="text-gray-500 text-sm">Contatos telefônicos</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Telefone Celular</label>
                      <p className="text-gray-900">{formatarTelefone(entidade.contatos?.telefone_celular || '')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Telefone Fixo</label>
                      <p className="text-gray-900">{formatarTelefone(entidade.contatos?.telefone_fixo || '')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">WhatsApp</label>
                      <p className="text-gray-900">{formatarTelefone(entidade.contatos?.whatsapp || '')}</p>
                    </div>
                  </div>
                </div>

                {/* Redes Sociais - Design Limpo */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Redes Sociais</h3>
                      <p className="text-gray-500 text-sm">Presença digital</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Facebook</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.facebook || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Twitter</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.twitter || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Instagram</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.instagram || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">LinkedIn</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.linkedin || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">YouTube</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.youtube || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">TikTok</label>
                      <p className="text-gray-900 break-all">{entidade.contatos?.tiktok || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Endereços - Design Limpo */}
            <TabsContent value="enderecos" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Endereço Residencial</h3>
                      <p className="text-gray-500 text-sm">Local de moradia</p>
                    </div>
                  </div>
                  {renderEndereco(entidade.enderecos?.residencial, 'residencial')}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Endereço Comercial</h3>
                      <p className="text-gray-500 text-sm">Local de trabalho</p>
                    </div>
                  </div>
                  {renderEndereco(entidade.enderecos?.comercial, 'comercial')}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Endereço de Correspondência</h3>
                      <p className="text-gray-500 text-sm">Local para envio de documentos</p>
                    </div>
                  </div>
                  {renderEndereco(entidade.enderecos?.correspondencia, 'correspondencia')}
                </div>
              </div>
            </TabsContent>

            {/* Aba Financeiro - Design Limpo */}
            <TabsContent value="financeiro" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">PIX & Transferências</h3>
                      <p className="text-gray-500 text-sm">Dados para transferências</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Chave PIX</label>
                      <p className="text-gray-900 font-mono break-all">{entidade.dados_financeiros?.pix || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Limite de Crédito</label>
                      <p className="text-gray-900 font-mono">
                        {entidade.dados_financeiros?.limite_credito 
                          ? `R$ ${entidade.dados_financeiros.limite_credito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                          : 'Não informado'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Dados Bancários</h3>
                      <p className="text-gray-500 text-sm">Informações da conta</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 md:col-span-2">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Banco</label>
                      <p className="text-gray-900">{entidade.dados_financeiros?.banco || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Agência</label>
                      <p className="text-gray-900 font-mono">{entidade.dados_financeiros?.agencia || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Conta</label>
                      <p className="text-gray-900 font-mono">{entidade.dados_financeiros?.conta || 'Não informado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 md:col-span-2">
                      <label className="text-sm font-medium text-gray-600 block mb-0.5">Tipo de Conta</label>
                      <p className="text-gray-900">{entidade.dados_financeiros?.tipo_conta?.replace(/\b\w/g, l => l.toUpperCase()) || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Organização - Design Limpo */}
            <TabsContent value="organizacao" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tags e Categorização</h3>
                    <p className="text-gray-500 text-sm">Etiquetas e classificações</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {entidade.tags && entidade.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {entidade.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Tag className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">Nenhuma tag cadastrada</h4>
                      <p className="text-sm">Adicione tags para organizar melhor esta entidade</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Observações</h3>
                    <p className="text-gray-500 text-sm">Anotações e comentários</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Observações Gerais</label>
                    <div className="bg-white rounded-lg p-4 min-h-[80px] border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {entidade.observacoes || 'Nenhuma observação cadastrada'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Notas Internas</label>
                    <div className="bg-white rounded-lg p-4 min-h-[80px] border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {entidade.notas_internas || 'Nenhuma nota interna cadastrada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Próximo Contato</h3>
                    <p className="text-gray-500 text-sm">Agendamento de follow-up</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <label className="text-sm font-medium text-gray-600 block mb-0.5">Data e Hora Agendada</label>
                  <p className="text-gray-900">{formatarDataHora(entidade.proximo_contato || '')}</p>
                </div>
              </div>
            </TabsContent>

            {/* Aba Histórico - Design Limpo */}
            <TabsContent value="historico" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Histórico de Atividades</h3>
                <p className="text-gray-600 mb-6">Funcionalidade em desenvolvimento</p>
                <p className="text-gray-500">Em breve você poderá visualizar todas as interações e modificações realizadas nesta entidade</p>
              </div>

              {/* Informações básicas de criação e atualização */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Criação da Entidade</h3>
                      <p className="text-gray-500 text-sm">Registro inicial no sistema</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                    </div>
                    <p className="text-gray-900 font-medium">{formatarDataHora(entidade.created_at || '')}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Edit className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Última Atualização</h3>
                      <p className="text-gray-500 text-sm">Modificação mais recente</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <label className="text-sm font-medium text-gray-600">Data da Atualização</label>
                    </div>
                    <p className="text-gray-900 font-medium">{formatarDataHora(entidade.updated_at || '')}</p>
                  </div>
                </div>
              </div>

              {/* Preview do que virá */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Funcionalidades Futuras</h3>
                    <p className="text-gray-500 text-sm">Recursos em desenvolvimento</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900">Histórico de Edições</h4>
                    <p className="text-gray-600 text-sm">Rastreamento completo de todas as modificações realizadas</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900">Log de Interações</h4>
                    <p className="text-gray-600 text-sm">Registro detalhado de contatos e comunicações</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <Star className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900">Atividades do Sistema</h4>
                    <p className="text-gray-600 text-sm">Eventos automáticos e notificações importantes</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerfilEntidade;