import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EstatisticaCard {
  titulo: string;
  valor: number | string;
  icone: LucideIcon;
  cor: 'azul' | 'verde' | 'laranja' | 'roxo' | 'vermelho' | 'cinza';
  tendencia?: {
    valor: string;
    positiva: boolean;
  };
}

interface AcaoBotao {
  label: string;
  icone: LucideIcon;
  onClick: () => void;
  variante?: 'primario' | 'secundario' | 'outline';
  carregando?: boolean;
  desabilitado?: boolean;
}

interface LayoutPaginaAdminProps {
  titulo: string;
  subtitulo: string;
  icone: LucideIcon;
  estatisticas?: EstatisticaCard[];
  acoes?: AcaoBotao[];
  children: React.ReactNode;
  carregando?: boolean;
  informacaoExtra?: {
    label: string;
    valor: string;
  };
}

const LayoutPaginaAdmin: React.FC<LayoutPaginaAdminProps> = ({
  titulo,
  subtitulo,
  icone: Icone,
  estatisticas = [],
  acoes = [],
  children,
  carregando = false,
  informacaoExtra
}) => {
  const obterCoresIcone = (cor: EstatisticaCard['cor']) => {
    const cores = {
      azul: 'from-blue-500 to-blue-600',
      verde: 'from-emerald-500 to-emerald-600',
      laranja: 'from-[#ff3c00] to-[#ff6b35]',
      roxo: 'from-purple-500 to-purple-600',
      vermelho: 'from-red-500 to-red-600',
      cinza: 'from-gray-500 to-gray-600'
    };
    return cores[cor];
  };

  const obterVarianteBotao = (variante: AcaoBotao['variante'] = 'primario') => {
    const estilos = {
      primario: 'bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] hover:from-[#ff3c00]/90 hover:to-[#ff6b35]/90 text-white shadow-lg hover:shadow-xl',
      secundario: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent'
    };
    return estilos[variante];
  };

  if (carregando) {
    return (
      <div className="p-6 space-y-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
        
        {estatisticas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: estatisticas.length }).map((_, index) => (
              <Card key={index} className="bg-white shadow-lg border border-gray-100 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Padronizado */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] rounded-xl shadow-lg">
              <Icone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {titulo.includes('CONSTRUIND') ? (
                  titulo.split('CONSTRUIND').map((parte, index) => (
                    <span key={index}>
                      {parte}
                      {index === 0 && <span className="text-[#ff3c00]">CONSTRUIND</span>}
                    </span>
                  ))
                ) : (
                  titulo
                )}
              </h1>
              <p className="text-gray-600 mt-1">{subtitulo}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {informacaoExtra && (
              <div className="text-right">
                <p className="text-sm text-gray-500">{informacaoExtra.label}</p>
                <p className="text-lg font-semibold text-gray-900">{informacaoExtra.valor}</p>
              </div>
            )}
            
            {acoes.length > 0 && (
              <div className="flex gap-3">
                {acoes.map((acao, index) => (
                  <Button
                    key={index}
                    onClick={acao.onClick}
                    disabled={acao.desabilitado || acao.carregando}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${obterVarianteBotao(acao.variante)}`}
                  >
                    {acao.carregando ? (
                      <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <acao.icone className="w-5 h-5 mr-2" />
                    )}
                    {acao.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas Padronizadas */}
      {estatisticas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {estatisticas.map((stat, index) => {
            const IconeEstat = stat.icone;
            return (
              <Card key={index} className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{stat.titulo}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.valor}</p>
                      {stat.tendencia && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            stat.tendencia.positiva ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          <span className={`text-xs font-medium ${
                            stat.tendencia.positiva ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {stat.tendencia.valor}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${obterCoresIcone(stat.cor)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconeEstat className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Conteúdo da Página */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default LayoutPaginaAdmin;