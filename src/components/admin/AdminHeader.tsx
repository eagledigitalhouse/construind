import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { supabase } from "@/lib/supabase";
import Dropdown from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import clsx from "clsx";




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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };


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

  // Menu do perfil simplificado
  const profileMenuItems = [
    {
      label: "Configurações",
      icon: "ph:gear-light",
      action: () => navigate('/admin/settings')
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
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[#0a2856] dark:text-white">
                CONSTRUIND Admin
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