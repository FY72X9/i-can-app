import React, { useState, useRef, useEffect } from 'react';
import { Flame, Bell, ShieldCheck, User, CheckCircle2, ChevronDown, Award } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, subtitle }) => {
  const { user, loginAs } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRole = () => {
    if (user?.role === 'STUDENT') {
      loginAs('verifier');
    } else {
      loginAs('student');
    }
  };

  const sampleNotifications = [
    {
      id: 'notif-1',
      title: 'Aksi Nyata Disetujui! 🌳',
      desc: '+4 SAT Points & +25 GC telah ditambahkan ke profil Anda.',
      time: '15m yang lalu',
      type: 'sat',
    },
    {
      id: 'notif-2',
      title: 'Streak 5 Hari Tercapai! 🔥',
      desc: 'Pertahankan kebiasaan hijau Anda untuk nominasi BEKEN Award.',
      time: '2 jam yang lalu',
      type: 'streak',
    },
    {
      id: 'notif-3',
      title: 'TFI Activity Validated',
      desc: 'Survei lokasi biopori telah diverifikasi oleh SSO.',
      time: '1 hari yang lalu',
      type: 'tfi',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full eco-glass border-b border-surface-border/70 px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Left: Avatar + User Info / Title */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-eco-500/40 shadow-sm transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-eco-600 to-eco-400 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-eco-500/30">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                user?.role === 'VERIFIER' ? 'bg-amber-500' : 'bg-eco-500'
              }`}
              title={user?.role === 'VERIFIER' ? 'Verifier Mode' : 'Student Mode'}
            />
          </div>

          <div className="min-w-0">
            {title ? (
              <div>
                <h1 className="text-base font-extrabold text-text-primary leading-tight truncate">
                  {title}
                </h1>
                <p className="text-[10px] text-text-secondary font-medium">
                  {subtitle || (user?.role === 'VERIFIER' ? 'Portal Verifikator TFI' : 'BINUS Campus Platform')}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-[11px] text-text-secondary font-medium">Halo, Mahasiswa!</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-eco-100 text-eco-800">
                    {user?.nim || '2602199841'}
                  </span>
                </div>
                <h1 className="text-sm font-extrabold text-text-primary leading-tight truncate max-w-[130px] sm:max-w-[170px]">
                  {user?.fullName || 'Budi Santoso'}
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Right: Role Switcher + Streak + Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2" ref={dropdownRef}>
          {/* Quick Demo Role Switcher Badge */}
          <button
            onClick={toggleRole}
            className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all active:scale-95 shadow-xs ${
              user?.role === 'VERIFIER'
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-eco-50 text-eco-800 border-eco-200 hover:bg-eco-100'
            }`}
            title="Klik untuk beralih mode demo (Student <-> Verifier)"
          >
            {user?.role === 'VERIFIER' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Verifier</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-eco-700" />
                <span>Student</span>
              </>
            )}
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {/* Streak Flame Pill */}
          <div 
            className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 px-2 py-1 rounded-full text-xs font-black text-amber-800 shadow-xs"
            title={`${user?.streakDays || 5} Hari Aktif Berkelanjutan`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{user?.streakDays || 5}d</span>
          </div>

          {/* Notification Bell */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-eco-800 hover:bg-eco-50 active:scale-95 transition-all relative border border-transparent hover:border-eco-200"
            title="Notifikasi & Validasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Notification Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-eco-card border border-surface-border p-3 z-50 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border/60 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-eco-600" />
                  <span className="text-xs font-extrabold text-text-primary">Notifikasi & Validasi</span>
                </div>
                <span className="text-[10px] font-bold text-eco-600 cursor-pointer hover:underline">
                  Tandai Dibaca
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {sampleNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2 rounded-xl bg-surface-subtle hover:bg-eco-50/70 transition-colors border border-surface-border/40 text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-text-primary">{notif.title}</h4>
                      <span className="text-[9px] text-text-muted">{notif.time}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">{notif.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 pt-2 border-t border-surface-border/60 text-center">
                <p className="text-[10px] text-eco-800 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-eco-600" />
                  Terhubung ke Sistem Student Service Office
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

