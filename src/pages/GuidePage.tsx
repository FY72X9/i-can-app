import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
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
  FileCheck2
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'sat' | 'tfi' | 'beken' | 'technical';
}

const FAQ_LIST: FaqItem[] = [
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
    a: 'AI Gemini Flash melakukan pra-verifikasi instan dalam hitungan detik. Verifikasi manual oleh tim Verifikator SSO dan TFI diselesaikan maksimal 1x24 jam kerja.',
    category: 'technical',
  },
  {
    q: 'Bagaimana cara mengekspor transkrip SAT ke myBINUS?',
    a: 'Buka menu Portofolio Rekognisi (Wallet), lalu klik tombol "Salin Ringkasan Transkrip" untuk mendapatkan teks berformat resmi yang siap disinkronisasikan ke portal myBINUS.',
    category: 'sat',
  },
];

export const GuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TFI' | 'DUAL' | 'FAQ'>('ALL');
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
    <div className="space-y-6 pb-6">
      {/* 1. Header Hero Card */}
      <Card variant="eco" className="p-6 text-white space-y-3 shadow-eco-float relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-eco-neon shadow-neon-glow border border-white/20">
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

        <p className="text-xs text-eco-100/90 leading-relaxed max-w-sm">
          Semua informasi seputar regulasi Student Service Office (SSO), standar program Teach For Indonesia (TFI), dan panduan klaim poin SAT transparan.
        </p>

        {/* Quick Search Input */}
        <div className="relative pt-2">
          <input
            type="text"
            placeholder="Cari pertanyaan atau kata kunci (contoh: pohon, VBL, hashtag)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-3 pl-9 rounded-2xl bg-black/25 text-white placeholder-eco-200/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-eco-neon transition-all"
          />
          <Search className="w-4 h-4 text-eco-200 absolute left-3 top-[19px]" />
        </div>
      </Card>

      {/* 2. Navigation Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'Ringkasan Lengkap' },
          { id: 'TFI', label: 'Standar Program TFI' },
          { id: 'DUAL', label: 'Sistem Dual-Track' },
          { id: 'FAQ', label: 'Tanya Jawab (FAQ)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-black px-3.5 py-2 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-eco-700 text-white shadow-sm'
                : 'bg-white text-text-secondary border border-surface-border hover:bg-surface-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Official TFI Standards Section */}
      {(activeTab === 'ALL' || activeTab === 'TFI') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-eco-700" />
              1. Standar Program Resmi TFI
            </h2>
            <span className="text-[10px] text-eco-900 bg-eco-neon/20 px-2 py-0.5 rounded-full border border-eco-neon/40 font-bold">
              Kriteria Validasi
            </span>
          </div>

          <div className="space-y-3">
            {/* Tree Planting */}
            <Card className="p-4 bg-white border-surface-border shadow-eco-sm space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <TreePine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-text-primary">Penanaman Pohon Keras (TFI)</h3>
                  <span className="text-[10px] text-blue-700 font-bold">+4 SAT Points • 2.0 Jam Comserv</span>
                </div>
              </div>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside bg-surface-subtle p-3 rounded-2xl border border-surface-border/50">
                <li>Wajib menanam <strong>minimal 5 bibit pohon berbatang keras</strong> (mangga, alpukat, tabebuya, dll).</li>
                <li>Penyuluhan melalui Instagram Reels / TikTok dengan hashtag resmi.</li>
                <li>Foto bukti fisik penanaman di tanah bersama pengelola lokasi/warga.</li>
              </ul>
            </Card>

            {/* Biopori */}
            <Card className="p-4 bg-white border-surface-border shadow-eco-sm space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-text-primary">Pembuatan Lubang Biopori (TFI)</h3>
                  <span className="text-[10px] text-blue-700 font-bold">+4 SAT Points • 2.0 Jam Comserv</span>
                </div>
              </div>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside bg-surface-subtle p-3 rounded-2xl border border-surface-border/50">
                <li>Membuat <strong>minimal 5 lubang resapan biopori</strong> di area fasilitas publik / RT kampus.</li>
                <li>Menggunakan pipa PVC berlubang dan penutup pipa standar.</li>
                <li>Edukasi pemilahan sampah organik untuk pengisian biopori.</li>
              </ul>
            </Card>

            {/* Video Based Learning */}
            <Card className="p-4 bg-white border-surface-border shadow-eco-sm space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-text-primary">Video Based Learning (VBL)</h3>
                  <span className="text-[10px] text-blue-700 font-bold">+3 SAT Points • 1.5 Jam Comserv</span>
                </div>
              </div>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside bg-surface-subtle p-3 rounded-2xl border border-surface-border/50">
                <li>Durasi video <strong>5 hingga 10 menit</strong> yang ditujukan untuk pelajar/masyarakat.</li>
                <li>Menampilkan <strong>logo resmi TFI</strong> dan perkenalan identitas di awal video.</li>
                <li>Wajib mengenakan <strong>jaket almamater BINUS</strong> selama perekaman.</li>
                <li>Mencantumkan daftar referensi berstandar <strong>APA Style</strong> di bagian penutup.</li>
              </ul>
            </Card>
          </div>

          {/* Hashtag Card with 1-Click Copy */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                Hashtag Resmi Wajib Media Sosial
              </span>
              <button
                type="button"
                onClick={handleCopyHashtags}
                className="text-[10px] font-black bg-white hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs flex items-center gap-1"
              >
                {copiedHashtags ? <Check className="w-3.5 h-3.5 text-eco-700" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
                {copiedHashtags ? 'Tersalin!' : 'Salin 1-Klik'}
              </button>
            </div>
            <p className="text-xs font-mono text-amber-950 bg-white/90 p-2.5 rounded-xl border border-amber-200/70 select-all break-all">
              {officialHashtags}
            </p>
          </Card>
        </div>
      )}

      {/* 4. Dual-Track Comparison Section */}
      {(activeTab === 'ALL' || activeTab === 'DUAL') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold-500" />
              2. Pemahaman Sistem Dual-Track I-CAN
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Track A: BEKEN Award */}
            <Card className="p-4 bg-white border-surface-border shadow-eco-sm space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800">
                <Sparkles className="w-4 h-4 text-gold-neon fill-gold-neon" />
                <h3 className="text-xs font-black">Track A: Green Coins & BEKEN Award</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Mekanisme gamifikasi & kompetisi kampus. Koin diperoleh dari kepatuhan kampanye sosial, aksi harian, dan storytelling inspiratif.
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-amber-950 font-bold border border-amber-200">
                🏆 Manfaat: Nominasi tahunan BEKEN Award & Peringkat Fakultas.
              </div>
            </Card>

            {/* Track B: SAT Points */}
            <Card className="p-4 bg-white border-surface-border shadow-eco-sm space-y-2.5">
              <div className="flex items-center gap-2 text-blue-800">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black">Track B: Poin SAT & Jam Comserv</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Mekanisme akademik resmi SSO. Poin diberikan langsung dari aksi fisik riil yang terverifikasi dan memenuhi seluruh standar TFI.
              </p>
              <div className="p-2.5 rounded-xl bg-blue-50 text-[11px] text-blue-950 font-bold border border-blue-200">
                🎓 Manfaat: Transkrip SAT kelulusan & Jam Pengabdian Masyarakat.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 5. Interactive FAQ Accordion */}
      {(activeTab === 'ALL' || activeTab === 'FAQ') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-eco-700" />
              3. Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <span className="text-[10px] text-text-muted">{filteredFaqs.length} Pertanyaan</span>
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <Card
                  key={idx}
                  className="bg-white border-surface-border overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-start justify-between gap-2.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <span className="text-xs font-black text-text-primary leading-snug">
                      {faq.q}
                    </span>
                    <div className="p-1 rounded-lg bg-surface-subtle text-text-muted shrink-0 mt-0.5">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-text-secondary leading-relaxed border-t border-slate-100 bg-surface-subtle/50 animate-in fade-in duration-150">
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
      <Card className="p-5 bg-gradient-to-r from-eco-900 to-eco-800 text-white space-y-3 text-center border-white/10 shadow-eco-card">
        <h3 className="text-sm font-black">Masih Butuh Bantuan Terkait Regulasi?</h3>
        <p className="text-xs text-eco-100 max-w-xs mx-auto leading-relaxed">
          Tim Student Service Office (SSO) dan Teach For Indonesia (TFI) siap membantu proses validasi aksi Anda.
        </p>
        <div className="flex justify-center gap-2 pt-1">
          <Link
            to="/upload"
            className="px-4 py-2 rounded-xl bg-eco-neon text-eco-950 font-black text-xs hover:bg-emerald-300 transition-all shadow-sm flex items-center gap-1"
          >
            Lapor Aksi Sekarang <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
};
