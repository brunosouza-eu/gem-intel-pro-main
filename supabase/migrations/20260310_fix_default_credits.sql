-- ====================================================================
-- FIX: Change default credits from 50 to 5 for free accounts
-- This ensures new signups get ONLY the free-tier allocation (5 credits)
-- ====================================================================

-- 1. Change the column default from 50 to 5
ALTER TABLE public.profiles
ALTER COLUMN credits SET DEFAULT 5;

-- 2. Update the profile creation trigger to use 5 credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan, language, credits)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    'pt',
    5  -- Free plan starts with 5 credits
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
