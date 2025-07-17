
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Dumbbell, Store, Mic, Zap, Heart, Utensils } from "lucide-react";
import { TextReveal } from "@/components/ui/text-reveal";
import { GlassChip } from "@/components/ui/glass-chip";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
      className="group p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#00d856]/30 hover:shadow-lg transition-all duration-300 opacity-0 text-center max-w-[230px] md:max-w-[260px] mx-auto w-full"
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="w-12 h-12 mx-auto mb-3 bg-[#00d856]/10 rounded-xl flex items-center justify-center text-[#00d856] group-hover:bg-[#00d856] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-display font-bold text-[#0a2856] mb-2">{title}</h3>
      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{description}</p>
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
    <section className="py-10 sm:py-12 md:py-14 pb-0 relative bg-white" id="programacao" ref={sectionRef}>
      <div className="section-container px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GlassChip icon={<Zap className="w-4 h-4" />}>
                Programação
              </GlassChip>
            </div>
            
            <div className="mb-1">
              <TextReveal className="whitespace-nowrap" highlightWords={["transformam"]}>
                Experiências que transformam.
              </TextReveal>
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed opacity-0 animate-fade-in max-w-2xl mx-auto" style={{
              animationDelay: "0.5s"
            }}>
              Três dias repletos de atividades, conexões e descobertas que vão elevar sua paixão pelo movimento e bem-estar.
            </p>
          </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 justify-items-center px-2 sm:px-4">
          <FeatureCard
            icon={<Dumbbell className="w-5 h-5" />}
            title="Arenas de Experiência"
            description="Duas arenas com aulas ao vivo e vivências práticas nas principais modalidades."
            index={0}
          />
          <FeatureCard
            icon={<Store className="w-5 h-5" />}
            title="80+ Estandes"
            description="Principais marcas do mercado fitness com produtos exclusivos e condições especiais."
            index={1}
          />
          <FeatureCard
            icon={<Mic className="w-5 h-5" />}
            title="Palestras & Workshops"
            description="Conteúdo de alta qualidade com especialistas renomados do setor."
            index={2}
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="Ativações Interativas"
            description="Experiências únicas que conectam você com as marcas de forma inovadora."
            index={3}
          />
          <FeatureCard
            icon={<Heart className="w-5 h-5" />}
            title="Espaços Zen"
            description="Áreas de descanso, massagens e práticas de relaxamento para recarregar."
            index={4}
          />
          <FeatureCard
            icon={<Utensils className="w-5 h-5" />}
            title="Alimentação Saudável"
            description="Praça gourmet com opções funcionais que complementam seu estilo de vida."
            index={5}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
