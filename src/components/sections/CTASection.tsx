import React from "react";
import { ArrowRight, Crown, Calendar, Phone, Sparkles, CheckCircle } from "lucide-react";

interface CTASectionProps {
  variant?: 'home' | 'patrocinio';
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryButton?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  highlights?: Array<{
    text: string;
    delay?: number;
  }>;
}

const CTASection: React.FC<CTASectionProps> = ({
  variant = 'home',
  title = "Não perca a oportunidade",
  subtitle = "FESPIN 2025",
  description = "Junte-se ao movimento que transforma vidas e participe da maior feira de esporte do interior.",
  primaryButton,
  secondaryButton,
  highlights
}) => {
  // Configurações padrão baseadas na variante
  const defaultConfig = {
    home: {
      primaryButton: {
        text: "Quero Participar",
        href: "#participar",
        icon: <Crown className="mr-3 w-5 h-5" />
      },
      secondaryButton: {
        text: "Seja um Patrocinador",
        href: "/patrocinio",
        icon: <Calendar className="mr-3 w-5 h-5" />
      },
      highlights: [
        { text: "Vagas Limitadas" },
        { text: "3 Dias de Evento", delay: 0.5 },
        { text: "15.000 Visitantes", delay: 1 }
      ]
    },
    patrocinio: {
      primaryButton: {
        text: "Quero Patrocinar Agora",
        href: "#contato",
        icon: <Crown className="mr-3 w-5 h-5" />
      },
      secondaryButton: {
        text: "Agendar Reunião",
        href: "#contato",
        icon: <Calendar className="mr-3 w-5 h-5" />
      },
      highlights: [
        { text: "Vagas Limitadas" },
        { text: "Resposta em 24h", delay: 0.5 },
        { text: "Proposta Personalizada", delay: 1 }
      ]
    }
  };

  const config = defaultConfig[variant];
  const finalPrimaryButton = primaryButton || config.primaryButton;
  const finalSecondaryButton = secondaryButton || config.secondaryButton;
  const finalHighlights = highlights || config.highlights;

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Elementos decorativos sutis */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-36 -translate-y-36"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          {/* Card principal */}
          <div className="bg-gradient-to-br from-[#0a2856] to-[#00d856] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            {/* Padrão de fundo sutil */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-semibold text-sm">Última chance!</span>
              </div>
              
              {/* Título */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-3 leading-tight">
                <span className="block text-white mb-1 whitespace-nowrap sm:whitespace-normal">{title}</span>
                <span className="block text-[#b1f727] whitespace-nowrap">{subtitle}</span>
              </h2>
              
              {/* Descrição */}
              <div className="subtitle-section text-white/90 mb-8 max-w-2xl mx-auto">
                Junte-se ao movimento que transforma vidas<br />e participe da maior feira de esporte do interior.
              </div>
              
              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a 
                  href={finalPrimaryButton.href}
                  className="group bg-[#b1f727] hover:bg-[#b1f727]/90 text-[#0a2856] font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[240px] w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center whitespace-nowrap">
                    {finalPrimaryButton.icon}
                    {finalPrimaryButton.text}
                    <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
                <a 
                  href={finalSecondaryButton.href}
                  className="group bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-bold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm min-w-[240px] w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center whitespace-nowrap">
                    {finalSecondaryButton.icon}
                    {finalSecondaryButton.text}
                    <Phone className="ml-3 w-5 h-5 transition-transform group-hover:scale-110" />
                  </span>
                </a>
              </div>
              
              {/* Highlights */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/80">
                {finalHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#b1f727]" />
                    <span className="text-sm font-medium">{highlight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;