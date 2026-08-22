import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Flame, 
  Bell, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  ChevronDown, 
  Award, 
  Zap, 
  Sparkles, 
  Trash2, 
  Check, 
  Plus, 
  ExternalLink,
  Shield,
  Layers,
  BookOpen
} from 'lucide-react';
import { useAuthStore, DEMO_PROFILES } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { user, loginAs } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    simulateIncomingNotification 
  } = useNotificationStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Close modals on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setShowAccountSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProfile = (key: string) => {
    loginAs(key);
    setShowAccountSelector(false);
  };

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      setShowNotifications(false);
      navigate(notif.actionUrl);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full eco-glass border-b border-surface-border/80 px-3.5 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Left: Avatar + Student Info / Title */}
        <div className="flex items-center gap-2.5">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => setShowAccountSelector(!showAccountSelector)}
            title="Klik untuk ganti akun demo"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-eco-neon/60 shadow-eco-sm transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl eco-gradient-hero flex items-center justify-center text-white font-extrabold shadow-sm ring-2 ring-eco-neon/50">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                user?.role === 'ADMIN'
                  ? 'bg-purple-500 ring-1 ring-purple-300'
                  : user?.role === 'VERIFIER'
                  ? 'bg-amber-500 ring-1 ring-amber-300'
                  : 'bg-eco-neon ring-1 ring-emerald-300'
              }`}
              title={user?.role}
            />
          </div>

          <div className="min-w-0">
            {title ? (
              <div>
                <h1 className="text-sm sm:text-base font-black text-text-primary leading-tight truncate">
                  {title}
                </h1>
                <p className="text-[10px] text-text-secondary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-eco-neon animate-ping inline-block" />
                  {subtitle || (user?.role === 'ADMIN' ? 'Super Admin SSO' : user?.role === 'VERIFIER' ? 'Portal Verifikator TFI' : 'BINUS Eco-Campus')}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-eco-neon/20 text-eco-900 border border-eco-neon/40">
                    {user?.role === 'ADMIN' ? 'SSO Super Admin' : user?.role === 'VERIFIER' ? 'TFI Verifier' : 'Lv. 3 Eco-Ksatria'}
                  </span>
                </div>
                <h1 className="text-xs sm:text-sm font-black text-text-primary leading-tight truncate max-w-[130px] sm:max-w-[160px] mt-0.5">
                  {user?.fullName || 'Budi Santoso'}
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Right: Account Switcher Pill + Streak + Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Account Switcher Button */}
          <div className="relative" ref={accountDropdownRef}>
            <button
              onClick={() => setShowAccountSelector(!showAccountSelector)}
              className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border transition-all active:scale-95 shadow-xs ${
                user?.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-950 border-purple-300 hover:bg-purple-200'
                  : user?.role === 'VERIFIER'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-white hover:bg-eco-50 text-eco-900 border-eco-200'
              }`}
              title="Pilih akun demo (5 Akun Tersedia)"
            >
              {user?.role === 'ADMIN' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-purple-700" />
                  <span>Admin</span>
                </>
              ) : user?.role === 'VERIFIER' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Verifier</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-eco-700" />
                  <span>{user?.fullName.split(' ')[0] || 'Student'}</span>
                </>
              )}
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {/* Account Selector Popover Dropdown */}
            {showAccountSelector && (
              <div className="absolute right-0 top-10 w-64 bg-white rounded-2xl shadow-eco-card border border-surface-border p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Pilih Akun Demo (5 Akun)</span>
                  <span className="bg-eco-neon/20 text-eco-900 px-1.5 py-0.2 rounded text-[9px]">1-Klik</span>
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {Object.entries(DEMO_PROFILES).map(([key, profile]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectProfile(key)}
                      className={`w-full p-2 rounded-xl text-left flex items-center gap-2 transition-all ${
                        user?.id === profile.id
                          ? 'bg-eco-700 text-white font-bold shadow-xs'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <img src={profile.avatarUrl} alt={profile.fullName} className="w-7 h-7 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black truncate">{profile.fullName}</div>
                        <div className={`text-[9px] truncate ${user?.id === profile.id ? 'text-eco-100' : 'text-slate-500'}`}>
                          {profile.role} • {profile.facultyName?.split(' ')[0] || 'BINUS'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex gap-1">
                  <Link
                    to="/admin"
                    onClick={() => setShowAccountSelector(false)}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg text-center transition-colors"
                  >
                    Buka Admin LTE →
                  </Link>
                  <Link
                    to="/guide"
                    onClick={() => setShowAccountSelector(false)}
                    className="flex-1 py-1.5 px-2 bg-eco-50 hover:bg-eco-100 text-eco-800 text-[10px] font-bold rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    Panduan & FAQ
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Burning Streak Pill (Duolingo Style) */}
          <div 
            className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-100 border border-amber-300/80 px-2 py-1 rounded-full text-xs font-black text-amber-900 shadow-xs active:scale-95 transition-transform cursor-pointer"
            title={`${user?.streakDays || 5} Hari Aktif Berkelanjutan`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-mono">{user?.streakDays || 5}d</span>
          </div>

          {/* Manageable Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-eco-900 hover:bg-eco-50 active:scale-95 transition-all relative border border-transparent hover:border-eco-200 bg-white/60 shadow-xs"
              title="Notifikasi & Validasi Terkelola"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-bounce-subtle">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown with Full Management */}
            {showNotifications && (
              <div className="absolute right-0 top-10 w-80 bg-white rounded-3xl shadow-eco-card border border-surface-border p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border/60">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-eco-600" />
                    <span className="text-xs font-black text-text-primary">Notifikasi & Validasi</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-eco-700 hover:underline"
                        title="Tandai semua telah dibaca"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-0.5"
                        title="Bersihkan semua notifikasi"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications Scroll List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 space-y-1">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">Semua notifikasi bersih!</p>
                      <p className="text-[10px] text-slate-400">Tidak ada pembaruan baru saat ini.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-2.5 rounded-2xl transition-all border text-left cursor-pointer relative group ${
                          !notif.read
                            ? 'bg-eco-50/70 border-eco-200/80 hover:bg-eco-50'
                            : 'bg-surface-subtle border-surface-border/40 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className={`text-[11px] leading-tight ${!notif.read ? 'font-black text-eco-950' : 'font-bold text-text-primary'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[9px] text-text-muted font-mono shrink-0">{notif.time}</span>
                        </div>

                        <p className="text-[10px] text-text-secondary mt-1 leading-snug">{notif.desc}</p>

                        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-black/5 text-[9px]">
                          {!notif.read ? (
                            <span className="text-eco-700 font-bold flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-eco-neon inline-block" />
                              Belum dibaca
                            </span>
                          ) : (
                            <span className="text-slate-400">Sudah dibaca</span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                            title="Hapus notifikasi ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Simulation Trigger Button */}
                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between gap-2">
                  <button
                    onClick={simulateIncomingNotification}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-eco-50 to-emerald-50 hover:from-eco-100 hover:to-emerald-100 border border-eco-200 text-eco-900 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all active:scale-98 shadow-xs"
                  >
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    Simulasikan Notifikasi Baru
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


