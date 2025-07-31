# Integração ZapSign - FESPIN

Este documento descreve a integração do sistema FESPIN com a plataforma ZapSign para assinatura digital de contratos.

## Visão Geral

A integração permite:
- Criar contratos diretamente a partir de templates do ZapSign
- Sincronizar status de assinatura automaticamente
- Baixar documentos assinados
- Gerenciar signatários e variáveis de template

## Configuração

### 1. Variáveis de Ambiente

Adicione no arquivo `.env`:
```env
VITE_ZAPSIGN_API_KEY=your_zapsign_api_key_here
```

### 2. Banco de Dados

Execute a migração para adicionar os campos do ZapSign:
```sql
-- Migração: 20250129000001_add_zapsign_fields.sql
```

## Arquivos Criados/Modificados

### Novos Arquivos

1. **`src/lib/zapsign.ts`**
   - Classe `ZapSignAPI` para integração com a API
   - Interfaces TypeScript para entidades ZapSign
   - Funções utilitárias para mapeamento de status

2. **`src/components/contratos/ModalSelecaoModeloZapSign.tsx`**
   - Modal para seleção de templates ZapSign
   - Interface para criação de contratos

### Arquivos Modificados

1. **`src/types/contratos.ts`**
   - Adicionados campos ZapSign na interface `ContratoGerado`

2. **`src/lib/contratos.ts`**
   - Função `mapearDadosParaZapSign()` - mapeia dados da pré-inscrição
   - Função `criarContratoZapSign()` - cria contrato via ZapSign
   - Função `sincronizarStatusZapSign()` - sincroniza status
   - Função `baixarArquivoAssinadoZapSign()` - download de arquivos

3. **`src/pages/admin/AdminPreInscricaoExpositores.tsx`**
   - Botão "Gerar via ZapSign" adicionado
   - Modal de seleção de template integrado
   - Funções de callback para criação de contratos

4. **`src/pages/admin/AdminContratos.tsx`**
   - Exibição de informações específicas do ZapSign
   - Botão para abrir documento no ZapSign
   - Opções de menu para sincronizar status e baixar arquivos
   - Badge indicando contratos criados via ZapSign

## Fluxo de Uso

### 1. Criação de Contrato via ZapSign

1. Na página de administração de pré-inscrições
2. Selecionar uma pré-inscrição aprovada
3. Clicar em "Gerar via ZapSign"
4. Escolher um template do ZapSign
5. O sistema:
   - Mapeia os dados da pré-inscrição para variáveis do template
   - Cria o documento no ZapSign
   - Salva as informações no banco local
   - Gera número de contrato único

### 2. Gerenciamento de Contratos

1. Na página de contratos, contratos ZapSign são identificados com badge "ZapSign"
2. Informações específicas incluem:
   - Status do ZapSign
   - Link para abrir no painel ZapSign
   - Nome do template utilizado

3. Ações disponíveis:
   - **Sincronizar Status**: Atualiza status local com base no ZapSign
   - **Baixar Arquivo Assinado**: Download do PDF assinado (quando disponível)
   - **Abrir no ZapSign**: Link direto para o documento

## Mapeamento de Dados

A função `mapearDadosParaZapSign()` mapeia os seguintes campos:

### Dados Pessoais (PF)
- `nome_completo_pf`: Nome + Sobrenome
- `cpf_pf`: CPF
- `email_pf`: Email
- `telefone_pf`: Telefone
- Endereço completo

### Dados Empresariais (PJ)
- `razao_social`: Razão Social
- `nome_social`: Nome Social
- `cnpj`: CNPJ
- `email_empresa`: Email
- `telefone_empresa`: Telefone
- Endereço completo

### Dados do Responsável
- `nome_responsavel`: Nome completo
- `email_responsavel`: Email
- `contato_responsavel`: Telefone

### Dados do Stand
- `numero_stand`: Número do stand
- `nome_responsavel_stand`: Responsável pelo stand
- `email_responsavel_stand`: Email do responsável

### Dados do Evento
- `nome_evento`: "FESPIN 2025"
- `data_evento`: "15 a 17 de Novembro de 2025"
- `local_evento`: "Centro de Convenções"

### Dados de Pagamento
- `condicao_pagamento`: Condição de pagamento
- `forma_pagamento`: Forma de pagamento
- `deseja_patrocinio`: Sim/Não
- `categoria_patrocinio`: Categoria (se aplicável)

## Mapeamento de Status

| Status ZapSign | Status Local | Descrição |
|----------------|--------------|-----------|
| `draft` | `rascunho` | Documento criado |
| `waiting` | `enviado_assinatura` | Aguardando assinatura |
| `signed` | `assinado_completo` | Documento assinado |
| `cancelled` | `cancelado` | Documento cancelado |
| `expired` | `cancelado` | Documento expirado |

## Tratamento de Erros

- **API Key não configurada**: Warning no console, funcionalidades desabilitadas
- **Erro na API**: Toast de erro com mensagem específica
- **Template não encontrado**: Mensagem de erro no modal
- **Documento não encontrado**: Erro ao sincronizar status

## Segurança

- API Key armazenada em variável de ambiente
- Validação de permissões antes de criar contratos
- Logs de auditoria para ações importantes
- Verificação de status antes de downloads

## Webhook do ZapSign

A integração agora suporta webhooks do ZapSign para sincronização automática de status.

### Configuração do Webhook

1. No painel do ZapSign, acesse "Configurações" > "Webhooks"
2. Adicione a URL do webhook: `https://seu-dominio.com/api/zapsign/webhook`
3. Selecione os eventos que deseja receber:
   - `sign` (Assinatura)
   - `close` (Documento finalizado)
   - `refuse` (Documento recusado)
   - `cancel` (Documento cancelado)

### Implementação

O webhook está implementado nos seguintes arquivos:

- `src/api/zapsign-webhook.ts`: Endpoint para receber webhooks
- `src/lib/zapsign-webhook.ts`: Processamento dos eventos
- `server.js`: Rota Express para o webhook

### Eventos Suportados

| Evento | Descrição | Ação no Sistema |
|--------|-----------|---------------|
| `sign` | Documento assinado | Atualiza status para "assinado_produtor" ou "totalmente_assinado" |
| `close` | Documento finalizado | Atualiza status para "totalmente_assinado" |
| `refuse` | Documento recusado | Atualiza status para "cancelado" |
| `cancel` | Documento cancelado | Atualiza status para "cancelado" |

## Limitações Atuais

- Suporte apenas para templates pré-configurados no ZapSign
- Download disponível apenas para documentos com status "signed"

## Próximos Passos

1. Adicionar suporte para múltiplos signatários
2. Implementar notificações por email
3. Adicionar relatórios específicos para contratos ZapSign