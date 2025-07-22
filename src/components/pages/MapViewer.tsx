import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Download, MapPin } from "lucide-react";

interface MapViewerProps {
  mapImage: string;
  title?: string;
  description?: string;
  showDownloadButton?: boolean;
  showFullscreenButton?: boolean;
}

const MapViewer: React.FC<MapViewerProps> = ({ 
  mapImage, 
  title = "Mapa do Evento",
  description = "Clique e arraste para navegar. Use os botões para zoom.",
  showDownloadButton = true,
  showFullscreenButton = true
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
            initialScale={1.1}
            minScale={1.05}
            maxScale={3}
            centerOnInit={true}
            limitToBounds={true}
            centerZoomedOut={false}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: false }}
            pinch={{ step: 5 }}
            panning={{ 
              disabled: false,
              velocityDisabled: true
            }}
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
      {/* Header com botões (só renderizar se pelo menos um botão deve aparecer) */}
      {(showDownloadButton || showFullscreenButton) && (
        <div className="bg-white rounded-t-2xl border-x border-t border-gray-200 p-4 sm:p-6">
          <div className="flex gap-2 sm:gap-3 justify-center">
            {showDownloadButton && (
              <button
                onClick={downloadMap}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-gray-700 font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Baixar</span>
              </button>
            )}
            {showFullscreenButton && (
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#0a2856] to-[#00d856] hover:from-[#0a2856]/90 hover:to-[#00d856]/90 rounded-lg transition-all text-white font-medium text-sm"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Tela Cheia</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Container do Mapa - Responsivo */}
      <div className={`relative bg-gray-50 border-x border-gray-200 ${!(showDownloadButton || showFullscreenButton) ? 'rounded-t-2xl border-t' : ''}`}>
        <div className="aspect-[16/10] w-full">
          <TransformWrapper
            initialScale={1.1}
            minScale={1.05}
            maxScale={3}
            centerOnInit={true}
            limitToBounds={true}
            centerZoomedOut={false}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: false }}
            pinch={{ step: 5 }}
            panning={{ 
              disabled: false,
              velocityDisabled: true
            }}
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

       {/* Legenda dos Segmentos - Layout Horizontal Compacto */}
       <div className="bg-white rounded-b-2xl border-x border-b border-gray-200 p-4">
         <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
           <h4 className="text-base font-bold text-gray-800 mb-3 text-center">Segmentos por Cores</h4>
           
           {/* Layout responsivo - linha única no desktop, wrap no mobile */}
           <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4">
             <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-all">
               <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#B6FF72'}}></div>
               <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">Academia</span>
             </div>
             
             <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-all">
               <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#FF776C'}}></div>
               <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">Bem-estar</span>
             </div>
             
             <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-all">
               <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#A6CFFF'}}></div>
               <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">Artigos Esportivos</span>
             </div>
             
             <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-all">
               <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#38FFB8'}}></div>
               <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">Saúde e Nutrição</span>
             </div>
             
             <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-all">
               <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#FFE27F'}}></div>
               <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">Área Livre</span>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default MapViewer;