# 🌱 I-CAN (Integrated Gamified Carbon-Neutral Campus Platform)

> **Platform Aksi Iklim Mahasiswa Terintegrasi: Ubah Kebiasaan Hijau & Pengabdian TFI Menjadi Poin SAT dan Perolehan BEKEN Award.**

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Logto](https://img.shields.io/badge/Logto-SSO_Ready-purple.svg?logo=openid)](https://logto.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_15-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Multimodal AI](https://img.shields.io/badge/Multimodal_AI-Vision_Verification-orange.svg?logo=google)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

---

## 📖 1. Brief Project & Latar Belakang

**I-CAN** adalah platform pelaporan aksi berkelanjutan berbasis web (Progressive Web App) yang dirancang khusus untuk mahasiswa **Universitas Bina Nusantara (BINUS)**, selaras dengan standar **Student Service Office (SSO)** dan program resmi **Teach For Indonesia (TFI)**.

### 🔄 Paradigma Dual-Track System (Sesuai Regulasi SSO & TFI):
Sesuai arahan regulasi kampus, perolehan Poin SAT *(Student Activity Transcript)* dan jam *Community Service* **tidak boleh berasal dari konversi koin arbitrer**. Oleh karena itu, I-CAN menerapkan arsitektur **Dual-Track**:

```mermaid
flowchart TD
    subgraph Submission["1. Pelaporan Mahasiswa"]
        A["Unggah Aksi Hijau / Kampanye TFI<br/>(Foto, GPS, Link IG Reels/TikTok/YouTube)"]
    end

    subgraph Verification["2. Dual-Engine Verification"]
        A --> B["Multimodal Vision AI Pre-Scan"]
        B --> C{"Review Verifikator SSO / TFI"}
    end

    subgraph TrackA["Track 1: Gamifikasi & Reputasi"]
        C -->|"Kesesuaian Guideline Kampanye"| D["+Green Coins (GC)"]
        D --> E["🏆 Nominasi BEKEN Award Tahunan<br/>(BINUS Eco-Ksatria Environmental Network)"]
    end

    subgraph TrackB["Track 2: Akademik & Rekognisi Riil"]
        C -->|"Aksi Nyata Lengkap Terverifikasi"| F["+SAT Points & Jam Comserv Riil"]
        F --> G["📄 Transkrip Portofolio myBINUS / TFI Apps"]
    end

    subgraph Rejection["Track 3: Feedback Perbaikan"]
        C -->|"Belum Memenuhi Syarat"| H["Penolakan dengan Catatan Evaluasi"]
    end
```

### 3 Pilar Strategis Platform:
1. **Alur 2-Tahap TFI (Survei Pra-Aksi vs Laporan Akhir):** Mahasiswa wajib melakukan survei lokasi & asesmen K3 sebelum aksi penanaman pohon / pembuatan biopori, mencegah penolakan verifikasi.
2. **Kuantifikasi Dampak SDG Kampus:** Menghitung pengurangan emisi karbon (kg CO2e) dan memetakan aksi ke target UN SDG (SDG 13, 15, 6, 4, 12, 11) secara saintifik (IPCC/GHG Protocol).
3. **Storytelling & Konten Digital:** Mengarsipkan karya edukatif mahasiswa (Video Based Learning & Social Media Campaign) dengan hashtag resmi `#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService`.

---

## 🔒 2. Audit Keamanan, API, Environment & Pertahanan Intrusi

Aplikasi telah diaudit dan diperkuat dengan standar keamanan berikut:

### 🛡️ Matriks Pertahanan Keamanan:
| Lapisan Keamanan | Mekanisme Pertahanan | Status |
| :--- | :--- | :---: |
| **Rahasia & Kunci API** | Tidak ada API Secret Key / Service Role Key yang terekspos di bundle klien. Variabel `VITE_` hanya berisi konfigurasi publik dan anon-key yang dibatasi oleh RLS. File `.env` diabaikan oleh `.gitignore`. | 🟢 Aman |
| **Kontrol Akses Role (RBAC)** | `ProtectedRoute.tsx` secara ketat memblokir akses ke rute privileged (`/admin` hanya untuk `ADMIN`, `/verify` hanya untuk `VERIFIER` dan `ADMIN`). Mahasiswa yang mencoba akses langsung di-redirect ke `/home`. | 🟢 Aman |
| **Mode Deployment Isolasi** | Dalam **Mode Prototype End-User**, tombol ganti akun di TopNavbar dan Sidebar dinonaktifkan untuk non-admin. Mahasiswa murni terkunci pada rolenya tanpa celah *privilege escalation*. | 🟢 Aman |
| **Pencegahan XSS & Injeksi** | Seluruh data input (NIM, cerita, link medsos, feedback, nama mitra) dirender aman melalui Virtual DOM React tanpa `dangerouslySetInnerHTML`. Hash password menggunakan *Web Crypto SHA-256 Digest*. | 🟢 Aman |
| **Validasi File & Kompresi** | Form upload membatasi tipe MIME hanya gambar (`image/*`), membatasi ukuran file (<5MB), dan mengompresi gambar otomatis via HTML5 Canvas sebelum transmisi. | 🟢 Aman |
| **AI Fallback Resiliency** | Layanan Multimodal Vision AI dirancang model-agnostik dengan *graceful degradation*: jika koneksi API terputus atau kunci API kosong, sistem beralih ke simulasi offline cerdas tanpa membocorkan stack trace. | 🟢 Aman |

---

## ⚡ 3. Minimal Setup untuk Build Awal (Quick Start)

Aplikasi dilengkapi **Zero-Config Local Mock Mode**. Anda dapat menjalankan dan mendemokan seluruh fitur secara 100% lokal tanpa perlu membuat akun cloud apa pun terlebih dahulu.

### Prasyarat:
- **Node.js:** Versi 18.0.0 atau lebih baru ([Download Node.js](https://nodejs.org/))
- **Git:** Terpasang di komputer Anda

### Langkah Menjalankan:
```bash
# 1. Clone repository
git clone https://github.com/username/i-can-app.git
cd i-can-app

# 2. Install dependensi
npm install

# 3. Salin environment configuration template
cp .env.example .env

# 4. Jalankan development server
npm run dev
```

Buka peramban di **`http://localhost:5173`**.

---

## 🧪 4. Panduan Komprehensif Uji Coba Tim & Dewan Juri

Tersedia **Bilah Kontrol Global** di bagian paling atas aplikasi untuk berpindah antara dua mode pengujian:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 📱 Mode Prototype End-User (Sesuai Role)       [ ⚙️ Ganti Mode: Ke Dev Mode ]          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 👤 5 Akun Bawaan (Pre-Seeded Accounts):
| Role | Profil Demo | Kredensial Login | Fokus Uji Coba |
| :--- | :--- | :--- | :--- |
| **Mahasiswa Aktif** | **Budi Santoso** (SOCS)<br/>NIM: `2602158890` | `2602158890`<br/>Sandi: `binus123` | Uji coba alur 2-tahap TFI, Flash Quests (+15 GC Tumbler), Portofolio SAT, dan Feed. |
| **Top Mahasiswa #1** | **Nadia Safira** (SOD)<br/>NIM: `2602234567` | `2602234567`<br/>Sandi: `binus123` | Spotlight Leaderboard BEKEN, 12 riwayat aksi 2 minggu, 9-hari streak, 68 SAT. |
| **Mahasiswa Pemula** | **Farhan Ramadhan** (Eng)<br/>NIM: `2602345678` | `2602345678`<br/>Sandi: `binus123` | Pengelolaan E-Waste, Bike to Campus, dan draf VBL. |
| **Verifikator TFI/SSO** | **Siska Amanda** (SIS)<br/>NIM: `2501987654` | `2501987654`<br/>Sandi: `verifier123` | Portal Verifikasi `/verify`, review bukti foto, review asesmen K3, approval 3-cabang. |
| **Super Admin SSO** | **Hendra Kusuma, M.Kom**<br/>NIP: `1980010101` | `1980010101`<br/>Sandi: `admin123` | Dashboard AdminLTE 3.4 (`/admin`), manajemen kuota SAT, impersonasi akun, grant SAT. |

---

### 📋 Skenario Uji Coba Step-by-Step:

#### Skenario 1: Pelaporan Aksi TFI 2-Tahap ([UploadPage.tsx](file:///d:/Codes/i-can-app/src/pages/UploadPage.tsx))
1. Login sebagai **Budi Santoso**.
2. Klik tombol **`+` (Upload)** di tengah navigasi bawah.
3. **Pilih Tab 1: Survei Lokasi (Pra-Aksi):**
   - Masukkan lokasi survei (contoh: *Lahan Terbuka RT 04 Kemanggisan*).
   - Masukkan nama kontak mitra/RT setempat.
   - Centang konfirmasi keselamatan kerja K3.
   - Tambahkan NIM rekan kelompok (maksimal 3 orang per tim).
   - Unggah foto lokasi survei $\rightarrow$ klik **"Kirim Pengajuan Survei Lokasi"**.
4. **Pilih Tab 2: Laporan Akhir (Klaim SAT):**
   - Masukkan link Instagram Reels / TikTok / YouTube.
   - Klik tombol **"Salin 3 Tagar Resmi"** (`#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService`).
   - Tulis refleksi aksi $\rightarrow$ unggah foto pelaksanaan.
   - Perhatikan radar **Multimodal Vision AI** memindai kepatuhan atribut secara otomatis $\rightarrow$ kirim laporan.

#### Skenario 2: Verifikasi Aksi oleh Admin SSO / TFI ([VerificationPage.tsx](file:///d:/Codes/i-can-app/src/pages/VerificationPage.tsx))
1. Beralih login sebagai **Siska Amanda (Verifier)**.
2. Buka tab **Verify** di navigasi bawah.
3. Periksa kartu antrean pengajuan:
   - Lihat badge **Proposal Survei (Pra-Aksi)** atau **Laporan Akhir**.
   - Periksa skor pencocokan **Multimodal AI Check**, foto, dan tagar.
4. Uji 3 opsi keputusan verifikator:
   - **Setujui Penuh (+SAT & +Coins):** Memberikan Poin SAT akademik dan Green Coins.
   - **Setujui Koin Saja (+Coins Only):** Untuk aksi mandiri/kampanye tanpa Poin SAT.
   - **Tolak dengan Catatan:** Masukkan alasan (misal: *Foto buram/tanpa almamater*) $\rightarrow$ notifikasi perbaikan langsung dikirim ke mahasiswa.

#### Skenario 3: Papan Peringkat & Top Student Spotlight ([LeaderboardPage.tsx](file:///d:/Codes/i-can-app/src/pages/LeaderboardPage.tsx))
1. Buka tab **Rank (Trophy)** di navigasi bawah.
2. Periksa **Top 3 Podium Mahasiswa** (Nadia Safira #1, Budi Santoso #2, Kevin Pratama #3).
3. Lihat kartu **Top Student Spotlight** yang memamerkan aksi unggulan, kutipan motivasi, dan reduksi `24.8 kg CO2e` Nadia Safira.
4. Ganti antara 3 tab:
   - **🏆 BEKEN (Coins):** Peringkat koin tahunan.
   - **🎓 Poin SAT Riil:** Peringkat transkrip akademik.
   - **🏛️ Fakultas:** Peringkat ESG antar fakultas + tombol interaktif **Cheer ❤️**.

#### Skenario 4: Portofolio SAT & Ekspor Transkrip ([WalletPage.tsx](file:///d:/Codes/i-can-app/src/pages/WalletPage.tsx))
1. Login sebagai **Nadia Safira** atau **Budi Santoso**, lalu buka menu **Wallet**.
2. Periksa saldo dual-track: Green Coins dan Poin SAT / 120 SAT target kelulusan.
3. Klik tombol **"Salin Ringkasan Transkrip"** $\rightarrow$ transkrip teks berformat resmi SSO/TFI tersalin ke clipboard, siap diimpor ke sistem myBINUS.

#### Skenario 5: Manajemen Super AdminLTE 3.4 ([AdminLtePage.tsx](file:///d:/Codes/i-can-app/src/pages/AdminLtePage.tsx))
1. Login sebagai **Pak Hendra (Super Admin)** atau buka `/admin`.
2. Periksa metrik global kampus: Total Emisi Karbon Terpangkas, Total Mahasiswa Aktif, dan Poin SAT Terdistribusi.
3. Uji fitur **User & Role Management Table**: ubah role pengguna secara instan dari tabel AdminLTE.
4. Uji fitur **Manual SAT Grant Modal**: berikan Poin SAT pengabdian khusus langsung ke NIM mahasiswa.

---

## ⚙️ 5. Panduan Konfigurasi Eksternal (Opsional untuk Produksi/Live)

Jika ingin menghubungkan aplikasi ke backend cloud riil atau menggunakan penyedia AI Vision eksternal, sesuaikan file [`.env`](file:///.env):

```env
# 1. Frontend Mode ('production' = Prototype End-User | 'demo' = Showcase)
VITE_APP_MODE=demo

# 2. Multimodal Vision AI Model Routing ('auto' | 'openrouter' | 'nvidia_nim' | 'gemini')
VITE_AI_PROVIDER=auto

# [Opsi A] OpenRouter Routing (Llama 3.2 Vision, Gemini 1.5 Flash, Qwen 2 VL)
VITE_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key-here
VITE_OPENROUTER_MODEL=meta-llama/llama-3.2-11b-vision-instruct:free

# [Opsi B] NVIDIA NIM Routing (NVIDIA Microservices: Llama 3.2 11B/90B Vision, NeVA)
VITE_NVIDIA_NIM_API_KEY=nvapi-your-nvidia-nim-key-here
VITE_NVIDIA_NIM_ENDPOINT=https://integrate.api.nvidia.com/v1/chat/completions
VITE_NVIDIA_NIM_MODEL=meta/llama-3.2-11b-vision-instruct

# [Opsi C] Google AI Studio / Gemini Routing
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_GEMINI_MODEL=gemini-1.5-flash

# 3. Supabase Cloud (PostgreSQL & Storage)
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key-anda>

# 4. Logto SSO OIDC
VITE_LOGTO_ENDPOINT=https://<tenant-id>.logto.app/
VITE_LOGTO_APP_ID=<app-id-anda>
```

---

## 📁 6. Struktur Folder Project

```
i-can-app/
├── docs/                             # Dokumentasi regulasi & panduan pitch
│   ├── FEATURE_REVISION_NOTES.md     # Catatan regulasi SSO & TFI v2.0
│   ├── MVP_IMPLEMENTATION_CHECKLIST.md # Checklist implementasi
│   ├── feedback_22082026.md          # Catatan perbaikan UI/UX
│   └── presentation/                 # Naskah presentasi & slide guide
├── public/                           # Aset statis & ikon
├── src/
│   ├── components/                   # Komponen UI (Card, Button, Badge, Nav)
│   │   └── common/
│   │       ├── BottomNav.tsx         # Navigasi bawah dengan tab Rank
│   │       ├── ProtectedRoute.tsx    # Guard autentikasi & otorisasi role
│   │       └── TopNavbar.tsx         # Navbar atas & header
│   ├── pages/                        # Layar aplikasi utama
│   │   ├── AdminLtePage.tsx          # Panel Super Admin AdminLTE 3.4
│   │   ├── CallbackPage.tsx          # OIDC redirect handler Logto SSO
│   │   ├── FeedPage.tsx              # Community Feed & Storytelling
│   │   ├── HomePage.tsx              # Dashboard utama & live ticker
│   │   ├── LeaderboardPage.tsx       # Papan peringkat BEKEN, SAT & Fakultas
│   │   ├── LoginPage.tsx             # Halaman login, registrasi & demo
│   │   ├── ProfilePage.tsx           # Profil NIM & koleksi badge
│   │   ├── UploadPage.tsx            # Form pelaporan 2-tahap & AI scan
│   │   ├── VerificationPage.tsx      # Portal review verifikator SSO/TFI
│   │   └── WalletPage.tsx            # Portofolio SAT & transkrip
│   ├── services/                     # Layanan API & Integrasi
│   │   ├── actionService.ts          # Layanan data aksi (35+ rekaman 2 minggu)
│   │   ├── authService.ts            # Enkripsi sandi SHA-256 & registrasi
│   │   ├── gemini.ts                 # Engine Multimodal Vision AI
│   │   ├── logto.ts                  # Konfigurasi Logto OIDC SSO
│   │   └── supabase.ts               # Koneksi Supabase SDK & Storage
│   ├── stores/                       # Zustand state stores
│   │   ├── appModeStore.ts           # State toggle Prototype vs Dev Mode
│   │   ├── authStore.ts              # State autentikasi & profil 5 akun
│   │   └── notificationStore.ts      # State notifikasi & validasi
│   ├── types/                        # Definisi tipe TypeScript data models
│   ├── utils/                        # Kalkulator karbon & kompresor gambar
│   ├── App.tsx                       # Root routing, layout wrapper & mode bar
│   ├── main.tsx                      # Entry point React
│   └── index.css                     # Tailwind design system tokens
├── supabase/
│   └── schema.sql                    # Skema database PostgreSQL 15 & RLS
├── .env.example                      # Template variabel environment
├── netlify.toml                      # Konfigurasi build & hosting Netlify
├── package.json                      # Dependensi proyek
├── tailwind.config.js                # Konfigurasi color tokens & styles
└── tsconfig.json                     # Konfigurasi TypeScript
```

---

## 🛠️ 7. Skrip Perintah (Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan local development server dengan hot-reload (Vite). |
| `npm run build` | Menjalankan type-checking TypeScript dan membuat build produksi di folder `/dist`. |
| `npm run preview` | Menjalankan server lokal untuk memvalidasi hasil build produksi. |

---

## 📄 Lisensi

Proyek ini dikembangkan untuk inisiatif keberlanjutan kampus **Universitas Bina Nusantara (BINUS)** di bawah lisensi MIT.
