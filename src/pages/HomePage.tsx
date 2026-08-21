import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { 
  Coins, 
  Leaf, 
  GraduationCap, 
  Flame, 
  CupSoda, 
  TreePine,
  Droplets,
  Video,
  ChevronRight, 
  Sparkles,
  TrendingUp,
  Trophy,
  ShieldCheck,
  ArrowUpRight,
  Target,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const satTarget = 120;
  const currentSat = user?.totalSatPoints || 9;
  const satPercentage = Math.min(Math.round((currentSat / satTarget) * 100), 100);

  const quickActions = [
    { 
      name: 'Tanam Pohon', 
      icon: TreePine, 
      category: 'tree', 
      co2: '5.0 kg', 
      reward: '+25 GC', 
      sat: '+4 SAT', 
      comserv: '2.0 Jam',
      sdg: 'SDG 15 & 13',
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    { 
      name: 'Lubang Biopori', 
      icon: Droplets, 
      category: 'biopori', 
      co2: '0.5 kg', 
      reward: '+20 GC', 
      sat: '+4 SAT', 
      comserv: '2.0 Jam',
      sdg: 'SDG 15 & 6',
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-700',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    { 
      name: 'Video Edukasi VBL', 
      icon: Video, 
      category: 'vbl', 
      co2: '0.1 kg', 
      reward: '+25 GC', 
      sat: '+3 SAT', 
      comserv: '1.5 Jam',
      sdg: 'SDG 4',
      color: 'from-purple-500/20 to-purple-600/10 text-purple-700',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { 
      name: 'Tumbler & Wadah', 
      icon: CupSoda, 
      category: 'tumbler', 
      co2: '0.05 kg', 
      reward: '+10 GC', 
      sat: 'Mandiri', 
      comserv: '-',
      sdg: 'SDG 12',
      color: 'from-amber-500/20 to-amber-600/10 text-amber-700',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Main Bento Hero Card (Dual Track: Academic SAT & BEKEN Gamification) */}
      <Card variant="eco" className="relative overflow-hidden p-5 shadow-eco-float">
        {/* Background ambient decorative shapes */}
        <div className="absolute -right-6 -top-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-2 bottom-1 opacity-15 pointer-events-none">
          <Leaf className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header Tag */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-eco-100/90 flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              BINUS Eco-System 2026
            </span>
            <span className="text-[10px] font-black bg-gradient-to-r from-gold-500 to-amber-500 text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
              BEKEN Award Track
            </span>
          </div>

          {/* Dual Balance Bento Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Green Coins Balance */}
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between text-gold-300 text-xs font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4 fill-gold-400 text-gold-400" />
                  Green Coins
                </span>
                <span className="text-[9px] bg-white/15 text-white px-1.5 py-0.2 rounded">Tier 1</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {user?.totalGreenCoins || 120} <span className="text-xs font-semibold text-gold-300">GC</span>
              </p>
              <p className="text-[10px] text-eco-100/80 mt-0.5">Top 15% Mahasiswa Aktif</p>
            </div>

            {/* Carbon Impact Avoided */}
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between text-eco-200 text-xs font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Leaf className="w-4 h-4" />
                  CO2e Terhemat
                </span>
                <span className="text-[9px] bg-emerald-400/20 text-emerald-200 px-1.5 py-0.2 rounded">Real-time</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {user?.totalCarbonSaved || 12.5} <span className="text-xs font-semibold text-eco-100">kg</span>
              </p>
              <p className="text-[10px] text-eco-100/80 mt-0.5">Setara ~0.8 Pohon Tumbuh</p>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/15">
            <div className="flex items-center gap-1.5 text-xs text-eco-100 font-medium">
              <Flame className="w-4 h-4 text-gold-400 fill-gold-400 animate-pulse" />
              <span>Streak: <strong className="text-white font-extrabold">{user?.streakDays || 5} Hari</strong></span>
            </div>
            <button
              onClick={() => navigate('/wallet')}
              className="text-xs font-extrabold bg-white text-eco-800 hover:bg-eco-50 px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1"
            >
              Portofolio SAT <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* 2. SAT Progress Tracker (Academic Transcript Track) */}
      <Card className="bg-white border border-surface-border shadow-eco-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200/60 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-text-primary">Transkrip Aktivitas Semester (SAT)</h3>
              <p className="text-[10px] text-text-secondary">Poin Riil Terverifikasi SSO & TFI</p>
            </div>
          </div>
          <Badge variant="blue" size="md">
            {currentSat} / {satTarget} SAT
          </Badge>
        </div>

        {/* Progress Bar with Indicator */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className="bg-gradient-to-r from-eco-500 via-teal-500 to-blue-600 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(satPercentage, 8)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-text-secondary font-medium px-0.5">
            <span>Tercapai: <strong className="text-blue-700 font-bold">{satPercentage}%</strong></span>
            <span>Target Lulus: <strong className="text-text-primary font-bold">120 SAT</strong></span>
          </div>
        </div>

        <div className="bg-surface-subtle p-2.5 rounded-xl border border-surface-border/60 flex items-center justify-between text-[11px]">
          <span className="text-text-secondary flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-eco-600" />
            Terhubung langsung ke portal myBINUS
          </span>
          <span className="text-eco-800 font-bold cursor-pointer hover:underline" onClick={() => navigate('/wallet')}>
            Detail →
          </span>
        </div>
      </Card>

      {/* 3. Quick Reporting Action Hub (TFI & Campus Programs) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs font-extrabold text-text-primary uppercase tracking-wider">
              Pelaporan Aksi & Program TFI
            </h2>
            <p className="text-[10px] text-text-muted">Pilih jenis kegiatan untuk klaim poin SAT & GC</p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="text-xs text-eco-700 font-bold hover:text-eco-800 flex items-center gap-0.5"
          >
            Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => navigate('/upload')}
                className="bg-white p-3.5 rounded-2xl border border-surface-border hover:border-eco-500 hover:shadow-eco-card transition-all text-left group flex flex-col justify-between active:scale-[0.98] shadow-eco-sm"
              >
                <div className="flex items-start justify-between w-full mb-2">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${action.color} group-hover:scale-105 transition-transform flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${action.badgeColor}`}>
                    {action.sdg}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-text-primary leading-tight group-hover:text-eco-700">
                    {action.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                    <span className="font-extrabold text-blue-700">{action.sat}</span>
                    <span className="font-extrabold text-amber-800">{action.reward}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Campus Challenge & BEKEN Award Banner */}
      <Card variant="subtle" className="border-eco-200/80 bg-gradient-to-r from-eco-50 via-emerald-50/70 to-teal-50/50 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="eco" size="sm" className="font-bold">
              🔥 Gerakan Hijau Kampus 2026
            </Badge>
            <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Sisa 14 Hari
            </span>
          </div>

          <h3 className="text-xs font-extrabold text-text-primary leading-snug">
            Program Penanaman Pohon & Pembuatan Biopori TFI
          </h3>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Laporkan aksi nyata penanaman pohon atau pembuatan lubang biopori bersama warga untuk klaim +4 SAT & raih nominasi BEKEN Award!
          </p>
          
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/upload')}
              className="text-xs py-1.5 px-3.5 font-bold"
            >
              Laporkan Sekarang →
            </Button>
            <span className="text-[10px] text-text-secondary font-medium">
              Verifikasi 1x24 Jam
            </span>
          </div>
        </div>
      </Card>

      {/* 5. Campus Aggregate SDG Impact Counter */}
      <Card className="bg-white border border-surface-border shadow-eco-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-text-primary">Dampak Agregat Kampus BINUS</h3>
              <p className="text-[10px] text-text-secondary">Kontribusi Seluruh Mahasiswa Terhadap SDG</p>
            </div>
          </div>
          <Badge variant="success" size="sm">
            Live SDG Metrix
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-bold block mb-0.5">Pohon Ditanam</span>
            <span className="text-base font-black text-emerald-900">1,420</span>
            <span className="text-[9px] text-emerald-700 block mt-0.5">SDG 15 & 13</span>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-100">
            <span className="text-[10px] text-cyan-800 font-bold block mb-0.5">Biopori Dibuat</span>
            <span className="text-base font-black text-cyan-900">890</span>
            <span className="text-[9px] text-cyan-700 block mt-0.5">SDG 6 & 15</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
            <span className="text-[10px] text-purple-800 font-bold block mb-0.5">Video VBL</span>
            <span className="text-base font-black text-purple-900">325</span>
            <span className="text-[9px] text-purple-700 block mt-0.5">SDG 4 Quality</span>
          </div>
        </div>
      </Card>

      {/* 6. Green Leaderboard Snapshot (BEKEN Award Track) */}
      <Card className="bg-white border border-surface-border shadow-eco-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-text-primary">Klasemen BEKEN Award 2026</h3>
              <p className="text-[10px] text-text-secondary">Peringkat Tahunan Fakultas Berkelanjutan</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/feed')}
            className="text-xs text-eco-700 font-bold flex items-center gap-0.5 hover:underline"
          >
            Feed <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-black text-amber-800">🥇 1</span>
              <div>
                <span className="font-bold text-text-primary block leading-tight">School of Computer Science</span>
                <span className="text-[10px] text-text-muted">450 Mahasiswa Aktif</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-eco-800 block leading-tight">1,240 GC</span>
              <span className="text-[10px] text-eco-700">42.5 kg CO2e</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-bold text-slate-500">🥈 2</span>
              <div>
                <span className="font-bold text-text-primary block leading-tight">School of Information Systems</span>
                <span className="text-[10px] text-text-muted">380 Mahasiswa Aktif</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-eco-800 block leading-tight">980 GC</span>
              <span className="text-[10px] text-eco-700">38.2 kg CO2e</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-5 text-center font-bold text-slate-500">🥉 3</span>
              <div>
                <span className="font-bold text-text-primary block leading-tight">School of Design (SOD)</span>
                <span className="text-[10px] text-text-muted">290 Mahasiswa Aktif</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-eco-800 block leading-tight">850 GC</span>
              <span className="text-[10px] text-eco-700">31.0 kg CO2e</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

