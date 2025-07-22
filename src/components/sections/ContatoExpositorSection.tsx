import React, { useEffect, useState } from "react";
import { Phone, Mail, MessageCircle, ArrowRight, Store } from "lucide-react";
import { GlassChip } from "@/components/ui/glass-chip";
import DynamicForm from "@/components/ui/dynamic-form";
import { supabase } from "@/lib/supabase";

interface FormularioConfig {
  id: string;
  titulo: string;
  descricao?: string;
  mensagemSucesso: string;
  redirecionarApos?: string;
  campos: any[];
  estiloPersonalizado?: string;
}

const ContatoExpositorSection = () => {
  const [formularioConfig, setFormularioConfig] = useState<FormularioConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarFormulario = async () => {
      try {
        // Buscar formulário na nova estrutura
        const { data: formulario, error: formularioError } = await supabase
          .from('formularios')
          .select('*')
          .eq('nome', 'Cadastro de Expositor')
          .eq('status', 'ativo')
          .single();

        if (formularioError && formularioError.code !== 'PGRST116') {
          throw formularioError;
        }

        if (formulario) {
          // Buscar campos do formulário
          const { data: campos, error: camposError } = await supabase
            .from('formulario_campos')
            .select('*')
            .eq('formulario_id', formulario.id)
            .order('ordem');

          if (camposError) throw camposError;

          const config = formulario.configuracao || {};
          setFormularioConfig({
            id: formulario.id,
            titulo: formulario.nome,
            descricao: formulario.descricao,
            mensagemSucesso: config.mensagemSucesso || 'Obrigado pelo seu interesse! Entraremos em contato em breve.',
            redirecionarApos: config.redirecionarApos,
            campos: campos || [],
            estiloPersonalizado: config.estiloPersonalizado
          });
        }
      } catch (err) {
        console.error('Erro ao carregar formulário:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarFormulario();
  }, []);

  // Formulário padrão caso não exista configuração no banco
  const formularioPadrao: FormularioConfig = {
    id: 'expositor-padrao',
    titulo: 'Reserve seu Espaço',
    mensagemSucesso: 'Obrigado pelo seu interesse! Entraremos em contato em breve.',
    campos: [
      {
        id: '1',
        nome: 'empresa',
        label: 'Nome da Empresa',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Digite o nome da sua empresa',
        ordem: 1
      },
      {
        id: '2',
        nome: 'responsavel',
        label: 'Nome do Responsável',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Seu nome completo',
        ordem: 2
      },
      {
        id: '3',
        nome: 'email',
        label: 'E-mail',
        tipo: 'email',
        obrigatorio: true,
        placeholder: 'seu@email.com',
        ordem: 3
      },
      {
        id: '4',
        nome: 'telefone',
        label: 'Telefone',
        tipo: 'tel',
        obrigatorio: true,
        placeholder: '(19) 9 9999-9999',
        ordem: 4
      },
      {
        id: '5',
        nome: 'segmento',
        label: 'Segmento',
        tipo: 'select',
        obrigatorio: true,
        placeholder: 'Selecione seu segmento',
        opcoes: [
          'Academia e Fitness',
          'Nutrição e Suplementos',
          'Bem-estar e Saúde',
          'Artigos Esportivos',
          'Equipamentos de Exercício',
          'Vestuário Esportivo',
          'Tecnologia e Apps',
          'Serviços de Saúde',
          'Outros'
        ],
        ordem: 5
      },
      {
        id: '6',
        nome: 'stand',
        label: 'Stand de Interesse',
        tipo: 'select',
        obrigatorio: true,
        placeholder: 'Selecione o tipo de stand',
        opcoes: [
          'Stand Simples (3x3m)',
          'Stand Premium (3x4m)',
          'Stand Duplo (6x3m)',
          'Stand Personalizado',
          'Ainda não sei'
        ],
        ordem: 6
      },
      {
        id: '7',
        nome: 'mensagem',
        label: 'Mensagem',
        tipo: 'textarea',
        obrigatorio: false,
        placeholder: 'Conte-nos mais sobre sua empresa e objetivos...',
        ordem: 7
      }
    ]
  };

  return (
    <section id="contato" className="py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlassChip icon={<Phone className="w-4 h-4" />}>
              Fale conosco
            </GlassChip>
          </div>
          
          <div className="mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight">
              Vamos construir seu <span className="bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent">sucesso</span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
            Nossa equipe está pronta para ajudar você a escolher o melhor espaço para sua empresa. 
            Entre em contato e garanta sua participação na FESPIN 2025.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Formulário de Contato Dinâmico */}
          {loading ? (
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-100 mb-8 flex justify-center items-center min-h-[300px]">
              <p>Carregando formulário...</p>
            </div>
          ) : (
            <DynamicForm
              tipoFormularioId="expositor"
              config={formularioConfig || formularioPadrao}
              className="mb-8"
              buttonText="Solicitar Informações"
              buttonIcon={<>
                <Store className="mr-2 w-5 h-5" />
                <ArrowRight className="ml-2 w-5 h-5" />
              </>}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContatoExpositorSection;