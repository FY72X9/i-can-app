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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-surface-border/80 px-2 py-1.5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
              >
                {({ isActive }) => (
                  <div
                    className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 active:scale-95 ${
                      isActive
                        ? 'bg-eco-700 text-white ring-4 ring-eco-100 shadow-eco-600/30'
                        : 'bg-eco-600 text-white ring-4 ring-white shadow-eco-600/25'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.5]" />
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
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-eco-600 font-bold'
                    : 'text-text-secondary hover:text-eco-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                  <span className="text-[10px] mt-1 tracking-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
