import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { Button } from './button';

interface PhoneContactProps {
  phone: string;
  className?: string;
  children: React.ReactNode;
}

const PhoneContact: React.FC<PhoneContactProps> = ({ phone, className = "", children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formatar telefone para links (remover caracteres especiais)
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedForWhatsApp = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const formattedForTel = `+${formattedForWhatsApp}`;

  const handleCall = () => {
    window.open(`tel:${formattedForTel}`, '_self');
    setIsModalOpen(false);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${formattedForWhatsApp}?text=Olá! Entrei em contato através do site da FESPIN.`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {children}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-auto border-2 border-[#00d856]/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#00d856]" />
                <h3 className="font-semibold text-[#0a2856]">Entrar em Contato</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Phone Number Display */}
            <div className="text-center mb-6">
              <p className="text-lg font-mono font-bold text-[#0a2856] mb-1">
                {phone}
              </p>
              <p className="text-sm text-gray-600">
                Como você gostaria de entrar em contato?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCall}
                className="w-full bg-[#0a2856] hover:bg-[#0a2856]/90 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </Button>
              
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-[#25d366] hover:bg-[#25d366]/90 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Horário de atendimento: Seg-Sex, 8h às 18h
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneContact; 