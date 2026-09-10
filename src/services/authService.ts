// ==============================================================================
// I-CAN PLATFORM — SECURE AUTHENTICATION SERVICE
// Supports Supabase Auth (Cloud) & Web Crypto SHA-256 Hashed Local Store
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { UserProfile, UserRole } from '@/types';

export function normalizeUserRole(role: string): UserRole {
  const r = role?.toUpperCase();
  if (r === 'ADMIN' || r === 'SUPERADMIN') return 'SUPERADMIN';
  if (r === 'ORGANIZER') return 'ORGANIZER';
  return 'MAHASISWA';
}

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

const STORAGE_ACCOUNTS_KEY = 'i_can_registered_accounts_v2';

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
    id: 'usr-admin-005',
    nim: '1980010101',
    email: 'hendra.sso@binus.ac.id',
    fullName: 'Hendra Kusuma, M.Kom (Super Admin)',
    facultyName: 'Student Service Office (SSO)',
    role: 'SUPERADMIN',
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
      if (Array.isArray(parsed) && parsed.length >= 1) {
        // Auto-migrate legacy roles on read
        let modified = false;
        parsed.forEach((acc: any) => {
          const norm = normalizeUserRole(acc.role);
          if (acc.role !== norm) {
            acc.role = norm;
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(parsed));
        }
        return parsed as StoredAuthAccount[];
      }
    } catch {
      // fallback
    }
  }

  // Pre-seed default accounts with hashed passwords (Default passwords: 'binus123' & 'admin123')
  const defaultAdminHash = await hashPassword('admin123');

  const seeded: StoredAuthAccount[] = [
    { ...DEFAULT_SEEDED_ACCOUNTS[0], passwordHash: defaultAdminHash },
  ];

  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(seeded));
  return seeded;
}

export async function resetLegacyAccounts(): Promise<void> {
  localStorage.removeItem(STORAGE_ACCOUNTS_KEY);
  await getStoredAccounts();
}

export async function createAccountByAdmin(params: RegisterParams): Promise<{ user?: UserProfile; error?: string }> {
  const { nim, fullName, email, facultyName, password, role } = params;
  if (!nim || !fullName || !email || !password || !role) {
    return { error: 'Semua kolom wajib diisi' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanNim = nim.trim();
  const accounts = await getStoredAccounts();

  if (accounts.find((a) => a.nim.toLowerCase() === cleanNim.toLowerCase() || a.email.toLowerCase() === cleanEmail)) {
    return { error: 'NIM atau Email sudah terdaftar dalam sistem' };
  }

  const passwordHash = await hashPassword(password);
  const newAccount: StoredAuthAccount = {
    id: `usr-${Date.now()}`,
    nim: cleanNim,
    email: cleanEmail,
    fullName: fullName.trim(),
    facultyName: facultyName || 'Universitas',
    role: normalizeUserRole(role),
    passwordHash,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    totalGreenCoins: 50,
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
 * Register a new student or user
 */
export async function registerUser(params: RegisterParams): Promise<{ user?: UserProfile; error?: string }> {
  let { nim, fullName, email, facultyName, password, role = 'MAHASISWA' } = params;
  role = normalizeUserRole(role);

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
          role: normalizeUserRole(metadata.role),
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

/**
 * Get all available dynamic user accounts
 */
export async function getAllUsersList(): Promise<UserProfile[]> {
  const accounts = await getStoredAccounts();
  return accounts.map(({ passwordHash: _, ...profile }) => profile);
}

/**
 * Update stored user profile or points
 */
export async function updateStoredUserAccount(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const accounts = await getStoredAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return null;

  const updated = {
    ...accounts[index],
    ...updates,
  };
  accounts[index] = updated;
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  const { passwordHash: _, ...profile } = updated;
  return profile;
}

