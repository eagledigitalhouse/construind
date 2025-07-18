import React from "react";
import { Phone, Mail, MessageCircle, ArrowRight, Store } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";

const ContatoExpositorSection = () => {
  return (
    <section id="contato" className="py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Phone className="w-4 h-4" />}>
              Fale conosco
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight">
              Vamos construir seu <span className="bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent">sucesso</span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
            Nossa equipe está pronta para ajudar você a escolher o melhor espaço para sua empresa. 
            Entre em contato e garanta sua participação na FESPIN 2025.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Formulário de Contato */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-100 mb-8">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 flex items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#00d856] to-[#b1f727] flex items-center justify-center mr-3">
                <Store className="w-5 h-5 text-white" />
              </div>
              Reserve seu Espaço
            </h3>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome da Empresa
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                    placeholder="Digite o nome da sua empresa"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Responsável
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                    placeholder="(19) 9 9999-9999"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Segmento
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50">
                    <option>Selecione seu segmento</option>
                    <option>Academia e Fitness</option>
                    <option>Nutrição e Suplementos</option>
                    <option>Bem-estar e Saúde</option>
                    <option>Artigos Esportivos</option>
                    <option>Equipamentos de Exercício</option>
                    <option>Vestuário Esportivo</option>
                    <option>Tecnologia e Apps</option>
                    <option>Serviços de Saúde</option>
                    <option>Outros</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stand de Interesse
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50">
                    <option>Selecione o tipo de stand</option>
                    <option>Stand Simples (3x3m)</option>
                    <option>Stand Premium (3x4m)</option>
                    <option>Stand Duplo (6x3m)</option>
                    <option>Stand Personalizado</option>
                    <option>Ainda não sei</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50 resize-none"
                  placeholder="Conte-nos mais sobre sua empresa e objetivos..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  <Store className="mr-2 w-5 h-5" />
                  Solicitar Informações
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContatoExpositorSection;