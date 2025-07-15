import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setEmail("");
    setIsSubmitting(false);
    
    // Show success message
    alert("Obrigado por se inscrever na newsletter da FESPIN!");
  };

  return (
    <section className="py-16 md:py-20 bg-[#00d856] relative overflow-hidden" id="newsletter">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-3 shadow-xl">
            <Mail className="w-5 h-5 mr-2" />
            <span className="font-bold">Newsletter FESPIN</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 leading-tight text-white">
            Fique por dentro do{" "}
            <span className="text-[#0a2856]">movimento</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Receba as últimas novidades sobre a FESPIN 2025, programação, 
            expositores e oportunidades exclusivas antes de todo mundo.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative flex-grow w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="w-full px-6 py-4 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group bg-[#0a2856] hover:bg-[#0a2856]/90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[200px]"
            >
              <span className="flex items-center justify-center">
                {isSubmitting ? "Enviando..." : "Inscrever-se"}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </form>
          
          <p className="text-white/70 text-sm mt-6">
            ✨ Receba conteúdo exclusivo e seja o primeiro a saber das novidades
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;