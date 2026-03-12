-- =====================================================
-- 🤖 COMMUNITY BOTS SYSTEM MIGRATION
-- Automated engagement bots with AI-powered content
-- =====================================================

BEGIN;

-- =====================================================
-- 1. BOT PROFILES TABLE
-- Stores personality configs for each bot
-- =====================================================

CREATE TABLE IF NOT EXISTS bot_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    persona_name text NOT NULL,
    persona_style text NOT NULL,           -- e.g. 'analytical', 'energetic', 'educational'
    personality_prompt text NOT NULL,        -- System prompt for AI generation
    topics text[] NOT NULL DEFAULT '{}',    -- e.g. {'BTC', 'ETH', 'DeFi', 'Altcoins'}
    posting_frequency_min integer DEFAULT 60,   -- minimum minutes between posts
    posting_frequency_max integer DEFAULT 180,  -- maximum minutes between posts
    active_hours_start integer DEFAULT 8,   -- hour (0-23) when bot starts being active
    active_hours_end integer DEFAULT 23,    -- hour (0-23) when bot stops being active
    is_active boolean DEFAULT true,
    avatar_style text DEFAULT 'default',    -- for categorization
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- =====================================================
-- 2. BOT ACTIVITY LOG TABLE
-- Tracks all bot actions to prevent repetition
-- =====================================================

