-- Add created_by column to alerts table to track who created each alert
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_alerts_created_by ON public.alerts(created_by);

-- Create alert_preferences table for notification settings
CREATE TABLE IF NOT EXISTS public.alert_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_id UUID NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  notify_entry BOOLEAN DEFAULT true,
  notify_stop BOOLEAN DEFAULT true,
  notify_target BOOLEAN DEFAULT true,
  notify_signals BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, token_id)
);

-- Enable RLS on alert_preferences
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for alert_preferences
CREATE POLICY "Users can view their own preferences"
ON public.alert_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
ON public.alert_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.alert_preferences
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
ON public.alert_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own alerts
CREATE POLICY "Users can delete their own alerts"
ON public.alerts
FOR DELETE
USING (auth.uid() = created_by);

-- Add trigger for updated_at on alert_preferences
CREATE TRIGGER update_alert_preferences_updated_at
BEFORE UPDATE ON public.alert_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();