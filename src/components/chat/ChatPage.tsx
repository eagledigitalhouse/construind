import React, { useState, useEffect, useRef } from 'react';
import { contacts, chats, profileUser } from '../../data/chatData';
import ContactList from './ContactList';
import MessageList from './MessageList';
import SendMessage from './SendMessage';
import ChatHead from './ChatHead';
import BlankMessage from './BlankMessage';
import { Avatar } from '../ui/avatar';
import clsx from 'clsx';

const ChatPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatData, setChatData] = useState(chats);
  const [contactsData, setContactsData] = useState(contacts);
  
  const chatHeightRef = useRef<HTMLDivElement>(null);

  const openChat = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = (message: string) => {
    if (!selectedChatId || !message.trim()) return;

    const newMessage = {
      message: message,
      time: new Date().toISOString(),
      senderId: 11, // Current user ID
    };

    setChatData(prevChats => {
      return prevChats.map(chat => {
        if (chat.userId === selectedChatId) {
          return {
            ...chat,
            chat: [...chat.chat, newMessage]
          };
        }
        return chat;
      });
    });
  };

  useEffect(() => {
    if (chatHeightRef.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatData]);

  const selectedChat = chatData.find(chat => chat.userId === selectedChatId);
  const selectedContact = contactsData.find(contact => contact.id === selectedChatId);
  const messages = selectedChat?.chat || [];

  // Filter contacts based on search term
  const filteredContacts = contactsData.filter(contact =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add chat info to contacts
  const contactsWithChat = filteredContacts.map(contact => {
    const chat = chatData.find(c => c.userId === contact.id);
    const lastMessage = chat ? chat.chat[chat.chat.length - 1] : null;
    
    return {
      ...contact,
      chat: {
        id: chat?.id || null,
        unseenMsgs: chat?.unseenMsgs || 0,
        lastMessage: lastMessage?.message || null,
        lastMessageTime: lastMessage?.time || null,
      }
    };
  });

  return (
    <div className="flex shadow-md bg-white" style={{ height: 'calc(100vh - 12.1rem)' }}>
      {/* Sidebar with contacts */}
      <div className="flex-none lg:w-[260px] md:w-[200px] w-20 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md rounded-tr-none rounded-br-none">
        <div className="h-full overflow-hidden">
          {/* Profile header */}
          <div className="sticky top-0 z-[1] py-3 px-4 rounded-tl-md bg-white/70 border-gray-200 dark:border-gray-700 border-b backdrop-blur-sm dark:bg-gray-800/50">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Avatar
                src={profileUser.avatar}
                dot
                className="h-10 w-10"
                dotClass={profileUser.status === 'online' ? 'bg-indigo-500' : 'bg-gray-500'}
              />
              <div className="flex-1 md:block hidden">
                <input
                  type="text"
                  className="text-control py-2 rounded-full w-full px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Contacts list */}
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 138px)' }}>
            {contactsWithChat.map((contact) => (
              <ContactList
                key={contact.id}
                contact={contact}
                openChat={openChat}
                selectedChatId={selectedChatId}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedChatId ? (
          <>
            {/* Chat header */}
            {selectedContact && <ChatHead contact={selectedContact} />}
            
            {/* Messages */}
            <div 
              ref={chatHeightRef}
              className="msgs overflow-y-auto pt-6 space-y-6 flex-1 px-4"
            >
              <ul className="space-y-6">
                {messages.map((message, index) => (
                  <MessageList
                    key={index}
                    message={message}
                    contact={selectedContact}
                    profile={{ profileUser }}
                  />
                ))}
              </ul>
            </div>
            
            {/* Send message */}
            <SendMessage handleSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <BlankMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;