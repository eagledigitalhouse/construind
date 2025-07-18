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

async function criarPipelinesPersonalizados() {
  try {
    console.log('🚀 Iniciando criação de pipelines personalizados...');
    console.log('⚠️ Nota: As tabelas devem ser criadas manualmente no Supabase Dashboard');
    console.log('📋 Verificando se as tabelas existem...');

    // Verificar se as tabelas existem tentando fazer uma consulta
    const { error: errorTestePipelines } = await supabase
      .from('pipelines_formulario')
      .select('id')
      .limit(1);

    if (errorTestePipelines) {
      console.log('❌ Tabela pipelines_formulario não existe. Criando dados de exemplo...');
      console.log('⚠️ IMPORTANTE: Você precisa criar as tabelas manualmente no Supabase Dashboard primeiro!');
      console.log('📋 SQL para criar as tabelas:');
      console.log(`
CREATE TABLE pipelines_formulario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_formulario_id UUID NOT NULL REFERENCES tipos_formulario(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tipo_formulario_id)
);

CREATE TABLE etapas_pipeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL REFERENCES pipelines_formulario(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#3B82F6',
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pipeline_id, ordem)
);

ALTER TABLE contatos ADD COLUMN IF NOT EXISTS etapa_pipeline_id UUID REFERENCES etapas_pipeline(id);`);
      return;
    }

    console.log('✅ Tabelas encontradas! Continuando...');

    // Buscar tipos de formulário existentes
    console.log('📋 Buscando tipos de formulário existentes...');
    const { data: tiposFormulario, error: errorTipos } = await supabase
      .from('tipos_formulario')
      .select('id, nome');

    if (errorTipos) {
      throw new Error(`Erro ao buscar tipos de formulário: ${errorTipos.message}`);
    }

    console.log(`📋 Encontrados ${tiposFormulario.length} tipos de formulário`);

    // 5. Criar pipelines para cada tipo de formulário
    console.log('🔄 Criando pipelines para cada tipo de formulário...');
    const pipelinesParaCriar = tiposFormulario.map(tipo => ({
      tipo_formulario_id: tipo.id,
      nome: `Pipeline ${tipo.nome}`,
      descricao: `Pipeline personalizado para ${tipo.nome}`,
      ativo: true
    }));

    const { data: pipelinesCriados, error: errorCriarPipelines } = await supabase
      .from('pipelines_formulario')
      .upsert(pipelinesParaCriar, { onConflict: 'tipo_formulario_id' })
      .select();

    if (errorCriarPipelines) {
      throw new Error(`Erro ao criar pipelines: ${errorCriarPipelines.message}`);
    }

    console.log(`✅ ${pipelinesCriados.length} pipelines criados/atualizados!`);

    // 6. Criar etapas padrão para cada pipeline
    console.log('🔄 Criando etapas padrão para cada pipeline...');
    const etapasPadrao = [
      { nome: 'Novo Lead', descricao: 'Contato recém-recebido', cor: '#3B82F6', ordem: 1 },
      { nome: 'Qualificação', descricao: 'Verificando interesse e adequação', cor: '#F59E0B', ordem: 2 },
      { nome: 'Proposta', descricao: 'Proposta enviada ou em elaboração', cor: '#8B5CF6', ordem: 3 },
      { nome: 'Negociação', descricao: 'Em processo de negociação', cor: '#EF4444', ordem: 4 },
      { nome: 'Fechado', descricao: 'Negócio concluído com sucesso', cor: '#10B981', ordem: 5 },
      { nome: 'Perdido', descricao: 'Oportunidade perdida', cor: '#6B7280', ordem: 6 }
    ];

    const etapasParaCriar = [];
    pipelinesCriados.forEach(pipeline => {
      etapasPadrao.forEach(etapa => {
        etapasParaCriar.push({
          pipeline_id: pipeline.id,
          nome: etapa.nome,
          descricao: etapa.descricao,
          cor: etapa.cor,
          ordem: etapa.ordem,
          ativo: true
        });
      });
    });

    const { data: etapasCriadas, error: errorCriarEtapas } = await supabase
      .from('etapas_pipeline')
      .upsert(etapasParaCriar, { onConflict: 'pipeline_id,ordem' })
      .select();

    if (errorCriarEtapas) {
      throw new Error(`Erro ao criar etapas: ${errorCriarEtapas.message}`);
    }

    console.log(`✅ ${etapasCriadas.length} etapas criadas/atualizadas!`);

    // 7. Atualizar contatos existentes para a primeira etapa do pipeline correspondente
    console.log('🔄 Atualizando contatos existentes...');
    const { data: contatos, error: errorContatos } = await supabase
      .from('contatos')
      .select('id, tipo_formulario_id')
      .is('etapa_pipeline_id', null)
      .not('tipo_formulario_id', 'is', null);

    if (errorContatos) {
      console.log('⚠️ Erro ao buscar contatos:', errorContatos.message);
    } else if (contatos && contatos.length > 0) {
      console.log(`📋 Atualizando ${contatos.length} contatos...`);
      
      for (const contato of contatos) {
        // Buscar a primeira etapa do pipeline correspondente
        const { data: primeiraEtapa, error: errorEtapa } = await supabase
          .from('etapas_pipeline')
          .select('id')
          .eq('pipeline_id', pipelinesCriados.find(p => p.tipo_formulario_id === contato.tipo_formulario_id)?.id)
          .eq('ordem', 1)
          .single();

        if (!errorEtapa && primeiraEtapa) {
          await supabase
            .from('contatos')
            .update({ etapa_pipeline_id: primeiraEtapa.id })
            .eq('id', contato.id);
        }
      }
      
      console.log('✅ Contatos atualizados com sucesso!');
    }

    console.log('🎉 Pipelines personalizados criados com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`- ${pipelinesCriados.length} pipelines criados`);
    console.log(`- ${etapasCriadas.length} etapas criadas`);
    console.log('- 6 etapas padrão por pipeline: Novo Lead, Qualificação, Proposta, Negociação, Fechado, Perdido');
    console.log('\n🔗 Acesse o CRM em: http://localhost:8085/admin/crm');

  } catch (error) {
    console.error('❌ Erro ao criar pipelines personalizados:', error.message);
    process.exit(1);
  }
}

// Executar script
criarPipelinesPersonalizados();