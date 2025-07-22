import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
        toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
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
      <div className="min-h-screen bg-gradient-to-br from-[#0a2856] via-[#0a2856]/90 to-[#00d856]/20 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('/FESPIN -mapa svg.svg')] bg-center bg-no-repeat bg-contain opacity-5"></div>
        
        <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mb-4">
              <img 
                src="/LOGO HORIZONTAL AZUL DEGRADE.svg" 
                alt="FESPIN Logo" 
                className="h-12 mx-auto object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0a2856]">
              Recuperar Senha
            </CardTitle>
            <CardDescription className="text-gray-600">
              Digite seu email para receber as instruções de recuperação
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#00d856] hover:bg-[#00c04d] text-white font-medium transition-colors"
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
                  className="w-full h-11 text-gray-600 hover:text-[#0a2856]"
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a2856] via-[#0a2856]/90 to-[#00d856]/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/FESPIN -mapa svg.svg')] bg-center bg-no-repeat bg-contain opacity-5"></div>
      
      {/* Link para voltar ao site */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-white/80 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Site
      </Link>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mb-4">
            <img 
              src="/LOGO HORIZONTAL AZUL DEGRADE.svg" 
              alt="FESPIN Logo" 
              className="h-12 mx-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#0a2856]">
            Área Administrativa
          </CardTitle>
          <CardDescription className="text-gray-600">
            Faça login para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-[#00d856] focus:ring-[#00d856]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#00d856] hover:text-[#00c04d] transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-[#00d856] hover:bg-[#00c04d] text-white font-medium transition-colors"
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