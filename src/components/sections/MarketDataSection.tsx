"use client";

import React, { useRef, useEffect, useState } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { motion } from "motion/react";

const MarketDataSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const dataRef1 = useRef<HTMLDivElement>(null);
  const dataRef2 = useRef<HTMLDivElement>(null);
  const dataRef3 = useRef<HTMLDivElement>(null);
  const dataRef4 = useRef<HTMLDivElement>(null);
  const dataRef5 = useRef<HTMLDivElement>(null);
  const dataRef6 = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0a2856] text-white py-8 md:py-16 px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00d856]/20 to-[#b1f727]/20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-1 mt-4 md:mb-2 md:mt-0"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-0 px-4">
            Um mercado{" "}
            <span className="text-transparent bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text">
              bilionário
            </span>
            ,<br />em pleno crescimento.
          </h2>
        </motion.div>

        {/* Fonte dos dados - ABAIXO DO TÍTULO PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="text-white/60 text-sm md:text-base leading-tight">
            Fonte: Global Wellness Institute + IBGE + Statista
          </p>
        </motion.div>

        {/* Container dos dados com animated beam */}
        <div
          ref={containerRef}
          className="relative max-w-7xl mx-auto min-h-[550px] md:min-h-[700px] lg:min-h-[800px] mb-20 mt-16 md:mt-0"
        >
          {/* Centro - Ponto de convergência */}
          <div
            ref={centerRef}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#00d856] to-[#b1f727] rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-16 h-16 bg-[#0a2856] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-[#00d856]">$</span>
              </div>
            </div>
          </div>

          {/* LADO ESQUERDO - 3 cards */}
          
          {/* Card 1 - Alimentação Saudável */}
          <motion.div
            ref={dataRef1}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute left-4 top-4 md:left-8 lg:left-12 md:top-8 lg:top-12 group"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 flex flex-col justify-center items-center text-center">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#00d856] mb-2 leading-tight">
                U$ 702 bilhões
              </div>
              <div className="text-white/90 text-xs md:text-sm lg:text-base leading-tight">
                Alimentação Saudável, Nutrição e Perda de Peso
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Atividade Física */}
          <motion.div
            ref={dataRef2}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute left-4 top-[180px] md:left-8 lg:left-12 md:top-[280px] lg:top-[320px] group"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 flex flex-col justify-center items-center text-center">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#b1f727] mb-2 leading-tight">
                U$ 828 bilhões
              </div>
              <div className="text-white/90 text-xs md:text-sm lg:text-base leading-tight">
                Atividade Física
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Beleza e Cuidados */}
          <motion.div
            ref={dataRef3}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute left-4 top-[360px] md:left-8 lg:left-12 md:top-[560px] lg:top-[640px] group"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 flex flex-col justify-center items-center text-center">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#00d856] mb-2 leading-tight">
                U$ 1.082 trilhões
              </div>
              <div className="text-white/90 text-xs md:text-sm lg:text-base leading-tight">
                Beleza, Cuidados Pessoais e Anti-envelhecimento
              </div>
            </div>
          </motion.div>

          {/* LADO DIREITO - 3 cards */}

          {/* Card 4 - Turismo e Bem-Estar */}
          <motion.div
            ref={dataRef4}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute right-4 top-4 md:right-8 lg:right-12 md:top-8 lg:top-12 group"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 flex flex-col justify-center items-center text-center">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#b1f727] mb-2 leading-tight">
                U$ 639 bilhões
              </div>
              <div className="text-white/90 text-xs md:text-sm lg:text-base leading-tight">
                Turismo e Experiências de Bem-Estar
              </div>
            </div>
          </motion.div>

          {/* Card 5 - Setor Wellness Global */}
          <motion.div
            ref={dataRef5}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="absolute right-4 top-[180px] md:right-8 lg:right-12 md:top-[280px] lg:top-[320px] group"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 flex flex-col justify-center items-center text-center">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#00d856] mb-2 leading-tight">
                + U$ 5 trilhões
              </div>
              <div className="text-white/90 text-xs md:text-sm lg:text-base leading-tight">
                Setor Wellness Global (2024)
              </div>
            </div>
          </motion.div>

          {/* Card 6 - Mercado Nacional Fitness */}
          <motion.div
            ref={dataRef6}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="absolute right-4 top-[360px] md:right-8 lg:right-12 md:top-[560px] lg:top-[640px] group"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 flex flex-col justify-center items-center text-center">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-[#b1f727] mb-2 leading-tight">
                R$ 10 bilhões
              </div>
              <div className="text-white/90 text-xs md:text-sm lg:text-base leading-tight">
                Mercado Nacional Fitness/Ano
              </div>
            </div>
          </motion.div>

          {/* Animated Beams - com z-index baixo para ficar atrás da imagem */}
          <div className="absolute inset-0 z-10">
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={dataRef1}
              toRef={centerRef}
              curvature={-20}
              delay={1}
              duration={3}
              pathColor="#00d856"
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={dataRef2}
              toRef={centerRef}
              curvature={0}
              delay={1.1}
              duration={3}
              pathColor="#b1f727"
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={dataRef3}
              toRef={centerRef}
              curvature={20}
              delay={1.2}
              duration={3}
              pathColor="#00d856"
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={dataRef4}
              toRef={centerRef}
              curvature={20}
              delay={1.3}
              duration={3}
              pathColor="#b1f727"
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={dataRef5}
              toRef={centerRef}
              curvature={0}
              delay={1.4}
              duration={3}
              pathColor="#00d856"
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={dataRef6}
              toRef={centerRef}
              curvature={-20}
              delay={1.5}
              duration={3}
              pathColor="#b1f727"
              pathOpacity={0.15}
            />
          </div>
        </div>

      </div>
      
      {/* Imagem da mulher fazendo ioga - surgindo de baixo para cima - CENTRALIZADA NA TELA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <motion.div
          className="w-96 h-96 sm:w-[32rem] sm:h-[32rem] md:w-[40rem] md:h-[40rem] lg:w-[50rem] lg:h-[50rem] xl:w-[60rem] xl:h-[60rem]"
          initial={{ y: 200, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            duration: 1.2,
          }}
          animate={{
            y: scrollY * 0.02,
            x: scrollY * 0.01,
          }}
        >
          <img 
            src="/woman-yoga-position-isolated.png"
            alt="Mulher fazendo yoga"
            className="w-full h-full object-contain opacity-100"
            style={{
              filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.4))"
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MarketDataSection;