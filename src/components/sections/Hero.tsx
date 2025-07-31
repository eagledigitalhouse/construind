
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, MapPin, Clock, Ticket, Heart } from "lucide-react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and when window resizes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Skip parallax on mobile
    if (isMobile) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(el => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || '0.1');
        const yPos = -scrollY * speed;
        element.style.setProperty('--parallax-y', `${yPos}px`);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  return (
    <section 
      className="overflow-hidden relative min-h-screen flex items-center bg-gradient-to-br from-[#0a2856] via-[#0a2856] to-[#1a3a6b] pt-24" 
      id="hero"
    >
      {/* Background com gradiente limpo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2856] from-20% via-[#1a3a6b] via-60% to-[#2a4a7b] to-100%"></div>
      
      {/* Elementos decorativos com gradiente */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-[#00d856]/20 to-[#b1f727]/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-[#b1f727]/15 to-[#00d856]/15 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto" ref={containerRef}>
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-sm mb-8 opacity-0 animate-fade-in" 
            style={{ animationDelay: "0.1s" }}
          >
            <Heart className="w-4 h-4 mr-2" />
            <span>Feira do Esporte de Indaiatuba</span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white text-center leading-snug mb-6 opacity-0 animate-fade-in" 
            style={{ animationDelay: "0.3s" }}
          >
            <span className="block mb-2">FESPIN 2025</span>
            <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent block">Movimento que<br />Transforma</span>
          </h1>
          
          <p 
            className="text-lg md:text-xl lg:text-2xl text-white/80 text-center max-w-4xl mb-8 opacity-0 animate-fade-in leading-relaxed" 
            style={{ animationDelay: "0.5s" }}
          >
            A maior feira de esporte, fitness e bem-estar do interior paulista. Conectando pessoas, marcas e oportunidades em um só lugar.
          </p>
          
          <div 
            className="grid grid-cols-2 lg:flex lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-10 opacity-0 animate-fade-in text-white/90 max-w-2xl lg:max-w-none mx-auto" 
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 lg:px-4 py-2 border border-white/20 text-center justify-center">
              <Calendar className="w-4 h-4 mr-2 text-[#00d856] flex-shrink-0" />
              <span className="text-xs lg:text-sm font-medium">14 a 16 de novembro</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 lg:px-4 py-2 border border-white/20 text-center justify-center">
              <MapPin className="w-4 h-4 mr-2 text-[#b1f727] flex-shrink-0" />
              <span className="text-xs lg:text-sm font-medium">Espaço Viber, Indaiatuba/SP</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 lg:px-4 py-2 border border-white/20 text-center justify-center">
              <Clock className="w-4 h-4 mr-2 text-[#00d856] flex-shrink-0" />
              <span className="text-xs lg:text-sm font-medium">08 às 20h</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 lg:px-4 py-2 border border-white/20 text-center justify-center">
              <Ticket className="w-4 h-4 mr-2 text-[#b1f727] flex-shrink-0" />
              <span className="text-xs lg:text-sm font-medium">Entrada Gratuita</span>
            </div>
          </div>
          
          <div 
            className="flex justify-center opacity-0 animate-fade-in" 
            style={{ animationDelay: "0.8s" }}
          >
            <a 
              href="#expositor" 
              className="flex items-center justify-center group bg-gradient-to-r from-[#00d856] to-[#b1f727] text-[#0a2856] font-bold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl transform text-lg" 
            >
              Quero Ser Expositor
              <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-10 parallax" data-speed="0.05"></div>
    </section>
  );
};

export default Hero;
