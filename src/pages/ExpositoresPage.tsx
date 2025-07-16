import React, { useEffect, useRef, useState } from "react";
import { Search, MapPin, Store, Filter, ArrowUpDown, Grid3X3, Grid2X2, X, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlassChip } from "@/components/ui/glass-chip";
import { TextReveal } from "@/components/ui/text-reveal";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShimmerButton } from "@/components/ui/shimmer-button";
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
  const isMobile = useIsMobile();
  
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
  const [isGridView, setIsGridView] = useState(true);

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
      <section ref={headerRef} className="relative overflow-hidden min-h-[45vh] flex items-center bg-[#0a2856]">
        <div className="w-full">
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-[0.9] mb-6">
                <span className="block text-white mb-2">Expositores </span>
              </h1>
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
        </div>
      </section>
      
      {/* Filter bar */}
      <section ref={filterBarRef} className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm",
                  activeFilter === null
                    ? "bg-gradient-to-r from-[#0a2856] to-[#0a2856] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                )}
                onClick={() => setActiveFilter(null)}
              >
                Todos
              </button>
              
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm flex items-center gap-2",
                    activeFilter === categoria.id
                      ? `text-white shadow-md`
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={() => setActiveFilter(categoria.id)}
                  style={{ 
                    background: activeFilter === categoria.id 
                      ? `linear-gradient(to right, ${categoria.cor}, ${categoria.cor})` 
                      : '', 
                    color: activeFilter === categoria.id ? 'white' : '' 
                  }}
                >
                  {categoria.icone}
                  {categoria.nome}
                </button>
              ))}
            </div>
            
            {/* View toggle & expositores count */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-[#0a2856]">{isLoading ? '...' : filteredExpositores.length}</span> expositores encontrados
              </div>
              
              <div className="border-l border-gray-200 h-6"></div>
              
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                <button
                  className={cn(
                    "p-2 rounded-md transition-all duration-300",
                    isGridView 
                      ? "bg-gradient-to-r from-[#0a2856] to-[#0a2856] text-white shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => setIsGridView(true)}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                
                <button
                  className={cn(
                    "p-2 rounded-md transition-all duration-300",
                    !isGridView 
                      ? "bg-gradient-to-r from-[#0a2856] to-[#0a2856] text-white shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => setIsGridView(false)}
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Expositores grid/list */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className={cn(
              "grid gap-6",
              isGridView 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}>
              {filteredExpositores.map((expositor, index) => (
                <motion.div
                  key={expositor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={cn(
                    "overflow-hidden h-full bg-white/60 backdrop-blur-sm border-none shadow-xl relative group transition-all duration-300",
                    !isGridView && "flex flex-col md:flex-row"
                  )}>
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[#0a2856] group-hover:via-[#00d856] group-hover:to-[#b1f727] transition-all duration-500 opacity-70"></div>
                    
                    {/* Card image */}
                    <div 
                      className={cn(
                        "relative overflow-hidden",
                        isGridView 
                          ? "h-56 rounded-t-lg" 
                          : "h-56 md:h-auto md:w-2/5 md:rounded-l-lg md:rounded-tr-none"
                      )}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        style={{ backgroundImage: `url(${expositor.logo})` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      
                      {/* Animated decorative elements */}
                      <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00d856]/20 to-[#b1f727]/30 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#0a2856]/20 to-[#00d856]/30 rounded-full blur-xl transform -translate-x-1/2 translate-y-1/2"></div>
                      </div>
                      
                      {/* Category badge with animated shine effect */}
                      <div 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg overflow-hidden backdrop-blur-sm" 
                        style={{ 
                          backgroundColor: `${expositor.cor_primaria}CC`,
                        }}
                      >
                        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease_forwards]" style={{ animationDelay: `${index * 0.1}s` }}></div>
                        {categorias.find(cat => cat.id === expositor.categoria)?.nome}
                      </div>
                      
                      {/* Location badge with animated icon */}
                      <div className="absolute bottom-3 left-3 flex items-center text-white backdrop-blur-sm bg-black/30 px-2 py-1 rounded-full">
                        <MapPin className="w-4 h-4 mr-1 group-hover:animate-bounce" style={{ animationDuration: '1s' }} />
                        <span className="text-xs font-medium">{expositor.localizacao.split(" - ")[0]}</span>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "flex flex-col relative z-10",
                      !isGridView && "md:w-3/5"
                    )}>
                      <CardHeader className="pb-2">
                        <h3 className="card-title text-xl text-[#0a2856] group-hover:text-[#00d856] transition-colors duration-300 leading-tight">
                          {expositor.nome}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 flex items-center">
                          <Store className="w-3.5 h-3.5 mr-1 text-[#00d856]" />
                          {expositor.localizacao.split(" - ")[1]}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {expositor.descricao}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between items-center mt-auto pt-2">
                        <ShimmerButton
                          shimmerColor={expositor.cor_secundaria}
                          background={expositor.cor_primaria}
                          className="group relative w-full overflow-hidden rounded-lg px-4 py-2 text-sm font-medium border-none shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                        >
                          <span className="relative z-10 text-white font-semibold flex items-center justify-center">
                            Visitar estande
                            <ChevronRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </ShimmerButton>
                      </CardFooter>
                    </div>

                    {/* Add subtle diagonal pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-[#00d856]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </Card>
                </motion.div>
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
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight mb-6">
              <TextReveal highlightWords={["espaço"]}>
                Reserve seu espaço na
              </TextReveal>
              <br />
              <TextReveal highlightWords={["FESPIN", "2025"]}>
                FESPIN 2025
              </TextReveal>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se aos expositores da primeira feira de esporte do interior de São Paulo e conecte-se com mais de 15.000 visitantes qualificados.
            </p>
            
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
      
      <Footer />
    </div>
  );
};

export default ExpositoresPage;