-- ==============================================================================
-- I-CAN PLATFORM — SDG 17 PARTNERS & COOPERATION DATABASE MIGRATION
-- Run this SQL in Supabase Dashboard > SQL Editor to establish the partners table.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('NGO', 'GOVERNMENT', 'PRIVATE_CSR', 'COMMUNITY', 'INTERNATIONAL')),
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    sdg_focus JSONB DEFAULT '["SDG 17"]'::jsonb,
    contact_person JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING_RENEWAL', 'COMPLETED', 'DRAFT')),
    documents JSONB DEFAULT '[]'::jsonb,
    programs JSONB DEFAULT '[]'::jsonb,
    cooperation_scope TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies for full anonymous and authenticated access
DROP POLICY IF EXISTS "Allow anon and auth read partners" ON public.partners;
CREATE POLICY "Allow anon and auth read partners"
ON public.partners FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow anon and auth insert partners" ON public.partners;
CREATE POLICY "Allow anon and auth insert partners"
ON public.partners FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth update partners" ON public.partners;
CREATE POLICY "Allow anon and auth update partners"
ON public.partners FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth delete partners" ON public.partners;
CREATE POLICY "Allow anon and auth delete partners"
ON public.partners FOR DELETE TO anon, authenticated
USING (true);

-- ------------------------------------------------------------------------------
-- SEED DATA: MITRA KERJASAMA SDG 17 RESMI KAMPUS BINUS
-- ------------------------------------------------------------------------------

