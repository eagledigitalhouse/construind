-- Tabela para armazenar as configurações do formulário
CREATE TABLE public.form_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS (Row Level Security) para a tabela form_configs
ALTER TABLE public.form_configs ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para form_configs
CREATE POLICY "Allow public read access" ON public.form_configs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.form_configs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.form_configs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.form_configs FOR DELETE USING (true);

-- Tabela pre_inscricao_expositores
CREATE TABLE public.pre_inscricao_expositores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_empresa TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    cnpj TEXT,
    endereco TEXT,
    segmento TEXT,
    area_interesse TEXT,
    mensagem TEXT,
    status TEXT DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para pre_inscricao_expositores
ALTER TABLE public.pre_inscricao_expositores ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para pre_inscricao_expositores
CREATE POLICY "Allow public insert access pre_inscricao" ON public.pre_inscricao_expositores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access pre_inscricao" ON public.pre_inscricao_expositores FOR SELECT USING (true);
CREATE POLICY "Allow public update access pre_inscricao" ON public.pre_inscricao_expositores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access pre_inscricao" ON public.pre_inscricao_expositores FOR DELETE USING (true);