import React from "react";
import { Dumbbell, Heart, ShoppingBag, Apple } from "lucide-react";

const SegmentosSection = () => {
  const segmentos = [
    {
      icon: Dumbbell,
      title: "ACADEMIAS",
      subtitle: "musculação, crossfit, lutas, danças",
      description: "Espaço dedicado às principais academias, studios e boxes de treino. Aqui o visitante vivencia o universo da musculação, do funcional, das lutas, do cross e das danças — com demonstrações ao vivo, aulas experimentais e networking com profissionais do setor.",
      color: "bg-primary",
      textColor: "text-white"
    },
    {
      icon: Heart,
      title: "BEM-ESTAR", 
      subtitle: "yoga, pilates, massagens, terapias holísticas",
      description: "Um refúgio de equilíbrio e autocuidado. Este pilar reúne práticas como yoga, pilates, massagens, aromaterapia e terapias integrativas, convidando o público a desacelerar, respirar e reconectar com o corpo e a mente.",
      color: "bg-secondary",
      textColor: "text-white"
    },
    {
      icon: ShoppingBag,
      title: "ARTIGOS ESPORTIVOS",
      subtitle: "moda fitness, acessórios, equipamentos", 
      description: "Moda, tecnologia e inovação para quem vive o movimento. De roupas funcionais a acessórios inteligentes, esse espaço é voltado às marcas e produtos que vestem, equipam e impulsionam o desempenho de atletas e entusiastas.",
      color: "bg-accent",
      textColor: "text-primary"
    },
    {
      icon: Apple,
      title: "SAÚDE E NUTRIÇÃO",
      subtitle: "clínicas de estética, consultorias, suplementos",
      description: "O ponto de encontro entre estética, ciência e nutrição inteligente. Reúne consultorias nutricionais, marcas de suplementos, produtos naturais, alimentação saudável e clínicas especializadas no cuidado com o corpo e o bem-estar.",
      color: "bg-gradient-to-br from-primary to-secondary",
      textColor: "text-white"
    }
  ];

  return (
    <section className="py-20 bg-white" id="segmentos">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-primary">
            Segmentos Presentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra os principais pilares que compõem a FESPIN 2025, cada um oferecendo experiências únicas para todos os perfis de visitantes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segmentos.map((segmento, index) => (
            <div 
              key={index}
              className={`${segmento.color} ${segmento.textColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
                <segmento.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">
                {segmento.title}
              </h3>
              
              <p className="text-sm opacity-90 mb-4 font-medium">
                {segmento.subtitle}
              </p>
              
              <p className="text-sm opacity-80 leading-relaxed">
                {segmento.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SegmentosSection;