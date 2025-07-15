
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Dumbbell, Store, Mic, Zap, Heart, Utensils } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "feature-card glass-card opacity-0 p-4 sm:p-6",
        "lg:hover:bg-gradient-to-br lg:hover:from-white lg:hover:to-[#00d856]/10",
        "transition-all duration-300 border border-gray-100 hover:border-[#00d856]/30",
        "flex flex-col items-center text-center",
        "max-w-xs w-full h-60 aspect-square sm:aspect-auto sm:h-auto sm:max-w-none", // quadrado médio mobile
      )}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="rounded-full bg-gradient-to-br from-[#0a2856] to-[#00d856] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white mb-4 sm:mb-5">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#0a2856]">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-10 sm:py-12 md:py-14 pb-0 relative bg-gray-50" id="o-que-encontrar" ref={sectionRef}>
      <div className="section-container">
                  <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
            <div className="fespin-chip opacity-0 fade-in-element">
              <span>O que você vai encontrar</span>
            </div>
          </div>
                      <h2 className="section-title mb-1 sm:mb-2 opacity-0 fade-in-element text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight" style={{ fontWeight: "900" }}>
            Experiências que <span className="text-[#00d856]">transformam</span>.
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element text-lg text-gray-600 max-w-2xl">
            Três dias repletos de atividades, conexões e descobertas que vão elevar sua paixão pelo movimento e bem-estar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-items-center">
          <FeatureCard
            icon={<Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Arenas com Aulas e Vivências"
            description="Duas arenas completas com aulas ao vivo, workshops práticos e vivências imersivas em diferentes modalidades esportivas e de bem-estar."
            index={0}
          />
          <FeatureCard
            icon={<Store className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Estandes com Marcas e Produtos"
            description="Mais de 80 estandes com as principais marcas do mercado fitness, oferecendo produtos exclusivos, novidades e condições especiais."
            index={1}
          />
          <FeatureCard
            icon={<Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Palestras e Workshops"
            description="Conteúdo de alta qualidade com especialistas renomados compartilhando conhecimentos sobre treino, nutrição, empreendedorismo e inovação."
            index={2}
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Ativações Interativas"
            description="Experiências únicas e interativas que conectam você com as marcas de forma inovadora, incluindo demos, testes e atividades gamificadas."
            index={3}
          />
          <FeatureCard
            icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Espaços de Descanso e Relaxamento"
            description="Áreas dedicadas ao bem-estar e recuperação, com espaços zen, massagens e práticas de relaxamento para recarregar as energias."
            index={4}
          />
          <FeatureCard
            icon={<Utensils className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Alimentação Saudável"
            description="Praça de alimentação especialmente curada com opções saudáveis, funcionais e deliciosas que complementam seu estilo de vida ativo."
            index={5}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
