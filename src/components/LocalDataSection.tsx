import React from "react";
import { MapPin, Calendar, Clock } from "lucide-react";

const LocalDataSection = () => {
  return (
    <section className="w-full py-10 md:py-14 bg-white" id="local-data">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header centralizado */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="fespin-chip opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span>Local e Data</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight mb-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a2856] to-[#00d856]">
              Encontre-nos em Indaiatuba
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            Três dias de movimento, transformação e conexões no coração de Indaiatuba
          </p>
        </div>

        {/* Layout moderno: mapa destacado + card flutuante */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Mapa grande ao fundo no desktop */}
          <div className="w-full lg:w-2/3 rounded-3xl overflow-hidden shadow-xl border border-gray-100 min-h-[340px] lg:min-h-[420px] relative z-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.8!2d-47.2167!3d-23.0903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA1JzI1LjEiUyA0N8KwMTMnMDAuMSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 340, height: '100%' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[340px] lg:h-[420px]"
            ></iframe>
          </div>

          {/* Card flutuante sobreposto ao mapa no desktop, abaixo no mobile */}
          <div className="w-full max-w-lg lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 z-10">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
              {/* Local */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0a2856] to-[#00d856] flex items-center justify-center text-white mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base font-bold text-[#0a2856] font-display">Espaço Viber</span>
                    <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded bg-gray-100">Indaiatuba/SP</span>
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">Um espaço moderno e completo, preparado para receber mais de 15 mil visitantes.</div>
                </div>
              </div>
              {/* Data e Horário */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00d856] to-[#b1f727] flex items-center justify-center text-white mt-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base font-bold text-[#0a2856] font-display">14 a 16 de Novembro de 2025</span>
                    <span className="text-xs text-gray-500 font-medium px-2 py-0.5 rounded bg-gray-100 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#00d856]" />8h às 20h</span>
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">Três dias completos de experiências, conexões e descobertas.</div>
                </div>
              </div>
              {/* Botão */}
              <a href="https://maps.google.com/?q=Espaço+Viber,+Indaiatuba" target="_blank" rel="noopener noreferrer" className="w-full mt-2 inline-flex items-center justify-center bg-gradient-to-r from-[#0a2856] to-[#00d856] text-white font-bold py-3 px-8 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <MapPin className="w-5 h-5 mr-2" /> Como Chegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalDataSection; 