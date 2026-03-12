-- ============================================================
-- FIX: Trade Master Data Stuck (409 Conflict on upsert)
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- STEP 1: Fix UNIQUE constraints (remove conflicting ones)
-- ============================================================

-- Drop the ticker-only constraint if it exists (conflicts with ticker+timeframe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'token_analysis_ticker_key') THEN
        ALTER TABLE public.token_analysis DROP CONSTRAINT token_analysis_ticker_key;
        RAISE NOTICE 'Dropped constraint: token_analysis_ticker_key';
    END IF;
END $$;

-- Ensure the correct composite constraint exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'token_analysis_ticker_timeframe_unique') THEN
        -- Remove duplicate rows first (keep only the most recent per ticker+timeframe)
        DELETE FROM public.token_analysis a
        USING public.token_analysis b
        WHERE a.ticker = b.ticker
          AND a.timeframe = b.timeframe
          AND a.updated_at < b.updated_at;

        ALTER TABLE public.token_analysis
        ADD CONSTRAINT token_analysis_ticker_timeframe_unique UNIQUE (ticker, timeframe);
        RAISE NOTICE 'Added constraint: token_analysis_ticker_timeframe_unique';
    ELSE
        RAISE NOTICE 'Constraint token_analysis_ticker_timeframe_unique already exists';
    END IF;
END $$;

-- ============================================================
-- STEP 2: Fix RLS policies (allow authenticated users to write)
-- ============================================================

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Pro users can read token analysis" ON public.token_analysis;
DROP POLICY IF EXISTS "Only admins can insert token analysis" ON public.token_analysis;
DROP POLICY IF EXISTS "Only admins can update token analysis" ON public.token_analysis;
DROP POLICY IF EXISTS "Anyone can read token analysis" ON public.token_analysis;
DROP POLICY IF EXISTS "Authenticated users can insert token analysis" ON public.token_analysis;
DROP POLICY IF EXISTS "Authenticated users can update token analysis" ON public.token_analysis;

-- SELECT: Allow ALL authenticated users (not just pro) to read analysis
CREATE POLICY "Anyone can read token analysis"
ON public.token_analysis
FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT: Allow all authenticated users (app does client-side analysis)
CREATE POLICY "Authenticated users can insert token analysis"
ON public.token_analysis
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: Allow all authenticated users
CREATE POLICY "Authenticated users can update token analysis"
ON public.token_analysis
FOR UPDATE
USING (auth.role() = 'authenticated');

-- ============================================================
-- STEP 3: Also fix the tokens table RLS (for token sync)
-- ============================================================

-- Drop old restrictive policies on tokens if needed
DROP POLICY IF EXISTS "Anyone can read tokens" ON public.tokens;
DROP POLICY IF EXISTS "Authenticated users can insert tokens" ON public.tokens;
DROP POLICY IF EXISTS "Authenticated users can update tokens" ON public.tokens;

-- Allow reading tokens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tokens' AND policyname = 'Anyone can read tokens'
    ) THEN
        CREATE POLICY "Anyone can read tokens"
        ON public.tokens FOR SELECT
        USING (true);
    END IF;
END $$;

-- Allow authenticated users to upsert tokens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tokens' AND policyname = 'Authenticated users can insert tokens'
    ) THEN
        CREATE POLICY "Authenticated users can insert tokens"
        ON public.tokens FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tokens' AND policyname = 'Authenticated users can update tokens'
    ) THEN
        CREATE POLICY "Authenticated users can update tokens"
        ON public.tokens FOR UPDATE
        USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- ============================================================
-- DONE! Now refresh the Trade Master page and click "Atualizar"
-- ============================================================
SELECT 'SUCCESS! RLS policies updated and constraints fixed. Refresh your Trade Master page.' AS result;
