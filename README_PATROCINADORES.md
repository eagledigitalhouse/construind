# Sistema de Patrocinadores - FESPIN

## Como Popular os Dados de Exemplo

### Opção 1: Pela Interface Administrativa
1. Acesse `/admin-patrocinadores`
2. Clique no botão **"Popular Exemplos"** (azul)
3. Os dados serão carregados automaticamente no localStorage

### Opção 2: Pelo Console do Navegador
```javascript
// Importar e executar a função
import { popularPatrocinadores } from './src/utils/populatePatrocinadores';
popularPatrocinadores();
```

### Opção 3: Direto no Console (se estiver na página)
```javascript
// Abra o console do navegador (F12) e execute:
localStorage.setItem('patrocinadores', JSON.stringify([
  // Cole aqui os dados do arquivo populatePatrocinadores.ts
]));
```

## Estrutura dos Dados

### Patrocinadores Incluídos:

#### 💎 **DIAMANTE (2)**
- **Total Health** - Equipamentos Esportivos
- **Integralmédica** - Suplementação

#### 🥇 **OURO (3)**
- **Smart Fit** - Academia
- **Kikos Fitness** - Equipamentos Fitness  
- **Bio Ritmo** - Academia Premium

#### 🥈 **PRATA (4)**
- **Inove Nutrition** - Suplementação
- **OriGym** - Equipamentos Fitness
- **Selfit Academias** - Rede de Academias
- **Academia 26fit** - Academia Regional

## Gerenciamento

### Limpar Dados
- Clique no botão **"Limpar Dados"** (vermelho) na página administrativa
- Ou execute `limparPatrocinadores()` no console

### Salvar Alterações
- Sempre clique em **"Salvar Alterações"** após fazer modificações
- Os dados são salvos no localStorage do navegador

## Funcionalidades

✅ **Logos Clicáveis** - Clique nos logos para ver detalhes
✅ **Modal de Detalhes** - Informações completas da empresa
✅ **Tamanhos Diferentes** - Grande, médio e pequeno
✅ **Categorias Variadas** - Diferentes segmentos do mercado fitness
✅ **Descrições Completas** - Textos profissionais para cada empresa
✅ **Links Funcionais** - Websites fictícios para demonstração

## Arquivos Relacionados

- `src/utils/populatePatrocinadores.ts` - Utilitário com dados de exemplo
- `src/components/PatrocinadoresSection.tsx` - Componente principal
- `src/pages/AdminPatrocinadores.tsx` - Página administrativa 