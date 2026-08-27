import { create } from 'zustand';
import { UserProfile, UserRole } from '@/types';
import { 
  loginWithCredentials, 
  registerUser, 
  RegisterParams, 
  getAllUsersList, 
  updateStoredUserAccount 
} from '@/services/authService';

// Default initial seeded profiles
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
    totalGreenCoins: 210,
    totalSatPoints: 16,
    totalCarbonSaved: 5.10,
    streakDays: 3,
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
  usersList: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  loadUsersList: () => Promise<UserProfile[]>;
  loginAs: (targetIdOrRole: string) => Promise<void>;
  loginWithPassword: (identifier: string, password: string) => Promise<boolean>;
  register: (params: RegisterParams) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUserStats: (stats: { greenCoins?: number; satPoints?: number; carbonSaved?: number; streakDays?: number }) => void;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
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

  const initialList = Object.values(DEMO_PROFILES);

  return {
    user: initialUser,
    usersList: initialList,
    isAuthenticated: Boolean(initialUser),
    isLoading: false,
    authError: null,

    loadUsersList: async () => {
      try {
        const list = await getAllUsersList();
        if (list && list.length > 0) {
          set({ usersList: list });
          return list;
        }
      } catch (err) {
        console.warn('Failed loading dynamic users list:', err);
      }
      return get().usersList;
    },

    loginAs: async (target) => {
      let list = get().usersList;
      if (!list || list.length === 0) {
        list = await get().loadUsersList();
      }

      const cleanTarget = target.toLowerCase();
      let matched = list.find(
        (u) =>
          u.id.toLowerCase() === cleanTarget ||
          u.nim.toLowerCase() === cleanTarget ||
          u.email.toLowerCase() === cleanTarget ||
          u.fullName.toLowerCase().includes(cleanTarget)
      );

      // Nickname & Role shortcuts fallback
      if (!matched) {
        if (cleanTarget === 'student') {
          matched = list.find((u) => u.id === 'usr-student-001') || list.find((u) => u.role === 'STUDENT');
        } else if (cleanTarget === 'verifier') {
          matched = list.find((u) => u.role === 'VERIFIER');
        } else if (cleanTarget === 'admin') {
          matched = list.find((u) => u.role === 'ADMIN');
        } else if (cleanTarget === 'nadia') {
          matched = list.find((u) => u.id === 'usr-student-003');
        } else if (cleanTarget === 'farhan') {
          matched = list.find((u) => u.id === 'usr-student-004');
        }
      }

      const selectedProfile = matched || DEMO_PROFILES[target] || DEMO_PROFILES.student;
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
        await get().loadUsersList();
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
        await get().loadUsersList();
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

        // Update in usersList and persistent storage
        updateStoredUserAccount(updated.id, updated).catch(console.warn);
        const updatedList = state.usersList.map((u) => (u.id === updated.id ? updated : u));

        return { user: updated, usersList: updatedList };
      });
    },

    updateUserRole: async (userId: string, newRole: UserRole) => {
      await updateStoredUserAccount(userId, { role: newRole });
      const updatedList = get().usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      set({ usersList: updatedList });

      if (get().user?.id === userId) {
        const updatedUser = { ...get().user!, role: newRole };
        localStorage.setItem('i_can_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
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
