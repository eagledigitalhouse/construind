import React from "react";
import { MapPin, Calendar, Clock, Navigation } from "lucide-react";

const LocalDataSection = () => {
  return (
    <section className="w-full py-8 md:py-12 bg-white mb-32 md:mb-48" id="local-data">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header moderno */}
         <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0a2856]/10 to-[#00d856]/10 rounded-full mb-4">
             <MapPin className="w-4 h-4 text-[#0a2856]" />
             <span className="text-sm font-semibold text-[#0a2856]">Local e Data</span>
           </div>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a2856] mb-1 leading-tight">
              Encontre-nos <br /><span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent"> em Indaiatuba</span>
            </h2>
            <div className="subtitle-section">
              Três dias de movimento, transformação<br />e conexões no coração de Indaiatuba
            </div>
         </div>

        {/* Layout centralizado */}
        <div className="max-w-4xl mx-auto">
          {/* Mapa */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1752724040498!6m8!1m7!1sVFNGEM4c4VZ-CZQPPve0dg!2m2!1d-23.07986312807617!2d-47.20084916846322!3f319.6881!4f0!5f0.7820865974627469"
                width="100%"
                height="500"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[300px] lg:h-[400px] shadow-sm"
              ></iframe>
            </div>
          </div>

          {/* Botão Como Chegar */}
          <div className="text-center mb-20 md:mb-32">
            {/* Botão Como Chegar melhorado */}
            <a 
              href="https://maps.google.com/?q=Rua+Goiás,+75,+Cidade+Nova,+Indaiatuba,+SP" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#0a2856] to-[#0a2856]/90 text-white font-bold py-4 px-10 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-[#0a2856]/90 hover:to-[#0a2856]"
            >
              <Navigation className="w-6 h-6" />
              Como Chegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalDataSection;