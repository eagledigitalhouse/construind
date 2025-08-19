import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Download, ArrowLeft, Calendar, Clock, FileText, Phone, Mail, Target, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gerarComprovantePDF } from '@/lib/pdfGenerator';

interface ConfirmacaoPreInscricaoProps {
  dadosSubmissao?: {
    nome: string;
    email: string;
    telefone: string;
    empresa?: string;
    tipoPessoa?: string;
    dataEnvio: string;
    horarioEnvio: string;
    numeroProtocolo: string;
    standSelecionado?: {
      numero: string;
      categoria: string;
      valor: number;
      metragem: string;
    };
    condicaoPagamento?: string;
    formaPagamento?: string;
    valorTotal?: number;
  };
}

const ConfirmacaoPreInscricao: React.FC<ConfirmacaoPreInscricaoProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para controlar o scroll
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular a intensidade do degradê baseado no scroll
  const scrollProgress = Math.min(scrollY / 800, 1);
  
  // Pegar dados da navegação ou usar defaults
  const dadosSubmissao = location.state?.dadosSubmissao || {
    nome: "Usuário",
    email: "usuario@email.com",
    telefone: "(11) 99999-9999",
    empresa: "Minha Empresa",
    tipoPessoa: "fisica",
    dataEnvio: new Date().toLocaleDateString('pt-BR'),
    horarioEnvio: new Date().toLocaleTimeString('pt-BR'),
    numeroProtocolo: `CONSTRUIND-${Date.now().toString().slice(-8)}`
  };

  const gerarPDF = async () => {
    try {
      gerarComprovantePDF({
        nome: dadosSubmissao.nome,
        email: dadosSubmissao.email,
        telefone: dadosSubmissao.telefone,
        empresa: dadosSubmissao.empresa,
        tipoPessoa: dadosSubmissao.tipoPessoa,
        dataEnvio: dadosSubmissao.dataEnvio,
        horarioEnvio: dadosSubmissao.horarioEnvio,
        numeroProtocolo: dadosSubmissao.numeroProtocolo,
        standSelecionado: dadosSubmissao.standSelecionado,
        valorTotal: dadosSubmissao.valorTotal
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o comprovante PDF. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Degradê dinâmico baseado no scroll */}
      <div 
        className="fixed inset-0 transition-opacity duration-1000 ease-out pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 60, 0, ${0.25 * scrollProgress}) 0%, 
            rgba(61, 61, 61, ${0.35 * scrollProgress}) 60%, 
            rgba(0, 0, 0, ${0.15 * scrollProgress}) 100%
          )`,
          opacity: scrollProgress
        }}
      />
      
      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          {/* Hero Header */}
          <div className="text-center mb-16">
            {/* Logo CONSTRUIND */}
            <div className="w-64 mx-auto mb-6 relative overflow-hidden opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              <img 
                src="/CONSTRUIND.svg" 
                alt="Logo CONSTRUIND" 
                className="w-full h-auto object-contain relative z-10"
              />
              {/* Efeito Glass Reflexo */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full z-20"
                style={{
                  animation: 'shine 3s ease-in-out infinite 1s',
                  transform: 'translateX(-100%) skewX(-25deg)'
                }}
              ></div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff3c00]/20 to-[#3d3d3d]/20 rounded-full mb-6 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              <CheckCircle className="w-4 h-4 text-[#ff3c00]" />
              <span className="text-sm font-semibold text-white">Confirmação de inscrição</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
              Inscrição
              <br />
              <span className="bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] bg-clip-text text-transparent">
                Confirmada!
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <div className="subtitle-section mb-4 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_0.8s_forwards] text-center text-gray-300">
                Sua pré-inscrição foi enviada com sucesso! Nossa equipe entrará em contato em breve.
              </div>
              
              <div className="inline-block bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 border border-[#ff3c00]/30 rounded-lg px-4 py-3 text-white text-sm max-w-2xl opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff3c00]" />
                  <div>
                    <p className="font-medium mb-1 text-white">Protocolo de Confirmação</p>
                    <p className="text-xs leading-relaxed text-gray-300">
                      Guarde este número para acompanhar o status da sua inscrição: <strong className="text-[#ff3c00]">{dadosSubmissao.numeroProtocolo}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Principal de Confirmação */}
          <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
            <CardHeader className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#ff3c00] rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#ff3c00] mb-0 leading-tight">
                    CONFIRMAÇÃO DE INSCRIÇÃO
                  </CardTitle>
                  <CardDescription className="text-gray-300 -mt-1 leading-tight">
                    Sua pré-inscrição foi recebida com sucesso
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Informações do Protocolo */}
              <div className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 rounded-lg p-4 border border-[#ff3c00]/30 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-[#ff3c00]" />
                  <span className="font-semibold text-white">Protocolo de Confirmação</span>
                </div>
                <p className="text-xl font-mono font-bold text-[#ff3c00] mb-2">
                  {dadosSubmissao.numeroProtocolo}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#ff3c00]" />
                    <span>{dadosSubmissao.dataEnvio}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#ff3c00]" />
                    <span>{dadosSubmissao.horarioEnvio}</span>
                  </div>
                </div>
              </div>

              {/* Dados Confirmados */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white text-lg">Dados Confirmados:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Nome:</span>
                    <span className="font-medium text-white">{dadosSubmissao.nome}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">E-mail:</span>
                    <span className="font-medium text-white">{dadosSubmissao.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Telefone:</span>
                    <span className="font-medium text-white">{dadosSubmissao.telefone}</span>
                  </div>
                  {dadosSubmissao.empresa && (
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Empresa:</span>
                      <span className="font-medium text-white">{dadosSubmissao.empresa}</span>
                    </div>
                  )}
                  
                  {/* Dados do Stand */}
                  {dadosSubmissao.standSelecionado && (
                    <div className="pt-4 border-t border-gray-600">
                      <h4 className="font-semibold text-[#ff3c00] mb-3">Stand Selecionado:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Número:</span>
                          <span className="font-medium text-white">{dadosSubmissao.standSelecionado.numero}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Categoria:</span>
                          <span className="font-medium text-white">{dadosSubmissao.standSelecionado.categoria}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Tamanho:</span>
                          <span className="font-medium text-white">{dadosSubmissao.standSelecionado.metragem}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Valor:</span>
                          <span className="font-medium text-[#ff3c00]">R$ {dadosSubmissao.standSelecionado.valor.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Condições de Pagamento */}
                  {(dadosSubmissao.condicaoPagamento || dadosSubmissao.formaPagamento) && (
                    <div className="pt-4 border-t border-gray-600">
                      <h4 className="font-semibold text-[#ff3c00] mb-3">Condições de Pagamento:</h4>
                      <div className="space-y-2">
                        {dadosSubmissao.condicaoPagamento && (
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Condição:</span>
                            <span className="font-medium text-white">{dadosSubmissao.condicaoPagamento}</span>
                          </div>
                        )}
                        {dadosSubmissao.formaPagamento && (
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Forma:</span>
                            <span className="font-medium text-white">{dadosSubmissao.formaPagamento}</span>
                          </div>
                        )}
                        {dadosSubmissao.valorTotal && (
                          <div className="flex justify-between pt-2 border-t border-gray-700">
                            <span className="text-gray-400 font-semibold">Valor Total:</span>
                            <span className="font-bold text-[#ff3c00] text-lg">R$ {dadosSubmissao.valorTotal.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-gradient-to-r from-[#ff3c00]/10 to-[#3d3d3d]/10 rounded-lg p-4 border border-[#ff3c00]/30 mt-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#ff3c00]" />
                  Próximos Passos
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Nossa equipe analisará sua pré-inscrição</li>
                  <li>• Entraremos em contato em até 5 dias úteis</li>
                  <li>• Você receberá informações sobre aprovação do stand</li>
                  <li>• Dúvidas: construind25@gmail.com ou (19) 97412-4162</li>
                </ul>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3 pt-6">
                <Button
                  onClick={gerarPDF}
                  className="w-full bg-gradient-to-r from-[#ff3c00] to-[#ff8c00] hover:from-[#e03500] hover:to-[#e07500] text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus-orange"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Comprovante (PDF)
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-[#ff3c00] py-4 text-lg font-semibold rounded-lg transition-all duration-300 focus-orange"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <div className="mt-8 opacity-0 translate-y-8 animate-[fadeInUp_1s_ease-out_1.4s_forwards]">
            <Card className="overflow-hidden bg-gray-900 border border-gray-700 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-[#ff3c00]" />
                    <h3 className="font-semibold text-white">Precisa de Ajuda?</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Nossa equipe está pronta para esclarecer suas dúvidas
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <Mail className="inline w-4 h-4 mr-2 text-[#ff3c00]" />
                      E-mail: <a href="mailto:construind25@gmail.com" className="text-[#ff3c00] hover:text-[#ff8c00] transition-colors">construind25@gmail.com</a>
                    </p>
                    <p className="text-gray-300">
                      <Phone className="inline w-4 h-4 mr-2 text-[#ff3c00]" />
                      Telefone: <span className="text-white">19 97412-4162</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Animações CSS personalizadas */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-25deg); }
          50% { transform: translateX(100%) skewX(-25deg); }
          100% { transform: translateX(100%) skewX(-25deg); }
        }
        
        /* Remove focus ring padrão e força apenas borda laranja */
        input:focus,
        textarea:focus,
        select:focus,
        button:focus {
          outline: none !important;
          box-shadow: none !important;
          ring: 0 !important;
        }
        
        /* Força apenas borda laranja no focus */
        .focus-orange:focus {
          border-color: #ff3c00 !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
};

export default ConfirmacaoPreInscricao;