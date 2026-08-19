import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';
import { 
  Award, 
  Flame, 
  ShieldCheck, 
  Trophy 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, loginAs } = useAuthStore();

  const badges = [
    { name: 'First Step Green', icon: Award, desc: 'Aksi pertama diunggah', unlocked: true },
    { name: 'Streak Master', icon: Flame, desc: '5 hari aktif berturut-turut', unlocked: true },
    { name: 'Carbon Hero', icon: ShieldCheck, desc: 'Hemat 10 kg CO2e', unlocked: true },
    { name: 'SAT Champion', icon: Trophy, desc: 'Kumpulkan 50 SAT Points', unlocked: false },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Student Identity Card */}
      <Card className="p-5 bg-white space-y-4 text-center">
        <div className="relative inline-block mx-auto">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-eco-500/20 mx-auto shadow-md"
          />
          <span className="absolute bottom-0 right-0 bg-eco-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white">
            {user?.role || 'STUDENT'}
          </span>
        </div>

        <div>
          <h2 className="text-base font-bold text-text-primary">{user?.fullName || 'Budi Santoso'}</h2>
          <p className="text-xs text-text-secondary mt-0.5">NIM: {user?.nim || '2602158890'}</p>
          <p className="text-xs text-eco-700 font-semibold mt-0.5">{user?.facultyName || 'School of Computer Science'}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border/60">
          <div className="bg-surface-subtle p-2.5 rounded-xl">
            <span className="text-[10px] text-text-secondary uppercase font-bold">CO2 Hemat</span>
            <p className="text-sm font-extrabold text-eco-700">{user?.totalCarbonSaved || 12.5} kg</p>
          </div>

          <div className="bg-surface-subtle p-2.5 rounded-xl">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Green Coin</span>
            <p className="text-sm font-extrabold text-gold-600">{user?.totalGreenCoins || 450} GC</p>
          </div>

          <div className="bg-surface-subtle p-2.5 rounded-xl">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Total SAT</span>
            <p className="text-sm font-extrabold text-blue-600">{user?.totalSatPoints || 45} SAT</p>
          </div>
        </div>
      </Card>

      {/* 2. Badge Collection Grid */}
      <Card className="p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Koleksi Badge Prestasi</h3>
          <span className="text-[11px] text-eco-600 font-bold">3 / 4 Unlocked</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                  badge.unlocked
                    ? 'bg-amber-50/50 border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200/60 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${
                    badge.unlocked ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-text-primary leading-tight">{badge.name}</h4>
                <p className="text-[10px] text-text-secondary leading-tight">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Eco-Volunteer Application Card */}
      <Card variant="subtle" className="p-4 border-eco-200 bg-gradient-to-r from-eco-50 to-emerald-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-eco-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-text-primary">Gabung Jadi Eco-Volunteer</h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Dapatkan sertifikat Teach For Indonesia (TFI) dan jam pengabdian masyarakat (Comserv Hours).
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => loginAs('verifier')}
              className="mt-2.5 text-xs py-1 px-3"
            >
              Uji Coba Portal Verifikator →
            </Button>
          </div>
        </div>
      </Card>

      {/* 4. Switch Account for Demo / Logout */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs text-text-secondary"
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
