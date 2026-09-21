-- ==============================================================================
-- I-CAN PLATFORM — FINAL CONSOLIDATED DATABASE SCHEMA
-- Run this ONE file in Supabase Dashboard > SQL Editor (top to bottom).
--
-- This replaces running these files separately:
--   schema.sql, fix_all_tables.sql, fix_users_insert.sql,
--   fix_online_multiuser.sql, fix_actions_schema_mismatch.sql
-- (keep those only for historical reference — do not run them anymore)
--
-- Safe to run on a brand-new empty Supabase project AND on a project that
-- already ran some/all of the older fix_*.sql files: every statement is
-- idempotent (CREATE ... IF NOT EXISTS / DROP ... IF EXISTS / guarded DO blocks).
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- provides gen_random_uuid()

-- ------------------------------------------------------------------------------
-- 1. MASTER DATA
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    total_carbon_saved NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy master-data table kept for backward compatibility. The app no longer
-- reads/writes it directly (categorization now lives in action_programs), but
-- other tools/reports may still reference it, so it is not dropped.
CREATE TABLE IF NOT EXISTS public.action_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    emission_factor NUMERIC(6, 3) DEFAULT 0.0,
    base_coins INT DEFAULT 0,
    sat_point_awarded INT DEFAULT 0,
    comserv_hours NUMERIC(4, 1) DEFAULT 0.0,
    sdg_target VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. USERS — no FK to auth.users (app uses its own local/NIM-based accounts)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nim VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'VERIFIER', 'ADMIN')),
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    faculty_name TEXT,
    avatar_url TEXT,
    total_green_coins INT DEFAULT 0 CHECK (total_green_coins >= 0),
    total_sat_points INT DEFAULT 0 CHECK (total_sat_points >= 0),
    total_carbon_saved NUMERIC(10, 2) DEFAULT 0.00,
    streak_days INT DEFAULT 0,
    last_action_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Normalize an already-existing users table (created by an older script) to the final shape
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
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

-- Locked-down credentials for locally-registered (non-Supabase-Auth) accounts.
-- RLS is enabled with NO policies, so anon/authenticated can NEVER read/write it
-- via the REST API directly — only the SECURITY DEFINER RPCs below can.
CREATE TABLE IF NOT EXISTS public.user_credentials (
    nim TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_credentials FROM anon, authenticated;

-- ------------------------------------------------------------------------------
-- 3. CAMPUS EVENTS, DAILY QUESTS, ACTION PROGRAMS — free-text ids, no FK
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    organizer_id TEXT NOT NULL,
    organizer_name TEXT NOT NULL DEFAULT 'Student Service Office (SSO)',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    banner_url TEXT DEFAULT '',
    media_urls JSONB DEFAULT '[]'::jsonb,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    time_range TEXT,
    location TEXT,
    dress_code TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    allow_group_members BOOLEAN DEFAULT false,
    max_group_members INT DEFAULT 3,
    activities JSONB DEFAULT '[]'::jsonb,
    hashtags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_quests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "desc" TEXT DEFAULT '',
    reward TEXT DEFAULT '',
    coins_reward INT DEFAULT 0,
    sat_reward INT DEFAULT 0,
    deadline TEXT DEFAULT 'Sisa Hari Ini',
    completed BOOLEAN DEFAULT false,
    action_url TEXT,
    hashtags JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.action_programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT '',
    category_type TEXT DEFAULT 'SELF_GREEN_CAMPAIGN',
    sat_points INT DEFAULT 0,
    comserv_hours NUMERIC(4, 1) DEFAULT 0.0,
    coins INT DEFAULT 0,
    co2 TEXT DEFAULT '0.0 kg',
    icon TEXT DEFAULT 'Leaf',
    color TEXT DEFAULT 'from-emerald-600 to-eco-800',
    tag TEXT DEFAULT '',
    urgency TEXT DEFAULT '',
    description TEXT DEFAULT '',
    sample_photos JSONB DEFAULT '[]'::jsonb,
    suggested_prompt TEXT,
    hashtags JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    "order" INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 4. ACTIONS — user_id/category_id/verified_by are free TEXT, no FK.
-- The app's account id is a local string or an unlinked Supabase Auth UUID,
-- never a real public.users.id, so a UUID FK here would reject every insert.
-- Display fields (user_name, category_name, category_icon) are denormalized
-- onto the row so reads never depend on a PostgREST embedded-relationship join.
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    user_name TEXT,
    category_id TEXT,
    category_name TEXT,
    category_icon TEXT,
    submission_type VARCHAR(50) DEFAULT 'SELF_GREEN_CAMPAIGN',
    event_id TEXT,
    event_activity_id TEXT,
    quest_id TEXT,
    action_source TEXT DEFAULT 'SELF_GREEN_CAMPAIGN',
    photo_url TEXT NOT NULL,
    group_photo_url TEXT,
    additional_photos JSONB DEFAULT '[]'::jsonb,
    campaign_url TEXT,
    video_url TEXT,
    group_members JSONB DEFAULT '[]'::jsonb,
    story TEXT,
    gps_lat NUMERIC(10, 7),
    gps_lng NUMERIC(10, 7),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    decision VARCHAR(30) DEFAULT NULL CHECK (decision IN ('APPROVED_COINS_ONLY', 'APPROVED_FULL', 'REJECTED')),
    is_survey_proposal BOOLEAN DEFAULT false,
    action_step TEXT,
    survey_location TEXT,
    partner_name TEXT,
    safety_assessed BOOLEAN DEFAULT false,
    ai_confidence NUMERIC(4, 2) DEFAULT NULL,
    ai_guideline_score NUMERIC(4, 2) DEFAULT NULL,
    ai_completeness_score NUMERIC(4, 2) DEFAULT NULL,
    ai_analysis_reason TEXT,
    green_coins_earned INT DEFAULT 0,
    carbon_impact_kg NUMERIC(8, 3) DEFAULT 0.000,
    sat_points_earned INT DEFAULT 0,
    comserv_hours NUMERIC(4, 1) DEFAULT 0.0,
    guideline_complied BOOLEAN DEFAULT false,
    real_activity_verified BOOLEAN DEFAULT false,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    rejection_reason TEXT
);

