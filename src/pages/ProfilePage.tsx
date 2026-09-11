import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { useAppModeStore } from '@/stores/appModeStore';
import { getActions } from '@/services/actionService';
import { GreenAction } from '@/types';
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
  Zap,
  LogOut,
  UserCheck,
  Clock,
  Calendar,
  CheckCheck,
  ChevronRight,
  History,
  AlertCircle,
  Globe2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginAs, logout } = useAuthStore();
  const { isDemoMode, isPrototypeMode } = useAppModeStore();
  const [userActivities, setUserActivities] = useState<GreenAction[]>([]);
  const [loading, setLoading] = useState(true);

  const canAccessAdmin = isDemoMode() || user?.role === 'SUPERADMIN';

  useEffect(() => {
    async function loadActivities() {
      setLoading(true);
      const allActions = await getActions();
      if (user?.role === 'ORGANIZER') {
        // If verifier, show actions verified by verifier or all actions
        const verified = allActions.filter((a) => a.verifiedBy?.includes(user.fullName.split(' ')[0]) || a.status === 'APPROVED');
        setUserActivities(verified);
      } else {
        // Filter by user ID or match user name
        const userSpecific = allActions.filter((a) => a.userId === user?.id || (user?.fullName && a.userName && a.userName.includes(user.fullName.split(' ')[0])));
        setUserActivities(userSpecific.length > 0 ? userSpecific : allActions.slice(0, 8));
      }
      setLoading(false);
    }
    loadActivities();
  }, [user?.id, user?.role, user?.fullName]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const badges = [
    { name: 'First Step Green', icon: Award, desc: 'Aksi pertama diunggah ke I-CAN', unlocked: true, level: 'Bronze', rarity: 'Common' },
    { name: 'Streak Champion', icon: Flame, desc: '5 hari aktif berturut-turut', unlocked: true, level: 'Gold', rarity: 'Rare' },
    { name: 'Carbon Hero', icon: Leaf, desc: 'Hemat akumulasi 10 kg CO2e', unlocked: true, level: 'Silver', rarity: 'Rare' },
    { name: 'TFI Tree Planter', icon: ShieldCheck, desc: 'Tanam 5 bibit pohon berbatang keras', unlocked: true, level: 'Gold', rarity: 'Epic' },
    { name: 'SAT Master', icon: Trophy, desc: 'Kumpulkan 50 SAT Points riil', unlocked: false, level: 'Platinum', rarity: 'Epic' },
    { name: 'BEKEN Finalist', icon: Sparkles, desc: 'Masuk Top 10% Leaderboard tahunan', unlocked: false, level: 'Diamond', rarity: 'Legendary' },
  ];

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Student Identity Card */}
      <Card className="p-6 sm:p-7 bg-white space-y-5 text-center border-surface-border shadow-eco-card relative overflow-hidden">
        {/* Background decorative halo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-60 bg-eco-neon/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative inline-block mx-auto z-10">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName}
            className="w-22 h-22 rounded-3xl object-cover ring-4 ring-eco-neon/60 mx-auto shadow-neon-glow"
          />
          <span className="absolute -bottom-1 -right-1 bg-eco-700 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full ring-2 ring-white shadow-xs">
            {user?.role || 'STUDENT'}
          </span>
        </div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-eco-neon/20 text-eco-900 border border-eco-neon/40 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-1">
            <Zap className="w-3 h-3 fill-eco-900" />
            Lv. 3 Eco-Ksatria
          </div>
          <h2 className="text-lg sm:text-xl font-black text-text-primary">{user?.fullName || 'Budi Santoso'}</h2>
          <p className="text-xs sm:text-sm text-text-secondary font-mono">NIM: {user?.nim || '2602158890'}</p>
          <p className="text-xs sm:text-sm text-eco-800 font-black mt-0.5">{user?.facultyName || 'School of Computer Science'}</p>
        </div>

        {/* Stats Row Bento */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-surface-border/60 relative z-10">
          <div className="bg-surface-subtle p-3.5 rounded-2xl border border-surface-border/60">
            <span className="text-[10px] text-text-secondary uppercase font-bold block mb-1">CO2e Hemat</span>
            <p className="text-base sm:text-lg font-black text-eco-800 font-mono">{user?.totalCarbonSaved || 12.5} kg</p>
          </div>

          <div className="bg-surface-subtle p-3.5 rounded-2xl border border-surface-border/60">
            <span className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Green Coins</span>
            <p className="text-base sm:text-lg font-black text-amber-800 font-mono">{user?.totalGreenCoins || 120} GC</p>
          </div>

          <div className="bg-surface-subtle p-3.5 rounded-2xl border border-surface-border/60">
            <span className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Total SAT</span>
            <p className="text-base sm:text-lg font-black text-blue-700 font-mono">{user?.totalSatPoints || 9} SAT</p>
          </div>
        </div>
      </Card>

      {/* 2. Badge Collection Grid with Rarity */}
      <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider">Koleksi Rarity Badge</h3>
            <p className="text-xs text-text-secondary mt-0.5">Pencapaian Aksi Berkelanjutan Kampus</p>
          </div>
          <Badge variant="success" size="sm">
            4 / 6 Terbuka
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className={`p-3.5 sm:p-4 rounded-2xl border text-center space-y-2 transition-all relative overflow-hidden ${
                  badge.unlocked
                    ? 'bg-amber-50/50 border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-gold-glow'
                    : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                {!badge.unlocked && (
                  <div className="absolute top-2.5 right-2.5 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}

                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                  badge.rarity === 'Legendary' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                  badge.rarity === 'Epic' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  badge.rarity === 'Rare' ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {badge.rarity}
                </span>

                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto shadow-xs ${
                    badge.unlocked 
                      ? 'bg-gradient-to-tr from-amber-200 to-amber-100 text-amber-800 ring-2 ring-amber-300/60 shadow-xs' 
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-text-primary leading-snug">{badge.name}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Riwayat 2 Minggu Aktivitas Terkini (Recent Activity Timeline) */}
      <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-eco-neon/20 text-eco-900 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider">
                {user?.role === 'ORGANIZER' ? 'Log Riwayat Verifikasi Terkini' : 'Riwayat Aksi 2 Minggu Terakhir'}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {userActivities.length} Kegiatan Terdata di Sistem
              </p>
            </div>
          </div>
          <Link
            to={user?.role === 'ORGANIZER' ? '/verify' : '/wallet'}
            className="text-xs font-black text-eco-800 hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {userActivities.map((act) => {
            const isApprovedFull = act.decision === 'APPROVED_FULL';
            const isCoinsOnly = act.decision === 'APPROVED_COINS_ONLY';
            const isPending = act.status === 'PENDING';
            const isRejected = act.status === 'REJECTED';

            return (
              <div
                key={act.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-surface-subtle border border-surface-border/60 hover:border-eco-300 transition-all flex items-start gap-3.5"
              >
                {act.photoUrl ? (
                  <img
                    src={act.photoUrl}
                    alt={act.categoryName}
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-surface-border shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-eco-neon/20 text-eco-900 flex items-center justify-center shrink-0 mt-0.5 font-black text-sm">
                    🌱
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">
                      {act.categoryName}
                    </h4>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                      isApprovedFull ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      isCoinsOnly ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      isPending ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {isApprovedFull ? '+SAT & Coins' :
                       isCoinsOnly ? 'Coins Only' :
                       isPending ? 'Pending' : 'Ditolak'}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 italic leading-relaxed">
                    "{act.story}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-text-muted pt-1 font-mono border-t border-slate-100/70">
                    <span className="flex items-center gap-1 text-eco-800 font-bold">
                      <Clock className="w-3 h-3" />
                      {new Date(act.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="font-bold text-slate-700">
                      {act.carbonImpactKg > 0 ? `-${act.carbonImpactKg} kg CO2e` : 'Survey Validated'}
                    </span>
                    <span className="font-black text-amber-800">
                      +{act.greenCoinsEarned} GC
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Eco-Volunteer Application Card */}
      <Card variant="subtle" className="p-5 sm:p-6 border-eco-200/80 bg-gradient-to-r from-eco-50 via-emerald-50/70 to-teal-50/50 shadow-xs space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-eco-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-black text-text-primary">Gabung Jadi Eco-Volunteer Kampus</h4>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Dapatkan sertifikat resmi Teach For Indonesia (TFI) dan klaim jam pengabdian masyarakat.
            </p>
            {canAccessAdmin ? (
              <Button
                size="sm"
                variant="primary"
                onClick={() => loginAs('verifier')}
                className="mt-3 text-xs py-2 px-3.5 font-bold"
              >
                Uji Coba Portal Verifikator →
              </Button>
            ) : (
              <p className="mt-3 text-xs font-medium text-eco-800">
                Pendaftaran volunteer dibuka tiap awal semester melalui Teach For Indonesia (TFI).
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 4. Switch Account & Logout Action Buttons */}
      <div className="pt-2">
        <Button
          variant="danger"
          size="sm"
          className="w-full text-xs sm:text-sm font-bold py-3.5 flex items-center justify-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-2xl"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun (Logout)
        </Button>
      </div>
    </div>
  );
};
