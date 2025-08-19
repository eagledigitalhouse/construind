# 🏗️ CONSTRUIND 2025 - Migração de Stands

## 📋 Resumo

Este documento contém as instruções para adicionar todos os stands do CONSTRUIND 2025 ao banco de dados Supabase.

## 📊 Stands a serem inseridos

### Resumo por categoria:
- **2x2**: 18 stands - R$ 2.600 cada (4m²)
- **3x3 Básico**: 32 stands - R$ 3.500 cada (9m²)
- **3x3 Acabamentos**: 24 stands - R$ 3.500 cada (9m²)
- **5x5**: 16 stands - R$ 5.200 cada (25m²)
- **8x8**: 6 stands - R$ 8.500 cada (64m²)
- **10x10**: 1 stand - R$ 20.000 (100m²)
- **9x10**: 8 stands - R$ 9.500 cada (90m²)

**Total**: 105 stands

## 🎨 Cores por categoria

| Categoria | Cor | Código |
|-----------|-----|--------|
| 2x2 | Azul petróleo | #0097b2 |
| 3x3 Básico | Azul escuro | #004aad |
| 3x3 Acabamentos | Azul claro | #6cace3 |
| 5x5 | Verde | #55a04d |
| 8x8 | Amarelo | #ffb600 |
| 10x10 | Vermelho | #ce1c21 |
| 9x10 | Laranja | #ff5500 |

## 🚀 Como executar a migração

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login na sua conta
   - Selecione o projeto CONSTRUIND

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute a migração**
   - Copie todo o conteúdo do arquivo `supabase/migrations/20240104000000_insert_stands_construind.sql`
   - Cole no editor SQL
   - Clique em "Run" para executar

4. **Verifique o resultado**
   - A consulta final mostrará um resumo dos stands por categoria
   - Você deve ver 105 stands inseridos

### Opção 2: Via Script Node.js

1. **Configure as variáveis de ambiente**
   ```bash
   # No arquivo .env ou nas variáveis do sistema
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_ANON_KEY=sua_chave_anonima
   ```

2. **Instale as dependências**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Execute o script**
   ```bash
   node scripts/executar_migracao_stands.js
   ```

### Opção 3: Via linha de comando (psql)

```bash
# Conecte ao seu banco Supabase
psql "postgresql://postgres:[SUA_SENHA]@[SEU_HOST]:5432/postgres"

# Execute o arquivo SQL
\i supabase/migrations/20240104000000_insert_stands_construind.sql
```

## ✅ Verificação pós-migração

Após executar a migração, verifique se tudo foi inserido corretamente:

```sql
-- Contar total de stands
SELECT COUNT(*) as total_stands FROM stands_construind;

-- Verificar stands por categoria
SELECT 
    categoria,
    COUNT(*) as total,
    MIN(preco) as preco_min,
    MAX(preco) as preco_max,
    cor
FROM stands_construind 
GROUP BY categoria, cor
ORDER BY categoria;

-- Verificar categorias
SELECT * FROM categorias ORDER BY nome;
```

**Resultado esperado:**
- Total de stands: 105
- 7 categorias diferentes
- Todos os preços corretos conforme especificação

## 🔧 Estrutura das tabelas

### Tabela `stands_construind`
- `id`: Identificador único
- `numero_stand`: Número do stand (1-106)
- `categoria`: Categoria do stand (2x2, 3x3_basico, etc.)
- `preco`: Preço em reais
- `status`: Status do stand (disponivel, reservado, vendido)
- `observacoes`: Descrição e características
- `largura`: Largura em metros
- `altura`: Altura em metros
- `cor`: Cor hexadecimal da categoria

### Tabela `categorias`
- `id`: Identificador único
- `nome`: Nome da categoria
- `cor`: Cor hexadecimal
- `descricao`: Descrição da categoria

## 🚨 Importante

1. **Backup**: Faça backup do banco antes de executar a migração
2. **Ambiente**: Execute primeiro em ambiente de desenvolvimento
3. **Verificação**: Sempre verifique os resultados após a execução
4. **Rollback**: Mantenha um script de rollback caso necessário

## 📝 Script de Rollback

Caso precise desfazer a migração:

```sql
-- Remover todos os stands inseridos
DELETE FROM stands_construind;

-- Remover categorias (opcional)
DELETE FROM categorias WHERE nome IN (
    '2x2', '3x3_basico', '3x3_acabamentos', 
    '5x5', '8x8', '10x10', '9x10'
);
```

## 📞 Suporte

Em caso de problemas:
1. Verifique se as tabelas existem
2. Confirme as permissões do usuário
3. Verifique os logs de erro do Supabase
4. Consulte a documentação do Supabase

---

**Data da migração**: Janeiro 2025  
**Versão**: 1.0  
**Projeto**: CONSTRUIND 2025