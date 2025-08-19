-- Unificação dos stands 3x3 - CONSTRUIND 2025
-- Data: $(Get-Date -Format "dd/MM/yyyy HH:mm")
-- Objetivo: Unificar stands 3x3_basico e 3x3_acabamentos em uma única categoria '3x3'

-- 1. Primeiro, vamos atualizar todos os stands 3x3_basico e 3x3_acabamentos para categoria '3x3'
UPDATE public.stands_construind 
SET categoria = '3x3', 
    cor = '#004aad',
    observacoes = 'Stand 3x3 - 9m² - Com estande octanorme, carpete e energia 220V'
WHERE categoria IN ('3x3_basico', '3x3_acabamentos');

-- 2. Remover as categorias antigas da tabela categorias_stands
DELETE FROM public.categorias_stands 
WHERE nome IN ('3x3_basico', '3x3_acabamentos');

-- 3. Inserir a nova categoria unificada '3x3'
INSERT INTO public.categorias_stands (nome, cor, descricao) VALUES 
('3x3', '#004aad', 'Stands 3x3 - 9m² - Com estande octanorme, carpete e energia 220V')
ON CONFLICT (nome) DO UPDATE SET 
  cor = EXCLUDED.cor,
  descricao = EXCLUDED.descricao;

-- 4. Verificar o resultado da unificação
SELECT 
    categoria,
    COUNT(*) as total_stands,
    preco,
    cor
FROM public.stands_construind 
WHERE categoria = '3x3'
GROUP BY categoria, preco, cor
ORDER BY categoria;

-- 5. Verificar todas as categorias restantes
SELECT 
    categoria,
    COUNT(*) as total_stands
FROM public.stands_construind 
GROUP BY categoria
ORDER BY categoria;

-- 6. Verificar categorias na tabela categorias_stands
SELECT nome, cor, descricao FROM public.categorias_stands ORDER BY nome;