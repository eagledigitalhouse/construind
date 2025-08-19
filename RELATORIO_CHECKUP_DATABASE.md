# 📊 RELATÓRIO DE CHECKUP DO BANCO DE DADOS - CONSTRUIND

**Data:** $(Get-Date -Format "dd/MM/yyyy HH:mm")
**Executado por:** Script automatizado de verificação

---

## 🎯 RESUMO EXECUTIVO

### ✅ **SITUAÇÃO ATUAL CONFIRMADA:**
- ❌ **Tabela `entities` (do template EventAll): NÃO EXISTE**
- ✅ **Tabela `entidades` (customizada para CONSTRUIND): EXISTE e ATIVA**
- ✅ **Tabela `pre_inscricao_expositores`: EXISTE com 2 registros**
- ✅ **Sistema de stands: ATIVO com 81 stands configurados**

---

## 📋 DETALHAMENTO DAS TABELAS PRINCIPAIS

### 1. 🚫 TABELA `entities` (Template EventAll)
**Status:** ❌ NÃO EXISTE
**Erro:** `relation "public.entities" does not exist`

**Implicações:**
- O código do template EventAll que referencia `entities` não funcionará
- Necessário usar a tabela `entidades` customizada
- Arquivos como `template eventall/client/src/pages/entities.tsx` precisam ser adaptados

### 2. ✅ TABELA `entidades` (Customizada CONSTRUIND)
**Status:** ✅ ATIVA
**Registros:** 2 entidades cadastradas

#### 🏗️ Estrutura Completa:
```
- id (UUID)
- created_at (timestamp)
- updated_at (timestamp)
- nome (varchar)
- tipo (varchar) - pessoa_fisica | pessoa_juridica
- categoria (varchar)
- status (varchar) - ativo | inativo
- dados_pessoa_fisica (JSONB)
- dados_pessoa_juridica (JSONB)
- contatos (JSONB)
- enderecos (JSONB)
- dados_financeiros (JSONB)
- tags (array)
- subcategoria (varchar)
- observacoes (text)
- notas_internas (text)
- empresa_vinculada (varchar)
- pessoas_contato (JSONB array)
- origem (varchar)
- prioridade (varchar)
- ultimo_contato (timestamp)
- proximo_contato (timestamp)
- criado_por (varchar)
- atualizado_por (varchar)
- imagem_url (varchar)
```

#### 📊 Distribuição dos Dados Atuais:
- **Por Tipo:**
  - pessoa_juridica: 1
  - pessoa_fisica: 1

- **Por Categoria:**
  - outros: 1
  - expositores: 1

- **Por Status:**
  - ativo: 1
  - inativo: 1

#### 📄 Exemplo de Registro:
```json
{
  "id": "e877a6d3-423e-4876-9815-b2bcf7ea864b",
  "nome": "João Silva",
  "tipo": "pessoa_juridica",
  "categoria": "outros",
  "status": "inativo",
  "dados_pessoa_juridica": {
    "cpf": "123.456.789-00",
    "profissao": "Fotógrafo",
    "nome_fantasia": "",
    "data_nascimento": "1985-03-15"
  },
  "contatos": {
    "whatsapp": "19987431125",
    "email_principal": "lucas.tedx@gmail.com",
    "telefone_celular": "1195384711"
  },
  "origem": "manual",
  "prioridade": "normal"
}
```

### 3. ✅ TABELA `pre_inscricao_expositores`
**Status:** ✅ ATIVA
**Registros:** 2 pré-inscrições

#### 🏗️ Estrutura (Campos Principais):
```
- Pessoa Física: nome_pf, sobrenome_pf, cpf, email_pf, telefone_pf, endereço completo
- Pessoa Jurídica: razao_social, nome_social, cnpj, endereço completo, telefone_empresa, email_empresa
- Responsável Legal: nome_responsavel, sobrenome_responsavel, email_responsavel, contato_responsavel
- Responsável Stand: nome_responsavel_stand, sobrenome_responsavel_stand, email_responsavel_stand
- Serviços: numero_stand, deseja_patrocinio, categoria_patrocinio, condicao_pagamento, forma_pagamento
- Metadados: status, ip_address, created_at, updated_at, is_temporary
```

---

## 🗂️ OUTRAS TABELAS DO SISTEMA

| Tabela | Status | Registros | Observações |
|--------|--------|-----------|-------------|
| `contratos_gerados` | ✅ | 0 | Sistema de contratos pronto |
| `modelos_contratos` | ✅ | 0 | Templates de contrato prontos |
| `stands_construind` | ✅ | 81 | Stands configurados |
| `categorias` | ✅ | 4 | Categorias do sistema |
| `newsletters` | ✅ | 7 | Newsletter ativa |
| `entidades_historico` | ✅ | 0 | Histórico de interações |
| `entidades_documentos` | ✅ | 0 | Anexos de entidades |
| `entidades_lembretes` | ✅ | 0 | Sistema de lembretes |

