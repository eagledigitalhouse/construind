-- Migração para renomear tabela stands_fespin para stands_construind
-- Projeto CONSTRUIND

-- Renomear tabela stands_fespin para stands_construind se existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stands_fespin') THEN
        ALTER TABLE public.stands_fespin RENAME TO stands_construind;
        
        -- Renomear índices
        ALTER INDEX IF EXISTS idx_stands_numero RENAME TO idx_stands_construind_numero;
        ALTER INDEX IF EXISTS idx_stands_status RENAME TO idx_stands_construind_status;
        ALTER INDEX IF EXISTS idx_stands_categoria RENAME TO idx_stands_construind_categoria;
        
        -- Renomear trigger
        DROP TRIGGER IF EXISTS update_stands_updated_at ON public.stands_construind;
        CREATE TRIGGER update_stands_construind_updated_at 
            BEFORE UPDATE ON public.stands_construind 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
        -- Recriar políticas de segurança com novos nomes
        DROP POLICY IF EXISTS "Allow public read access stands" ON public.stands_construind;
        DROP POLICY IF EXISTS "Allow public update access stands" ON public.stands_construind;
        DROP POLICY IF EXISTS "Allow public insert access stands" ON public.stands_construind;
        DROP POLICY IF EXISTS "Allow public delete access stands" ON public.stands_construind;
        
        CREATE POLICY "Allow public read access stands construind" ON public.stands_construind FOR SELECT USING (true);
        CREATE POLICY "Allow public update access stands construind" ON public.stands_construind FOR UPDATE USING (true);
        CREATE POLICY "Allow public insert access stands construind" ON public.stands_construind FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow public delete access stands construind" ON public.stands_construind FOR DELETE USING (true);
        
        RAISE NOTICE 'Tabela stands_fespin renomeada para stands_construind com sucesso';
    ELSE
        RAISE NOTICE 'Tabela stands_fespin não encontrada, criando stands_construind';
        
        -- Criar tabela stands_construind se não existir
        CREATE TABLE IF NOT EXISTS public.stands_construind (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            numero_stand TEXT UNIQUE NOT NULL,
            categoria TEXT,
            preco DECIMAL(10,2),
            status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'ocupado', 'manutencao')),
            reservado_por TEXT,
            data_reserva TIMESTAMP WITH TIME ZONE,
            observacoes TEXT,
            posicao_x INTEGER,
            posicao_y INTEGER,
            largura INTEGER,
            altura INTEGER,
            cor TEXT DEFAULT '#10B981',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Índices para stands_construind
        CREATE INDEX IF NOT EXISTS idx_stands_construind_numero ON public.stands_construind(numero_stand);
        CREATE INDEX IF NOT EXISTS idx_stands_construind_status ON public.stands_construind(status);
        CREATE INDEX IF NOT EXISTS idx_stands_construind_categoria ON public.stands_construind(categoria);
        
        -- Habilitar RLS para stands_construind
        ALTER TABLE public.stands_construind ENABLE ROW LEVEL SECURITY;
        
        -- Políticas de segurança para stands_construind
        CREATE POLICY "Allow public read access stands construind" ON public.stands_construind FOR SELECT USING (true);
        CREATE POLICY "Allow public update access stands construind" ON public.stands_construind FOR UPDATE USING (true);
        CREATE POLICY "Allow public insert access stands construind" ON public.stands_construind FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow public delete access stands construind" ON public.stands_construind FOR DELETE USING (true);
        
        -- Trigger para atualizar updated_at
        CREATE TRIGGER update_stands_construind_updated_at 
            BEFORE UPDATE ON public.stands_construind 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;