-- Normalize an already-existing actions table (created by an older script) to the final shape
ALTER TABLE public.actions DROP CONSTRAINT IF EXISTS actions_user_id_fkey;
ALTER TABLE public.actions ALTER COLUMN user_id TYPE TEXT USING user_id::text;
ALTER TABLE public.actions DROP CONSTRAINT IF EXISTS actions_category_id_fkey;
ALTER TABLE public.actions ALTER COLUMN category_id DROP NOT NULL;
ALTER TABLE public.actions ALTER COLUMN category_id TYPE TEXT USING category_id::text;
ALTER TABLE public.actions DROP CONSTRAINT IF EXISTS actions_verified_by_fkey;
ALTER TABLE public.actions ALTER COLUMN verified_by TYPE TEXT USING verified_by::text;
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
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='event_id') THEN
    ALTER TABLE public.actions ADD COLUMN event_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='event_activity_id') THEN
    ALTER TABLE public.actions ADD COLUMN event_activity_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='quest_id') THEN
    ALTER TABLE public.actions ADD COLUMN quest_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='action_source') THEN
    ALTER TABLE public.actions ADD COLUMN action_source TEXT DEFAULT 'SELF_GREEN_CAMPAIGN';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='group_photo_url') THEN
    ALTER TABLE public.actions ADD COLUMN group_photo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='additional_photos') THEN
    ALTER TABLE public.actions ADD COLUMN additional_photos JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='is_survey_proposal') THEN
    ALTER TABLE public.actions ADD COLUMN is_survey_proposal BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='action_step') THEN
    ALTER TABLE public.actions ADD COLUMN action_step TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='survey_location') THEN
    ALTER TABLE public.actions ADD COLUMN survey_location TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='partner_name') THEN
    ALTER TABLE public.actions ADD COLUMN partner_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='actions' AND column_name='safety_assessed') THEN
    ALTER TABLE public.actions ADD COLUMN safety_assessed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. LEGACY TABLES — kept for backward compatibility, unused by the current app
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_id UUID NOT NULL REFERENCES public.actions(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    decision VARCHAR(30) NOT NULL CHECK (decision IN ('APPROVED_COINS_ONLY', 'APPROVED_FULL', 'REJECTED')),
    notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sat_recognitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action_id UUID NOT NULL REFERENCES public.actions(id) ON DELETE CASCADE,
    activity_title VARCHAR(200) NOT NULL,
    sat_points_awarded INT NOT NULL CHECK (sat_points_awarded > 0),
    comserv_hours_awarded NUMERIC(4, 1) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'EXPORTED', 'SYNCED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    criteria VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- ------------------------------------------------------------------------------
-- 6. SEED MASTER DATA
-- ------------------------------------------------------------------------------

INSERT INTO public.faculties (name, code, total_carbon_saved) VALUES
    ('School of Computer Science', 'SOCS', 42.50),
    ('School of Information Systems', 'SIS', 38.20),
    ('School of Design', 'SOD', 25.10),
    ('Binus Business School', 'BBS', 29.80),
    ('Faculty of Engineering', 'FOE', 18.40)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.badges (name, description, icon, criteria) VALUES
    ('First Step Green', 'Melakukan aksi hijau kampus pertama kali', 'Award', 'actions_1'),
    ('Streak Master', 'Menjaga habit loop aksi hijau 5 hari berturut-turut', 'Flame', 'streak_5'),
    ('TFI Community Hero', 'Menyelesaikan aksi nyata TFI (Pohon/Biopori/Wastafel)', 'TreePine', 'tfi_action_1'),
    ('BEKEN Nominee', 'Masuk ke dalam jajaran top ranker Green Leaderboard tahunan', 'Trophy', 'beken_top_10')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY — final, permissive policies actually used by the app
--    (custom NIM/BN auth means auth.uid() is unreliable, so access control is
--    enforced in the RPCs/app layer, not per-row via auth.uid()).
-- ------------------------------------------------------------------------------

ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_recognitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faculties' AND policyname = 'Public read faculties') THEN
    CREATE POLICY "Public read faculties" ON public.faculties FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'action_categories' AND policyname = 'Public read categories') THEN
    CREATE POLICY "Public read categories" ON public.action_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'badges' AND policyname = 'Public read badges') THEN
    CREATE POLICY "Public read badges" ON public.badges FOR SELECT USING (true);
  END IF;
