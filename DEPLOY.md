# 🚀 Guia de Deploy - FESPIN

## 📋 Pré-requisitos

### 1. Configurar Supabase
- ✅ Projeto criado no Supabase
- ✅ Banco de dados configurado com as tabelas necessárias
- ✅ RLS (Row Level Security) configurado

### 2. Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

## 🔧 Deploy no Vercel

### Opção 1: Via Dashboard Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático! 🎉

### Opção 2: Via CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Build local (opcional para testar)
npm run build

# Deploy
vercel

# Deploy com domínio customizado
vercel --prod
```

## 🗄️ Configuração do Banco (Supabase)

### 1. Executar Scripts SQL
Execute os scripts na seguinte ordem no SQL Editor do Supabase:

1. **Criar tabelas básicas** (se não existirem)
2. **Configurar RLS** - Use o script que criamos anteriormente
3. **Criar usuário admin** (opcional)

### 2. Configurar Authentication
No painel do Supabase:
- **Site URL**: `https://seu-dominio.vercel.app`
- **Redirect URLs**: `https://seu-dominio.vercel.app/admin/dashboard`

### 3. Configurar Storage (se usar upload de imagens)
- Criar bucket público para logos
- Configurar políticas de upload

## ⚡ Otimizações Implementadas

### Build Otimizado
- ✅ **Minificação**: Terser para JS/CSS
- ✅ **Code Splitting**: Chunks separados por biblioteca
- ✅ **Tree Shaking**: Remoção de código não usado
- ✅ **Assets Inlining**: Pequenos assets incorporados

### Cache Strategy
- ✅ **Assets**: Cache de 1 ano (immutable)
- ✅ **Imagens**: Cache de 24 horas
- ✅ **HTML**: Sem cache (sempre fresh)

### Chunks de Vendor
- `react-vendor`: React, React DOM, React Router
- `ui-vendor`: Componentes Radix UI
- `supabase-vendor`: Cliente Supabase
- `animation-vendor`: Framer Motion, GSAP, AOS

## 📊 Performance Esperada

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

### Bundle Size
- **Inicial**: ~150kb gzipped
- **Vendor React**: ~45kb
- **Vendor UI**: ~35kb
- **App Code**: ~70kb

## 🔍 Verificações Pós-Deploy

### ✅ Checklist de Funcionalidades
- [ ] Página inicial carrega com patrocinadores
- [ ] Formulário de newsletter funciona (público)
- [ ] Formulário de pré-inscrição funciona (público)
- [ ] Login administrativo funciona
- [ ] Dashboard admin carrega dados
- [ ] CRUD de patrocinadores funciona
- [ ] CRUD de expositores funciona
- [ ] CRUD de newsletter funciona

### 🐛 Troubleshooting

#### Erro: Supabase Connection
```
Verifique:
1. URLs e chaves no .env estão corretas
2. RLS está configurado nas tabelas
3. Políticas de acesso estão ativas
```

#### Erro: Build Failed
```
Soluções:
1. npm install --legacy-peer-deps
2. npm run type-check
3. Verificar imports não utilizados
```

#### Erro: 404 em rotas
```
Vercel.json configurado com rewrites
Todas as rotas redirecionam para index.html
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint e correções
npm run lint
npm run lint:fix

# Verificação de tipos
npm run type-check
```

## 🔒 Segurança

### Variáveis Sensíveis
- ⚠️ **NUNCA** commite arquivos `.env`
- ✅ Use apenas `VITE_` prefix para variáveis públicas
- ✅ Chaves privadas apenas no servidor Supabase

### RLS Policies
- ✅ Leitura pública: `patrocinadores`, `categorias`, `expositores`
- ✅ Admin apenas: `newsletters`, `user_profiles`
- ✅ Inserção pública: `newsletters` (cadastro)

## 📈 Monitoring

### Recomendações
- Use Vercel Analytics
- Configure Supabase Logs
- Monitor Core Web Vitals
- Setup Error Tracking (Sentry)

---

**Deploy pronto! 🎉 Sua aplicação FESPIN está online e otimizada!** 