import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BotaoAcaoAdminProps {
  label: string;
  icone: LucideIcon;
  onClick: () => void;
  variante?: 'primario' | 'secundario' | 'outline' | 'sucesso' | 'perigo' | 'aviso';
  tamanho?: 'pequeno' | 'medio' | 'grande';
  carregando?: boolean;
  desabilitado?: boolean;
  larguraCompleta?: boolean;
  className?: string;
}

const BotaoAcaoAdmin: React.FC<BotaoAcaoAdminProps> = ({
  label,
  icone: Icone,
  onClick,
  variante = 'primario',
  tamanho = 'medio',
  carregando = false,
  desabilitado = false,
  larguraCompleta = false,
  className = ''
}) => {
  const obterEstilosVariante = (variante: BotaoAcaoAdminProps['variante']) => {
    const estilos = {
      primario: 'bg-gradient-to-r from-[#ff3c00] to-[#ff6b35] hover:from-[#ff3c00]/90 hover:to-[#ff6b35]/90 text-white shadow-lg hover:shadow-xl border-0',
      secundario: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent hover:border-gray-400',
      sucesso: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl border-0',
      perigo: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl border-0',
      aviso: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl border-0'
    };
    return estilos[variante!];
  };

  const obterEstilosTamanho = (tamanho: BotaoAcaoAdminProps['tamanho']) => {
    const estilos = {
      pequeno: 'px-4 py-2 text-sm h-9',
      medio: 'px-6 py-3 text-base h-11',
      grande: 'px-8 py-4 text-lg h-14'
    };
    return estilos[tamanho!];
  };

  const obterTamanhoIcone = (tamanho: BotaoAcaoAdminProps['tamanho']) => {
    const tamanhos = {
      pequeno: 'w-4 h-4',
      medio: 'w-5 h-5',
      grande: 'w-6 h-6'
    };
    return tamanhos[tamanho!];
  };

  return (
    <Button
      onClick={onClick}
      disabled={desabilitado || carregando}
      className={`
        ${obterEstilosVariante(variante)}
        ${obterEstilosTamanho(tamanho)}
        ${larguraCompleta ? 'w-full' : ''}
        rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {carregando ? (
        <div className={`${obterTamanhoIcone(tamanho)} mr-2 border-2 border-current border-t-transparent rounded-full animate-spin`} />
      ) : (
        <Icone className={`${obterTamanhoIcone(tamanho)} mr-2`} />
      )}
      {label}
    </Button>
  );
};

export default BotaoAcaoAdmin;