-- Criar tabela payment_conditions
CREATE TABLE IF NOT EXISTS public.payment_conditions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    value text NOT NULL UNIQUE,
    label text NOT NULL,
    description text,
    highlight boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Inserir dados iniciais
INSERT INTO public.payment_conditions (value, label, description, highlight)
VALUES
    ('a_vista_desconto', 'À vista com 5% desconto', 'Pagamento até 30/08/2025 com desconto de 5%', true),
    ('sinal_3_parcelas', '20% sinal + 2 parcelas', '20% na assinatura + parcelas setembro e outubro', false)
ON CONFLICT (value) DO NOTHING;

-- Verificar se foi criada corretamente
SELECT * FROM public.payment_conditions;
