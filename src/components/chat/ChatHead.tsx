import React from 'react';
import { Phone, Video } from 'lucide-react';
import { Avatar } from '../ui/avatar';

interface Contact {
  id: number;
  fullName: string;
  avatar: string;
  status: string;
}

interface ChatHeadProps {
  contact: Contact;
}

const ChatHead: React.FC<ChatHeadProps> = ({ contact }) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-tr-md">
      <div className="flex py-3 px-3 items-center">
        <div className="flex-1">
          <div className="flex space-x-3 rtl:space-x-reverse">
            <div className="flex-none">
              <Avatar
                src={contact?.avatar}
                dot
                className="h-10 w-10"
                dotClass={
                  contact?.status === 'online' ? 'bg-indigo-500' : 'bg-gray-500'
                }
              />
            </div>
            <div className="flex-1 text-start">
              <div className="text-gray-900 dark:text-white font-medium">
                {contact?.fullName}
              </div>
              <div className="block text-gray-500 dark:text-gray-300 text-xs font-normal">
                {contact?.status === 'online' ? 'Ativo' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse">
          <button className="w-9 h-9 rounded-full text-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="w-9 h-9 rounded-full text-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHead;