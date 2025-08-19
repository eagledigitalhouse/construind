-- Inserção de stands para CONSTRUIND 2025
-- Data: $(Get-Date -Format "dd/MM/yyyy HH:mm")

-- Primeiro, vamos limpar a tabela de stands existente
DELETE FROM public.stands_construind;

-- Inserir categorias de stands
INSERT INTO public.categorias_stands (nome, cor, descricao) VALUES 
('2x2', '#0097b2', 'Stands 2x2 - 4m² - Com estande octanorme, carpete e energia 220V'),
('3x3_basico', '#004aad', 'Stands 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V'),
('3x3_acabamentos', '#6cace3', 'Stands 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V'),
('5x5', '#55a04d', 'Área 5x5 - 25m² - Sem estande - com energia 220V'),
('8x8', '#ffb600', 'Área 8x8 - 64m² - Sem estande - com energia 220V'),
('10x10', '#ce1c21', 'Área 10x10 - 100m² - Sem estande - com energia 220V'),
('9x10', '#ff5500', 'Área 9x10 - 90m² - Sem estande - com energia 220V')
ON CONFLICT (nome) DO UPDATE SET 
  cor = EXCLUDED.cor,
  descricao = EXCLUDED.descricao;

-- STANDS 2X2 (18 stands) - R$ 2.600 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('1', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('2', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('3', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('4', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('5', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('6', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('7', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('8', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('9', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('10', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('11', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('12', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('13', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('14', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('15', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('16', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('17', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2'),
('18', '2x2', 2600.00, 'disponivel', 'Stand 2x2 - 4m² - Com estande octanorme, carpete e energia 220V', 2, 2, '#0097b2');

-- STANDS 3X3 BÁSICO - R$ 3.500 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('19', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('20', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('21', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('22', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('23', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('24', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('25', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('26', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('39', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('40', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('41', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('42', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('43', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('44', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('45', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('46', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('47', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('48', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('49', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('50', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('51', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('52', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('53', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('54', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('67', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('68', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('69', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('70', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('71', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('72', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('73', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad'),
('74', '3x3_basico', 3500.00, 'disponivel', 'Stand 3x3 Básico - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#004aad');

-- STANDS 3X3 ACABAMENTOS - R$ 3.500 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('27', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('28', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('29', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('30', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('31', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('32', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('33', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('34', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('35', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('36', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('37', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('38', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('55', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('56', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('57', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('58', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('59', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('60', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('61', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('62', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('63', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('64', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('65', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3'),
('66', '3x3_acabamentos', 3500.00, 'disponivel', 'Stand 3x3 Acabamentos - 9m² - Com estande octanorme, carpete e energia 220V', 3, 3, '#6cace3');

-- ÁREA 5X5 (16 stands) - R$ 5.200 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('75', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('76', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('77', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('78', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('79', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('80', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('81', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('82', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('83', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('84', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('85', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('86', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('87', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('88', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('89', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d'),
('90', '5x5', 5200.00, 'disponivel', 'Área 5x5 - 25m² - Sem estande - com energia 220V', 5, 5, '#55a04d');

-- ÁREA 10X10 (1 stand) - R$ 20.000 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('91', '10x10', 20000.00, 'disponivel', 'Área 10x10 - 100m² - Sem estande - com energia 220V', 10, 10, '#ce1c21');

-- ÁREA 8X8 (6 stands) - R$ 8.500 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('92', '8x8', 8500.00, 'disponivel', 'Área 8x8 - 64m² - Sem estande - com energia 220V', 8, 8, '#ffb600'),
('93', '8x8', 8500.00, 'disponivel', 'Área 8x8 - 64m² - Sem estande - com energia 220V', 8, 8, '#ffb600'),
('94', '8x8', 8500.00, 'disponivel', 'Área 8x8 - 64m² - Sem estande - com energia 220V', 8, 8, '#ffb600'),
('95', '8x8', 8500.00, 'disponivel', 'Área 8x8 - 64m² - Sem estande - com energia 220V', 8, 8, '#ffb600'),
('96', '8x8', 8500.00, 'disponivel', 'Área 8x8 - 64m² - Sem estande - com energia 220V', 8, 8, '#ffb600'),
('97', '8x8', 8500.00, 'disponivel', 'Área 8x8 - 64m² - Sem estande - com energia 220V', 8, 8, '#ffb600');

-- ÁREA 9X10 (8 stands) - R$ 9.500 cada
INSERT INTO public.stands_construind (numero_stand, categoria, preco, status, observacoes, largura, altura, cor) VALUES
('99', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('100', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('101', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('102', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('103', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('104', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('105', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500'),
('106', '9x10', 9500.00, 'disponivel', 'Área 9x10 - 90m² - Sem estande - com energia 220V', 9, 10, '#ff5500');

-- Atualizar estatísticas da tabela
ANALYZE public.stands_construind;
ANALYZE public.categorias_stands;

-- Verificar inserção
SELECT 
    categoria,
    COUNT(*) as total_stands,
    MIN(preco) as preco_minimo,
    MAX(preco) as preco_maximo,
    cor
FROM public.stands_construind 
GROUP BY categoria, cor
ORDER BY categoria;

DO $$
BEGIN
    RAISE NOTICE 'Inserção de stands CONSTRUIND 2025 concluída com sucesso!';
    RAISE NOTICE 'Total de stands inseridos: %', (SELECT COUNT(*) FROM public.stands_construind);
    RAISE NOTICE 'Categorias disponíveis: %', (SELECT COUNT(*) FROM public.categorias_stands);
END $$;