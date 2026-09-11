-- ==============================================================================
-- SUPERSEDED by schema_final.sql — do not run this file anymore, kept for history.
-- ==============================================================================
-- I-CAN PLATFORM — FIX actions TABLE FIELDS THAT DON'T MATCH THE APP'S FORMS
-- Run this in Supabase Dashboard > SQL Editor (after fix_online_multiuser.sql)
--
-- Problems found while auditing form data vs. the database schema:
--
-- 1. actions.user_id is `UUID REFERENCES public.users(id)`, but the app's
--    logged-in user id is either a local string like "usr-1699999999999"
--    (non-Supabase-Auth accounts) or a Supabase Auth UUID that was never
--    inserted into public.users. Neither matches a real public.users.id, so
--    EVERY action insert was rejected by Postgres ("invalid input syntax for
--    type uuid" / FK violation) and silently fell back to localStorage only.
--
-- 2. actions.category_id is `UUID NOT NULL REFERENCES public.action_categories(id)`,
--    but the app always sends a plain text id from action_programs / daily_quests
--    / events (e.g. "prog-hemat-listrik", "evt-xxx") — never a real
--    action_categories UUID. Same failure as #1.
--
-- 3. actions.verified_by is `UUID REFERENCES public.users(id)`, but the app
--    sends the verifier's display NAME (e.g. "Siska Amanda (SSO)"), not a UUID.
--
-- Fix: drop these FKs/UUID typing (this app already uses free-text ids with no
-- FK for events/daily_quests/action_programs) and store the display fields
-- (user name, category name/icon) directly on the row so reads never depend on
-- a PostgREST embedded-relationship join that would break once the FK is gone.
-- ==============================================================================

ALTER TABLE public.actions DROP CONSTRAINT IF EXISTS actions_user_id_fkey;
ALTER TABLE public.actions ALTER COLUMN user_id TYPE TEXT USING user_id::text;

ALTER TABLE public.actions DROP CONSTRAINT IF EXISTS actions_category_id_fkey;
ALTER TABLE public.actions ALTER COLUMN category_id DROP NOT NULL;
ALTER TABLE public.actions ALTER COLUMN category_id TYPE TEXT USING category_id::text;

ALTER TABLE public.actions DROP CONSTRAINT IF EXISTS actions_verified_by_fkey;
ALTER TABLE public.actions ALTER COLUMN verified_by TYPE TEXT USING verified_by::text;

-- Denormalized display fields so getActions() never needs an FK-based join
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='user_name') THEN
    ALTER TABLE public.actions ADD COLUMN user_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='category_name') THEN
    ALTER TABLE public.actions ADD COLUMN category_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='category_icon') THEN
    ALTER TABLE public.actions ADD COLUMN category_icon TEXT;
  END IF;
END $$;

-- VERIFY
SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'actions' ORDER BY ordinal_position;
