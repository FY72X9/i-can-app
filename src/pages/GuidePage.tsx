import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  GraduationCap, 
  Award, 
  TreePine, 
  Droplets, 
  Video, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Zap,
  ArrowRight,
  MessageCircle,
  FileCheck2,
  Globe2
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'sat' | 'tfi' | 'beken' | 'technical' | 'sdg';
}

const FAQ_LIST: FaqItem[] = [
  {
    q: 'Bagaimana aksi keberlanjutan saya dipetakan ke Target SDG BINUS?',
    a: 'Setiap aksi yang dilaporkan secara otomatis dipetakan ke target prioritas United Nations Sustainable Development Goals (SDG) yang didukung BINUS (SDG 13 Iklim, SDG 15 Ekosistem Daratan, SDG 6 Air Bersih & Sanitasi, SDG 4 Pendidikan Berkualitas, SDG 12 Konsumsi Bertanggung Jawab, dll.) lengkap dengan kalkulasi pengurangan emisi karbon berbasis IPCC Tier-1.',
    category: 'sdg',
  },
  {
    q: 'Mengapa saldo Green Coins tidak bisa lagi ditukar langsung jadi Poin SAT?',
    a: 'Sesuai regulasi Student Service Office (SSO) dan Teach For Indonesia (TFI), setiap Poin SAT dan jam Community Service wajib dipetakan langsung (Direct Activity Mapping) dari kegiatan nyata yang tervalidasi lengkap, bukan dari konversi skor arbitrer.',
    category: 'sat',
  },
  {
    q: 'Lalu, apa fungsi dari Green Coins yang saya kumpulkan?',
    a: 'Green Coins berfungsi sebagai reputasi gamifikasi keberlanjutan kampus. Mahasiswa dengan perolehan Green Coins tertinggi akan masuk ke Leaderboard tahunan dan mendapatkan nominasi resmi BEKEN Award (BINUS Eco-Ksatria Environmental Network Award).',
    category: 'beken',
  },
  {
    q: 'Berapa jumlah minimal penanaman pohon atau pembuatan biopori agar disetujui TFI?',
    a: 'Untuk program Aksi Nyata TFI: Penanaman pohon wajib minimal 5 bibit pohon berbatang keras di taman kota/sekolah/fasilitas umum. Pembuatan biopori wajib minimal 5 lubang resapan biopori bersama masyarakat sekitar.',
    category: 'tfi',
  },
  {
    q: 'Apa saja syarat wajib untuk Video Based Learning (VBL)?',
    a: 'Video berdurasi 5–10 menit, wajib mengenakan jaket almamater BINUS, menampilkan logo resmi TFI di awal, menyertakan perkenalan diri, dan mencantumkan daftar referensi kredibel berformat APA Style di akhir video.',
    category: 'tfi',
  },
  {
    q: 'Apa saja hashtag resmi yang wajib dicantumkan pada postingan media sosial?',
    a: 'Wajib mencantumkan 3 hashtag resmi: #TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService pada caption postingan Instagram Reels, TikTok, atau YouTube Anda.',
    category: 'tfi',
  },
  {
    q: 'Berapa lama proses verifikasi aksi oleh Admin SSO / Verifikator?',
    a: 'Mesin Multimodal AI melakukan pra-verifikasi instan dalam hitungan detik. Verifikasi akhir oleh tim Verifikator SSO dan TFI diselesaikan maksimal 1x24 jam kerja.',
    category: 'technical',
  },
  {
    q: 'Bagaimana cara mengekspor transkrip SAT ke myBINUS?',
    a: 'Buka menu Portofolio Rekognisi (Wallet), lalu klik tombol "Salin Ringkasan Transkrip" untuk mendapatkan teks berformat resmi yang siap disinkronisasikan ke portal myBINUS.',
    category: 'sat',
  },
];

export const GuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TFI' | 'DUAL' | 'SDG' | 'FAQ'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const officialHashtags = '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService';

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(officialHashtags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const filteredFaqs = FAQ_LIST.filter((item) => {
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Header Hero Card */}
      <Card variant="eco" className="p-6 sm:p-7 text-white space-y-4 shadow-eco-float relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-eco-neon shadow-neon-glow border border-white/20 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="eco" size="sm" className="mb-1 bg-white/20 text-eco-neon border-white/20">
              Panduan Resmi 2026
            </Badge>
            <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
              Pusat Panduan & Regulasi TFI
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-eco-100/90 leading-relaxed max-w-md">
          Semua informasi seputar regulasi Student Service Office (SSO), standar program Teach For Indonesia (TFI), dan panduan klaim poin SAT transparan.
        </p>

        {/* Quick Search Input */}
        <div className="relative pt-2">
          <input
            type="text"
            placeholder="Cari pertanyaan atau kata kunci (contoh: pohon, VBL, hashtag, SDG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl bg-black/25 text-white placeholder-eco-200/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-eco-neon transition-all"
          />
          <Search className="w-4 h-4 text-eco-200 absolute left-3.5 top-[21px]" />
        </div>
      </Card>

      {/* Spotlight Subpage Card: BINUS SDG Guideline */}
      <Card className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl border border-emerald-500/30 shadow-eco-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-eco-neon/20 border border-eco-neon/40 flex items-center justify-center text-eco-neon shrink-0 shadow-neon-glow">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-eco-neon/30 text-eco-neon px-2.5 py-0.5 rounded-full border border-eco-neon/40">
                Pilar Keberlanjutan
              </span>
              <span className="text-xs text-slate-300 font-bold">8 Target Utama</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-1">
              Panduan & Matriks Target SDG BINUS
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Pelajari pemetaan kegiatan I-CAN ke UN SDGs & formula reduksi emisi IPCC Tier-1.
            </p>
          </div>
        </div>

        <Link
          to="/sdg-guideline"
          className="px-4 py-2.5 rounded-2xl bg-eco-neon text-eco-950 font-black text-xs hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <span>Buka Matriks SDG</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>

      {/* 2. Navigation Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'Ringkasan Lengkap' },
          { id: 'SDG', label: '🌍 Target SDG BINUS' },
          { id: 'TFI', label: 'Standar Program TFI' },
          { id: 'DUAL', label: 'Sistem Dual-Track' },
          { id: 'FAQ', label: 'Tanya Jawab (FAQ)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-black px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-eco-700 text-white shadow-sm'
                : 'bg-white text-text-secondary border border-surface-border hover:bg-surface-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2.5 SDG BINUS Section */}
      {(activeTab === 'ALL' || activeTab === 'SDG') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              Pemetaan Target UN SDG BINUS
            </h2>
            <Link
              to="/sdg-guideline"
              className="text-xs text-eco-800 hover:underline font-bold flex items-center gap-0.5"
            >
              Lihat Detail Lengkap →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-surface-border space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded bg-emerald-700">SDG 13 & 15</span>
                <span className="text-xs text-slate-500 font-mono font-bold">5.00 kg CO2e / pohon</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-text-primary">Aksi Iklim & Ekosistem Daratan</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Penanaman bibit pohon keras & pembuatan biopori untuk konservasi tanah dan reduksi gas rumah kaca.
              </p>
              <Link to="/sdg-guideline" className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-1">
                Buka Panduan SDG 13 & 15 →
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-surface-border space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded bg-cyan-600">SDG 6 & 3</span>
                <span className="text-xs text-slate-500 font-mono font-bold">0.20 kg CO2e eq</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-text-primary">Air Bersih, Sanitasi & Kesehatan</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Penyediaan wastafel higienis publik, edukasi CTPS, dan resapan air tanah akuifer kampus.
              </p>
              <Link to="/sdg-guideline" className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-1">
                Buka Panduan SDG 6 & 3 →
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-surface-border space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded bg-red-700">SDG 4</span>
                <span className="text-xs text-slate-500 font-mono font-bold">Sitasi APA Style</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-text-primary">Pendidikan Keberlanjutan Berkualitas</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Video Based Learning (VBL) 5–10 menit berjaket almamater menyebarkan literasi sains keberlanjutan.
              </p>
              <Link to="/sdg-guideline" className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-1">
                Buka Panduan SDG 4 →
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-surface-border space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded bg-amber-600">SDG 12 & 11</span>
                <span className="text-xs text-slate-500 font-mono font-bold">Zero Single-Use</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-text-primary">Konsumsi Sirkular & Mobilitas Hijau</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tumbler, drop point E-Waste kampus, upcycle tekstil, dan shuttle bus ramah lingkungan.
              </p>
              <Link to="/sdg-guideline" className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-1">
                Buka Panduan SDG 12 & 11 →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Official TFI Standards Section */}
      {(activeTab === 'ALL' || activeTab === 'TFI') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-eco-700" />
              1. Standar Program Resmi TFI
            </h2>
            <span className="text-xs text-eco-900 bg-eco-neon/20 px-3 py-0.5 rounded-full border border-eco-neon/40 font-bold">
              Kriteria Validasi
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Tree Planting */}
            <Card className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary">Penanaman Pohon Keras (TFI)</h3>
                  <span className="text-xs text-blue-700 font-bold">+4 SAT Points • 2.0 Jam Comserv</span>
                </div>
              </div>
              <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside bg-surface-subtle p-4 rounded-2xl border border-surface-border/50 leading-relaxed">
                <li>Wajib menanam <strong>minimal 5 bibit pohon berbatang keras</strong> (mangga, alpukat, tabebuya, dll).</li>
                <li>Penyuluhan melalui Instagram Reels / TikTok dengan hashtag resmi.</li>
                <li>Foto bukti fisik penanaman di tanah bersama pengelola lokasi/warga.</li>
              </ul>
            </Card>

            {/* Biopori */}
            <Card className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shrink-0">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary">Pembuatan Lubang Biopori (TFI)</h3>
                  <span className="text-xs text-blue-700 font-bold">+4 SAT Points • 2.0 Jam Comserv</span>
                </div>
              </div>
              <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside bg-surface-subtle p-4 rounded-2xl border border-surface-border/50 leading-relaxed">
                <li>Membuat <strong>minimal 5 lubang resapan biopori</strong> di area fasilitas publik / RT kampus.</li>
                <li>Menggunakan pipa PVC berlubang dan penutup pipa standar.</li>
                <li>Edukasi pemilahan sampah organik untuk pengisian biopori.</li>
              </ul>
            </Card>

            {/* Video Based Learning */}
            <Card className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary">Video Based Learning (VBL)</h3>
                  <span className="text-xs text-blue-700 font-bold">+3 SAT Points • 1.5 Jam Comserv</span>
                </div>
              </div>
              <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside bg-surface-subtle p-4 rounded-2xl border border-surface-border/50 leading-relaxed">
                <li>Durasi video <strong>5 hingga 10 menit</strong> yang ditujukan untuk pelajar/masyarakat.</li>
                <li>Menampilkan <strong>logo resmi TFI</strong> dan perkenalan identitas di awal video.</li>
                <li>Wajib mengenakan <strong>jaket almamater BINUS</strong> selama perekaman.</li>
                <li>Mencantumkan daftar referensi berstandar <strong>APA Style</strong> di bagian penutup.</li>
              </ul>
            </Card>
          </div>

          {/* Hashtag Card with 1-Click Copy */}
          <Card className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                Hashtag Resmi Wajib Media Sosial
              </span>
              <button
                type="button"
                onClick={handleCopyHashtags}
                className="text-xs font-black bg-white hover:bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                {copiedHashtags ? <Check className="w-3.5 h-3.5 text-eco-700" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
                {copiedHashtags ? 'Tersalin!' : 'Salin 1-Klik'}
              </button>
            </div>
            <p className="text-xs font-mono text-amber-950 bg-white/90 p-3 rounded-2xl border border-amber-200/70 select-all break-all leading-relaxed">
              {officialHashtags}
            </p>
          </Card>
        </div>
      )}

      {/* 4. Dual-Track Comparison Section */}
      {(activeTab === 'ALL' || activeTab === 'DUAL') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-500" />
              2. Pemahaman Sistem Dual-Track I-CAN
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Track A: BEKEN Award */}
            <Card className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-sm space-y-3">
              <div className="flex items-center gap-2.5 text-amber-800">
                <Sparkles className="w-4 h-4 text-gold-neon fill-gold-neon" />
                <h3 className="text-xs sm:text-sm font-black">Track A: Green Coins & BEKEN Award</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Mekanisme gamifikasi & kompetisi kampus. Koin diperoleh dari kepatuhan kampanye sosial, aksi harian, dan storytelling inspiratif.
              </p>
              <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-950 font-bold border border-amber-200 leading-relaxed">
                🏆 Manfaat: Nominasi tahunan BEKEN Award & Peringkat Fakultas.
              </div>
            </Card>

            {/* Track B: SAT Points */}
            <Card className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-sm space-y-3">
              <div className="flex items-center gap-2.5 text-blue-800">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-black">Track B: Poin SAT & Jam Pengabdian</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Rekognisi akademik resmi. Poin SAT (Student Activity Transcript) dan jam Community Service diberikan khusus untuk kegiatan terverifikasi lapangan dan video edukasi VBL.
              </p>
              <div className="p-3 rounded-2xl bg-blue-50 text-xs text-blue-950 font-bold border border-blue-200 leading-relaxed">
                🎓 Manfaat: Pemenuhan syarat kelulusan wisuda (120 Poin SAT & 30 Jam Comserv).
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 5. Interactive FAQ Accordion */}
      {(activeTab === 'ALL' || activeTab === 'FAQ') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-eco-700" />
              3. Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <span className="text-xs text-text-muted">{filteredFaqs.length} Pertanyaan</span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <Card
                  key={idx}
                  className="bg-white border-surface-border overflow-hidden transition-all shadow-xs rounded-2xl sm:rounded-3xl"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-black text-text-primary leading-snug">
                      {faq.q}
                    </span>
                    <div className="p-1 rounded-lg bg-surface-subtle text-text-muted shrink-0 mt-0.5">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-slate-100 bg-surface-subtle/50 animate-in fade-in duration-150">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Helpdesk Contact Banner */}
      <Card className="p-6 bg-gradient-to-r from-eco-900 to-eco-800 text-white space-y-3.5 text-center border-white/10 shadow-eco-card rounded-3xl">
        <h3 className="text-sm sm:text-base font-black">Masih Butuh Bantuan Terkait Regulasi?</h3>
        <p className="text-xs sm:text-sm text-eco-100 max-w-sm mx-auto leading-relaxed">
          Tim Student Service Office (SSO) dan Teach For Indonesia (TFI) siap membantu proses validasi aksi Anda.
        </p>
        <div className="flex justify-center gap-2 pt-1.5">
          <Link
            to="/upload"
            className="px-5 py-2.5 rounded-2xl bg-eco-neon text-eco-950 font-black text-xs sm:text-sm hover:bg-emerald-300 transition-all shadow-sm flex items-center gap-1.5"
          >
            Lapor Aksi Sekarang <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  );
};
