import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { CampusEvent } from '@/types';
import { getEvents, computeEventLeaderboard, EventLeaderboardEntry } from '@/services/eventService';
import { getActions, subscribeToActions } from '@/services/actionService';
import { getAllUsersList, getNeutralAvatarUrl } from '@/services/authService';
import { 
  Trophy, 
  Award, 
  Flame, 
  Coins, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  Leaf, 
  Building2,
  TrendingUp,
  Star,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  nim: string;
  faculty: string;
  avatar: string;
  greenCoins: number;
  comservHours: number;
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

interface FacultyLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  short: string;
  coinsNum: number;
  coins: string;
  carbon: string;
  comservTotal: string;
  registeredCount: number;
}

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'BEKEN' | 'COMSERV' | 'FACULTY' | 'EVENT'>('BEKEN');

  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventLeaderboard, setEventLeaderboard] = useState<EventLeaderboardEntry[]>([]);

  const [cheers, setCheers] = useState<Record<string, number>>({
    socs: 342,
    sis: 289,
    sod: 215,
    bbs: 178,
    foe: 142,
    foh: 118,
    fdcht: 95,
  });
  const [hasCheered, setHasCheered] = useState<Record<string, boolean>>({});

  const [studentRankings, setStudentRankings] = useState<LeaderboardUser[]>([]);
  const [facultyLeaderboard, setFacultyLeaderboard] = useState<FacultyLeaderboardEntry[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const loadEventLeaderboard = () => {
    if (selectedEventId) {
      getActions().then((actions) => {
        const eventActions = actions.filter((a) => a.eventId === selectedEventId);
        const lb = computeEventLeaderboard(eventActions);
        setEventLeaderboard(lb);
      });
    } else {
      setEventLeaderboard([]);
    }
  };

  useEffect(() => {
    loadEventLeaderboard();
    
    // Subscribe to realtime changes
    const unsubscribe = subscribeToActions(() => {
      loadEventLeaderboard();
    });
    
    return () => unsubscribe();
  }, [selectedEventId]);

  const handleCheer = (facultyId: string) => {
    setHasCheered((prev) => ({ ...prev, [facultyId]: !prev[facultyId] }));
    setCheers((prev) => ({
      ...prev,
      [facultyId]: (prev[facultyId] || 100) + (hasCheered[facultyId] ? -1 : 1),
    }));
  };

  const loadLeaderboardData = async () => {
    const [actions, registeredUsers] = await Promise.all([
      getActions(),
      getAllUsersList(),
    ]);

    // 1. Map registered students (filter out deleted accounts and non-students)
    const studentAccounts = registeredUsers.filter((u) => !u.isDeleted && u.role === 'MAHASISWA');
    const targetAccounts = studentAccounts.length > 0 
      ? studentAccounts 
      : registeredUsers.filter((u) => !u.isDeleted && u.role !== 'SUPERADMIN');

    // Index approved actions for highlights
    const approvedActions = actions.filter((a) => a.status === 'APPROVED');
    const actionByUser = new Map<string, typeof actions[0]>();
    const actionStats = new Map<string, { coins: number; comserv: number; carbon: number }>();

    approvedActions.forEach((a) => {
      if (!actionByUser.has(a.userId)) {
        actionByUser.set(a.userId, a);
      }
      const existing = actionStats.get(a.userId) || { coins: 0, comserv: 0, carbon: 0 };
      existing.coins += (a.greenCoinsEarned || 0);
      existing.comserv += (a.comservHoursEarned || 0);
      existing.carbon += (a.carbonImpactKg || 0);
      actionStats.set(a.userId, existing);
    });

    const computedStudents: LeaderboardUser[] = targetAccounts.map((u) => {
      const userAct = actionByUser.get(u.id);
      const actStat = actionStats.get(u.id) || { coins: 0, comserv: 0, carbon: 0 };
      const grossCoins = Math.max(u.lifetimeGreenCoins ?? 0, u.totalGreenCoins ?? 0, actStat.coins);
      const comserv = Math.max(u.totalComservHours ?? 0, actStat.comserv);
      const carbon = Math.max(u.totalCarbonSaved ?? 0, actStat.carbon);

      return {
        id: u.id,
        rank: 0,
        name: u.fullName,
        nim: u.nim,
        faculty: u.facultyName || 'School of Computer Science',
        avatar: u.avatarUrl || getNeutralAvatarUrl(u.fullName, u.nim, u.role),
        greenCoins: grossCoins,
        comservHours: comserv,
        carbonKg: Number(carbon.toFixed(1)),
        streakDays: u.streakDays || 1,
        badge: grossCoins >= 1000 ? 'Duta Lingkungan' : grossCoins >= 500 ? 'Pejuang SDG' : grossCoins >= 250 ? 'Pelindung Bumi' : 'Ksatria Lestari',
        topActionHighlight: {
          title: userAct?.categoryName || 'Aksi Berkelanjutan Kampus',
          category: userAct?.submissionType || 'Aksi Nyata',
          photo: userAct?.photoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80',
          impact: `${carbon.toFixed(1)} kg CO2e / ${comserv} Jam Comserv`,
        },
        quote: 'Bersama mewujudkan kampus BINUS netral karbon dan berkelanjutan.',
      };
    });

    computedStudents.sort((a, b) => b.greenCoins - a.greenCoins);
    computedStudents.forEach((s, idx) => { s.rank = idx + 1; });
    setStudentRankings(computedStudents);

    // 2. Compute Faculty Leaderboard: Rank SUM Green Coin per fakultas dari registered user!
    const BINUS_FACULTIES = [
      { id: 'socs', name: 'School of Computer Science', short: 'SOCS' },
      { id: 'sis', name: 'School of Information Systems', short: 'SIS' },
      { id: 'sod', name: 'School of Design', short: 'SOD' },
      { id: 'bbs', name: 'BINUS Business School', short: 'BBS' },
      { id: 'foe', name: 'Faculty of Engineering', short: 'FOE' },
      { id: 'foh', name: 'Faculty of Humanities', short: 'FOH' },
      { id: 'fdcht', name: 'Faculty of Digital Communication & Hotel & Tourism', short: 'FDCHT' },
    ];

    const facultyMap = new Map<string, {
      id: string;
      name: string;
      short: string;
      coinsSum: number;
      carbonSum: number;
      comservSum: number;
      registeredCount: number;
    }>();

    BINUS_FACULTIES.forEach((f) => {
      facultyMap.set(f.name, {
        id: f.id,
        name: f.name,
        short: f.short,
        coinsSum: 0,
        carbonSum: 0,
        comservSum: 0,
        registeredCount: 0,
      });
    });

    // Aggregate Green Coins sum strictly from registered users
    targetAccounts.forEach((u) => {
      const facName = u.facultyName || 'School of Computer Science';
      const matchedEntry = Array.from(facultyMap.entries()).find(([name]) =>
        name.toLowerCase() === facName.toLowerCase() ||
        name.toLowerCase().includes(facName.toLowerCase()) ||
        facName.toLowerCase().includes(name.toLowerCase())
      );

      let targetKey = facName;
      if (matchedEntry) {
        targetKey = matchedEntry[0];
      } else if (!facultyMap.has(facName)) {
        facultyMap.set(facName, {
          id: facName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: facName,
          short: facName.split(' ').map((w) => w[0]).join('').slice(0, 5).toUpperCase(),
          coinsSum: 0,
          carbonSum: 0,
          comservSum: 0,
          registeredCount: 0,
        });
      }

      const f = facultyMap.get(targetKey)!;
      const userCoins = Math.max(u.lifetimeGreenCoins ?? 0, u.totalGreenCoins ?? 0);
      f.coinsSum += userCoins;
      f.carbonSum += (u.totalCarbonSaved || 0);
      f.comservSum += (u.totalComservHours || 0);
      f.registeredCount += 1;
    });

    // Convert and sort descending by sum of Green Coins!
    const facultyList = Array.from(facultyMap.values());
    facultyList.sort((a, b) => b.coinsSum - a.coinsSum);

    const rankedFaculties: FacultyLeaderboardEntry[] = facultyList.map((f, idx) => ({
      id: f.id,
      rank: idx + 1,
      name: f.name,
      short: f.short,
      coinsNum: f.coinsSum,
      coins: `${f.coinsSum.toLocaleString('id-ID')} GC`,
      carbon: `${f.carbonSum.toFixed(1)} kg CO2e`,
      comservTotal: `${f.comservSum} Jam Comserv`,
      registeredCount: f.registeredCount,
    }));

    setFacultyLeaderboard(rankedFaculties);
  };

  useEffect(() => {
    loadLeaderboardData();

    const unsubscribe = subscribeToActions(() => {
      loadLeaderboardData();
    });
    window.addEventListener('ican:actions-updated', loadLeaderboardData);

    return () => {
      unsubscribe();
      window.removeEventListener('ican:actions-updated', loadLeaderboardData);
    };
  }, []);

  // Sorting logic based on active tab
  const sortedStudents = [...studentRankings].sort((a, b) => {
    if (activeTab === 'COMSERV') {
      return b.comservHours - a.comservHours;
    }
    return b.greenCoins - a.greenCoins;
  });

  const topStudent = sortedStudents[0];
  const runnerUp = sortedStudents[1];
  const thirdPlace = sortedStudents[2];

  const currentUserRank = sortedStudents.findIndex((s) => s.id === user?.id) + 1 || '-';

  // Current user's faculty rank
  const userFacultyEntry = facultyLeaderboard.find(
    (f) => user?.facultyName && f.name.toLowerCase().includes(user.facultyName.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header Standing Banner */}
      <Card variant="eco" className="p-5 sm:p-6 relative overflow-hidden shadow-eco-float border-white/20 text-center space-y-4">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-gold-neon/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-eco-neon/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-eco-100 text-[11px] font-black backdrop-blur-md border border-white/25 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-gold-neon" />
            <span>Peringkat Aksi Iklim Kampus BINUS 2026</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">Campus Green Leaderboard</h1>
          <p className="text-xs text-eco-100/90 max-w-sm mx-auto leading-relaxed">
            Apresiasi mahasiswa & fakultas teraktif go green menuju penghargaan tahunan <b>BEKEN Award</b>.
          </p>
        </div>

        {/* Tab Categorization: Responsive Grid Without Text Overflow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-black/35 p-1.5 rounded-2xl border border-white/20 relative z-10 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('BEKEN')}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'BEKEN'
                ? 'bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 shadow-xs'
                : 'text-eco-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Coins className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">BEKEN (Coins)</span>
          </button>

          <button
            onClick={() => setActiveTab('COMSERV')}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'COMSERV'
                ? 'bg-eco-neon text-eco-950 shadow-xs'
                : 'text-eco-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Jam Comserv TFI</span>
          </button>

          <button
            onClick={() => setActiveTab('FACULTY')}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'FACULTY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-eco-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Fakultas</span>
          </button>

          <button
            onClick={() => setActiveTab('EVENT')}
            className={`w-full py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'EVENT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-eco-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Event Kampus</span>
          </button>
        </div>
      </Card>

      {/* 2. Podium Section for Top 3 (Shown for BEKEN and COMSERV tabs) */}
      {activeTab !== 'FACULTY' && activeTab !== 'EVENT' && (
        <div className="space-y-5">
          {sortedStudents.length >= 3 ? (
            <>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-5 pb-2">
                {/* Rank 2 - Silver */}
                <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-eco-sm text-center space-y-2 relative order-1">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-xs text-slate-700 shadow-xs">
                    2
                  </div>
                  <img
                    src={runnerUp.avatar}
                    alt={runnerUp.name}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover mx-auto ring-2 ring-slate-300 shadow-xs mt-1"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{runnerUp.name}</h4>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">{runnerUp.faculty.split(' ')[0]}</p>
                    <div className="mt-1.5 text-xs sm:text-sm font-black text-slate-800 font-mono">
                      {activeTab === 'COMSERV' ? `${runnerUp.comservHours} Jam` : `${runnerUp.greenCoins} GC`}
                    </div>
                  </div>
                </div>

                {/* Rank 1 - Gold (Elevated) */}
                <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-eco-card text-center space-y-2 relative order-2 -translate-y-2">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-tr from-gold-400 to-amber-500 border-2 border-white flex items-center justify-center font-black text-xs text-slate-950 shadow-neon-glow">
                    👑 1
                  </div>
                  <img
                    src={topStudent.avatar}
                    alt={topStudent.name}
                    className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl object-cover mx-auto ring-4 ring-gold-neon shadow-neon-glow mt-1"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-gold-neon/30 text-amber-950 px-2 py-0.5 rounded-full inline-block">
                      BEKEN Leader
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-text-primary truncate mt-1">{topStudent.name}</h4>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">{topStudent.faculty.split(' ')[0]}</p>
                    <div className="mt-1.5 text-sm sm:text-base font-black text-amber-900 font-mono">
                      {activeTab === 'COMSERV' ? `${topStudent.comservHours} Jam` : `${topStudent.greenCoins} GC`}
                    </div>
                  </div>
                </div>

                {/* Rank 3 - Bronze */}
                <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-amber-200/80 shadow-eco-sm text-center space-y-2 relative order-3">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-black text-xs text-amber-900 shadow-xs">
                    3
                  </div>
                  <img
                    src={thirdPlace.avatar}
                    alt={thirdPlace.name}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover mx-auto ring-2 ring-amber-300 shadow-xs mt-1"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{thirdPlace.name}</h4>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">{thirdPlace.faculty.split(' ')[0]}</p>
                    <div className="mt-1.5 text-xs sm:text-sm font-black text-amber-800 font-mono">
                      {activeTab === 'COMSERV' ? `${thirdPlace.comservHours} Jam` : `${thirdPlace.greenCoins} GC`}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Top Student Spotlight Bento Card */}
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white space-y-4 border-white/15 shadow-eco-float">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gold-neon fill-gold-neon" />
                    <span className="text-xs font-black uppercase tracking-wider text-gold-neon">
                      Top Student Spotlight
                    </span>
                  </div>
                  <Badge variant="gold" size="sm">
                    {topStudent?.streakDays || 5} Hari Streak 🔥
                  </Badge>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={topStudent?.topActionHighlight?.photo}
                    alt={topStudent?.topActionHighlight?.title}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/20 shrink-0 shadow-md"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="text-[10px] text-eco-200 uppercase font-black tracking-wider block">
                      Aksi Unggulan Terverifikasi:
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white leading-snug truncate">
                      {topStudent?.topActionHighlight?.title}
                    </h3>
                    <p className="text-xs text-eco-100/90 line-clamp-2 italic leading-relaxed">
                      "{topStudent?.quote || 'Menjaga bumi, satu langkah kecil setiap hari.'}"
                    </p>
                    <div className="pt-1 flex items-center gap-3 text-xs font-bold">
                      <span className="text-eco-neon">🌿 {topStudent?.carbonKg} kg CO2e Hemat</span>
                      <span className="text-gold-neon">🏆 {topStudent?.greenCoins} GC</span>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div className="text-center p-8 text-text-muted text-sm font-bold bg-white rounded-3xl border border-surface-border shadow-eco-soft">
              Belum ada cukup partisipan untuk menampilkan podium.
            </div>
          )}
        </div>
      )}

      {/* 2B. Faculty Podium Section (Shown for FACULTY tab) */}
      {activeTab === 'FACULTY' && facultyLeaderboard.length >= 3 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500/10 via-eco-500/10 to-blue-500/10 p-4 rounded-3xl border border-amber-200/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Trophy className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-text-primary">
                  Kompetisi Hijau Antar Fakultas BINUS
                </h3>
                <p className="text-xs text-text-secondary">
                  Peringkat dihitung dari <b>akumulasi seluruh Green Coins mahasiswa terdaftar</b> di masing-masing fakultas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-3 pb-2">
            {/* Faculty Rank 2 - Silver */}
            <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-eco-sm text-center space-y-2 relative order-1">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-xs text-slate-700 shadow-xs">
                2
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-sm font-black text-slate-700 ring-2 ring-slate-300 mt-1">
                {facultyLeaderboard[1].short}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{facultyLeaderboard[1].name}</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">{facultyLeaderboard[1].registeredCount} Mahasiswa</p>
                <div className="mt-1.5 text-xs sm:text-sm font-black text-slate-800 font-mono">
                  {facultyLeaderboard[1].coins}
                </div>
              </div>
            </div>

            {/* Faculty Rank 1 - Gold (Elevated) */}
            <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-eco-card text-center space-y-2 relative order-2 -translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-tr from-gold-400 to-amber-500 border-2 border-white flex items-center justify-center font-black text-xs text-slate-950 shadow-neon-glow">
                👑 1
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-400 to-amber-500 flex items-center justify-center mx-auto text-base font-black text-slate-950 ring-4 ring-gold-neon shadow-neon-glow mt-1">
                {facultyLeaderboard[0].short}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider bg-gold-neon/30 text-amber-950 px-2 py-0.5 rounded-full inline-block">
                  Fakultas Terhijau
                </span>
                <h4 className="text-xs sm:text-sm font-black text-text-primary truncate mt-1">{facultyLeaderboard[0].name}</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">{facultyLeaderboard[0].registeredCount} Mahasiswa Terdaftar</p>
                <div className="mt-1.5 text-sm sm:text-base font-black text-amber-900 font-mono">
                  {facultyLeaderboard[0].coins}
                </div>
              </div>
            </div>

            {/* Faculty Rank 3 - Bronze */}
            <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-amber-200/80 shadow-eco-sm text-center space-y-2 relative order-3">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-black text-xs text-amber-900 shadow-xs">
                3
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto text-sm font-black text-amber-900 ring-2 ring-amber-300 mt-1">
                {facultyLeaderboard[2].short}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{facultyLeaderboard[2].name}</h4>
                <p className="text-[10px] text-text-secondary mt-0.5">{facultyLeaderboard[2].registeredCount} Mahasiswa</p>
                <div className="mt-1.5 text-xs sm:text-sm font-black text-amber-800 font-mono">
                  {facultyLeaderboard[2].coins}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Full Ranked Table List (Students / Faculty / Event) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-eco-700" />
            {activeTab === 'FACULTY' ? 'Peringkat Seluruh Fakultas' : activeTab === 'EVENT' ? 'Leaderboard Event Kampus' : 'Daftar Peringkat Mahasiswa'}
          </h3>
          <span className="text-xs font-bold text-text-muted">
            Semester Ganjil 2026/2027
          </span>
        </div>

        {activeTab === 'EVENT' ? (
          <div className="space-y-4">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-surface-border bg-white focus:outline-none focus:border-eco-500 font-bold shadow-xs"
            >
              <option value="">Pilih Event Kampus...</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} — {evt.organizerName}
                </option>
              ))}
            </select>

            {selectedEventId && eventLeaderboard.length === 0 && (
              <div className="text-center py-10 space-y-2 bg-white rounded-3xl border border-surface-border p-6 shadow-xs">
                <Trophy className="w-10 h-10 text-text-muted mx-auto" />
                <p className="text-sm font-bold text-text-secondary">Belum ada peserta di event ini.</p>
              </div>
            )}

            {eventLeaderboard.map((entry) => {
              const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-surface-border shadow-eco-soft"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-700 shrink-0">
                    {medal || `#${entry.rank}`}
                  </div>
                  {entry.userAvatar && (
                    <img src={entry.userAvatar} alt={entry.userName} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-black text-text-primary truncate">{entry.userName}</div>
                    <div className="text-[10px] text-text-muted">{entry.userFaculty} • {entry.totalActions} aksi</div>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-amber-700 font-mono shrink-0">
                    {entry.totalCoins} GC
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'FACULTY' ? (
          /* Faculty List: Grouped by sum of Green Coins from registered users */
          <div className="space-y-3">
            {facultyLeaderboard.map((fac) => (
              <Card 
                key={fac.id} 
                className={`p-4 sm:p-5 bg-white border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  user?.facultyName && fac.name.toLowerCase().includes(user.facultyName.toLowerCase())
                    ? 'border-eco-400 bg-eco-50/50 ring-2 ring-eco-neon/40'
                    : 'border-surface-border hover:border-eco-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                    fac.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' :
                    fac.rank === 2 ? 'bg-slate-100 text-slate-800' :
                    fac.rank === 3 ? 'bg-orange-100 text-orange-900' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    #{fac.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-text-primary">{fac.name}</h4>
                      {fac.short && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {fac.short}
                        </span>
                      )}
                      {user?.facultyName && fac.name.toLowerCase().includes(user.facultyName.toLowerCase()) && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-eco-neon/30 text-eco-950">
                          Fakultas Kamu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {fac.registeredCount} Mahasiswa Terdaftar • {fac.carbon}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-xs sm:text-sm font-black text-amber-800 font-mono block">
                      +{fac.coins}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{fac.comservTotal}</span>
                  </div>

                  <button
                    onClick={() => handleCheer(fac.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 shrink-0 ${
                      hasCheered[fac.id]
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                    title="Dukung Fakultasmu!"
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasCheered[fac.id] ? 'fill-white' : 'fill-rose-500'}`} />
                    <span>{cheers[fac.id] || 120}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Students Full List */
          <div className="space-y-3">
            {sortedStudents.map((s, idx) => (
              <Card
                key={s.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  s.id === user?.id
                    ? 'bg-eco-50/80 border-eco-400 ring-2 ring-eco-neon/50 shadow-xs'
                    : 'bg-white border-surface-border shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs sm:text-sm font-black w-6 text-center shrink-0 ${
                    idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-500' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>

                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{s.name}</h4>
                      {s.id === user?.id && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-eco-neon/30 text-eco-950">
                          Kamu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary truncate mt-0.5">{s.faculty}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-text-primary block font-mono">
                    {activeTab === 'COMSERV' ? `+${s.comservHours} Jam` : `${s.greenCoins} GC`}
                  </span>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">{s.carbonKg} kg CO2e</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 5. Sticky Bottom User Standing Bar */}
      {activeTab !== 'EVENT' && (
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-eco-900 text-white rounded-3xl border border-white/20 shadow-eco-float flex items-center justify-between gap-3">
          {activeTab === 'FACULTY' ? (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                #{userFacultyEntry?.rank || '-'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-black text-white truncate">
                  Fakultas Kamu: {userFacultyEntry ? `${userFacultyEntry.name} (#${userFacultyEntry.rank})` : (user?.facultyName || 'BINUS')}
                </div>
                <p className="text-xs text-eco-200 mt-0.5 truncate">
                  {userFacultyEntry ? `Total kontribusi: ${userFacultyEntry.coins} (${userFacultyEntry.registeredCount} Mahasiswa)` : 'Kumpulkan poin untuk fakultasmu!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-eco-neon/20 border border-eco-neon/40 text-eco-neon flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                #{currentUserRank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-black text-white truncate">Posisi Kamu: Peringkat #{currentUserRank}</div>
                <p className="text-xs text-eco-200 mt-0.5 truncate">
                  {currentUserRank === 1
                    ? 'Pertahankan posisi puncak BEKEN Award!'
                    : `Unggah aksi nyata untuk mengejar peringkat teratas!`}
                </p>
              </div>
            </div>
          )}

          <Link
            to="/upload"
            className="py-2.5 px-3.5 rounded-xl bg-eco-neon text-eco-950 font-black text-xs hover:bg-emerald-300 transition-all active:scale-95 shadow-sm shrink-0"
          >
            Lapor Aksi →
          </Link>
        </Card>
      )}
    </div>
  );
};
