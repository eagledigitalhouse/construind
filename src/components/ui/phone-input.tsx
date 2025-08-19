import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '../../lib/utils';

interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

// Códigos de países mais comuns
const COUNTRY_CODES = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colômbia', flag: '🇨🇴' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+598', country: 'Uruguai', flag: '🇺🇾' },
  { code: '+595', country: 'Paraguai', flag: '🇵🇾' },
  { code: '+591', country: 'Bolívia', flag: '🇧🇴' },
  { code: '+593', country: 'Equador', flag: '🇪🇨' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
  { code: '+49', country: 'Alemanha', flag: '🇩🇪' },
  { code: '+39', country: 'Itália', flag: '🇮🇹' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
];

// DDDs do Brasil
const BRAZIL_AREA_CODES = [
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "Digite o número",
  className,
  disabled = false,
  required = false,
  error
}) => {
  const [countryCode, setCountryCode] = useState('+55');
  const [areaCode, setAreaCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isBrazil, setIsBrazil] = useState(true);

  // Parsear valor inicial
  useEffect(() => {
    if (value) {
      // Remover todos os caracteres não numéricos e o +
      const cleanValue = value.replace(/[^\d+]/g, '');
      
      if (cleanValue.startsWith('+55')) {
        // Número brasileiro
        setCountryCode('+55');
        setIsBrazil(true);
        const remaining = cleanValue.substring(3);
        if (remaining.length >= 2) {
          setAreaCode(remaining.substring(0, 2));
          setPhoneNumber(remaining.substring(2));
        }
      } else if (cleanValue.startsWith('+')) {
        // Número internacional
        const foundCountry = COUNTRY_CODES.find(c => cleanValue.startsWith(c.code));
        if (foundCountry) {
          setCountryCode(foundCountry.code);
          setIsBrazil(foundCountry.code === '+55');
          setPhoneNumber(cleanValue.substring(foundCountry.code.length));
          setAreaCode('');
        }
      } else if (cleanValue.length >= 10) {
        // Número brasileiro sem código do país
        setCountryCode('+55');
        setIsBrazil(true);
        setAreaCode(cleanValue.substring(0, 2));
        setPhoneNumber(cleanValue.substring(2));
      }
    }
  }, []);

  // Formatar número de telefone brasileiro
  const formatBrazilianPhone = (number: string) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length === 9) {
      return digits.replace(/(\d{5})(\d{4})/, '$1-$2');
    } else if (digits.length === 8) {
      return digits.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    return digits;
  };

  // Atualizar valor completo
  const updateFullValue = (newCountryCode: string, newAreaCode: string, newPhoneNumber: string) => {
    let fullValue = '';
    
    if (newCountryCode === '+55' && newAreaCode && newPhoneNumber) {
      // Formato brasileiro para envio: +5511999999999 (apenas números)
      const cleanPhone = newPhoneNumber.replace(/\D/g, '');
      fullValue = `${newCountryCode}${newAreaCode}${cleanPhone}`;
    } else if (newCountryCode && newPhoneNumber) {
      // Formato internacional: +1234567890 (apenas números)
      const cleanPhone = newPhoneNumber.replace(/\D/g, '');
      fullValue = `${newCountryCode}${cleanPhone}`;
    }
    
    onChange(fullValue);
  };

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    setIsBrazil(newCountryCode === '+55');
    
    if (newCountryCode !== '+55') {
      setAreaCode('');
    }
    
    updateFullValue(newCountryCode, newCountryCode === '+55' ? areaCode : '', phoneNumber);
  };

  const handleAreaCodeChange = (newAreaCode: string) => {
    setAreaCode(newAreaCode);
    updateFullValue(countryCode, newAreaCode, phoneNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(newPhoneNumber);
    updateFullValue(countryCode, areaCode, newPhoneNumber);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        {/* Seletor de código do país */}
        <div className="w-32">
          <Select value={countryCode} onValueChange={handleCountryCodeChange} disabled={disabled}>
            <SelectTrigger className={cn("text-sm bg-gray-950 border-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-orange-500", error && "border-red-500")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seletor de DDD (apenas para Brasil) */}
        {isBrazil && (
          <div className="w-20">
            <Select value={areaCode} onValueChange={handleAreaCodeChange} disabled={disabled}>
              <SelectTrigger className={cn("text-sm bg-gray-950 border-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-orange-500", error && "border-red-500")}>
                <SelectValue placeholder="DDD" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {BRAZIL_AREA_CODES.map((ddd) => (
                  <SelectItem key={ddd} value={ddd}>
                    {ddd}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Campo do número */}
        <div className="flex-1">
          <Input
            id={id}
            type="tel"
            value={isBrazil ? formatBrazilianPhone(phoneNumber) : phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={isBrazil ? "99999-9999" : placeholder}
            disabled={disabled}
            required={required}
            className={cn("bg-gray-950 border-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-orange-500", error && "border-red-500")}
            maxLength={isBrazil ? 10 : 15}
          />
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Preview do número completo */}
      {value && (
        <p className="text-xs text-gray-500">
          Número completo: {value}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
export { PhoneInput };