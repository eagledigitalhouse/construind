import React from "react";
import { ArrowRight, Star, Eye, Users, Zap, Store, Target, Handshake, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const ExpositorPatrocinioSection = () => {
  const beneficiosExpositor = [
    {
      icon: <Target className="w-5 h-5" />,
      text: "Acesso direto ao público qualificado"
    },
    {
      icon: <Handshake className="w-5 h-5" />,
      text: "Networking com profissionais do setor"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Exposição da marca em ambiente premium"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Oportunidades de vendas e parcerias"
    }
  ];

  const beneficiosPatrocinio = [
    {
      icon: <Star className="w-5 h-5" />,
      text: "Logo em destaque no site e materiais"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Post colaborativo com a marca (cota master)"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      text: "Presença em telão e sinalização"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Ações de engajamento no evento"
    },
    {
      icon: <Store className="w-5 h-5" />,
      text: "Estande incluso em todas as cotas"
    }
  ];

  return (
    <section className="w-full py-10 md:py-14 bg-gray-50" id="expositor-patrocinio">
      <div className="container px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="fespin-chip opacity-0 animate-fade-in" style={{
              animationDelay: "0.1s"
            }}>
              <span>Seja um parceiro</span>
            </div>
          </div>
          
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight mb-2 opacity-0 animate-fade-in" style={{
            animationDelay: "0.3s"
          }}>
            Sua marca no centro do <span className="text-[#00d856]">movimento</span>.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Card 1 - Seja um Expositor */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl opacity-0 animate-fade-in min-h-[500px] flex flex-col" style={{
            animationDelay: "0.5s"
          }}>
            {/* Card Header */}
            <div className="relative h-32 sm:h-36 p-6 sm:p-8 flex items-end" style={{
              background: 'linear-gradient(135deg, #0a2856 0%, #00d856 100%)'
            }}>
              <div className="absolute top-4 right-4">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <Store className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Expositor</span>
                </div>
              </div>
              
              <h3 className="text-3xl sm:text-4xl section-subtitle text-white">
                Seja um Expositor
              </h3>
            </div>
            
            {/* Card Content */}
            <div className="p-6 sm:p-8 bg-white flex-1 flex flex-col">
              <h4 className="text-xl font-display font-bold text-[#0a2856] mb-2">
                Mostre sua força no evento.
              </h4>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-3">
                A FESPIN é o palco ideal para empresas que querem se conectar com um público qualificado e apaixonado por qualidade de vida.
              </p>
              
              {/* Benefícios */}
              <div className="space-y-2 mb-6 flex-1">
                {beneficiosExpositor.map((beneficio, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0a2856] flex items-center justify-center text-white mt-1 flex-shrink-0">
                      {beneficio.icon}
                    </div>
                    <span className="text-gray-700 font-medium">{beneficio.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/expositor"
                  className="inline-flex items-center justify-center group bg-[#0a2856] hover:bg-[#0a2856]/90 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 transform w-full shadow-lg"
                >
                  Quero ser expositor
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 - Patrocine a FESPIN */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl opacity-0 animate-fade-in min-h-[500px] flex flex-col" style={{
            animationDelay: "0.7s"
          }}>
            {/* Card Header */}
            <div className="relative h-32 sm:h-36 p-6 sm:p-8 flex items-end" style={{
              background: 'linear-gradient(135deg, #00d856 0%, #b1f727 100%)'
            }}>
              <div className="absolute top-4 right-4">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-[#0a2856]">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Patrocínio</span>
                </div>
              </div>
              
              <h3 className="text-3xl sm:text-4xl section-subtitle text-white">
                Patrocine a FESPIN
              </h3>
            </div>
            
            {/* Card Content */}
            <div className="p-6 sm:p-8 bg-white flex-1 flex flex-col">
              <h4 className="text-xl font-display font-bold text-[#0a2856] mb-2">
                Ganhe visibilidade com propósito.
              </h4>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-3">
                Apoie o movimento que transforma e exponencie sua marca com alto impacto.
              </p>
              
              {/* Benefícios */}
              <div className="space-y-2 mb-6 flex-1">
                {beneficiosPatrocinio.map((beneficio, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00d856] flex items-center justify-center text-white mt-1 flex-shrink-0">
                      {beneficio.icon}
                    </div>
                    <span className="text-gray-700 font-medium">{beneficio.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/patrocinio"
                  className="inline-flex items-center justify-center group bg-[#00d856] hover:bg-[#00d856]/90 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 transform w-full shadow-lg"
                >
                  Quero ver as cotas de patrocínio
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpositorPatrocinioSection;