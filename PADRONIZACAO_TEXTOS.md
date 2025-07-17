# Plano de Padronização de Textos - FESPIN

## Problemas Identificados

Após análise completa da aplicação, foram encontradas inconsistências significativas nos tamanhos de texto:

### Títulos Principais (H1/H2)
- `text-2xl md:text-3xl lg:text-4xl` (AdminExpositores)
- `text-3xl font-bold` (AdminDashboard)
- `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` (Seções padronizadas)
- `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` (PatrocinioPage)
- `text-5xl sm:text-6xl md:text-7xl` (ExpositorPage, PatrocinioPage)

### Subtítulos (H3/H4)
- `text-lg` (vários componentes)
- `text-xl` (AdminExpositores, ExpositorPage)
- `text-2xl` (AdminPatrocinadores, ExpositorPage)
- `text-3xl` (PatrocinioPage)

### Textos Descritivos
- `text-xs` (labels, badges, informações secundárias)
- `text-sm` (formulários, cards, botões)
- `text-base` (textos padrão)
- `text-lg` (descrições importantes)
- `text-xl` (descrições destacadas)

## Proposta de Padronização

### 1. Sistema de Hierarquia de Textos

#### Títulos Principais (Hero/Seções)
```css
.title-hero: text-4xl sm:text-5xl md:text-6xl lg:text-7xl
.title-section: text-3xl sm:text-4xl md:text-5xl lg:text-6xl
.title-page: text-2xl sm:text-3xl md:text-4xl lg:text-5xl
```

#### Subtítulos
```css
.subtitle-large: text-xl sm:text-2xl md:text-3xl
.subtitle-medium: text-lg sm:text-xl md:text-2xl
.subtitle-small: text-base sm:text-lg md:text-xl
```

#### Textos Corporais
```css
.text-lead: text-lg md:text-xl (descrições importantes)
.text-body: text-base md:text-lg (texto padrão)
.text-small: text-sm md:text-base (textos secundários)
.text-caption: text-xs sm:text-sm (legendas, labels)
```

#### Textos Especiais
```css
.text-button: text-sm md:text-base (botões)
.text-badge: text-xs (badges, chips)
.text-stat: text-2xl sm:text-3xl md:text-4xl (estatísticas)
```

### 2. Espaçamentos Padronizados

```css
.spacing-title: mb-3 (títulos principais)
.spacing-subtitle: mb-4 (subtítulos)
.spacing-text: mb-6 (textos corporais)
.spacing-section: py-12 md:py-16 (seções)
```

### 3. Line Heights Consistentes

```css
.leading-hero: leading-[0.9] (títulos hero)
.leading-title: leading-none (títulos seção)
.leading-subtitle: leading-tight (subtítulos)
.leading-body: leading-relaxed (textos corporais)
```

## Implementação

### Fase 1: Atualizar index.css
- Criar classes utilitárias padronizadas
- Definir hierarquia clara de textos
- Estabelecer espaçamentos consistentes

### Fase 2: Atualizar Componentes Principais
- Seções da homepage
- Páginas de Expositor e Patrocínio
- Componentes de UI

### Fase 3: Atualizar Páginas Administrativas
- AdminDashboard
- AdminExpositores
- AdminPatrocinadores

### Fase 4: Componentes de UI
- Formulários
- Cards
- Botões
- Navegação

## Benefícios da Padronização

1. **Consistência Visual**: Experiência uniforme em toda aplicação
2. **Manutenibilidade**: Mudanças centralizadas no CSS
3. **Performance**: Menos classes CSS duplicadas
4. **Acessibilidade**: Hierarquia clara para leitores de tela
5. **Responsividade**: Comportamento previsível em todos dispositivos

## Próximos Passos

1. Implementar classes utilitárias no index.css
2. Migrar componentes gradualmente
3. Testar responsividade
4. Validar acessibilidade
5. Documentar padrões para equipe