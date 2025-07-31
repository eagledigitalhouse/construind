import React, { useEffect, useRef, useState } from "react";
import { Search, X, Loader2, AlertCircle, Store, ChevronRight, Info } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/sections/Newsletter";
import { GlassChip } from "@/components/ui/glass-chip";
import { ShimmerButton } from "@/components/ui/shimmer-button";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { ExpositorCard } from "@/components/ui/ExpositorCard";

import { useExpositores } from "@/hooks/useExpositores";

// Define a shine animation
const shineAnimation = `
@keyframes shine {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(200%);
  }
}
`;

const ExpositoresPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Usar hook do Supabase para carregar expositores
  const { expositores, loading: isLoading, error } = useExpositores();

  const categorias = [
    { id: "academias", nome: "Academias", cor: "#0a2856", icone: <Store className="w-4 h-4" /> },
    { id: "bem-estar", nome: "Bem-Estar", cor: "#00d856", icone: <Store className="w-4 h-4" /> },
    { id: "artigos", nome: "Artigos Esportivos", cor: "#b1f727", icone: <Store className="w-4 h-4" /> },
    { id: "nutricao", nome: "Saúde e Nutrição", cor: "#45b7d1", icone: <Store className="w-4 h-4" /> },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExpositores, setFilteredExpositores] = useState<typeof expositores>(expositores);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);


  // Filter expositores based on search query and active filter
  useEffect(() => {
    let filtered = expositores;
    
    if (searchQuery) {
      filtered = filtered.filter(
        (expositor) =>
          expositor.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expositor.localizacao.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter) {
      filtered = filtered.filter((expositor) => expositor.categoria === activeFilter);
    }
    
    setFilteredExpositores(filtered);
  }, [searchQuery, activeFilter, expositores]);

  // Intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white relative">
      <style dangerouslySetInnerHTML={{ __html: shineAnimation }} />
      <Navbar />
      
      {/* Hero Section */}
      <section ref={headerRef} className="relative overflow-hidden bg-[#0a2856]">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título separado */}
          <div className="text-center max-w-5xl mx-auto pt-24 pb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-normal text-white">
              EXPOSITORES
            </h1>
          </div>
          
          {/* Filtros separados */}
          <div className="text-center max-w-5xl mx-auto pb-4">
            {/* Category filters */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 overflow-x-auto scrollbar-hide">
              <button
                className={cn(
                  "px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm whitespace-nowrap flex-shrink-0",
                  activeFilter === null
                    ? "bg-white text-[#0a2856]"
                    : "bg-white/20 text-white/80 hover:bg-white/30 border border-white/20"
                )}
                onClick={() => setActiveFilter(null)}
              >
                Todos
              </button>
              
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={cn(
                    "px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0",
                    activeFilter === categoria.id
                      ? "bg-white text-[#0a2856]"
                      : "bg-white/20 text-white/80 hover:bg-white/30 border border-white/20"
                  )}
                  onClick={() => setActiveFilter(categoria.id)}
                >
                  <span className="text-xs sm:text-sm">{categoria.icone}</span>
                  <span className="hidden sm:inline">{categoria.nome}</span>
                  <span className="sm:hidden text-xs">{categoria.nome.split(' ')[0]}</span>
                </button>
              ))}
            </div>
            
            {/* Search bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-white/60" />
                </div>
                <input
                  type="text"
                  className="w-full bg-white/10 text-white placeholder:text-white/60 rounded-xl py-3 pl-10 pr-4 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d856]/50 transition-all duration-300"
                  placeholder="Buscar expositores por nome ou localização..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-5 h-5 text-white/60 hover:text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Results count bar */}
      <section ref={filterBarRef} className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00d856]" />
              <span>Passe o mouse sobre um expositor para ver a localização do stand</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Expositores grid/list */}
      <section className="pt-0 pb-12 md:pt-0 md:pb-16">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0a2856] via-[#00d856] to-[#b1f727] p-[2px] shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#0a2856] animate-spin" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#0a2856] via-[#00d856] to-[#b1f727] opacity-30 blur-lg"></div>
              </div>
              <h3 className="text-2xl font-display font-bold text-[#0a2856] mb-4">Carregando expositores...</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Aguarde enquanto buscamos os expositores do evento.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-[2px] shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 opacity-30 blur-lg"></div>
              </div>
              <h3 className="text-2xl font-display font-bold text-red-600 mb-4">Erro ao carregar expositores</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Ocorreu um erro ao buscar os expositores. Tente novamente mais tarde.
              </p>
              <ShimmerButton
                background="#dc2626"
                shimmerColor="#ef4444"
                borderRadius="0.75rem"
                className="px-8 py-3 text-white font-medium"
                onClick={() => window.location.reload()}
              >
                <span className="flex items-center">
                  Tentar novamente
                  <ChevronRight className="ml-2 w-4 h-4" />
                </span>
              </ShimmerButton>
            </div>
          ) : filteredExpositores.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0a2856] via-[#00d856] to-[#b1f727] p-[2px] shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Store className="w-12 h-12 text-[#0a2856]" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#0a2856] via-[#00d856] to-[#b1f727] opacity-30 blur-lg"></div>
              </div>
              <h3 className="text-2xl font-display font-bold text-[#0a2856] mb-4">Nenhum expositor encontrado</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Não encontramos expositores com os critérios de busca aplicados. Tente uma nova busca ou remova os filtros ativos.
              </p>
              <ShimmerButton
                background="#00d856"
                shimmerColor="#b1f727"
                borderRadius="0.75rem"
                className="px-8 py-3 text-white font-medium"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter(null);
                }}
              >
                <span className="flex items-center">
                  Limpar filtros
                  <X className="ml-2 w-4 h-4" />
                </span>
              </ShimmerButton>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gridRowGap: '1rem' }}>
              {filteredExpositores.map((expositor, index) => (
                <ExpositorCard
                 key={expositor.id}
                 expositor={expositor}
                 index={index}
                 categorias={categorias}
               />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background-section2.png')] bg-cover bg-center opacity-5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <GlassChip icon={<Store className="w-4 h-4" />} className="mb-6">
              Seja um expositor
            </GlassChip>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-gray-900 leading-tight mb-6">
              Reserve seu <span className="text-[#00d856] font-semibold">espaço</span> na
              <br />
              <span className="text-[#00d856] font-semibold">FESPIN</span> <span className="text-[#00d856] font-semibold">2025</span>
            </h2>
            
            <div className="subtitle-section mb-8 max-w-2xl mx-auto">
              Junte-se aos expositores da primeira feira de esporte do interior de São Paulo e conecte-se com mais de 15.000 visitantes qualificados.
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/expositor"
                className="px-8 py-3 bg-[#0a2856] text-white rounded-xl font-medium hover:bg-[#0a2856]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Seja um expositor
              </a>
              <a
                href="#mapa-evento"
                className="px-8 py-3 bg-white text-[#0a2856] border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Ver mapa do evento
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ExpositoresPage;