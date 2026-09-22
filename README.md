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

Aplikasi dilengkapi **Bilah Kontrol Global** di bagian paling atas untuk berpindah antara dua mode pengujian:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 📱 Mode Prototype End-User (Sesuai Role)       [ ⚙️ Ganti Mode: Ke Dev Mode ]          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
- **Mode Prototype End-User:** Mensimulasikan pengalaman aplikasi nyata; pembatasan navigasi dan proteksi role (RBAC) aktif penuh.
- **Mode Dev / Demo Showcase:** Mengaktifkan **1-Click Simulation Account Switcher** pada halaman login, navbar atas, dan sidebar untuk berpindah profil seketika tanpa perlu mengetik kata sandi secara manual.

---

### 👤 Tabel Akun Demo & Uji Coba (Pre-Seeded Trial Accounts)

Berikut adalah daftar lengkap akun siap pakai (*zero-config*) untuk pengujian fungsionalitas seluruh role:

| No | Role Platform | Profil & Fakultas | Identitas Login (NIM / Binus No / Email) | Kata Sandi | Saldo Awal & Reputasi | Ruang Lingkup & Fokus Fitur Uji Coba |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Super Admin SSO** | **Hendra Kusuma, M.Kom**<br/>Student Service Office (SSO) | `1980010101`<br/>`hendra.sso@binus.ac.id` | `admin123` | 2,400 GC<br/>120 SAT<br/>62.0 kg CO2e | **Panel AdminLTE 3.4 (`/admin`)**: Manajemen Dokumen Kemitraan Hijau SDG 17 (MoU & PKS), Student Green Activity Monitor (filter Mingguan/Bulanan/Tahunan), Manajemen Pengguna (Soft-delete, Restore, Ubah Role, Batch Import), dan Manual Grant SAT. |
| **2** | **Verifikator TFI / SSO** | **Siti Rahmawati, S.Kom**<br/>Student Service Office (SSO) | `BN089123456`<br/>`sso.verifier@binus.ac.id` | `binus123`<br/>*(alt: `verifier123`)* | 850 GC<br/>45 SAT<br/>30.0 kg CO2e | **Portal Verifikasi (`/verify`)**: Validasi 2-tahap TFI (Survei Pra-Aksi & Laporan Akhir), radar inspeksi Multimodal Vision AI, pencocokan 3 tagar resmi, dan 3 opsi persetujuan (Setujui Penuh +SAT, Setujui Koin Saja, Tolak + Catatan Revisi). |
| **3** | **Mahasiswa Aktif (Default)** | **Budi Santoso**<br/>School of Computer Science (SOCS) | `2602158890`<br/>`budi.santoso@binus.ac.id` | `binus123` | 120 GC<br/>12 Jam CS<br/>12.5 kg CO2e | **Alur Pelaporan 2-Tahap (`/upload`)**: Survei Lokasi & K3, Laporan Akhir dengan Quick Demo Photo Picker, scan AI real-time, klaim jam Comserv TFI, Flash Quests, dan interaksi Community Feed. |
| **4** | **Top Mahasiswa #1** | **Nadia Safira**<br/>School of Design (SOD) | `2602234567`<br/>`nadia.safira@binus.ac.id` | `binus123` | 890 GC<br/>68 SAT<br/>24.8 kg CO2e | **Spotlight Papan Peringkat (`/leaderboard`)**: Juara 1 BEKEN Award & Podium SAT, 9-hari streak aksi hijau, 12 riwayat aksi terverifikasi, dan showcase aksi unggulan. |
| **5** | **Mahasiswa Aktif** | **Maya Safitri**<br/>School of Computer Science (SOCS) | `2602159933`<br/>`maya.safitri@binus.ac.id` | `binus123` | 620 GC<br/>24 Jam CS<br/>48.2 kg CO2e | Pengujian aksi pemilahan limbah organik & daur ulang, portofolio transkrip SAT semester lanjut. |
| **6** | **Mahasiswa Aktif** | **Siti Nurhaliza**<br/>School of Information Systems (SIS) | `2602167711`<br/>`siti.nurhaliza@binus.ac.id` | `binus123` | 480 GC<br/>18 Jam CS<br/>42.0 kg CO2e | Kampanye digital media sosial TFI, Video Based Learning (VBL), dan validasi link IG/TikTok/YouTube. |
| **7** | **Mahasiswa Aktif** | **Kevin Jonathan**<br/>School of Design (SOD) | `2602174422`<br/>`kevin.jonathan@binus.ac.id` | `binus123` | 410 GC<br/>15 Jam CS<br/>35.5 kg CO2e | Pengelolaan E-Waste, desain poster edukasi lingkungan, dan partisipasi event kampus. |
| **8** | **Mahasiswa Aktif** | **Amanda Putri**<br/>BINUS Business School (BBS) | `2602183355`<br/>`amanda.putri@binus.ac.id` | `binus123` | 360 GC<br/>14 Jam CS<br/>28.0 kg CO2e | Audit konsumsi energi mandiri, usulan program green business kampus, dan klaim portofolio. |
| **9** | **Mahasiswa Aktif** | **Rizky Pratama**<br/>Faculty of Engineering (FOE) | `2602196688`<br/>`rizky.pratama@binus.ac.id` | `binus123` | 310 GC<br/>10 Jam CS<br/>24.5 kg CO2e | Aksi transportasi rendah emisi (*Bike to Campus*), pembuatan lubang biopori, dan audit hemat energi. |
| **10** | **Mahasiswa Aktif** | **Nabila Syahrani**<br/>Faculty of Humanities | `2602201199`<br/>`nabila.syahrani@binus.ac.id` | `binus123` | 260 GC<br/>8 Jam CS<br/>19.0 kg CO2e | Literasi aksi iklim, penulisan artikel refleksi SDGs, dan workshop ramah lingkungan. |
| **11** | **Mahasiswa Aktif** | **Daniel Setiawan**<br/>Digital Comm., Hotel & Tourism | `2602219944`<br/>`daniel.setiawan@binus.ac.id` | `binus123` | 210 GC<br/>7 Jam CS<br/>16.5 kg CO2e | Gerakan pengurangan kemasan plastik sekali pakai (*Zero Single-Use Plastic*) di kantin kampus. |

> [!TIP]
> **Cara Cepat Uji Coba (Tanpa Ketik Sandi):** Pastikan mode aplikasi berada pada **Mode Dev / Demo Showcase**. Pada halaman login (`/login`), klik tombol dropdown **"Simulasi Akun (Mode Dev)"** di bagian bawah untuk langsung masuk ke akun mana pun dengan 1 kali klik.

---

### 📋 Skenario Uji Coba Step-by-Step:

#### Skenario 1: Pelaporan Aksi TFI 2-Tahap & AI Scan ([UploadPage.tsx](file:///d:/Codes/i-can-app/src/pages/UploadPage.tsx))
1. Masuk sebagai **Budi Santoso** (`2602158890`).
2. Tekan tombol **`+` (Upload)** pada bilah navigasi bawah.
3. **Tab 1: Survei Lokasi & K3 (Pra-Aksi):**
   - Isi nama lokasi survei (contoh: *Lahan Terbuka RT 04 Kemanggisan, Jakarta Barat*).
   - Masukkan kontak PIC mitra/RT setempat.
   - Beri centang konfirmasi standar keselamatan kerja K3.
   - Tambahkan NIM anggota kelompok (maksimal 3 mahasiswa per kelompok).
   - Unggah foto lokasi atau pilih **Foto Demo** pada picker cepat $\rightarrow$ klik **"Kirim Pengajuan Survei Lokasi"**.
4. **Tab 2: Laporan Akhir (Klaim Poin SAT & Jam Comserv):**
   - Masukkan tautan publik Instagram Reels, TikTok, atau YouTube.
   - Tekan tombol **"Salin 3 Tagar Resmi"** (`#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService`).
   - Tulis esai refleksi kegiatan dan unggah foto dokumentasi pelaksanaan.
   - Amati indikator **Multimodal Vision AI** yang menganalisis kepatuhan foto secara instan $\rightarrow$ kirimkan laporan aksi.

#### Skenario 2: Verifikasi Aksi oleh Verifikator SSO / TFI ([VerificationPage.tsx](file:///d:/Codes/i-can-app/src/pages/VerificationPage.tsx))
1. Beralih login sebagai **Siti Rahmawati (SSO Verifier)** (`BN089123456`).
2. Buka menu **Verify** pada bilah navigasi.
3. Tinjau kartu antrean verifikasi aksi mahasiswa:
   - Identifikasi jenis dokumen melalui badge **Proposal Survei (Pra-Aksi)** atau **Laporan Akhir**.
   - Analisis skor kecocokan **Multimodal Vision AI Check**, kepatuhan atribut almamater, foto lokasi, dan kelengkapan 3 tagar resmi.
