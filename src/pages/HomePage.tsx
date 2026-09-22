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
    <div className="space-y-5 pb-8">
      {/* 1. High-Impact Eco Hero Bento Card */}
      <Card variant="eco" className="relative overflow-hidden p-4 sm:p-5 shadow-eco-float border-white/20 rounded-3xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-eco-neon/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gold-neon/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Top Pill Badges */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-neon" />
              <span>BEKEN Active</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-400/20 backdrop-blur-md border border-amber-300/35 text-gold-neon px-3 py-1 rounded-full text-[11px] font-black">
              <Flame className="w-3.5 h-3.5 fill-gold-neon animate-bounce-subtle" />
              <span>{streakDays} Hari Streak</span>
            </div>
          </div>

          {/* Bento Row 1: Green Coins Featured Metric (Full Width) */}
          <div className="bg-black/25 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center justify-between transition-all hover:bg-black/30">
            <div>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-gold-neon fill-gold-neon" />
                <span className="text-[10px] sm:text-[11px] uppercase font-black tracking-wider text-eco-200">
                  Green Coins
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1 leading-none">
                {totalGreenCoins} <span className="text-xs font-bold text-gold-300">GC</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] sm:text-[11px] text-gold-neon font-black bg-gold-400/15 border border-gold-300/30 px-2.5 py-1 rounded-xl inline-block">
                {totalGreenCoins >= 500 ? '👑 Top 5% Champion' : totalGreenCoins >= 100 ? '⚡ Top 15% Nominee' : '🌱 Eco-Ksatria'}
              </span>
              <span className="text-[9px] text-eco-100/70 block mt-1">Klasemen BEKEN</span>
            </div>
          </div>

          {/* Bento Row 2: Jam Comserv & Reduksi CO2e (2 Equal Balanced Columns) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Jam Comserv TFI */}
            <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-left flex flex-col justify-between transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-eco-200">
                  Comserv TFI
                </span>
                <Clock className="w-3.5 h-3.5 text-cyan-300" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-tight">
                {totalComservHours} <span className="text-xs font-semibold text-eco-200">/ {COMSERV_TARGET_HOURS} Jam</span>
              </div>
              <span className="text-[10px] text-cyan-300 font-bold mt-1 truncate">
                {totalComservHours >= COMSERV_TARGET_HOURS ? '🎉 Target Tercapai' : 'Syarat Kelulusan'}
              </span>
            </div>

            {/* Reduksi Karbon */}
            <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-left flex flex-col justify-between transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-eco-200">
                  Reduksi CO2e
                </span>
                <Leaf className="w-3.5 h-3.5 text-eco-neon" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-tight">
                {totalCarbonSaved.toFixed(1)} <span className="text-xs font-semibold text-eco-200">kg</span>
              </div>
              <span className="text-[10px] text-eco-neon font-bold mt-1 truncate">
                Dampak Riil Kampus
              </span>
            </div>
          </div>

          {/* Bento Row 3: Graduation Progress Bar towards 30 Jam TFI Requirement */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-eco-100 font-black">
              <span className="flex items-center gap-1.5 truncate">
                <Target className="w-3.5 h-3.5 text-eco-neon shrink-0" />
                <span className="truncate">Target {COMSERV_TARGET_HOURS} Jam Comserv TFI</span>
              </span>
              <span className="font-mono text-eco-neon font-bold shrink-0 ml-2">
                {comservProgressPercent}% ({totalComservHours}/{COMSERV_TARGET_HOURS} Jam)
              </span>
            </div>
            <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-eco-neon via-emerald-400 to-cyan-300 h-full rounded-full transition-all duration-500 shadow-neon-glow"
                style={{ width: `${comservProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-eco-200/80 pt-0.5">
              <span>Syarat Wajib Kelulusan BINUS</span>
              <span className="font-semibold text-white">
                {totalComservHours >= COMSERV_TARGET_HOURS ? 'Target Selesai ✅' : `Sisa ${Math.max(0, COMSERV_TARGET_HOURS - totalComservHours)} Jam Lagi`}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Quick Action Shortcuts (4-Column Launcher) */}
      <div className="grid grid-cols-4 gap-2">
        <Link
          to="/upload"
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all active:scale-95 group text-center min-h-[82px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <TreePine className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-slate-800 leading-tight">Lapor Aksi</span>
          <span className="text-[9px] text-slate-400 font-medium mt-0.5">Bukti Fisik</span>
        </Link>

        <Link
          to="/events"
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all active:scale-95 group text-center min-h-[82px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-slate-800 leading-tight">Event</span>
          <span className="text-[9px] text-slate-400 font-medium mt-0.5">Pos QR</span>
        </Link>

        <Link
          to="/wallet"
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-500 hover:shadow-xs transition-all active:scale-95 group text-center min-h-[82px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-slate-800 leading-tight">Transkrip</span>
          <span className="text-[9px] text-slate-400 font-medium mt-0.5">Comserv</span>
        </Link>

        <Link
          to="/leaderboard"
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-500 hover:shadow-xs transition-all active:scale-95 group text-center min-h-[82px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-slate-800 leading-tight">Ranking</span>
          <span className="text-[9px] text-slate-400 font-medium mt-0.5">BEKEN</span>
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
                <h3 className="text-xs sm:text-sm font-black text-text-primary flex items-center gap-1.5">
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
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
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
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
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
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
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
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
                    eventTimelineFilter === 'PAST'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🏁 Berlalu ({categorizedEvents.past.length})</span>
                </button>
              </div>
            )}

            {/* Cards Carousel */}
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
                      className="shrink-0 w-60 sm:w-64 bg-white rounded-2xl border border-surface-border shadow-eco-soft overflow-hidden hover:shadow-eco-card transition-all active:scale-[0.97] group flex flex-col justify-between"
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
                        <div className="p-3 space-y-1.5">
                          <h4 className="text-xs font-black text-text-primary truncate group-hover:text-eco-700 transition-colors">
                            {evt.title}
                          </h4>
                          <p className="text-[10px] text-text-muted truncate">{evt.organizerName}</p>
                          <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1.5 border-t border-slate-100 font-semibold">
                            <span className="flex items-center gap-1 text-slate-600 truncate">
                              <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="truncate">
                                {startDateFormatted === endDateFormatted
                                  ? startDateFormatted
                                  : `${startDateFormatted} - ${endDateFormatted}`}
                              </span>
                            </span>
                            <span className="text-eco-700 font-black bg-eco-50 px-2 py-0.5 rounded-full border border-eco-200 shrink-0">
                              {evt.activities.length} Pos
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
                    to="/admin"
                    className="inline-block mt-1 px-3 py-1 rounded-xl bg-eco-700 text-white text-[10px] font-black hover:bg-eco-800 transition-colors"
                  >
                    + Buat Event di Portal Admin
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. Daily Quests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Daily Quests (Misi Kampus Harian)
          </h2>
          <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            Bonus Harian
          </span>
        </div>

        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <Card 
              key={quest.id} 
              className={`p-3.5 sm:p-4 space-y-2.5 border transition-all ${
                quest.completed 
                  ? 'bg-eco-50/60 border-eco-200' 
                  : 'bg-white border-surface-border hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-text-primary leading-snug">{quest.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-0.5">{quest.desc}</p>
                </div>
                {quest.completed ? (
                  <span className="text-[10px] font-black text-eco-900 bg-eco-neon/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-eco-500/20">
                    <CheckCircle2 className="w-3 h-3 text-eco-700" /> Selesai
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-700" /> {quest.deadline}
                  </span>
                )}
              </div>

              {/* Reward & Action Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1 font-black text-amber-800 text-[11px]">
                  <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{quest.reward}</span>
                </div>
                {!quest.completed && (
                  <Link 
                    to={quest.actionUrl || `/upload?source=quest&questId=${quest.id}`} 
                    className="px-3 py-1 rounded-xl bg-eco-700 hover:bg-eco-800 text-white font-black text-[11px] flex items-center gap-1 shadow-xs transition-colors active:scale-95"
                  >
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
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <TreePine className="w-4 h-4 text-eco-700" />
              Pilihan Program Aksi Nyata
            </h2>
            <p className="text-[11px] text-text-secondary mt-0.5">Program resmi TFI untuk raih Jam Comserv & Green Coins</p>
          </div>
          {actionPrograms.length > 0 && (
            <Link to="/upload?source=program" className="text-xs font-black text-eco-800 hover:text-eco-950 flex items-center gap-0.5 shrink-0">
              Unggah <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {actionPrograms.map((prog) => {
            const Icon = resolveProgramIcon(prog.icon);
            return (
              <Link key={prog.id} to={`/upload?source=program&programId=${prog.id}`} className="block">
                <Card className="p-3.5 sm:p-4 bg-white border-surface-border shadow-eco-sm hover:shadow-eco-card hover:border-eco-400 transition-all duration-200 group active:scale-[0.98] space-y-3">
                  {/* Top Header */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${prog.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-eco-900 bg-eco-50 px-2 py-0.5 rounded border border-eco-200 truncate">
                          {prog.urgency}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate">
                          {prog.category}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-text-primary leading-snug group-hover:text-eco-800 transition-colors truncate">
                        {prog.title}
                      </h3>
                    </div>
                  </div>

                  {/* Rewards Breakdown Grid (Equal 2-Column without awkward wrapping) */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-subtle p-2.5 rounded-2xl border border-surface-border/70">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-black text-blue-800 block truncate leading-tight">
                          +{prog.comservHours} Jam Comserv
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium truncate">TFI Track</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 min-w-0 border-l border-slate-200/80 pl-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Coins className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-black text-amber-800 block truncate leading-tight">
                          +{prog.coins} Green Coins
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium truncate">BEKEN Track</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Tag & CTA */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[10px] truncate max-w-[170px]">
                      {prog.tag} • {prog.co2}
                    </span>
                    <span className="font-black text-eco-800 flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform shrink-0">
                      Lapor Aksi →
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
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Handshake className="w-4 h-4 text-cyan-600" />
                Kolaborasi Mitra SDG 17
              </h2>
              <p className="text-[11px] text-text-secondary mt-0.5">Kerjasama strategis BINUS & lembaga lingkungan resmi</p>
            </div>
            <span className="text-[10px] font-black text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 shrink-0">
              {partners.length} Mitra Aktif
            </span>
          </div>

          <div className="space-y-2.5">
            {partners.slice(0, 4).map((partner) => (
              <Card key={partner.id} className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={partner.logoUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80'}
                    alt={partner.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{partner.name}</h4>
                      <span className="text-[9px] font-black uppercase text-cyan-800 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200 shrink-0">
                        {partner.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{partner.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                    {partner.programs.length} Program Bersama
                  </span>
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eco-700 hover:text-eco-900 font-black flex items-center gap-1 text-[11px] transition-colors"
                    >
                      Kunjungi Situs <ExternalLink className="w-3 h-3" />
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