CREATE TABLE IF NOT EXISTS bot_activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_profile_id uuid NOT NULL REFERENCES bot_profiles(id) ON DELETE CASCADE,
    action_type text NOT NULL CHECK (action_type IN ('post', 'comment', 'like', 'follow')),
    target_id uuid,                         -- post_id, comment_id, or user_id
    content_preview text,                   -- first 100 chars of generated content
    tokens_used integer DEFAULT 0,          -- AI tokens consumed
    market_context jsonb,                   -- snapshot of market data used
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_bot_profiles_user_id ON bot_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_profiles_active ON bot_profiles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bot_activity_log_bot ON bot_activity_log(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_bot_activity_log_created ON bot_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_activity_log_action ON bot_activity_log(action_type, created_at DESC);

-- =====================================================
-- 4. RPC: bot_create_post
-- Creates a post as a bot user (bypasses auth.uid())
-- =====================================================

CREATE OR REPLACE FUNCTION bot_create_post(
    p_bot_user_id uuid,
    p_content text,
    p_post_type text DEFAULT 'insight'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_post posts;
    v_bot_profile_id uuid;
BEGIN
    -- Verify this is actually a bot
    SELECT id INTO v_bot_profile_id FROM bot_profiles WHERE user_id = p_bot_user_id;
    IF v_bot_profile_id IS NULL THEN
        RAISE EXCEPTION 'User is not a registered bot';
    END IF;

    -- Insert post
    INSERT INTO posts (user_id, content, post_type)
    VALUES (p_bot_user_id, p_content, p_post_type)
    RETURNING * INTO v_post;

    -- Update user's posts count
    UPDATE profiles 
    SET posts_count = posts_count + 1
    WHERE id = p_bot_user_id;

    -- Award XP (bots gain XP too for realistic profiles)
    UPDATE profiles
    SET xp = xp + 10
    WHERE id = p_bot_user_id;

    -- Log activity
    INSERT INTO bot_activity_log (bot_profile_id, action_type, target_id, content_preview)
    VALUES (v_bot_profile_id, 'post', v_post.id, LEFT(p_content, 100));

    RETURN json_build_object(
        'success', true,
        'post_id', v_post.id
    );
END;
$$;

-- =====================================================
-- 5. RPC: bot_add_comment
-- Adds a comment as a bot user
-- =====================================================

CREATE OR REPLACE FUNCTION bot_add_comment(
    p_bot_user_id uuid,
    p_post_id uuid,
    p_content text,
    p_parent_comment_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_comment post_comments;
    v_bot_profile_id uuid;
BEGIN
    -- Verify this is actually a bot
    SELECT id INTO v_bot_profile_id FROM bot_profiles WHERE user_id = p_bot_user_id;
    IF v_bot_profile_id IS NULL THEN
        RAISE EXCEPTION 'User is not a registered bot';
    END IF;

    -- Insert comment
    INSERT INTO post_comments (post_id, user_id, content, parent_comment_id)
    VALUES (p_post_id, p_bot_user_id, p_content, p_parent_comment_id)
    RETURNING * INTO v_comment;

    -- Update post's comments count
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = p_post_id;

    -- Award XP
    UPDATE profiles SET xp = xp + 5 WHERE id = p_bot_user_id;

    -- Log activity
    INSERT INTO bot_activity_log (bot_profile_id, action_type, target_id, content_preview)
    VALUES (v_bot_profile_id, 'comment', v_comment.id, LEFT(p_content, 100));

    RETURN json_build_object(
        'success', true,
        'comment_id', v_comment.id
    );
END;
$$;

-- =====================================================
-- 6. RPC: bot_toggle_like
-- Likes a post as a bot user
-- =====================================================

CREATE OR REPLACE FUNCTION bot_toggle_like(
    p_bot_user_id uuid,
    p_post_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bot_profile_id uuid;
    v_post_author_id uuid;
BEGIN
    -- Verify this is actually a bot
    SELECT id INTO v_bot_profile_id FROM bot_profiles WHERE user_id = p_bot_user_id;
    IF v_bot_profile_id IS NULL THEN
        RAISE EXCEPTION 'User is not a registered bot';
    END IF;

    -- Get post author
    SELECT user_id INTO v_post_author_id FROM posts WHERE id = p_post_id;
    IF v_post_author_id IS NULL THEN
        RAISE EXCEPTION 'Post not found';
    END IF;

    -- Only like if not already liked
    IF NOT EXISTS (SELECT 1 FROM post_likes WHERE post_id = p_post_id AND user_id = p_bot_user_id) THEN
        INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, p_bot_user_id);
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = p_post_id;

        -- Award XP to post author (if not self-like)
        IF v_post_author_id != p_bot_user_id THEN
            UPDATE profiles SET xp = xp + 1 WHERE id = v_post_author_id;
        END IF;

        -- Log activity
        INSERT INTO bot_activity_log (bot_profile_id, action_type, target_id)
        VALUES (v_bot_profile_id, 'like', p_post_id);
    END IF;

    RETURN json_build_object('success', true);
END;
$$;

-- =====================================================
-- 7. RPC: bot_follow_user
-- Follows a user as a bot
-- =====================================================

CREATE OR REPLACE FUNCTION bot_follow_user(
    p_bot_user_id uuid,
    p_target_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bot_profile_id uuid;
BEGIN
    -- Verify this is actually a bot
    SELECT id INTO v_bot_profile_id FROM bot_profiles WHERE user_id = p_bot_user_id;
    IF v_bot_profile_id IS NULL THEN
        RAISE EXCEPTION 'User is not a registered bot';
    END IF;

    -- Can't follow self
    IF p_bot_user_id = p_target_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Cannot follow self');
    END IF;

    -- Only follow if not already following
    IF NOT EXISTS (SELECT 1 FROM user_follows WHERE follower_id = p_bot_user_id AND following_id = p_target_user_id) THEN
        INSERT INTO user_follows (follower_id, following_id) VALUES (p_bot_user_id, p_target_user_id);
        UPDATE profiles SET followers_count = followers_count + 1 WHERE id = p_target_user_id;
        UPDATE profiles SET following_count = following_count + 1 WHERE id = p_bot_user_id;

        -- Award XP to followed user
        UPDATE profiles SET xp = xp + 3 WHERE id = p_target_user_id;

        -- Log activity
        INSERT INTO bot_activity_log (bot_profile_id, action_type, target_id)
        VALUES (v_bot_profile_id, 'follow', p_target_user_id);
    END IF;

    RETURN json_build_object('success', true);
END;
$$;

-- =====================================================
-- 8. RPC: get_bot_stats (for Admin panel)
-- =====================================================

CREATE OR REPLACE FUNCTION get_bot_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result json;
BEGIN
    SELECT json_build_object(
        'total_bots', (SELECT COUNT(*) FROM bot_profiles),
        'active_bots', (SELECT COUNT(*) FROM bot_profiles WHERE is_active = true),
        'total_posts', (SELECT COUNT(*) FROM bot_activity_log WHERE action_type = 'post'),
        'total_comments', (SELECT COUNT(*) FROM bot_activity_log WHERE action_type = 'comment'),
        'total_likes', (SELECT COUNT(*) FROM bot_activity_log WHERE action_type = 'like'),
        'posts_today', (SELECT COUNT(*) FROM bot_activity_log WHERE action_type = 'post' AND created_at > now() - interval '24 hours'),
        'comments_today', (SELECT COUNT(*) FROM bot_activity_log WHERE action_type = 'comment' AND created_at > now() - interval '24 hours'),
        'last_activity', (SELECT MAX(created_at) FROM bot_activity_log)
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- =====================================================
-- 9. RLS POLICIES
-- =====================================================

ALTER TABLE bot_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_activity_log ENABLE ROW LEVEL SECURITY;

-- Bot profiles: only viewable by service role (admin)
CREATE POLICY "Bot profiles are viewable by service role" ON bot_profiles FOR SELECT USING (true);
CREATE POLICY "Bot profiles are insertable by service role" ON bot_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Bot profiles are updatable by service role" ON bot_profiles FOR UPDATE USING (true);

-- Bot activity log: only viewable by service role (admin)
CREATE POLICY "Bot activity log is viewable by service role" ON bot_activity_log FOR SELECT USING (true);
CREATE POLICY "Bot activity log is insertable by service role" ON bot_activity_log FOR INSERT WITH CHECK (true);

COMMIT;

-- =====================================================
-- SUCCESS
-- =====================================================
SELECT '🤖 Community Bots Migration concluída com sucesso!' AS status;
