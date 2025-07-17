
import React, { useEffect, useRef, useState } from "react";
import { Dumbbell, Heart, ShoppingBag, Apple, Zap } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";
import { useIsMobile } from "@/hooks/use-mobile";

const SegmentosSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(-1);
  const prevScrollY = useRef(0);
  const isMobile = useIsMobile();

  const segmentos = [
    {
      id: "academias",
      titulo: "ACADEMIAS",
      icone: <Dumbbell className="w-6 h-6" />,
      cor: "#0a2856", // FESPIN primário escuro
      descricao: "Espaço dedicado às principais academias, studios e boxes de treino com demonstrações ao vivo de musculação, crossfit, lutas e danças.",
      imagem: "/lovable-uploads/academia.jpg",
      tags: ["Musculação", "CrossFit", "Lutas", "Danças", "Funcional"]
    },
    {
      id: "bem-estar",
      titulo: "BEM-ESTAR",
      icone: <Heart className="w-6 h-6" />,
      cor: "#00d856", // FESPIN primário claro
      descricao: "Um refúgio de equilíbrio e autocuidado com práticas como yoga, pilates, massagens, aromaterapia e terapias integrativas.",
      imagem: "/lovable-uploads/bem%20estar.png",
      tags: ["Yoga", "Pilates", "Massagens", "Aromaterapia", "Terapias"]
    },
    {
      id: "artigos",
      titulo: "ARTIGOS ESPORTIVOS",
      icone: <ShoppingBag className="w-6 h-6" />,
      cor: "#b1f727", // FESPIN destaque
      descricao: "Moda, tecnologia e inovação para quem vive o movimento. Roupas funcionais, equipamentos e acessórios inteligentes.",
      imagem: "/lovable-uploads/artigosesportivos.png",
      tags: ["Moda Fitness", "Equipamentos", "Tecnologia", "Acessórios"]
    },
    {
      id: "saude",
      titulo: "SAÚDE E NUTRIÇÃO",
      icone: <Apple className="w-6 h-6" />,
      cor: "#0a2856", // FESPIN primário escuro
      descricao: "Consultorias nutricionais, suplementos, produtos naturais e alimentação saudável para cuidar do corpo e bem-estar.",
      imagem: "/lovable-uploads/saude%20e%20nutri%C3%A7%C3%A3o.jpg",
      tags: ["Nutrição", "Suplementos", "Alimentação", "Estética"]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      
      // Determinar a direção do scroll
      const isScrollingDown = currentScrollY > prevScrollY.current;
      prevScrollY.current = currentScrollY;
      
      // Dividir a altura total da seção em 4 partes para os 4 cards
      const sectionProgress = (windowHeight - top) / height;
      
      // Calcular qual card deve estar visível com base no progresso do scroll
      if (sectionProgress < 0.1) {
        // Antes da seção
        setActiveCardIndex(-1);
      } else if (sectionProgress > 0.9) {
        // Após a seção, todos os cards visíveis
        setActiveCardIndex(3);
      } else {
        // Dentro da seção, mostrar cards progressivamente
        const partSize = 0.8 / segmentos.length; // 0.8 dividido pelo número de segmentos
        const adjustedProgress = (sectionProgress - 0.1) / 0.8; // Normalizar entre 0.1 e 0.9
        
        if (isScrollingDown) {
          // Rolando para baixo: progressivamente mostrar os cards
          const newIndex = Math.floor(adjustedProgress * segmentos.length);
          setActiveCardIndex(Math.min(newIndex, 3));
        } else {
          // Rolando para cima: progressivamente esconder os cards
          const newIndex = Math.ceil(adjustedProgress * segmentos.length) - 1;
          setActiveCardIndex(Math.max(newIndex, -1));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Inicializar
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div 
      ref={sectionRef} 
      id="segmentos" 
      className="min-h-[400vh] relative bg-white"
    >
      <div className="min-h-screen sticky top-0 flex flex-col items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <GlassChip icon={<Zap className="w-4 h-4" />}>
              Segmentos
            </GlassChip>
          </div>
          
          <div className="mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight text-center">
              <span className="text-[#0a2856]">Segmentos </span>
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">Presentes</span>
              <span className="text-[#0a2856]"> na Feira</span>
            </h2>
          </div>
          
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto opacity-0 animate-fade-in" style={{
            animationDelay: "0.3s"
          }}>
            A FESPIN reúne os principais segmentos do esporte e bem-estar em um só lugar,
            criando uma experiência completa para todos os visitantes.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 relative min-h-[500px]">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {segmentos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= activeCardIndex 
                      ? "w-12 bg-[#00d856]" 
                      : "w-6 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cards de segmentos */}
          <div className="relative h-[500px]">
            {segmentos.map((segmento, idx) => {
              // Determinar se o card deve estar visível
              const isVisible = idx <= activeCardIndex;
              
              return (
                <div
                  key={segmento.id}
                  className={`absolute inset-x-0 rounded-2xl overflow-hidden shadow-lg transition-all duration-700
                    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  style={{
                    height: "500px",
                    zIndex: idx,
                    transform: isVisible
                      ? "translateY(0) scale(1)"
                      : "translateY(100px) scale(0.9)",
                    transitionProperty: "transform, opacity",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  {/* Imagem de fundo com overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${segmento.imagem})` }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2856]/90 via-[#0a2856]/60 to-[#0a2856]/30" />

                  {/* Ícone na parte superior direita */}
                  <div className="absolute top-8 right-8 z-20">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: segmento.cor }}
                    >
                      {segmento.icone}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="relative h-full flex flex-col p-6 md:p-8 z-10">
                    {/* Espaço vazio superior */}
                    <div className="flex-grow-[1.5]"></div>
                    
                    {/* Conteúdo centralizado (título, descrição e modalidades) */}
                    <div className="text-center w-full">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight whitespace-nowrap sm:whitespace-normal">
                        {segmento.titulo}
                      </h3>

                      <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-6">
                        {segmento.descricao}
                      </p>

                      {/* Modalidades logo abaixo da descrição */}
                       <div>
                         <div className="text-white/70 text-xs uppercase tracking-wider mb-3 font-semibold">
                           Modalidades incluídas
                         </div>
                         <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                           {segmento.tags.map((tag) => (
                             <span
                               key={tag}
                               className={`
                                 px-2.5 py-1 md:px-3 md:py-1.5 
                                 bg-white/20 rounded-full 
                                 text-xs md:text-sm text-white 
                                 backdrop-blur-sm border border-[#00d856]/30
                                 font-medium
                               `}
                             >
                               {tag}
                             </span>
                           ))}
                         </div>
                       </div>
                     </div>
                     
                     {/* Espaço vazio inferior - reduzido */}
                     <div className="flex-grow-[0.5]"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentosSection;
