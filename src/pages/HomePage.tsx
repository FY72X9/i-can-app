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
  Bus, 
  Trash2, 
  Zap, 
  ChevronRight, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const satTarget = 120;
  const currentSat = user?.totalSatPoints || 45;
  const satPercentage = Math.min(Math.round((currentSat / satTarget) * 100), 100);

  const quickActions = [
    { name: 'Pakai Tumbler', icon: CupSoda, category: 'tumbler', co2: '0.05 kg', reward: '+10 GC' },
    { name: 'Bus Kampus', icon: Bus, category: 'bus', co2: '0.12 kg', reward: '+15 GC' },
    { name: 'Pilah Sampah', icon: Trash2, category: 'trash', co2: '0.08 kg', reward: '+10 GC' },
    { name: 'Hemat Listrik', icon: Zap, category: 'energy', co2: '0.30 kg', reward: '+20 GC' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Main Balance & Carbon Card (Hero Gradient Card) */}
      <Card variant="eco" className="relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none">
          <Leaf className="w-28 h-28 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-eco-100/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Dompet Hijau Kampus
            </span>
            <span className="text-[11px] font-bold bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              BINUS Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Green Coins Balance */}
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5 text-gold-400 text-xs font-bold mb-1">
                <Coins className="w-4 h-4 fill-gold-400" />
                <span>Green Coin</span>
              </div>
              <p className="text-2xl font-extrabold tracking-tight">
                {user?.totalGreenCoins || 450} <span className="text-xs font-normal text-eco-100">GC</span>
              </p>
            </div>

            {/* Carbon Saved Impact */}
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5 text-eco-200 text-xs font-bold mb-1">
                <Leaf className="w-4 h-4" />
                <span>CO2 Terhemat</span>
              </div>
              <p className="text-2xl font-extrabold tracking-tight">
                {user?.totalCarbonSaved || 12.5} <span className="text-xs font-normal text-eco-100">kg</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-eco-100 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              Streak: <b className="text-white font-bold">{user?.streakDays || 5} Hari Aktif</b>
            </p>
            <Button
              size="sm"
              variant="gold"
              onClick={() => navigate('/wallet')}
              className="text-xs py-1.5 px-3 h-auto"
            >
              Convert ke SAT →
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. SAT Graduation Progress Bar */}
      <Card className="bg-white border border-surface-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Progress SAT Point</h3>
              <p className="text-[11px] text-text-secondary">Syarat Kelulusan Mahasiswa BINUS</p>
            </div>
          </div>
          <Badge variant="pending" size="sm" className="font-bold">
            {currentSat} / {satTarget} SAT
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="bg-gradient-to-r from-eco-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${satPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-text-secondary">
            <span>Terkumpul: <b>{satPercentage}%</b></span>
            <span>Sisa butuh: <b>{Math.max(satTarget - currentSat, 0)} SAT</b></span>
          </div>
        </div>
      </Card>

      {/* 3. Quick Action Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-sm font-bold text-text-primary">Unggah Aksi Cepat</h2>
          <span className="text-xs text-eco-600 font-semibold cursor-pointer" onClick={() => navigate('/upload')}>
            Lihat Semua
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => navigate('/upload', { state: { category: action.category } })}
                className="bg-white p-3.5 rounded-2xl border border-surface-border/80 shadow-eco-soft hover:border-eco-500 hover:shadow-eco-card transition-all text-left group flex flex-col justify-between active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-eco-50 group-hover:bg-eco-600 text-eco-700 group-hover:text-white transition-colors flex items-center justify-center mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary leading-snug group-hover:text-eco-700">
                    {action.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1.5 text-[10px]">
                    <span className="text-text-muted">{action.co2}</span>
                    <span className="font-bold text-gold-600">{action.reward}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Campus Challenge Banner */}
      <Card variant="subtle" className="border-eco-200/60 bg-gradient-to-r from-eco-50 to-emerald-50/60">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge variant="eco" size="sm" className="mb-1.5 font-bold">
              🔥 Challenge Pekan Ini
            </Badge>
            <h3 className="text-sm font-bold text-text-primary">No Plastic Week BINUS</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Bawa tumbler & hindari plastik 5 hari berturut-turut untuk bonus +100 GC!
            </p>
            
            <div className="flex items-center gap-3 mt-3">
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/upload')}
                className="text-xs py-1 px-3.5"
              >
                Ikuti Challenge
              </Button>
              <span className="text-[11px] text-text-secondary font-medium">
                Berakhir dlm <b>2 hari</b>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 5. Leaderboard Snapshot */}
      <Card className="bg-white border border-surface-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Peringkat Fakultas</h3>
              <p className="text-[11px] text-text-secondary">Total Reduksi Karbon Kampus</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/feed')}
            className="text-xs text-eco-600 font-bold flex items-center gap-0.5 hover:underline"
          >
            Feed <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 font-extrabold text-amber-700">🥇 1</span>
              <span className="font-bold text-text-primary">School of Computer Science</span>
            </div>
            <span className="font-extrabold text-eco-700">42.5 kg</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 font-bold text-slate-500">🥈 2</span>
              <span className="font-medium text-text-primary">School of Information Systems</span>
            </div>
            <span className="font-bold text-eco-700">38.2 kg</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
