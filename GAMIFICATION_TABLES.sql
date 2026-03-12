-- =============================================
-- GAMIFICATION SYSTEM TABLES
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. User Profiles (gamification data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  total_analyses_viewed INTEGER DEFAULT 0,
  total_guru_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 3. User Actions (XP log)
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_created ON user_actions(created_at DESC);

-- 5. Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can view own actions" ON user_actions;
DROP POLICY IF EXISTS "Users can insert own actions" ON user_actions;

-- 7. Create RLS Policies

-- Profiles: everyone can view (for leaderboard), users can edit own
CREATE POLICY "Users can view all profiles" ON user_profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges: users can view and insert own
CREATE POLICY "Users can view own badges" ON user_badges 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Actions: users can view and insert own
CREATE POLICY "Users can view own actions" ON user_actions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actions" ON user_actions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Allow anonymous access for demo (optional - remove in production)
DROP POLICY IF EXISTS "Allow anonymous insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow anonymous update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow anonymous insert badges" ON user_badges;
DROP POLICY IF EXISTS "Allow anonymous insert actions" ON user_actions;

CREATE POLICY "Allow anonymous insert profiles" ON user_profiles 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update profiles" ON user_profiles 
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous insert badges" ON user_badges 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert actions" ON user_actions 
  FOR INSERT WITH CHECK (true);

-- =============================================
-- SUCCESS! Tables created for gamification
-- =============================================
