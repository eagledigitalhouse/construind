import { PinContainer } from "@/components/ui/3d-pin";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { GlassChip } from "@/components/ui/glass-chip";
import { Store, MapPin, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { BorderBeam } from "@/components/magicui/border-beam";

interface ExpositorCardProps {
  expositor: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
    localizacao: string;
    logo?: string;
    cor_primaria: string;
    cor_secundaria: string;
  };
  index: number;
  categorias?: Array<{ id: string; nome: string }>;
}

export function ExpositorCard({ expositor, index, categorias = [] }: ExpositorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full px-1 sm:px-2 bg-white rounded-2xl"
    >
      <PinContainer
        title={expositor.localizacao}
        href={`/expositor/${expositor.id}`}
        containerClassName="h-[18rem] sm:h-[24rem] relative z-10"
      >
        <div className="relative flex basis-full flex-col p-2 sm:p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[16rem] sm:w-[20rem] h-[16rem] sm:h-[20rem] bg-white rounded-xl border-2 border-gray-200 shadow-xl hover:shadow-2xl hover:border-[#00d856]/30 transition-all duration-300 overflow-hidden group">
          <BorderBeam 
            duration={8} 
            size={80} 
            delay={index * 0.5}
            colorFrom="#00d856"
            colorTo="#b1f727"
            className="rounded-xl"
          />
          {/* Logo/Imagem */}
          <div className="relative h-20 sm:h-32 overflow-hidden rounded-lg z-30">
            {expositor.logo ? (
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${expositor.logo})` }}
              />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center">
                <Store className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Faixa separadora */}
          <div className="w-full h-px bg-gray-200 my-1 sm:my-2 z-30"></div>
          
          {/* Conteúdo centralizado */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-30">
            {/* Título */}
            <h3 className="font-bold text-base sm:text-lg text-[#0a2856] mb-1 sm:mb-2 leading-tight group-hover:text-[#00d856] transition-colors duration-300">
              {expositor.nome}
            </h3>
            
            {/* Categoria */}
            <div>
              <div 
                className="inline-block px-2 sm:px-3 py-1 rounded-full text-sm sm:text-xs font-bold text-white shadow-sm" 
                style={{ backgroundColor: `${expositor.cor_primaria}` }}
              >
                {categorias.find(cat => cat.id === expositor.categoria)?.nome || expositor.categoria}
              </div>
            </div>
          </div>
        </div>
      </PinContainer>
    </motion.div>
  );
}