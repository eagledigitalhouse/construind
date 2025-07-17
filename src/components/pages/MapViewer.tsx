import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Download, MapPin } from "lucide-react";

interface MapViewerProps {
  mapImage: string;
  title?: string;
  description?: string;
}

const MapViewer: React.FC<MapViewerProps> = ({ 
  mapImage, 
  title = "Mapa do Evento",
  description = "Clique e arraste para navegar. Use os botões para zoom." 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const downloadMap = () => {
    const link = document.createElement('a');
    link.href = mapImage;
    link.download = 'mapa-fespin-2025.png';
    link.click();
  };

  // Detectar ESC para sair do fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      // Bloquear scroll da página quando em fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm">
        {/* Fullscreen Header */}
        <div className="relative bg-gradient-to-r from-[#0a2856] to-[#00d856] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white hover:scale-105"
            title="Fechar tela cheia (ESC)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Fullscreen Map Container */}
        <div className="relative h-[calc(100vh-80px)] bg-gray-100 overflow-hidden">
          <TransformWrapper
            initialScale={1}
            minScale={0.3}
            maxScale={4}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: false }}
            pinch={{ step: 5 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Controles Flutuantes */}
                <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                  <button 
                    onClick={() => zoomIn()} 
                    className="p-3 bg-white/95 hover:bg-white rounded-xl shadow-lg text-[#0a2856] hover:scale-105 transition-all"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => zoomOut()} 
                    className="p-3 bg-white/95 hover:bg-white rounded-xl shadow-lg text-[#0a2856] hover:scale-105 transition-all"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => resetTransform()} 
                    className="p-3 bg-white/95 hover:bg-white rounded-xl shadow-lg text-[#0a2856] hover:scale-105 transition-all"
                    title="Reset"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>

                {/* Botão ESC Info */}
                <div className="absolute bottom-6 left-6 z-10 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                  Pressione <kbd className="px-2 py-1 bg-white/20 rounded">ESC</kbd> para sair
                </div>

                <TransformComponent>
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <img
                      src={mapImage}
                      alt="Mapa do Evento FESPIN 2025"
                      className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing select-none"
                      draggable={false}
                    />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Moderno */}
      <div className="bg-white rounded-t-2xl border-x border-t border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a2856] to-[#00d856] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadMap}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-gray-700 font-medium"
            >
              <Download className="w-4 h-4" />
              Baixar
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0a2856] to-[#00d856] hover:from-[#0a2856]/90 hover:to-[#00d856]/90 rounded-lg transition-all text-white font-medium"
            >
              <Maximize2 className="w-4 h-4" />
              Tela Cheia
            </button>
          </div>
        </div>
      </div>

      {/* Container do Mapa - Responsivo */}
      <div className="relative bg-gray-50 border-x border-gray-200">
        <div className="aspect-[16/10] w-full">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: false }}
            pinch={{ step: 5 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Controles Flutuantes */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button
                    onClick={() => zoomIn()}
                    className="p-3 bg-white/95 hover:bg-white rounded-xl shadow-lg transition-all duration-200 text-[#0a2856] hover:scale-105 hover:shadow-xl"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="p-3 bg-white/95 hover:bg-white rounded-xl shadow-lg transition-all duration-200 text-[#0a2856] hover:scale-105 hover:shadow-xl"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="p-3 bg-white/95 hover:bg-white rounded-xl shadow-lg transition-all duration-200 text-[#0a2856] hover:scale-105 hover:shadow-xl"
                    title="Reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Mapa */}
                <TransformComponent>
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={mapImage}
                      alt="Mapa do Evento FESPIN 2025"
                      className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing select-none"
                      draggable={false}
                    />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>

             {/* Legenda do Mapa */}
       <div className="bg-white border-x border-gray-200 p-6">
         <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
           <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0a2856] to-[#00d856] flex items-center justify-center">
             <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
           </div>
           Tipos de Estandes
         </h4>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
           {/* Estandes 3x3m */}
           <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
             <div className="flex items-start gap-4">
               <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#b1f727] to-[#00d856] flex items-center justify-center shadow-lg">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                 </svg>
               </div>
               <div className="flex-1">
                 <h5 className="text-xl font-bold text-gray-900 mb-2">ESTANDES 3X3M</h5>
                 <p className="text-gray-600 mb-3">Metragem de 9m² com estrutura completa</p>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#00d856] rounded-full"></div>
                     <span className="text-sm text-gray-700">Estande octanorme incluso</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#00d856] rounded-full"></div>
                     <span className="text-sm text-gray-700">Carpete incluso</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#00d856] rounded-full"></div>
                     <span className="text-sm text-gray-700">Energia 220V</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Área Livre 5x5m */}
           <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
             <div className="flex items-start gap-4">
               <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f8c954] to-[#f4b942] flex items-center justify-center shadow-lg">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                 </svg>
               </div>
               <div className="flex-1">
                 <h5 className="text-xl font-bold text-gray-900 mb-2">ÁREA LIVRE 5X5M</h5>
                 <p className="text-gray-600 mb-3">Metragem de 25m² - espaço livre</p>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#f8c954] rounded-full"></div>
                     <span className="text-sm text-gray-700">Sem estande - espaço livre</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#f8c954] rounded-full"></div>
                     <span className="text-sm text-gray-700">Energia 220V inclusa</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#f8c954] rounded-full"></div>
                     <span className="text-sm text-gray-700">Ideal para demonstrações</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

                   {/* Segmentos por Cores */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h5 className="text-lg font-bold text-gray-900 mb-4">Segmentos por Cores no Mapa</h5>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#b1f727] border border-gray-300 shadow-sm"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Academias</div>
                  <div className="text-xs text-gray-600">3x3m</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ff6d4d] border border-gray-300 shadow-sm"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Bem-estar</div>
                  <div className="text-xs text-gray-600">3x3m</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6cace3] border border-gray-300 shadow-sm"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Artigos Esportivos</div>
                  <div className="text-xs text-gray-600">3x3m</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4dff8e] border border-gray-300 shadow-sm"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Saúde & Nutrição</div>
                  <div className="text-xs text-gray-600">3x3m</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8c954] border border-gray-300 shadow-sm"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Área Livre</div>
                  <div className="text-xs text-gray-600">5x5m</div>
                </div>
              </div>
            </div>
          </div>
       </div>

       {/* Footer com Instruções */}
       <div className="bg-white rounded-b-2xl border-x border-b border-gray-200 p-6">
         <div className="flex flex-wrap items-center justify-between gap-4">
           <div className="flex flex-wrap gap-6">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#00d856] rounded-full"></div>
               <span className="text-sm text-gray-600">Clique e arraste para navegar</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#b1f727] rounded-full"></div>
               <span className="text-sm text-gray-600">Roda do mouse para zoom</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-[#0a2856] rounded-full"></div>
               <span className="text-sm text-gray-600">Duplo clique para zoom rápido</span>
             </div>
           </div>
           <div className="text-sm text-gray-500">
             💡 Use tela cheia para melhor experiência
           </div>
         </div>
       </div>
    </div>
  );
};

export default MapViewer; 