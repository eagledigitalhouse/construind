
import React from "react";
import novaImagem from "@/assets/41NYhR0lTlSlGvmRpFyhKQ.webp";
import { GlassChip } from "@/components/ui/glass-chip";

const SpecsSection = () => {
  return (
    <section className="w-full py-10 md:py-14 bg-white" id="por-que-existe">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header centralizado */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip>
              <span>Por que a FESPIN existe?</span>
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold leading-none text-center">
              <span className="text-[#0a2856]">Acreditamos que o<br /></span>
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">movimento transforma</span>
              <span className="text-[#0a2856]">.</span>
            </h2>
          </div>
          
          <div className="subtitle-section text-gray-700 max-w-3xl mx-auto opacity-0 animate-fade-in" style={{
            animationDelay: "0.5s"
          }}>
            Saúde vai além do físico...é atitude, é escolha, é comunidade.
          </div>
        </div>

        {/* Layout principal */}
        <div className="max-w-6xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          {/* Bloco superior: imagem e manifesto lado a lado */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Imagem à esquerda */}
              <div className="lg:border-r border-gray-100 h-auto">
                <img 
                  src={novaImagem} 
                  alt="FESPIN - Movimento que transforma" 
                  className="w-full h-auto object-cover sm:object-contain lg:object-cover"
                  style={{ 
                    maxHeight: "500px",
                    height: "auto"
                  }}
                />
              </div>
              
              {/* Manifesto à direita */}
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <div className="space-y-4 text-body leading-relaxed text-gray-700 text-center lg:text-left">
                  <p>
                    <span className="subtitle-medium font-semibold text-[#0a2856]">Movimento que transforma</span> é mais do que um slogan — é o coração da FESPIN. Ele representa a ideia de que toda mudança significativa começa com uma ação, por menor que seja.
                  </p>
                  
                  <p>
                    Ao incentivar o corpo a se mover, também despertamos a mente, criamos conexões e abrimos espaço para novas possibilidades. Esse movimento não se limita ao esporte: ele inspira escolhas mais saudáveis, relações mais fortes e uma comunidade mais ativa e unida.
                  </p>
                  
                  <p className="subtitle-medium font-display font-bold text-[#0a2856] pt-2">
                    É sobre transformar vidas, uma experiência de cada vez.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bloco inferior: números em linha */}
            <div className="border-t border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-4">
                <div className="text-center py-4 px-2 sm:p-6 border-r border-gray-100">
                  <div className="text-stat font-display font-extrabold text-[#00d856] mb-0">+15mil</div>
                  <div className="text-caption text-gray-500 mt-0">visitantes</div>
                </div>
                <div className="text-center py-4 px-2 sm:p-6 border-r sm:border-r border-gray-100">
                  <div className="text-stat font-display font-extrabold text-[#00d856] mb-0">3</div>
                  <div className="text-caption text-gray-500 mt-0">dias de evento</div>
                </div>
                <div className="text-center py-4 px-2 sm:p-6 border-r border-gray-100">
                  <div className="text-stat font-display font-extrabold text-[#00d856] mb-0">4</div>
                  <div className="text-caption text-gray-500 mt-0">segmentos</div>
                </div>
                <div className="text-center py-4 px-2 sm:p-6">
                  <div className="text-stat font-display font-extrabold text-[#00d856] mb-0">∞</div>
                  <div className="text-caption text-gray-500 mt-0">conexões</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
