import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Rss, Plus, User, CheckSquare, Trophy } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const BottomNav: React.FC = () => {
  const { user } = useAuthStore();
  const isVerifier = user?.role === 'VERIFIER';

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: isVerifier ? 'Verify' : 'Feed', path: isVerifier ? '/verify' : '/feed', icon: isVerifier ? CheckSquare : Rss },
    { name: 'Post', path: '/upload', icon: Plus, isAction: true },
    { name: 'Rank', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-3.5 pointer-events-none">
      <div className="max-w-lg lg:max-w-[500px] mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl border border-surface-border/90 rounded-3xl shadow-eco-float px-3 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-none relative px-2"
                title="Unggah Aksi Nyata & Klaim SAT (One-Shot Post)"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center">
                    {/* Glowing outer neon halo */}
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-eco-neon via-emerald-400 to-teal-400 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
                      
                      <div
                        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-md ${
                          isActive
                            ? 'bg-gradient-to-tr from-eco-900 to-eco-700 text-white ring-2 ring-eco-neon/80 shadow-neon-glow'
                            : 'bg-gradient-to-tr from-eco-700 via-eco-600 to-eco-500 text-white ring-2 ring-white/90 shadow-eco-sm'
                        }`}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                      </div>
                    </div>

                    <span className={`text-[10px] mt-1 tracking-tight font-black ${
                      isActive ? 'text-eco-900' : 'text-eco-800 font-bold'
                    }`}>
                      Post
                    </span>
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
