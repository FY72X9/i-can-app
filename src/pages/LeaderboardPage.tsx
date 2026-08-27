import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { 
  Trophy, 
  Award, 
  Flame, 
  Coins, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  Leaf, 
  ChevronRight, 
  TreePine, 
  ShieldCheck, 
  Droplets, 
  Video, 
  ArrowUpRight,
  TrendingUp,
  Star,
  Users,
  Target
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  nim: string;
  faculty: string;
  avatar: string;
  greenCoins: number;
  satPoints: number;
  carbonKg: number;
  streakDays: number;
  badge: string;
  topActionHighlight: {
    title: string;
    category: string;
    photo: string;
    impact: string;
  };
  quote?: string;
}

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'BEKEN' | 'SAT' | 'FACULTY'>('BEKEN');

  const [cheers, setCheers] = useState<Record<string, number>>({
    socs: 342,
    sod: 289,
    sis: 215,
    eng: 178,
    bbs: 142,
    hum: 98,
  });
  const [hasCheered, setHasCheered] = useState<Record<string, boolean>>({});

  const handleCheer = (facultyId: string) => {
    setHasCheered((prev) => ({ ...prev, [facultyId]: !prev[facultyId] }));
    setCheers((prev) => ({
      ...prev,
      [facultyId]: prev[facultyId] + (hasCheered[facultyId] ? -1 : 1),
    }));
  };

  const studentRankings: LeaderboardUser[] = [
    {
      id: 'usr-student-003',
      rank: 1,
      name: 'Nadia Safira',
      nim: '2602234567',
      faculty: 'School of Design (SOD)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      greenCoins: 890,
      satPoints: 68,
      carbonKg: 24.80,
      streakDays: 9,
      badge: '👑 #1 BEKEN Nominee',
      topActionHighlight: {
        title: 'Penanaman 5 Pohon Tabebuya & VBL Zero Waste',
        category: 'Penyuluhan & Aksi Nyata TFI',
        photo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        impact: '10.5 kg CO2e / 8 SAT',
      },
      quote: 'Desain berkelanjutan bukan sekadar tren, tapi tanggung jawab masa depan.',
    },
    {
      id: 'usr-student-001',
      rank: 2,
      name: 'Budi Santoso',
      nim: '2602158890',
      faculty: 'School of Computer Science (SOCS)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      greenCoins: 450,
      satPoints: 45,
      carbonKg: 12.50,
      streakDays: 5,
      badge: '🥈 Top Contributor',
      topActionHighlight: {
        title: 'Pembuatan 5 Lubang Biopori RT 04 & Shuttle Bus',
        category: 'Penyuluhan & Aksi Nyata TFI',
        photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
        impact: '5.5 kg CO2e / 4 SAT',
      },
      quote: 'Mulai dari langkah kecil: bawa tumbler dan buat biopori di lingkungan kampus.',
    },
    {
      id: 'usr-student-002',
      rank: 3,
      name: 'Kevin Pratama',
      nim: '2602188412',
      faculty: 'School of Information Systems (SIS)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      greenCoins: 380,
      satPoints: 32,
      carbonKg: 9.40,
      streakDays: 7,
      badge: '🥉 Bronze Eco-Star',
      topActionHighlight: {
        title: 'Drop Point Daur Ulang & Kampanye Hemat Listrik',
        category: 'Self Green Campaign',
        photo: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        impact: '4.2 kg CO2e / 0 SAT',
      },
    },
    {
      id: 'usr-student-006',
      rank: 4,
      name: 'Clarissa Putri',
      nim: '2602199841',
      faculty: 'School of Design (SOD)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      greenCoins: 310,
      satPoints: 28,
      carbonKg: 7.80,
      streakDays: 4,
      badge: 'Eco Warrior',
      topActionHighlight: {
        title: 'Video Based Learning Edukasi Zero Waste',
        category: 'VBL TFI',
        photo: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80',
        impact: '0.1 kg CO2e / 3 SAT',
      },
    },
    {
      id: 'usr-student-007',
      rank: 5,
      name: 'Maya Anggraini',
      nim: '2602887711',
      faculty: 'BINUS Business School (BBS)',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      greenCoins: 275,
      satPoints: 24,
      carbonKg: 6.20,
      streakDays: 6,
      badge: 'Green Ambassador',
      topActionHighlight: {
        title: 'Pengurangan Botol Plastik Kantin Kampus',
        category: 'Self Campaign',
        photo: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
        impact: '2.5 kg CO2e / 0 SAT',
      },
    },
    {
      id: 'usr-student-004',
      rank: 6,
      name: 'Farhan Ramadhan',
      nim: '2602345678',
      faculty: 'Faculty of Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      greenCoins: 210,
      satPoints: 16,
      carbonKg: 5.10,
      streakDays: 3,
      badge: 'Eco Rising Star',
      topActionHighlight: {
        title: 'Pengelolaan Limbah E-Waste & Bike to Campus',
        category: 'Self Campaign',
        photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        impact: '1.8 kg CO2e / 0 SAT',
      },
    },
    {
      id: 'usr-student-008',
      rank: 7,
      name: 'Dimas Prakoso',
      nim: '2602776655',
      faculty: 'School of Computer Science',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      greenCoins: 185,
      satPoints: 12,
      carbonKg: 4.30,
      streakDays: 2,
      badge: 'Eco Volunteer',
      topActionHighlight: {
        title: 'Pembersihan Sampah Drop Point Kampus Syahdan',
        category: 'Self Campaign',
        photo: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        impact: '1.2 kg CO2e / 0 SAT',
      },
    },
  ];

  const facultyLeaderboard = [
    { id: 'socs', rank: 1, name: 'School of Computer Science (SOCS)', carbon: '482.5 kg CO2e', coins: '4,850 GC', satTotal: '640 SAT', activeStudents: 148 },
    { id: 'sod', rank: 2, name: 'School of Design (SOD)', carbon: '412.0 kg CO2e', coins: '4,120 GC', satTotal: '580 SAT', activeStudents: 124 },
    { id: 'sis', rank: 3, name: 'School of Information Systems (SIS)', carbon: '356.8 kg CO2e', coins: '3,560 GC', satTotal: '490 SAT', activeStudents: 112 },
    { id: 'eng', rank: 4, name: 'Faculty of Engineering', carbon: '298.4 kg CO2e', coins: '2,980 GC', satTotal: '390 SAT', activeStudents: 86 },
    { id: 'bbs', rank: 5, name: 'BINUS Business School (BBS)', carbon: '245.0 kg CO2e', coins: '2,450 GC', satTotal: '310 SAT', activeStudents: 74 },
    { id: 'hum', rank: 6, name: 'Faculty of Humanities', carbon: '180.2 kg CO2e', coins: '1,800 GC', satTotal: '220 SAT', activeStudents: 52 },
  ];

  // Sorting logic based on active tab
  const sortedStudents = [...studentRankings].sort((a, b) => {
    if (activeTab === 'SAT') {
      return b.satPoints - a.satPoints;
    }
    return b.greenCoins - a.greenCoins;
  });

  const topStudent = sortedStudents[0];
  const runnerUp = sortedStudents[1];
  const thirdPlace = sortedStudents[2];

  const currentUserRank = sortedStudents.findIndex((s) => s.id === user?.id) + 1 || 2;

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header Standing Banner */}
      <Card variant="eco" className="p-6 relative overflow-hidden shadow-eco-float border-white/20 text-center space-y-4">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-gold-neon/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-eco-neon/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-eco-100 text-[11px] font-black backdrop-blur-md border border-white/25 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-gold-neon" />
            <span>Peringkat Aksi Iklim Kampus BINUS 2026</span>
          </div>

          <h1 className="text-xl font-black text-white">Campus Green Leaderboard</h1>
          <p className="text-xs text-eco-100/90 max-w-xs mx-auto leading-relaxed">
            Apresiasi mahasiswa teraktif go green menuju penghargaan tahunan <b>BEKEN Award</b>.
          </p>
        </div>

        {/* Tab Segmented Control */}
        <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/20 relative z-10 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('BEKEN')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'BEKEN'
                ? 'bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 shadow-xs'
                : 'text-eco-100 hover:text-white'
            }`}
          >
            🏆 BEKEN (Coins)
          </button>

          <button
            onClick={() => setActiveTab('SAT')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'SAT'
                ? 'bg-eco-neon text-eco-950 shadow-xs'
                : 'text-eco-100 hover:text-white'
            }`}
          >
            🎓 Poin SAT Riil
          </button>

          <button
            onClick={() => setActiveTab('FACULTY')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'FACULTY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-eco-100 hover:text-white'
            }`}
          >
            🏛️ Fakultas
          </button>
        </div>
      </Card>

      {/* 2. Podium Section for Top 3 (Shown for BEKEN and SAT tabs) */}
      {activeTab !== 'FACULTY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-4 pb-2">
            {/* Rank 2 - Silver */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-eco-sm text-center space-y-1.5 relative order-1">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-xs text-slate-700 shadow-xs">
                2
              </div>
              <img
                src={runnerUp.avatar}
                alt={runnerUp.name}
                className="w-12 h-12 rounded-2xl object-cover mx-auto ring-2 ring-slate-300 shadow-xs mt-1"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-text-primary truncate">{runnerUp.name}</h4>
                <p className="text-[9px] text-text-secondary truncate">{runnerUp.faculty.split(' ')[0]}</p>
                <div className="mt-1 text-[11px] font-black text-slate-800">
                  {activeTab === 'SAT' ? `${runnerUp.satPoints} SAT` : `${runnerUp.greenCoins} GC`}
                </div>
              </div>
            </div>

            {/* Rank 1 - Gold (Elevated) */}
            <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-3.5 border-2 border-amber-300 shadow-eco-card text-center space-y-1.5 relative order-2 -translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-tr from-gold-400 to-amber-500 border-2 border-white flex items-center justify-center font-black text-xs text-slate-950 shadow-neon-glow">
                👑 1
              </div>
              <img
                src={topStudent.avatar}
                alt={topStudent.name}
                className="w-14 h-14 rounded-2xl object-cover mx-auto ring-4 ring-gold-neon shadow-neon-glow mt-1"
              />
              <div className="min-w-0">
                <span className="text-[8px] font-black uppercase tracking-wider bg-gold-neon/30 text-amber-950 px-2 py-0.2 rounded-full inline-block">
                  BEKEN Leader
                </span>
                <h4 className="text-xs font-black text-text-primary truncate mt-0.5">{topStudent.name}</h4>
                <p className="text-[9px] text-text-secondary truncate">{topStudent.faculty.split(' ')[0]}</p>
                <div className="mt-1 text-sm font-black text-amber-900">
                  {activeTab === 'SAT' ? `${topStudent.satPoints} SAT` : `${topStudent.greenCoins} GC`}
                </div>
              </div>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="bg-white rounded-3xl p-3 border border-amber-200/80 shadow-eco-sm text-center space-y-1.5 relative order-3">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-black text-xs text-amber-900 shadow-xs">
                3
              </div>
              <img
                src={thirdPlace.avatar}
                alt={thirdPlace.name}
                className="w-12 h-12 rounded-2xl object-cover mx-auto ring-2 ring-amber-300 shadow-xs mt-1"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-text-primary truncate">{thirdPlace.name}</h4>
                <p className="text-[9px] text-text-secondary truncate">{thirdPlace.faculty.split(' ')[0]}</p>
                <div className="mt-1 text-[11px] font-black text-amber-800">
                  {activeTab === 'SAT' ? `${thirdPlace.satPoints} SAT` : `${thirdPlace.greenCoins} GC`}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Top Student Spotlight Bento Card */}
          <Card className="p-4.5 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white space-y-3.5 border-white/15 shadow-eco-float">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gold-neon fill-gold-neon" />
                <span className="text-xs font-black uppercase tracking-wider text-gold-neon">
                  Top Student Spotlight
                </span>
              </div>
              <Badge variant="gold" size="sm">
                9 Hari Streak 🔥
              </Badge>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={topStudent.topActionHighlight.photo}
                alt={topStudent.topActionHighlight.title}
                className="w-20 h-20 rounded-2xl object-cover border border-white/20 shrink-0 shadow-md"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[9px] text-eco-200 uppercase font-black tracking-wider block">
                  Aksi Unggulan Terverifikasi:
                </span>
                <h3 className="text-xs font-black text-white leading-snug truncate">
                  {topStudent.topActionHighlight.title}
                </h3>
                <p className="text-[10px] text-eco-100/90 line-clamp-2 italic">
                  "{topStudent.quote}"
                </p>
                <div className="pt-1 flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-eco-neon">🌿 {topStudent.carbonKg} kg CO2e Hemat</span>
                  <span className="text-gold-neon">🏆 {topStudent.greenCoins} GC</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 4. Full Ranked Table List (Students / Faculty) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-eco-700" />
            {activeTab === 'FACULTY' ? 'Peringkat Seluruh Fakultas' : 'Daftar Peringkat Mahasiswa'}
          </h3>
          <span className="text-[10px] font-bold text-text-muted">
            Semester Ganjil 2026/2027
          </span>
        </div>

        {activeTab === 'FACULTY' ? (
          /* Faculty List */
          <div className="space-y-2.5">
            {facultyLeaderboard.map((fac) => (
              <Card key={fac.id} className="p-3.5 bg-white border-surface-border shadow-xs hover:border-eco-300 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    fac.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    fac.rank === 2 ? 'bg-slate-100 text-slate-800' :
                    fac.rank === 3 ? 'bg-orange-100 text-orange-900' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    #{fac.rank}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-text-primary truncate">{fac.name}</h4>
                    <p className="text-[10px] text-text-secondary font-mono">
                      {fac.carbon} • {fac.satTotal} ({fac.activeStudents} Mahasiswa)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCheer(fac.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 shrink-0 ${
                    hasCheered[fac.id]
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                  title="Dukung Fakultasmu!"
                >
                  <Heart className={`w-3.5 h-3.5 ${hasCheered[fac.id] ? 'fill-white' : 'fill-rose-500'}`} />
                  <span>{cheers[fac.id] || 100}</span>
                </button>
              </Card>
            ))}
          </div>
        ) : (
          /* Students Full List */
          <div className="space-y-2.5">
            {sortedStudents.map((s, idx) => (
              <Card
                key={s.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  s.id === user?.id
                    ? 'bg-eco-50/80 border-eco-400 ring-2 ring-eco-neon/50 shadow-xs'
                    : 'bg-white border-surface-border shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-xs font-black w-6 text-center shrink-0 ${
                    idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-500' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>

                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-text-primary truncate">{s.name}</h4>
                      {s.id === user?.id && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-eco-neon/30 text-eco-950">
                          Kamu
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-secondary truncate">{s.faculty}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-text-primary block">
                    {activeTab === 'SAT' ? `+${s.satPoints} SAT` : `${s.greenCoins} GC`}
                  </span>
                  <p className="text-[10px] text-text-secondary font-mono">{s.carbonKg} kg CO2e</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 5. Sticky Bottom User Standing Bar (when not in faculty tab) */}
      {activeTab !== 'FACULTY' && (
        <Card className="p-3.5 bg-gradient-to-r from-slate-900 to-eco-900 text-white rounded-2xl border border-white/20 shadow-eco-float flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-eco-neon/20 border border-eco-neon/40 text-eco-neon flex items-center justify-center font-black text-xs">
              #{currentUserRank}
            </div>
            <div>
              <div className="text-xs font-black text-white">Posisi Kamu: Peringkat #{currentUserRank}</div>
              <p className="text-[10px] text-eco-200">
                {currentUserRank === 1
                  ? 'Pertahankan posisi puncak BEKEN Award!'
                  : `Unggah aksi nyata untuk mengejar peringkat teratas!`}
              </p>
            </div>
          </div>

          <Link
            to="/upload"
            className="py-1.5 px-3 rounded-xl bg-eco-neon text-eco-950 font-black text-xs hover:bg-emerald-300 transition-all active:scale-95 shadow-sm"
          >
            Lapor Aksi →
          </Link>
        </Card>
      )}
    </div>
  );
};
