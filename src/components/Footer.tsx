
import React from "react";
import { Activity, MapPin, Phone, Mail, Calendar } from "lucide-react";

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
    <footer className="bg-[#0a2856] text-white relative overflow-hidden">
      {/* Círculo decorativo sutil */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00d856]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Evento */}
          <div>
            <h3 className="text-2xl font-bold font-display mb-2">
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">FESPIN</span> 2025
            </h3>
            <p className="text-white/80 text-sm mb-4">Feira do Esporte de Indaiatuba</p>
            <p className="text-white/70 text-base mb-4">A maior feira de esporte do interior paulista. Conectando marcas, pessoas e comunidades através do esporte.</p>
            <div className="flex items-center gap-3 mt-4">
              <MapPin className="w-5 h-5 text-[#b1f727]" />
              <span className="text-white/80 text-sm">Espaço Viber - Indaiatuba/SP</span>
            </div>
          </div>
          {/* Contato */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2 text-lg"><Phone className="w-4 h-4" /> Contato</h4>
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 space-y-2">
              <a href={`tel:${finalPhone}`} className="block text-white/90 hover:underline transition-all">{finalPhone}</a>
              <a href={`mailto:${finalEmail}`} className="block text-white/90 hover:underline transition-all">{finalEmail}</a>
            </div>
          </div>
          {/* Atendimento */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2 text-lg"><Calendar className="w-4 h-4" /> Atendimento</h4>
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 space-y-1">
              <p className="text-white/80 text-sm">Seg a Sex: <span className="text-white/90 font-medium">9h às 18h</span></p>
              <p className="text-white/80 text-sm">Sábado: <span className="text-white/90 font-medium">9h às 12h</span></p>
              <p className="text-white/50 text-sm">Domingo: <span className="text-white/70 font-medium">Fechado</span></p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-xs gap-2">
          <span>© 2025 FESPIN. Todos os direitos reservados.</span>
          <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Transformando vidas através do esporte</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
