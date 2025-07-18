import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Mail, Phone, Building, Calendar, MessageSquare } from 'lucide-react';
import { useCRM } from '@/hooks/useCRM';
import { Contato } from '@/hooks/useCRM';

// Tipos de formulário disponíveis
const TIPOS_FORMULARIO = {
  'contato-geral': 'Contato Geral',
  'patrocinio': 'Patrocínio',
  'expositor': 'Expositor',
  'palestrante': 'Palestrante',
  'imprensa': 'Imprensa'
};

const AdminCRM: React.FC = () => {
  const { contatos, loading, fetchContatos } = useCRM();
  const [formularioSelecionado, setFormularioSelecionado] = useState<string | null>(null);
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);

  useEffect(() => {
    fetchContatos();
  }, []);

  // Agrupar contatos por tipo de formulário
  const contatosPorFormulario = Object.keys(TIPOS_FORMULARIO).reduce((acc, tipo) => {
    acc[tipo] = contatos.filter(contato => contato.tipo_formulario_id === tipo);
    return acc;
  }, {} as Record<string, Contato[]>);

  // Obter dados formatados do contato
  const obterDadosContato = (dados: any) => {
    if (typeof dados === 'string') {
      try {
        return JSON.parse(dados);
      } catch {
        return {};
      }
    }
    return dados || {};
  };

  const abrirFormulario = (tipo: string) => {
    setFormularioSelecionado(tipo);
  };

  const voltarParaFormularios = () => {
    setFormularioSelecionado(null);
    setContatoSelecionado(null);
  };

  const abrirDetalhesContato = (contato: Contato) => {
    setContatoSelecionado(contato);
  };

  const fecharDetalhes = () => {
    setContatoSelecionado(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Visualização dos formulários */}
      {!formularioSelecionado && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Formulários de Contato</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TIPOS_FORMULARIO).map(([tipo, nome]) => {
              const quantidade = contatosPorFormulario[tipo]?.length || 0;
              
              return (
                <Card 
                  key={tipo} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => abrirFormulario(tipo)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{nome}</span>
                      <Badge variant="secondary">{quantidade}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {quantidade === 0 ? 'Nenhum contato' : 
                       quantidade === 1 ? '1 contato recebido' : 
                       `${quantidade} contatos recebidos`}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Visualização dos contatos do formulário selecionado */}
      {formularioSelecionado && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={voltarParaFormularios}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">
              {TIPOS_FORMULARIO[formularioSelecionado as keyof typeof TIPOS_FORMULARIO]}
            </h1>
            <Badge variant="secondary">
              {contatosPorFormulario[formularioSelecionado]?.length || 0} contatos
            </Badge>
          </div>

          <div className="space-y-4">
            {contatosPorFormulario[formularioSelecionado]?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Nenhum contato recebido ainda</p>
                </CardContent>
              </Card>
            ) : (
              contatosPorFormulario[formularioSelecionado]?.map((contato) => {
                const dados = obterDadosContato(contato.dados);
                
                return (
                  <Card 
                    key={contato.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => abrirDetalhesContato(contato)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{dados.nome || 'Nome não informado'}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {dados.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{dados.email}</span>
                              </div>
                            )}
                            
                            {dados.telefone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{dados.telefone}</span>
                              </div>
                            )}
                            
                            {dados.empresa && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building className="w-4 h-4" />
                                <span>{dados.empresa}</span>
                              </div>
                            )}
                          </div>
                          
                          {dados.mensagem && (
                            <div className="bg-gray-50 rounded p-3 mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Mensagem:</span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-3">{dados.mensagem}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(contato.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            #{contato.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal de detalhes do contato */}
      <Dialog open={!!contatoSelecionado} onOpenChange={fecharDetalhes}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {contatoSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Detalhes do Contato - {TIPOS_FORMULARIO[contatoSelecionado.tipo_formulario_id as keyof typeof TIPOS_FORMULARIO]}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {(() => {
                  const dados = obterDadosContato(contatoSelecionado.dados);
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome</label>
                          <p className="text-gray-900">{dados.nome || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <p className="text-gray-900">{dados.email || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Telefone</label>
                          <p className="text-gray-900">{dados.telefone || 'Não informado'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Empresa</label>
                          <p className="text-gray-900">{dados.empresa || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      {dados.mensagem && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Mensagem</label>
                          <div className="bg-gray-50 rounded p-4">
                            <p className="text-gray-900 whitespace-pre-wrap">{dados.mensagem}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Mostrar todos os outros campos do formulário */}
                      {Object.entries(dados)
                        .filter(([key]) => !['nome', 'email', 'telefone', 'empresa', 'mensagem'].includes(key))
                        .map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium mb-1 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <p className="text-gray-900">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </p>
                          </div>
                        ))
                      }
                      
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Data de envio:</span>
                            <br />
                            {new Date(contatoSelecionado.created_at).toLocaleString('pt-BR')}
                          </div>
                          <div>
                            <span className="font-medium">ID:</span>
                            <br />
                            <span className="font-mono">{contatoSelecionado.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCRM;