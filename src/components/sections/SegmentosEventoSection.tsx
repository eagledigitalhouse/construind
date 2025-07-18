import React from "react";
import { Users, Store, Activity, Target, Zap } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";

const SegmentosEventoSection = () => {
  const segmentosEvento = [
    {
      nome: "ESTANDES ACADEMIAS 3X3M",
      cor: "bg-[#b1f727]",
      descricao: "Área exclusiva para academias e centros de treinamento"
    },
    {
      nome: "ESTANDES BEM ESTAR 3X3M",
      cor: "bg-[#ff6b6b]",
      descricao: "Espaço para produtos de bem-estar e saúde"
    },
    {
      nome: "ESTANDES ARTIGOS ESPORTIVOS 3X3M",
      cor: "bg-[#4ecdc4]",
      descricao: "Área para equipamentos e artigos esportivos"
    },
    {
      nome: "ESTANDES SAÚDE-SUPLEMENTOS-NUTRIÇÃO 3X3M",
      cor: "bg-[#45b7d1]",
      descricao: "Segmento focado em nutrição e suplementação"
    }
  ];

  return (
    <section className="w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Activity className="w-4 h-4" />}>
              Segmentos especializados
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 leading-none mb-3">
              <span className="text-[#00d856]">Áreas</span> <span className="text-[#00d856]">exclusivas</span> por <span className="text-[#00d856]">segmento</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
              Cada segmento tem sua área exclusiva para maximizar o networking 
              e as oportunidades de negócios entre empresas do mesmo setor.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">
                4 Segmentos Especializados
              </h3>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Cada área do evento foi pensada para criar conexões estratégicas 
                entre empresas complementares, maximizando as oportunidades de 
                parcerias e negócios.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#b1f727] flex items-center justify-center text-[#0a2856] flex-shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 mb-1">Academias</h4>
                    <p className="text-sm text-gray-600">Centros de treinamento e academias</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#ff6d4d] flex items-center justify-center text-white flex-shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 mb-1">Bem-estar</h4>
                    <p className="text-sm text-gray-600">Produtos de saúde e bem-estar</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6cace3] flex items-center justify-center text-white flex-shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 mb-1">Artigos Esportivos</h4>
                    <p className="text-sm text-gray-600">Equipamentos e acessórios</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#4dff8e] flex items-center justify-center text-[#0a2856] flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 mb-1">Saúde & Nutrição</h4>
                    <p className="text-sm text-gray-600">Suplementos e nutrição esportiva</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {segmentosEvento.map((segmento, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#00d856]/20 hover:scale-105"
                >
                  <div className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${segmento.cor} flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Store className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-sm font-display font-bold text-gray-900 mb-2 group-hover:text-[#00d856] transition-colors duration-300 leading-tight">
                      {segmento.nome}
                    </h3>
                    
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {segmento.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentosEventoSection;