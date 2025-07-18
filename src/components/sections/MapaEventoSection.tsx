import React from "react";
import { MapPin } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";
import MapViewer from "@/components/pages/MapViewer";

const MapaEventoSection = () => {
  return (
    <section id="mapa-evento" className="w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<MapPin className="w-4 h-4" />}>
              Layout do evento
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 leading-none mb-3">
              Confira o <span className="text-[#00d856]">Mapa</span> do <span className="text-[#00d856]">evento</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              Veja a distribuição dos estandes e escolha a localização ideal para sua marca.
            </p>
          </div>
        </div>
        
        {/* Visualizador do Mapa */}
        <div className="max-w-6xl mx-auto">
          <MapViewer 
            mapImage="/mapa fespin.png"
            title="Mapa do Evento FESPIN 2025"
            description="Visualize a distribuição dos estandes e escolha a localização ideal para sua marca"
          />
        </div>
      </div>
    </section>
  );
};

export default MapaEventoSection;