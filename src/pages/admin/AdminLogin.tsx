import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft } from 'lucide-react';
import { showToast } from '@/lib/toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const { signIn, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        const from = (location.state as any)?.from || '/admin';
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsResetting(true);

    try {
      const result = await resetPassword(resetEmail);
      
      if (result.error) {
        setError(result.error);
      } else {
        showToast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsResetting(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,60,0,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,140,0,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,60,0,0.05),transparent_50%)]" />
        </div>
        
        <Card className="w-full max-w-md relative z-10 shadow-2xl border border-gray-800/50 bg-[#1a1a1a]/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <div className="mb-6">
              <img 
                src="/CONSTRUIND.svg" 
                alt="CONSTRUIND Logo" 
                className="h-16 mx-auto object-contain opacity-90"
              />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] bg-clip-text text-transparent">
                Recuperar Senha
              </span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Digite seu email para receber as instruções de recuperação
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 h-11 bg-[#2d2d2d]/50 border-gray-700 text-white placeholder-gray-500 focus:border-[#ff3c00] focus:ring-[#ff3c00]/20"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] hover:from-[#e63600] hover:to-[#e67e00] text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Email de Recuperação'
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full h-11 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setResetEmail('');
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,60,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,140,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,60,0,0.05),transparent_50%)]" />
      </div>
      
      {/* Link para voltar ao site */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-white/80 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Site
      </Link>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border border-gray-800/50 bg-[#1a1a1a]/95 backdrop-blur-xl">
        <CardHeader className="text-center pb-6">
          <div className="mb-6">
            <img 
              src="/CONSTRUIND.svg" 
              alt="CONSTRUIND Logo" 
              className="h-16 mx-auto object-contain opacity-90"
            />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] bg-clip-text text-transparent">
              CONSTRUIND 2025
            </span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Área Administrativa - Faça login para acessar o painel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-[#2d2d2d]/50 border-gray-700 text-white placeholder-gray-500 focus:border-[#ff3c00] focus:ring-[#ff3c00]/20"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-[#2d2d2d]/50 border-gray-700 text-white placeholder-gray-500 focus:border-[#ff3c00] focus:ring-[#ff3c00]/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#ff3c00] hover:text-[#ff8c00] transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] hover:from-[#e63600] hover:to-[#e67e00] text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Acesso restrito a administradores autorizados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;