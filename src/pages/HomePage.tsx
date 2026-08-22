import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
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
  ArrowRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const [cheers, setCheers] = useState<Record<string, number>>({
    socs: 148,
    sis: 112,
    sod: 95
  });
  const [hasCheered, setHasCheered] = useState<Record<string, boolean>>({});

  const handleCheer = (facultyId: string) => {
    setHasCheered((prev) => ({ ...prev, [facultyId]: !prev[facultyId] }));
    setCheers((prev) => ({
      ...prev,
      [facultyId]: prev[facultyId] + (hasCheered[facultyId] ? -1 : 1)
    }));
  };

  const programs = [
    {
      id: 'tree',
      title: 'Penanaman Pohon Keras',
      category: 'Penyuluhan & Aksi Nyata',
      satPoints: 4,
      comservHours: 2.0,
      coins: 25,
      co2: '5.0 kg',
      icon: TreePine,
      color: 'from-emerald-500 to-eco-700',
      tag: 'SDG 15 Life on Land',
      urgency: 'Hot Program 🔥',
    },
    {
      id: 'biopori',
      title: 'Pembuatan Lubang Biopori',
      category: 'Penyuluhan & Aksi Nyata',
      satPoints: 4,
      comservHours: 2.0,
      coins: 20,
      co2: '0.5 kg',
      icon: Droplets,
      color: 'from-cyan-500 to-blue-700',
      tag: 'SDG 6 Clean Water',
      urgency: 'Musim Hujan 💧',
    },
    {
      id: 'vbl',
      title: 'Video Based Learning (VBL)',
      category: 'Edukasi Digital 5-10 Min',
      satPoints: 3,
      comservHours: 1.5,
      coins: 25,
      co2: '0.1 kg',
      icon: Video,
      color: 'from-purple-500 to-indigo-700',
      tag: 'SDG 4 Quality Edu',
      urgency: 'Format APA 🎓',
    },
    {
      id: 'tumbler',
      title: 'Bawa Tumbler & Zero Waste',
      category: 'Self Green Campaign',
      satPoints: 1,
      comservHours: 0.5,
      coins: 10,
      co2: '0.05 kg',
      icon: CupSoda,
      color: 'from-amber-500 to-orange-600',
      tag: 'SDG 12 Consumption',
      urgency: 'Daily Quest ⚡',
    },
  ];

  const flashQuests = [
    {
      id: 'q1',
      title: 'Campus Tumbler Boost 🥤',
      desc: 'Isi ulang air minum di Water Station Gedung Anggrek lantai 2.',
      reward: '+15 GC & +1 SAT',
      deadline: 'Sisa 3 Jam',
      completed: true,
    },
    {
      id: 'q2',
      title: 'VBL 5-Min Sprint 🎬',
      desc: 'Unggah video edukasi singkat berjaket almamater BINUS.',
      reward: '+25 GC & +3 SAT',
      deadline: 'Sisa Hari Ini',
      completed: false,
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Gen Z Eco-Flex Hero Card with Clean Bento */}
      <Card variant="eco" className="relative overflow-hidden p-6 shadow-eco-float border-white/20">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-eco-neon/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-neon/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Pill Badges */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-eco-100 text-[11px] font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-neon" />
              <span>BEKEN Standing</span>
            </div>

            <div className="flex items-center gap-1 bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-gold-neon px-3 py-1 rounded-full text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-gold-neon animate-bounce-subtle" />
              <span>{user?.streakDays || 5} Hari Streak</span>
            </div>
          </div>

          {/* Dual Balance Numbers Bento */}
          <div className="grid grid-cols-2 gap-3">
            {/* Green Coins (BEKEN Track) */}
            <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-eco-200">
                  Green Coins
                </span>
                <Coins className="w-4 h-4 text-gold-neon fill-gold-neon" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                {user?.totalGreenCoins || 120} <span className="text-xs font-semibold text-gold-300">GC</span>
              </div>
              <span className="text-[10px] text-gold-neon font-black mt-1 inline-block">
                ⚡ Top 15% Nominee
              </span>
            </div>

            {/* SAT Academic Points Track */}
            <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left transition-all hover:bg-black/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-eco-200">
                  Poin SAT Riil
                </span>
                <GraduationCap className="w-4 h-4 text-eco-neon" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                {user?.totalSatPoints || 9} <span className="text-xs font-semibold text-eco-200">/ 120 SAT</span>
              </div>
              <span className="text-[10px] text-eco-neon font-black mt-1 inline-block">
                🎓 Target Kelulusan
              </span>
            </div>
          </div>

          {/* SAT Progress Bar to Graduation */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs text-eco-100 font-black">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-eco-neon" />
                Target 120 Poin SAT Kelulusan
              </span>
              <span className="font-mono text-eco-neon">
                {Math.round(((user?.totalSatPoints || 9) / 120) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-eco-neon via-emerald-400 to-cyan-300 h-full rounded-full transition-all duration-500 shadow-neon-glow"
                style={{ width: `${Math.min(100, ((user?.totalSatPoints || 9) / 120) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Quick Guide & FAQ Banner (Direct Access to Dedicated Page) */}
      <Link
        to="/guide"
        className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-eco-200 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-eco-sm transition-all group block"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-eco-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-text-primary group-hover:text-eco-800 transition-colors">
              Pusat Panduan & FAQ Resmi TFI
            </h4>
            <p className="text-[10px] text-text-secondary">
              Pelajari regulasi SSO, standar foto & video VBL, dan sistem Dual-Track.
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-eco-700 shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* 3. ⚡ Daily Flash Quests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Daily Flash Quests (Misi Kampus)
          </h2>
          <span className="text-[10px] font-black text-eco-800 bg-eco-neon/20 px-2 py-0.5 rounded-full border border-eco-neon/40">
            Bonus Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {flashQuests.map((quest) => (
            <Card 
              key={quest.id} 
              className={`p-4 space-y-2 border transition-all ${
                quest.completed 
                  ? 'bg-eco-50/60 border-eco-200' 
                  : 'bg-white border-surface-border hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-black text-text-primary">{quest.title}</h4>
                {quest.completed ? (
                  <span className="text-[9px] font-black text-eco-900 bg-eco-neon/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-eco-700" /> Selesai
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {quest.deadline}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">{quest.desc}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] font-black">
                <span className="text-amber-800">{quest.reward}</span>
                {!quest.completed && (
                  <Link to="/upload" className="text-eco-800 hover:underline flex items-center gap-0.5 font-bold">
                    Kerjakan →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. TFI Action Hub Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <TreePine className="w-4 h-4 text-eco-700" />
              Pilihan Program Aksi Nyata & VBL
            </h2>
            <p className="text-[10px] text-text-secondary">Pilih program, unggah bukti fisik & klaim SAT resmi</p>
          </div>
          <Link to="/upload" className="text-[11px] font-black text-eco-800 hover:text-eco-950 flex items-center gap-0.5">
            Unggah <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <Link key={prog.id} to="/upload">
                <Card className="p-4 bg-white border-surface-border shadow-eco-sm hover:shadow-eco-card hover:border-eco-400 transition-all duration-200 group active:scale-[0.98] space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${prog.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-eco-900 bg-eco-50 px-2 py-0.5 rounded border border-eco-200">
                          {prog.urgency}
                        </span>
                        <h3 className="text-xs font-black text-text-primary leading-tight mt-1 group-hover:text-eco-800 transition-colors">
                          {prog.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Rewards Breakdown Bar */}
                  <div className="bg-surface-subtle p-2.5 rounded-xl flex items-center justify-between text-[10px] font-black">
                    <span className="text-blue-700">+{prog.satPoints} SAT ({prog.comservHours} Jam)</span>
                    <span className="text-amber-800">+{prog.coins} GC</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-text-secondary pt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[9px]">
                      {prog.tag}
                    </span>
                    <span className="font-black text-eco-800 flex items-center gap-0.5">
                      Lapor Sekarang →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Campus SDG Leaderboard & Cheer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-gold-500 fill-gold-500" />
            Peringkat Fakultas & Cheer Komunitas
          </h2>
          <span className="text-[10px] font-bold text-text-muted">Live Update</span>
        </div>

        <Card className="p-4 bg-white space-y-2.5 border-surface-border shadow-eco-soft">
          <div className="space-y-2">
            {[
              { id: 'socs', rank: '🥇 1', name: 'School of Computer Science', points: '1,450 GC', sat: '420 SAT' },
              { id: 'sod', rank: '🥈 2', name: 'School of Design (SOD)', points: '1,120 GC', sat: '360 SAT' },
              { id: 'sis', rank: '🥉 3', name: 'School of Information Systems', points: '980 GC', sat: '310 SAT' },
            ].map((fac) => (
              <div
                key={fac.id}
                className="p-3 rounded-2xl bg-surface-subtle hover:bg-eco-50/60 transition-colors flex items-center justify-between border border-surface-border/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-black">{fac.rank}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-text-primary truncate">{fac.name}</h4>
                    <p className="text-[10px] text-text-muted font-mono">{fac.points} • {fac.sat}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCheer(fac.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black transition-all active:scale-95 ${
                    hasCheered[fac.id]
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                  title="Beri Cheer untuk Fakultasmu!"
                >
                  <Heart className={`w-3 h-3 ${hasCheered[fac.id] ? 'fill-white' : 'fill-rose-500'}`} />
                  <span>{cheers[fac.id]}</span>
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
