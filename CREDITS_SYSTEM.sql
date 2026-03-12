-- =============================================
-- CREDITS SYSTEM TABLES
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add credits column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 50;

-- 2. Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'earn' or 'spend'
  source TEXT NOT NULL, -- 'daily_login', 'streak_bonus', 'level_up', 'badge', 'analysis', 'alert', etc.
  description TEXT,
  balance_after INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at DESC);

-- 4. Enable RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Allow anonymous transactions" ON credit_transactions;

-- 6. Create RLS Policies
CREATE POLICY "Users can view own transactions" ON credit_transactions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON credit_transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow anonymous for demo
CREATE POLICY "Allow anonymous transactions" ON credit_transactions 
  FOR ALL USING (true);

-- =============================================
-- SUCCESS! Credits system tables created
-- =============================================