END $$;

-- users: drop legacy auth.uid()-based policies, keep only the permissive ones
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read other profiles in leaderboard" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Public read users') THEN
    CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow insert users') THEN
    CREATE POLICY "Allow insert users" ON public.users FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow update users') THEN
    CREATE POLICY "Allow update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow delete users') THEN
    CREATE POLICY "Allow delete users" ON public.users FOR DELETE USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public read events') THEN
    CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow insert events') THEN
    CREATE POLICY "Allow insert events" ON public.events FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow update events') THEN
    CREATE POLICY "Allow update events" ON public.events FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow delete events') THEN
    CREATE POLICY "Allow delete events" ON public.events FOR DELETE USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_quests' AND policyname = 'Public read daily_quests') THEN
    CREATE POLICY "Public read daily_quests" ON public.daily_quests FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_quests' AND policyname = 'Allow insert daily_quests') THEN
    CREATE POLICY "Allow insert daily_quests" ON public.daily_quests FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_quests' AND policyname = 'Allow update daily_quests') THEN
    CREATE POLICY "Allow update daily_quests" ON public.daily_quests FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_quests' AND policyname = 'Allow delete daily_quests') THEN
    CREATE POLICY "Allow delete daily_quests" ON public.daily_quests FOR DELETE USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'action_programs' AND policyname = 'Public read action_programs') THEN
    CREATE POLICY "Public read action_programs" ON public.action_programs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'action_programs' AND policyname = 'Allow insert action_programs') THEN
    CREATE POLICY "Allow insert action_programs" ON public.action_programs FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'action_programs' AND policyname = 'Allow update action_programs') THEN
    CREATE POLICY "Allow update action_programs" ON public.action_programs FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'action_programs' AND policyname = 'Allow delete action_programs') THEN
    CREATE POLICY "Allow delete action_programs" ON public.action_programs FOR DELETE USING (true);
  END IF;
END $$;

