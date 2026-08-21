import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Rss, Plus, Wallet, User, CheckSquare, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const BottomNav: React.FC = () => {
  const { user } = useAuthStore();
  const isVerifier = user?.role === 'VERIFIER';

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Feed', path: '/feed', icon: Rss },
    { name: 'Upload', path: '/upload', icon: Plus, isAction: true },
    { name: isVerifier ? 'Verify' : 'Wallet', path: isVerifier ? '/verify' : '/wallet', icon: isVerifier ? CheckSquare : Wallet },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl border border-surface-border/90 rounded-3xl shadow-eco-float px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-7 group focus:outline-none"
                title="Unggah Aksi Nyata & Klaim SAT"
              >
                {({ isActive }) => (
                  <div className="relative">
                    {/* Glowing outer neon halo */}
                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-eco-neon via-emerald-400 to-cyber-cyan rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
                    
                    <div
                      className={`relative w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-95 shadow-lg ${
                        isActive
                          ? 'bg-gradient-to-tr from-eco-900 to-eco-700 text-white ring-4 ring-eco-neon/60 shadow-neon-glow'
                          : 'bg-gradient-to-tr from-eco-700 via-eco-600 to-eco-500 text-white ring-3 ring-white shadow-neon-glow'
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[3]" />
                    </div>
                  </div>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-2xl transition-all duration-200 relative ${
                  isActive
                    ? 'text-eco-700 font-black scale-105'
                    : 'text-text-secondary hover:text-eco-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-eco-neon/15 shadow-xs' : ''}`}>
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.8] text-eco-800' : 'stroke-[1.8]'}`} />
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-tight font-medium ${isActive ? 'font-black text-eco-950' : ''}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-eco-neon mt-0.5 shadow-xs animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};


