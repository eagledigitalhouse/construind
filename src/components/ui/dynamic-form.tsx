import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { ArrowRight } from 'lucide-react';
import PhoneInput from './phone-input';

interface CampoFormulario {
  id: string;
  nome: string;
  label: string;
  tipo: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  obrigatorio: boolean;
  placeholder?: string;
  opcoes?: string[];
  validacao?: string;
  ordem: number;
}

interface FormularioConfig {
  id: string;
  titulo: string;
  descricao?: string;
  mensagemSucesso: string;
  redirecionarApos?: string;
  campos: CampoFormulario[];
  estiloPersonalizado?: string;
}

interface DynamicFormProps {
  tipoFormularioId: string; // Agora será o ID do formulário na nova estrutura
  config: FormularioConfig;
  className?: string;
  onSuccess?: () => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  tipoFormularioId,
  config,
  className = '',
  onSuccess,
  buttonText = 'Enviar',
  buttonIcon = <ArrowRight className="ml-2 w-5 h-5" />
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar campos obrigatórios
      const camposObrigatorios = config.campos.filter(campo => campo.obrigatorio);
      for (const campo of camposObrigatorios) {
        if (!formData[campo.nome] && formData[campo.nome] !== false) {
          showToast.error(`O campo ${campo.label} é obrigatório`);
          setIsSubmitting(false);
          return;
        }
      }

      // Obter IP do usuário (opcional)
      let userIP = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIP = ipData.ip;
      } catch (e) {
        console.log('Não foi possível obter o IP do usuário');
      }

      // Enviar para o Supabase na nova estrutura
      const { error } = await supabase
        .from('formulario_respostas')
        .insert({
          formulario_id: config.id, // Usar o ID do formulário da config
          dados: formData,
          ip_address: userIP,
          user_agent: navigator.userAgent,
          origem: window.location.href,
          status: 'novo',
          prioridade: 'normal'
        });

      if (error) throw error;

      // Sucesso
      setSubmitted(true);
      setFormData({});
      showToast.success(config.mensagemSucesso || 'Formulário enviado com sucesso!');
      
      if (onSuccess) onSuccess();
      
      // Redirecionar se necessário
      if (config.redirecionarApos) {
        window.location.href = config.redirecionarApos;
      }
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      showToast.error('Ocorreu um erro ao enviar o formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted && !config.redirecionarApos) {
    return (
      <div className={`bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-100 ${className}`}>
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{config.mensagemSucesso}</h3>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-[#00d856] to-[#b1f727] text-[#0a2856] font-bold py-3 px-6 rounded-lg"
          >
            Enviar outro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-100 ${className}`}>
      {config.titulo && (
        <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 flex items-center justify-center">
          {config.titulo}
        </h3>
      )}
      
      {config.descricao && (
        <p className="text-gray-600 mb-6 text-center">{config.descricao}</p>
      )}
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        {config.campos
          .sort((a, b) => a.ordem - b.ordem)
          .map((campo) => {
            // Determinar se o campo deve ocupar toda a largura
            const isFullWidth = campo.tipo === 'textarea';
            
            return (
              <div 
                key={campo.id} 
                className={isFullWidth ? 'w-full' : 'w-full md:w-1/2 px-2 md:inline-block'}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {campo.label}
                  {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {campo.tipo === 'textarea' ? (
                  <textarea
                    name={campo.nome}
                    value={formData[campo.nome] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50 resize-none"
                    placeholder={campo.placeholder}
                    required={campo.obrigatorio}
                    rows={4}
                  />
                ) : campo.tipo === 'select' ? (
                  <select
                    name={campo.nome}
                    value={formData[campo.nome] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                    required={campo.obrigatorio}
                  >
                    <option value="">{campo.placeholder || 'Selecione...'}</option>
                    {campo.opcoes?.map((opcao, idx) => (
                      <option key={idx} value={opcao}>{opcao}</option>
                    ))}
                  </select>
                ) : campo.tipo === 'checkbox' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={campo.nome}
                      checked={!!formData[campo.nome]}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-[#00d856] border-gray-300 rounded focus:ring-[#00d856]"
                      required={campo.obrigatorio}
                    />
                    <span className="ml-2 text-gray-700">{campo.placeholder}</span>
                  </div>
                ) : campo.tipo === 'radio' ? (
                  <div className="space-y-2">
                    {campo.opcoes?.map((opcao, idx) => (
                      <div key={idx} className="flex items-center">
                        <input
                          type="radio"
                          name={campo.nome}
                          value={opcao}
                          checked={formData[campo.nome] === opcao}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#00d856] border-gray-300 focus:ring-[#00d856]"
                          required={campo.obrigatorio}
                        />
                        <span className="ml-2 text-gray-700">{opcao}</span>
                      </div>
                    ))}
                  </div>
                ) : campo.tipo === 'tel' ? (
                  <PhoneInput
                    value={formData[campo.nome] || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, [campo.nome]: value }))}
                    placeholder={campo.placeholder}
                    required={campo.obrigatorio}
                  />
                ) : (
                  <input
                    type={campo.tipo}
                    name={campo.nome}
                    value={formData[campo.nome] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                    placeholder={campo.placeholder}
                    required={campo.obrigatorio}
                  />
                )}
              </div>
            );
          })}
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center">
            {isSubmitting ? 'Enviando...' : buttonText}
            {!isSubmitting && buttonIcon}
          </span>
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;