import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface EmailAutocompleteProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const EMAIL_PROVIDERS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'uol.com.br',
  'terra.com.br',
  'bol.com.br',
  'ig.com.br',
  'globo.com',
  'live.com',
  'icloud.com',
  'me.com',
  'msn.com',
  'email.com',
  'protonmail.com'
];

export const EmailAutocomplete: React.FC<EmailAutocompleteProps> = ({
  id,
  placeholder = "Digite seu email...",
  value,
  onChange,
  className,
  disabled = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Gerar sugestões baseadas no input
  const generateSuggestions = (inputValue: string) => {
    if (!inputValue || inputValue.includes('@')) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Se tem texto antes do @, gerar sugestões
    const suggestions = EMAIL_PROVIDERS.map(provider => `${inputValue}@${provider}`);
    setSuggestions(suggestions);
    setShowSuggestions(true);
    setActiveSuggestion(-1);
  };

  // Lidar com mudanças no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Se o usuário está digitando antes do @, mostrar sugestões
    if (!newValue.includes('@') && newValue.length > 0) {
      generateSuggestions(newValue);
    } else {
      setShowSuggestions(false);
    }
  };

  // Lidar com teclas especiais
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          selectSuggestion(suggestions[activeSuggestion]);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
        
      case 'Tab':
        if (activeSuggestion >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[activeSuggestion]);
        }
        break;
    }
  };

  // Selecionar uma sugestão
  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  };

  // Fechar sugestões quando clicar fora
  const handleBlur = (e: React.FocusEvent) => {
    // Delay para permitir clique nas sugestões
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }, 150);
  };

  // Scroll automático para sugestão ativa
  useEffect(() => {
    if (activeSuggestion >= 0 && suggestionRefs.current[activeSuggestion]) {
      suggestionRefs.current[activeSuggestion]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeSuggestion]);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn("pr-10", className)}
        disabled={disabled}
        autoComplete="email"
      />
      
      {/* Sugestões */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.slice(0, 8).map((suggestion, index) => (
            <div
              key={suggestion}
              ref={el => suggestionRefs.current[index] = el}
              className={cn(
                "px-4 py-3 cursor-pointer text-sm transition-colors",
                "hover:bg-blue-50 hover:text-blue-600",
                activeSuggestion === index && "bg-blue-50 text-blue-600"
              )}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
            >
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">@</span>
                <span className="font-medium">{suggestion.split('@')[0]}</span>
                <span className="text-gray-400">@{suggestion.split('@')[1]}</span>
              </div>
            </div>
          ))}
          
          {/* Dica no rodapé */}
          <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
            <span>Use ↑↓ para navegar</span>
            <span>Enter para selecionar</span>
          </div>
        </div>
      )}
      
      {/* Ícone de email */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        @
      </div>
    </div>
  );
};