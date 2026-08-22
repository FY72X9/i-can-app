// ==============================================================================
// I-CAN PLATFORM — SECURE AUTHENTICATION SERVICE
// Supports Supabase Auth (Cloud) & Web Crypto SHA-256 Hashed Local Store
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { UserProfile, UserRole } from '@/types';

export interface RegisterParams {
  nim: string;
  fullName: string;
  email: string;
  facultyName: string;
  password: string;
  role?: UserRole;
}

export interface StoredAuthAccount {
  id: string;
  nim: string;
  email: string;
  fullName: string;
  facultyName: string;
  role: UserRole;
  passwordHash: string;
  avatarUrl?: string;
  totalGreenCoins: number;
  totalSatPoints: number;
  totalCarbonSaved: number;
  streakDays: number;
  createdAt: string;
}

const STORAGE_ACCOUNTS_KEY = 'i_can_registered_accounts';

/**
 * Computes SHA-256 hash using the native browser Web Crypto API
 * Guarantees passwords are never stored in plaintext even locally
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim() + '_ican_salt_2026');
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * In-memory / localStorage seed accounts for instant demo & testing
 */
const DEFAULT_SEEDED_ACCOUNTS: Omit<StoredAuthAccount, 'passwordHash'>[] = [
  {
    id: 'usr-student-001',
    nim: '2602158890',
    email: 'budi.santoso@binus.ac.id',
    fullName: 'Budi Santoso',
    facultyName: 'School of Computer Science',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 450,
    totalSatPoints: 45,
    totalCarbonSaved: 12.50,
    streakDays: 5,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr-verifier-002',
    nim: '2501987654',
    email: 'siska.amanda@binus.ac.id',
    fullName: 'Siska Amanda',
    facultyName: 'School of Information Systems',
    role: 'VERIFIER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 1250,
    totalSatPoints: 85,
    totalCarbonSaved: 34.20,
    streakDays: 14,
    createdAt: '2026-07-15T00:00:00Z',
  },
  {
    id: 'usr-student-003',
    nim: '2602234567',
    email: 'nadia.safira@binus.ac.id',
    fullName: 'Nadia Safira',
    facultyName: 'School of Design',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 890,
    totalSatPoints: 68,
    totalCarbonSaved: 24.80,
    streakDays: 9,
    createdAt: '2026-07-28T00:00:00Z',
  },
  {
    id: 'usr-student-004',
    nim: '2602345678',
    email: 'farhan.ramadhan@binus.ac.id',
    fullName: 'Farhan Ramadhan',
    facultyName: 'Faculty of Engineering',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 110,
    totalSatPoints: 8,
    totalCarbonSaved: 3.20,
    streakDays: 2,
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'usr-admin-005',
    nim: '1980010101',
    email: 'hendra.sso@binus.ac.id',
    fullName: 'Hendra Kusuma, M.Kom (Super Admin)',
    facultyName: 'Student Service Office (SSO)',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 2400,
    totalSatPoints: 120,
    totalCarbonSaved: 62.00,
    streakDays: 28,
    createdAt: '2026-06-01T00:00:00Z',
  },
];

/**
 * Initializes local storage accounts if not present
 */
export async function getStoredAccounts(): Promise<StoredAuthAccount[]> {
  const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 5) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  // Pre-seed default accounts with hashed passwords (Default passwords: 'binus123' & 'admin123')
  const defaultUserHash = await hashPassword('binus123');
  const defaultAdminHash = await hashPassword('admin123');

  const seeded: StoredAuthAccount[] = [
    { ...DEFAULT_SEEDED_ACCOUNTS[0], passwordHash: defaultUserHash },
    { ...DEFAULT_SEEDED_ACCOUNTS[1], passwordHash: defaultUserHash },
    { ...DEFAULT_SEEDED_ACCOUNTS[2], passwordHash: defaultUserHash },
    { ...DEFAULT_SEEDED_ACCOUNTS[3], passwordHash: defaultUserHash },
    { ...DEFAULT_SEEDED_ACCOUNTS[4], passwordHash: defaultAdminHash },
  ];

  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(seeded));
  return seeded;
}

