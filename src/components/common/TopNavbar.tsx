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
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuthStore, DEMO_PROFILES } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAppModeStore } from '@/stores/appModeStore';

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { user, usersList, loadUsersList, loginAs } = useAuthStore();
  const { mode, isDemoMode, isPrototypeMode, toggleMode } = useAppModeStore();
  const { 
    notifications, 
    unreadCount, 
    loadUserNotifications,
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

  const canSwitchRoles = isDemoMode() || user?.role === 'ADMIN';

  // Load real dynamic users list on mount
  useEffect(() => {
    loadUsersList();
  }, []);

  // Load real notifications matching the active user
  useEffect(() => {
    loadUserNotifications(user);
  }, [user?.id, user?.role]);

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

  const handleSelectProfile = (userId: string) => {
    loginAs(userId);
    setShowAccountSelector(false);
  };

  const handleAvatarClick = () => {
    if (canSwitchRoles) {
      setShowAccountSelector(!showAccountSelector);
    } else {
      navigate('/profile');
    }
  };

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      setShowNotifications(false);
      navigate(notif.actionUrl);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full eco-glass border-b border-surface-border/80 px-3.5 sm:px-4 py-2.5 transition-all">
      <div className="max-w-lg lg:max-w-[500px] mx-auto flex items-center justify-between relative">
        {/* Left: Avatar + Student Info / Title */}
        <div className="flex items-center gap-2.5">
          <div 
            className="relative group cursor-pointer" 
            onClick={handleAvatarClick}
            title={canSwitchRoles ? 'Klik untuk simulasi ganti akun demo' : 'Buka profil Anda'}
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
                  : user?.role === 'ORGANIZER'
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
                  {subtitle || (user?.role === 'ADMIN' ? 'Super Admin SSO' : user?.role === 'ORGANIZER' ? 'Portal Penyelenggara Event' : 'BINUS Eco-Campus')}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-eco-neon/20 text-eco-900 border border-eco-neon/40">
                    {user?.role === 'ADMIN' ? 'SSO Super Admin' : user?.role === 'ORGANIZER' ? 'Penyelenggara' : 'Lv. 3 Eco-Ksatria'}
                  </span>
                </div>
                <h1 className="text-xs sm:text-sm font-black text-text-primary leading-tight truncate max-w-[130px] sm:max-w-[160px] mt-0.5">
                  {user?.fullName || 'Budi Santoso'}
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Right: Account Switcher / Role Pill + Streak + Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Account Switcher Button (Only for Admin or in Demo Mode) */}
          {canSwitchRoles ? (
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setShowAccountSelector(!showAccountSelector)}
                className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border transition-all active:scale-95 shadow-xs ${
                  user?.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-950 border-purple-300 hover:bg-purple-200'
                    : user?.role === 'ORGANIZER'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : 'bg-white hover:bg-eco-50 text-eco-900 border-eco-200'
                }`}
                title="Pilih akun simulasi (Role Switcher)"
              >
                {user?.role === 'ADMIN' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-purple-700" />
                    <span>Admin</span>
                  </>
                ) : user?.role === 'ORGANIZER' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Organizer</span>
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
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-3xl shadow-eco-card border border-surface-border p-3.5 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <div className="text-xs font-black text-text-muted uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                    <span>Simulasi Akun ({usersList.length} Akun • {user?.role === 'ADMIN' ? 'Admin Mode' : 'Dev Mode'})</span>
                    <span className="bg-eco-neon/20 text-eco-900 px-2 py-0.5 rounded text-[10px]">1-Klik</span>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {usersList.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleSelectProfile(profile.id)}
                        className={`w-full p-2.5 rounded-2xl text-left flex items-center gap-2.5 transition-all ${
                          user?.id === profile.id
                            ? 'bg-eco-700 text-white font-bold shadow-xs'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <img 
                          src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                          alt={profile.fullName} 
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-black/5 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black truncate">{profile.fullName}</div>
                          <div className={`text-[10px] truncate ${user?.id === profile.id ? 'text-eco-100' : 'text-slate-500'}`}>
                            {profile.role} • {profile.totalSatPoints || 0} SAT
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <Link
                      to="/sdg-guideline"
                      onClick={() => setShowAccountSelector(false)}
                      className="flex-1 py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>🌍 Matriks SDG</span>
                    </Link>
                    <Link
                      to="/guide"
                      onClick={() => setShowAccountSelector(false)}
                      className="flex-1 py-2 px-2.5 bg-eco-50 hover:bg-eco-100 text-eco-800 text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Panduan</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Prototype Clean Mode Badge (Non-clickable for regular users) */
            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {user?.role === 'ORGANIZER' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Penyelenggara</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-eco-700" />
                  <span>Mahasiswa</span>
                </>
              )}
            </div>
          )}

          {/* Burning Streak Pill (Duolingo Style) */}
          <div 
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-100 border border-amber-300/80 px-2.5 py-1 rounded-full text-xs font-black text-amber-900 shadow-xs active:scale-95 transition-transform cursor-pointer"
            title={`${user?.streakDays || 5} Hari Aktif Berkelanjutan`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-mono">{user?.streakDays || 5}d</span>
          </div>

          {/* Manageable Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 relative border shadow-xs ${
                showNotifications
                  ? 'bg-eco-700 text-white border-eco-700 shadow-neon-glow'
                  : 'text-text-secondary hover:text-eco-900 hover:bg-eco-50 border-transparent hover:border-eco-200 bg-white/70'
              }`}
              title="Notifikasi & Validasi Terkelola"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-bounce-subtle">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown with Full Management */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-3xl shadow-eco-float border border-surface-border p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5">
                {/* Header with Title & Action Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-border/70">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-eco-neon/20 text-eco-900 flex items-center justify-center font-bold shrink-0">
                      <Bell className="w-4 h-4 text-eco-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-text-primary">Notifikasi & Validasi</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.2 rounded-full">
                            {unreadCount} baru
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted">Pembaruan Poin SAT, Aksi & BEKEN</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-bold text-eco-800 hover:text-eco-950 px-2 py-1 rounded-lg hover:bg-eco-50 transition-colors"
                        title="Tandai semua telah dibaca"
                      >
                        Baca Semua
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Bersihkan semua notifikasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications Scroll List */}
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 space-y-2">
                      <div className="w-12 h-12 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                        🔔
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-700">Semua notifikasi bersih!</p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Tidak ada pembaruan status atau validasi baru saat ini.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const isUnread = !notif.read;
                      const isSat = notif.type === 'sat';
                      const isQuest = notif.type === 'quest';
                      const isRejection = notif.type === 'rejection';
                      const isStreak = notif.type === 'streak';

                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 rounded-2xl transition-all border text-left cursor-pointer relative group flex items-start gap-3 ${
                            isUnread
                              ? 'bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-eco-300 shadow-2xs hover:border-eco-400'
                              : 'bg-surface-subtle border-surface-border/50 hover:bg-slate-100/80 hover:border-slate-300'
                          }`}
                        >
                          {/* Categorized Notification Themed Icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-xs mt-0.5 ${
                            isSat ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            isQuest ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                            isStreak ? 'bg-orange-100 text-orange-900 border border-orange-200' :
                            isRejection ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                            {isSat ? '🎓' : isQuest ? '⚡' : isStreak ? '🔥' : isRejection ? '⚠️' : '🌱'}
                          </div>

                          {/* Notification Content */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className={`text-xs leading-snug truncate ${isUnread ? 'font-black text-eco-950' : 'font-bold text-text-primary'}`}>
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-text-muted font-mono shrink-0">{notif.time}</span>
                            </div>

                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                              {notif.desc}
                            </p>

                            {/* Action Links & Controls */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-black/5 text-[10px]">
                              <div className="flex items-center gap-2">
                                {isUnread ? (
                                  <span className="text-eco-800 font-black flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-eco-neon inline-block shadow-xs animate-pulse" />
                                    Baru
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Dibaca</span>
                                )}

                                {notif.actionUrl && (
                                  <span className="text-eco-700 font-bold hover:underline inline-flex items-center gap-0.5">
                                    Lihat Detail →
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                                title="Hapus notifikasi ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Simulation Trigger Button (Only in Dev / Showcase Mode) */}
                {isDemoMode() && (
                  <div className="pt-2 border-t border-surface-border/70">
                    <button
                      onClick={simulateIncomingNotification}
                      className="w-full py-2 px-3 bg-gradient-to-r from-eco-50 to-emerald-50 hover:from-eco-100 hover:to-emerald-100 border border-eco-200 text-eco-900 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Simulasikan Notifikasi Baru (Dev Mode)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


