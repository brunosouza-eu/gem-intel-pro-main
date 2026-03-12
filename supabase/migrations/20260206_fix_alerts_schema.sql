-- Migration to fix alerts table schema
-- Adds missing columns if they don't exist

-- Add entry_zone if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'entry_zone') THEN
    ALTER TABLE public.alerts ADD COLUMN entry_zone TEXT;
  END IF;
END $$;

-- Add stop if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'stop') THEN
    ALTER TABLE public.alerts ADD COLUMN stop TEXT;
  END IF;
END $$;

-- Add targets if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'targets') THEN
    ALTER TABLE public.alerts ADD COLUMN targets TEXT;
  END IF;
END $$;

-- Add risk_reward if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'risk_reward') THEN
    ALTER TABLE public.alerts ADD COLUMN risk_reward TEXT;
  END IF;
END $$;

-- Add invalidation if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'invalidation') THEN
    ALTER TABLE public.alerts ADD COLUMN invalidation TEXT;
  END IF;
END $$;

-- Add volatility_note if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'volatility_note') THEN
    ALTER TABLE public.alerts ADD COLUMN volatility_note TEXT;
  END IF;
END $$;

-- Add created_by if missing (references the user who created the alert)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'created_by') THEN
    ALTER TABLE public.alerts ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Add created_at if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'created_at') THEN
    ALTER TABLE public.alerts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
  END IF;
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
