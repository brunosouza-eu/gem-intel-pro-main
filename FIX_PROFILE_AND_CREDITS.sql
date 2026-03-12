-- =============================================
-- FIX PROFILE AND IMPROVE CREDITS SYSTEM
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Ensure 'credits' column exists in 'user_profiles'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'credits') THEN
        ALTER TABLE user_profiles ADD COLUMN credits INTEGER DEFAULT 50;
    END IF;
END $$;

-- 2. Ensure 'credit_transactions' table exists
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'earn' or 'spend'
  source TEXT NOT NULL, -- 'daily_login', 'streak_bonus', 'analysis', etc.
  description TEXT,
  balance_after INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at DESC);

-- 4. Enable RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
CREATE POLICY "Users can view own transactions" ON credit_transactions 
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Secure Credit Deduction Function (RPC)
-- This function runs with elevated privileges (SECURITY DEFINER) to safely deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
  p_amount INTEGER, 
  p_description TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Lock the row for update to prevent race conditions
  SELECT credits INTO v_current_balance 
  FROM user_profiles 
  WHERE user_id = v_user_id 
  FOR UPDATE;
  
  IF v_current_balance IS NULL THEN
    -- Try to find via username if user_id match fails (legacy support)
    SELECT credits INTO v_current_balance 
    FROM user_profiles 
    WHERE username = (SELECT email FROM auth.users WHERE id = v_user_id)
    FOR UPDATE;

    IF v_current_balance IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
    END IF;
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient credits');
  END IF;

  v_new_balance := v_current_balance - p_amount;

  -- Update balance
  UPDATE user_profiles 
  SET credits = v_new_balance, updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Record transaction
  INSERT INTO credit_transactions (user_id, amount, type, source, description, balance_after)
  VALUES (v_user_id, -p_amount, 'spend', 'system', p_description, v_new_balance);

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Secure Credit Addition Function (RPC) - Optional but good for security
CREATE OR REPLACE FUNCTION add_credits(
  p_amount INTEGER, 
  p_source TEXT,
  p_description TEXT
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT credits INTO v_current_balance 
  FROM user_profiles 
  WHERE user_id = v_user_id 
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
     RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  v_new_balance := v_current_balance + p_amount;

  UPDATE user_profiles 
  SET credits = v_new_balance, updated_at = NOW()
  WHERE user_id = v_user_id;

  INSERT INTO credit_transactions (user_id, amount, type, source, description, balance_after)
  VALUES (v_user_id, p_amount, 'earn', p_source, p_description, v_new_balance);

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
