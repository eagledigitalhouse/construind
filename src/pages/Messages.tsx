import React from 'react';
import ChatPage from '../components/chat/ChatPage';
import PageHeader from '@/components/layout/PageHeader';
import { MessageCircle } from 'lucide-react';

const Messages: React.FC = () => {
  return (
    <div className="p-6">
      <PageHeader
        title="Mensagens"
        description="Gerencie suas conversas e mensagens"
        icon={MessageCircle}
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <ChatPage />
      </div>
    </div>
  );
};

export default Messages;