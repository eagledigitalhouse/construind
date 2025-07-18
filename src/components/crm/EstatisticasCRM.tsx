import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { type EstatisticasCRM } from '@/hooks/useCRM';

interface EstatisticasCRMProps {
  estatisticas: EstatisticasCRM;
}

const EstatisticasCRMComponent: React.FC<EstatisticasCRMProps> = ({ estatisticas }) => {
  return (
    <div className="space-y-6">
      {/* Gráfico de Contatos por Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Contatos por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estatisticas.contatosPorMes.map((item, index) => {
              const maxValue = Math.max(...estatisticas.contatosPorMes.map(m => m.total));
              const percentage = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600">{item.mes}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{item.total}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contatos por Tipo de Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Contatos por Tipo de Formulário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(estatisticas.contatosPorFormulario).map(([tipo, quantidade], index) => {
              const maxValue = Math.max(...Object.values(estatisticas.contatosPorFormulario));
              const percentage = maxValue > 0 ? (quantidade / maxValue) * 100 : 0;
              
              // Cores diferentes para cada tipo
              const cores = [
                'bg-blue-500',
                'bg-green-500', 
                'bg-yellow-500',
                'bg-purple-500',
                'bg-red-500',
                'bg-indigo-500'
              ];
              const cor = cores[index % cores.length];
              
              return (
                <div key={tipo} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-gray-600 truncate" title={tipo}>
                    {tipo}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${cor} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{quantidade}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{estatisticas.contatosNovos}</div>
              <div className="text-sm text-blue-700">Novos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{estatisticas.contatosEmAndamento}</div>
              <div className="text-sm text-yellow-700">Em Andamento</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{estatisticas.contatosFinalizados}</div>
              <div className="text-sm text-green-700">Finalizados</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {estatisticas.totalContatos - estatisticas.contatosNovos - estatisticas.contatosEmAndamento - estatisticas.contatosFinalizados}
              </div>
              <div className="text-sm text-gray-700">Outros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Resumo Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">{estatisticas.totalContatos}</div>
              <div className="text-sm text-gray-600">Total de Contatos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {Object.keys(estatisticas.contatosPorFormulario).length}
              </div>
              <div className="text-sm text-gray-600">Tipos de Formulário</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {estatisticas.contatosFinalizados > 0 
                  ? Math.round((estatisticas.contatosFinalizados / estatisticas.totalContatos) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Conversão</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstatisticasCRMComponent;