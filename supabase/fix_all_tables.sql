-- ==============================================================================
-- SUPERSEDED by schema_final.sql — do not run this file anymore, kept for history.
-- ==============================================================================
-- I-CAN PLATFORM — RECREATE ALL TABLES (users table was deleted)
-- Run this in Supabase Dashboard > SQL Editor
-- ==============================================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. RECREATE public.users — Without FK to auth.users
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nim VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'VERIFIER', 'ADMIN')),
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    avatar_url TEXT,
    total_green_coins INT DEFAULT 0 CHECK (total_green_coins >= 0),
    total_sat_points INT DEFAULT 0 CHECK (total_sat_points >= 0),
    total_carbon_saved NUMERIC(10, 2) DEFAULT 0.00,
    streak_days INT DEFAULT 0,
    last_action_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User RLS Policies
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete users" ON public.users FOR DELETE USING (true);

-- ============================================================
-- 2. CREATE public.events — Campus events table
-- ============================================================

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

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update events" ON public.events FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete events" ON public.events FOR DELETE USING (true);

-- ============================================================
-- 3. CREATE public.daily_quests
-- ============================================================

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

ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read daily_quests" ON public.daily_quests FOR SELECT USING (true);
CREATE POLICY "Allow insert daily_quests" ON public.daily_quests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update daily_quests" ON public.daily_quests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete daily_quests" ON public.daily_quests FOR DELETE USING (true);

-- ============================================================
-- 4. CREATE public.action_programs
-- ============================================================

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

ALTER TABLE public.action_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read action_programs" ON public.action_programs FOR SELECT USING (true);
CREATE POLICY "Allow insert action_programs" ON public.action_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update action_programs" ON public.action_programs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete action_programs" ON public.action_programs FOR DELETE USING (true);

-- ============================================================
-- 5. FIX public.actions — Add missing columns
-- ============================================================

DO $$ BEGIN
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

-- Broader INSERT policy for actions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'actions' AND policyname = 'Allow insert actions') THEN
    CREATE POLICY "Allow insert actions" ON public.actions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Broader UPDATE policy for actions
DROP POLICY IF EXISTS "Users can update own pending action" ON public.actions;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'actions' AND policyname = 'Allow update actions') THEN
    CREATE POLICY "Allow update actions" ON public.actions FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- 6. VERIFY — Show all tables and policies
-- ============================================================

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
