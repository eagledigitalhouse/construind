import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor numérico como moeda brasileira (R$ X.XXX,XX)
 * @param valor - Valor numérico a ser formatado
 * @returns String formatada como moeda brasileira
 */
export function formatarMoedaBrasileira(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Converte uma string de preço (ex: "R$ 5.000,00") ou número para número
 * @param preco - String ou número do preço a ser convertido
 * @returns Valor numérico
 */
export function converterPrecoParaNumero(preco: string | number | null | undefined): number {
  if (!preco) {
    return 0;
  }
  
  // Se já é um número, retorna diretamente
  if (typeof preco === 'number') {
    return preco;
  }
  
  // Se é string, processa a conversão
  if (typeof preco === 'string') {
    return parseFloat(preco.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
  }
  
  return 0;
}
