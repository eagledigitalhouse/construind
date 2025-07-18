import React from "react";
import { Eye, Users, TrendingUp, Target } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";

const BeneficiosExpositor = () => {
  const beneficios = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Visibilidade da marca",
      description: "Exponha sua marca para milhares de visitantes e potenciais clientes do segmento esportivo."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Networking qualificado",
      description: "Conecte-se com profissionais, atletas e empresários do setor esportivo regional."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Aumente suas vendas",
      description: "Aproveite o ambiente propício para apresentar produtos e fechar negócios."
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Posicionamento estratégico",
      description: "Associe sua marca ao primeiro evento esportivo do interior da região."
    }
  ];

  return (
    <section className="w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Coluna Esquerda - Conteúdo */}
          <div className="lg:sticky lg:top-8">
            <div className="flex items-start gap-4 mb-8 justify-start">
              <GlassChip icon={<Target className="w-4 h-4" />}>
                Oportunidade única
              </GlassChip>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 leading-none mb-3">
                <span className="block">
                  Por que <span className="bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent">expor na</span>
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent">FESPIN</span> 2025?
                </span>
              </h2>
              
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
                A primeira feira de esporte do interior é sua chance de
                liderar um mercado em expansão e conectar-se com um
                público altamente qualificado.
              </p>
            </div>
          </div>
          
          {/* Coluna Direita - Benefícios */}
          <div className="space-y-6">
            {beneficios.map((beneficio, index) => (
              <div 
                key={index} 
                className="group flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0
                }}
              >
                {/* Ícone */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-gray-100 transition-colors duration-300">
                  {beneficio.icon}
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-2 leading-tight">
                    {beneficio.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-tight">
                    {beneficio.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeneficiosExpositor;