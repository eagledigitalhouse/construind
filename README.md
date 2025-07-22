# 🏥 FESPIN - Sistema de Gestão de Feira de Saúde

Uma aplicação web moderna para gestão completa da FESPIN (Feira de Saúde e Prevenção), incluindo sistema de patrocinadores, expositores, newsletter e área administrativa.

## 🚀 **Deploy em Produção - PRONTO!**

Esta aplicação está **100% otimizada** e pronta para deploy em produção.

### **📊 Performance:**
- Bundle otimizado: ~580KB gzipped
- Code splitting implementado
- Cache strategy configurada
- Lighthouse score estimado: 85-90

## ⚡ **Quick Start**

### 1. **Configurar Variáveis de Ambiente**
```bash
# Copiar template
cp .env.example .env

# Editar com suas credenciais do Supabase
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

⚠️ **IMPORTANTE:** O arquivo `.env` está no `.gitignore` e **NUNCA** deve ser commitado!

### 2. **Instalação e Desenvolvimento**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔧 **Deploy**

### **Vercel (Recomendado)**
```bash
# Via CLI
npm install -g vercel
vercel --prod

# Ou conecte seu repositório GitHub no dashboard do Vercel
```

### **Variáveis de Ambiente (Vercel)**
Configure no dashboard do Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🗄️ **Banco de Dados (Supabase)**

### **Configuração Inicial:**
1. Criar projeto no Supabase
2. Executar migrations SQL (ver `DEPLOY.md`)
3. Configurar RLS (Row Level Security)
4. Configurar Authentication URLs

## 🎯 **Funcionalidades**

### **Área Pública:**
- ✅ Página inicial com patrocinadores
- ✅ Formulário de newsletter
- ✅ Formulário de pré-inscrição de expositores
- ✅ Páginas informativas sobre o evento

### **Área Administrativa (Login obrigatório):**
- ✅ Dashboard com estatísticas
- ✅ Gestão de patrocinadores
- ✅ Gestão de expositores
- ✅ Gestão de newsletter
- ✅ Controle de stands
- ✅ Sistema de pré-inscrições

## 📁 **Estrutura do Projeto**

```
src/
├── components/           # Componentes reutilizáveis
│   ├── sections/        # Seções da página inicial
│   ├── ui/              # Componentes de interface
│   └── auth/            # Componentes de autenticação
├── pages/               # Páginas da aplicação
│   ├── admin/          # Páginas administrativas
│   └── ...
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── contexts/            # Contextos React
└── types/               # Definições de tipos TypeScript
```

## 🔒 **Segurança**

### **Implementado:**
- ✅ Row Level Security (RLS) no Supabase
- ✅ Autenticação JWT
- ✅ Políticas de acesso granulares
- ✅ Variáveis de ambiente protegidas
- ✅ Validação de formulários com Zod

### **Níveis de Acesso:**
- **Público:** Visualização de patrocinadores, cadastro newsletter
- **Admin:** Acesso completo ao sistema de gestão

## 🎨 **Tecnologias**

### **Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Radix UI (componentes)
- React Hook Form + Zod
- Framer Motion (animações)

### **Backend:**
- Supabase (Database + Auth + Storage)
- PostgreSQL
- Row Level Security (RLS)

### **Deploy:**
- Vercel (recomendado)
- CDN global
- Cache otimizado

## 📋 **Scripts Disponíveis**

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run lint:fix     # Corrigir erros automáticos
npm run type-check   # Verificar tipos TypeScript
```

## 📈 **Monitoramento**

### **Recomendações:**
- Vercel Analytics
- Supabase Logs
- Core Web Vitals
- Error tracking (Sentry)

## 🐛 **Troubleshooting**

### **Erro de conexão com Supabase:**
1. Verificar URLs no `.env`
2. Confirmar RLS configurado
3. Verificar políticas de acesso

### **Build falhando:**
1. `npm install --legacy-peer-deps`
2. `npm run type-check`
3. Verificar imports não utilizados

### **404 em rotas:**
- Vercel.json configurado com rewrites
- Todas as rotas redirecionam para index.html

## 📞 **Suporte**

Para questões técnicas:
1. Verificar `DEPLOY.md` para guia completo
2. Consultar `BUILD_SUCCESS.md` para relatório detalhado
3. Verificar logs do Vercel/Supabase

## 📄 **Licença**

Este projeto é desenvolvido para a FESPIN - Feira de Saúde e Prevenção.

---

**🎉 Aplicação pronta para produção! Deploy com confiança!**

---
*Última atualização: 22/01/2025 - Deploy automático ativo* 