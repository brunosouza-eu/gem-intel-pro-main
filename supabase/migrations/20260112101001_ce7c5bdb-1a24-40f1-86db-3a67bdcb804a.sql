-- Drop existing permissive INSERT and UPDATE policies on tokens
DROP POLICY IF EXISTS "Authenticated users can insert tokens" ON public.tokens;
DROP POLICY IF EXISTS "Authenticated users can update tokens" ON public.tokens;

-- Create new admin-only policies for INSERT and UPDATE
CREATE POLICY "Only admins can insert tokens"
ON public.tokens
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update tokens"
ON public.tokens
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Also restrict alerts, radar_weekly, and macro_view to admin-only for write operations
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can insert radar" ON public.radar_weekly;
DROP POLICY IF EXISTS "Authenticated users can insert macro" ON public.macro_view;
DROP POLICY IF EXISTS "Authenticated users can update macro" ON public.macro_view;

CREATE POLICY "Only admins can insert alerts"
ON public.alerts
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert radar"
ON public.radar_weekly
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert macro"
ON public.macro_view
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update macro"
ON public.macro_view
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));