import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';
import { getCategorizedEvents, CategorizedEvents, getEventTimelineCategory } from '@/services/eventService';
import { CampusEvent, DailyQuest, ActionProgram, GreenAction } from '@/types';
import { getDailyQuests, getActionPrograms } from '@/services/questProgramService';
import { getActions, subscribeToActions } from '@/services/actionService';
import { Partner } from '@/types/partner';
import { getPartners } from '@/services/partnerService';
import { 
  TreePine, 
  Droplets, 
  Video, 
  CupSoda, 
  Sparkles, 
  Flame, 
  Coins, 
  Award, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Target, 
  Heart, 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  Trash2, 
  Leaf,
  Handshake,
  QrCode,
  FileCheck2,
  Trophy,
  ExternalLink
} from 'lucide-react';

const resolveProgramIcon = (iconName: string) => {
  switch (iconName) {
    case 'TreePine': return TreePine;
    case 'Droplets': return Droplets;
    case 'Trash2': return Trash2;
    case 'Leaf': return Leaf;
    case 'Zap': return Zap;
    case 'CupSoda': return CupSoda;
    case 'Heart': return Heart;
    case 'Award': return Award;
    case 'BookOpen': return BookOpen;
    case 'Video': return Video;
    default: return TreePine;
  }
};

export const HomePage: React.FC = () => {
  const { user, loadUsersList } = useAuthStore();
  const [userApprovedActions, setUserApprovedActions] = useState<GreenAction[]>([]);
  const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents>({
    today: [],
    upcoming: [],
    past: [],
    all: [],
  });
  const [eventTimelineFilter, setEventTimelineFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'PAST'>('ALL');
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [actionPrograms, setActionPrograms] = useState<ActionProgram[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    getCategorizedEvents().then(setCategorizedEvents);
    getPartners().then((list) => {
      setPartners(list.filter((p) => p.status === 'ACTIVE'));
    }).catch(console.warn);
  }, []);

  useEffect(() => {
    getDailyQuests().then((quests) => {
      setDailyQuests(quests.filter((q) => q.isActive));
    });
    getActionPrograms().then((progs) => {
      setActionPrograms(progs.filter((p) => p.isActive));
    });
  }, []);

  // Synchronize actual user actions & approved balances
  useEffect(() => {
    let isMounted = true;

    const loadUserActions = async () => {
      if (!user?.id) return;
      try {
        const all = await getActions();
        if (!isMounted) return;
        const approved = all.filter(
          (a) => a.status === 'APPROVED' && (a.userId === user.id || (user.nim && a.userId === user.nim))
        );
        setUserApprovedActions(approved);
      } catch (err) {
        console.warn('Failed loading user approved actions on Home:', err);
      }
    };

    loadUserActions();

    // Subscribe to realtime database changes on actions
    const unsubscribe = subscribeToActions(() => {
      loadUserActions();
      loadUsersList().catch(console.warn);
    });

    // Listen to local window update events and focus
    const handleSync = () => {
      loadUserActions();
      loadUsersList().catch(console.warn);
    };

    window.addEventListener('ican:actions-updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener('ican:actions-updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [user?.id, user?.nim]);

  // Dynamic calculations from verified actions and user profile (100% actual, zero dummy)
  const approvedCoinsFromActions = userApprovedActions.reduce(
    (sum, a) => sum + (Number(a.greenCoinsEarned) || 0),
    0
  );
  const approvedComservFromActions = userApprovedActions.reduce(
    (sum, a) => sum + (a.decision === 'APPROVED_COINS_ONLY' ? 0 : (Number(a.comservHoursEarned) || 0)),
    0
  );
  const approvedCarbonFromActions = userApprovedActions.reduce(
    (sum, a) => sum + (Number(a.carbonImpactKg) || 0),
    0
  );

  const totalGreenCoins = Math.max(user?.totalGreenCoins ?? 0, approvedCoinsFromActions);
  const totalComservHours = Math.max(user?.totalComservHours ?? 0, approvedComservFromActions);
  const totalCarbonSaved = Math.max(user?.totalCarbonSaved ?? 0, approvedCarbonFromActions);
  const streakDays = user?.streakDays ?? 1;

  // Standar target kelulusan Teach For Indonesia (TFI)
  const COMSERV_TARGET_HOURS = 30;
  const comservProgressPercent = Math.min(100, Math.round((totalComservHours / COMSERV_TARGET_HOURS) * 100));

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. High-Impact Eco Hero Bento Card */}
      <Card variant="eco" className="relative overflow-hidden p-6 sm:p-7 shadow-eco-float border-white/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-eco-neon/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gold-neon/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Pill Badges */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-eco-100 text-xs font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-neon" />
              <span>BEKEN Standing</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-gold-neon px-3.5 py-1 rounded-full text-xs font-black">
              <Flame className="w-4 h-4 fill-gold-neon animate-bounce-subtle" />
              <span>{streakDays} Hari Streak</span>
            </div>
          </div>

          {/* 3-Pillar Balance Numbers Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Green Coins */}
            <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black tracking-wider text-eco-200">
                  Green Coins
                </span>
                <Coins className="w-4 h-4 text-gold-neon fill-gold-neon" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                {totalGreenCoins} <span className="text-xs font-semibold text-gold-300">GC</span>
              </div>
              <span className="text-[11px] text-gold-neon font-black mt-1 inline-block">
                {totalGreenCoins >= 500 ? '👑 Top 5% Champion' : totalGreenCoins >= 100 ? '⚡ Top 15% Nominee' : '🌱 Eco-Ksatria'}
              </span>
            </div>

            {/* 2. Jam Comserv TFI Track */}
            <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black tracking-wider text-eco-200">
                  Jam Comserv TFI
                </span>
                <Clock className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                {totalComservHours} <span className="text-xs font-semibold text-eco-200">/ {COMSERV_TARGET_HOURS} Jam</span>
              </div>
              <span className="text-[11px] text-cyan-300 font-black mt-1 inline-block">
                {totalComservHours >= COMSERV_TARGET_HOURS ? '🎉 Target Terpenuhi' : '🎓 Target Kelulusan TFI'}
              </span>
            </div>

            {/* 3. Reduksi Karbon */}
            <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black tracking-wider text-eco-200">
                  Reduksi CO2e
                </span>
                <Leaf className="w-4 h-4 text-eco-neon" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                {totalCarbonSaved.toFixed(1)} <span className="text-xs font-semibold text-eco-200">kg</span>
              </div>
              <span className="text-[11px] text-eco-neon font-black mt-1 inline-block">
                Dampak Lingkungan Riil
              </span>
            </div>
          </div>

          {/* Comserv Progress Bar towards 30 Jam TFI Requirement */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2.5">
            <div className="flex justify-between text-xs sm:text-sm text-eco-100 font-black">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-eco-neon" />
                Target {COMSERV_TARGET_HOURS} Jam Community Service (Comserv TFI)
              </span>
              <span className="font-mono text-eco-neon font-bold">
                {comservProgressPercent}% ({totalComservHours}/{COMSERV_TARGET_HOURS} Jam)
              </span>
            </div>
            <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-eco-neon via-emerald-400 to-cyan-300 h-full rounded-full transition-all duration-500 shadow-neon-glow"
                style={{ width: `${comservProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Quick Action Shortcuts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Link
          to="/upload"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-eco-400 hover:shadow-xs transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <TreePine className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-800 block truncate">Lapor Aksi</span>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Unggah Bukti Fisik</span>
          </div>
        </Link>

        <Link
          to="/events"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-800 block truncate">Event Kampus</span>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Pos QR & Kegiatan</span>
          </div>
        </Link>

        <Link
          to="/wallet"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-800 block truncate">Transkrip TFI</span>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Rekap Jam Comserv</span>
          </div>
        </Link>

        <Link
          to="/leaderboard"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-purple-400 hover:shadow-xs transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-800 block truncate">Leaderboard</span>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Klasemen Mahasiswa</span>
          </div>
        </Link>
      </div>

      {/* 3. Event Kampus Section (Today, Upcoming, Past) */}
      {(() => {
        const displayedEvents =
          eventTimelineFilter === 'ALL'
            ? categorizedEvents.all
            : eventTimelineFilter === 'TODAY'
            ? categorizedEvents.today
            : eventTimelineFilter === 'UPCOMING'
            ? categorizedEvents.upcoming
            : categorizedEvents.past;

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-eco-neon" />
                  Event Kampus & Pos Kegiatan
                </h3>
                {categorizedEvents.today.length > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {categorizedEvents.today.length} Live
                  </span>
                )}
              </div>
              <Link to="/events" className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-0.5">
                Lihat Semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Timeline Filter Pills */}
            {categorizedEvents.all.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-black">
                <button
                  type="button"
                  onClick={() => setEventTimelineFilter('ALL')}
                  className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap ${
                    eventTimelineFilter === 'ALL'
                      ? 'bg-eco-700 text-white shadow-xs'
                      : 'bg-surface-subtle text-text-muted hover:bg-slate-200'
                  }`}
                >
                  Semua ({categorizedEvents.all.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventTimelineFilter('TODAY')}
                  className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                    eventTimelineFilter === 'TODAY'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <span>🟢 Hari Ini ({categorizedEvents.today.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEventTimelineFilter('UPCOMING')}
                  className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                    eventTimelineFilter === 'UPCOMING'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <span>🗓️ Akan Datang ({categorizedEvents.upcoming.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEventTimelineFilter('PAST')}
                  className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                    eventTimelineFilter === 'PAST'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🏁 Berlalu ({categorizedEvents.past.length})</span>
                </button>
              </div>
            )}

            {/* Cards Carousel or Empty State */}
            {displayedEvents.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                {displayedEvents.slice(0, 6).map((evt) => {
                  const category = getEventTimelineCategory(evt);
                  const startDateFormatted = new Date(evt.startDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  });
                  const endDateFormatted = new Date(evt.endDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <Link
                      key={evt.id}
                      to={`/events/${evt.id}`}
                      className="shrink-0 w-64 bg-white rounded-2xl border border-surface-border shadow-eco-soft overflow-hidden hover:shadow-eco-card transition-all active:scale-[0.97] group flex flex-col justify-between"
                    >
                      <div>
                        {evt.bannerUrl && (
                          <div className="h-28 overflow-hidden relative">
                            <img
                              src={evt.bannerUrl}
                              alt={evt.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Timeline Status Pill */}
                            <div className="absolute top-2 left-2">
                              {category === 'TODAY' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                  Hari Ini
                                </span>
                              )}
                              {category === 'UPCOMING' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                                  🗓️ Akan Datang
                                </span>
                              )}
                              {category === 'PAST' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-700/80 text-white shadow-xs">
                                  Selesai
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="p-3 space-y-1">
                          <h4 className="text-xs font-black text-text-primary truncate group-hover:text-eco-700 transition-colors">
                            {evt.title}
                          </h4>
                          <p className="text-[10px] text-text-muted truncate">{evt.organizerName}</p>
                          <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1 font-semibold">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-500" />
                              {startDateFormatted === endDateFormatted
                                ? startDateFormatted
                                : `${startDateFormatted} - ${endDateFormatted}`}
                            </span>
                            <span className="text-eco-700 font-bold">
                              {evt.activities.length} Pos Kegiatan
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : categorizedEvents.all.length > 0 ? (
              <div className="bg-surface-subtle/70 rounded-2xl border border-dashed border-surface-border p-4 text-center space-y-1">
                <p className="text-xs font-bold text-text-secondary">
                  Tidak ada event pada kategori {eventTimelineFilter === 'TODAY' ? 'Hari Ini' : eventTimelineFilter === 'UPCOMING' ? 'Akan Datang' : 'Berlalu'}.
                </p>
                <button
                  type="button"
                  onClick={() => setEventTimelineFilter('ALL')}
                  className="text-[11px] font-black text-eco-700 hover:underline"
                >
                  Lihat semua event ({categorizedEvents.all.length})
                </button>
              </div>
            ) : (
              <div className="bg-surface-subtle/50 rounded-2xl border border-surface-border p-4 text-center space-y-1.5">
                <Calendar className="w-6 h-6 text-text-muted mx-auto" />
                <p className="text-xs font-bold text-text-secondary">Belum ada event kampus yang terdaftar.</p>
                <p className="text-[10px] text-text-muted">
                  Penyelenggara unit (SSO / ASD) dapat membuat event baru melalui portal AdminLTE.
                </p>
                {(user?.role === 'SUPERADMIN' || user?.role === 'ORGANIZER') && (
                  <Link
                    to="/adminlte"
                    className="inline-block mt-1 px-3 py-1 rounded-xl bg-eco-700 text-white text-[10px] font-black hover:bg-eco-800 transition-colors"
                  >
                    + Buat Event di Portal AdminLTE
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. Daily Quests Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Daily Quests (Misi Kampus Harian)
          </h2>
          <span className="text-xs font-black text-eco-900 bg-eco-neon/20 px-2.5 py-0.5 rounded-full border border-eco-neon/40">
            Bonus Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {dailyQuests.map((quest) => (
            <Card 
              key={quest.id} 
              className={`p-4 sm:p-5 space-y-3 border transition-all ${
                quest.completed 
                  ? 'bg-eco-50/60 border-eco-200' 
                  : 'bg-white border-surface-border hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-black text-text-primary leading-snug">{quest.title}</h4>
                {quest.completed ? (
                  <span className="text-[11px] font-black text-eco-900 bg-eco-neon/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-eco-700" /> Selesai
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {quest.deadline}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{quest.desc}</p>
              <div className="flex items-center justify-between pt-1 text-xs font-black border-t border-black/5">
                <span className="text-amber-800">{quest.reward}</span>
                {!quest.completed && (
                  <Link to={quest.actionUrl || `/upload?source=quest&questId=${quest.id}`} className="text-eco-800 hover:underline flex items-center gap-0.5 font-bold">
                    Kerjakan Misi →
                  </Link>
                )}
              </div>
            </Card>
          ))}

          {dailyQuests.length === 0 && (
            <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Belum ada Daily Quests aktif saat ini.
            </div>
          )}
        </div>
      </div>

      {/* 5. TFI Action Hub Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <TreePine className="w-4 h-4 text-eco-700" />
              Pilihan Program Aksi Nyata
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">Pilih program resmi TFI, unggah bukti fisik & raih Jam Comserv</p>
          </div>
          {actionPrograms.length > 0 && (
            <Link to="/upload?source=program" className="text-xs font-black text-eco-800 hover:text-eco-950 flex items-center gap-0.5">
              Unggah <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {actionPrograms.map((prog) => {
            const Icon = resolveProgramIcon(prog.icon);
            return (
              <Link key={prog.id} to={`/upload?source=program&programId=${prog.id}`} className="block">
                <Card className="p-4 sm:p-5 bg-white border-surface-border shadow-eco-sm hover:shadow-eco-card hover:border-eco-400 transition-all duration-200 group active:scale-[0.98] space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${prog.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-eco-900 bg-eco-50 px-2 py-0.5 rounded border border-eco-200 inline-block">
                          {prog.urgency}
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-text-primary leading-snug mt-1 group-hover:text-eco-800 transition-colors truncate">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5 truncate">{prog.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rewards Breakdown Bar */}
                  <div className="bg-surface-subtle p-3 rounded-2xl flex items-center justify-between text-xs font-black border border-surface-border/60">
                    <span className="text-blue-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      +{prog.comservHours} Jam Comserv TFI
                    </span>
                    <span className="text-amber-800">+{prog.coins} Green Coins</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary pt-0.5 border-t border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[10px]">
                      {prog.tag} • {prog.co2}
                    </span>
                    <span className="font-black text-eco-800 flex items-center gap-0.5">
                      Lapor Sekarang →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}

          {actionPrograms.length === 0 && (
            <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Belum ada Program Aksi Nyata aktif saat ini.
            </div>
          )}
        </div>
      </div>

      {/* 6. SDG 17 Partners Showcase Section */}
      {partners.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Handshake className="w-4 h-4 text-cyan-600" />
                Kolaborasi Mitra SDG 17
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">Kemitraan strategis BINUS University dengan lembaga peduli lingkungan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {partners.slice(0, 4).map((partner) => (
              <Card key={partner.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={partner.logoUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80'}
                    alt={partner.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 inline-block mb-1">
                      {partner.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{partner.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{partner.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                  <span className="text-[11px] text-slate-500">
                    {partner.programs.length} Program Bersama
                  </span>
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eco-700 hover:text-eco-900 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
