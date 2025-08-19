import React from "react";
import { Activity, MapPin, Phone, Mail, Calendar, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { PhoneContact } from "@/components/ui";

interface FooterProps {
  variant?: 'home' | 'patrocinio';
  contactEmail?: string;
  contactPhone?: string;
}

const Footer: React.FC<FooterProps> = ({
  variant = 'home',
  contactEmail = "construind25@gmail.com",
  contactPhone = "19 97412-4162"
}) => {
  const config = {
    home: {
      contactEmail: "construind25@gmail.com",
      contactPhone: "19 97412-4162"
    },
    patrocinio: {
      contactEmail: "construind25@gmail.com",
      contactPhone: "19 97412-4162"
    }
  };

  const finalConfig = config[variant];
  const finalEmail = contactEmail || finalConfig.contactEmail;
  const finalPhone = contactPhone || finalConfig.contactPhone;

  return (
    <footer className="bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0a0a0a] text-white relative overflow-hidden min-h-[400px] z-[5] border-t border-[#ff3c00]/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,60,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,140,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,60,0,0.05),transparent_50%)]" />
      </div>
      <div className="container mx-auto px-6 pt-32 md:pt-48 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 lg:gap-20 text-center md:text-left">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <img 
                src="/CONSTRUIND.svg" 
                alt="CONSTRUIND Logo" 
                className="w-56 h-auto opacity-90"
              />
            </div>
            <p className="text-white/80 text-base mb-3">Feira da Construção Civil de Indaiatuba</p>
            <p className="text-white/70 text-base leading-relaxed">A maior feira da construção civil do interior paulista. Conectando empresas, profissionais e inovações do setor.</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-5">
              <MapPin className="w-5 h-5 text-[#ff3c00]" />
              <span className="text-white/80 text-base">Espaço Viber - Indaiatuba/SP</span>
            </div>
          </div>
          
          {/* Serviços */}
          <div className="hidden md:block">
            <h4 className="font-bold mb-5 text-white text-lg text-center md:text-left">Serviços</h4>
            <ul className="space-y-3 text-base flex flex-col items-center md:items-start">
              <li><Link to="/pre-inscricao-expositores" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Pré-inscrição</Link></li>
              <li><Link to="/admin" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Administração</Link></li>
              <li><a href="#newsletter" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Newsletter</a></li>
              <li><a href="#sobre" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Sobre</a></li>
            </ul>
          </div>
          
          {/* Ajuda */}
          <div className="hidden md:block">
            <h4 className="font-bold mb-5 text-white text-lg text-center md:text-left">Ajuda</h4>
            <ul className="space-y-3 text-base flex flex-col items-center md:items-start">
              <li><a href="#recursos" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Recursos</a></li>
              <li><a href="#aplicacao" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Aplicação</a></li>
              <li><a href="#equipe" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Equipe</a></li>
              <li><a href="#contato" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Contato</a></li>
            </ul>
          </div>
          
          {/* Contato */}
          <div className="md:pl-6 flex flex-col items-center md:items-start">
            <h4 className="font-bold mb-5 text-white text-lg">Contato</h4>
            <div className="flex flex-row justify-center md:flex-col md:justify-start gap-8 md:gap-4 flex-wrap">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                <a href="https://instagram.com/construind_25" target="_blank" rel="noopener noreferrer" className="bg-[#ff3c00]/20 p-3 rounded-full hover:bg-[#ff3c00]/30 transition-colors">
                  <Instagram className="w-6 h-6 text-[#ff3c00]" />
                </a>
                <a href="https://instagram.com/construind_25" target="_blank" rel="noopener noreferrer" className="hidden md:block text-white/90 text-sm md:text-base hover:text-white transition-colors">@construind_25</a>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                <PhoneContact
                  phone={finalPhone}
                  className="bg-[#ff3c00]/20 p-3 rounded-full hover:bg-[#ff3c00]/30 transition-colors"
                >
                  <Phone className="w-6 h-6 text-[#ff3c00]" />
                </PhoneContact>
                <PhoneContact
                  phone={finalPhone}
                  className="hidden md:block text-white/90 text-sm md:text-base hover:text-white transition-colors"
                >
                  {finalPhone}
                </PhoneContact>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3">
                <a href={`mailto:${finalEmail}`} className="bg-[#ff3c00]/20 p-3 rounded-full hover:bg-[#ff3c00]/30 transition-colors">
                  <Mail className="w-6 h-6 text-[#ff3c00]" />
                </a>
                <a href={`mailto:${finalEmail}`} className="hidden md:block text-white/90 text-sm md:text-base hover:text-white transition-colors">{finalEmail}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-white/60 text-sm gap-3">
          <span>© 2025 CONSTRUIND. Todos os direitos reservados.</span>
          <span className="flex items-center justify-center md:justify-start gap-2"><Activity className="w-4 h-4" /> Construindo o futuro da construção civil</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer