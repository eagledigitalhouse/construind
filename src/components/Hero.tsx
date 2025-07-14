
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import heroImage from "@/assets/people-exercising-hero.jpg";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
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
    // Skip effect on mobile
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      
      const {
        left,
        top,
        width,
        height
      } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMobile]);
  
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
      className="overflow-hidden relative min-h-screen bg-fespin-gradient-hero" 
      id="hero"
    >
      <div className="absolute inset-0 bg-fespin-overlay"></div>
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-accent opacity-20 blur-3xl rounded-full"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      
        <div className="flex flex-col lg:flex-row gap-12 items-center" ref={containerRef}>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-primary font-medium text-sm mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>2025</span>
            </div>
            
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-white opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.3s" }}
            >
              FESPIN 2025<br />
              <span className="text-accent">Movimento que Transforma</span>
            </h1>
            
            <div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-6 mb-8 opacity-0 animate-fade-in text-white/90" 
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
                className="flex items-center justify-center group bg-accent text-primary font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-accent/90 hover:scale-105 transform" 
              >
                Quero Participar
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#expositor" 
                className="flex items-center justify-center group bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-primary hover:scale-105 transform" 
              >
                Seja um Expositor
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
            <div className="relative transition-all duration-500 ease-out overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl opacity-0 animate-fade-in" style={{ animationDelay: "0.9s" }}>
              <img 
                ref={imageRef} 
                src={heroImage} 
                alt="Pessoas se exercitando na FESPIN" 
                className="w-full h-auto object-cover transition-transform duration-500 ease-out" 
                style={{ transformStyle: 'preserve-3d' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-float">
              <span className="text-primary font-bold text-xl">2025</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary rounded-full flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
              <span className="text-white font-bold text-sm">NOV</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-10 parallax" data-speed="0.05"></div>
    </section>
  );
};

export default Hero;
