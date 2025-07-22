import React from "react";
import { Activity, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { PhoneContact } from "@/components/ui";

interface FooterProps {
  variant?: 'home' | 'patrocinio';
  contactEmail?: string;
  contactPhone?: string;
}

const Footer: React.FC<FooterProps> = ({
  variant = 'home',
  contactEmail = "contato@fespin.com.br",
  contactPhone = "(19) 97179-7745"
}) => {
  const config = {
    home: {
      contactEmail: "contato@fespin.com.br",
      contactPhone: "(19) 97179-7745"
    },
    patrocinio: {
      contactEmail: "patrocinio@fespin.com.br",
      contactPhone: "(19) 97179-7745"
    }
  };

  const finalConfig = config[variant];
  const finalEmail = contactEmail || finalConfig.contactEmail;
  const finalPhone = contactPhone || finalConfig.contactPhone;

  return (
    <footer className="bg-[#0a2856] text-white relative overflow-visible min-h-[400px] z-[5] border-t-4 border-[#00d856]">
      {/* Círculo decorativo sutil */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00d856]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-6 pt-64 md:pt-48 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 lg:gap-20 text-center md:text-left">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <img 
                src="/LOGO BRANCO COM ICONE VERDE.png" 
                alt="FESPIN Logo" 
                className="w-56 h-auto"
              />
            </div>
            <p className="text-white/80 text-base mb-3">Feira do Esporte de Indaiatuba</p>
            <p className="text-white/70 text-base leading-relaxed">A maior feira de esporte do interior paulista. Conectando marcas, pessoas e comunidades através do esporte.</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-5">
              <MapPin className="w-5 h-5 text-[#b1f727]" />
              <span className="text-white/80 text-base">Espaço Viber - Indaiatuba/SP</span>
            </div>
          </div>
          
          {/* Serviços */}
          <div>
            <h4 className="font-bold mb-5 text-white text-lg text-center md:text-left">Serviços</h4>
            <ul className="space-y-3 text-base flex flex-col items-center md:items-start">
              <li><Link to="/expositores" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Expositores</Link></li>
              <li><Link to="/patrocinio" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Patrocínio</Link></li>
              <li><a href="#newsletter" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Newsletter</a></li>
              <li><a href="#sobre" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Sobre</a></li>
            </ul>
          </div>
          
          {/* Ajuda */}
          <div>
            <h4 className="font-bold mb-5 text-white text-lg text-center md:text-left">Ajuda</h4>
            <ul className="space-y-3 text-base flex flex-col items-center md:items-start">
              <li><a href="#recursos" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Recursos</a></li>
              <li><a href="#aplicacao" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Aplicação</a></li>
              <li><a href="#equipe" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Equipe</a></li>
              <li><a href="#contato" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200">Contato</a></li>
            </ul>
          </div>
          
          {/* Contato */}
          <div className="md:pl-6">
            <h4 className="font-bold mb-5 text-white text-lg text-center md:text-left">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="bg-[#00d856]/20 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-[#00d856]" />
                </div>
                <span className="text-white/90 text-base">Espaço Viber - Indaiatuba/SP</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="bg-[#00d856]/20 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-[#00d856]" />
                </div>
                <PhoneContact
                  phone={finalPhone}
                  className="text-white/90 text-base hover:text-white transition-colors"
                >
                  {finalPhone}
                </PhoneContact>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="bg-[#00d856]/20 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-[#00d856]" />
                </div>
                <a href={`mailto:${finalEmail}`} className="text-white/90 text-base hover:text-white transition-colors">{finalEmail}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-white/60 text-sm gap-3">
          <span>© 2025 FESPIN. Todos os direitos reservados.</span>
          <span className="flex items-center justify-center md:justify-start gap-2"><Activity className="w-4 h-4" /> Transformando vidas através do esporte</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer