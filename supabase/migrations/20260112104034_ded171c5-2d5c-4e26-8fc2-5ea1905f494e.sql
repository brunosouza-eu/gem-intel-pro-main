-- Update RLS policies to restrict data access to Pro users only
-- This enforces server-side authorization for Pro plan features

-- Drop existing permissive SELECT policies
DROP POLICY IF EXISTS "Authenticated users can read tokens" ON public.tokens;
DROP POLICY IF EXISTS "Authenticated users can read alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can read radar" ON public.radar_weekly;
DROP POLICY IF EXISTS "Authenticated users can read macro" ON public.macro_view;

-- Create Pro-only SELECT policies for tokens table
CREATE POLICY "Pro users can read tokens"
ON public.tokens
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.plan = 'pro'
  )
);

-- Create Pro-only SELECT policies for alerts table
CREATE POLICY "Pro users can read alerts"
ON public.alerts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.plan = 'pro'
  )
);

-- Create Pro-only SELECT policies for radar_weekly table
CREATE POLICY "Pro users can read radar"
ON public.radar_weekly
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.plan = 'pro'
  )
);

-- Create Pro-only SELECT policies for macro_view table
CREATE POLICY "Pro users can read macro"
ON public.macro_view
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.plan = 'pro'
  )
);