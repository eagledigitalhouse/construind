import React, { useEffect, useState } from 'react';

interface TimerFlutuanteProps {
  tempoRestante: number;
  ativo: boolean;
}

const TimerFlutuante: React.FC<TimerFlutuanteProps> = ({ tempoRestante, ativo }) => {
  const [mostrar, setMostrar] = useState(false);

  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  const progresso = (tempoRestante / 600) * 100;
  const circunferencia = 2 * Math.PI * 45;
  const offset = circunferencia - (progresso / 100) * circunferencia;

  useEffect(() => {
    if (ativo) {
      // Pequeno delay para permitir a animação de entrada
      setTimeout(() => setMostrar(true), 100);
    } else {
      setMostrar(false);
    }
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out ${
        mostrar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f3f4f6"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#00d856"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-center">
            <div className="text-sm font-semibold text-[#0a2856]">
              {formatarTempo(tempoRestante)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerFlutuante;