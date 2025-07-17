import React from "react";
import { ArrowRight, Store, Star } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";
import { Link } from "react-router-dom";

const ExpositorPatrocinioSection = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header - MANTIDO ORIGINAL */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Star className="w-4 h-4" />}>
              Seja um parceiro
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-none text-center">
              <span className="text-[#0a2856]">Sua marca no centro do </span>
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">movimento</span>
              <span className="text-[#0a2856]">.</span>
            </h2>
          </div>
        </div>

        {/* Cards Grid - LAYOUT DO BELIEFS */}
        <div className='mx-auto max-w-2xl lg:max-w-7xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>

            {/* COLUMN-1 - EXPOSITOR */}
            <div className="bg-darkblue bg-beliefs pt-12 px-10 sm:px-24 pb-52 md:pb-70 rounded-3xl">
              <h2 className="text-lg font-normal text-white tracking-widest mb-5 text-center sm:text-start">EXPOSITOR</h2>
              <h3 className="text-4xl sm:text-65xl font-bold text-white leading-snug mb-5 text-center sm:text-start">Mostre <span className="text-grey">seus produtos e serviços.</span></h3>
              <h5 className="text-offwhite pt-2 mb-5 text-center sm:text-start">Acesso direto ao público qualificado do setor com networking premium e oportunidades de vendas estratégicas.</h5>
              <div className="text-center sm:text-start">
                <Link to="/expositor">
                  <button className="text-xl py-5 px-14 mt-5 font-semibold text-white rounded-full bg-blue border border-blue hover:bg-hoblue">Quero ser Expositor</button>
                </Link>
              </div>
            </div>

            {/* COLUMN-2 - PATROCÍNIO */}
            <div className="bg-build pt-12 px-10 sm:px-24 pb-52 md:pb-70 rounded-3xl">
              <h2 className="text-lg font-normal text-blue tracking-widest mb-5 text-center sm:text-start">PATROCÍNIO</h2>
              <h3 className="text-4xl sm:text-65xl font-bold text-black leading-snug mb-5 text-center sm:text-start"><span className="text-blue">Apoie</span> e fortaleça o evento.</h3>
              <h5 className="bluish pt-2 mb-5 text-center sm:text-start">Logo em destaque, presença em materiais promocionais e ações de engajamento para ativação da sua marca.</h5>
              <div className="text-center sm:text-start">
                <Link to="/patrocinio">
                  <button className="text-xl py-5 px-14 mt-5 font-semibold text-white rounded-full bg-blue border border-blue hover:bg-hoblue">Quero Patrocinar</button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpositorPatrocinioSection;