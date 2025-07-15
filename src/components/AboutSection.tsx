import React from "react";
import { Users, Store, Dumbbell, Utensils } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "+15 mil",
      text: "visitantes"
    },
    {
      icon: <Store className="w-8 h-8" />,
      number: "83",
      text: "estandes"
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      number: "2",
      text: "arenas para aulas e vivências"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      number: "1",
      text: "praça de alimentação saudável"
    }
  ];

  return (
    <section className="w-full py-10 md:py-14 bg-white" id="sobre">
      <div className="container px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="fespin-chip opacity-0 animate-fade-in" style={{
                animationDelay: "0.1s"
              }}>
                <span>Sobre</span>
              </div>
            </div>
            
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight mb-2 opacity-0 animate-fade-in" style={{
              animationDelay: "0.3s",
              fontWeight: "900"
            }}>
              Muito mais do que uma feira.<br />
              <span className="text-[#00d856]">Um movimento de transformação.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed opacity-0 animate-fade-in" style={{
              animationDelay: "0.5s"
            }}>
              A FESPIN – Feira do Esporte de Indaiatuba – reúne marcas, profissionais e apaixonados por saúde, esporte, nutrição e bem-estar em um ambiente de experiências, conexões e evolução. Em 2025, esperamos mais de 15 mil pessoas para vivenciar três dias intensos de movimento, performance e qualidade de vida.
            </p>
          </div>
          
          {/* Highlights Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 opacity-0 animate-fade-in" style={{
            animationDelay: "0.7s"
          }}>
            {highlights.map((highlight, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0a2856] to-[#00d856] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {highlight.icon}
                </div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-[#0a2856] mb-2">
                  {highlight.number}
                </div>
                <div className="text-gray-600 font-medium">
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