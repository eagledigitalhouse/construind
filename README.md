# CONSTRUIND 2025 - Sistema de Pré-Inscrição

Sistema web para gerenciamento de pré-inscrições de expositores do evento CONSTRUIND 2025.

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Projeto Supabase configurado
- Token da API ZapSign (opcional, para funcionalidades de assinatura)

### Passos para Deploy

1. **Fork/Clone do Repositório**
   ```bash
   git clone <seu-repositorio>
   cd fespin
   ```

2. **Configurar Variáveis de Ambiente**
   
   No painel da Vercel, configure as seguintes variáveis:
   
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
   ZAPSIGN_API_TOKEN=seu_token_zapsign (opcional)
   ```

3. **Deploy Automático**
   - Conecte seu repositório GitHub à Vercel
   - A Vercel detectará automaticamente as configurações do Vite
   - O deploy será feito automaticamente a cada push

### Configurações do Projeto

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI + shadcn/ui

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

### Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── lib/           # Utilitários e configurações
├── contexts/      # Contextos React
├── hooks/         # Hooks customizados
└── types/         # Definições de tipos
```

### Funcionalidades

- ✅ Formulário de pré-inscrição de expositores
- ✅ Sistema de autenticação admin
- ✅ Dashboard administrativo
- ✅ Gerenciamento de stands
- ✅ Geração de PDFs
- ✅ Interface responsiva
- ✅ Tema escuro/claro

### Suporte

Para dúvidas ou problemas, consulte a documentação do Supabase e Vercel.