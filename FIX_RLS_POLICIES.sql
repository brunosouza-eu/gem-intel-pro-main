-- =============================================
-- FIX RLS POLICIES FOR TOKENS TABLE
-- Execute this in Supabase SQL Editor
-- =============================================

-- 1. Drop existing restrictive policies on tokens
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON tokens;
DROP POLICY IF EXISTS "Enable read access for all users" ON tokens;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tokens;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tokens;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON tokens;
DROP POLICY IF EXISTS "tokens_read_policy" ON tokens;
DROP POLICY IF EXISTS "tokens_insert_policy" ON tokens;
DROP POLICY IF EXISTS "tokens_update_policy" ON tokens;
DROP POLICY IF EXISTS "tokens_delete_policy" ON tokens;

-- 2. Create open policies for tokens table
-- This is for a trading app where token data is public
DROP POLICY IF EXISTS "tokens_public_read" ON tokens;
DROP POLICY IF EXISTS "tokens_public_insert" ON tokens;
DROP POLICY IF EXISTS "tokens_public_update" ON tokens;
DROP POLICY IF EXISTS "tokens_public_delete" ON tokens;

CREATE POLICY "tokens_public_read" ON tokens
    FOR SELECT
    USING (true);

CREATE POLICY "tokens_public_insert" ON tokens
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "tokens_public_update" ON tokens
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "tokens_public_delete" ON tokens
    FOR DELETE
    USING (true);

-- 3. Also fix token_analysis table if needed
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON token_analysis;
DROP POLICY IF EXISTS "Enable read access for all users" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_read_policy" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_insert_policy" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_update_policy" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_delete_policy" ON token_analysis;

DROP POLICY IF EXISTS "token_analysis_public_read" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_public_insert" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_public_update" ON token_analysis;
DROP POLICY IF EXISTS "token_analysis_public_delete" ON token_analysis;

CREATE POLICY "token_analysis_public_read" ON token_analysis
    FOR SELECT
    USING (true);

CREATE POLICY "token_analysis_public_insert" ON token_analysis
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "token_analysis_public_update" ON token_analysis
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "token_analysis_public_delete" ON token_analysis
    FOR DELETE
    USING (true);

-- 4. Verify
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('tokens', 'token_analysis');
