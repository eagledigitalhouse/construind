import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { supabase } from "@/lib/supabase";
import Dropdown from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNotificacoes } from "@/hooks/useNotificacoes";
import clsx from "clsx";

// Mock data para demonstração
const mockMessages = [
  {
    id: 1,
    title: "João Silva",
    desc: "Olá, gostaria de mais informações sobre os stands disponíveis.",
    image: "/api/placeholder/40/40",
    active: true,
    hasnotification: true,
    time: "3 min atrás"
  },
  {
    id: 2,
    title: "Maria Santos",
    desc: "Quando será divulgada a lista de expositores confirmados?",
    image: "/api/placeholder/40/40",
    active: false,
    hasnotification: false,
    time: "15 min atrás"
  },
  {
    id: 3,
    title: "Pedro Costa",
    desc: "Preciso alterar os dados do meu cadastro de patrocinador.",
    image: "/api/placeholder/40/40",
    active: true,
    hasnotification: true,
    time: "1 hora atrás"
  },
  {
    id: 4,
    title: "Ana Oliveira",
    desc: "Qual o prazo para confirmação da participação?",
    image: "/api/placeholder/40/40",
    active: false,
    hasnotification: false,
    time: "2 horas atrás"
  }
];

// Função para formatar tempo relativo
const formatarTempoRelativo = (data: Date) => {
  const agora = new Date();
  const diferenca = agora.getTime() - data.getTime();
  const minutos = Math.floor(diferenca / (1000 * 60));
  const horas = Math.floor(diferenca / (1000 * 60 * 60));
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

  if (minutos < 60) {
    return `${minutos} min atrás`;
  } else if (horas < 24) {
    return `${horas} hora${horas > 1 ? 's' : ''} atrás`;
  } else {
    return `${dias} dia${dias > 1 ? 's' : ''} atrás`;
  }
};

// Função para obter ícone e cor baseado no tipo
const obterIconeECor = (tipo: string) => {
  switch (tipo) {
    case 'newsletter':
      return { icon: 'ph:envelope-light', status: 'yellow' };
    case 'pre-inscricao':
      return { icon: 'ph:users-light', status: 'green' };
    default:
      return { icon: 'ph:bell-light', status: 'blue' };
  }
};

interface AdminHeaderProps {
  className?: string;
  sticky?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  className = "", 
  sticky = true 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { notificacoes, contadorNaoLidas, marcarComoLida, testarNotificacao } = useNotificacoes();
  
  // Log para debug
  console.log('🔍 AdminHeader - Notificações:', notificacoes.length, 'Contador:', contadorNaoLidas);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Componente do ícone de mensagens
  const MessageLabel = () => (
    <span className="relative text-gray-600 text-xl dark:text-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21.681"
        height="21.681"
        viewBox="0 0 21.681 21.681"
      >
        <g id="Chat" transform="translate(0.931 0.75)">
          <path
            id="Stroke_4"
            data-name="Stroke 4"
            d="M17.071,17.07a10.006,10.006,0,0,1-11.285,2,4.048,4.048,0,0,0-1.421-.4c-1.187.007-2.664,1.158-3.432.391s.384-2.246.384-3.44a3.994,3.994,0,0,0-.391-1.414A10,10,0,1,1,17.071,17.07Z"
            transform="translate(0)"
            fill="none"
            className="stroke-gray-600 dark:stroke-gray-100"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
          />
          <path
            id="Stroke_11"
            data-name="Stroke 11"
            d="M.5.5H.5"
            transform="translate(13.444 9.913)"
            fill="#fff"
            className="stroke-gray-600 dark:stroke-gray-100"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
          <path
            id="Stroke_13"
            data-name="Stroke 13"
            d="M.5.5H.5"
            transform="translate(9.435 9.913)"
            fill="#fff"
            className="stroke-gray-600 dark:stroke-gray-100"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
          <path
            id="Stroke_15"
            data-name="Stroke 15"
            d="M.5.5H.5"
            transform="translate(5.426 9.913)"
            fill="#fff"
            className="stroke-gray-600 dark:stroke-gray-100"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
        </g>
      </svg>
      <span className="absolute -right-[2px] top-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-1 ring-white" />
      </span>
    </span>
  );

