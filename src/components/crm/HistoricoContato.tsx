import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  History, 
  Plus, 
  Calendar, 
  User, 
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit
} from 'lucide-react';
import { type ContatoHistorico } from '@/hooks/useCRM';
import { toast } from 'sonner';

interface HistoricoContatoProps {
  contatoId: string;
  buscarHistorico: (contatoId: string) => Promise<ContatoHistorico[]>;
  adicionarObservacao?: (contatoId: string, observacao: string) => Promise<void>;
}

const HistoricoContato: React.FC<HistoricoContatoProps> = ({ 
  contatoId, 
  buscarHistorico,
  adicionarObservacao 
}) => {
  const [historico, setHistorico] = useState<ContatoHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaObservacao, setNovaObservacao] = useState('');
  const [adicionandoObservacao, setAdicionandoObservacao] = useState(false);

  useEffect(() => {
    carregarHistorico();
  }, [contatoId]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const dados = await buscarHistorico(contatoId);
      setHistorico(dados);
    } catch (error) {
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarObservacao = async () => {
    if (!novaObservacao.trim()) {
      toast.error('Digite uma observação');
      return;
    }

    if (!adicionarObservacao) {
      toast.error('Função de adicionar observação não disponível');
      return;
    }

    try {
      setAdicionandoObservacao(true);
      await adicionarObservacao(contatoId, novaObservacao);
      setNovaObservacao('');
      await carregarHistorico(); // Recarregar histórico
      toast.success('Observação adicionada com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar observação');
    } finally {
      setAdicionandoObservacao(false);
    }
  };

  const obterIconeAcao = (acao: string) => {
    switch (acao) {
      case 'status_alterado':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'prioridade_alterada':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'observacao_adicionada':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'contato_criado':
        return <Plus className="w-4 h-4 text-purple-500" />;
      default:
        return <Edit className="w-4 h-4 text-gray-500" />;
    }
  };

  const obterCorAcao = (acao: string) => {
    switch (acao) {
      case 'status_alterado':
        return 'bg-blue-100 text-blue-800';
      case 'prioridade_alterada':
        return 'bg-yellow-100 text-yellow-800';
      case 'observacao_adicionada':
        return 'bg-green-100 text-green-800';
      case 'contato_criado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatarAcao = (acao: string) => {
    switch (acao) {
      case 'status_alterado':
        return 'Status Alterado';
      case 'prioridade_alterada':
        return 'Prioridade Alterada';
      case 'observacao_adicionada':
        return 'Observação Adicionada';
      case 'contato_criado':
        return 'Contato Criado';
      default:
        return acao.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico do Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2">Carregando histórico...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico do Contato ({historico.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Adicionar Nova Observação */}
        {adicionarObservacao && (
          <div className="border-b pb-4">
            <Label htmlFor="nova-observacao">Adicionar Nova Observação</Label>
            <div className="mt-2 space-y-2">
              <Textarea
                id="nova-observacao"
                placeholder="Digite sua observação sobre este contato..."
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleAdicionarObservacao}
                disabled={adicionandoObservacao || !novaObservacao.trim()}
                size="sm"
              >
                {adicionandoObservacao ? (
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Adicionar Observação
              </Button>
            </div>
          </div>
        )}

        {/* Lista do Histórico */}
        <div className="space-y-4">
          {historico.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum histórico encontrado para este contato.</p>
            </div>
          ) : (
            historico.map((item, index) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {obterIconeAcao(item.acao)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={obterCorAcao(item.acao)}>
                      {formatarAcao(item.acao)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  {item.descricao && (
                    <p className="text-gray-700">{item.descricao}</p>
                  )}
                  
                  {/* Mostrar dados anteriores e novos se disponíveis */}
                  {(item.dados_anteriores || item.dados_novos) && (
                    <div className="mt-3 p-3 bg-white rounded border text-sm">
                      {item.dados_anteriores && (
                        <div className="mb-2">
                          <span className="font-medium text-red-600">Dados Anteriores:</span>
                          <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(item.dados_anteriores, null, 2)}
                          </pre>
                        </div>
                      )}
                      {item.dados_novos && (
                        <div>
                          <span className="font-medium text-green-600">Dados Novos:</span>
                          <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(item.dados_novos, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {item.usuario_id && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      Usuário: {item.usuario_id}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricoContato;