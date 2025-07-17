import React from "react";
import { Activity, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  variant?: 'home' | 'patrocinio';
  contactEmail?: string;
  contactPhone?: string;
}

const Footer: React.FC<FooterProps> = ({
  variant = 'home',
  contactEmail = "contato@fespin.com.br",
  contactPhone = "(19) 9 9999-9999"
}) => {
  const config = {
    home: {
      contactEmail: "contato@fespin.com.br",
      contactPhone: "(19) 9 9999-9999"
    },
    patrocinio: {
      contactEmail: "patrocinio@fespin.com.br",
      contactPhone: "(19) 9 9999-9999"
    }
  };

  const finalConfig = config[variant];
  const finalEmail = contactEmail || finalConfig.contactEmail;
  const finalPhone = contactPhone || finalConfig.contactPhone;

  return (
    <footer className="bg-[#0a2856] text-white relative overflow-visible min-h-[400px] z-40 border-t-4 border-[#00d856]">
      {/* Círculo decorativo sutil */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00d856]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-6 pt-64 md:pt-48 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-3">
              <img 
                src="/LOGO BRANCO COM ICONE VERDE.png" 
                alt="FESPIN Logo" 
                className="w-56 h-auto"
              />
            </div>
            <p className="text-white/80 text-sm mb-3">Feira do Esporte de Indaiatuba</p>
            <p className="text-white/70 text-sm leading-relaxed">A maior feira de esporte do interior paulista. Conectando marcas, pessoas e comunidades através do esporte.</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              <MapPin className="w-4 h-4 text-[#b1f727]" />
              <span className="text-white/80 text-sm">Espaço Viber - Indaiatuba/SP</span>
            </div>
          </div>
          
          {/* Serviços */}
          <div>
            <h4 className="font-bold mb-4 text-white text-center md:text-left">Serviços</h4>
            <ul className="space-y-2 text-sm flex flex-col items-center md:items-start">
              <li><Link to="/expositores" className="text-white/70 hover:text-white transition-colors">Expositores</Link></li>
              <li><Link to="/patrocinio" className="text-white/70 hover:text-white transition-colors">Patrocínio</Link></li>
              <li><a href="#newsletter" className="text-white/70 hover:text-white transition-colors">Newsletter</a></li>
              <li><a href="#sobre" className="text-white/70 hover:text-white transition-colors">Sobre</a></li>
            </ul>
          </div>
          
          {/* Ajuda */}
          <div>
            <h4 className="font-bold mb-4 text-white text-center md:text-left">Ajuda</h4>
            <ul className="space-y-2 text-sm flex flex-col items-center md:items-start">
              <li><a href="#recursos" className="text-white/70 hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#aplicacao" className="text-white/70 hover:text-white transition-colors">Aplicação</a></li>
              <li><a href="#equipe" className="text-white/70 hover:text-white transition-colors">Equipe</a></li>
              <li><a href="#contato" className="text-white/70 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#00d856]" />
              <span className="text-white/90 text-sm font-medium">Espaço Viber - Indaiatuba/SP</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Phone className="w-4 h-4 text-[#00d856]" />
              <a href={`tel:${finalPhone}`} className="text-white/90 text-sm hover:underline">{finalPhone}</a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-[#00d856]" />
              <a href={`mailto:${finalEmail}`} className="text-white/90 text-sm hover:underline">{finalEmail}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-white/60 text-xs gap-2">
          <span>© 2025 FESPIN. Todos os direitos reservados.</span>
          <span className="flex items-center justify-center md:justify-start gap-2"><Activity className="w-3 h-3" /> Transformando vidas através do esporte</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer