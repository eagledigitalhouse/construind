import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = true 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading apenas por um tempo muito curto
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00d856]" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, redirecionar para login
  if (!user) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Se estiver logado, permitir acesso (qualquer usuário logado é admin)
  return <>{children}</>;
};

export default ProtectedRoute;