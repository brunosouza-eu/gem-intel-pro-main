-- Add has_course_access to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_course_access boolean DEFAULT false;

-- Create table to store purchases for emails that might not be registered yet
CREATE TABLE IF NOT EXISTS pending_purchases (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    offer_code text NOT NULL,
    transaction_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    claimed boolean DEFAULT false,
    claimed_at timestamp with time zone,
    user_id uuid REFERENCES auth.users(id)
);

-- Index for fast lookup by email during signup
CREATE INDEX IF NOT EXISTS pending_purchases_email_idx ON pending_purchases(email);

-- Function to claim pending purchases (called on login/signup)
CREATE OR REPLACE FUNCTION claim_pending_purchases()
RETURNS void AS $$
DECLARE
    v_user_email text;
    v_user_id uuid;
    v_purchase record;
    v_current_plan text;
    v_current_credits integer;
    v_new_plan text;
    v_add_credits integer := 0;
    v_give_course boolean := false;
BEGIN
    -- Get current user email and ID
    v_user_id := auth.uid();
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

    IF v_user_email IS NULL THEN
        RETURN;
    END IF;

    -- Get user profile
    SELECT plan, COALESCE(credits, 0) INTO v_current_plan, v_current_credits FROM profiles WHERE id = v_user_id;
    v_new_plan := v_current_plan;

    -- Loop through unclaimed purchases for this email
    FOR v_purchase IN 
        SELECT * FROM pending_purchases 
        WHERE email = v_user_email AND claimed = false
        ORDER BY created_at ASC
    LOOP
        -- Determine benefits based on offer_code
        IF v_purchase.offer_code IN ('66pn89ja', 'mcw7ajf5') THEN
            -- Pro
            IF v_new_plan != 'elite' THEN
                v_new_plan := 'pro';
            END IF;
            v_give_course := true;
        ELSIF v_purchase.offer_code IN ('8rkh4vnv', 'qg9w13pa') THEN
            -- Elite
            v_new_plan := 'elite';
            v_give_course := true;
        ELSIF v_purchase.offer_code = 'f7eld6ze' THEN
            -- 30 Credits + Course
            v_add_credits := v_add_credits + 30;
            v_give_course := true;
        ELSIF v_purchase.offer_code = 'g0shftr1' THEN
            -- 100 Credits + Course
            v_add_credits := v_add_credits + 100;
            v_give_course := true;
        ELSIF v_purchase.offer_code = 'sj4n59vd' THEN
            -- Course + 30 Credits
            v_add_credits := v_add_credits + 30;
            v_give_course := true;
        END IF;

        -- Mark as claimed
        UPDATE pending_purchases 
        SET claimed = true, claimed_at = now(), user_id = v_user_id
        WHERE id = v_purchase.id;
    END LOOP;

    -- Apply changes to profile if any purchases were claimed
    IF v_new_plan != v_current_plan OR v_add_credits > 0 OR v_give_course = true THEN
        UPDATE profiles 
        SET 
            plan = v_new_plan,
            credits = v_current_credits + v_add_credits,
            has_course_access = CASE WHEN v_give_course THEN true ELSE has_course_access END
        WHERE id = v_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
