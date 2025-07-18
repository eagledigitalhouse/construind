import React from "react";
import { ArrowRight, Crown, Phone } from "lucide-react";

const HeroExpositor = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2856] via-[#0a2856]/95 to-[#00d856]/80"></div>
      <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center opacity-5"></div>
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#00d856]/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#b1f727]/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white mb-4 shadow-xl">
            <Crown className="w-5 h-5 mr-2 text-[#b1f727]" />
            <span className="font-semibold">Seja um Expositor FESPIN 2025</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-none mb-6">
            <span className="block text-white mb-1">Seja pioneiro na</span>
            <span className="block bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent animate-pulse-slow">
              primeira feira do segmento
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Posicione sua marca como líder desde o início. Conecte-se com mais de <span className="font-bold text-[#b1f727]">15.000 visitantes</span> qualificados na primeira feira de esporte do interior de São Paulo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => document.getElementById('tipos-estandes')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-[#00d856]/50 min-w-[280px]"
            >
              <span className="flex items-center justify-center">
                Ver Tipos de Estandes
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            <button 
              onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm min-w-[280px]"
            >
              <span className="flex items-center justify-center">
                Garantir Meu Espaço
                <Phone className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroExpositor;