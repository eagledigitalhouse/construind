-- Adicionar coluna posicao à tabela patrocinadores
ALTER TABLE patrocinadores 
ADD COLUMN IF NOT EXISTS posicao INTEGER;

-- Atualizar posições existentes baseadas na data de criação
WITH posicoes AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) as nova_posicao
  FROM patrocinadores 
  WHERE posicao IS NULL
)
UPDATE patrocinadores 
SET posicao = posicoes.nova_posicao
FROM posicoes 
WHERE patrocinadores.id = posicoes.id;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_patrocinadores_posicao ON patrocinadores(posicao);

-- Verificar resultados
SELECT id, nome, categoria_id, posicao, created_at 
FROM patrocinadores 
ORDER BY posicao;