-- =============================================
-- MONETIZATION SYSTEM
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add plan columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS vip_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS daily_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_credit_reset DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS max_daily_credits INTEGER DEFAULT 5;

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  price_paid DECIMAL(10,2),
  payment_method TEXT, -- 'stripe', 'hotmart', 'manual'
  payment_id TEXT, -- External payment ID
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create usage_limits table for daily tracking
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL, -- 'analysis', 'guru', 'alert', 'export'
  used_count INTEGER DEFAULT 0,
  limit_count INTEGER DEFAULT 0,
  reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature, reset_date)
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_feature ON usage_limits(user_id, feature);

-- 5. Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own usage" ON usage_limits;
DROP POLICY IF EXISTS "Allow all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow all usage" ON usage_limits;

-- 7. Create RLS Policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON usage_limits 
  FOR SELECT USING (auth.uid() = user_id);

-- Allow anonymous for demo
CREATE POLICY "Allow all subscriptions" ON subscriptions 
  FOR ALL USING (true);

CREATE POLICY "Allow all usage" ON usage_limits 
  FOR ALL USING (true);

-- 8. Function to reset daily credits
CREATE OR REPLACE FUNCTION reset_daily_credits()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    credits = CASE 
      WHEN plan_type = 'vip' THEN 9999
      ELSE 5 
    END,
    daily_credits_used = 0,
    last_credit_reset = CURRENT_DATE
  WHERE last_credit_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SUCCESS! Monetization system tables created
-- =============================================
