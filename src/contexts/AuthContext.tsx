import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasShownLoginToast, setHasShownLoginToast] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Erro ao obter sessão:', error);
          }
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro inesperado ao obter sessão:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Apenas mostrar toast em eventos específicos de login/logout
          if (event === 'SIGNED_IN' && !hasShownLoginToast) {
            toast.success('Login realizado com sucesso!');
            setHasShownLoginToast(true);
          } else if (event === 'SIGNED_OUT') {
            toast.success('Logout realizado com sucesso!');
            setHasShownLoginToast(false);
          }
        }
      }
    );

    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 3000); // 3 segundos máximo

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [hasShownLoginToast]);

  const signIn = async (email: string, password: string) => {
    try {
      // Resetar o flag antes de tentar login
      setHasShownLoginToast(false);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
        }
        
        return { error: errorMessage };
      }

      return { error: undefined };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return { error: 'Erro inesperado. Tente novamente' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        toast.error('Erro ao fazer logout');
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      toast.error('Erro inesperado ao fazer logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        let errorMessage = 'Erro ao enviar email de recuperação';
        
        if (error.message.includes('User not found')) {
          errorMessage = 'Email não encontrado';
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'Limite de emails excedido. Tente novamente em alguns minutos';
        }
        
        return { error: errorMessage };
      }

      return { error: undefined };
    } catch (error) {
      console.error('Erro inesperado na recuperação de senha:', error);
      return { error: 'Erro inesperado. Tente novamente' };
    }
  };

  const value = {
    user,
    session,
    isAdmin: !!user, // QUALQUER usuário logado é admin
    loading,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};