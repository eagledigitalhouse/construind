
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import fespinBackground from "@/assets/FESPIN -APRESENTAÇÃO.png";

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
      className="overflow-hidden relative min-h-screen flex items-center bg-[#0a2856]" 
      id="hero"
    >
      {/* Background com gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2856] from-40% via-[#00d856]/90 via-75% to-[#b1f727]/80"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${fespinBackground})`,
          opacity: 0.75,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Gradiente adicional para melhorar contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a2856]/80 from-0% via-transparent via-30% to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col items-center lg:items-start max-w-4xl mx-auto" ref={containerRef}>
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-primary font-medium text-sm mb-4 lg:mb-6 opacity-0 animate-fade-in" 
            style={{ animationDelay: "0.1s" }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span>2025</span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl hero-title text-white text-center lg:text-left opacity-0 animate-fade-in" 
            style={{ animationDelay: "0.3s", fontWeight: "900" }}
          >
            FESPIN 2025<br />
            <span className="text-accent">Movimento que Transforma</span>
          </h1>
          
          <div 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4 lg:mt-6 mb-6 lg:mb-8 opacity-0 animate-fade-in text-white/90" 
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-accent" />
              <span className="text-lg">14 a 16 de novembro</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-accent" />
              <span className="text-lg">Espaço Viber, Indaiatuba/SP</span>
            </div>
          </div>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" 
            style={{ animationDelay: "0.7s" }}
          >
            <a 
              href="#participar" 
              className="flex items-center justify-center group bg-accent text-primary button-primary py-4 px-8 rounded-full transition-all duration-300 hover:bg-accent/90 hover:scale-105 transform" 
            >
              Quero Participar
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a 
              href="#expositor" 
              className="flex items-center justify-center group bg-transparent border-2 border-white text-white button-secondary py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-primary hover:scale-105 transform" 
            >
              Seja um Expositor
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Floating elements */}
          <div className="absolute top-4 right-4 lg:-right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-float">
            <span className="text-primary font-extrabold text-xl">2025</span>
          </div>
          <div className="absolute -bottom-4 left-4 lg:-left-4 w-20 h-20 bg-secondary rounded-full flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
            <span className="text-white font-extrabold text-sm">NOV</span>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-10 parallax" data-speed="0.05"></div>
    </section>
  );
};

export default Hero;
