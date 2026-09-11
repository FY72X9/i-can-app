-- ==============================================================================
-- SUPERSEDED by schema_final.sql — do not run this file anymore, kept for history.
-- ==============================================================================
-- I-CAN PLATFORM — MAKE APP WORK ONLINE FOR MULTIPLE USERS/DEVICES
-- Run this in Supabase Dashboard > SQL Editor (after fix_all_tables.sql)
--
-- Problem fixed:
-- 1. `actions` SELECT policy required auth.uid(), but the app's NIM/BN login
--    never creates a real Supabase Auth session, so auth.uid() is always NULL
--    and users could not read back their own submitted actions.
-- 2. Local (non-Supabase-Auth) accounts and their passwords only ever lived in
--    each browser's localStorage. There was no server-side login/verification,
--    so an account created/logged-in on one device did not exist for others.
--    This adds a locked-down credentials table + SECURITY DEFINER RPCs so
--    login/registration can be verified centrally without ever exposing
--    password hashes through the public REST API.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Loosen `actions` SELECT policy (auth.uid() is unreliable with custom auth)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read approved actions" ON public.actions;
DROP POLICY IF EXISTS "Verifiers can read all actions" ON public.actions;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'actions' AND policyname = 'Public read actions') THEN
    CREATE POLICY "Public read actions" ON public.actions FOR SELECT USING (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Soft-delete tracking columns on public.users (used by admin deactivate/restore)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='faculty_name') THEN
    ALTER TABLE public.users ADD COLUMN faculty_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_deleted') THEN
    ALTER TABLE public.users ADD COLUMN is_deleted BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='deleted_at') THEN
    ALTER TABLE public.users ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Locked-down credentials table — RLS enabled, NO policies attached, so the
--    anon/authenticated PostgREST API can never SELECT/INSERT/UPDATE it directly.
--    Only the SECURITY DEFINER functions below (which run as the table owner)
--    can touch it.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_credentials (
    nim TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_credentials FROM anon, authenticated;

-- ------------------------------------------------------------------------------
-- 4. RPC: create/update a local account profile + (optionally) its password hash
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.upsert_local_account(
  p_nim TEXT,
  p_email TEXT,
  p_full_name TEXT,
  p_role TEXT,
  p_faculty_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_password_hash TEXT DEFAULT NULL,
  p_total_green_coins INT DEFAULT 50,
  p_total_sat_points INT DEFAULT 0,
  p_total_carbon_saved NUMERIC DEFAULT 0,
  p_streak_days INT DEFAULT 1
) RETURNS public.users
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user public.users;
BEGIN
  INSERT INTO public.users (
    nim, email, full_name, role, faculty_name, avatar_url,
    total_green_coins, total_sat_points, total_carbon_saved, streak_days
  )
  VALUES (
    p_nim, p_email, p_full_name, p_role, p_faculty_name, p_avatar_url,
    p_total_green_coins, p_total_sat_points, p_total_carbon_saved, p_streak_days
  )
  ON CONFLICT (nim) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    faculty_name = EXCLUDED.faculty_name,
    avatar_url = EXCLUDED.avatar_url
  RETURNING * INTO v_user;

  IF p_password_hash IS NOT NULL THEN
    INSERT INTO public.user_credentials (nim, password_hash)
    VALUES (p_nim, p_password_hash)
    ON CONFLICT (nim) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW();
  END IF;

  RETURN v_user;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_local_account(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INT, INT, NUMERIC, INT) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 5. RPC: verify a NIM/BN or email login against the credentials table.
--    Returns the matching users row, or no rows if the password doesn't match.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.login_local_account(
  p_identifier TEXT,
  p_password_hash TEXT
) RETURNS public.users
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user public.users;
BEGIN
  SELECT u.* INTO v_user
  FROM public.users u
  JOIN public.user_credentials c ON c.nim = u.nim
  WHERE (LOWER(u.nim) = LOWER(p_identifier) OR LOWER(u.email) = LOWER(p_identifier))
    AND c.password_hash = p_password_hash
    AND COALESCE(u.is_deleted, false) = false
  LIMIT 1;

  RETURN v_user; -- NULL row when nothing matches
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_local_account(TEXT, TEXT) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 6. VERIFY
-- ------------------------------------------------------------------------------
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
