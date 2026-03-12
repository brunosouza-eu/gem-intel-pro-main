# 🐛 BUG IDENTIFICADO: Sistema de Créditos

## Problema

**Raiz do erro**: A migration inicial cria tabela `profiles`, mas o código busca `user_profiles`.

**Pior ainda**: A tabela `profiles` **NÃO TEM coluna `credits`**!

### O que está acontecendo:

1. ❌ Migration cria: `public.profiles` (sem coluna credits)
2. ❌ Código busca: `user_profiles` (tabela inexistente)
3. ❌ Usuários novos: Não recebem créditos iniciais
4. ❌ Erro no console: Coluna `credits` não existe

### Schema atual da tabela `profiles`:
```sql
CREATE TABLE public.profiles (
  id UUID,
  email TEXT,
  plan user_plan DEFAULT 'free',  
  language TEXT DEFAULT 'pt',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
  -- ❌ SEM coluna 'credits'!
);
```

## Solução

Criada migration: `20260210_fix_credits_system.sql`

### O que ela faz:

1. ✅ Adiciona coluna `credits` com default 50
2. ✅ Atualiza usuários existentes para 50 créditos
3. ✅ Modifica trigger para criar usuários com 50 créditos
4. ✅ Cria VIEW `user_profiles` para compatibilidade

## Como Aplicar

**Execute no Supabase SQL Editor**:

```sql
-- Adicionar coluna credits
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 50;

-- Dar 50 créditos a todos usuários existentes
UPDATE public.profiles SET credits = 50;

-- Atualizar trigger para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan, language, credits)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'pt'),
    50
  );
  RETURN NEW;
END;
$$;

-- Criar compatibilidade
CREATE OR REPLACE VIEW user_profiles AS SELECT * FROM profiles;
```

## Resultado

- ✅ Todos usuários terão 50 créditos
- ✅ Novos usuários começam com 50 créditos
- ✅ Código continua funcionando (view user_profiles)
- ✅ Análises AI funcionarão

## Próximos Passos

1. Execute a migration
2. Recarregue a página (F5)
3. Teste gerando uma análise AI
