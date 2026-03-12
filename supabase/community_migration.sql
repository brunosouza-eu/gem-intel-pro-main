-- =====================================================
-- COMMUNITY SYSTEM MIGRATION
-- Social features: Posts, Likes, Comments, Follows
-- =====================================================

BEGIN;

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content text NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
    post_type text NOT NULL CHECK (post_type IN ('insight', 'analysis', 'question', 'alert_share')),
    token_id uuid REFERENCES tokens(id) ON DELETE SET NULL,
    analysis_id uuid REFERENCES token_analysis(id) ON DELETE SET NULL,
    media_urls text[],
    likes_count integer DEFAULT 0 CHECK (likes_count >= 0),
    comments_count integer DEFAULT 0 CHECK (comments_count >= 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Post likes table
CREATE TABLE IF NOT EXISTS post_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- Post comments table
CREATE TABLE IF NOT EXISTS post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
    content text NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 500),
    likes_count integer DEFAULT 0 CHECK (likes_count >= 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id uuid NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(comment_id, user_id)
);

-- User follows table
CREATE TABLE IF NOT EXISTS user_follows (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- =====================================================
-- 2. UPDATE PROFILES TABLE
-- =====================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS followers_count integer DEFAULT 0 CHECK (followers_count >= 0),
ADD COLUMN IF NOT EXISTS following_count integer DEFAULT 0 CHECK (following_count >= 0),
ADD COLUMN IF NOT EXISTS posts_count integer DEFAULT 0 CHECK (posts_count >= 0),
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS website text;

-- =====================================================
-- 3. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_token_id ON posts(token_id) WHERE token_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

-- =====================================================
-- 4. CREATE RPC: create_post
-- =====================================================

CREATE OR REPLACE FUNCTION create_post(
    p_content text,
    p_post_type text,
    p_token_id uuid DEFAULT NULL,
    p_analysis_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_post posts;
BEGIN
    -- Get authenticated user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Insert post
    INSERT INTO posts (user_id, content, post_type, token_id, analysis_id)
    VALUES (v_user_id, p_content, p_post_type, p_token_id, p_analysis_id)
    RETURNING * INTO v_post;

    -- Update user's posts count
    UPDATE profiles 
    SET posts_count = posts_count + 1
    WHERE id = v_user_id;

    -- Award XP
    UPDATE profiles
    SET xp = xp + 10
    WHERE id = v_user_id;

    RETURN json_build_object(
        'success', true,
        'post', row_to_json(v_post)
    );
END;
$$;

-- =====================================================
-- 5. CREATE RPC: toggle_post_like
-- =====================================================

CREATE OR REPLACE FUNCTION toggle_post_like(p_post_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_liked boolean;
    v_likes_count integer;
    v_post_author_id uuid;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get post author
    SELECT user_id INTO v_post_author_id FROM posts WHERE id = p_post_id;
    IF v_post_author_id IS NULL THEN
        RAISE EXCEPTION 'Post not found';
    END IF;

    -- Check if already liked
    IF EXISTS (SELECT 1 FROM post_likes WHERE post_id = p_post_id AND user_id = v_user_id) THEN
        -- Unlike
        DELETE FROM post_likes WHERE post_id = p_post_id AND user_id = v_user_id;
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = p_post_id;
        v_liked := false;
    ELSE
        -- Like
        INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, v_user_id);
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
        
        -- Award XP to liker
        UPDATE profiles SET xp = xp + 2 WHERE id = v_user_id;
        
        -- Award XP to post author (if not self-like)
        IF v_post_author_id != v_user_id THEN
            UPDATE profiles SET xp = xp + 1 WHERE id = v_post_author_id;
        END IF;
        
        v_liked := true;
    END IF;

    -- Get updated count
    SELECT likes_count INTO v_likes_count FROM posts WHERE id = p_post_id;

    RETURN json_build_object(
        'success', true,
        'liked', v_liked,
        'likes_count', v_likes_count
    );
END;
$$;

-- =====================================================
-- 6. CREATE RPC: add_comment
-- =====================================================

CREATE OR REPLACE FUNCTION add_comment(
    p_post_id uuid,
    p_content text,
    p_parent_comment_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_comment post_comments;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Insert comment
    INSERT INTO post_comments (post_id, user_id, content, parent_comment_id)
    VALUES (p_post_id, v_user_id, p_content, p_parent_comment_id)
    RETURNING * INTO v_comment;

    -- Update post's comments count
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = p_post_id;

    -- Award XP
    UPDATE profiles SET xp = xp + 5 WHERE id = v_user_id;

    RETURN json_build_object(
        'success', true,
        'comment', row_to_json(v_comment)
    );
END;
$$;

-- =====================================================
-- 7. CREATE RPC: toggle_comment_like
-- =====================================================

CREATE OR REPLACE FUNCTION toggle_comment_like(p_comment_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_liked boolean;
    v_likes_count integer;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Check if already liked
    IF EXISTS (SELECT 1 FROM comment_likes WHERE comment_id = p_comment_id AND user_id = v_user_id) THEN
        -- Unlike
        DELETE FROM comment_likes WHERE comment_id = p_comment_id AND user_id = v_user_id;
        UPDATE post_comments SET likes_count = likes_count - 1 WHERE id = p_comment_id;
        v_liked := false;
    ELSE
        -- Like
        INSERT INTO comment_likes (comment_id, user_id) VALUES (p_comment_id, v_user_id);
        UPDATE post_comments SET likes_count = likes_count + 1 WHERE id = p_comment_id;
        v_liked := true;
    END IF;

    -- Get updated count
    SELECT likes_count INTO v_likes_count FROM post_comments WHERE id = p_comment_id;

    RETURN json_build_object(
        'success', true,
        'liked', v_liked,
        'likes_count', v_likes_count
    );
END;
$$;

-- =====================================================
-- 8. CREATE RPC: toggle_follow
-- =====================================================

CREATE OR REPLACE FUNCTION toggle_follow(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_follower_id uuid;
    v_following boolean;
    v_followers_count integer;
BEGIN
    v_follower_id := auth.uid();
    IF v_follower_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF v_follower_id = p_user_id THEN
        RAISE EXCEPTION 'Cannot follow yourself';
    END IF;

    -- Check if already following
    IF EXISTS (SELECT 1 FROM user_follows WHERE follower_id = v_follower_id AND following_id = p_user_id) THEN
        -- Unfollow
        DELETE FROM user_follows WHERE follower_id = v_follower_id AND following_id = p_user_id;
        UPDATE profiles SET followers_count = followers_count - 1 WHERE id = p_user_id;
        UPDATE profiles SET following_count = following_count - 1 WHERE id = v_follower_id;
        v_following := false;
    ELSE
        -- Follow
        INSERT INTO user_follows (follower_id, following_id) VALUES (v_follower_id, p_user_id);
        UPDATE profiles SET followers_count = followers_count + 1 WHERE id = p_user_id;
        UPDATE profiles SET following_count = following_count + 1 WHERE id = v_follower_id;
        
        -- Award XP to follower
        UPDATE profiles SET xp = xp + 5 WHERE id = v_follower_id;
        
        -- Award XP to followed user
        UPDATE profiles SET xp = xp + 3 WHERE id = p_user_id;
        
        v_following := true;
    END IF;

    -- Get updated count
    SELECT followers_count INTO v_followers_count FROM profiles WHERE id = p_user_id;

    RETURN json_build_object(
        'success', true,
        'following', v_following,
        'followers_count', v_followers_count
    );
END;
$$;

-- =====================================================
-- 9. CREATE RPC: get_feed
-- =====================================================

CREATE OR REPLACE FUNCTION get_feed(
    p_page integer DEFAULT 0,
    p_limit integer DEFAULT 20,
    p_filter text DEFAULT 'recent' -- 'recent', 'following', 'trending'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_offset integer;
    v_posts json;
BEGIN
    v_user_id := auth.uid();
    v_offset := p_page * p_limit;

    IF p_filter = 'following' AND v_user_id IS NOT NULL THEN
        -- Posts from followed users
        SELECT json_agg(post_data ORDER BY created_at DESC)
        INTO v_posts
        FROM (
            SELECT 
                p.*,
                pr.username,
                pr.avatar_url,
                pr.level,
                EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = v_user_id) as user_liked
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            WHERE p.user_id IN (SELECT following_id FROM user_follows WHERE follower_id = v_user_id)
            ORDER BY p.created_at DESC
            LIMIT p_limit OFFSET v_offset
        ) post_data;
    ELSIF p_filter = 'trending' THEN
        -- Trending posts (most likes in last 7 days)
        SELECT json_agg(post_data ORDER BY score DESC, created_at DESC)
        INTO v_posts
        FROM (
            SELECT 
                p.*,
                pr.username,
                pr.avatar_url,
                pr.level,
                EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = v_user_id) as user_liked,
                (p.likes_count * 2 + p.comments_count) as score
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            WHERE p.created_at > now() - interval '7 days'
            ORDER BY score DESC, p.created_at DESC
            LIMIT p_limit OFFSET v_offset
        ) post_data;
    ELSE
        -- Recent posts (default)
        SELECT json_agg(post_data ORDER BY created_at DESC)
        INTO v_posts
        FROM (
            SELECT 
                p.*,
                pr.username,
                pr.avatar_url,
                pr.level,
                EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = v_user_id) as user_liked
            FROM posts p
            JOIN profiles pr ON p.user_id = pr.id
            ORDER BY p.created_at DESC
            LIMIT p_limit OFFSET v_offset
        ) post_data;
    END IF;

    RETURN COALESCE(v_posts, '[]'::json);
END;
$$;

-- =====================================================
-- 10. CREATE RPC: get_user_posts
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_posts(
    p_user_id uuid,
    p_page integer DEFAULT 0,
    p_limit integer DEFAULT 20
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_user_id uuid;
    v_offset integer;
    v_posts json;
BEGIN
    v_current_user_id := auth.uid();
    v_offset := p_page * p_limit;

    SELECT json_agg(post_data ORDER BY created_at DESC)
    INTO v_posts
    FROM (
        SELECT 
            p.*,
            pr.username,
            pr.avatar_url,
            pr.level,
            EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = v_current_user_id) as user_liked
        FROM posts p
        JOIN profiles pr ON p.user_id = pr.id
        WHERE p.user_id = p_user_id
        ORDER BY p.created_at DESC
        LIMIT p_limit OFFSET v_offset
    ) post_data;

    RETURN COALESCE(v_posts, '[]'::json);
END;
$$;

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Post likes are viewable by everyone" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Comments are viewable by everyone" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- User follows policies
CREATE POLICY "Follows are viewable by everyone" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

COMMIT;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Community System Migration concluída com sucesso!' AS status;
