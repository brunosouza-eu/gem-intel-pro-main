-- ─────────────────────────────────────────────────────────────────────────────
-- Trade Master Pro — Migração Supabase
-- Execute no SQL Editor do Supabase
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. TABELA DE COMPRAS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS curso_compras (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_slug            TEXT NOT NULL DEFAULT 'trade-master-pro',
  valor                 DECIMAL(10,2),
  metodo                TEXT CHECK (metodo IN ('hotmart', 'kiwify', 'stripe', 'manual')),
  hotmart_transaction   TEXT UNIQUE,
  status                TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado', 'reembolsado')),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Index para lookup rápido
CREATE INDEX IF NOT EXISTS idx_curso_compras_user  ON curso_compras(user_id);
CREATE INDEX IF NOT EXISTS idx_curso_compras_curso ON curso_compras(curso_slug);

-- 2. TABELA DE PROGRESSO ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progresso_aulas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_slug      TEXT NOT NULL DEFAULT 'trade-master-pro',
  modulo_slug     TEXT NOT NULL,
  aula_slug       TEXT NOT NULL,
  concluida       BOOLEAN DEFAULT FALSE,
  percentual      INTEGER DEFAULT 0 CHECK (percentual BETWEEN 0 AND 100),
  tempo_assistido INTEGER DEFAULT 0,  -- em segundos
  ultima_vez      TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  -- Chave única para upsert
  UNIQUE(user_id, curso_slug, modulo_slug, aula_slug)
);

CREATE INDEX IF NOT EXISTS idx_progresso_user_curso ON progresso_aulas(user_id, curso_slug);

-- 3. ROW LEVEL SECURITY ────────────────────────────────────────────────────────

-- Compras: usuário vê apenas as próprias
ALTER TABLE curso_compras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_sees_own_compras"
  ON curso_compras FOR SELECT
  USING (auth.uid() = user_id);

-- Progresso: usuário lê e escreve apenas o próprio
ALTER TABLE progresso_aulas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_reads_own_progresso"
  ON progresso_aulas FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "user_writes_own_progresso"
  ON progresso_aulas FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_updates_own_progresso"
  ON progresso_aulas FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role pode inserir compras (via webhook)
CREATE POLICY "service_insert_compras"
  ON curso_compras FOR INSERT
  WITH CHECK (TRUE);  -- protegida pela chave service_role no backend

-- 4. FUNÇÃO HELPER — progresso total por usuário ───────────────────────────────
CREATE OR REPLACE FUNCTION get_progresso_curso(p_user_id UUID, p_curso_slug TEXT DEFAULT 'trade-master-pro')
RETURNS TABLE (
  total_aulas       BIGINT,
  aulas_concluidas  BIGINT,
  percentual        INTEGER
)
LANGUAGE SQL STABLE AS $$
  SELECT
    37 AS total_aulas,
    COUNT(*) FILTER (WHERE concluida = TRUE) AS aulas_concluidas,
    ROUND(COUNT(*) FILTER (WHERE concluida = TRUE)::NUMERIC / 37 * 100)::INTEGER AS percentual
  FROM progresso_aulas
  WHERE user_id = p_user_id AND curso_slug = p_curso_slug;
$$;

-- 5. TRIGGER — updated_at automático ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_progresso_updated_at
  BEFORE UPDATE ON progresso_aulas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
