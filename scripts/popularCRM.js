import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados de exemplo para contatos
const contatosExemplo = [
  {
    tipo_formulario: 'contato_expositor',
    dados: {
      nome: 'Maria Silva',
      email: 'maria.silva@academia.com',
      telefone: '(11) 98765-4321',
      empresa: 'Academia Fitness Pro',
      mensagem: 'Gostaria de participar como expositor na área de academias. Temos equipamentos inovadores para apresentar.'
    },
    status: 'novo',
    prioridade: 'alta',
    origem: 'site_fespin'
  },
  {
    tipo_formulario: 'contato_expositor',
    dados: {
      nome: 'Carlos Santos',
      email: 'carlos@nutricaoesportiva.com',
      telefone: '(11) 99876-5432',
      empresa: 'Nutrição Esportiva Plus',
      mensagem: 'Somos uma empresa de suplementos e nutrição esportiva. Queremos expor nossos produtos na FESPIN 2025.'
    },
    status: 'em_andamento',
    prioridade: 'media',
    origem: 'formulario_contato'
  },
  {
    tipo_formulario: 'newsletter',
    dados: {
      nome: 'Ana Costa',
      email: 'ana.costa@email.com'
    },
    status: 'finalizado',
    prioridade: 'baixa',
    origem: 'newsletter_signup'
  },
  {
    tipo_formulario: 'contato_geral',
    dados: {
      nome: 'Roberto Lima',
      email: 'roberto.lima@empresa.com',
      telefone: '(11) 97654-3210',
      assunto: 'Parceria Comercial',
      mensagem: 'Gostaria de discutir uma possível parceria comercial para o evento FESPIN 2025.'
    },
    status: 'novo',
    prioridade: 'alta',
    origem: 'contato_direto'
  },
  {
    tipo_formulario: 'contato_expositor',
    dados: {
      nome: 'Fernanda Oliveira',
      email: 'fernanda@bemestar.com',
      telefone: '(11) 96543-2109',
      empresa: 'Bem-Estar Integral',
      mensagem: 'Trabalhamos com produtos de bem-estar e terapias alternativas. Gostaríamos de participar da feira.'
    },
    status: 'em_andamento',
    prioridade: 'media',
    origem: 'indicacao'
  },
  {
    tipo_formulario: 'contato_geral',
    dados: {
      nome: 'João Pereira',
      email: 'joao.pereira@gmail.com',
      telefone: '(11) 95432-1098',
      assunto: 'Informações sobre o evento',
      mensagem: 'Gostaria de mais informações sobre datas, local e como participar como visitante.'
    },
    status: 'finalizado',
    prioridade: 'baixa',
    origem: 'site_fespin'
  }
];

async function popularCRM() {
  try {
    console.log('🚀 Iniciando população do CRM...');

    // Buscar tipos de formulário existentes
    const { data: tiposFormulario, error: errorTipos } = await supabase
      .from('tipos_formulario')
      .select('id, nome');

    if (errorTipos) {
      throw new Error(`Erro ao buscar tipos de formulário: ${errorTipos.message}`);
    }

    console.log(`📋 Encontrados ${tiposFormulario.length} tipos de formulário`);

    // Criar mapeamento de nome para ID
    const tipoFormularioMap = {};
    tiposFormulario.forEach(tipo => {
      tipoFormularioMap[tipo.nome] = tipo.id;
    });

    // Inserir contatos de exemplo
    const contatosParaInserir = contatosExemplo.map(contato => ({
      tipo_formulario_id: tipoFormularioMap[contato.tipo_formulario] || null,
      dados: contato.dados,
      status: contato.status,
      prioridade: contato.prioridade,
      origem: contato.origem,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: contatosInseridos, error: errorContatos } = await supabase
      .from('contatos')
      .insert(contatosParaInserir)
      .select();

    if (errorContatos) {
      throw new Error(`Erro ao inserir contatos: ${errorContatos.message}`);
    }

    console.log(`✅ ${contatosInseridos.length} contatos inseridos com sucesso!`);

    // Criar alguns registros de histórico para demonstração
    const historicos = [
      {
        contato_id: contatosInseridos[1].id, // Carlos Santos
        acao: 'status_alterado',
        descricao: 'Status alterado de "novo" para "em_andamento"',
        created_at: new Date().toISOString()
      },
      {
        contato_id: contatosInseridos[2].id, // Ana Costa
        acao: 'status_alterado',
        descricao: 'Status alterado para "finalizado" - Newsletter enviada',
        created_at: new Date().toISOString()
      },
      {
        contato_id: contatosInseridos[4].id, // Fernanda Oliveira
        acao: 'observacao_adicionada',
        descricao: 'Contato realizado por telefone - interessada em stand premium',
        created_at: new Date().toISOString()
      }
    ];

    const { error: errorHistorico } = await supabase
      .from('contatos_historico')
      .insert(historicos);

    if (errorHistorico) {
      console.warn(`⚠️ Aviso ao inserir histórico: ${errorHistorico.message}`);
    } else {
      console.log(`📝 ${historicos.length} registros de histórico criados`);
    }

    // Verificar dados inseridos
    const { data: totalContatos, error: errorTotal } = await supabase
      .from('contatos')
      .select('id', { count: 'exact' });

    if (!errorTotal) {
      console.log(`📊 Total de contatos no sistema: ${totalContatos.length}`);
    }

    console.log('🎉 População do CRM concluída com sucesso!');
    console.log('\n📋 Resumo dos dados inseridos:');
    console.log('- Contatos de expositores: 3');
    console.log('- Contatos gerais: 2');
    console.log('- Inscrições newsletter: 1');
    console.log('- Status variados: novo, em_andamento, finalizado');
    console.log('- Prioridades: alta, media, baixa');
    console.log('\n🔗 Acesse o CRM em: http://localhost:5173/admin/crm');

  } catch (error) {
    console.error('❌ Erro ao popular CRM:', error.message);
    process.exit(1);
  }
}

// Executar script
popularCRM();