-- actions: drop legacy auth.uid()-based policies (unreliable with custom NIM/BN auth)
DROP POLICY IF EXISTS "Users can read approved actions" ON public.actions;
DROP POLICY IF EXISTS "Users can insert own actions" ON public.actions;
DROP POLICY IF EXISTS "Users can update own pending action" ON public.actions;
DROP POLICY IF EXISTS "Verifiers can read all actions" ON public.actions;
DROP POLICY IF EXISTS "Verifiers can update action status" ON public.actions;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'actions' AND policyname = 'Public read actions') THEN
    CREATE POLICY "Public read actions" ON public.actions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'actions' AND policyname = 'Allow insert actions') THEN
    CREATE POLICY "Allow insert actions" ON public.actions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'actions' AND policyname = 'Allow update actions') THEN
    CREATE POLICY "Allow update actions" ON public.actions FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7b. Action Verification Trigger: Syncs total_green_coins & SAT to public.users
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_action_verification()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'APPROVED' AND (OLD.status IS NULL OR OLD.status <> 'APPROVED')) THEN
        UPDATE public.users
        SET 
            total_green_coins = COALESCE(total_green_coins, 0) + COALESCE(NEW.green_coins_earned, 0),
            total_sat_points = COALESCE(total_sat_points, 0) + (CASE WHEN NEW.decision = 'APPROVED_FULL' THEN COALESCE(NEW.sat_points_earned, 0) ELSE 0 END),
            total_carbon_saved = COALESCE(total_carbon_saved, 0) + COALESCE(NEW.carbon_impact_kg, 0)
        WHERE id::text = NEW.user_id OR nim = NEW.user_id;
    ELSIF (OLD.status = 'APPROVED' AND NEW.status <> 'APPROVED') THEN
        UPDATE public.users
        SET 
            total_green_coins = GREATEST(0, COALESCE(total_green_coins, 0) - COALESCE(OLD.green_coins_earned, 0)),
            total_sat_points = GREATEST(0, COALESCE(total_sat_points, 0) - (CASE WHEN OLD.decision = 'APPROVED_FULL' THEN COALESCE(OLD.sat_points_earned, 0) ELSE 0 END)),
            total_carbon_saved = GREATEST(0, COALESCE(total_carbon_saved, 0) - COALESCE(OLD.carbon_impact_kg, 0))
        WHERE id::text = OLD.user_id OR nim = OLD.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_action_verification ON public.actions;
CREATE TRIGGER trg_action_verification
AFTER UPDATE OF status, decision ON public.actions
FOR EACH ROW
EXECUTE FUNCTION public.handle_action_verification();

-- Legacy tables (unused by the app) — RLS enabled, no public policies attached
DROP POLICY IF EXISTS "Users can read own SAT recognitions" ON public.sat_recognitions;
DROP POLICY IF EXISTS "Verifiers can manage SAT recognitions" ON public.sat_recognitions;
DROP POLICY IF EXISTS "Verifiers can insert logs" ON public.verifications;

-- ------------------------------------------------------------------------------
-- 8. RPCs for locally-registered (non-Supabase-Auth) accounts
-- ------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.upsert_local_account(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INT, INT, NUMERIC, INT);
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
  p_streak_days INT DEFAULT 1,
  p_id UUID DEFAULT NULL
) RETURNS public.users
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user public.users;
BEGIN
  INSERT INTO public.users (
    id, nim, email, full_name, role, faculty_name, avatar_url,
    total_green_coins, total_sat_points, total_carbon_saved, streak_days
  )
  VALUES (
    COALESCE(p_id, gen_random_uuid()), p_nim, p_email, p_full_name, p_role, p_faculty_name, p_avatar_url,
    p_total_green_coins, p_total_sat_points, p_total_carbon_saved, p_streak_days
  )
  ON CONFLICT (nim) DO UPDATE SET
    id = CASE WHEN p_id IS NOT NULL THEN p_id ELSE public.users.id END,
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

GRANT EXECUTE ON FUNCTION public.upsert_local_account(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INT, INT, NUMERIC, INT, UUID) TO anon, authenticated;

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
-- 9. SUPABASE STORAGE BUCKETS CONFIGURATION
-- Enables free 1 GB Supabase Storage for profile avatars and green action photos
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('action-photos', 'action-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies: Public read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read avatars') THEN
    CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public insert avatars') THEN
    CREATE POLICY "Allow public insert avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public update avatars') THEN
    CREATE POLICY "Allow public update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read action-photos') THEN
    CREATE POLICY "Public read action-photos" ON storage.objects FOR SELECT USING (bucket_id = 'action-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public insert action-photos') THEN
    CREATE POLICY "Allow public insert action-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'action-photos');
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 10. SEED INITIAL ACCOUNTS (SUPERADMIN, MAHASISWA & ORGANIZER)
-- Password Superadmin: admin123 -> SHA-256("admin123_ican_salt_2026")
-- Password Mahasiswa & SSO: binus123 -> SHA-256("binus123_ican_salt_2026")
-- ==============================================================================