/**
 * Register a new student or user
 */
export async function registerUser(params: RegisterParams): Promise<{ user?: UserProfile; error?: string }> {
  const { nim, fullName, email, facultyName, password, role = 'STUDENT' } = params;

  if (!nim || !fullName || !email || !password) {
    return { error: 'Semua kolom wajib diisi' };
  }

  if (password.length < 6) {
    return { error: 'Kata sandi minimal 6 karakter' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanNim = nim.trim();

  // 1. Cloud Registration via Supabase Auth (if configured)
  if (isConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            nim: cleanNim,
            full_name: fullName,
            role,
            faculty_name: facultyName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          nim: cleanNim,
          email: cleanEmail,
          fullName,
          role,
          facultyName,
          totalGreenCoins: 50,
          totalSatPoints: 0,
          totalCarbonSaved: 0.0,
          streakDays: 1,
          createdAt: new Date().toISOString(),
        };
        return { user: profile };
      }
    } catch (err: any) {
      console.warn('Supabase sign-up failed, falling back to secure local store:', err);
    }
  }

  // 2. Secure Local Store Registration
  const accounts = await getStoredAccounts();

  // Check if NIM or Email already exists
  const existing = accounts.find(
    (a) => a.nim.toLowerCase() === cleanNim.toLowerCase() || a.email.toLowerCase() === cleanEmail
  );

  if (existing) {
    return { error: 'NIM atau Email sudah terdaftar dalam sistem' };
  }

  const passwordHash = await hashPassword(password);
  const newAccount: StoredAuthAccount = {
    id: `usr-${Date.now()}`,
    nim: cleanNim,
    email: cleanEmail,
    fullName: fullName.trim(),
    facultyName: facultyName || 'School of Computer Science',
    role,
    passwordHash,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 50, // Welcome bonus
    totalSatPoints: 0,
    totalCarbonSaved: 0.0,
    streakDays: 1,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

  const { passwordHash: _, ...userProfile } = newAccount;
  return { user: userProfile };
}

/**
 * Login with Email or NIM + Password
 */
export async function loginWithCredentials(
  identifier: string,
  password: string
): Promise<{ user?: UserProfile; error?: string }> {
  if (!identifier || !password) {
    return { error: 'Masukkan NIM/Email dan kata sandi Anda' };
  }

  const cleanIdentifier = identifier.trim();

  // 1. Cloud Login via Supabase Auth
  if (isConfigured && cleanIdentifier.includes('@')) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanIdentifier.toLowerCase(),
        password,
      });

      if (!error && data.user) {
        const metadata = data.user.user_metadata || {};
        const profile: UserProfile = {
          id: data.user.id,
          nim: metadata.nim || '2602158890',
          email: data.user.email || cleanIdentifier,
          fullName: metadata.full_name || 'Mahasiswa BINUS',
          role: metadata.role || 'STUDENT',
          facultyName: metadata.faculty_name || 'School of Computer Science',
          totalGreenCoins: 50,
          totalSatPoints: 0,
          totalCarbonSaved: 0.0,
          streakDays: 1,
          createdAt: data.user.created_at || new Date().toISOString(),
        };
        return { user: profile };
      }
    } catch (err) {
      console.warn('Supabase sign-in failed, trying local store:', err);
    }
  }

  // 2. Secure Local Store Authentication
  const accounts = await getStoredAccounts();
  const inputHash = await hashPassword(password);

  const matchedAccount = accounts.find(
    (acc) =>
      acc.nim.toLowerCase() === cleanIdentifier.toLowerCase() ||
      acc.email.toLowerCase() === cleanIdentifier.toLowerCase()
  );

  if (!matchedAccount) {
    return { error: 'NIM / Email tidak ditemukan. Silakan daftar akun baru.' };
  }

  if (matchedAccount.passwordHash !== inputHash) {
    return { error: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
  }

  const { passwordHash: _, ...userProfile } = matchedAccount;
  return { user: userProfile };
}
