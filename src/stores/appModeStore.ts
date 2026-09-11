import { create } from 'zustand';

export type AppMode = 'PROTOTYPE' | 'DEMO';

interface AppModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isDemoMode: () => boolean;
  isPrototypeMode: () => boolean;
}

const APP_MODE_KEY = 'i_can_app_mode';

export const useAppModeStore = create<AppModeState>((set, get) => {
  const isProdEnv = import.meta.env.VITE_APP_MODE === 'production';
  const savedMode = isProdEnv ? null : (localStorage.getItem(APP_MODE_KEY) as AppMode | null);
  const initialMode: AppMode = isProdEnv ? 'PROTOTYPE' : (savedMode || 'DEMO');

  return {
    mode: initialMode,
    setMode: (mode) => {
      if (isProdEnv) return;
      localStorage.setItem(APP_MODE_KEY, mode);
      set({ mode });
    },
    toggleMode: () => {
      if (isProdEnv) return;
      const next = get().mode === 'DEMO' ? 'PROTOTYPE' : 'DEMO';
      localStorage.setItem(APP_MODE_KEY, next);
      set({ mode: next });
    },
    isDemoMode: () => !isProdEnv && get().mode === 'DEMO',
    isPrototypeMode: () => isProdEnv || get().mode === 'PROTOTYPE',
  };
});
