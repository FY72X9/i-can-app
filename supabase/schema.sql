-- ==============================================================================
-- I-CAN PLATFORM — POSTGRESQL 15 DATABASE SCHEMA (SUPABASE)
-- Execute this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & MASTER DATA
-- ------------------------------------------------------------------------------

-- Faculties (Fakultas di Kampus BINUS)
CREATE TABLE IF NOT EXISTS public.faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    total_carbon_saved NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users / Profiles Table (Mapped to Supabase Auth UUID)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Action Categories (Kategori Aksi Hijau Kampus)
CREATE TABLE IF NOT EXISTS public.action_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'BINA_DIRI', 'BINA_LINGKUNGAN', 'VIRTUAL_VOLUNTEER'
    icon VARCHAR(50) NOT NULL, -- e.g., 'CupSoda', 'Bus', 'Trash2', 'Zap'
    emission_factor NUMERIC(6, 3) NOT NULL, -- kg CO2e saved per action
    base_coins INT NOT NULL DEFAULT 10,
    sat_equivalent INT NOT NULL DEFAULT 0, -- SAT points granted per action
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CORE ACTION & VERIFICATION TABLES
-- ------------------------------------------------------------------------------

-- Actions (Unggahan Aksi Hijau Mahasiswa)
CREATE TABLE IF NOT EXISTS public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.action_categories(id) ON DELETE RESTRICT,
    photo_url TEXT NOT NULL,
    story TEXT,
    gps_lat NUMERIC(10, 7),
    gps_lng NUMERIC(10, 7),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    ai_confidence NUMERIC(4, 2) DEFAULT NULL, -- 0.00 - 1.00 from Gemini Flash
    ai_analysis_reason TEXT,
    green_coins_earned INT DEFAULT 0,
    carbon_impact_kg NUMERIC(8, 3) DEFAULT 0.000,
    sat_points_earned INT DEFAULT 0,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id)
);

-- Verifications Log (Audit Trail Penilaian Eco-Volunteer)
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_id UUID NOT NULL REFERENCES public.actions(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('APPROVED', 'REJECTED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAT Conversions (Penukaran Green Coin menjadi SAT Point BINUS)
CREATE TABLE IF NOT EXISTS public.sat_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    green_coins_spent INT NOT NULL CHECK (green_coins_spent > 0),
    sat_points_received INT NOT NULL CHECK (sat_points_received > 0),
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges (Penghargaan Gamifikasi)
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    criteria VARCHAR(100) NOT NULL, -- e.g. 'streak_5', 'carbon_10kg'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- ------------------------------------------------------------------------------
-- 3. SEED INITIAL MASTER DATA
-- ------------------------------------------------------------------------------

INSERT INTO public.faculties (name, code, total_carbon_saved) VALUES
    ('School of Computer Science', 'SOCS', 42.50),
    ('School of Information Systems', 'SIS', 38.20),
    ('School of Design', 'SOD', 25.10),
    ('Binus Business School', 'BBS', 29.80),
    ('Faculty of Engineering', 'FOE', 18.40)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.action_categories (name, type, icon, emission_factor, base_coins, sat_equivalent, description) VALUES
    ('Bawa Tumbler / Botol Sendiri', 'BINA_DIRI', 'CupSoda', 0.050, 10, 0, 'Mengurangi sampah plastik sekali pakai di area kantin/kampus'),
    ('Naik Shuttle Bus / Transportasi Hijau', 'BINA_LINGKUNGAN', 'Bus', 0.120, 15, 1, 'Menggunakan transportasi umum atau bus kampus BINUS'),
    ('Pilah & Daur Ulang Sampah', 'BINA_LINGKUNGAN', 'Trash2', 0.080, 10, 0, 'Memilah sampah organik & anorganik di Eco Drop Box'),
    ('Hemat Energi & Matikan Listrik/AC', 'BINA_DIRI', 'Zap', 0.300, 20, 1, 'Mematikan AC/lampu ruangan kelas setelah selesai kuliah')
ON CONFLICT DO NOTHING;

INSERT INTO public.badges (name, description, icon, criteria) VALUES
    ('First Step Green', 'Melakukan aksi hijau kampus pertama kali', 'Award', 'actions_1'),
    ('Streak Master', 'Menjaga habit loop aksi hijau 5 hari berturut-turut', 'Flame', 'streak_5'),
    ('Carbon Hero', 'Menghemat akumulasi 10 kg CO2e', 'ShieldCheck', 'carbon_10kg'),
    ('SAT Champion', 'Mengumpulkan 50 SAT Points dari aksi hijau', 'Trophy', 'sat_50')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Public Read for Master Data
CREATE POLICY "Public read faculties" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.action_categories FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON public.badges FOR SELECT USING (true);

-- User Policies
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read other profiles in leaderboard" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Action Policies
CREATE POLICY "Users can read approved actions" ON public.actions FOR SELECT USING (status = 'APPROVED' OR auth.uid() = user_id);
CREATE POLICY "Users can insert own actions" ON public.actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending action" ON public.actions FOR UPDATE USING (auth.uid() = user_id AND status = 'PENDING');

-- Verification Policies (Allow authenticated verifiers)
CREATE POLICY "Verifiers can read all actions" ON public.actions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('VERIFIER', 'ADMIN'))
);
CREATE POLICY "Verifiers can update action status" ON public.actions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('VERIFIER', 'ADMIN'))
);
CREATE POLICY "Verifiers can insert logs" ON public.verifications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('VERIFIER', 'ADMIN'))
);

-- SAT Conversion Policies
CREATE POLICY "Users can read own conversions" ON public.sat_conversions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert conversions" ON public.sat_conversions FOR INSERT WITH CHECK (auth.uid() = user_id);
