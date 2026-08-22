import { create } from 'zustand';
import { UserProfile } from '@/types';
import { loginWithCredentials, registerUser, RegisterParams } from '@/services/authService';

// Mock profiles for instant demo / judging without requiring manual DB setup
export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'usr-student-001',
    nim: '2602158890',
    email: 'budi.santoso@binus.ac.id',
    fullName: 'Budi Santoso',
    role: 'STUDENT',
    facultyId: 'fac-socs',
    facultyName: 'School of Computer Science',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 450,
    totalSatPoints: 45, // Target: 120 SAT Points
    totalCarbonSaved: 12.50, // kg CO2e
    streakDays: 5,
    lastActionAt: new Date().toISOString(),
    createdAt: '2026-08-01T00:00:00Z',
  },
  verifier: {
    id: 'usr-verifier-002',
    nim: '2501987654',
    email: 'siska.amanda@binus.ac.id',
    fullName: 'Siska Amanda',
    role: 'VERIFIER',
    facultyId: 'fac-sis',
    facultyName: 'School of Information Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 1250,
    totalSatPoints: 85,
    totalCarbonSaved: 34.20,
    streakDays: 14,
    lastActionAt: new Date().toISOString(),
    createdAt: '2026-07-15T00:00:00Z',
  },
  nadia: {
    id: 'usr-student-003',
    nim: '2602234567',
    email: 'nadia.safira@binus.ac.id',
    fullName: 'Nadia Safira',
    role: 'STUDENT',
    facultyId: 'fac-sod',
    facultyName: 'School of Design',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 890,
    totalSatPoints: 68,
    totalCarbonSaved: 24.80,
    streakDays: 9,
    lastActionAt: new Date().toISOString(),
    createdAt: '2026-07-28T00:00:00Z',
  },
  farhan: {
    id: 'usr-student-004',
    nim: '2602345678',
    email: 'farhan.ramadhan@binus.ac.id',
    fullName: 'Farhan Ramadhan',
    role: 'STUDENT',
    facultyId: 'fac-eng',
    facultyName: 'Faculty of Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 110,
    totalSatPoints: 8,
    totalCarbonSaved: 3.20,
    streakDays: 2,
    lastActionAt: new Date().toISOString(),
    createdAt: '2026-08-10T00:00:00Z',
  },
  admin: {
    id: 'usr-admin-005',
    nim: '1980010101',
    email: 'hendra.sso@binus.ac.id',
    fullName: 'Hendra Kusuma, M.Kom (Super Admin)',
    role: 'ADMIN',
    facultyId: 'fac-sso',
    facultyName: 'Student Service Office (SSO)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 2400,
    totalSatPoints: 120,
    totalCarbonSaved: 62.00,
    streakDays: 28,
    lastActionAt: new Date().toISOString(),
    createdAt: '2026-06-01T00:00:00Z',
  },
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  loginAs: (roleOrKey: 'student' | 'verifier' | 'nadia' | 'farhan' | 'admin' | string) => void;
  loginWithPassword: (identifier: string, password: string) => Promise<boolean>;
  register: (params: RegisterParams) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUserStats: (stats: { greenCoins?: number; satPoints?: number; carbonSaved?: number; streakDays?: number }) => void;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load saved state from localStorage (null if unauthenticated)
  const savedUser = localStorage.getItem('i_can_user');
  let initialUser: UserProfile | null = null;
  if (savedUser) {
    try {
      initialUser = JSON.parse(savedUser);
    } catch {
      initialUser = null;
    }
  }

  return {
    user: initialUser,
    isAuthenticated: Boolean(initialUser),
    isLoading: false,
    authError: null,

    loginAs: (role) => {
      const selectedProfile = DEMO_PROFILES[role] || DEMO_PROFILES.student;
      localStorage.setItem('i_can_user', JSON.stringify(selectedProfile));
      set({ user: selectedProfile, isAuthenticated: true, authError: null });
    },

    loginWithPassword: async (identifier: string, password: string) => {
      set({ isLoading: true, authError: null });
      try {
        const result = await loginWithCredentials(identifier, password);
        if (result.error || !result.user) {
          set({ isLoading: false, authError: result.error || 'Gagal masuk akun' });
          return false;
        }
        localStorage.setItem('i_can_user', JSON.stringify(result.user));
        set({ user: result.user, isAuthenticated: true, isLoading: false, authError: null });
        return true;
      } catch (err: any) {
        set({ isLoading: false, authError: err.message || 'Terjadi kesalahan sistem' });
        return false;
      }
    },

    register: async (params: RegisterParams) => {
      set({ isLoading: true, authError: null });
      try {
        const result = await registerUser(params);
        if (result.error || !result.user) {
          set({ isLoading: false, authError: result.error || 'Gagal mendaftarkan akun' });
          return false;
        }
        localStorage.setItem('i_can_user', JSON.stringify(result.user));
        set({ user: result.user, isAuthenticated: true, isLoading: false, authError: null });
        return true;
      } catch (err: any) {
        set({ isLoading: false, authError: err.message || 'Terjadi kesalahan saat pendaftaran' });
        return false;
      }
    },

    logout: () => {
      localStorage.removeItem('i_can_user');
      set({ user: null, isAuthenticated: false, authError: null });
    },

    clearError: () => {
      set({ authError: null });
    },

    updateUserStats: (stats) => {
      set((state) => {
        if (!state.user) return state;
        const updated = {
          ...state.user,
          totalGreenCoins: (state.user.totalGreenCoins || 0) + (stats.greenCoins || 0),
          totalSatPoints: (state.user.totalSatPoints || 0) + (stats.satPoints || 0),
          totalCarbonSaved: Number(((state.user.totalCarbonSaved || 0) + (stats.carbonSaved || 0)).toFixed(2)),
          streakDays: stats.streakDays !== undefined ? stats.streakDays : state.user.streakDays,
        };
        localStorage.setItem('i_can_user', JSON.stringify(updated));
        return { user: updated };
      });
    },

    setUser: (user) => {
      if (user) {
        localStorage.setItem('i_can_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('i_can_user');
      }
      set({ user, isAuthenticated: Boolean(user), authError: null });
    },
  };
});
