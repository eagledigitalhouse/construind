import React from 'react';
import { MessageCircle } from 'lucide-react';

const BlankMessage: React.FC = () => {
  return (
    <div className="text-center space-y-1">
      <MessageCircle className="text-gray-500 dark:text-gray-400 w-16 h-16 mx-auto" />
      <div className="text-2xl text-gray-600 dark:text-gray-300 font-medium">
        Nenhum chat selecionado
      </div>
      <div className="text-sm text-gray-500">
        não se preocupe, respire fundo e diga "Olá"
      </div>
    </div>
  );
};

export default BlankMessage;