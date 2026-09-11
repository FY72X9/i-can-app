import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { CampusEvent } from '@/types';
import { getEvents, computeEventLeaderboard, EventLeaderboardEntry } from '@/services/eventService';
import { getActions } from '@/services/actionService';
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
  const [activeTab, setActiveTab] = useState<'BEKEN' | 'SAT' | 'FACULTY' | 'EVENT'>('BEKEN');

  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventLeaderboard, setEventLeaderboard] = useState<EventLeaderboardEntry[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      getActions().then((actions) => {
        const eventActions = actions.filter((a) => a.eventId === selectedEventId);
        const lb = computeEventLeaderboard(eventActions);
        setEventLeaderboard(lb);
      });
    }
  }, [selectedEventId]);

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

  const [studentRankings, setStudentRankings] = useState<LeaderboardUser[]>([]);
  const [facultyLeaderboard, setFacultyLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    getActions().then((actions) => {
      // Compute Student Rankings
      const userMap = new Map<string, LeaderboardUser>();
      actions.forEach(a => {
        if (a.status !== 'APPROVED') return;
        if (!userMap.has(a.userId)) {
          userMap.set(a.userId, {
            id: a.userId,
            rank: 0,
            name: a.userName || 'Anonim',
            nim: 'N/A',
            faculty: a.userFaculty || 'Bina Nusantara',
            avatar: a.userAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            greenCoins: 0,
            satPoints: 0,
            carbonKg: 0,
            streakDays: 0,
            badge: 'Eco Warrior',
            topActionHighlight: {
              title: a.categoryName || 'Aksi Ramah Lingkungan',
              category: a.submissionType || 'Aksi Harian',
              photo: a.photoUrl,
              impact: `${a.carbonImpactKg || 0} kg CO2e / ${a.satPointsEarned || 0} SAT`
            }
          });
        }
        const u = userMap.get(a.userId)!;
        u.greenCoins += (a.greenCoinsEarned || 0);
        u.satPoints += (a.satPointsEarned || 0);
        u.carbonKg += (a.carbonImpactKg || 0);
      });

      const computedStudents = Array.from(userMap.values());
      // Sort for rank assignment (default by GC)
      computedStudents.sort((a, b) => b.greenCoins - a.greenCoins);
      computedStudents.forEach((s, idx) => s.rank = idx + 1);

      setStudentRankings(computedStudents);

      // Compute Faculty Leaderboard
      const facultyMap = new Map<string, any>();
      computedStudents.forEach(s => {
        if (!facultyMap.has(s.faculty)) {
          facultyMap.set(s.faculty, {
            id: s.faculty,
            rank: 0,
            name: s.faculty,
            carbonNum: 0,
            coinsNum: 0,
            satNum: 0,
            activeStudents: 0
          });
        }
        const f = facultyMap.get(s.faculty)!;
        f.carbonNum += s.carbonKg;
        f.coinsNum += s.greenCoins;
        f.satNum += s.satPoints;
        f.activeStudents += 1;
      });

      const computedFaculties = Array.from(facultyMap.values());
      computedFaculties.sort((a, b) => b.coinsNum - a.coinsNum);
      computedFaculties.forEach((f, idx) => {
        f.rank = idx + 1;
        f.carbon = `${f.carbonNum.toFixed(1)} kg CO2e`;
        f.coins = `${f.coinsNum} GC`;
        f.satTotal = `${f.satNum} SAT`;
      });
      setFacultyLeaderboard(computedFaculties);
    });
  }, []);

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

  const currentUserRank = sortedStudents.findIndex((s) => s.id === user?.id) + 1 || '-';

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

          <button
            onClick={() => setActiveTab('EVENT')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'EVENT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-eco-100 hover:text-white'
            }`}
          >
            🎪 Event
          </button>
        </div>
      </Card>

      {/* 2. Podium Section for Top 3 (Shown for BEKEN and SAT tabs) */}
      {activeTab !== 'FACULTY' && activeTab !== 'EVENT' && (
        <div className="space-y-5">
          {sortedStudents.length >= 3 ? (
            <>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-5 pb-2">
              {/* Rank 2 - Silver */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-eco-sm text-center space-y-2 relative order-1">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-xs text-slate-700 shadow-xs">
                2
              </div>
              <img
                src={runnerUp.avatar}
                alt={runnerUp.name}
                className="w-14 h-14 rounded-2xl object-cover mx-auto ring-2 ring-slate-300 shadow-xs mt-1"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{runnerUp.name}</h4>
                <p className="text-xs text-text-secondary truncate mt-0.5">{runnerUp.faculty.split(' ')[0]}</p>
                <div className="mt-1.5 text-xs sm:text-sm font-black text-slate-800">
                  {activeTab === 'SAT' ? `${runnerUp.satPoints} SAT` : `${runnerUp.greenCoins} GC`}
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
                className="w-16 h-16 rounded-2xl object-cover mx-auto ring-4 ring-gold-neon shadow-neon-glow mt-1"
              />
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider bg-gold-neon/30 text-amber-950 px-2 py-0.5 rounded-full inline-block">
                  BEKEN Leader
                </span>
                <h4 className="text-xs sm:text-sm font-black text-text-primary truncate mt-1">{topStudent.name}</h4>
                <p className="text-xs text-text-secondary truncate mt-0.5">{topStudent.faculty.split(' ')[0]}</p>
                <div className="mt-1.5 text-sm sm:text-base font-black text-amber-900">
                  {activeTab === 'SAT' ? `${topStudent.satPoints} SAT` : `${topStudent.greenCoins} GC`}
                </div>
              </div>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-eco-sm text-center space-y-2 relative order-3">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-black text-xs text-amber-900 shadow-xs">
                3
              </div>
              <img
                src={thirdPlace.avatar}
                alt={thirdPlace.name}
                className="w-14 h-14 rounded-2xl object-cover mx-auto ring-2 ring-amber-300 shadow-xs mt-1"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{thirdPlace.name}</h4>
                <p className="text-xs text-text-secondary truncate mt-0.5">{thirdPlace.faculty.split(' ')[0]}</p>
                <div className="mt-1.5 text-xs sm:text-sm font-black text-amber-800">
                  {activeTab === 'SAT' ? `${thirdPlace.satPoints} SAT` : `${thirdPlace.greenCoins} GC`}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Top Student Spotlight Bento Card */}
          <Card className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white space-y-4 border-white/15 shadow-eco-float">
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

            <div className="flex items-start gap-4">
              <img
                src={topStudent?.topActionHighlight?.photo}
                alt={topStudent?.topActionHighlight?.title}
                className="w-20 h-20 rounded-2xl object-cover border border-white/20 shrink-0 shadow-md"
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

      {/* 4. Full Ranked Table List (Students / Faculty) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-eco-700" />
            {activeTab === 'FACULTY' ? 'Peringkat Seluruh Fakultas' : activeTab === 'EVENT' ? 'Leaderboard Event' : 'Daftar Peringkat Mahasiswa'}
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
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-surface-border bg-white focus:outline-none focus:border-eco-500 font-bold"
            >
              <option value="">Pilih Event...</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} — {evt.organizerName}
                </option>
              ))}
            </select>

            {selectedEventId && eventLeaderboard.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <Trophy className="w-10 h-10 text-text-muted mx-auto" />
                <p className="text-sm font-bold text-text-secondary">Belum ada peserta di event ini.</p>
              </div>
            )}

            {eventLeaderboard.map((entry) => {
              const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-surface-border shadow-eco-soft"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-700 shrink-0">
                    {medal || `#${entry.rank}`}
                  </div>
                  {entry.userAvatar && (
                    <img src={entry.userAvatar} alt={entry.userName} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-text-primary truncate">{entry.userName}</div>
                    <div className="text-[10px] text-text-muted">{entry.userFaculty} • {entry.totalActions} aksi</div>
                  </div>
                  <div className="text-xs font-black text-amber-700 font-mono shrink-0">{entry.totalCoins} GC</div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'FACULTY' ? (
          /* Faculty List */
          <div className="space-y-3">
            {facultyLeaderboard.map((fac) => (
              <Card key={fac.id} className="p-4 sm:p-5 bg-white border-surface-border shadow-xs hover:border-eco-300 transition-all flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                    fac.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    fac.rank === 2 ? 'bg-slate-100 text-slate-800' :
                    fac.rank === 3 ? 'bg-orange-100 text-orange-900' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    #{fac.rank}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">{fac.name}</h4>
                    <p className="text-xs text-text-secondary font-mono mt-0.5">
                      {fac.carbon} • {fac.satTotal} ({fac.activeStudents} Mahasiswa)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCheer(fac.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 shrink-0 ${
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
                  <span className="text-xs sm:text-sm font-black text-text-primary block">
                    {activeTab === 'SAT' ? `+${s.satPoints} SAT` : `${s.greenCoins} GC`}
                  </span>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">{s.carbonKg} kg CO2e</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 5. Sticky Bottom User Standing Bar (when not in faculty tab) */}
      {activeTab !== 'FACULTY' && activeTab !== 'EVENT' && (
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-eco-900 text-white rounded-3xl border border-white/20 shadow-eco-float flex items-center justify-between gap-3">
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

          <Link
            to="/upload"
            className="py-2 px-3.5 rounded-xl bg-eco-neon text-eco-950 font-black text-xs hover:bg-emerald-300 transition-all active:scale-95 shadow-sm shrink-0"
          >
            Lapor Aksi →
          </Link>
        </Card>
      )}
    </div>
  );
};
