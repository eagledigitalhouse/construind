# 📋 DOCUMENTAÇÃO DA ESTRUTURA DO PROJETO FESPIN

## 🎯 Visão Geral

O FESPIN é uma aplicação web desenvolvida em React + TypeScript + Vite para gerenciar uma feira de esportes e nutrição. A estrutura foi organizada seguindo princípios de arquitetura limpa e separação de responsabilidades.

## 🏗️ Arquitetura do Projeto

### Stack Tecnológica
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query + Custom Hooks
- **Routing**: React Router DOM
- **Animations**: Motion (Framer Motion)

## 📁 Estrutura de Diretórios

```
fespin/
├── 📄 Arquivos de Configuração
├── 📁 public/                 # Assets estáticos
├── 📁 src/                    # Código fonte principal
│   ├── 📁 components/         # Componentes organizados por funcionalidade
│   ├── 📁 pages/             # Páginas da aplicação
│   ├── 📁 hooks/             # Hooks customizados
│   ├── 📁 lib/               # Bibliotecas e configurações
│   ├── 📁 utils/             # Utilitários
│   └── 📁 assets/            # Assets do código
└── 📁 supabase/              # Configurações e migrações do banco
```

## 🧩 Detalhamento dos Componentes

### 📁 src/components/

Organização por funcionalidade para melhor manutenibilidade:

#### 🏠 layout/
**Propósito**: Componentes de estrutura da aplicação
- `Navbar.tsx` - Barra de navegação responsiva
- `Footer.tsx` - Rodapé com informações de contato
- `index.ts` - Exportações centralizadas

#### 📄 pages/
**Propósito**: Componentes específicos de páginas
- `MapViewer.tsx` - Visualizador interativo do mapa da feira
- `TabelaComparativa.tsx` - Tabela de comparação de cotas de patrocínio
- `index.ts` - Exportações centralizadas

#### 🎨 sections/
**Propósito**: Seções reutilizáveis das páginas
- `Hero.tsx` - Seção principal com call-to-action
- `AboutSection.tsx` - Sobre a feira
- `MarketDataSection.tsx` - Dados de mercado com gráficos
- `Features.tsx` - Características da feira
- `HumanoidSection.tsx` - Seção sobre espaços temáticos
- `SpecsSection.tsx` - Especificações técnicas
- `PatrocinadoresSection.tsx` - Exibição de patrocinadores
- `ExpositorPatrocinioSection.tsx` - CTA para expositores
- `CTASection.tsx` - Call-to-action geral
- `LocalDataSection.tsx` - Informações de local e data
- `Newsletter.tsx` - Cadastro de newsletter
- `index.ts` - Exportações centralizadas

#### 🎛️ ui/
**Propósito**: Componentes de interface reutilizáveis (shadcn/ui + customizados)
- Componentes base: `button.tsx`, `card.tsx`, `input.tsx`, etc.
- Componentes de formulário: `form.tsx`, `select.tsx`, `checkbox.tsx`
- Componentes de navegação: `dialog.tsx`, `dropdown-menu.tsx`, `tabs.tsx`
- Componentes customizados: `shimmer-button.tsx`, `glass-chip.tsx`, `animated-beam.tsx`
- `index.ts` - Exportações centralizadas de todos os componentes UI

## 📄 Páginas da Aplicação

### 📁 src/pages/

- `Index.tsx` - **Página inicial** com todas as seções principais
- `PatrocinioPage.tsx` - **Página de patrocínio** com cotas e benefícios
- `ExpositorPage.tsx` - **Página do expositor** com informações para expositores
- `ExpositoresPage.tsx` - **Lista de expositores** com filtros e busca
- `AdminDashboard.tsx` - **Dashboard administrativo** com estatísticas
- `AdminExpositores.tsx` - **Gerenciamento de expositores** (CRUD)
- `AdminPatrocinadores.tsx` - **Gerenciamento de patrocinadores** (CRUD + Drag & Drop)
- `NotFound.tsx` - **Página 404** para rotas não encontradas

## 🎣 Hooks Customizados

### 📁 src/hooks/

- `useExpositores.ts` - **Gerencia estado dos expositores** (CRUD operations)
- `usePatrocinadores.ts` - **Gerencia estado dos patrocinadores** (CRUD + reordenação)
- `useCotasPatrocinio.ts` - **Gerencia cotas de patrocínio** (CRUD + ordenação)
- `use-mobile.tsx` - **Detecta dispositivos móveis** (responsividade)
- `use-toast.ts` - **Sistema de notificações** toast
- `index.ts` - **Exportações centralizadas** de todos os hooks