  // Componente do ícone de notificações
  const NotificationLabel = () => (
    <span className="relative">
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 18.8476C17.6392 18.8476 20.2481 18.1242 20.5 15.2205C20.5 12.3188 18.6812 12.5054 18.6812 8.94511C18.6812 6.16414 16.0452 3 12 3C7.95477 3 5.31885 6.16414 5.31885 8.94511C5.31885 12.5054 3.5 12.3188 3.5 15.2205C3.75295 18.1352 6.36177 18.8476 12 18.8476Z"
          className="stroke-gray-600 dark:stroke-gray-100"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14.3889 21.8572C13.0247 23.372 10.8967 23.3899 9.51953 21.8572"
          className="stroke-gray-600 dark:stroke-gray-100"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {contadorNaoLidas > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 ring-1 ring-white items-center justify-center text-xs text-white font-bold">
            {contadorNaoLidas > 9 ? '9+' : contadorNaoLidas}
          </span>
        </span>
      )}
    </span>
  );

  // Componente do perfil
  const ProfileLabel = () => (
    <div className={clsx("rounded-full transition-all duration-300", {
      "h-9 w-9": sticky,
      "lg:h-12 lg:w-12 h-7 w-7": !sticky,
    })}>
      <Avatar className="w-full h-full">
        <AvatarFallback className="bg-indigo-500 text-white font-semibold">
          AD
        </AvatarFallback>
      </Avatar>
    </div>
  );

  // Menu do perfil
  const profileMenuItems = [
    {
      label: "Perfil",
      icon: "ph:user-circle-light",
      action: () => navigate('/admin/profile')
    },
    {
      label: "Relatórios",
      icon: "ph:chart-bar-light",
      action: () => navigate('/admin/reports')
    },
    {
      label: "Configurações",
      icon: "ph:gear-light",
      action: () => navigate('/admin/settings')
    },
    {
      label: "Ajuda",
      icon: "ph:question-light",
      action: () => navigate('/admin/help')
    }
  ];

  return (
    <header className={clsx(
      "transition-all duration-300",
      className
    )}>
      <div className={clsx(
        "app-header md:px-6 px-[15px] transition-all duration-300 backdrop-blur-[6px]",
        {
          "bg-white dark:bg-gray-800 shadow-base": sticky,
          "py-3": sticky,
        }
      )}>
        <div className="flex justify-between items-center h-full relative">
          {/* Logo e Search */}
          <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
            {/* Botão de teste temporário */}
            <Button 
              onClick={() => {
                console.log('🧪 Testando notificação...');
                testarNotificacao();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs"
            >
              Testar Notificação
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[#0a2856] dark:text-white">
                FESPIN Admin
              </h1>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
              </div>
            </div>
            
            {/* Search Box */}
            <div className="relative hidden md:block">
              <Icon 
                icon="heroicons:magnifying-glass-20-solid" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Nav Tools */}
          <div className="nav-tools flex items-center lg:space-x-4 space-x-2 rtl:space-x-reverse">

            {/* Messages */}
            <div className="md:block hidden">
              <Dropdown
                label={<MessageLabel />}
                classMenuItems="md:w-[360px] w-min top-[30px]"
              >
                <div className="flex justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-600">
                  <div className="text-sm text-gray-800 dark:text-gray-200 font-semibold leading-6">
                    Mensagens
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {mockMessages.map((item) => (
                    <Menu.Item key={item.id}>
                      {({ active }) => (
                        <div className={`${
                          active
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:bg-opacity-70"
                            : "text-gray-600 dark:text-gray-300"
                        } block w-full px-4 py-2 text-sm cursor-pointer group`}>
                          <div className="flex ltr:text-left rtl:text-right space-x-3 rtl:space-x-reverse">
                            <div className="flex-none">
                              <div className="h-12 w-12 bg-white dark:bg-gray-700 rounded-full relative group-hover:scale-110 transition-all duration-200">
                                <span className={`${
                                  item.active ? "bg-green-500" : "bg-gray-400"
                                } w-[10px] h-[10px] rounded-full border border-white dark:border-gray-700 inline-block absolute right-0 top-0`} />
                                <Avatar className="w-full h-full">
                                  <AvatarFallback className="bg-indigo-500 text-white text-xs">
                                    {item.title.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="text-gray-800 dark:text-gray-300 text-sm font-medium mb-1">
                                {item.title}
                              </div>
                              <div className="text-sm hover:text-[#68768A] text-gray-600 dark:text-gray-300 mb-1 w-full truncate">
                                {item.desc}
                              </div>
                              <div className="text-gray-400 dark:text-gray-400 text-xs font-light">
                                {item.time}
                              </div>
                            </div>
                            {item.hasnotification && (
                              <div className="flex-0 self-center">
                                <span className="h-3 w-3 bg-indigo-500 border border-white rounded-full text-[10px] flex items-center justify-center text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
                <div className="text-center mb-3 mt-1">
                  <Link
                    to="/admin/messages"
                    className="text-sm text-indigo-500 hover:underline transition-all duration-150"
                  >
                    Ver todas
                  </Link>
                </div>
              </Dropdown>
            </div>

            {/* Notifications */}
            <div className="md:block hidden">
              <Dropdown
                label={<NotificationLabel />}
                classMenuItems="md:w-[360px] top-[30px]"
              >
                <div className="flex justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-600">
                  <div className="text-sm text-gray-800 dark:text-gray-200 font-semibold leading-6">
                    Notificações Recentes
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {notificacoes.slice(0, 5).map((notificacao) => {
                    const { icon, status } = obterIconeECor(notificacao.tipo);
                    return (
                      <Menu.Item key={notificacao.id}>
                        {({ active }) => (
                          <div 
                            className={`${
                              active
                                ? "bg-gray-100 dark:bg-gray-700 dark:bg-opacity-70 text-gray-800"
                                : "text-gray-600 dark:text-gray-300"
                            } block w-full px-4 py-2 text-sm cursor-pointer group`}
                            onClick={() => marcarComoLida(notificacao.id)}
                          >
                            <div className="flex ltr:text-left rtl:text-right">
                              <div className="flex-none ltr:mr-4 rtl:ml-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200 text-white ${
                                  status === "cyan" ? "bg-cyan-500" : ""
                                } ${
                                  status === "blue" ? "bg-indigo-500" : ""
                                } ${
                                  status === "red" ? "bg-red-500" : ""
                                } ${
                                  status === "green" ? "bg-green-500" : ""
                                } ${
                                  status === "yellow" ? "bg-yellow-500" : ""
                                }`}>
                                  <Icon icon={icon} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className={`${
                                  active
                                    ? "text-gray-600 dark:text-gray-300"
                                    : "text-gray-600 dark:text-gray-300"
                                } text-sm flex items-center gap-2`}>
                                  <span>{notificacao.titulo}</span>
                                  {!notificacao.lida && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                  {notificacao.descricao}
                                </div>
                                <div className="text-gray-400 dark:text-gray-400 text-xs mt-1 text-light">
                                  {formatarTempoRelativo(notificacao.criadaEm)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
                <div className="text-center mb-3 mt-1">
                  <Link
                    to="/admin/notifications"
                    className="text-sm text-indigo-500 hover:underline transition-all duration-150"
                  >
                    Ver todas
                  </Link>
                </div>
              </Dropdown>
            </div>

            {/* Profile */}
            <Dropdown
              label={<ProfileLabel />}
              classMenuItems="w-[220px] top-[58px]"
            >
              <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-600 mb-3">
                <div className="flex-none ltr:mr-[10px] rtl:ml-[10px]">
                  <div className="h-[46px] w-[46px] rounded-full">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-indigo-500 text-white font-semibold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="flex-1 text-gray-700 dark:text-white text-sm font-semibold">
                  <span className="truncate w-full block">Administrador</span>
                  <span className="block font-light text-xs capitalize">
                    Super Admin
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {profileMenuItems.map((item, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <div
                        onClick={item.action}
                        className={`${
                          active
                            ? "text-indigo-500"
                            : "text-gray-600 dark:text-gray-300"
                        } block transition-all duration-150 group`}
                      >
                        <div className="block cursor-pointer px-4">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <span className="flex-none h-9 w-9 inline-flex items-center justify-center group-hover:scale-110 transition-all duration-200 rounded-full text-2xl text-white bg-indigo-500">
                              <Icon icon={item.icon} />
                            </span>
                            <span className="block text-sm">{item.label}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
                <Menu.Item>
                  <div
                    onClick={handleSignOut}
                    className="block cursor-pointer px-4 border-t border-gray-100 dark:border-gray-600 py-3 mt-1"
                  >
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      size="sm"
                    >
                      <Icon icon="ph:sign-out-light" className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </Menu.Item>
              </div>
            </Dropdown>

            {/* Mobile Menu Toggle */}
            <div className="cursor-pointer text-gray-900 dark:text-white text-2xl xl:hidden block">
              <Icon icon="heroicons-outline:menu-alt-3" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;