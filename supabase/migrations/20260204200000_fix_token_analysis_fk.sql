-- Fix missing Foreign Key between token_analysis and tokens
-- Run this in Supabase SQL Editor if you see "Could not find a relationship" errors

DO $$
BEGIN
    -- Drop if exists to ensure clean state
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'token_analysis_token_id_fkey') THEN
        ALTER TABLE public.token_analysis DROP CONSTRAINT token_analysis_token_id_fkey;
    END IF;

    -- Add the constraint
    ALTER TABLE public.token_analysis
    ADD CONSTRAINT token_analysis_token_id_fkey
    FOREIGN KEY (token_id)
    REFERENCES public.tokens(id)
    ON DELETE CASCADE;
END $$;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload config';
