import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Mail, Users, Check, CheckCheck, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Notificacao } from '@/hooks/useNotificacoes';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificacoesPainelProps {
  notificacoes: Notificacao[];
  contadorNaoLidas: number;
  onMarcarComoLida: (id: string) => void;
  onMarcarTodasComoLidas: () => void;
  onRemoverNotificacao: (id: string) => void;
  onNavegar: (tipo: string) => void;
}

const NotificacoesPainel: React.FC<NotificacoesPainelProps> = ({
  notificacoes,
  contadorNaoLidas,
  onMarcarComoLida,
  onMarcarTodasComoLidas,
  onRemoverNotificacao,
  onNavegar
}) => {
  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case 'newsletter':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
        );
      case 'pre-inscricao':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <Users className="w-4 h-4 text-green-600" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
            <Bell className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'newsletter':
        return 'Newsletter';
      case 'pre-inscricao':
        return 'Pré-inscrição';
      default:
        return 'Notificação';
    }
  };

  const handleClicarNotificacao = (notificacao: Notificacao) => {
    if (!notificacao.lida) {
      onMarcarComoLida(notificacao.id);
    }
    
    // Navegar para a seção apropriada
    if (notificacao.tipo === 'newsletter') {
      onNavegar('newsletters');
    } else if (notificacao.tipo === 'pre-inscricao') {
      onNavegar('pre-inscricoes');
    }
  };

  return (
    <Card className="w-[420px] shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="-space-y-2">
                 <CardTitle className="text-lg font-semibold text-gray-900 leading-none mt-2">
                   Notificações
                 </CardTitle>
                 <p className="text-sm text-gray-500 -mt-2">
                   {contadorNaoLidas > 0 ? `${contadorNaoLidas} não lidas` : 'Todas lidas'}
                 </p>
             </div>
          </div>
          {contadorNaoLidas > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarcarTodasComoLidas}
              className="text-xs h-8 px-3 border-gray-200 hover:bg-gray-50"
            >
              <CheckCheck className="w-3 h-3 mr-1.5" />
              Marcar todas
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {notificacoes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <div className="-space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 leading-none">Nenhuma notificação</h3>
                  <p className="text-xs text-gray-500 text-center -mt-1">Você está em dia com todas as notificações</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notificacoes.map((notificacao) => (
                  <motion.div
                    key={notificacao.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`relative group transition-all duration-200 ${
                      !notificacao.lida 
                        ? 'bg-blue-50/50 hover:bg-blue-50' 
                        : 'bg-white hover:bg-gray-25'
                    } cursor-pointer`}
                    onClick={() => handleClicarNotificacao(notificacao)}
                  >
                    {!notificacao.lida && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
                    )}
                    
                    <div className="flex items-start gap-3 p-4">
                      {getIconeNotificacao(notificacao.tipo)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 font-medium"
                          >
                            {getTipoLabel(notificacao.tipo)}
                          </Badge>
                          {!notificacao.lida && (
                            <Dot className="w-4 h-4 text-blue-500 -ml-1" />
                          )}
                        </div>
                        
                        <h4 className={`text-sm font-medium leading-tight mb-1 ${
                          !notificacao.lida ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notificacao.titulo}
                        </h4>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                          {notificacao.descricao}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">
                            {formatDistanceToNow(notificacao.criadaEm, {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notificacao.lida && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarcarComoLida(notificacao.id);
                            }}
                            className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                            title="Marcar como lida"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoverNotificacao(notificacao.id);
                          }}
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                          title="Remover notificação"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificacoesPainel;