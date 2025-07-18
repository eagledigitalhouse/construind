-- Script SQL para criar pipelines personalizados
-- Execute este script no Supabase Dashboard > SQL Editor

-- 1. Criar tabela pipelines_formulario
CREATE TABLE IF NOT EXISTS pipelines_formulario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo_formulario_id VARCHAR(100) NOT NULL UNIQUE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela etapas_pipeline
CREATE TABLE IF NOT EXISTS etapas_pipeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL REFERENCES pipelines_formulario(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#3B82F6',
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Adicionar coluna etapa_pipeline_id na tabela contatos (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contatos' AND column_name = 'etapa_pipeline_id') THEN
    ALTER TABLE contatos ADD COLUMN etapa_pipeline_id UUID REFERENCES etapas_pipeline(id);
  END IF;
END $$;

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS idx_pipelines_formulario_tipo ON pipelines_formulario(tipo_formulario_id);
CREATE INDEX IF NOT EXISTS idx_etapas_pipeline_pipeline_id ON etapas_pipeline(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_etapas_pipeline_ordem ON etapas_pipeline(pipeline_id, ordem);
CREATE INDEX IF NOT EXISTS idx_contatos_etapa_pipeline ON contatos(etapa_pipeline_id);

-- 5. Criar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pipelines_formulario_updated_at ON pipelines_formulario;
CREATE TRIGGER update_pipelines_formulario_updated_at
  BEFORE UPDATE ON pipelines_formulario
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_etapas_pipeline_updated_at ON etapas_pipeline;
CREATE TRIGGER update_etapas_pipeline_updated_at
  BEFORE UPDATE ON etapas_pipeline
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Inserir pipelines padrão para tipos de formulário conhecidos
INSERT INTO pipelines_formulario (nome, descricao, tipo_formulario_id)
VALUES 
  ('Pipeline Contato Geral', 'Pipeline padrão para Contato Geral', 'contato-geral'),
  ('Pipeline Inscrição Expositor', 'Pipeline padrão para Inscrição Expositor', 'inscricao-expositor'),
  ('Pipeline Solicitação Patrocínio', 'Pipeline padrão para Solicitação Patrocínio', 'solicitacao-patrocinio'),
  ('Pipeline Newsletter', 'Pipeline padrão para Newsletter', 'newsletter'),
  ('Pipeline Parcerias', 'Pipeline padrão para Parcerias', 'parcerias'),
  ('Pipeline Imprensa', 'Pipeline padrão para Imprensa', 'imprensa')
ON CONFLICT (tipo_formulario_id) DO NOTHING;

-- 7. Inserir etapas padrão para cada pipeline
INSERT INTO etapas_pipeline (pipeline_id, nome, descricao, cor, ordem)
SELECT 
  pf.id as pipeline_id,
  etapa.nome,
  etapa.descricao,
  etapa.cor,
  etapa.ordem
FROM pipelines_formulario pf
CROSS JOIN (
  VALUES 
    ('Novo', 'Contato recém-recebido', '#3B82F6', 1),
    ('Primeiro Contato', 'Primeiro contato realizado', '#F59E0B', 2),
    ('Qualificado', 'Lead qualificado', '#F97316', 3),
    ('Proposta Enviada', 'Proposta comercial enviada', '#8B5CF6', 4),
    ('Fechado', 'Negócio fechado com sucesso', '#10B981', 5),
    ('Perdido', 'Oportunidade perdida', '#EF4444', 6)
) AS etapa(nome, descricao, cor, ordem)
WHERE NOT EXISTS (
  SELECT 1 FROM etapas_pipeline ep 
  WHERE ep.pipeline_id = pf.id
);

-- 8. Atualizar contatos existentes para a primeira etapa do pipeline correspondente
UPDATE contatos 
SET etapa_pipeline_id = (
  SELECT ep.id 
  FROM etapas_pipeline ep
  JOIN pipelines_formulario pf ON ep.pipeline_id = pf.id
  WHERE pf.tipo_formulario_id = contatos.tipo_formulario_id
  AND ep.ordem = 1
  LIMIT 1
)
WHERE etapa_pipeline_id IS NULL
AND tipo_formulario_id IS NOT NULL;

-- 9. Habilitar RLS (Row Level Security) se necessário
ALTER TABLE pipelines_formulario ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapas_pipeline ENABLE ROW LEVEL SECURITY;

-- 10. Criar políticas RLS básicas (ajuste conforme sua necessidade)
CREATE POLICY "Permitir leitura de pipelines" ON pipelines_formulario
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita de pipelines" ON pipelines_formulario
  FOR ALL USING (true);

CREATE POLICY "Permitir leitura de etapas" ON etapas_pipeline
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita de etapas" ON etapas_pipeline
  FOR ALL USING (true);

-- Verificar se tudo foi criado corretamente
SELECT 'Pipelines criados:' as info, COUNT(*) as quantidade FROM pipelines_formulario
UNION ALL
SELECT 'Etapas criadas:' as info, COUNT(*) as quantidade FROM etapas_pipeline
UNION ALL
SELECT 'Contatos com etapa:' as info, COUNT(*) as quantidade FROM contatos WHERE etapa_pipeline_id IS NOT NULL;