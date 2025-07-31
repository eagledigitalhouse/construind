import React, { useState } from 'react';
import { Link, Smile, Send } from 'lucide-react';

interface SendMessageProps {
  handleSendMessage: (message: string) => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ handleSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      handleSendMessage(message);
      setMessage('');
    }
  };

  return (
    <footer className="md:px-6 px-4 sm:flex md:space-x-4 sm:space-x-2 rtl:space-x-reverse border-t md:pt-6 pt-4 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex-none sm:flex hidden md:space-x-3 space-x-1 rtl:space-x-reverse">
        <div className="text-xl text-indigo-500 cursor-pointer">
          <Link className="w-5 h-5" />
        </div>
        <div className="text-xl text-indigo-500 cursor-pointer">
          <Smile className="w-5 h-5" />
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex-1 relative flex space-x-3 rtl:space-x-reverse"
      >
        <div className="flex-1">
          <textarea
            value={message}
            onChange={handleChange}
            placeholder="Digite sua mensagem..."
            className="focus:ring-0 focus:outline-0 block w-full bg-transparent dark:text-white resize-none border-none p-0 text-sm placeholder-gray-500 dark:placeholder-gray-400"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        <div className="flex-none md:pr-0 pr-3">
          <button
            type="submit"
            className="h-8 w-8 bg-indigo-500 text-white flex flex-col justify-center items-center text-lg rounded-full hover:bg-indigo-600 transition-colors duration-200"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4 transform rotate-45" />
          </button>
        </div>
      </form>
    </footer>
  );
};

export default SendMessage;