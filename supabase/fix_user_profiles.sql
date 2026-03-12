-- 1. Check columns of user_profiles to be sure (optional but good for debugging)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles';

-- 2. Add credits column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 50;

-- 3. Set credits to 100 for ALL users in user_profiles
UPDATE public.user_profiles 
SET credits = 100;

-- 4. Verify the update
SELECT * FROM public.user_profiles;
