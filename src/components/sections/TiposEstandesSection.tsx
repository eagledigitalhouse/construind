import React from "react";
import { ArrowRight, Store, CheckCircle, Sparkles } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";

const TiposEstandesSection = () => {
  const tiposEstandes = [
    {
      nome: "ESTANDES 3X3M",
      tamanho: "Metragem 9m²",
      cor: "from-[#0a2856] to-[#00d856]",
      icone: <Store className="w-8 h-8" />,
      destaque: true,
      beneficios: [
        "Estande octanorme completo",
        "Carpete incluso",
        "Energia 220V",
        "Localização estratégica",
        "Suporte técnico"
      ]
    },
    {
      nome: "ÁREA LIVRE 5X5M",
      tamanho: "Metragem 25m²",
      cor: "from-[#00d856] to-[#b1f727]",
      icone: <Sparkles className="w-8 h-8" />,
      destaque: false,
      beneficios: [
        "Espaço amplo sem estande",
        "Energia 220V inclusa",
        "Flexibilidade total de layout",
        "Ideal para demonstrações",
        "Maior visibilidade"
      ]
    }
  ];

  return (
    <section id="tipos-estandes" className="w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#00d856]/3 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Store className="w-4 h-4" />}>
              Escolha seu espaço
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-none text-center">
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">Tipos</span>
              <span className="text-[#0a2856]"> de </span>
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">estandes</span>
              <span className="text-[#0a2856]"> disponíveis</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
              Escolha o formato ideal para apresentar sua marca e produtos no evento.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiposEstandes.map((tipo, index) => (
            <div 
              key={index} 
              className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl`}
              style={{
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${index * 0.15}s`,
                opacity: 0
              }}
            >
              <div className={`bg-gradient-to-br ${tipo.cor} p-8 text-center relative`}>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                    {tipo.icone}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-1 leading-tight">
                    {tipo.nome}
                  </h3>
                  <p className="text-lg text-white/90 font-semibold leading-tight">
                    {tipo.tamanho}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-8">
                <ul className="space-y-3 mb-8">
                  {tipo.beneficios.map((beneficio, beneficioIndex) => (
                    <li key={beneficioIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-gray-700" />
                      </div>
                      <span className="text-gray-700 leading-tight">{beneficio}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] shadow-[#00d856]/30"
                >
                  <span className="flex items-center justify-center">
                    Quero Este Espaço
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TiposEstandesSection;