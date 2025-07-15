
import React, { useEffect, useRef, useState } from "react";

const SegmentosSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [showFinalLayout, setShowFinalLayout] = useState(false);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  // Modalidades específicas para cada segmento
  const segmentosData = [
    {
      id: 'academias',
      title: 'ACADEMIAS',
      description: 'Espaço dedicado às principais academias, studios e boxes de treino. Aqui o visitante vivencia o universo da musculação, do funcional, das lutas, do cross e das danças — com demonstrações ao vivo, aulas experimentais e networking com profissionais do setor.',
      modalidades: ['Musculação', 'Crossfit', 'Lutas', 'Danças', 'Funcional'],
      background: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
    },
    {
      id: 'bem-estar',
      title: 'BEM-ESTAR',
      description: 'Um refúgio de equilíbrio e autocuidado. Este pilar reúne práticas como yoga, pilates, massagens, aromaterapia e terapias integrativas, convidando o público a desacelerar, respirar e reconectar com o corpo e a mente.',
      modalidades: ['Yoga', 'Pilates', 'Massagens', 'Aromaterapia', 'Terapias'],
      background: 'url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
    },
    {
      id: 'artigos',
      title: 'ARTIGOS ESPORTIVOS',
      description: 'Moda, tecnologia e inovação para quem vive o movimento. De roupas funcionais a acessórios inteligentes, esse espaço é voltado às marcas e produtos que vestem, equipam e impulsionam o desempenho de atletas e entusiastas.',
      modalidades: ['Moda Fitness', 'Tecnologia', 'Equipamentos', 'Acessórios', 'Inovação'],
      background: 'url("https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
    },
    {
      id: 'saude',
      title: 'SAÚDE E NUTRIÇÃO',
      description: 'O ponto de encontro entre estética, ciência e nutrição inteligente. Reúne consultorias nutricionais, marcas de suplementos, produtos naturais, alimentação saudável e clínicas especializadas no cuidado com o corpo e o bem-estar.',
      modalidades: ['Nutrição', 'Suplementos', 'Alimentação', 'Estética', 'Consultorias'],
      background: 'url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
    }
  ];

  const cardStyle = {
    height: '35vh', // Reduzindo a altura no mobile
    maxHeight: '400px', // Reduzindo altura máxima
    minHeight: '300px', // Adicionando altura mínima para consistência
    borderRadius: '20px',
    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    willChange: 'transform, opacity'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;

          const rect = sectionRef.current.getBoundingClientRect();
          const sectionHeight = rect.height;
          const sectionTop = rect.top;
          const progress = Math.abs(sectionTop) / (sectionHeight - window.innerHeight);
          const isMobile = window.innerWidth < 768;

          // No mobile, não mostramos todos os cards de uma vez
          if (isMobile) {
            if (progress >= 0.85) {
              setActiveCardIndex(3);
            } else if (progress >= 0.6) {
              setActiveCardIndex(2);
            } else if (progress >= 0.35) {
              setActiveCardIndex(1);
            } else {
              setActiveCardIndex(0);
            }
            setShowFinalLayout(false); // Nunca mostra o layout final no mobile
          } else {
            // Desktop mantém o comportamento original
            const isScrollingUp = lastScrollY.current > window.scrollY;
            lastScrollY.current = window.scrollY;

            if (isScrollingUp) {
              if (progress >= 0.85) {
                setShowFinalLayout(true);
                setActiveCardIndex(3);
              } else if (progress >= 0.6) {
                setShowFinalLayout(false);
                setActiveCardIndex(3);
              } else if (progress >= 0.35) {
                setShowFinalLayout(false);
                setActiveCardIndex(2);
              } else if (progress >= 0.15) {
                setShowFinalLayout(false);
                setActiveCardIndex(1);
              } else {
                setShowFinalLayout(false);
                setActiveCardIndex(0);
              }
            } else {
              if (progress >= 0.9) {
                setShowFinalLayout(true);
                setActiveCardIndex(3);
              } else if (progress >= 0.65) {
                setShowFinalLayout(false);
                setActiveCardIndex(3);
              } else if (progress >= 0.4) {
                setShowFinalLayout(false);
                setActiveCardIndex(2);
              } else if (progress >= 0.2) {
                setShowFinalLayout(false);
                setActiveCardIndex(1);
              } else {
                setShowFinalLayout(false);
                setActiveCardIndex(0);
              }
            }
          }
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;
  const isFourthCardVisible = activeCardIndex >= 3;

  const getModalidadeIcon = (modalidade: string) => {
    switch (modalidade.toLowerCase()) {
      // Academias
      case 'musculação':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 20h4m4 0h4M12 4v16M8 8H4m0 4H2m2 4H4m16-8h-4m4 4h2m-2 4h-4" />
          </svg>
        );
      case 'crossfit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22V2M2 12h20" />
          </svg>
        );
      case 'lutas':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 14h6m10-4h-6M8 4v6m8 4v6" />
          </svg>
        );
      case 'danças':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="3" />
            <path d="M12 11v8m-3-4l3 4l3-4" />
          </svg>
        );
      case 'funcional':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 4l3 3l-3 3M6 20l-3-3l3-3" />
            <path d="M3 17l18-10" />
          </svg>
        );
      
      // Bem-estar
      case 'yoga':
      case 'pilates':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v8m-4-4h8" />
          </svg>
        );
      case 'massagens':
      case 'aromaterapia':
      case 'terapias':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18Z" />
            <path d="M12 13a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
          </svg>
        );

      // Artigos Esportivos
      case 'moda fitness':
      case 'equipamentos':
      case 'acessórios':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 8V7l-3 2-3-2v1l3 2 3-2z" />
            <path d="M3 7V6l3 2 3-2v1l-3 2-3-2z" />
            <path d="M12 22a8 8 0 1 0 0-16a8 8 0 0 0 0 16z" />
          </svg>
        );
      case 'tecnologia':
      case 'inovação':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6V4m0 16v-2m6-10h2M4 12h2m12 5l1.5 1.5M4.5 4.5L6 6m12 0l1.5-1.5M4.5 19.5L6 18" />
          </svg>
        );

      // Saúde e Nutrição
      case 'nutrição':
      case 'alimentação':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
            <path d="M19 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
            <path d="M5 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
          </svg>
        );
      case 'suplementos':
      case 'estética':
      case 'consultorias':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12V8H8a4 4 0 1 0 0 8h12v-4Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const SegmentoCard = ({ segmento, style = {} }) => (
    <div 
      className="group rounded-2xl overflow-hidden shadow-xl relative"
      style={{
        ...style,
        backgroundImage: segmento.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%' // Garantindo que o card ocupe toda a altura disponível
      }}
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 40, 86, 0.85) 0%, rgba(0, 216, 86, 0.75) 100%)'
        }}
      />
      
      <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="max-w-lg">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 tracking-wide">
            {segmento.title}
          </h3>
          
          <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-4 sm:mb-8">
            {segmento.description}
          </p>

          <div className="w-full">
            <div className="text-white/60 text-xs uppercase tracking-wider mb-2 sm:mb-3">
              Modalidades
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              {segmento.modalidades.map((modalidade, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 hover:bg-white/15 text-white text-[10px] sm:text-xs rounded-lg transition-colors duration-300 flex items-center gap-1.5"
                >
                  {getModalidadeIcon(modalidade)}
                  {modalidade}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout final (2x2)
  if (showFinalLayout) {
    return (
      <div ref={sectionRef} className="relative" style={{ height: '400vh' }}>
        <section className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-white" id="segmentos">
          <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="fespin-chip">
                  <span>Segmentos</span>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-extrabold" style={{ fontWeight: "900" }}>
                Segmentos Presentes
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
              {segmentosData.map((segmento) => (
                <SegmentoCard 
                  key={segmento.id} 
                  segmento={segmento}
                  style={{ minHeight: '300px' }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Layout de sobreposição durante o scroll
  return (
    <div ref={sectionRef} className="relative" style={{ height: '400vh' }}>
      <section className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-white" id="segmentos">
        <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="fespin-chip opacity-0 animate-fade-in" style={{
                animationDelay: "0.1s"
              }}>
                <span>Segmentos</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-extrabold" style={{ fontWeight: "900" }}>
              Segmentos Presentes
            </h2>
          </div>
          
          <div ref={cardsContainerRef} className="relative flex-1 max-w-4xl mx-auto w-full">
            {segmentosData.map((segmento, index) => {
              const isVisible = index === 0 ? isFirstCardVisible : 
                               index === 1 ? isSecondCardVisible :
                               index === 2 ? isThirdCardVisible :
                               isFourthCardVisible;
              
              const zIndex = 10 + (index * 10);
              const scale = 0.85 + (index * 0.05);
              const translateY = isVisible ? 
                (activeCardIndex === index ? `${100 - (index * 35)}px` : `${60 - (index * 35)}px`) : 
                '200px';
              const opacity = isVisible ? 1 : 0;

              return (
                <SegmentoCard 
                  key={segmento.id} 
                  segmento={segmento}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    height: '45vh',
                    maxHeight: '500px',
                    zIndex,
                    transform: `translateY(${translateY}) scale(${scale})`,
                    opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                    willChange: 'transform, opacity'
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SegmentosSection;
