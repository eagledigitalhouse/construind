import React, { useState, useEffect } from "react";
import { Crown, Star, Award, Heart, ArrowRight, X, ExternalLink } from "lucide-react";

import { GlassChip } from "@/components/ui/glass-chip";
import { usePatrocinadores } from '@/hooks/usePatrocinadores';
import { useCotasPatrocinio } from '@/hooks/useCotasPatrocinio';
import { supabase, type Patrocinador } from '@/lib/supabase';

const PatrocinadoresSection = () => {
  const { patrocinadores, loading: loadingFromHook, patrocinadorPorCategoria } = usePatrocinadores();
  const { cotas, loading: loadingCotas } = useCotasPatrocinio();
  const [patrocinadorSelecionado, setPatrocinadorSelecionado] = useState<Patrocinador | null>(null);
  const [loading, setLoading] = useState(true);
  const [patrocinadoresDireto, setPatrocinadoresDireto] = useState<Patrocinador[]>([]);
  const [cotasDiretas, setCotasDiretas] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Log para depuração
  console.log("Estado de carregamento:", { loading, loadingFromHook, loadingCotas });
  console.log("Dados disponíveis:", { 
    patrocinadores: patrocinadores.length, 
    patrocinadoresDireto: patrocinadoresDireto.length,
    cotas: cotas.length,
    cotasDiretas: cotasDiretas.length
  });

  // Carregar patrocinadores diretamente para garantir acesso sem autenticação
  useEffect(() => {
    const carregarPatrocinadoresDireto = async () => {
      try {
        setLoading(true);
        console.log("Iniciando carregamento direto de patrocinadores...");
        
        const { data, error } = await supabase
          .from('patrocinadores')
          .select('*')
          .order('posicao', { ascending: true });

        if (error) {
          console.error('Erro ao carregar patrocinadores:', error);
          setErrorMsg(`Erro: ${error.message}`);
        } else {
          console.log(`Carregados ${data?.length || 0} patrocinadores diretamente`);
          setPatrocinadoresDireto(data || []);
        }
        
        // Também carregar as cotas/categorias diretamente
        const { data: dataCategorias, error: errorCategorias } = await supabase
          .from('categorias')
          .select('*')
          .eq('tipo', 'patrocinador')
          .order('ordem', { ascending: true });
          
        if (errorCategorias) {
          console.error('Erro ao carregar categorias:', errorCategorias);
        } else {
          console.log(`Carregadas ${dataCategorias?.length || 0} categorias diretamente`);
          setCotasDiretas(dataCategorias || []);
        }
      } catch (err) {
        console.error('Erro ao carregar patrocinadores direto:', err);
        setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    carregarPatrocinadoresDireto();
  }, []);

  // Usar os patrocinadores do hook se disponíveis, senão usar os carregados diretamente
  const patrocinadoresFinais = patrocinadores.length > 0 ? patrocinadores : patrocinadoresDireto;
  const cotasFinais = cotas.length > 0 ? cotas : cotasDiretas.map(cat => ({
    id: cat.id,
    nome: cat.nome,
    key: cat.nome.toLowerCase().replace(/\s+/g, '_'),
    cor: cat.cor || '#0a2856',
    icone: cat.icone || 'crown',
    ordem: cat.ordem || 0,
    ativo: true,
    created_at: cat.created_at,
    updated_at: cat.updated_at
  }));
  
  const loadingFinal = loading && loadingFromHook && patrocinadoresFinais.length === 0;

  // Filtrar patrocinadores por categoria ID
  const patrocinadorPorCota = (categoriaId: string) => {
    // Usar a função do hook quando possível, senão filtrar manualmente
    if (patrocinadores.length > 0) {
      return patrocinadorPorCategoria(categoriaId);
    }
    return patrocinadoresDireto.filter(p => p.categoria_id === categoriaId);
  };

  // Obter classe CSS para tamanho do logo
  const obterTamanhoLogo = (tamanho: 'grande' | 'medio' | 'pequeno') => {
    switch (tamanho) {
      case 'grande':
        return 'h-32 w-48';
      case 'medio':
        return 'h-24 w-40';
      case 'pequeno':
        return 'h-20 w-32';
      default:
        return 'h-24 w-40';
    }
  };

  // Obter classes do grid baseado na cota
  const obterClassesGrid = () => {
    return 'flex flex-wrap justify-center';
  };
  
  // Verificar se temos algum conteúdo para mostrar
  const temConteudo = patrocinadoresFinais.length > 0 && cotasFinais.length > 0;
  const semDados = !loadingFinal && !temConteudo;

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Heart className="w-4 h-4" />}>
              Nossos Parceiros
            </GlassChip>
          </div>
          <h2 className="spacing-title text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-[#0a2856] leading-none">
            <div className="mb-2">
              Patrocinadores que<br /><span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">transformam</span> o <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">movimento</span>
            </div>
          </h2>
          <div className="subtitle-section opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p>
              Empresas que acreditam no poder do esporte e do bem-estar para transformar vidas e comunidades.
            </p>
          </div>
        </div>
        
        {/* Debug info - só visível em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Erro ao carregar dados:</p>
            <p>{errorMsg}</p>
          </div>
        )}
        
        {/* Patrocinadores por categoria */}
        <div className="space-y-12">
          {loadingFinal ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando patrocinadores...</p>
              <p className="text-xs text-gray-400 mt-2">
                Aguarde enquanto buscamos as informações dos nossos parceiros
              </p>
            </div>
          ) : semDados ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Informações sobre patrocinadores em breve!</p>
              <p className="text-xs text-gray-400 mt-2">
                Estamos atualizando nossa lista de parceiros
              </p>
            </div>
          ) : (
            cotasFinais.map((cota) => {
              const patrocinadoresdaCota = patrocinadorPorCota(cota.id);
              if (!patrocinadoresdaCota || patrocinadoresdaCota.length === 0) {
                return null;
              }
              return (
                <div key={cota.id} className="space-y-6">
                  {/* Título da categoria */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <div className="flex items-center px-6">
                      <h3 className="subtitle-large font-display font-bold text-gray-900">
                        {cota.nome}
                      </h3>
                    </div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  {/* Grid de patrocinadores */}
                  <div className={`${obterClassesGrid()} gap-10 max-w-6xl mx-auto`}>
                  {patrocinadoresdaCota.map((patrocinador, index) => (
                    <img
                      key={patrocinador.id}
                      src={patrocinador.logo}
                      alt={`Logo ${patrocinador.nome}`}
                      className={`${obterTamanhoLogo(patrocinador.tamanho_logo)} object-contain cursor-pointer opacity-0 animate-fade-in hover:opacity-100 transition-opacity duration-300 flex-shrink-0`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setPatrocinadorSelecionado(patrocinador)}
                      title={`Clique para ver detalhes de ${patrocinador.nome}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const div = document.createElement('div');
                          div.className = `${obterTamanhoLogo(patrocinador.tamanho_logo)} flex items-center justify-center bg-gray-100 text-gray-500 text-sm cursor-pointer`;
                          div.innerHTML = `
                            <div class="text-center">
                              <div class="mb-2">Imagem</div>
                              <div>Logo não disponível</div>
                            </div>
                          `;
                          parent.appendChild(div);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })
          )}
          
          {/* Fallback para quando tivermos patrocinadores mas não cotas */}
          {!loadingFinal && cotasFinais.length === 0 && patrocinadoresFinais.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <div className="flex items-center px-6">
                  <h3 className="subtitle-large font-display font-bold text-gray-900">
                    Patrocinadores
                  </h3>
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
                {patrocinadoresFinais.map((patrocinador, index) => (
                  <img
                    key={patrocinador.id}
                    src={patrocinador.logo}
                    alt={`Logo ${patrocinador.nome}`}
                    className="h-24 w-40 object-contain cursor-pointer opacity-0 animate-fade-in hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setPatrocinadorSelecionado(patrocinador)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const div = document.createElement('div');
                        div.className = "h-24 w-40 flex items-center justify-center bg-gray-100 text-gray-500 text-sm cursor-pointer";
                        div.innerHTML = `
                          <div class="text-center">
                            <div class="mb-2">Imagem</div>
                            <div>Logo não disponível</div>
                          </div>
                        `;
                        parent.appendChild(div);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Detalhes do Patrocinador */}
        {patrocinadorSelecionado && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setPatrocinadorSelecionado(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 transform animate-in fade-in-0 zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="subtitle-medium font-display font-bold text-gray-900">
                  Detalhes do Patrocinador
                </h2>
                <button
                  onClick={() => setPatrocinadorSelecionado(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6">
                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`${obterTamanhoLogo(patrocinadorSelecionado.tamanho_logo)} max-w-xs bg-gray-50 rounded-xl p-4 border border-gray-200`}>
                    <img
                      src={patrocinadorSelecionado.logo}
                      alt={`Logo ${patrocinadorSelecionado.nome}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                              <div class="text-center">
                                <div class="mb-2">Imagem</div>
                                <div>Logo não disponível</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Informações */}
                <div className="text-center space-y-4">
                  {/* Nome da empresa */}
                  <h3 className="subtitle-large font-display font-bold text-gray-900">
                    {patrocinadorSelecionado.nome}
                  </h3>
                  
                  {/* Categoria */}
                  <p className="text-body text-gray-600">
                    {patrocinadorSelecionado.categoria}
                  </p>
                  
                  {/* Descrição */}
                  {patrocinadorSelecionado.descricao && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-6">
                      <p className="text-body text-gray-700 leading-relaxed">
                        {patrocinadorSelecionado.descricao}
                      </p>
                    </div>
                  )}

                  {/* Botão para visitar site */}
                  {patrocinadorSelecionado.website && (
                    <div className="pt-6">
                      <a
                        href={patrocinadorSelecionado.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-[#0a2856] hover:bg-[#0a2856]/90 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Visitar Site
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </section>
  );
};

export default PatrocinadoresSection;