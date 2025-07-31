import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  Store,
  ClipboardList,
  FileText,
  Newspaper,
  Globe,
  Mail,
  User,
  Settings,
  LogOut,
  Home,
  DollarSign,
  BarChart3,
  MessageCircle,
  Calendar,
  Edit,
  ChevronLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface FespinSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSignOut?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

// Estrutura de navegação principal
const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
];

// Estrutura de gestão do website
const websiteItems = [
  { icon: Home, label: "Página Inicial", href: "pagina-inicial" },
  { icon: Building2, label: "Patrocinadores", href: "patrocinadores" },
  { icon: Users, label: "Expositores", href: "expositores" },
];

// Estrutura de gestão geral
const managementItems = [
  { icon: Users, label: "Entidades", href: "entidades" },
  { icon: Store, label: "Stands", href: "stands" },
  { icon: FileText, label: "Contratos", href: "contratos" },
  { icon: MessageCircle, label: "Mensagens", href: "messages" },
  { icon: Calendar, label: "Agenda", href: "agenda" },
];

// Estrutura de formulários
const formItems = [
  { icon: ClipboardList, label: "Pré-Inscrições", href: "pre-inscricoes" },
  { icon: Mail, label: "Newsletter", href: "newsletter" },
];

// Estrutura de outros itens
const otherItems = [
  { icon: DollarSign, label: "Financeiro", href: "/financial" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
];

const FespinSidebar: React.FC<FespinSidebarProps> = ({
  activeSection,
  setActiveSection,
  onSignOut,
  isCollapsed,
  setIsCollapsed
}) => {
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleNavigation = (href: string) => {
    if (href.startsWith('/')) {
      // Rota absoluta - navegar
      navigate(href);
    } else {
      // Rota relativa - usar setActiveSection
      setActiveSection(href);
    }
  };

  const toggleSubmenu = (itemLabel: string) => {
    setExpandedMenus(prev => 
      prev.includes(itemLabel) 
        ? prev.filter(label => label !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  const isSubmenuActive = (subItems: any[]) => {
    return subItems?.some(subItem => activeSection === subItem.href);
  };

  const renderNavItems = (items: any[], currentSection: string) => {
    return items.map((item) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isExpanded = expandedMenus.includes(item.label);
      const isActive = activeSection === item.href || (hasSubItems && isSubmenuActive(item.subItems));
      
      return (
        <div key={item.label} className="space-y-1">
          <button
            onClick={() => {
              if (hasSubItems && !isCollapsed) {
                toggleSubmenu(item.label);
              } else {
                handleNavigation(item.href);
              }
            }}
            className={cn(
              "group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out w-full text-left",
              isActive
                ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5 font-semibold border-l-4 border-primary ml-0 pl-2 shadow-sm"
                : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm",
              isCollapsed ? "justify-center" : ""
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-200 flex-shrink-0",
              isActive
                ? "text-primary transform scale-110"
                : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105",
              !isCollapsed ? "mr-3" : ""
            )} />
            {!isCollapsed && (
              <>
                <span className="transition-all duration-200 flex-1">{item.label}</span>
                {hasSubItems && (
                  <div className="ml-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                )}
              </>
            )}

            {isActive && !isCollapsed && !hasSubItems && (
              <div className="absolute right-2 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"></div>
            )}
            
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
          
          {/* Submenus */}
          {hasSubItems && !isCollapsed && isExpanded && (
            <div className="ml-6 space-y-1 border-l-2 border-gray-100 pl-4">
              {item.subItems.map((subItem: any) => (
                <button
                  key={subItem.label}
                  onClick={() => handleNavigation(subItem.href)}
                  className={cn(
                    "group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out w-full text-left",
                    activeSection === subItem.href
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  <subItem.icon className={cn(
                    "w-4 h-4 transition-all duration-200 flex-shrink-0 mr-3",
                    activeSection === subItem.href
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span className="transition-all duration-200">{subItem.label}</span>
                  
                  {activeSection === subItem.href && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full opacity-60 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-100/50 flex-shrink-0 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>

      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ChevronLeft className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="relative p-6 flex-1 overflow-y-auto scrollbar-hide">
        {/* User Profile */}
        <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-col items-center'} text-center mb-8`}>
          {/* User Avatar */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-3 shadow-lg ring-4 ring-white/20">
            <span className="text-white font-bold text-lg">F</span>
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse opacity-30"></div>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">FESPIN ADMIN</h2>
              <p className="text-sm text-gray-500 mb-4">ADMINISTRADOR</p>
            </>
          )}

          {/* Action Icons */}
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <button 
                onClick={onSignOut}
                className="group p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
              </button>
              <button className="group p-2.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 transform hover:scale-105">
                <Edit className="h-4 w-4 transition-transform group-hover:scale-110" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {/* Principal */}
          <div className="mb-8">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Principal
              </h3>
            )}
            <div className="space-y-1">
              {renderNavItems(navigationItems, activeSection)}
            </div>
          </div>

          {/* Website */}
          <div className="mb-8">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Website
              </h3>
            )}
            <div className="space-y-1">
              {renderNavItems(websiteItems, activeSection)}
            </div>
          </div>

          {/* Gestão */}
          <div className="mb-8">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Gestão
              </h3>
            )}
            <div className="space-y-1">
              {renderNavItems(managementItems, activeSection)}
            </div>
          </div>

          {/* Formulários */}
          <div className="mb-8">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Formulários
              </h3>
            )}
            <div className="space-y-1">
              {renderNavItems(formItems, activeSection)}
            </div>
          </div>

          {/* Outros */}
          <div className="mb-8">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Outros
              </h3>
            )}
            <div className="space-y-1">
              {renderNavItems(otherItems, activeSection)}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            2025 FESPIN Admin
          </p>
        </div>
      )}
    </div>
  );
};

export default FespinSidebar;