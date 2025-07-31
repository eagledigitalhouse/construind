import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Notificacao {
  id: string;
  tipo: 'newsletter' | 'pre-inscricao';
  titulo: string;
  descricao: string;
  lida: boolean;
  criadaEm: Date;
  dadosExtras?: {
    nome?: string;
    stand?: string;
    email?: string;
  };
}

export const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [contadorNaoLidas, setContadorNaoLidas] = useState(0);
  const [loading, setLoading] = useState(true);

  // Função para adicionar nova notificação
  const adicionarNotificacao = (notificacao: Omit<Notificacao, 'id' | 'criadaEm'>) => {
    console.log('➕ Adicionando notificação:', notificacao);
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: Date.now().toString(),
      criadaEm: new Date()
    };
    
    setNotificacoes(prev => {
      console.log('📊 Notificações antes:', prev.length);
      const novas = [novaNotificacao, ...prev];
      console.log('📊 Notificações depois:', novas.length);
      return novas;
    });
    
    if (!novaNotificacao.lida) {
      setContadorNaoLidas(prev => {
        console.log('🔢 Contador antes:', prev, 'depois:', prev + 1);
        return prev + 1;
      });
    }
    console.log('✅ Notificação adicionada com sucesso!');
  };

  // Função para marcar notificação como lida
  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => {
        if (notif.id === id && !notif.lida) {
          setContadorNaoLidas(count => Math.max(0, count - 1));
          return { ...notif, lida: true };
        }
        return notif;
      })
    );
  };

  // Função para marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    );
    setContadorNaoLidas(0);
  };

  // Função para remover notificação
  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => {
      const notificacao = prev.find(n => n.id === id);
      if (notificacao && !notificacao.lida) {
        setContadorNaoLidas(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  };

  // Configurar listeners em tempo real
  useEffect(() => {
    console.log('🔔 Iniciando listeners de notificações...');
    setLoading(true);

    // Listener para newsletters
    const newsletterChannel = supabase
      .channel('newsletter-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'newsletters'
        },
        (payload) => {
          console.log('🎉 NOVA INSCRIÇÃO DETECTADA!', payload);
          const novoSubscriber = payload.new as any;
          const agora = new Date();
          const horario = agora.toLocaleTimeString('pt-BR');
          
          console.log('📝 Criando notificação para:', novoSubscriber);
          adicionarNotificacao({
            tipo: 'newsletter',
            titulo: 'Nova inscrição na newsletter',
            descricao: `${novoSubscriber.nome || novoSubscriber.email} se cadastrou na newsletter às ${horario}`,
            lida: false,
            dadosExtras: {
              nome: novoSubscriber.nome,
              email: novoSubscriber.email
            }
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do canal newsletter:', status);
      });

    // Listener para pré-inscrições
    const preInscricaoChannel = supabase
      .channel('pre-inscricao-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pre_inscricao_expositores'
        },
        (payload) => {
          const novaPreInscricao = payload.new as any;
          adicionarNotificacao({
            tipo: 'pre-inscricao',
            titulo: 'Nova pré-inscrição recebida',
            descricao: `${novaPreInscricao.nome_empresa} se inscreveu para o stand ${novaPreInscricao.stand_preferido}`,
            lida: false,
            dadosExtras: {
              nome: novaPreInscricao.nome_empresa,
              stand: novaPreInscricao.stand_preferido,
              email: novaPreInscricao.email
            }
          });
        }
      )
      .subscribe();

    setLoading(false);

    // Cleanup
    return () => {
      supabase.removeChannel(newsletterChannel);
      supabase.removeChannel(preInscricaoChannel);
    };
  }, []);

  // Função de teste para adicionar notificação manualmente
  const testarNotificacao = () => {
    console.log('🧪 TESTE: Adicionando notificação manual...');
    adicionarNotificacao({
      tipo: 'newsletter',
      titulo: 'Teste de Notificação',
      descricao: `Teste realizado às ${new Date().toLocaleTimeString('pt-BR')}`,
      lida: false,
      dadosExtras: {
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com'
      }
    });
  };

  // Expor função de teste no window para debug
  if (typeof window !== 'undefined') {
    (window as any).testarNotificacao = testarNotificacao;
  }

  return {
    notificacoes,
    contadorNaoLidas,
    loading,
    adicionarNotificacao,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao,
    testarNotificacao
  };
};