import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { 
  Globe2, 
  TreePine, 
  Droplets, 
  GraduationCap, 
  Recycle, 
  Building2, 
  HeartPulse, 
  Handshake, 
  Wind, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Info, 
  ExternalLink, 
  FileText, 
  Scale, 
  Award, 
  Search,
  BookOpen,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export interface SdgGoalItem {
  id: number;
  sdgNumber: string;
  name: string;
  nameEn: string;
  colorHex: string;
  bgGradient: string;
  badgeVariant: 'success' | 'warning' | 'purple' | 'blue' | 'neutral';
  icon: any;
  binusContext: string;
  targetFocus: string;
  mappedActivities: Array<{
    title: string;
    actionType: 'SELF_GREEN_CAMPAIGN' | 'PENYULUHAN_AKSI_NYATA' | 'VIDEO_BASED_LEARNING';
    satPoints: number;
    greenCoins: number;
    comservHours: number;
    carbonKg: number;
    evidenceReq: string;
    calculationBasis: string;
    uploadCategoryKey: string;
  }>;
  sdgIndicators: string[];
}

export const BINUS_SDG_GOALS: SdgGoalItem[] = [
  {
    id: 13,
    sdgNumber: 'SDG 13',
    name: 'Penanganan Perubahan Iklim',
    nameEn: 'Climate Action',
    colorHex: '#3F7E44',
    bgGradient: 'from-emerald-900 via-emerald-800 to-green-900',
    badgeVariant: 'success',
    icon: Wind,
    binusContext: 'Fokus BINUS dalam mereduksi jejak karbon operasional multi-kampus (Greater Jakarta, Bandung, Malang, Semarang) dan memberdayakan mahasiswa dalam aksi mitigasi emisi gas rumah kaca.',
    targetFocus: 'Target 13.3: Peningkatan pendidikan, kesadaran, dan kapasitas manusia terhadap mitigasi serta adaptasi perubahan iklim.',
    mappedActivities: [
      {
        title: 'Penanaman Bibit Pohon Berbatang Keras (TFI)',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 25,
        comservHours: 2,
        carbonKg: 5.0,
        evidenceReq: 'Min. 5 bibit pohon keras (Tabebuya, Mahoni, Trembesi) di taman kota/sekolah/fasum. Foto wajib GPS geotag & geotimestamp.',
        calculationBasis: 'IPCC Tier-1 Forestry Carbon Sequestration Model (5.00 kg CO2e / bibit tumbuh)',
        uploadCategoryKey: 'cat-tree-planting',
      },
      {
        title: 'Penggunaan BINUS Shuttle Bus & Transportasi Publik',
        actionType: 'SELF_GREEN_CAMPAIGN',
        satPoints: 0,
        greenCoins: 15,
        comservHours: 0,
        carbonKg: 0.12,
        evidenceReq: 'Foto tiket/e-boarding shuttle BINUS atau selfie saat menggunakan KRL/MRT/TransJakarta menuju kampus.',
        calculationBasis: 'Penghindaran emisi kendaraan pribadi (0.12 kg CO2e / perjalanan komuter)',
        uploadCategoryKey: 'cat-shuttle-bus',
      },
      {
        title: 'Efisiensi Energi & Switch-Off Listrik Ruang Kuliah',
        actionType: 'SELF_GREEN_CAMPAIGN',
        satPoints: 0,
        greenCoins: 10,
        comservHours: 0,
        carbonKg: 0.08,
        evidenceReq: 'Foto mematikan proyektor, AC, atau saklar lampu di ruang kelas BINUS setelah selesai jam perkuliahan.',
        calculationBasis: 'Standar konservasi energi PLN Jam Puncak (0.08 kg CO2e per 1 kWh saved)',
        uploadCategoryKey: 'cat-energy-saving',
      },
    ],
    sdgIndicators: [
      'Total serapan karbon (kg CO2e) tervalidasi',
      'Jumlah pohon tertanam oleh sivitas akademika',
      'Rasio penggunaan transportasi rendah emisi',
    ],
  },
  {
    id: 15,
    sdgNumber: 'SDG 15',
    name: 'Ekosistem Daratan',
    nameEn: 'Life on Land',
    colorHex: '#56C02B',
    bgGradient: 'from-green-900 via-emerald-800 to-teal-900',
    badgeVariant: 'success',
    icon: TreePine,
    binusContext: 'Konservasi keanekaragaman hayati perkotaan, pencegahan degradasi tanah, dan pemeliharaan ruang terbuka hijau (RTH) di sekitar lingkungan kampus dan komunitas mitra TFI.',
    targetFocus: 'Target 15.2: Menghentikan deforestasi, memulihkan lahan kritis, dan meningkatkan reboisasi secara global.',
    mappedActivities: [
      {
        title: 'Pembuatan Lubang Resapan Biopori Bersama Warga (TFI)',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 0.5,
        evidenceReq: 'Min. 5 lubang pipa biopori terpasang dengan sampah organik pengisi. Foto bersama warga/kelompok di lokasi.',
        calculationBasis: 'Methane Avoidance melalui pengomposan aerobik tanah (0.50 kg CO2e / lubang / bulan)',
        uploadCategoryKey: 'cat-biopori',
      },
      {
        title: 'Perawatan Taman Vertikal & Kebun Komunitas Kampus',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 1.2,
        evidenceReq: 'Foto penataan media tanam organik, penyiraman, dan pemeliharaan tanaman produktif di area kampus/sekolah mitra.',
        calculationBasis: 'Soil Organic Carbon Enrichment (1.20 kg CO2e / m2 area terpelihara)',
        uploadCategoryKey: 'cat-tree-planting',
      },
    ],
    sdgIndicators: [
      'Jumlah titik lubang biopori aktif terdata',
      'Luas kanopi hijau dan tanah tersuburkan',
      'Kemitraan konservasi lahan urban TFI',
    ],
  },
  {
    id: 6,
    sdgNumber: 'SDG 6',
    name: 'Air Bersih & Sanitasi Layak',
    nameEn: 'Clean Water and Sanitation',
    colorHex: '#26BDE2',
    bgGradient: 'from-cyan-900 via-sky-800 to-blue-900',
    badgeVariant: 'blue',
    icon: Droplets,
    binusContext: 'Pemberdayaan akses higienitas air bersih dan fasilitas sanitasi publik di permukiman binaan TFI serta manajemen konservasi air di lingkungan kampus BINUS.',
    targetFocus: 'Target 6.2: Akses sanitasi dan higienitas yang memadai bagi seluruh masyarakat, serta edukasi perilaku hidup bersih.',
    mappedActivities: [
      {
        title: 'Instalasi & Edukasi Wastafel Cuci Tangan Komunitas (TFI)',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 0.2,
        evidenceReq: 'Min. 1 unit wastafel higienis terpasang beserta sabun dan poster panduan CTPS (Cuci Tangan Pakai Sabun).',
        calculationBasis: 'Pengurangan risiko penularan patogen air & pemanfaatan saluran sanitasi (0.20 kg CO2e eq)',
        uploadCategoryKey: 'cat-handwash-station',
      },
      {
        title: 'Konservasi Cadangan Air Tanah via Biopori',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 0.5,
        evidenceReq: 'Laporan survei dan implementasi biopori untuk resapan air hujan mencegah genangan banjir di musim hujan.',
        calculationBasis: 'Groundwater Recharge Volume Index (1 lubang menyerap hingga 3 m3 air limpasan/thn)',
        uploadCategoryKey: 'cat-biopori',
      },
    ],
    sdgIndicators: [
      'Unit fasilitas sanitasi publik terpasang',
      'Volume air hujan terinfiltrasi ke akuifer tanah',
      'Jumlah penerima manfaat edukasi sanitasi',
    ],
  },
  {
    id: 4,
    sdgNumber: 'SDG 4',
    name: 'Pendidikan Berkualitas',
    nameEn: 'Quality Education',
    colorHex: '#C5192D',
    bgGradient: 'from-rose-950 via-red-900 to-slate-900',
    badgeVariant: 'purple',
    icon: GraduationCap,
    binusContext: 'Tridharma Perguruan Tinggi BINUS University dalam menyebarluaskan literasi sains keberlanjutan melalui konten digital edukatif berbasis riset dan bimbingan belajar TFI.',
    targetFocus: 'Target 4.7: Memastikan seluruh peserta didik memperoleh pengetahuan dan keterampilan yang dibutuhkan untuk pembangunan berkelanjutan.',
    mappedActivities: [
      {
        title: 'Video Based Learning (VBL) Edukasi Keberlanjutan (TFI)',
        actionType: 'VIDEO_BASED_LEARNING',
        satPoints: 3,
        greenCoins: 25,
        comservHours: 2,
        carbonKg: 0.1,
        evidenceReq: 'Video 5–10 menit, wajib jaket almamater BINUS, bumper logo TFI di awal, daftar referensi ilmiah berformat APA Style di akhir.',
        calculationBasis: 'Digital Knowledge Transfer Impact Multiplier (Rasio views & engagement mahasiswa)',
        uploadCategoryKey: 'cat-vbl-video',
      },
      {
        title: 'Penyuluhan Daring & Webinar Literasi Lingkungan',
        actionType: 'VIDEO_BASED_LEARNING',
        satPoints: 3,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 0.08,
        evidenceReq: 'Rekaman sesi penyuluhan interaktif bersama siswa sekolah binaan atau komunitas masyarakat TFI.',
        calculationBasis: 'Community Engagement Hours Index (Transfer IPTEK mahasiswa ke masyarakat)',
        uploadCategoryKey: 'cat-vbl-video',
      },
    ],
    sdgIndicators: [
      'Jumlah jam materi VBL terarsip di repository kampus',
      'Kepatuhan kaidah akademik (Sitasi APA Style)',
      'Jangkauan penonton video edukasi (YouTube/TikTok/Reels)',
    ],
  },
  {
    id: 12,
    sdgNumber: 'SDG 12',
    name: 'Konsumsi & Produksi Bertanggung Jawab',
    nameEn: 'Responsible Consumption and Production',
    colorHex: '#BF8B2E',
    bgGradient: 'from-amber-950 via-yellow-900 to-slate-900',
    badgeVariant: 'warning',
    icon: Recycle,
    binusContext: 'Mewujudkan kampus sirkular bebas sampah plastik sekali pakai (Zero Single-Use Plastic) serta pengelolaan limbah elektronik dan sisa makanan di seluruh food court kampus BINUS.',
    targetFocus: 'Target 12.5: Mengurangi produksi limbah secara substansial melalui pencegahan, pengurangan, daur ulang, dan penggunaan kembali.',
    mappedActivities: [
      {
        title: 'Penggunaan Tumbler & Wadah Guna Ulang di Kampus',
        actionType: 'SELF_GREEN_CAMPAIGN',
        satPoints: 0,
        greenCoins: 10,
        comservHours: 0,
        carbonKg: 0.05,
        evidenceReq: 'Foto mengisi air di Water Station BINUS atau membawa kotak makan guna ulang di Food Court kampus.',
        calculationBasis: 'Penghindaran sampah plastik botol PET 600ml (0.05 kg CO2e per pemakaian)',
        uploadCategoryKey: 'cat-tumbler',
      },
      {
        title: 'Pilah Sampah Elektronik (E-Waste) di Kampus Drop Point',
        actionType: 'SELF_GREEN_CAMPAIGN',
        satPoints: 0,
        greenCoins: 15,
        comservHours: 0,
        carbonKg: 0.3,
        evidenceReq: 'Foto memasukkan baterai bekas/kabel usang ke kotak e-waste resmi di lobi kampus BINUS.',
        calculationBasis: 'EPA WARM Model E-Waste Recycling (0.30 kg CO2e avoided)',
        uploadCategoryKey: 'cat-ewaste',
      },
      {
        title: 'Zero Textile Waste & Daur Ulang Kain Perca (SOD)',
        actionType: 'SELF_GREEN_CAMPAIGN',
        satPoints: 0,
        greenCoins: 20,
        comservHours: 0,
        carbonKg: 0.45,
        evidenceReq: 'Foto kreasi upcycling pakaian lama atau penyerahan kain perca ke bank sampah tekstil kampus.',
        calculationBasis: 'Textile Upcycling Carbon Offset Factor (0.45 kg CO2e / kg kain)',
        uploadCategoryKey: 'cat-textile-upcycle',
      },
    ],
    sdgIndicators: [
      'Tonase plastik sekali pakai terhindar dari TPA',
      'Koleksi limbah elektronik (E-Waste) terkelola aman',
      'Tingkat partisipasi kebiasaan zero-waste harian',
    ],
  },
  {
    id: 11,
    sdgNumber: 'SDG 11',
    name: 'Kota & Komunitas Berkelanjutan',
    nameEn: 'Sustainable Cities and Communities',
    colorHex: '#FD9D24',
    bgGradient: 'from-orange-950 via-amber-900 to-slate-900',
    badgeVariant: 'warning',
    icon: Building2,
    binusContext: 'Integrasi mobilitas ramah lingkungan antar-kampus (Kijang, Syahdan, Anggrek, Alam Sutera, JWC) dan pengabdian masyarakat di kawasan urban padat.',
    targetFocus: 'Target 11.2: Akses ke sistem transportasi yang aman, terjangkau, mudah diakses, dan berkelanjutan untuk semua.',
    mappedActivities: [
      {
        title: 'Bike to Campus & Jalan Kaki Jarak Dekat',
        actionType: 'SELF_GREEN_CAMPAIGN',
        satPoints: 0,
        greenCoins: 15,
        comservHours: 0,
        carbonKg: 0.15,
        evidenceReq: 'Foto sepeda di area parkir khusus sepeda kampus BINUS atau rute jalan kaki menuju ruang kuliah.',
        calculationBasis: 'Zero-Emission Active Commute (0.15 kg CO2e per 2 km perjalanan)',
        uploadCategoryKey: 'cat-bike-to-campus',
      },
      {
        title: 'Aksi Bersih Lingkungan Permukiman Sekitar Kampus',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 0.35,
        evidenceReq: 'Foto kerja bakti pembersihan saluran air dan pemilahan sampah bersama warga RT/RW sekitar kampus.',
        calculationBasis: 'Urban Cleanliness & Waste Diversion (0.35 kg CO2e / aksi)',
        uploadCategoryKey: 'cat-biopori',
      },
    ],
    sdgIndicators: [
      'Jumlah rute perjalanan aktif bebas emisi',
      'Wilayah RT/RW binaan sekitar kampus yang terdampak positif',
    ],
  },
  {
    id: 3,
    sdgNumber: 'SDG 3',
    name: 'Kehidupan Sehat & Sejahtera',
    nameEn: 'Good Health and Well-Being',
    colorHex: '#4C9F38',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    badgeVariant: 'success',
    icon: HeartPulse,
    binusContext: 'Menciptakan lingkungan kampus sehat, fasilitas higienitas berstandar tinggi, dan pencegahan polusi udara di seluruh area BINUS University.',
    targetFocus: 'Target 3.9: Mengurangi secara substansial jumlah kematian dan kesakitan akibat bahan kimia berbahaya serta polusi udara, air, dan tanah.',
    mappedActivities: [
      {
        title: 'Penyediaan Sarana Higienitas Publik (Wastafel TFI)',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 20,
        comservHours: 2,
        carbonKg: 0.2,
        evidenceReq: 'Fasilitas cuci tangan dengan air mengalir dan sabun antiseptik di ruang publik / sekolah.',
        calculationBasis: 'Pencegahan transmisi penyakit menular berbasis sanitasi',
        uploadCategoryKey: 'cat-handwash-station',
      },
    ],
    sdgIndicators: [
      'Indeks ketersediaan sanitasi higienis di lokasi pengabdian',
      'Peningkatan kualitas hidup komunitas masyarakat binaan',
    ],
  },
  {
    id: 17,
    sdgNumber: 'SDG 17',
    name: 'Kemitraan untuk Mencapai Tujuan',
    nameEn: 'Partnerships for the Goals',
    colorHex: '#19486A',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    badgeVariant: 'purple',
    icon: Handshake,
    binusContext: 'Sinergi pentahelix antara BINUS University (SSO & TFI), pemerintah daerah, komunitas warga, organisasi lingkungan, dan mitra industri CSR.',
    targetFocus: 'Target 17.17: Mendorong dan memajukan kemitraan publik, swasta, dan masyarakat sipil yang efektif.',
    mappedActivities: [
      {
        title: 'Kolaborasi Pengabdian Multidisiplin TFI x Mitra Komunitas',
        actionType: 'PENYULUHAN_AKSI_NYATA',
        satPoints: 4,
        greenCoins: 25,
        comservHours: 2,
        carbonKg: 2.5,
        evidenceReq: 'Laporan kelompok terstruktur yang melibatkan mitra eksternal (RT/RW, yayasan sosial, atau sekolah binaan).',
        calculationBasis: 'Multi-Stakeholder Social Impact Value',
        uploadCategoryKey: 'cat-tree-planting',
      },
    ],
    sdgIndicators: [
      'Jumlah mitra eksternal kolaboratif aktif',
      'Integrasi data capaian SDG ke audit tahunan BINUS',
    ],
  },
];

export const SdgGuidelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGoalId, setSelectedGoalId] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGoals = BINUS_SDG_GOALS.filter((goal) => {
    if (selectedGoalId !== 'ALL' && goal.id !== selectedGoalId) return false;
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchName = goal.name.toLowerCase().includes(query) || goal.nameEn.toLowerCase().includes(query);
    const matchContext = goal.binusContext.toLowerCase().includes(query) || goal.targetFocus.toLowerCase().includes(query);
    const matchActivity = goal.mappedActivities.some(
      (a) => a.title.toLowerCase().includes(query) || a.evidenceReq.toLowerCase().includes(query)
    );
    return matchName || matchContext || matchActivity;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Banner: BINUS & UN SDG Commitment */}
      <Card variant="eco" className="p-6 text-white space-y-4 shadow-eco-float relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-eco-neon shadow-neon-glow border border-white/25">
              <Globe2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/25">
                  BINUS Impact Framework
                </span>
                <span className="text-[10px] font-bold text-eco-100 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-eco-neon" /> UN 2030 Agenda
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                Panduan & Pemetaan Target SDG BINUS
              </h1>
            </div>
          </div>

          <Link
            to="/guide"
            className="text-xs font-bold text-eco-100 hover:text-white bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-xl transition-colors border border-white/20 shrink-0"
          >
            ← Kembali ke Pusat Panduan
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-eco-100/90 leading-relaxed max-w-3xl">
          Sebagai wujud nyata visi <b>Fostering and Empowering the Society</b>, BINUS University melalui platform <b>I-CAN</b> mengintegrasikan seluruh pelaporan aksi keberlanjutan mahasiswa ke dalam <b>Target Pembangunan Berkelanjutan (UN SDGs)</b>. Setiap aksi yang kamu laporkan terkuantifikasi secara saintifik dan masuk ke dalam rekapitulasi audit reputasi global kampus.
        </p>

        {/* Quick Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <div className="text-xs text-eco-200 font-medium">Fokus Prioritas</div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5">8 Target Prioritas SDG</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <div className="text-xs text-eco-200 font-medium">Standar Saintifik</div>
            <div className="text-sm sm:text-base font-black text-eco-neon mt-0.5">IPCC Tier-1 Model</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <div className="text-xs text-eco-200 font-medium">Rekognisi Resmi</div>
            <div className="text-sm sm:text-base font-black text-amber-300 mt-0.5">Poin SAT & BEKEN</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
            <div className="text-xs text-eco-200 font-medium">Validasi Tim</div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5">Portal SSO & TFI</div>
          </div>
        </div>
      </Card>

      {/* 2. Search & Interactive Goal Filter Pills */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aksi, kata kunci SDG, atau standar emisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white border border-surface-border focus:border-eco-500 focus:ring-2 focus:ring-eco-neon/30 outline-none transition-all shadow-xs"
            />
          </div>

          {/* Reset Filter Button */}
          {selectedGoalId !== 'ALL' && (
            <button
              onClick={() => setSelectedGoalId('ALL')}
              className="text-xs font-bold text-eco-800 bg-eco-50 hover:bg-eco-100 px-3.5 py-2.5 rounded-2xl transition-colors border border-eco-200 shrink-0 text-center"
            >
              Reset Filter (Tampilkan Semua)
            </button>
          )}
        </div>

        {/* SDG Pills Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedGoalId('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-black shrink-0 transition-all ${
              selectedGoalId === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs scale-105'
                : 'bg-white text-text-secondary border border-surface-border hover:bg-slate-100'
            }`}
          >
            🌟 Semua SDG ({BINUS_SDG_GOALS.length})
          </button>

          {BINUS_SDG_GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoalId === goal.id;

            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`px-4 py-2 rounded-full text-xs font-black shrink-0 transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'text-white shadow-xs scale-105'
                    : 'bg-white text-text-secondary border-surface-border hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: isSelected ? goal.colorHex : undefined,
                  borderColor: isSelected ? goal.colorHex : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{goal.sdgNumber}: {goal.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SDG Goal Cards Bento Grid */}
      <div className="space-y-6 sm:space-y-7">
        {filteredGoals.length === 0 ? (
          <Card className="p-8 text-center bg-white border-surface-border space-y-3 shadow-eco-card">
            <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-sm sm:text-base font-black text-text-primary">Tidak Ada Target SDG yang Cocok</h3>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              Coba gunakan kata kunci lain seperti "Pohon", "Biopori", "VBL", "Iklim", atau "Plastik".
            </p>
            <Button size="sm" variant="secondary" onClick={() => { setSearchQuery(''); setSelectedGoalId('ALL'); }}>
              Reset Pencarian
            </Button>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const GoalIcon = goal.icon;

            return (
              <Card 
                key={goal.id} 
                className="p-6 sm:p-7 bg-white border-surface-border shadow-eco-card space-y-5 relative overflow-hidden transition-all hover:border-slate-300 rounded-3xl"
              >
                {/* Accent Top Bar Colored with SDG Official Color */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ backgroundColor: goal.colorHex }}
                />

                {/* Header Goal Title */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                      style={{ backgroundColor: goal.colorHex }}
                    >
                      <GoalIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-black text-white px-2.5 py-0.5 rounded-md"
                          style={{ backgroundColor: goal.colorHex }}
                        >
                          {goal.sdgNumber}
                        </span>
                        <span className="text-xs font-mono text-text-muted font-bold">
                          UN Sustainable Development Goal
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-text-primary mt-1">
                        {goal.name} <span className="text-xs font-normal text-text-secondary">({goal.nameEn})</span>
                      </h2>
                    </div>
                  </div>

                  <Badge variant={goal.badgeVariant} size="sm">
                    {goal.mappedActivities.length} Aksi Terpetakan
                  </Badge>
                </div>

                {/* BINUS Relevance & Strategic Context */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-subtle border border-surface-border/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-text-primary">
                    <Info className="w-4 h-4 text-eco-700" />
                    <span>Fokus & Konteks Strategis BINUS:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {goal.binusContext}
                  </p>
                  <div className="text-xs font-medium text-slate-700 bg-white/90 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    🎯 <b>Target Global:</b> {goal.targetFocus}
                  </div>
                </div>

                {/* Mapped Activities Table / Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-eco-600" />
                    Kegiatan I-CAN yang Memenuhi Target {goal.sdgNumber}:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {goal.mappedActivities.map((act, idx) => (
                      <div 
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl border border-surface-border bg-white hover:bg-eco-50/20 transition-all space-y-3 flex flex-col justify-between shadow-2xs group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-text-primary group-hover:text-eco-900 transition-colors leading-snug">
                              {act.title}
                            </h4>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                              act.actionType === 'PENYULUHAN_AKSI_NYATA' ? 'bg-eco-100 text-eco-900' :
                              act.actionType === 'VIDEO_BASED_LEARNING' ? 'bg-purple-100 text-purple-900' :
                              'bg-amber-100 text-amber-900'
                            }`}>
                              {act.actionType === 'PENYULUHAN_AKSI_NYATA' ? 'Aksi Nyata TFI' :
                               act.actionType === 'VIDEO_BASED_LEARNING' ? 'VBL Edukasi' : 'Self Campaign'}
                            </span>
                          </div>

                          {/* Reward Badges Matrix */}
                          <div className="flex items-center flex-wrap gap-2 text-xs font-black">
                            {act.satPoints > 0 ? (
                              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-700" /> +{act.satPoints} SAT Points
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl">
                                Self Green Habit
                              </span>
                            )}
                            <span className="bg-eco-50 text-eco-900 border border-eco-200 px-2.5 py-1 rounded-xl">
                              +{act.greenCoins} Green Coins
                            </span>
                            {act.carbonKg > 0 && (
                              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl font-mono">
                                -{act.carbonKg} kg CO₂e
                              </span>
                            )}
                          </div>

                          {/* Evidence Requirements */}
                          <div className="text-xs text-text-secondary leading-relaxed pt-1.5 border-t border-surface-border/60">
                            📋 <b>Syarat Bukti:</b> {act.evidenceReq}
                          </div>

                          {/* Scientific Basis */}
                          <div className="text-xs text-text-muted font-mono bg-slate-50 p-2 rounded-xl leading-relaxed">
                            🔬 <b>Dasar Saintifik:</b> {act.calculationBasis}
                          </div>
                        </div>

                        {/* CTA Direct Submission */}
                        <div className="pt-2.5 border-t border-surface-border/60 flex items-center justify-between">
                          <span className="text-xs text-text-muted font-bold">
                            {act.comservHours > 0 ? `Setara ${act.comservHours} Jam Comserv` : 'Apresiasi BEKEN Award'}
                          </span>
                          <button
                            onClick={() => navigate('/upload')}
                            className="inline-flex items-center gap-1 text-xs font-black text-eco-800 hover:text-eco-950 transition-colors group-hover:translate-x-0.5"
                          >
                            <span>Lapor Aksi Ini</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Indicators Footer */}
                <div className="pt-3.5 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-text-primary">Indikator Keberhasilan Kampus:</span>
                    {goal.sdgIndicators.map((ind, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                        • {ind}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-black text-eco-700 hover:underline shrink-0 text-left"
                  >
                    Fokus Target Ini ↑
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* 4. Scientific Carbon Calculation & Audit Standards Card */}
      <Card className="p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-eco-950 text-white rounded-3xl space-y-5 border border-slate-700 shadow-eco-float">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-eco-neon/20 border border-eco-neon/40 text-eco-neon flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Metodologi Kuantifikasi Dampak Saintifik (IPCC)</h3>
            <p className="text-xs text-eco-200 mt-0.5">Standardisasi Audit Pengurangan Emisi Karbon & Rekognisi Akademik BINUS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-eco-neon text-xs sm:text-sm">1. IPCC Tier-1 Forestry</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Formula sekuestrasi karbon pohon berbatang keras: <b>5.00 kg CO2e / pohon tumbuh</b>. Dihitung berdasarkan laju penyerapan biomassa tahunan jenis tanaman peneduh perkotaan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-eco-neon text-xs sm:text-sm">2. Methane Avoidance Biopori</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dekomposisi sampah organik secara aerobik di dalam tanah menghindari terbentuknya gas CH4 (metana): <b>0.50 kg CO2e / lubang / bulan</b> (GWP faktor 28x CO2).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-eco-neon text-xs sm:text-sm">3. EPA WARM & LCA Model</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Penggantian botol plastik PET (0.05 kg CO2e) dan emisi shuttle bus komuter (0.12 kg CO2e) mengacu pada faktor emisi Kementerian LHK & US-EPA Waste Reduction Model.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="text-xs text-slate-400 leading-relaxed">
            Setiap aksi mahasiswa dipra-validasi oleh <b>Multimodal AI Vision</b> sebelum diverifikasi manual oleh Verifikator SSO.
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/upload')}
            className="text-xs sm:text-sm font-black shadow-neon-glow py-2.5 px-4 rounded-2xl shrink-0"
          >
            Mulai Laporkan Aksi Nyata →
          </Button>
        </div>
      </Card>
    </div>
  );
};