## 📚 Bibliotecas e Utilitários

### 📁 src/lib/

- `supabase.ts` - **Cliente Supabase** configurado com variáveis de ambiente
- `uploadImage.ts` - **Utilitário para upload** de imagens no Supabase Storage
- `utils.ts` - **Utilitários gerais** (cn, formatação, etc.)

### 📁 src/utils/

- `populatePatrocinadores.ts` - **Dados de exemplo** para desenvolvimento

## 🗄️ Banco de Dados (Supabase)

### 📁 supabase/

#### Tabelas Principais:
1. **expositores** - Dados dos expositores da feira
2. **patrocinadores** - Dados dos patrocinadores
3. **cotas_patrocinio** - Tipos de cotas de patrocínio

#### Migrações:
- `20250716213246_adicionar_coluna_posicao.sql` - Adiciona ordenação aos patrocinadores

## 🎨 Assets e Recursos

### 📁 public/
- **Imagens**: Logo, hero, mapas, placeholders
- **Fontes**: Brockmann Medium (OTF + WOFF)
- **Animações**: Lottie files, WebM videos
- **Uploads**: Imagens de categorias (academia, artigos esportivos, etc.)

### 📁 src/assets/
- **Imagens específicas** do código fonte
- **Apresentações** e materiais promocionais

## ⚙️ Configurações

### Arquivos de Configuração:
- `vite.config.ts` - Configuração do Vite (aliases, plugins)
- `tailwind.config.ts` - Configuração do Tailwind CSS
- `tsconfig.json` - Configuração do TypeScript
- `components.json` - Configuração do shadcn/ui
- `.env` - Variáveis de ambiente (Supabase)

## 🚀 Scripts Disponíveis

```json
{
  "dev": "vite",                    // Servidor de desenvolvimento
  "build": "vite build",           // Build de produção
  "build:dev": "vite build --mode development", // Build de desenvolvimento
  "lint": "eslint .",              // Linting do código
  "preview": "vite preview"        // Preview do build
}
```

## 🔧 Funcionalidades Principais

### 👥 Gestão de Expositores
- ✅ CRUD completo
- ✅ Upload de imagens
- ✅ Filtros e busca
- ✅ Visualização em grid/lista

### 💰 Gestão de Patrocinadores
- ✅ CRUD completo
- ✅ Drag & Drop para reordenação
- ✅ Categorização por cotas
- ✅ Upload de logos

### 🗺️ Mapa Interativo
- ✅ Zoom e pan
- ✅ Marcadores de stands
- ✅ Informações detalhadas

### 📊 Dashboard Administrativo
- ✅ Estatísticas em tempo real
- ✅ Gráficos e métricas
- ✅ Navegação rápida

## 🎯 Padrões de Desenvolvimento

### 📝 Convenções de Nomenclatura
- **Componentes**: PascalCase (`ComponentName.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useCustomHook.ts`)
- **Utilitários**: camelCase (`utilityFunction.ts`)
- **Constantes**: UPPER_SNAKE_CASE

### 🏗️ Estrutura de Componentes
```typescript
// Imports
import React from 'react';
import { ComponentProps } from './types';

// Interface/Types
interface ComponentProps {
  // props definition
}

// Component
export const Component: React.FC<ComponentProps> = ({ props }) => {
  // hooks
  // handlers
  // render
  return (
    <div className="component-styles">
      {/* JSX */}
    </div>
  );
};
```

### 🎨 Padrões de Estilo
- **Tailwind CSS** para estilização
- **Componentes shadcn/ui** como base
- **Responsividade** mobile-first
- **Animações** com Motion

## 🔒 Segurança

### 🛡️ Autenticação
- Supabase Auth para autenticação
- RLS (Row Level Security) no banco
- Proteção de rotas administrativas

### 🔐 Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📈 Performance

### ⚡ Otimizações
- **Code Splitting** automático do Vite
- **Lazy Loading** de componentes
- **React Query** para cache de dados
- **Imagens otimizadas** (WebP)

## 🧪 Desenvolvimento

### 🚀 Como Executar
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 🔧 Ferramentas de Desenvolvimento
- **ESLint** para linting
- **TypeScript** para tipagem
- **Vite** para build rápido
- **React DevTools** para debug

## 📋 Próximos Passos

### 🎯 Melhorias Planejadas
- [ ] Testes unitários (Jest + Testing Library)
- [ ] Testes E2E (Playwright)
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Analytics e métricas

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Desenvolvido por**: Equipe FESPIN