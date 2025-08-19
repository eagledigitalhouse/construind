-- Migração para criar tabela user_profiles
-- Sistema de autenticação e autorização

-- Criar tabela user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    full_name TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON public.user_profiles(is_active);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para user_profiles
-- Permitir leitura para usuários autenticados
CREATE POLICY "Allow authenticated read access" ON public.user_profiles 
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Permitir inserção para usuários autenticados (para auto-registro)
CREATE POLICY "Allow authenticated insert access" ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = id);

-- Permitir atualização apenas do próprio perfil
CREATE POLICY "Allow users to update own profile" ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Permitir que super_admins façam qualquer operação
CREATE POLICY "Allow super_admin full access" ON public.user_profiles 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND role = 'super_admin' 
            AND is_active = true
        )
    );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.user_profiles IS 'Perfis de usuários do sistema com controle de acesso';
COMMENT ON COLUMN public.user_profiles.id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN public.user_profiles.email IS 'Email do usuário';
COMMENT ON COLUMN public.user_profiles.role IS 'Papel do usuário no sistema (admin, super_admin)';
COMMENT ON COLUMN public.user_profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.user_profiles.is_active IS 'Se o usuário está ativo no sistema';