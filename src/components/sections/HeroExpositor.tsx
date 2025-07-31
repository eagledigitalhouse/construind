import React from "react";
import { ArrowRight, Crown, Phone } from "lucide-react";

const whatsappUrl = "https://wa.me/5519971797745";

const HeroExpositor = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2856] via-[#0a2856]/95 to-[#00d856]/80"></div>
      <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center opacity-5"></div>
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#00d856]/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#b1f727]/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold leading-none mb-6 text-center">
            <span className="block text-white mb-1">Seja pioneiro na</span>
            <span className="block bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent animate-pulse-slow">
              primeira feira do segmento
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light text-center">
            Posicione sua marca como líder desde o início. Conecte-se com mais de <span className="font-bold text-[#b1f727]">15.000 visitantes</span> qualificados na primeira feira de esporte do interior de São Paulo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-[#00d856]/50 min-w-[280px]"
            >
              <span className="flex items-center justify-center">
                Ver Tipos de Estandes
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm min-w-[280px]"
            >
              <span className="flex items-center justify-center">
                Garantir Meu Espaço
                <Phone className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroExpositor;