import React from "react";
import { Crown, Trophy, Sparkles, CheckCircle, X } from "lucide-react";

const TabelaComparativa = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[800px] table-fixed">
          <thead>
            <tr className="bg-[#0a2856]">
              <th className="text-left p-8 font-display font-bold text-xl text-white w-2/5 border-r border-white/10">
                BENEFÍCIOS
              </th>
              <th className="text-center p-8 font-display font-bold text-xl text-white w-1/5 border-r border-white/10 bg-[#FFD700]">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  OURO
                </div>
              </th>
              <th className="text-center p-8 font-display font-bold text-xl text-white w-1/5 border-r border-white/10 bg-[#C0C0C0]">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  PRATA
                </div>
              </th>
              <th className="text-center p-8 font-display font-bold text-xl text-white w-1/5 bg-[#CD7F32]">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  BRONZE
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Estande no evento
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  12m²
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  9m²
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  9m²
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Tempo na arena esportiva
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  1 HORA
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  1 HORA
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  ❌
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Tempo no palco principal
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  30 MINUTOS
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  30 MINUTOS
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  ❌
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Logo no site oficial
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  GRANDE
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  MÉDIO
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  PEQUENO
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Logo no telão LED
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  VÍDEO 20s
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  ESTÁTICO 15s
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  ESTÁTICO 15s
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Logo nos criativos oficiais
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  DESTAQUE TOTAL
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  EM GRUPO
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  EM GRUPO
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Posts colaborativos Instagram
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  02 POSTS
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  01 POST
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                  ❌
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Sorteio de brindes no palco
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#00d856]/20 text-[#00d856] font-semibold text-sm">
                  SIM
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#00d856]/20 text-[#00d856] font-semibold text-sm">
                  SIM
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-semibold text-sm">
                  NÃO
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors duration-200">
              <td className="p-6 font-semibold text-gray-900 text-lg border-r border-gray-100">
                Agradecimento no palco
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#00d856]/20 text-[#00d856] font-semibold text-sm">
                  SIM
                </div>
              </td>
              <td className="p-6 text-center border-r border-gray-100">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#00d856]/20 text-[#00d856] font-semibold text-sm">
                  SIM
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#00d856]/20 text-[#00d856] font-semibold text-sm">
                  SIM
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaComparativa; 