---

## 🔄 MAPEAMENTO DE DADOS: PRÉ-INSCRIÇÃO → ENTIDADES

### Campos Mapeáveis da `pre_inscricao_expositores` para `entidades`:

#### ✅ **Dados Básicos:**
- `nome` ← `nome_pf + sobrenome_pf` (PF) ou `razao_social` (PJ)
- `tipo` ← `tipo_pessoa` (fisica/juridica)
- `categoria` ← "expositores"
- `subcategoria` ← `"Stand " + numero_stand`

#### ✅ **Dados Pessoa Física (JSONB):**
```json
{
  "cpf": "pre_inscricao.cpf",
  "nome": "pre_inscricao.nome_pf",
  "sobrenome": "pre_inscricao.sobrenome_pf"
}
```

#### ✅ **Dados Pessoa Jurídica (JSONB):**
```json
{
  "cnpj": "pre_inscricao.cnpj",
  "razao_social": "pre_inscricao.razao_social",
  "nome_fantasia": "pre_inscricao.nome_social"
}
```

#### ✅ **Contatos (JSONB):**
```json
{
  "email_principal": "pre_inscricao.email_pf || pre_inscricao.email_empresa",
  "email_responsavel": "pre_inscricao.email_responsavel",
  "email_stand": "pre_inscricao.email_responsavel_stand",
  "telefone_principal": "pre_inscricao.telefone_pf || pre_inscricao.telefone_empresa",
  "contato_responsavel": "pre_inscricao.contato_responsavel",
  "whatsapp": "pre_inscricao.is_whatsapp"
}
```

#### ✅ **Endereços (JSONB):**
```json
{
  "principal": {
    "cep": "pre_inscricao.cep || pre_inscricao.cep_pf",
    "logradouro": "pre_inscricao.logradouro || pre_inscricao.logradouro_pf",
    "numero": "pre_inscricao.numero || pre_inscricao.numero_pf",
    "complemento": "pre_inscricao.complemento || pre_inscricao.complemento_pf",
    "bairro": "pre_inscricao.bairro || pre_inscricao.bairro_pf",
    "cidade": "pre_inscricao.cidade || pre_inscricao.cidade_pf",
    "estado": "pre_inscricao.estado || pre_inscricao.estado_pf"
  }
}
```

#### ✅ **Dados Financeiros (JSONB):**
```json
{
  "numero_stand": "pre_inscricao.numero_stand",
  "deseja_patrocinio": "pre_inscricao.deseja_patrocinio",
  "categoria_patrocinio": "pre_inscricao.categoria_patrocinio",
  "condicao_pagamento": "pre_inscricao.condicao_pagamento",
  "forma_pagamento": "pre_inscricao.forma_pagamento"
}
```

#### ✅ **Metadados:**
- `origem` ← "pre_inscricao_expositor"
- `tags` ← `["expositor", "construind-2025", "stand-{numero_stand}"]`
- `observacoes` ← `pre_inscricao.observacoes`
- `status` ← "ativo" (quando aprovado)

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **Incompatibilidade com Template EventAll**
- ❌ Código do template referencia tabela `entities` que não existe
- ❌ Estrutura de campos diferente entre `entities` (template) e `entidades` (customizada)
- ❌ Tipos de dados incompatíveis

### 2. **Arquivos Problemáticos Identificados:**
- `template eventall/client/src/pages/entities.tsx`
- `template eventall/shared/schema.ts`
- `src/pages/admin/AdminPreInscricaoExpositores.tsx` (linha 158+)

---

## ✅ RECOMENDAÇÕES

### 1. **Imediatas:**
1. ✅ **Usar tabela `entidades` como padrão** (já implementada)
2. ✅ **Manter estrutura JSONB** para flexibilidade
3. ✅ **Continuar desenvolvimento com tabela atual**

### 2. **Desenvolvimento:**
1. 🔄 **Adaptar código do template** para usar `entidades`
2. 🔄 **Criar interfaces TypeScript** compatíveis
3. 🔄 **Implementar migração automática** de pré-inscrições

### 3. **Longo Prazo:**
1. 📋 **Documentar estrutura customizada**
2. 📋 **Criar testes automatizados**
3. 📋 **Implementar backup automático**

---

## 🎯 CONCLUSÃO

**✅ O sistema CONSTRUIND está usando uma estrutura de banco de dados customizada e funcional.**

- A tabela `entidades` está bem estruturada e atende às necessidades específicas do projeto
- O sistema de pré-inscrições está funcionando corretamente
- Existe um caminho claro para migração de dados entre as tabelas
- O template EventAll precisa ser adaptado para a estrutura customizada

**🚀 O projeto pode continuar o desenvolvimento normalmente usando a estrutura atual.**

---

*Relatório gerado automaticamente pelo script de checkup do banco de dados.*