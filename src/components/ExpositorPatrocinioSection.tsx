import React from "react";
import { ArrowRight, Store, Star } from "lucide-react";
import { TextReveal } from "@/components/ui/text-reveal";
import { GlassChip } from "@/components/ui/glass-chip";
import { Link } from "react-router-dom";

const ExpositorPatrocinioSection = () => {
  const beneficiosExpositor = [
    "Acesso direto ao público qualificado",
    "Networking com profissionais do setor", 
    "Exposição da marca em ambiente premium",
    "Oportunidades de vendas e parcerias"
  ];

  const beneficiosPatrocinio = [
    "Logo em destaque no site e materiais",
    "Post colaborativo com a marca (cota master)",
    "Presença em telão e sinalização",
    "Ações de engajamento no evento"
  ];

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Star className="w-4 h-4" />}>
              Seja um parceiro
            </GlassChip>
          </div>
          
          <div className="mb-1">
            <TextReveal className="py-0" highlightWords={["movimento"]}>
              Sua marca no centro do movimento.
            </TextReveal>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card Expositor */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300 h-[400px] flex flex-col">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#0a2856] rounded-lg flex items-center justify-center mr-4">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-[#0a2856]">
                  Expositor
                </h3>
                <p className="text-gray-600">Mostre seus produtos</p>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Benefícios:</h4>
              <ul className="space-y-3">
                {beneficiosExpositor.map((beneficio, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-[#0a2856] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/expositor"
                className="inline-flex items-center justify-center w-full bg-[#0a2856] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a3666] transition-colors duration-200"
              >
                Quero ser Expositor
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card Patrocínio */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300 h-[400px] flex flex-col">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#22c55e] rounded-lg flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-[#0a2856]">
                  Patrocínio
                </h3>
                <p className="text-gray-600">Apoie o evento</p>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Benefícios:</h4>
              <ul className="space-y-3">
                {beneficiosPatrocinio.map((beneficio, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/patrocinio"
                className="inline-flex items-center justify-center w-full bg-[#22c55e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#16a34a] transition-colors duration-200"
              >
                Quero Patrocinar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpositorPatrocinioSection;