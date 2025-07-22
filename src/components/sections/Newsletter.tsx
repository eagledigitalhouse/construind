import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNewsletter } from "@/hooks/useNewsletter";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNewsletter } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await addNewsletter(email, nome);
      
      if (success) {
        toast.success("Obrigado por se inscrever na newsletter da FESPIN!");
        setEmail("");
        setNome("");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar sua inscrição. Tente novamente.");
      console.error("Erro ao adicionar email na newsletter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-[10] mx-auto h-[220px] md:h-[250px]">
      {/* Card de Newsletter sobreposto ao footer */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-full max-w-5xl px-4 md:px-6">
        <div className="bg-gradient-to-br from-[#00d856] to-[#b1f727] rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Conteúdo centralizado verticalmente */}
          <div className="flex flex-col items-center justify-center text-center py-8 px-6 md:py-10 md:px-8">
            {/* Título */}
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Fique por dentro do movimento
            </h2>
            
            {/* Subtexto */}
            <p className="text-white/95 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mt-2 mb-6">
              Receba as últimas novidades sobre a FESPIN 2025, programação e oportunidades exclusivas.
            </p>
            
            {/* Formulário */}
            <div className="w-full max-w-xl">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome (opcional)"
                    className="w-full px-4 py-3 text-base rounded-xl bg-white/95 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-3 focus:ring-white/50 focus:bg-white transition-all shadow-lg"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu email"
                    required
                    className="w-full px-4 py-3 text-base rounded-xl bg-white/95 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-3 focus:ring-white/50 focus:bg-white transition-all shadow-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 px-6 py-3 text-base bg-[#0a2856] text-white font-semibold rounded-xl hover:bg-[#0a2856]/90 focus:outline-none focus:ring-3 focus:ring-white/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                >
                   {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Inscrever-se
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;