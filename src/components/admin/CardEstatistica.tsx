import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CardEstatisticaProps {
  titulo: string;
  valor: number | string;
  icone: LucideIcon;
  cor?: 'azul' | 'verde' | 'laranja' | 'roxo' | 'vermelho' | 'cinza';
  tendencia?: {
    valor: string;
    positiva: boolean;
  };
  descricao?: string;
  onClick?: () => void;
}

const CardEstatistica: React.FC<CardEstatisticaProps> = ({
  titulo,
  valor,
  icone: Icone,
  cor = 'laranja',
  tendencia,
  descricao,
  onClick
}) => {
  const obterCoresIcone = (cor: CardEstatisticaProps['cor']) => {
    const cores = {
      azul: 'from-blue-500 to-blue-600',
      verde: 'from-emerald-500 to-emerald-600',
      laranja: 'from-[#ff3c00] to-[#ff6b35]',
      roxo: 'from-purple-500 to-purple-600',
      vermelho: 'from-red-500 to-red-600',
      cinza: 'from-gray-500 to-gray-600'
    };
    return cores[cor!];
  };

  const CardWrapper = onClick ? 'button' : 'div';
  const cardProps = onClick ? {
    onClick,
    className: 'w-full text-left hover:scale-105 transition-transform duration-200'
  } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">{titulo}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{valor}</p>
              
              {tendencia && (
                <div className="flex items-center gap-1 mb-1">
                  <div className={`w-3 h-3 rounded-full ${
                    tendencia.positiva ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-xs font-medium ${
                    tendencia.positiva ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {tendencia.valor}
                  </span>
                </div>
              )}
              
              {descricao && (
                <p className="text-xs text-gray-500 mt-1">{descricao}</p>
              )}
            </div>
            
            <div className={`w-12 h-12 bg-gradient-to-r ${obterCoresIcone(cor)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-4`}>
              <Icone className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default CardEstatistica;