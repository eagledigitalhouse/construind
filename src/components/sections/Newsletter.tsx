import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

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
    <div className="relative z-[100] mx-auto px-4 md:px-0 h-[120px] md:h-[160px]">
      {/* Card de Newsletter sobreposto ao footer */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl">
        <div className="bg-gradient-to-br from-[#00d856] to-[#b1f727] rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-1 lg:gap-2">
             {/* Lado esquerdo - Título e Subtítulo */}
             <div className="p-3 lg:p-6 text-center lg:text-left">
               <h2 className="text-3xl lg:text-5xl font-bold text-white mb-1 leading-tight">
                   Fique por dentro do movimento
                </h2>
                <p className="text-white/90 text-sm md:text-base leading-tight">
                  Receba as últimas novidades sobre a FESPIN 2025, programação e oportunidades exclusivas.
                </p>
             </div>
             
             {/* Lado direito - Campo de Email */}
             <div className="p-3 lg:p-6 lg:pl-0 flex justify-center lg:justify-start">
               <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Insira seu e-mail aqui"
                   required
                   className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                 />
                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="px-6 py-3 bg-[#0a2856] text-white font-bold rounded-lg hover:bg-[#0a2856]/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isSubmitting ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <ArrowRight className="w-5 h-5" />
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