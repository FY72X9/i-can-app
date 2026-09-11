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
  isDeleted?: boolean;
  deletedAt?: string;
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
 * Validates user identifier based on role:
 * - MAHASISWA: NIM must be exactly 10 digits (^\d{10}$)
 * - ORGANIZER/SUPERADMIN: Binus Number must start with BN followed by 1-9 digits (^BN\d{1,9}$)
 */
export function validateUserIdentifier(identifier: string, role: UserRole): { valid: boolean; error?: string } {
  if (role === 'MAHASISWA') {
    if (!/^\d{10}$/.test(identifier)) {
      return { valid: false, error: 'NIM harus tepat 10 digit angka (contoh: 2602158890)' };
    }
  } else {
    // ORGANIZER or SUPERADMIN → Binus Number (BN)
    if (!/^BN\d{1,9}$/i.test(identifier)) {
      return { valid: false, error: 'Binus Number harus diawali "BN" diikuti maksimal 9 digit angka (contoh: BN123456789)' };
    }
  }
  return { valid: true };
}

export interface EditUserParams {
  fullName?: string;
  nim?: string;
  email?: string;
  facultyName?: string;
  role?: UserRole;
  newPassword?: string;
}

export function getNeutralAvatarUrl(name: string = 'User', identifier?: string, role?: UserRole): string {
  const clean = encodeURIComponent((name || identifier || 'User').trim());
  const bg = role === 'SUPERADMIN' ? '7c3aed' : role === 'ORGANIZER' ? 'd97706' : '059669';
  return `https://ui-avatars.com/api/?name=${clean}&background=${bg}&color=fff&bold=true&size=150`;
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
    avatarUrl: getNeutralAvatarUrl('Hendra Kusuma, M.Kom', '1980010101', 'SUPERADMIN'),
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
        // Auto-migrate legacy roles and male avatar photos to neutral avatars on read
        let modified = false;
        parsed.forEach((acc: any) => {
          const norm = normalizeUserRole(acc.role);
          if (acc.role !== norm) {
            acc.role = norm;
            modified = true;
          }
          if (!acc.avatarUrl || acc.avatarUrl.includes('photo-1535713875002-d1d0cf377fde') || acc.avatarUrl.includes('photo-1500648767791-00dcc994a43e')) {
            acc.avatarUrl = getNeutralAvatarUrl(acc.fullName, acc.nim, acc.role);
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

/**
 * Upsert a single user account to Supabase public.users table.
 * Called internally by all CRUD operations to keep Supabase in sync.
 */
async function syncSingleAccountToSupabase(acc: StoredAuthAccount): Promise<void> {
  if (!isConfigured) return;
  try {
    const row = {
      nim: acc.nim.trim(),
      email: acc.email.trim().toLowerCase(),
      full_name: acc.fullName.trim(),
      role: mapRoleToSupabase(acc.role),
      avatar_url: acc.avatarUrl || null,
      total_green_coins: acc.totalGreenCoins || 0,
      total_sat_points: acc.totalSatPoints || 0,
      total_carbon_saved: acc.totalCarbonSaved || 0.0,
      streak_days: acc.streakDays || 1,
      created_at: acc.createdAt || new Date().toISOString(),
    };
    const { error } = await supabase
      .from('users')
      .upsert(row, { onConflict: 'nim' });
    if (error) {
      console.warn('[authService] Supabase sync single account error:', error.message);
    }
  } catch (err) {
    console.warn('[authService] Supabase sync single account failed:', err);
  }
}

/**
 * Delete a user from Supabase public.users by NIM.
 */
async function deleteAccountFromSupabase(nim: string): Promise<void> {
  if (!isConfigured) return;
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('nim', nim.trim());
    if (error) {
      console.warn('[authService] Supabase delete account error:', error.message);
    }
  } catch (err) {
    console.warn('[authService] Supabase delete account failed:', err);
  }
}

export async function createAccountByAdmin(params: RegisterParams): Promise<{ user?: UserProfile; error?: string }> {
  const { nim, fullName, email, facultyName, password, role } = params;
  if (!nim || !fullName || !email || !password || !role) {
    return { error: 'Semua kolom wajib diisi' };
  }

  if (password.length < 6) {
    return { error: 'Kata sandi minimal 6 karakter' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanNim = role === 'MAHASISWA' ? nim.trim() : nim.trim().toUpperCase();

  // Validate identifier format (NIM or BN)
  const identifierCheck = validateUserIdentifier(cleanNim, normalizeUserRole(role));
  if (!identifierCheck.valid) {
    return { error: identifierCheck.error };
  }

  const accounts = await getStoredAccounts();

  if (accounts.find((a) => a.nim.toLowerCase() === cleanNim.toLowerCase() || a.email.toLowerCase() === cleanEmail)) {
    return { error: 'NIM/BN atau Email sudah terdaftar dalam sistem' };
  }

  const passwordHash = await hashPassword(password);
  const targetRole = normalizeUserRole(role);
  const newAccount: StoredAuthAccount = {
    id: `usr-${Date.now()}`,
    nim: cleanNim,
    email: cleanEmail,
    fullName: fullName.trim(),
    facultyName: facultyName || 'Universitas',
    role: targetRole,
    passwordHash,
    avatarUrl: getNeutralAvatarUrl(fullName.trim(), cleanNim, targetRole),
    totalGreenCoins: 50,
    totalSatPoints: 0,
    totalCarbonSaved: 0.0,
    streakDays: 1,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

  // Sync to Supabase
  await syncSingleAccountToSupabase(newAccount);

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
    avatarUrl: getNeutralAvatarUrl(fullName.trim(), cleanNim, role),
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

  // Reject login for deactivated (soft-deleted) accounts
  if (matchedAccount.isDeleted) {
    return { error: 'Akun Anda telah dinonaktifkan oleh Superadmin. Hubungi SSO untuk informasi lebih lanjut.' };
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

  // Sync to Supabase
  await syncSingleAccountToSupabase(updated);

  const { passwordHash: _, ...profile } = updated;
  return profile;
}

/**
 * Edit user account by Admin — validates NIM/BN format, checks for duplicates
 */
export async function editAccountByAdmin(
  userId: string,
  data: EditUserParams
): Promise<{ user?: UserProfile; error?: string }> {
  const accounts = await getStoredAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return { error: 'Akun tidak ditemukan' };

  const account = accounts[index];
  const targetRole = data.role ? normalizeUserRole(data.role) : account.role;

  // Validate NIM/BN if changed
  if (data.nim && data.nim.trim() !== account.nim) {
    const cleanNim = targetRole === 'MAHASISWA' ? data.nim.trim() : data.nim.trim().toUpperCase();
    const identifierCheck = validateUserIdentifier(cleanNim, targetRole);
    if (!identifierCheck.valid) {
      return { error: identifierCheck.error };
    }
    // Check for duplicate NIM/BN (excluding current account)
    if (accounts.find((a) => a.id !== userId && a.nim.toLowerCase() === cleanNim.toLowerCase())) {
      return { error: 'NIM/BN sudah digunakan oleh akun lain' };
    }
    account.nim = cleanNim;
  }

  // Validate email if changed
  if (data.email && data.email.trim().toLowerCase() !== account.email) {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      return { error: 'Format alamat email tidak valid' };
    }
    if (accounts.find((a) => a.id !== userId && a.email.toLowerCase() === cleanEmail)) {
      return { error: 'Email sudah digunakan oleh akun lain' };
    }
    account.email = cleanEmail;
  }

  // Update other fields
  if (data.fullName) account.fullName = data.fullName.trim();
  if (data.facultyName) account.facultyName = data.facultyName;
  if (data.role) account.role = targetRole;

  // Optional password reset
  if (data.newPassword) {
    if (data.newPassword.length < 6) {
      return { error: 'Kata sandi baru minimal 6 karakter' };
    }
    account.passwordHash = await hashPassword(data.newPassword);
  }

  accounts[index] = account;
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

  // Sync to Supabase
  await syncSingleAccountToSupabase(account);

  const { passwordHash: _, ...userProfile } = account;
  return { user: userProfile };
}

/**
 * Soft delete (deactivate) user account
 */
export async function softDeleteAccountByAdmin(userId: string): Promise<{ success?: boolean; error?: string }> {
  const accounts = await getStoredAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return { error: 'Akun tidak ditemukan' };

  accounts[index].isDeleted = true;
  accounts[index].deletedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

  // Delete from Supabase
  await deleteAccountFromSupabase(accounts[index].nim);

  return { success: true };
}

/**
 * Restore (reactivate) a soft-deleted user account
 */
export async function restoreAccountByAdmin(userId: string): Promise<{ success?: boolean; error?: string }> {
  const accounts = await getStoredAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return { error: 'Akun tidak ditemukan' };

  accounts[index].isDeleted = false;
  accounts[index].deletedAt = undefined;
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

  // Re-sync to Supabase
  await syncSingleAccountToSupabase(accounts[index]);

  return { success: true };
}

export interface BatchImportUserItem {
  nim: string;
  fullName: string;
  email: string;
  facultyName: string;
  password?: string;
  role?: UserRole;
}

export interface BatchImportOptions {
  defaultPassword?: string;
  useNimAsPassword?: boolean;
  duplicateAction?: 'skip' | 'update';
  defaultRole?: UserRole;
}

export interface BatchImportResult {
  total: number;
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: { row?: number; identifier: string; reason: string }[];
}

/**
 * Batch import user accounts (e.g. from Excel)
 */
export async function batchImportAccounts(
  items: BatchImportUserItem[],
  options: BatchImportOptions = {}
): Promise<BatchImportResult> {
  const {
    defaultPassword = 'binus123',
    useNimAsPassword = false,
    duplicateAction = 'skip',
    defaultRole = 'MAHASISWA',
  } = options;

  const accounts = await getStoredAccounts();
  const existingByNim = new Map<string, number>();
  const existingByEmail = new Map<string, number>();

  accounts.forEach((acc, idx) => {
    if (acc.nim) existingByNim.set(acc.nim.toLowerCase().trim(), idx);
    if (acc.email) existingByEmail.set(acc.email.toLowerCase().trim(), idx);
  });

  // Pre-calculate hash for default password to avoid computing SHA-256 for hundreds of identical passwords
  let cachedDefaultHash: string | null = null;
  if (!useNimAsPassword) {
    cachedDefaultHash = await hashPassword(defaultPassword);
  }

  const result: BatchImportResult = {
    total: items.length,
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  const newAccounts: StoredAuthAccount[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const cleanNim = item.nim.trim();
    const cleanEmail = item.email.trim().toLowerCase();
    const cleanName = item.fullName.trim();
    const cleanFaculty = item.facultyName.trim() || 'School of Computer Science';
    const role = normalizeUserRole(item.role || defaultRole);

    // Validate identifier
    const check = validateUserIdentifier(cleanNim, role);
    if (!check.valid) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        identifier: cleanNim || cleanName,
        reason: check.error || 'Identifier tidak valid',
      });
      continue;
    }

    if (!cleanEmail.includes('@')) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        identifier: cleanNim,
        reason: 'Format email tidak valid',
      });
      continue;
    }

    const lowerNim = cleanNim.toLowerCase();
    const existingIndex = existingByNim.has(lowerNim)
      ? existingByNim.get(lowerNim)!
      : existingByEmail.has(cleanEmail)
      ? existingByEmail.get(cleanEmail)!
      : -1;

    if (existingIndex !== -1) {
      if (duplicateAction === 'skip') {
        result.skipped++;
        continue;
      } else if (duplicateAction === 'update') {
        // Update existing record without touching coins / sat / password unless specified
        accounts[existingIndex].fullName = cleanName;
        accounts[existingIndex].facultyName = cleanFaculty;
        accounts[existingIndex].email = cleanEmail;
        accounts[existingIndex].role = role;
        result.updated++;
        continue;
      }
    }

    // Determine password hash
    let finalHash: string;
    if (item.password) {
      finalHash = await hashPassword(item.password);
    } else if (useNimAsPassword) {
      finalHash = await hashPassword(cleanNim);
    } else {
      if (!cachedDefaultHash) {
        cachedDefaultHash = await hashPassword(defaultPassword);
      }
      finalHash = cachedDefaultHash;
    }

    const newAcc: StoredAuthAccount = {
      id: `usr-imp-${Date.now()}-${i}`,
      nim: cleanNim,
      email: cleanEmail,
      fullName: cleanName,
      facultyName: cleanFaculty,
      role,
      passwordHash: finalHash,
      avatarUrl: getNeutralAvatarUrl(cleanName, cleanNim, role),
      totalGreenCoins: 50,
      totalSatPoints: 0,
      totalCarbonSaved: 0.0,
      streakDays: 1,
      createdAt: new Date().toISOString(),
    };

    newAccounts.push(newAcc);
    existingByNim.set(lowerNim, accounts.length + newAccounts.length - 1);
    existingByEmail.set(cleanEmail, accounts.length + newAccounts.length - 1);
    result.imported++;
  }

  if (newAccounts.length > 0 || result.updated > 0) {
    const merged = [...accounts, ...newAccounts];
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(merged));

    // Auto-sync newly imported accounts to Supabase if configured
    if (isConfigured) {
      try {
        await syncAccountsToSupabase(merged);
      } catch (err) {
        console.warn('Auto-sync to Supabase failed:', err);
      }
    }
  }

  return result;
}

