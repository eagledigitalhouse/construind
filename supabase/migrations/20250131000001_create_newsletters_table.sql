- Criar tabela newsletters que está sendo referenciada no código
-- mas não existe no banco de dados

CREATE TABLE IF NOT EXISTS public.newsletters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'cancelado')),
    origem VARCHAR(100), -- site, evento, manual, etc
    data_confirmacao TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at);

-- Desabilitar RLS para desenvolvimento
ALTER TABLE newsletters DISABLE ROW LEVEL SECURITY;

-- Inserir alguns dados de exemplo para teste
INSERT INTO newsletters (email, nome, status) VALUES 
('teste@example.com', 'Usuário Teste', 'ativo')
ON CONFLICT (email) DO NOTHING;

-- Comentário na tabela
COMMENT ON TABLE newsletters IS 'Tabela para armazenar inscrições na newsletter';
COMMENT ON COLUMN newsletters.email IS 'Email do inscrito (único)';
COMMENT ON COLUMN newsletters.nome IS 'Nome do inscrito (opcional)';
COMMENT ON COLUMN newsletters.status IS 'Status da inscrição: ativo, inativo, cancelado';
COMMENT ON COLUMN newsletters.origem IS 'Origem da inscrição: site, evento, manual, etc';