-- 1. Superadmin (Hendra Kusuma)
SELECT public.upsert_local_account(
  p_nim => '1980010101',
  p_email => 'hendra.sso@binus.ac.id',
  p_full_name => 'Hendra Kusuma, M.Kom (Super Admin)',
  p_role => 'ADMIN',
  p_faculty_name => 'Student Service Office (SSO)',
  p_avatar_url => 'https://ui-avatars.com/api/?name=Hendra%20Kusuma%2C%20M.Kom%20(Super%20Admin)&background=7c3aed&color=fff&bold=true&size=150',
  p_password_hash => '77f34e86c34c8dd129d1ca0072d23d5b6785b914cf98409e64c28657d44dd2e1',
  p_total_green_coins => 2400,
  p_total_sat_points => 120,
  p_total_carbon_saved => 62.00,
  p_streak_days => 28
);

-- 2. Mahasiswa Utama (Budi Santoso)
SELECT public.upsert_local_account(
  p_nim => '2602158890',
  p_email => 'budi.santoso@binus.ac.id',
  p_full_name => 'Budi Santoso',
  p_role => 'STUDENT',
  p_faculty_name => 'School of Computer Science',
  p_avatar_url => 'https://ui-avatars.com/api/?name=Budi%20Santoso&background=059669&color=fff&bold=true&size=150',
  p_password_hash => '7487907fb813dda846948627ce4e8cd9521bed24927aa426b292222544f8000a',
  p_total_green_coins => 120,
  p_total_sat_points => 9,
  p_total_carbon_saved => 12.50,
  p_streak_days => 5
);

-- 3. Organizer SSO (Siti Rahmawati)
SELECT public.upsert_local_account(
  p_nim => 'BN089123456',
  p_email => 'sso.verifier@binus.ac.id',
  p_full_name => 'Siti Rahmawati, S.Kom (SSO)',
  p_role => 'VERIFIER',
  p_faculty_name => 'Student Service Office (SSO)',
  p_avatar_url => 'https://ui-avatars.com/api/?name=Siti%20Rahmawati&background=d97706&color=fff&bold=true&size=150',
  p_password_hash => '7487907fb813dda846948627ce4e8cd9521bed24927aa426b292222544f8000a',
  p_total_green_coins => 850,
  p_total_sat_points => 45,
  p_total_carbon_saved => 30.00,
  p_streak_days => 14
);

-- 4. Mahasiswa SOD Top Ranker (Nadia Safira)
SELECT public.upsert_local_account(
  p_nim => '2602234567',
  p_email => 'nadia.safira@binus.ac.id',
  p_full_name => 'Nadia Safira',
  p_role => 'STUDENT',
  p_faculty_name => 'School of Design',
  p_avatar_url => 'https://ui-avatars.com/api/?name=Nadia%20Safira&background=059669&color=fff&bold=true&size=150',
  p_password_hash => '7487907fb813dda846948627ce4e8cd9521bed24927aa426b292222544f8000a',
  p_total_green_coins => 890,
  p_total_sat_points => 68,
  p_total_carbon_saved => 24.80,
  p_streak_days => 9
);

-- 5. Mahasiswa SIS (Kevin Wijaya)
SELECT public.upsert_local_account(
  p_nim => '2602158892',
  p_email => 'kevin.wijaya@binus.ac.id',
  p_full_name => 'Kevin Wijaya',
  p_role => 'STUDENT',
  p_faculty_name => 'School of Information Systems',
  p_avatar_url => 'https://ui-avatars.com/api/?name=Kevin%20Wijaya&background=059669&color=fff&bold=true&size=150',
  p_password_hash => '7487907fb813dda846948627ce4e8cd9521bed24927aa426b292222544f8000a',
  p_total_green_coins => 310,
  p_total_sat_points => 22,
  p_total_carbon_saved => 8.40,
  p_streak_days => 4
);

-- ------------------------------------------------------------------------------
-- 11. VERIFY
-- ------------------------------------------------------------------------------

SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
SELECT u.nim, u.email, u.full_name, u.role, c.password_hash IS NOT NULL AS has_credentials
FROM public.users u
LEFT JOIN public.user_credentials c ON c.nim = u.nim;

