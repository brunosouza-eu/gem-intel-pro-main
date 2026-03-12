-- Add buyer_name to pending_purchases
ALTER TABLE pending_purchases ADD COLUMN IF NOT EXISTS buyer_name text;
