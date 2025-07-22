# Configuração de Autenticação Supabase - FESPIN 2025

## 📋 Visão Geral

Este documento contém as instruções completas para configurar a autenticação do Supabase para o sistema FESPIN 2025. O sistema está configurado para:

- ✅ **Apenas login** (sem registro público)
- ✅ **Controle de acesso baseado em roles** (admin/super_admin)
- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **Primeiro usuário admin**: `lucas.tedx@gmail.com`

## 🚀 Passos para Configuração

### 1. Executar o Script SQL

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá para **SQL Editor**
3. Copie e cole o conteúdo do arquivo `supabase_auth_setup.sql`
4. Execute o script completo

### 2. Configurar Authentication Settings

No painel do Supabase, vá para **Authentication > Settings**:

#### Site URL e Redirect URLs
```
Site URL: http://localhost:8081

Redirect URLs:
- http://localhost:8081/admin
- http://localhost:8081/admin/login
- https://seudominio.com/admin (para produção)
```

#### Configurações de Segurança
- ❌ **Enable email confirmations**: OFF (ou ON se quiser confirmação)
- ❌ **Enable phone confirmations**: OFF
- ✅ **Enable email change confirmations**: ON
- ✅ **Enable password recovery**: ON
- ❌ **Enable signup**: OFF (IMPORTANTE: Desabilitar registro público)

#### Auth Providers
- ✅ **Email**: ON
- ❌ **Todos os outros**: OFF

### 3. Criar o Primeiro Usuário Admin

1. No painel do Supabase, vá para **Authentication > Users**
2. Clique em **"Add user"**
3. Preencha os dados:
   ```
   Email: lucas.tedx@gmail.com
   Password: Acesso123@
   Email Confirm: ✅ (marque como confirmado)
   ```
4. Clique em **"Create user"**

### 4. Definir como Super Admin

Após criar o usuário, execute este SQL no **SQL Editor**:

```sql
UPDATE public.user_profiles 
SET role = 'super_admin', full_name = 'Lucas Admin'
WHERE email = 'lucas.tedx@gmail.com';
```

## 🔍 Verificações

### Verificar se o usuário foi criado corretamente:
```sql
SELECT 
  up.email,
  up.role,
  up.full_name,
  up.is_active,
  up.created_at
FROM public.user_profiles up
WHERE up.email = 'lucas.tedx@gmail.com';
```

### Verificar políticas de RLS:
```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

### Verificar buckets de storage:
```sql
SELECT id, name, public FROM storage.buckets;
```

## 🛡️ Estrutura de Segurança

### Tabelas Protegidas por RLS
- `user_profiles` - Perfis de usuário
- `patrocinadores` - Dados de patrocinadores
- `expositores` - Dados de expositores
- `newsletters` - Lista de emails
- `categorias` - Categorias do sistema
- `cotas_patrocinio` - Cotas de patrocínio
- `stands` - Informações dos stands
- `pre_inscricao_expositores` - Pré-inscrições

### Políticas de Acesso
- **Admins**: Acesso completo a todas as tabelas
- **Público**: Apenas leitura em categorias, cotas e stands
- **Público**: Inserção em newsletter e pré-inscrições

### Storage Buckets
- `patrocinadores` - Logos de patrocinadores
- `expositores` - Logos de expositores
- `avatars` - Avatars de usuários

## 🧪 Testando a Configuração

### 1. Testar Login
1. Acesse: http://localhost:8081/admin/login
2. Use as credenciais:
   - Email: `lucas.tedx@gmail.com`
   - Senha: `Acesso123@`
3. Deve redirecionar para `/admin` com sucesso

### 2. Testar Proteção de Rotas
1. Tente acessar `/admin` sem estar logado
2. Deve redirecionar para `/admin/login`

### 3. Testar Permissões
1. Logado como admin, deve ter acesso a todas as páginas
2. Deve conseguir ver e editar dados nas tabelas protegidas

## 🚨 Troubleshooting

### Erro: "User not found"
- Verifique se o usuário foi criado no painel Authentication > Users
- Verifique se o email está correto

### Erro: "Access denied"
- Verifique se o usuário tem role 'admin' ou 'super_admin'
- Execute o SQL para atualizar o role do usuário

### Erro: "RLS policy violation"
- Verifique se as políticas de RLS foram criadas corretamente
- Execute novamente o script SQL de configuração

### Erro: "Invalid redirect URL"
- Verifique se as URLs de redirect estão configuradas corretamente
- Adicione a URL atual nas configurações do Supabase

## 📝 Próximos Passos

1. ✅ Configuração básica concluída
2. 🔄 Testar todas as funcionalidades admin
3. 🔒 Configurar backup automático
4. 📧 Personalizar templates de email
5. 🌐 Configurar para produção

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs no painel do Supabase
2. Consulte a documentação oficial: https://supabase.com/docs
3. Verifique se todas as variáveis de ambiente estão corretas

---

**⚠️ IMPORTANTE**: Mantenha as credenciais de admin seguras e altere a senha padrão em produção!