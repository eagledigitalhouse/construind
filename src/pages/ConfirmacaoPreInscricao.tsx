import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PhoneContact } from '@/components/ui';
import { CheckCircle, Download, ArrowLeft, Calendar, Clock, FileText, Phone, Mail } from 'lucide-react';
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
  };
}

const ConfirmacaoPreInscricao: React.FC<ConfirmacaoPreInscricaoProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pegar dados da navegação ou usar defaults
  const dadosSubmissao = location.state?.dadosSubmissao || {
    nome: "Usuário",
    email: "usuario@email.com",
    telefone: "(11) 99999-9999",
    empresa: "Minha Empresa",
    tipoPessoa: "fisica",
    dataEnvio: new Date().toLocaleDateString('pt-BR'),
    horarioEnvio: new Date().toLocaleTimeString('pt-BR'),
    numeroProtocolo: `FESPIN-${Date.now().toString().slice(-8)}`
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
        numeroProtocolo: dadosSubmissao.numeroProtocolo
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o comprovante PDF. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background com degradê sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d856]/5 via-white to-[#0a2856]/5"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              <img 
                src="/LOGO HORIZONTAL AZUL DEGRADE.svg" 
                alt="Logo FESPIN" 
                className="h-16 md:h-20 mx-auto object-contain"
              />
            </div>
          </div>

          {/* Card Principal de Confirmação */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-2xl border-0 overflow-hidden opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
              <CardHeader className="bg-gradient-to-r from-[#00d856] to-[#b1f727] text-white text-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Pré-inscrição Enviada!
                  </h1>
                  <p className="text-white/90 text-lg">
                    Recebemos sua solicitação com sucesso
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                {/* Informações do Protocolo */}
                <div className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 rounded-lg p-4 border border-[#0a2856]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-[#00d856]" />
                    <span className="font-semibold text-[#0a2856]">Protocolo de Confirmação</span>
                  </div>
                  <p className="text-xl font-mono font-bold text-[#0a2856] mb-2">
                    {dadosSubmissao.numeroProtocolo}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{dadosSubmissao.dataEnvio}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{dadosSubmissao.horarioEnvio}</span>
                    </div>
                  </div>
                </div>

                {/* Dados Confirmados */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#0a2856] text-lg">Dados Confirmados:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{dadosSubmissao.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">E-mail:</span>
                      <span className="font-medium">{dadosSubmissao.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-medium">{dadosSubmissao.telefone}</span>
                    </div>
                    {dadosSubmissao.empresa && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Empresa:</span>
                        <span className="font-medium">{dadosSubmissao.empresa}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Próximos Passos */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-[#0a2856] mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Próximos Passos
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Nossa equipe analisará sua pré-inscrição</li>
                    <li>• Entraremos em contato em até 5 dias úteis</li>
                    <li>• Você receberá informações sobre stands disponíveis</li>
                    <li>• Dúvidas: contato@fespin.com.br ou (19) 97179-7745</li>
                  </ul>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={gerarPDF}
                    className="w-full bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00c851] hover:to-[#a0e620] text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Comprovante (PDF)
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full border-2 border-[#0a2856] text-[#0a2856] hover:bg-[#0a2856] hover:text-white py-3 text-lg font-semibold rounded-lg transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <div className="mt-8 text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
              <Card className="bg-gradient-to-r from-[#0a2856]/5 to-[#00d856]/5 border border-[#0a2856]/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-[#00d856]" />
                    <h3 className="font-semibold text-[#0a2856]">Precisa de Ajuda?</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Nossa equipe está pronta para esclarecer suas dúvidas
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                    <a href="mailto:contato@fespin.com.br" className="flex items-center gap-1 text-[#00d856] hover:text-[#00c851] transition-colors">
                      <Mail className="w-4 h-4" />
                      contato@fespin.com.br
                    </a>
                    <PhoneContact
                      phone="(19) 97179-7745"
                      className="flex items-center gap-1 text-[#00d856] hover:text-[#00c851] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      (19) 97179-7745
                    </PhoneContact>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Animações CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmacaoPreInscricao; 