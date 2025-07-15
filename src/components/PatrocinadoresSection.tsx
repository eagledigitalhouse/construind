import React, { useState, useEffect } from "react";
import { Crown, Star, Award, Building2, Heart, ArrowRight, X, ExternalLink } from "lucide-react";

interface Patrocinador {
  id: string;
  nome: string;
  logo: string;
  website: string;
  categoria: string;
  cota: 'diamante' | 'ouro' | 'prata';
  tamanhoLogo: 'grande' | 'medio' | 'pequeno';
  descricao?: string;
}

interface Cota {
  key: 'diamante' | 'ouro' | 'prata';
  nome: string;
  icon: React.ReactNode;
  cor: string;
  corFundo: string;
  tamanhoLogo: string;
  colunas: string;
  padding: string;
}

const PatrocinadoresSection = () => {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [patrocinadorSelecionado, setPatrocinadorSelecionado] = useState<Patrocinador | null>(null);

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPatrocinadorSelecionado(null);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const [cotas, setCotas] = useState<Cota[]>([
    {
      nome: "Patrocínio Diamante",
      key: "diamante",
      icon: <Crown className="w-5 h-5" />,
      cor: "#0a2856",
      corFundo: "#0a2856",
      tamanhoLogo: "h-24 w-40",
      colunas: "grid-cols-1",
      padding: "p-8"
    },
    {
      nome: "Patrocínio Ouro",
      key: "ouro",
      icon: <Star className="w-5 h-5" />,
      cor: "#00d856",
      corFundo: "#00d856",
      tamanhoLogo: "h-20 w-32",
      colunas: "grid-cols-1 md:grid-cols-2",
      padding: "p-6"
    },
    {
      nome: "Patrocínio Prata",
      key: "prata",
      icon: <Award className="w-5 h-5" />,
      cor: "#6b7280",
      corFundo: "#6b7280",
      tamanhoLogo: "h-16 w-28",
      colunas: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      padding: "p-5"
    }
  ]);

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('patrocinadores');
    if (dadosSalvos) {
      setPatrocinadores(JSON.parse(dadosSalvos));
    } else {
      // Dados iniciais vazios - usar localStorage
      setPatrocinadores([]);
    }

    const cotasSalvas = localStorage.getItem('cotas');
    if (cotasSalvas) {
      const cotasCarregadas = JSON.parse(cotasSalvas);
      // Reconstituir os ícones
      cotasCarregadas.forEach((cota: any) => {
        if (cota.key === 'diamante') cota.icon = <Crown className="w-5 h-5" />;
        if (cota.key === 'ouro') cota.icon = <Star className="w-5 h-5" />;
        if (cota.key === 'prata') cota.icon = <Award className="w-5 h-5" />;
      });
      setCotas(cotasCarregadas);
    }
  }, []);

  // Filtrar patrocinadores por cota
  const patrocinadorPorCota = (cota: 'diamante' | 'ouro' | 'prata') => {
    return patrocinadores.filter(p => p.cota === cota);
  };

  // Obter classe CSS para tamanho do logo
  const obterTamanhoLogo = (tamanho: 'grande' | 'medio' | 'pequeno') => {
    switch (tamanho) {
      case 'grande':
        return 'h-40 w-60'; // Grande - tamanho mais harmônico
      case 'medio':
        return 'h-32 w-48'; // Médio - tamanho anterior do grande
      case 'pequeno':
        return 'h-20 w-32'; // Pequeno - ligeiramente maior
      default:
        return 'h-32 w-48'; // Padrão médio
    }
  };

  // Obter classes do grid baseado na cota
  const obterClassesGrid = (cota: 'diamante' | 'ouro' | 'prata') => {
    switch (cota) {
      case 'diamante':
        return 'flex flex-wrap justify-center'; // Flexbox centralizado
      case 'ouro':
        return 'flex flex-wrap justify-center'; // Flexbox centralizado
      case 'prata':
        return 'flex flex-wrap justify-center'; // Flexbox centralizado
      default:
        return 'flex flex-wrap justify-center'; // Padrão
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 mb-4">
            <Heart className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Nossos Parceiros</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Patrocinadores que{" "}
            <span className="text-[#00d856]">transformam o movimento</span>
          </h2>
          
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Empresas que acreditam no poder do esporte e do bem-estar para transformar vidas e comunidades.
          </p>
        </div>

        {/* Patrocinadores por categoria */}
        <div className="space-y-12">
          {cotas.map((cota) => {
            const patrocinadoresdaCota = patrocinadorPorCota(cota.key);
            
            if (!patrocinadoresdaCota || patrocinadoresdaCota.length === 0) {
              return null;
            }

            return (
              <div key={cota.key} className="space-y-6">
                {/* Título da categoria */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="flex items-center px-6">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: cota.corFundo }}
                    >
                      <div className="text-white">
                        {cota.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                      {cota.nome}
                    </h3>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Grid de patrocinadores - Layout corrigido */}
                <div className={`${obterClassesGrid(cota.key)} gap-10 max-w-6xl mx-auto`}>
                  {patrocinadoresdaCota.map((patrocinador, index) => (
                    <img
                      key={patrocinador.id}
                      src={patrocinador.logo}
                      alt={`Logo ${patrocinador.nome}`}
                      className={`${obterTamanhoLogo(patrocinador.tamanhoLogo)} object-contain cursor-pointer opacity-0 animate-fade-in hover:opacity-100 transition-opacity duration-300 flex-shrink-0`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setPatrocinadorSelecionado(patrocinador)}
                      title={`Clique para ver detalhes de ${patrocinador.nome}`}
                      onError={(e) => {
                        // Fallback para quando a imagem não carrega
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const div = document.createElement('div');
                          div.className = `${obterTamanhoLogo(patrocinador.tamanhoLogo)} flex items-center justify-center bg-gray-100 text-gray-500 text-sm cursor-pointer`;
                          div.innerHTML = `
                            <div class="text-center">
                              <div class="mb-2">📷</div>
                              <div>Logo não disponível</div>
                            </div>
                          `;
                          div.onclick = () => setPatrocinadorSelecionado(patrocinador);
                          parent.appendChild(div);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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
                <h2 className="text-xl font-display font-bold text-gray-900">
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
                  <div className={`${obterTamanhoLogo(patrocinadorSelecionado.tamanhoLogo)} max-w-xs bg-gray-50 rounded-xl p-4 border border-gray-200`}>
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
                                <div class="mb-2">📷</div>
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
                  <h3 className="text-2xl font-display font-bold text-gray-900">
                    {patrocinadorSelecionado.nome}
                  </h3>
                  
                  {/* Categoria */}
                  <p className="text-base text-gray-600">
                    {patrocinadorSelecionado.categoria}
                  </p>
                  
                  {/* Descrição */}
                  {patrocinadorSelecionado.descricao && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-6">
                      <p className="text-gray-700 leading-relaxed">
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

        {/* Call to Action para se tornar patrocinador */}
        <div className="mt-20">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center border border-gray-100">
            <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4">
              Seja um Patrocinador FESPIN 2025
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se às empresas que estão transformando o futuro do esporte e bem-estar no interior de São Paulo.
            </p>
            <a
              href="/patrocinio"
              className="inline-flex items-center justify-center bg-[#0a2856] hover:bg-[#0a2856]/90 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
            >
              <Crown className="w-5 h-5 mr-2" />
              Quero ser Patrocinador
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatrocinadoresSection; 