/**
 * Map app role to Supabase schema role
 */
function mapRoleToSupabase(role: string): 'STUDENT' | 'VERIFIER' | 'ADMIN' {
  const upper = role.toUpperCase();
  if (upper === 'SUPERADMIN' || upper === 'ADMIN') return 'ADMIN';
  if (upper === 'ORGANIZER' || upper === 'VERIFIER') return 'VERIFIER';
  return 'STUDENT';
}

/**
 * Synchronize local user accounts to Supabase public.users table.
 *
 * PREREQUISITES — run supabase/fix_users_insert.sql in Supabase SQL Editor first:
 *  1. FK constraint on id removed
 *  2. id column has DEFAULT gen_random_uuid()
 *  3. INSERT RLS policy exists
 *  4. UPDATE RLS policy broadened for upsert
 */
export async function syncAccountsToSupabase(
  accountsToSync?: StoredAuthAccount[]
): Promise<{ count: number; error?: string }> {
  if (!isConfigured) {
    return { count: 0, error: 'Koneksi Supabase belum dikonfigurasi di file .env' };
  }

  try {
    const list = accountsToSync || (await getStoredAccounts());
    if (!list || list.length === 0) return { count: 0 };

    // Filter: only sync accounts that have a valid NIM and email
    const validAccounts = list.filter(
      (acc) => acc.nim && acc.email && acc.nim.trim() !== '' && acc.email.trim() !== ''
    );

    if (validAccounts.length === 0) return { count: 0 };

    console.log(`[Supabase Sync] Preparing ${validAccounts.length} accounts for sync...`);

    // Map to Supabase column format (omit 'id' — let DB generate via DEFAULT)
    const rows = validAccounts.map((acc) => ({
      nim: acc.nim.trim(),
      email: acc.email.trim().toLowerCase(),
      full_name: acc.fullName.trim(),
      role: mapRoleToSupabase(acc.role),
      avatar_url: acc.avatarUrl || null,
      total_green_coins: acc.totalGreenCoins || 0,
      total_sat_points: acc.totalSatPoints || 0,
      total_carbon_saved: acc.totalCarbonSaved || 0.0,
      streak_days: acc.streakDays || 1,
      created_at: acc.createdAt || new Date().toISOString(),
    }));

    // Batch upsert in chunks of 50 to avoid payload limits
    const BATCH_SIZE = 50;
    let totalSynced = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;

      console.log(`[Supabase Sync] Batch ${batchNum}: upserting ${batch.length} rows...`);

      const { data, error } = await supabase
        .from('users')
        .upsert(batch, { onConflict: 'nim' })
        .select();

      if (error) {
        console.error(`[Supabase Sync] Batch ${batchNum} error:`, error.code, error.message, error.details, error.hint);
        errors.push(`Batch ${batchNum}: ${error.message} (code: ${error.code})`);
      } else {
        const count = data?.length || batch.length;
        totalSynced += count;
        console.log(`[Supabase Sync] Batch ${batchNum}: ${count} rows synced successfully`);
      }
    }

    if (errors.length > 0) {
      const errorMsg = errors.join('\n');
      console.warn('[Supabase Sync] Completed with errors:\n', errorMsg);
      if (totalSynced === 0) {
        return { count: 0, error: errorMsg };
      }
      // Partial success
      return { count: totalSynced, error: `Sebagian berhasil (${totalSynced}/${rows.length}). Errors:\n${errorMsg}` };
    }

    console.log(`[Supabase Sync] All done! ${totalSynced} accounts synced.`);
    return { count: totalSynced };
  } catch (err: any) {
    console.error('[Supabase Sync] Fatal error:', err);
    return { count: 0, error: err.message };
  }
}
