import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Rss, Plus, Wallet, User, CheckSquare } from 'lucide-react';
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
      <div className="max-w-md mx-auto pointer-events-auto bg-white/90 backdrop-blur-xl border border-surface-border/90 rounded-2xl sm:rounded-3xl shadow-eco-float px-2 py-1.5 flex items-center justify-around">
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
                    {/* Glowing outer pulse ring */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-eco-600 to-emerald-400 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-slow" />
                    
                    <div
                      className={`relative w-13 h-13 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 active:scale-95 shadow-md ${
                        isActive
                          ? 'bg-gradient-to-tr from-eco-800 to-eco-600 text-white ring-4 ring-eco-100 shadow-eco-600/40'
                          : 'bg-gradient-to-tr from-eco-700 to-eco-500 text-white ring-3 ring-white shadow-eco-600/30'
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.8]" />
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
                `flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-xl transition-all duration-150 relative ${
                  isActive
                    ? 'text-eco-700 font-extrabold'
                    : 'text-text-secondary hover:text-eco-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-eco-50' : ''}`}>
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4] text-eco-700' : 'stroke-[1.8]'}`} />
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-tight font-medium ${isActive ? 'font-bold text-eco-800' : ''}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-eco-600 mt-0.5" />
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

