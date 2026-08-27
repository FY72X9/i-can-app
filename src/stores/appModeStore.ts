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
  // Check env variable or local storage (default to 'DEMO' for development/showcase, 'PROTOTYPE' for end-user testing)
  const savedMode = localStorage.getItem(APP_MODE_KEY) as AppMode | null;
  const initialMode: AppMode = savedMode || (import.meta.env.VITE_APP_MODE === 'production' ? 'PROTOTYPE' : 'DEMO');

  return {
    mode: initialMode,
    setMode: (mode) => {
      localStorage.setItem(APP_MODE_KEY, mode);
      set({ mode });
    },
    toggleMode: () => {
      const next = get().mode === 'DEMO' ? 'PROTOTYPE' : 'DEMO';
      localStorage.setItem(APP_MODE_KEY, next);
      set({ mode: next });
    },
    isDemoMode: () => get().mode === 'DEMO',
    isPrototypeMode: () => get().mode === 'PROTOTYPE',
  };
});