4. Lakukan salah satu dari 3 keputusan evaluasi:
   - **Setujui Penuh (+SAT & +Coins):** Memberikan Poin SAT akademik resmi dan Green Coins.
   - **Setujui Koin Saja (+Coins Only):** Diberikan untuk aksi mandiri/kampanye hijau non-kurikuler.
   - **Tolak dengan Catatan:** Masukkan catatan evaluasi (misal: *Foto belum menampilkan almamater BINUS*) $\rightarrow$ notifikasi perbaikan dikirim seketika ke dashboard mahasiswa.

#### Skenario 3: Papan Peringkat, Realtime Sync & Top Spotlight ([LeaderboardPage.tsx](file:///d:/Codes/i-can-app/src/pages/LeaderboardPage.tsx))
1. Masuk ke tab **Rank (Trophy)** pada navigasi bawah.
2. Periksa **Podium 3 Teratas** mahasiswa berprestasi dan kartu **Top Student Spotlight** milik **Nadia Safira** (SOD) dengan capaian reduksi `24.8 kg CO2e`.
3. Telusuri 3 tab klasifikasi:
   - **🏆 BEKEN (Coins):** Akumulasi Green Coins tahunan untuk seleksi BEKEN Award.
   - **🎓 Poin SAT Riil:** Transkrip perolehan jam comserv & poin SAT resmi.
   - **🏛️ Antar Fakultas:** Peringkat kinerja ESG fakultas dilengkapi tombol apresiasi interaktif **Cheer ❤️** (didukung sinkronisasi realtime).

#### Skenario 4: Portofolio SAT & Ekspor Transkrip myBINUS ([WalletPage.tsx](file:///d:/Codes/i-can-app/src/pages/WalletPage.tsx))
1. Buka menu **Wallet** saat masuk sebagai **Budi Santoso** atau **Nadia Safira**.
2. Tinjau saldo dual-track: Green Coins operasional serta Poin SAT riil terhadap target kelulusan (120 SAT).
3. Klik tombol **"Salin Ringkasan Transkrip"** $\rightarrow$ data transkrip terstruktur resmi disalin ke clipboard untuk pelaporan myBINUS atau aplikasi TFI.

#### Skenario 5: Manajemen Super AdminLTE 3.4 ([AdminLtePage.tsx](file:///d:/Codes/i-can-app/src/pages/AdminLtePage.tsx))
1. Masuk sebagai **Pak Hendra (Super Admin)** (`1980010101`) atau navigasikan ke `/admin`.
2. **Dashboard Statistik Global:** Pantau metrik kampus real-time (Total Emisi CO2e Tereduksi, Mahasiswa Aktif, Poin SAT Tersalurkan).
3. **Modul Kemitraan Hijau & SDG 17 (Partner Management):**
   - Buka tab **Mitra & Kerjasama**: tinjau daftar mitra CSR, Komunitas, dan Instansi Pemerintah.
   - Periksa dokumen legalitas MoU dan PKS, masa berlaku kerjasama, status aktif, serta unduh ringkasan legalitas.
   - Klik **"Tambah Mitra Baru"** untuk mendaftarkan mitra CSR baru beserta lingkup kegiatan.
4. **Student Green Activity Monitor:**
   - Filter aktivitas mahasiswa berdasarkan timeframe (*Week, Month, Year*).
   - Tinjau grafik tren aksi, distribusi kategori aksi hijau, dan status approval.
5. **User & Role Management Table:**
   - Filter pengguna per fakultas atau role.
   - Lakukan impersonasi akun, soft-delete & restore akun, atau ekspor data pengguna.
   - Gunakan modal **Manual SAT Grant** untuk mengalokasikan poin SAT langsung ke NIM mahasiswa.
   - Lakukan **Batch Import Users** melalui file JSON/CSV.

