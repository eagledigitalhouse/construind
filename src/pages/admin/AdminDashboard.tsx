import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import {
  LayoutDashboard,
  Building2,
  Users,
  RefreshCw,
  Mail,
  Store,
  ClipboardList,
  FileText,
  Newspaper,
  ChevronRight,
  ChevronDown,
  Globe
} from 'lucide-react';
// Removido SidebarProvider e useSidebar - não necessários com a nova sidebar
import FespinSidebar from '@/components/admin/FespinSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import FespinDashboard from '@/components/admin/FespinDashboard';
import AdminPatrocinadores from './AdminPatrocinadores';
import AdminExpositores from './AdminExpositores';
import AdminStands from './AdminStands';
import AdminPreInscricaoExpositores from './AdminPreInscricaoExpositores';
import AdminNewsletter from './AdminNewsletter';
import AdminContratos from './AdminContratos';


import AdminEntidades from './AdminEntidades';
import AdminAgenda from './AdminAgenda';
import Messages from '../Messages';
import ErrorBoundary from '@/components/ErrorBoundary';

import { useNotificacoes } from '@/hooks/useNotificacoes';
import NotificacoesPainel from '@/components/admin/NotificacoesPainel';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'gestao-website': false,
    'gestao': false,
    'formularios': false,
    'financeiro': false
  });
  const {
    notificacoes,
    contadorNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    removerNotificacao
  } = useNotificacoes();
  const [atualizandoDados, setAtualizandoDados] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getUserInitials = (email) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email) => {
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  };

  const atualizarDados = async () => {
    setAtualizandoDados(true);
    // Simular atualização
    setTimeout(() => {
      setAtualizandoDados(false);
    }, 2000);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Função para fechar todas as seções quando a sidebar retrair
  const closeAllSections = () => {
    setExpandedSections({
      'gestao-website': false,
      'gestao': false,
      'formularios': false,
      'financeiro': false
    });
  };

  // Função para renderizar o conteúdo baseado na seção ativa
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'pagina-inicial':
        window.location.href = '/';
        return <DashboardContent />;
      case 'patrocinadores':
        return <AdminPatrocinadores />;
      case 'expositores':
        return <AdminExpositores />;
      case 'entidades':
        return <AdminEntidades />;
      case 'stands':
        return <AdminStands />;
      case 'pre-inscricoes':
        return <AdminPreInscricaoExpositores />;
      case 'contratos':
        return <AdminContratos />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'messages':
        return <Messages />;
      case 'agenda':
        return <AdminAgenda />;
      default:
        return <DashboardContent />;
    }
  };

  // Componente do Dashboard
  const DashboardContent = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Painel Administrativo"
          description="Gerencie todos os aspectos da FESPIN 2025"
          icon={LayoutDashboard}
          actions={[
            {
              label: "Atualizar",
              icon: RefreshCw,
              variant: "outline",
              // Remove size prop as it's not defined in ActionButton type
              onClick: atualizarDados,
              disabled: atualizandoDados,
              customClassName: `${atualizandoDados ? 'animate-spin' : ''}`
            }
          ]}
        />

        {/* Dashboard Principal */}
        <FespinDashboard />
      </div>
    );
  };

  // MainContent removido - integrado diretamente no return principal

  return (
    <div className="min-h-screen bg-gray-50 admin-page flex">
      {/* Nova Sidebar da Fespin */}
      <FespinSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onSignOut={handleSignOut}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      
      {/* Conteúdo Principal */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <AdminHeader className="" sticky={true} />
        
        {/* Conteúdo */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;