INSERT INTO public.partners (
    id, name, category, description, logo_url, website_url,
    sdg_focus, contact_person, status, documents, programs,
    cooperation_scope, start_date, end_date, created_at, updated_at
) VALUES
(
    'partner-w4c-001',
    'Waste4Change (PT Wasteforchange Alam Indonesia)',
    'PRIVATE_CSR',
    'Penyedia solusi pengelolaan sampah bertanggung jawab berbasis sirkular ekonomi, mendukung program pemilahan limbah dan audit sampah kampus.',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80',
    'https://waste4change.com',
    '["SDG 17", "SDG 12", "SDG 13"]'::jsonb,
    '{"name": "Dimas Nugroho, S.T.", "role": "Head of Partnership & Public Sector", "email": "partnership@waste4change.com", "phone": "+62 812-8901-2345"}'::jsonb,
    'ACTIVE',
    '[
        {
            "id": "doc-w4c-01",
            "docNumber": "MoU/BINUS-SSO/2026/012",
            "title": "Nota Kesepahaman Pengelolaan Sampah Kampus dan Edukasi Sirkular",
            "docType": "MoU",
            "fileUrl": "",
            "fileName": "MoU_BINUS_Waste4Change_2026.pdf",
            "fileSizeKb": 480,
            "signedDate": "2026-01-10",
            "expiredDate": "2027-01-09",
            "status": "ACTIVE",
            "notes": "Ditandatangani oleh Rektorat BINUS dan Direktur Waste4Change."
        },
        {
            "id": "doc-w4c-02",
            "docNumber": "PKS/BINUS-SSO/2026/028",
            "title": "Perjanjian Kerjasama Operasional Drop Box Sampah Kampus @Bekasi",
            "docType": "PKS",
            "fileUrl": "",
            "fileName": "PKS_DropBox_Sampah_Bekasi.pdf",
            "fileSizeKb": 320,
            "signedDate": "2026-02-01",
            "expiredDate": "2026-12-31",
            "status": "ACTIVE",
            "notes": "Penyediaan 6 unit smart waste bin di area lobi."
        }
    ]'::jsonb,
    '[
        {
            "id": "prog-w4c-01",
            "title": "Program Kampus Bijak Kelola Sampah (Zero Waste Campus)",
            "description": "Edukasi dan implementasi pemilahan sampah kertas dan botol plastik di lingkungan kampus.",
            "targetParticipants": 1200,
            "targetImpact": "2,500 kg Sampah Terpilah",
            "targetSdg": ["SDG 17", "SDG 12"],
            "startDate": "2026-02-15",
            "endDate": "2026-11-30",
            "status": "ONGOING",
            "comservHoursAllocated": 8,
            "picName": "Dimas Nugroho"
        },
        {
            "id": "prog-w4c-02",
            "title": "Workshop Digital Upcycling & Circular Economy",
            "description": "Pelatihan pembuatan produk berdaya jual dari limbah tutup botol HDPE.",
            "targetParticipants": 350,
            "targetImpact": "350 kg Plastik Didaur Ulang",
            "targetSdg": ["SDG 17", "SDG 8", "SDG 12"],
            "startDate": "2026-04-10",
            "endDate": "2026-04-25",
            "status": "PLANNING",
            "comservHoursAllocated": 4,
            "picName": "Siti Rahmawati"
        }
    ]'::jsonb,
    'Penyediaan drop box terpilah, edukasi daur ulang sampah plastik, dan workshop pemilahan sampah organik untuk mahasiswa BINUS.',
    '2026-01-10',
    '2027-01-09',
    NOW(),
    NOW()
),
(
    'partner-lh-002',
    'Yayasan LindungiHutan Indonesia',
    'NGO',
    'Organisasi nirlaba penggerak konservasi hutan dan reforestasi pesisir pantai di seluruh Indonesia melalui skema adopsi pohon.',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    'https://lindungihutan.com',
    '["SDG 17", "SDG 13", "SDG 15"]'::jsonb,
    '{"name": "Miftachur Robani, S.Kom.", "role": "Chief Executive Officer", "email": "kerjasama@lindungihutan.com", "phone": "+62 813-2233-4455"}'::jsonb,
    'ACTIVE',
    '[
        {
            "id": "doc-lh-01",
            "docNumber": "MoA/BINUS-TFI/2025/089",
            "title": "Perjanjian Kerjasama Penanaman 3,000 Mangrove Pesisir Muara Gembong",
            "docType": "MoA",
            "fileUrl": "",
            "fileName": "MoA_Penanaman_Mangrove_2026.pdf",
            "fileSizeKb": 610,
            "signedDate": "2025-11-01",
            "expiredDate": "2026-12-31",
            "status": "ACTIVE",
            "notes": "PKS multi-tahun untuk mendukung verifikasi jam Community Service."
        }
    ]'::jsonb,
    '[
        {
            "id": "prog-lh-01",
            "title": "Aksi Nyata Tanam 1,500 Bibit Mangrove",
            "description": "Penanaman bibit mangrove berbatang kuat di pesisir utara untuk menahan abrasi dan serapan karbon.",
            "targetParticipants": 600,
            "targetImpact": "1,500 Bibit Pohon",
            "targetSdg": ["SDG 17", "SDG 13", "SDG 15"],
            "startDate": "2026-03-01",
            "endDate": "2026-08-30",
            "status": "ONGOING",
            "comservHoursAllocated": 12,
            "picName": "Miftachur Robani"
        }
    ]'::jsonb,
    'Pelaksanaan penanaman bibit pohon mangrove dan tanaman keras untuk program penghijauan mahasiswa Teach For Indonesia.',
    '2025-11-01',
    '2026-12-31',
    NOW(),
    NOW()
),
(
    'partner-dlh-003',
    'Dinas Lingkungan Hidup DKI Jakarta',
    'GOVERNMENT',
    'Instansi pemerintah yang membidangi pengendalian pencemaran, konservasi sumber daya air tanah, dan pemantauan kualitas lingkungan hidup perkotaan.',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=200&q=80',
    'https://lingkunganhidup.jakarta.go.id',
    '["SDG 17", "SDG 6", "SDG 11"]'::jsonb,
    '{"name": "Ir. Hendra Kusnadi, M.T.", "role": "Kepala Seksi Kemitraan & Peran Serta Masyarakat", "email": "kemitraan.dlh@jakarta.go.id", "phone": "+62 21-8092740"}'::jsonb,
    'ACTIVE',
    '[
        {
            "id": "doc-dlh-01",
            "docNumber": "MoU/DLH-DKI/BINUS/2025/11",
            "title": "Kesepakatan Bersama Edukasi Konservasi Air Tanah & Biopori Pemukiman",
            "docType": "MoU",
            "fileUrl": "",
            "fileName": "MoU_DLH_DKI_BINUS_2025.pdf",
            "fileSizeKb": 540,
            "signedDate": "2025-08-15",
            "expiredDate": "2026-08-14",
            "status": "ACTIVE",
            "notes": "Masa berlaku hingga Agustus 2026, dalam persiapan pembaruan."
        }
    ]'::jsonb,
    '[
        {
            "id": "prog-dlh-01",
            "title": "Gerakan 1,000 Lubang Resapan Biopori Kampus & Warga Sekitar",
            "description": "Pembuatan lubang biopori pada area resapan air pemukiman RT/RW sekitar kampus bersama warga.",
            "targetParticipants": 800,
            "targetImpact": "1,000 Lubang Biopori",
            "targetSdg": ["SDG 17", "SDG 6"],
            "startDate": "2026-01-20",
            "endDate": "2026-07-31",
            "status": "ONGOING",
            "comservHoursAllocated": 10,
            "picName": "Ir. Hendra Kusnadi"
        }
    ]'::jsonb,
    'Fasilitasi pembuatan lubang biopori di fasum warga sekitar kampus dan kalibrasi emisi karbon aktivitas mahasiswa.',
    '2025-08-15',
    '2026-08-14',
    NOW(),
    NOW()
),
(
    'partner-wwf-004',
    'Yayasan WWF Indonesia',
    'INTERNATIONAL',
    'Badan konservasi independen global yang berfokus pada pelestarian keanekaragaman hayati dan pengurangan jejak ekologis manusia.',
    'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=200&q=80',
    'https://www.wwf.id',
    '["SDG 17", "SDG 14", "SDG 15"]'::jsonb,
    '{"name": "Aditya Pratama, M.Sc.", "role": "Youth Engagement & Education Specialist", "email": "youth@wwf.id", "phone": "+62 21-5761070"}'::jsonb,
    'PENDING_RENEWAL',
    '[
        {
            "id": "doc-wwf-01",
            "docNumber": "MoU/WWF-ID/BINUS/2025/04",
            "title": "Nota Kesepahaman Kampanye Konservasi Alam & Earth Hour",
            "docType": "MoU",
            "fileUrl": "",
            "fileName": "MoU_WWF_Indonesia_2025.pdf",
            "fileSizeKb": 720,
            "signedDate": "2025-03-01",
            "expiredDate": "2026-03-31",
            "status": "ACTIVE",
            "notes": "Perlu pengajuan addendum pembaruan untuk periode 2026/2027."
        }
    ]'::jsonb,
    '[
        {
            "id": "prog-wwf-01",
            "title": "Earth Hour Campus Switch-Off & Renewable Energy Campaign",
            "description": "Kampanye pemadaman listrik 60 menit serentak dan edukasi efisiensi energi bagi mahasiswa.",
            "targetParticipants": 1500,
            "targetImpact": "450 kWh Penghematan Energi",
            "targetSdg": ["SDG 17", "SDG 7", "SDG 13"],
            "startDate": "2026-03-15",
            "endDate": "2026-03-30",
            "status": "COMPLETED",
            "comservHoursAllocated": 6,
            "picName": "Aditya Pratama"
        }
    ]'::jsonb,
    'Penyelenggaraan Earth Hour Kampus, kampanye anti-kantong plastik, dan kompetisi inovasi video pembelajaran VBL.',
    '2025-03-01',
    '2026-03-31',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url,
    sdg_focus = EXCLUDED.sdg_focus,
    contact_person = EXCLUDED.contact_person,
    status = EXCLUDED.status,
    documents = EXCLUDED.documents,
    programs = EXCLUDED.programs,
    cooperation_scope = EXCLUDED.cooperation_scope,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = NOW();
