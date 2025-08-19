import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  CreditCard,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ConstruindDashboard from './ConstruindDashboard';
import AdminStands from './AdminStands';
import AdminPreInscricaoExpositores from './AdminPreInscricaoExpositores';
import CondicoesPagamentoEditor from '@/components/admin/CondicoesPagamentoEditor';

type PaginaAtual = 'dashboard' | 'stands' | 'pre-inscricoes' | 'payment-conditions';

const AdminDashboard: React.FC = () => {
  const [paginaAtual, setPaginaAtual] = useState<PaginaAtual>('dashboard');
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const itensMenu = [
    {
      id: 'dashboard' as PaginaAtual,
      label: 'Dashboard',
      icone: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'stands' as PaginaAtual,
      label: 'Gestão de Stands',
      icone: <Store className="w-5 h-5" />
    },
    {
      id: 'pre-inscricoes' as PaginaAtual,
      label: 'Pré-Inscrições',
      icone: <Users className="w-5 h-5" />
    },
    {
      id: 'payment-conditions' as PaginaAtual,
      label: 'Condições de Pagamento',
      icone: <CreditCard className="w-5 h-5" />
    }
  ];

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <ConstruindDashboard />;
      case 'stands':
        return <AdminStands />;
      case 'pre-inscricoes':
        return <AdminPreInscricaoExpositores />;
      case 'payment-conditions':
        return <CondicoesPagamentoEditor />;
      default:
        return <ConstruindDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarAberta ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-xl border-r border-gray-200 flex flex-col`}>
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarAberta && (
              <h2 className="text-lg font-bold text-gray-900">Admin CONSTRUIND</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarAberta(!sidebarAberta)}
              className="p-2"
            >
              {sidebarAberta ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {itensMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setPaginaAtual(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                paginaAtual === item.id
                  ? 'bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icone}
              {sidebarAberta && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            {sidebarAberta && (
              <span className="font-medium">Sair</span>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        {renderizarPagina()}
      </div>
    </div>
  );
};

export default AdminDashboard;