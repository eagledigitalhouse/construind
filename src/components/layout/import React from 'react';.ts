import React from 'react';

interface PatrocinadorExpositorSectionProps {
  onPatrocinadorClick: () => void;
  onExpositorClick: () => void;
}

const PatrocinadorExpositorSection: React.FC<PatrocinadorExpositorSectionProps> = ({
  onPatrocinadorClick,
  onExpositorClick,
}) => {
  return (
    <section className="relative py-20 lg:py-24 xl:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Card Patrocinador */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="relative flex flex-col min-w-0 break-words bg-darkblue bg-beliefs rounded-lg shadow-lg overflow-hidden pb-70">
              <div className="p-8 flex-auto">
                <h3 className="text-white text-3xl lg:text-4xl font-bold mb-4">Seja um Patrocinador</h3>
                <h4 className="text-white text-xl lg:text-2xl font-semibold mb-4">Impulsione seu negócio e apoie a comunidade!</h4>
                <p className="text-white text-opacity-80 leading-relaxed mb-6">
                  Conecte-se com um público engajado, aumente sua visibilidade e associe sua marca a um evento de sucesso.
                </p>
                <button
                  onClick={onPatrocinadorClick}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-darkblue bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-8"
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>

          {/* Card Expositor */}
          <div className="w-full lg:w-1/2 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white bg-build rounded-lg shadow-lg overflow-hidden pb-70">
              <div className="p-8 flex-auto">
                <h3 className="text-darkblue text-3xl lg:text-4xl font-bold mb-4">Seja um Expositor</h3>
                <h4 className="text-darkblue text-xl lg:text-2xl font-semibold mb-4">Mostre seus produtos e serviços para milhares!</h4>
                <p className="text-darkblue text-opacity-80 leading-relaxed mb-6">
                  Apresente suas inovações, faça networking e gere novas oportunidades de negócio em um ambiente dinâmico.
                </p>
                <button
                  onClick={onExpositorClick}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-darkblue hover:bg-blue-800 md:py-4 md:text-lg md:px-8"
                >
                  Inscreva-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatrocinadorExpositorSection;