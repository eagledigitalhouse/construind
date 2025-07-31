import React from "react";
import { Users, Store, Dumbbell, Utensils } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";

const AboutSection = () => {
  const highlights = [
    {
      icon: <Users className="w-10 h-10" />,
      number: "+15 mil",
      text: "visitantes esperados"
    },
    {
      icon: <Store className="w-10 h-10" />,
      number: "83",
      text: "estandes comerciais"
    },
    {
      icon: <Dumbbell className="w-10 h-10" />,
      number: "2",
      text: "arenas de experiências"
    },
    {
      icon: <Utensils className="w-10 h-10" />,
      number: "1",
      text: "praça gastronômica"
    }
  ];

  return (
    <section className="w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-white" id="sobre">
      <div className="container px-6 lg:px-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GlassChip icon={<Users className="w-4 h-4" />}>
                Sobre
              </GlassChip>
            </div>
            
            <div className="mb-3">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-none text-center">
                <div className="mb-2">
                  <span className="text-[#0a2856]">Muito mais do que uma </span>
                  <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">feira</span>
                  <span className="text-[#0a2856]">.</span>
                </div>
                <div>
                  <span className="text-[#0a2856]">Um </span>
                  <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">movimento</span>
                  <span className="text-[#0a2856]"> de </span>
                  <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">transformação</span>
                  <span className="text-[#0a2856]">.</span>
                </div>
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 opacity-0 animate-fade-in" style={{
                animationDelay: "0.5s"
              }}>
                A FESPIN – Feira do Esporte de Indaiatuba – reúne marcas, profissionais e apaixonados por saúde, esporte, nutrição e bem-estar em um ambiente de experiências, conexões e evolução.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed opacity-0 animate-fade-in" style={{
                animationDelay: "0.7s"
              }}>
                Em 2025, esperamos mais de 15 mil pessoas para vivenciar três dias intensos de movimento, performance e qualidade de vida.
              </p>
            </div>
          </div>
          
          {/* Highlights Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="text-center p-6 md:p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${0.9 + index * 0.1}s`
                }}
              >
                <div className="flex justify-center mb-4 text-[#00d856]">
                  {highlight.icon}
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[#0a2856] mb-1">
                  {highlight.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 leading-snug font-medium">
                  {highlight.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;