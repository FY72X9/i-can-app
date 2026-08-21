import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { 
  Award, 
  Flame, 
  ShieldCheck, 
  Trophy,
  Leaf,
  Coins,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, loginAs } = useAuthStore();

  const badges = [
    { name: 'First Step Green', icon: Award, desc: 'Aksi pertama diunggah ke I-CAN', unlocked: true, level: 'Bronze', rarity: 'Common' },
    { name: 'Streak Champion', icon: Flame, desc: '5 hari aktif berturut-turut', unlocked: true, level: 'Gold', rarity: 'Rare' },
    { name: 'Carbon Hero', icon: Leaf, desc: 'Hemat akumulasi 10 kg CO2e', unlocked: true, level: 'Silver', rarity: 'Rare' },
    { name: 'TFI Tree Planter', icon: ShieldCheck, desc: 'Tanam 5 bibit pohon berbatang keras', unlocked: true, level: 'Gold', rarity: 'Epic' },
    { name: 'SAT Master', icon: Trophy, desc: 'Kumpulkan 50 SAT Points riil', unlocked: false, level: 'Platinum', rarity: 'Epic' },
    { name: 'BEKEN Finalist', icon: Sparkles, desc: 'Masuk Top 10% Leaderboard tahunan', unlocked: false, level: 'Diamond', rarity: 'Legendary' },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Student Identity Card */}
      <Card className="p-5 bg-white space-y-4 text-center border-surface-border shadow-eco-card relative overflow-hidden">
        {/* Background decorative halo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-52 h-52 bg-eco-neon/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative inline-block mx-auto z-10">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-eco-neon/60 mx-auto shadow-neon-glow"
          />
          <span className="absolute -bottom-1 -right-1 bg-eco-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-white shadow-xs">
            {user?.role || 'STUDENT'}
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 bg-eco-neon/20 text-eco-900 border border-eco-neon/40 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
            <Zap className="w-2.5 h-2.5 fill-eco-900" />
            Lv. 3 Eco-Ksatria
          </div>
          <h2 className="text-base font-black text-text-primary">{user?.fullName || 'Budi Santoso'}</h2>
          <p className="text-xs text-text-secondary mt-0.5 font-mono">NIM: {user?.nim || '2602158890'}</p>
          <p className="text-xs text-eco-800 font-black mt-0.5">{user?.facultyName || 'School of Computer Science'}</p>
        </div>

        {/* Stats Row Bento */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border/60 relative z-10">
          <div className="bg-surface-subtle p-2.5 rounded-2xl border border-surface-border/50">
            <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">CO2e Hemat</span>
            <p className="text-sm font-black text-eco-800 font-mono">{user?.totalCarbonSaved || 12.5} kg</p>
          </div>

          <div className="bg-surface-subtle p-2.5 rounded-2xl border border-surface-border/50">
            <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Green Coins</span>
            <p className="text-sm font-black text-amber-800 font-mono">{user?.totalGreenCoins || 120} GC</p>
          </div>

          <div className="bg-surface-subtle p-2.5 rounded-2xl border border-surface-border/50">
            <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Total SAT</span>
            <p className="text-sm font-black text-blue-700 font-mono">{user?.totalSatPoints || 9} SAT</p>
          </div>
        </div>
      </Card>

      {/* 2. Badge Collection Grid with Rarity */}
      <Card className="p-4 bg-white space-y-3 border-surface-border shadow-eco-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-text-primary uppercase tracking-wider">Koleksi Rarity Badge</h3>
            <p className="text-[10px] text-text-secondary">Pencapaian Aksi Berkelanjutan Kampus</p>
          </div>
          <Badge variant="success" size="sm">
            4 / 6 Terbuka
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all relative overflow-hidden ${
                  badge.unlocked
                    ? 'bg-amber-50/50 border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-gold-glow'
                    : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                {!badge.unlocked && (
                  <div className="absolute top-2 right-2 text-slate-400">
                    <Lock className="w-3 h-3" />
                  </div>
                )}

                <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                  badge.rarity === 'Legendary' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                  badge.rarity === 'Epic' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  badge.rarity === 'Rare' ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {badge.rarity}
                </span>

                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto shadow-xs ${
                    badge.unlocked 
                      ? 'bg-gradient-to-tr from-amber-200 to-amber-100 text-amber-800 ring-2 ring-amber-300/60 shadow-xs' 
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-primary leading-tight">{badge.name}</h4>
                  <p className="text-[10px] text-text-secondary leading-tight mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Eco-Volunteer Application Card */}
      <Card variant="subtle" className="p-4 border-eco-200/80 bg-gradient-to-r from-eco-50 via-emerald-50/70 to-teal-50/50 shadow-xs space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-eco-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-text-primary">Gabung Jadi Eco-Volunteer Kampus</h4>
            <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
              Dapatkan sertifikat resmi Teach For Indonesia (TFI) dan klaim jam pengabdian masyarakat (Community Service Hours).
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => loginAs('verifier')}
              className="mt-2 text-xs py-1.5 px-3 font-bold"
            >
              Uji Coba Portal Verifikator →
            </Button>
          </div>
        </div>
      </Card>

      {/* 4. Switch Account for Demo / Logout */}
      <div className="pt-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs text-text-secondary font-bold"
          onClick={() => {
            if (user?.role === 'STUDENT') {
              loginAs('verifier');
            } else {
              loginAs('student');
            }
          }}
        >
          Ganti Akun Demo: Saat Ini ({user?.role})
        </Button>
      </div>
    </div>
  );
};