#### Skenario 6: Detail Event & Pendaftaran Comserv ([EventDetailPage.tsx](file:///d:/Codes/i-can-app/src/pages/EventDetailPage.tsx))
1. Buka halaman utama (`/home`) dan pilih salah satu kartu agenda kegiatan / workshop hijau.
2. Tinjau rincian lokasi, jadwal pelaksanaan, kuota peserta yang tersisa, dan perolehan Poin SAT.
3. Klik **"Daftar Kegiatan"** $\rightarrow$ status pendaftaran terdaftar seketika dan kuota terupdate secara realtime.

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
│   └── presentation/                 # Naskah presentasi & panduan slide
├── public/                           # Aset statis & ikon
├── src/
│   ├── components/                   # Komponen UI modular
│   │   ├── admin/                    # Komponen khusus panel AdminLTE 3.4
│   │   │   ├── ImportUsersModal.tsx  # Modal batch import user (JSON/CSV)
│   │   │   ├── PartnerDashboardWidget.tsx # Widget ringkasan kemitraan SDG 17
│   │   │   ├── PartnerDetailModal.tsx # Modal detail & unduh ringkasan MoU/PKS
│   │   │   ├── PartnerFormModal.tsx  # Form tambah/edit mitra & dokumen kerjasama
│   │   │   └── StudentGreenActivityMonitor.tsx # Pemantau aktivitas aksi mahasiswa
│   │   └── common/
│   │       ├── BottomNav.tsx         # Navigasi bawah dengan tab Rank & Upload
│   │       ├── ProtectedRoute.tsx    # Guard otentikasi & otorisasi role (RBAC)
│   │       └── TopNavbar.tsx         # Navbar atas, header & switch simulasi akun
│   ├── pages/                        # Layar aplikasi utama
│   │   ├── AdminLtePage.tsx          # Panel Super Admin AdminLTE 3.4
│   │   ├── CallbackPage.tsx          # OIDC redirect handler Logto SSO
│   │   ├── EventDetailPage.tsx       # Detail event & pendaftaran realtime
│   │   ├── FeedPage.tsx              # Community Feed & interaksi sosial
│   │   ├── HomePage.tsx              # Dashboard utama & live ticker aksi
│   │   ├── LeaderboardPage.tsx       # Papan peringkat BEKEN, SAT & Fakultas
│   │   ├── LoginPage.tsx             # Layar login kredensial, SSO & demo switcher
│   │   ├── ProfilePage.tsx           # Profil NIM, koleksi badge & edit akun
│   │   ├── UploadPage.tsx            # Form pelaporan 2-tahap TFI & AI vision scan
│   │   ├── VerificationPage.tsx      # Portal evaluasi verifikator SSO/TFI
│   │   └── WalletPage.tsx            # Portofolio SAT & salin transkrip resmi
│   ├── services/                     # Layanan API, integrasi & storage
│   │   ├── actionService.ts          # Pengelolaan data aksi hijau & Supabase sync
│   │   ├── authService.ts            # Otentikasi SHA-256, RBAC & akun bawaan
│   │   ├── eventService.ts           # Manajemen agenda kegiatan & registrasi
│   │   ├── gemini.ts                 # Engine Multimodal Vision AI multi-provider
│   │   ├── logto.ts                  # Konfigurasi Logto OIDC SSO
│   │   ├── partnerService.ts         # Layanan kemitraan SDG 17 & dokumen MoU/PKS
│   │   ├── pdfReportService.ts       # Generator laporan ringkasan aksi hijau
│   │   ├── questProgramService.ts    # Program misi mingguan & Flash Quests
│   │   ├── storageService.ts         # Layanan penyimpanan & kompresi foto aksi
│   │   └── supabase.ts               # Koneksi client Supabase & channel realtime
│   ├── stores/                       # Zustand state stores
│   │   ├── appModeStore.ts           # State toggle Prototype vs Dev Mode
│   │   ├── authStore.ts              # State pengguna, daftar akun & sesi aktif
│   │   └── notificationStore.ts      # State notifikasi sistem & validasi
│   ├── types/                        # Definisi tipe TypeScript data models
│   │   ├── index.ts                  # Tipe pengguna, aksi hijau, badge, SDG
│   │   └── partner.ts                # Tipe entitas mitra, dokumen MoU & program
│   ├── utils/                        # Utilitas kalkulator karbon & formatting
│   │   ├── carbonCalc.ts             # Algoritma reduksi karbon IPCC & metrik pohon
│   │   └── imageCompressor.ts        # Kompresor foto otomatis via Canvas
│   ├── App.tsx                       # Root routing, layout wrapper & mode bar
│   ├── main.tsx                      # Entry point React Vite
│   └── index.css                     # Tailwind design system tokens
├── supabase/
│   ├── schema_final.sql              # Skema database PostgreSQL 15, RLS & seed data
│   ├── partners.sql                  # Skema tabel mitra, dokumen kerjasama & fungsi
│   └── fix_actions_schema_mismatch.sql # Penyelarasan kolom aksi hijau
├── .env.example                      # Template variabel environment
├── netlify.toml                      # Konfigurasi hosting & SPA rewrite Netlify
├── package.json                      # Dependensi proyek
├── tailwind.config.js                # Konfigurasi token warna, font & tema
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
