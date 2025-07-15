
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
  // Configurações baseadas na variante
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
    <footer className="bg-gradient-to-br from-[#0a2856] via-[#0a2856] to-[#00d856] text-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/10 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
      
      <div className="relative">
        {/* Seção principal do footer */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Informações do Evento */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00d856] to-[#b1f727] rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#0a2856]" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold">FESPIN 2025</h3>
                  <p className="text-white/80 text-sm">Feira do Esporte de Indaiatuba</p>
                </div>
              </div>
              <p className="text-white/90 text-lg mb-6 max-w-md">
                A maior feira de esporte do interior paulista. 
                Conectando marcas, pessoas e comunidades através do esporte.
              </p>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-[#b1f727]" />
                <div>
                  <p className="font-semibold">Local do Evento</p>
                  <p className="text-white/80">Espaço Viber - Indaiatuba/SP</p>
                </div>
              </div>
            </div>
            
            {/* Informações de Contato */}
            <div>
              <h4 className="text-xl font-display font-bold mb-6 flex items-center">
                <Phone className="w-5 h-5 text-[#b1f727] mr-2" />
                Contato
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#b1f727]" />
                  </div>
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-white/80 text-sm">{finalPhone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#b1f727]" />
                  </div>
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-white/80 text-sm">{finalEmail}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Horário de Atendimento */}
            <div>
              <h4 className="text-xl font-display font-bold mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-[#b1f727] mr-2" />
                Atendimento
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00d856]"></div>
                  <p className="text-white/90">Segunda a Sexta</p>
                </div>
                <p className="text-white/80 text-sm ml-5">9h às 18h</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#b1f727]"></div>
                  <p className="text-white/90">Sábado</p>
                </div>
                <p className="text-white/80 text-sm ml-5">9h às 12h</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <p className="text-white/90">Domingo</p>
                </div>
                <p className="text-white/80 text-sm ml-5">Fechado</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Linha divisória */}
        <div className="border-t border-white/20"></div>
        
        {/* Copyright */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-center md:text-left">
              © 2025 FESPIN - Feira do Esporte de Indaiatuba. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#b1f727]" />
                <span className="text-white/80 text-sm">Transformando vidas através do esporte</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
