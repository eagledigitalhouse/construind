-- Migração para corrigir a estrutura da tabela pre_inscricao_expositores
-- para corresponder aos dados reais enviados pelo formulário - CONSTRUIND

-- Primeiro, vamos dropar a tabela atual e recriar com a estrutura correta
DROP TABLE IF EXISTS public.pre_inscricao_expositores CASCADE;

-- Criar tabela pre_inscricao_expositores com estrutura completa
CREATE TABLE public.pre_inscricao_expositores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Tipo de Pessoa
    tipo_pessoa TEXT CHECK (tipo_pessoa IN ('fisica', 'juridica')),
    
    -- Pessoa Física
    nome_pf TEXT,
    sobrenome_pf TEXT,
    cpf TEXT,
    email_pf TEXT,
    telefone_pf TEXT,
    cep_pf TEXT,
    logradouro_pf TEXT,
    numero_pf TEXT,
    complemento_pf TEXT,
    bairro_pf TEXT,
    cidade_pf TEXT,
    estado_pf TEXT,
    
    -- Pessoa Jurídica
    razao_social TEXT,
    nome_social TEXT,
    cnpj TEXT,
    cep TEXT,
    logradouro TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    telefone_empresa TEXT,
    email_empresa TEXT,
    
    -- Responsável Legal
    nome_responsavel TEXT,
    sobrenome_responsavel TEXT,
    email_responsavel TEXT,
    contato_responsavel TEXT,
    is_whatsapp BOOLEAN DEFAULT false,
    
    -- Responsável pelo Stand
    nome_responsavel_stand TEXT,
    sobrenome_responsavel_stand TEXT,
    email_responsavel_stand TEXT,
    
    -- Serviços
    numero_stand TEXT,
    deseja_patrocinio BOOLEAN DEFAULT false,
    categoria_patrocinio TEXT,
    condicao_pagamento TEXT,
    forma_pagamento TEXT,
    
    -- Informações Adicionais
    observacoes TEXT,
    
    -- Dados de controle
    ip_address TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'contrato_enviado', 'contrato_assinado')),
    is_temporary BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_pre_inscricao_status ON public.pre_inscricao_expositores(status);
CREATE INDEX idx_pre_inscricao_numero_stand ON public.pre_inscricao_expositores(numero_stand);
CREATE INDEX idx_pre_inscricao_tipo_pessoa ON public.pre_inscricao_expositores(tipo_pessoa);
CREATE INDEX idx_pre_inscricao_created_at ON public.pre_inscricao_expositores(created_at);

-- Habilitar RLS
ALTER TABLE public.pre_inscricao_expositores ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Allow public insert access pre_inscricao" ON public.pre_inscricao_expositores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access pre_inscricao" ON public.pre_inscricao_expositores FOR SELECT USING (true);
CREATE POLICY "Allow public update access pre_inscricao" ON public.pre_inscricao_expositores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access pre_inscricao" ON public.pre_inscricao_expositores FOR DELETE USING (true);

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
CREATE INDEX IF NOT EXISTS idx_stands_numero ON public.stands_construind(numero_stand);
CREATE INDEX IF NOT EXISTS idx_stands_status ON public.stands_construind(status);
CREATE INDEX IF NOT EXISTS idx_stands_categoria ON public.stands_construind(categoria);

-- Habilitar RLS para stands_construind
ALTER TABLE public.stands_construind ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para stands_construind
DROP POLICY IF EXISTS "Allow public read access stands" ON public.stands_construind;
DROP POLICY IF EXISTS "Allow public update access stands" ON public.stands_construind;
DROP POLICY IF EXISTS "Allow public insert access stands" ON public.stands_construind;
DROP POLICY IF EXISTS "Allow public delete access stands" ON public.stands_construind;

CREATE POLICY "Allow public read access stands" ON public.stands_construind FOR SELECT USING (true);
CREATE POLICY "Allow public update access stands" ON public.stands_construind FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access stands" ON public.stands_construind FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access stands" ON public.stands_construind FOR DELETE USING (true);

-- Criar tabela categorias_stands se não existir
CREATE TABLE IF NOT EXISTS public.categorias_stands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT UNIQUE NOT NULL,
    cor TEXT DEFAULT '#10B981',
    preco_base DECIMAL(10,2),
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para categorias_stands
CREATE INDEX IF NOT EXISTS idx_categorias_stands_nome ON public.categorias_stands(nome);
CREATE INDEX IF NOT EXISTS idx_categorias_stands_ativo ON public.categorias_stands(ativo);

-- Habilitar RLS para categorias_stands
ALTER TABLE public.categorias_stands ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para categorias_stands
DROP POLICY IF EXISTS "Allow public read access categorias_stands" ON public.categorias_stands;
DROP POLICY IF EXISTS "Allow public update access categorias_stands" ON public.categorias_stands;
DROP POLICY IF EXISTS "Allow public insert access categorias_stands" ON public.categorias_stands;
DROP POLICY IF EXISTS "Allow public delete access categorias_stands" ON public.categorias_stands;

CREATE POLICY "Allow public read access categorias_stands" ON public.categorias_stands FOR SELECT USING (true);
CREATE POLICY "Allow public update access categorias_stands" ON public.categorias_stands FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access categorias_stands" ON public.categorias_stands FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access categorias_stands" ON public.categorias_stands FOR DELETE USING (true);

-- Inserir algumas categorias padrão se a tabela estiver vazia
INSERT INTO public.categorias_stands (nome, cor, preco_base, descricao, ordem) 
VALUES 
    ('Padrão', '#10B981', 500.00, 'Stand padrão 3x3m', 1),
    ('Premium', '#F59E0B', 800.00, 'Stand premium 4x4m', 2),
    ('VIP', '#EF4444', 1200.00, 'Stand VIP 5x5m', 3)
ON CONFLICT (nome) DO NOTHING;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_pre_inscricao_updated_at ON public.pre_inscricao_expositores;
CREATE TRIGGER update_pre_inscricao_updated_at 
    BEFORE UPDATE ON public.pre_inscricao_expositores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stands_updated_at ON public.stands_construind;
CREATE TRIGGER update_stands_updated_at 
    BEFORE UPDATE ON public.stands_construind 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categorias_stands_updated_at ON public.categorias_stands;
CREATE TRIGGER update_categorias_stands_updated_at 
    BEFORE UPDATE ON public.categorias_stands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();