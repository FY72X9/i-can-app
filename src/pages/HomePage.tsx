import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { getActiveEvents } from '@/services/eventService';
import { CampusEvent, DailyQuest, ActionProgram } from '@/types';
import { getDailyQuests, getActionPrograms } from '@/services/questProgramService';
import { 
  TreePine, 
  Droplets, 
  Video, 
  CupSoda, 
  Sparkles, 
  Flame, 
  Coins, 
  GraduationCap, 
  Award, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Target, 
  Heart,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Calendar,
  Trash2,
  Leaf
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
  const { user } = useAuthStore();
  const [activeEvents, setActiveEvents] = useState<CampusEvent[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [actionPrograms, setActionPrograms] = useState<ActionProgram[]>([]);

  useEffect(() => {
    getActiveEvents().then(setActiveEvents);
  }, []);

  useEffect(() => {
    getDailyQuests().then((quests) => {
      setDailyQuests(quests.filter((q) => q.isActive));
    });
    getActionPrograms().then((progs) => {
      setActionPrograms(progs.filter((p) => p.isActive));
    });
  }, []);

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Gen Z Eco-Flex Hero Card with Clean Bento */}
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
              <span>{user?.streakDays || 5} Hari Streak</span>
            </div>
          </div>

          {/* Dual Balance Numbers Bento */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Green Coins (BEKEN Track) */}
            <div className="bg-black/25 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black tracking-wider text-eco-200">
                  Green Coins
                </span>
                <Coins className="w-4 h-4 text-gold-neon fill-gold-neon" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {user?.totalGreenCoins || 120} <span className="text-xs font-semibold text-gold-300">GC</span>
              </div>
              <span className="text-xs text-gold-neon font-black mt-1.5 inline-block">
                ⚡ Top 15% Nominee
              </span>
            </div>

            {/* SAT Academic Points Track */}
            <div className="bg-black/25 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black tracking-wider text-eco-200">
                  Poin SAT Riil
                </span>
                <GraduationCap className="w-4 h-4 text-eco-neon" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {user?.totalSatPoints || 9} <span className="text-xs font-semibold text-eco-200">/ 120 SAT</span>
              </div>
              <span className="text-xs text-eco-neon font-black mt-1.5 inline-block">
                🎓 Target Kelulusan
              </span>
            </div>
          </div>

          {/* SAT Progress Bar to Graduation */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2.5">
            <div className="flex justify-between text-xs sm:text-sm text-eco-100 font-black">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-eco-neon" />
                Target 120 Poin SAT Kelulusan
              </span>
              <span className="font-mono text-eco-neon font-bold">
                {Math.round(((user?.totalSatPoints || 9) / 120) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-eco-neon via-emerald-400 to-cyan-300 h-full rounded-full transition-all duration-500 shadow-neon-glow"
                style={{ width: `${Math.min(100, ((user?.totalSatPoints || 9) / 120) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Event Kampus Aktif Carousel */}
      {activeEvents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-eco-neon" />
              Event Kampus Aktif
            </h3>
            <Link to="/events" className="text-xs font-bold text-eco-700 hover:underline flex items-center gap-0.5">
              Lihat Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            {activeEvents.slice(0, 5).map((evt) => (
              <Link
                key={evt.id}
                to={`/events/${evt.id}`}
                className="shrink-0 w-64 bg-white rounded-2xl border border-surface-border shadow-eco-soft overflow-hidden hover:shadow-eco-card transition-all active:scale-[0.97] group"
              >
                {evt.bannerUrl && (
                  <div className="h-28 overflow-hidden">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-text-primary truncate group-hover:text-eco-700 transition-colors">
                    {evt.title}
                  </h4>
                  <p className="text-[10px] text-text-muted truncate">{evt.organizerName}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-eco-700 font-bold">
                    <Calendar className="w-3 h-3" />
                    <span>{evt.activities.length} Pos Aktivitas</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. Quick Guide & SDG Banners */}
      <div className="grid grid-cols-1 gap-3">
        <Link
          to="/sdg-guideline"
          className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group block"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-emerald-950 group-hover:text-emerald-800 transition-colors truncate">
                Panduan Target SDG BINUS
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed mt-0.5 truncate">
                8 Target prioritas & formula kuantifikasi emisi IPCC.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0 group-hover:translate-x-1 transition-transform ml-2" />
        </Link>

        <Link
          to="/guide"
          className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group block"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-blue-950 group-hover:text-blue-800 transition-colors truncate">
                Pusat Panduan & FAQ TFI
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed mt-0.5 truncate">
                Regulasi resmi SSO, foto pohon & format sitasi video VBL.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-700 shrink-0 group-hover:translate-x-1 transition-transform ml-2" />
        </Link>
      </div>

      {/* 3. ⚡ Daily Quests Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Daily Quests (Misi Kampus)
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
                  <Link to={quest.actionUrl || '/upload'} className="text-eco-800 hover:underline flex items-center gap-0.5 font-bold">
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

      {/* 4. TFI Action Hub Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <TreePine className="w-4 h-4 text-eco-700" />
              Pilihan Program Aksi Nyata
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">Pilih program, unggah bukti fisik & klaim SAT resmi</p>
          </div>
          {actionPrograms.length > 0 && (
            <Link to="/upload" className="text-xs font-black text-eco-800 hover:text-eco-950 flex items-center gap-0.5">
              Unggah <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {actionPrograms.map((prog) => {
            const Icon = resolveProgramIcon(prog.icon);
            return (
              <Link key={prog.id} to={`/upload?programId=${prog.id}`} className="block">
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
                    <span className="text-blue-700">+{prog.satPoints} SAT ({prog.comservHours} Jam Comserv)</span>
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
    </div>
  );
};
