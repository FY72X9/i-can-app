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
-- Action Categories (Kategori Aksi Hijau & Program TFI)
CREATE TABLE IF NOT EXISTS public.action_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'SELF_GREEN_CAMPAIGN', 'PENYULUHAN_AKSI_NYATA', 'VIDEO_BASED_LEARNING'
    icon VARCHAR(50) NOT NULL, -- e.g., 'TreePine', 'Droplets', 'Video', 'CupSoda', 'Bus', 'Trash2'
    emission_factor NUMERIC(6, 3) NOT NULL, -- kg CO2e saved per action
    base_coins INT NOT NULL DEFAULT 10,
    sat_point_awarded INT NOT NULL DEFAULT 0, -- Direct SAT points
    comserv_hours NUMERIC(4, 1) DEFAULT 0.0, -- Direct Community service hours
    sdg_target VARCHAR(50), -- e.g. 'SDG 15 & 13', 'SDG 6', 'SDG 4'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CORE ACTION & VERIFICATION TABLES
-- ------------------------------------------------------------------------------

-- Actions (Unggahan Aksi Hijau & Storytelling Mahasiswa)
CREATE TABLE IF NOT EXISTS public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.action_categories(id) ON DELETE RESTRICT,
    submission_type VARCHAR(50) DEFAULT 'SELF_GREEN_CAMPAIGN',
    photo_url TEXT NOT NULL,
    campaign_url TEXT, -- Link IG Reels / TikTok
    video_url TEXT, -- Link YouTube / Drive (VBL)
    group_members JSONB DEFAULT '[]'::jsonb, -- Array of NIMs (max 3)
    story TEXT,
    gps_lat NUMERIC(10, 7),
    gps_lng NUMERIC(10, 7),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    decision VARCHAR(30) DEFAULT NULL CHECK (decision IN ('APPROVED_COINS_ONLY', 'APPROVED_FULL', 'REJECTED')),
    ai_confidence NUMERIC(4, 2) DEFAULT NULL, -- 0.00 - 1.00 from Gemini Flash
    ai_guideline_score NUMERIC(4, 2) DEFAULT NULL,
    ai_completeness_score NUMERIC(4, 2) DEFAULT NULL,
    ai_analysis_reason TEXT,
    green_coins_earned INT DEFAULT 0,
    carbon_impact_kg NUMERIC(8, 3) DEFAULT 0.000,
    sat_points_earned INT DEFAULT 0,
    comserv_hours NUMERIC(4, 1) DEFAULT 0.0,
    guideline_complied BOOLEAN DEFAULT FALSE,
    real_activity_verified BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    rejection_reason TEXT
);

-- Verifications Log (Audit Trail Penilaian Eco-Volunteer / SSO Admin)
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_id UUID NOT NULL REFERENCES public.actions(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    decision VARCHAR(30) NOT NULL CHECK (decision IN ('APPROVED_COINS_ONLY', 'APPROVED_FULL', 'REJECTED')),
    notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAT Recognitions (Direct Activity Mapping sesuai regulasi SSO & TFI)
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

-- Badges (Penghargaan Gamifikasi & SDG)
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    criteria VARCHAR(100) NOT NULL, -- e.g. 'streak_5', 'carbon_10kg', 'tfi_pohon_1'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- ------------------------------------------------------------------------------
-- 3. SEED INITIAL MASTER DATA (TFI PROGRAMS & SELF GREEN CAMPAIGNS)
-- ------------------------------------------------------------------------------

INSERT INTO public.faculties (name, code, total_carbon_saved) VALUES
    ('School of Computer Science', 'SOCS', 42.50),
    ('School of Information Systems', 'SIS', 38.20),
    ('School of Design', 'SOD', 25.10),
    ('Binus Business School', 'BBS', 29.80),
    ('Faculty of Engineering', 'FOE', 18.40)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.action_categories (name, type, icon, emission_factor, base_coins, sat_point_awarded, comserv_hours, sdg_target, description) VALUES
    ('Penanaman Bibit Pohon', 'PENYULUHAN_AKSI_NYATA', 'TreePine', 5.000, 25, 4, 2.0, 'SDG 15 & 13', 'Edukasi medsos & tanam minimal 5 bibit pohon keras di taman kota/sekolah'),
    ('Pembuatan Lubang Biopori', 'PENYULUHAN_AKSI_NYATA', 'Droplets', 0.500, 20, 4, 2.0, 'SDG 15 & 6', 'Edukasi medsos & buat minimal 5 lubang biopori bersama masyarakat'),
    ('Tempat Cuci Tangan / Sanitasi', 'PENYULUHAN_AKSI_NYATA', 'Sparkles', 0.200, 20, 4, 2.0, 'SDG 6 & 3', 'Edukasi kebersihan & instalasi wastafel sederhana di fasilitas umum'),
    ('Video Based Learning (VBL)', 'VIDEO_BASED_LEARNING', 'Video', 0.100, 25, 3, 1.5, 'SDG 4', 'Video edukasi 5-10 menit berjaket almamater & referensi APA Style'),
    ('Bawa Tumbler & Wadah', 'SELF_GREEN_CAMPAIGN', 'CupSoda', 0.050, 10, 0, 0.0, 'SDG 12', 'Mengurangi sampah plastik sekali pakai di kantin/kampus'),
    ('Shuttle Bus / Transportasi Hijau', 'SELF_GREEN_CAMPAIGN', 'Bus', 0.120, 15, 1, 0.5, 'SDG 11 & 13', 'Menggunakan transportasi umum atau shuttle bus kampus'),
    ('Pilah & Daur Ulang Sampah', 'SELF_GREEN_CAMPAIGN', 'Trash2', 0.080, 10, 0, 0.0, 'SDG 12', 'Memilah sampah organik & anorganik di Eco Drop Box kampus')
ON CONFLICT DO NOTHING;

INSERT INTO public.badges (name, description, icon, criteria) VALUES
    ('First Step Green', 'Melakukan aksi hijau kampus pertama kali', 'Award', 'actions_1'),
    ('Streak Master', 'Menjaga habit loop aksi hijau 5 hari berturut-turut', 'Flame', 'streak_5'),
    ('TFI Community Hero', 'Menyelesaikan aksi nyata TFI (Pohon/Biopori/Wastafel)', 'TreePine', 'tfi_action_1'),
    ('BEKEN Nominee', 'Masuk ke dalam jajaran top ranker Green Leaderboard tahunan', 'Trophy', 'beken_top_10')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_recognitions ENABLE ROW LEVEL SECURITY;
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

-- SAT Recognition Policies
CREATE POLICY "Users can read own SAT recognitions" ON public.sat_recognitions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Verifiers can manage SAT recognitions" ON public.sat_recognitions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('VERIFIER', 'ADMIN'))
);
