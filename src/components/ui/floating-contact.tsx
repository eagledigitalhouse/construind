import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, Headphones } from 'lucide-react';

interface FloatingContactProps {
  phone?: string;
  showAfterScroll?: number;
}

const FloatingContact: React.FC<FloatingContactProps> = ({ 
  phone = "(19) 97179-7745",
  showAfterScroll = 100 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeVisible = scrollY > showAfterScroll;
      setIsVisible(shouldBeVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const cleanPhone = phone.replace(/\D/g, '');
  const formattedForWhatsApp = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${formattedForWhatsApp}?text=Olá! Entrei em contato através do site da FESPIN.`, '_blank');
    setIsExpanded(false);
  };

  const handleCall = () => {
    window.open(`tel:+${formattedForWhatsApp}`, '_self');
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999999]" style={{ zIndex: 999999 }}>
      {/* Botões expandidos */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {/* Botão WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 bg-[#25d366] hover:bg-[#25d366]/90 text-white rounded-full py-3 px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">WhatsApp</span>
          </button>

          {/* Botão Ligar */}
          <button
            onClick={handleCall}
            className="flex items-center gap-3 bg-[#0a2856] hover:bg-[#0a2856]/90 text-white rounded-full py-3 px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
          >
            <Phone className="w-5 h-5" />
            <span className="text-sm font-medium">Ligar</span>
          </button>
        </div>
      )}

      {/* Botão principal */}
      <button
        onClick={toggleExpanded}
        className="relative w-14 h-14 bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Contato"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Headphones className="w-6 h-6" />
        )}
        
        {/* Pulso animado quando não expandido */}
        {!isExpanded && (
          <div className="absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-r from-[#00d856]/30 to-[#b1f727]/30 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};

export default FloatingContact; 