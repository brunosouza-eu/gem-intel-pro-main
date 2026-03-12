-- Allow admins to delete any alerts (including old ones with NULL created_by)
CREATE POLICY "Admins can delete any alerts"
ON public.alerts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Block anonymous access to profiles table
CREATE POLICY "Deny anonymous select on profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert on profiles"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on profiles"
ON public.profiles
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on profiles"
ON public.profiles
FOR DELETE
TO anon
USING (false);