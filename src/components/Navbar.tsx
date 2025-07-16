
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Settings } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const CustomNavbarLogo = () => {
  return (
    <Link 
      to="/"
      className="relative z-20 flex items-center space-x-2 px-2"
      aria-label="FESPIN 2025"
    >
      <div className="text-2xl logo-text bg-fespin-gradient bg-clip-text text-transparent">
        FESPIN
      </div>
      <div className="text-sm font-medium text-white">
        2025
      </div>
    </Link>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Detectar quando a página é rolada
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId?: string) => {
    if (targetId) {
      event.preventDefault();
      
      // Se estiver na página inicial, role para a seção
      if (location.pathname === '/') {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = window.innerWidth < 768 ? 100 : 80;
          window.scrollTo({
            top: targetElement.offsetTop - offset,
            behavior: 'smooth'
          });
        }
      } else {
        // Se não estiver na página inicial, navegue para a página inicial e adicione o hash
        window.location.href = `/#${targetId}`;
      }
    }
    
    // Feche o menu móvel se estiver aberto
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  // Prevenir rolagem do background quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    {
      name: "Início",
      link: "/",
    },
    {
      name: "Sobre",
      link: "#sobre",
    },
    {
      name: "Programação",
      link: "#programacao",
    },
    {
      name: "Expositores",
      link: "/expositores",
    },
  ];

  return (
    <ResizableNavbar className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Desktop Navigation */}
      <NavBody 
        className={isScrolled 
          ? "bg-transparent backdrop-blur-sm hover:bg-white/10 dark:hover:bg-neutral-950/10 px-4 md:px-6" 
          : "bg-fespin-green shadow-md w-full px-4 md:px-6"
        }
      >
        <CustomNavbarLogo />
        <NavItems 
          items={navItems} 
          onItemClick={() => {
            // Implementar a lógica de rolagem para as âncoras
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => {
              link.addEventListener('click', (e) => {
                const href = (link as HTMLAnchorElement).getAttribute('href');
                if (href && href.startsWith('#')) {
                  // Corrigindo o erro de tipagem usando uma abordagem mais segura
                  if (e.preventDefault) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    if (location.pathname === '/') {
                      const targetElement = document.getElementById(targetId);
                      if (targetElement) {
                        const offset = window.innerWidth < 768 ? 100 : 80;
                        window.scrollTo({
                          top: targetElement.offsetTop - offset,
                          behavior: 'smooth'
                        });
                      }
                    } else {
                      window.location.href = `/#${targetId}`;
                    }
                  }
                }
              });
            });
          }}
          className={isScrolled ? "" : "text-white hover:text-white"}
        />
        <div className="flex items-center gap-3 z-20 relative">
          <Link 
            to="/admin" 
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Painel Administrativo"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <Link to="/expositor">
            <ShimmerButton
              background={isScrolled ? "#0a2856" : "#ffffff"}
              shimmerColor={isScrolled ? "#b1f727" : "#00d856"}
              borderRadius="0.375rem"
              className={`px-4 py-2 text-sm font-medium ${isScrolled ? "" : "text-fespin-dark"}`}
            >
              <span className="flex items-center">
                Quero ser expositor
                <ChevronRight className="ml-1 w-4 h-4" />
              </span>
            </ShimmerButton>
          </Link>
          <Link to="/patrocinio">
            <ShimmerButton
              background={isScrolled ? "#00d856" : "#ffffff"}
              shimmerColor={isScrolled ? "#ffffff" : "#b1f727"}
              borderRadius="0.375rem"
              className="px-4 py-2 text-sm font-medium text-fespin-dark"
            >
              <span className="flex items-center">
                Quero patrocinar
                <ChevronRight className="ml-1 w-4 h-4" />
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav 
        className={isScrolled 
          ? "bg-transparent backdrop-blur-sm px-4" 
          : "bg-fespin-green shadow-md w-full px-4"
        }
      >
        <MobileNavHeader>
          <CustomNavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="relative text-neutral-600 dark:text-neutral-300 w-full text-xl font-medium py-4 px-6 text-center rounded-lg hover:bg-gray-100"
          >
            <span className="block">Início</span>
          </Link>
          <a 
            href="#sobre" 
            className="relative text-neutral-600 dark:text-neutral-300 w-full text-xl font-medium py-4 px-6 text-center rounded-lg hover:bg-gray-100"
            onClick={(e) => handleNavClick(e, "sobre")}
          >
            <span className="block">Sobre</span>
          </a>
          <a 
            href="#programacao" 
            className="relative text-neutral-600 dark:text-neutral-300 w-full text-xl font-medium py-4 px-6 text-center rounded-lg hover:bg-gray-100"
            onClick={(e) => handleNavClick(e, "programacao")}
          >
            <span className="block">Programação</span>
          </a>
          <Link 
            to="/expositores" 
            className="relative text-neutral-600 dark:text-neutral-300 w-full text-xl font-medium py-4 px-6 text-center rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="block">Expositores</span>
          </Link>
          <Link 
            to="/admin" 
            className="relative text-neutral-600 dark:text-neutral-300 w-full text-xl font-medium py-4 px-6 text-center rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="w-5 h-5" />
            <span className="block">Administração</span>
          </Link>
          <div className="flex w-full flex-col gap-4 mt-6">
            <Link 
              to="/expositor" 
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShimmerButton
                background="#0a2856"
                shimmerColor="#b1f727"
                borderRadius="0.375rem"
                className="w-full py-3 text-center text-sm"
              >
                <span className="flex items-center justify-center">
                  Quero ser expositor
                  <ChevronRight className="ml-1 w-4 h-4" />
                </span>
              </ShimmerButton>
            </Link>
            <Link 
              to="/patrocinio" 
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShimmerButton
                background="#00d856"
                shimmerColor="#ffffff"
                borderRadius="0.375rem"
                className="w-full py-3 text-center text-sm text-fespin-dark"
              >
                <span className="flex items-center justify-center">
                  Quero patrocinar
                  <ChevronRight className="ml-1 w-4 h-4" />
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;
