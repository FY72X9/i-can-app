import React from 'react';
import { Flame, Bell, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface TopNavbarProps {
  title?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title }) => {
  const { user, loginAs } = useAuthStore();

  const toggleRole = () => {
    if (user?.role === 'STUDENT') {
      loginAs('verifier');
    } else {
      loginAs('student');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full eco-glass border-b border-surface-border/60 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Avatar + Greeting / Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-eco-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-eco-100 flex items-center justify-center text-eco-700 font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                user?.role === 'VERIFIER' ? 'bg-amber-500' : 'bg-eco-500'
              }`}
              title={user?.role}
            />
          </div>
          <div>
            {title ? (
              <h1 className="text-base font-bold text-text-primary leading-tight">{title}</h1>
            ) : (
              <>
                <p className="text-xs text-text-secondary font-medium">Halo, Mahasiswa!</p>
                <h1 className="text-sm font-bold text-text-primary leading-tight truncate max-w-[140px]">
                  {user?.fullName || 'Budi Santoso'}
                </h1>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Demo Switcher + Streak + Notification */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Role Switcher Badge */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-1 text-[11px] font-semibold bg-surface-subtle hover:bg-surface-border text-text-secondary px-2.5 py-1 rounded-full border border-surface-border/80 transition-colors"
            title="Klik untuk ganti role demo"
          >
            {user?.role === 'VERIFIER' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700 font-bold">Verifier</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-eco-600" />
                <span>Student</span>
              </>
            )}
          </button>

          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-full text-xs font-bold text-amber-700">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{user?.streakDays || 5}d</span>
          </div>

          {/* Notification Bell */}
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-eco-700 hover:bg-eco-50 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
