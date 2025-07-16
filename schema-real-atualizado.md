# Schema Real da Aplicação FESPIN

## Configuração Supabase
- **URL**: https://sidxstsemgbfkfsedbhv.supabase.co
- **Projeto**: sidxstsemgbfkfsedbhv
- **Gerado em**: 16/07/2025, 18:40:24

### Tabela: `patrocinadores`

**Colunas encontradas:**
- `id`: UUID
- `nome`: VARCHAR/TEXT
- `logo`: VARCHAR/TEXT
- `website`: VARCHAR/TEXT
- `categoria`: nullable
- `tamanho_logo`: VARCHAR/TEXT
- `descricao`: VARCHAR/TEXT
- `created_at`: VARCHAR/TEXT
- `updated_at`: VARCHAR/TEXT
- `categoria_id`: UUID
- `posicao`: INTEGER

**Total de registros**: 11

**Exemplos de dados:**
```json
[
  {
    "id": "e371397e-8e6e-4357-bb90-ad4759403ba1",
    "nome": "Nike",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    "website": "https://www.nike.com.br",
    "categoria": null,
    "tamanho_logo": "grande",
    "descricao": "Líder mundial em equipamentos esportivos e calçados. Fornecemos soluções completas para atletas profissionais e amadores.",
    "created_at": "2025-07-16T20:24:36.775885+00:00",
    "updated_at": "2025-07-16T21:03:43.604935+00:00",
    "categoria_id": "dc741172-53cc-4179-b40b-cc997956e0de",
    "posicao": 1
  },
  {
    "id": "82f8464d-13f0-478a-a25f-dd5279a5a510",
    "nome": "Adidas",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    "website": "https://www.adidas.com.br",
    "categoria": null,
    "tamanho_logo": "grande",
    "descricao": "Marca premium de equipamentos esportivos com certificação internacional e presença global.",
    "created_at": "2025-07-16T20:24:36.775885+00:00",
    "updated_at": "2025-07-16T21:03:43.604935+00:00",
    "categoria_id": "dc741172-53cc-4179-b40b-cc997956e0de",
    "posicao": 2
  },
  {
    "id": "1d7924dc-deab-476d-81e1-a0c453648250",
    "nome": "Puma",
    "logo": "https://upload.wikimedia.org/wikipedia/en/4/49/Puma_logo.svg",
    "website": "https://www.puma.com",
    "categoria": null,
    "tamanho_logo": "medio",
    "descricao": "Marca alemã de equipamentos esportivos focada em performance e estilo para diversos esportes.",
    "created_at": "2025-07-16T20:24:36.775885+00:00",
    "updated_at": "2025-07-16T21:03:43.604935+00:00",
    "categoria_id": "cca4dafc-f325-4b08-8347-b5fe8812de2d",
    "posicao": 3
  }
]
```

### Tabela: `expositores`

*Tabela vazia - não foi possível determinar estrutura*
### Tabela: `categorias`

**Colunas encontradas:**
- `id`: UUID
- `nome`: VARCHAR/TEXT
- `cor`: VARCHAR/TEXT
- `icone`: VARCHAR/TEXT
- `tipo`: VARCHAR/TEXT
- `created_at`: VARCHAR/TEXT
- `updated_at`: nullable
- `ordem`: INTEGER

**Total de registros**: 4

**Exemplos de dados:**
```json
[
  {
    "id": "dc741172-53cc-4179-b40b-cc997956e0de",
    "nome": "Ouro",
    "cor": "#FFD700",
    "icone": "Star",
    "tipo": "patrocinador",
    "created_at": "2025-07-16T20:24:36.775885+00:00",
    "updated_at": null,
    "ordem": 0
  },
  {
    "id": "cca4dafc-f325-4b08-8347-b5fe8812de2d",
    "nome": "Prata",
    "cor": "#C0C0C0",
    "icone": "Award",
    "tipo": "patrocinador",
    "created_at": "2025-07-16T20:24:36.775885+00:00",
    "updated_at": null,
    "ordem": 0
  },
  {
    "id": "7f8930f4-cd9e-4450-8ff3-94518f30e6fc",
    "nome": "Bronze",
    "cor": "#CD7F32",
    "icone": "Medal",
    "tipo": "patrocinador",
    "created_at": "2025-07-16T20:24:36.775885+00:00",
    "updated_at": null,
    "ordem": 0
  }
]
```

## Relacionamentos Identificados

- `patrocinadores.categoria_id` → `categorias.id`

## Índices Conhecidos

- `idx_patrocinadores_posicao` em `patrocinadores(posicao)`
- `idx_patrocinadores_categoria` em `patrocinadores(categoria_id)`
- `idx_categorias_tipo` em `categorias(tipo)`
- `idx_categorias_ordem` em `categorias(ordem)`

