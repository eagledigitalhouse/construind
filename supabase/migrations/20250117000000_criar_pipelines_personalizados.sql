-- Criar tabela para pipelines personalizados por tipo de formulário
CREATE TABLE IF NOT EXISTS pipelines_formulario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_formulario_id VARCHAR(100) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para etapas dos pipelines
CREATE TABLE IF NOT EXISTS etapas_pipeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL REFERENCES pipelines_formulario(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#3B82F6', -- Cor em hexadecimal
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pipeline_id, ordem) -- Ordem única dentro do pipeline
);

-- Adicionar coluna etapa_pipeline_id na tabela contatos
ALTER TABLE contatos 
ADD COLUMN IF NOT EXISTS etapa_pipeline_id UUID REFERENCES etapas_pipeline(id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pipelines_formulario_tipo ON pipelines_formulario(tipo_formulario_id);
CREATE INDEX IF NOT EXISTS idx_etapas_pipeline_pipeline_id ON etapas_pipeline(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_etapas_pipeline_ordem ON etapas_pipeline(pipeline_id, ordem);
CREATE INDEX IF NOT EXISTS idx_contatos_etapa_pipeline ON contatos(etapa_pipeline_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_pipelines_formulario_updated_at 
    BEFORE UPDATE ON pipelines_formulario 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_etapas_pipeline_updated_at 
    BEFORE UPDATE ON etapas_pipeline 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir pipelines padrão para os tipos de formulário conhecidos
INSERT INTO pipelines_formulario (tipo_formulario_id, nome, descricao)
VALUES 
  ('contato-geral', 'Pipeline Contato Geral', 'Pipeline padrão para Contato Geral'),
  ('inscricao-expositor', 'Pipeline Inscrição Expositor', 'Pipeline padrão para Inscrição Expositor'),
  ('solicitacao-patrocinio', 'Pipeline Solicitação Patrocínio', 'Pipeline padrão para Solicitação Patrocínio'),
  ('newsletter', 'Pipeline Newsletter', 'Pipeline padrão para Newsletter'),
  ('parcerias', 'Pipeline Parcerias', 'Pipeline padrão para Parcerias'),
  ('imprensa', 'Pipeline Imprensa', 'Pipeline padrão para Imprensa')
ON CONFLICT (tipo_formulario_id) DO NOTHING;

-- Inserir etapas padrão para cada pipeline criado
WITH pipelines_criados AS (
  SELECT id, nome FROM pipelines_formulario
)
INSERT INTO etapas_pipeline (pipeline_id, nome, descricao, cor, ordem)
SELECT 
  pc.id,
  etapa.nome,
  etapa.descricao,
  etapa.cor,
  etapa.ordem
FROM pipelines_criados pc
CROSS JOIN (
  VALUES 
    ('Novo Lead', 'Contato recém-recebido', '#3B82F6', 1),
    ('Qualificação', 'Verificando interesse e adequação', '#F59E0B', 2),
    ('Proposta', 'Proposta enviada ou em elaboração', '#8B5CF6', 3),
    ('Negociação', 'Em processo de negociação', '#EF4444', 4),
    ('Fechado', 'Negócio concluído com sucesso', '#10B981', 5),
    ('Perdido', 'Oportunidade perdida', '#6B7280', 6)
) AS etapa(nome, descricao, cor, ordem)
WHERE NOT EXISTS (
  SELECT 1 FROM etapas_pipeline ep WHERE ep.pipeline_id = pc.id
);

-- Atualizar contatos existentes para a primeira etapa do pipeline correspondente
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

COMMIT;