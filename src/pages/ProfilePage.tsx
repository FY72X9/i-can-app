import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { useAppModeStore } from '@/stores/appModeStore';
import { getActions } from '@/services/actionService';
import { getNeutralAvatarUrl } from '@/services/authService';
import { uploadAvatarPhoto } from '@/services/storageService';
import { GreenAction } from '@/types';
import { 
  Award, 
  Flame, 
  ShieldCheck, 
  Trophy, 
  Leaf, 
  Coins, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap,
  LogOut,
  UserCheck,
  Clock,
  Calendar,
  CheckCheck,
  ChevronRight,
  History,
  AlertCircle,
  Globe2,
  FileDown,
  Settings,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Building2,
  Mail,
  Shield,
  LayoutDashboard,
  Check, 
  RefreshCw, 
  Sliders,
  Camera,
  UploadCloud
} from 'lucide-react';
import { downloadActionPdfReport } from '@/services/pdfReportService';

const FACULTIES = [
  'School of Computer Science',
  'School of Information Systems',
  'School of Design',
  'BINUS Business School',
  'Faculty of Engineering',
  'Faculty of Humanities',
  'Faculty of Digital Communication & Hotel & Tourism',
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginAs, logout, updateOwnProfile, changeOwnPassword } = useAuthStore();
  const { isDemoMode, isPrototypeMode } = useAppModeStore();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SETTINGS'>('OVERVIEW');
  const [userActivities, setUserActivities] = useState<GreenAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Form State
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editFaculty, setEditFaculty] = useState(user?.facultyName || 'School of Computer Science');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Avatar Photo Upload State
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadNote, setAvatarUploadNote] = useState<string | null>(null);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  const canAccessAdmin = isDemoMode() || user?.role === 'SUPERADMIN' || user?.role === 'ORGANIZER';

  useEffect(() => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditEmail(user.email || '');
      setEditFaculty(user.facultyName || (user.role === 'ORGANIZER' ? 'Student Service Office (SSO)' : 'School of Computer Science'));
      setEditAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadActivities() {
      setLoading(true);
      const allActions = await getActions();
      if (user?.role === 'ORGANIZER') {
        // If verifier, show actions verified by verifier or all actions
        const verified = allActions.filter((a) => a.verifiedBy?.includes(user.fullName.split(' ')[0]) || a.status === 'APPROVED');
        setUserActivities(verified);
      } else {
        // Filter by user ID or match user name
        const userSpecific = allActions.filter((a) => a.userId === user?.id || (user?.fullName && a.userName && a.userName.includes(user.fullName.split(' ')[0])));
        setUserActivities(userSpecific.length > 0 ? userSpecific : allActions.slice(0, 8));
      }
      setLoading(false);
    }
    loadActivities();
  }, [user?.id, user?.role, user?.fullName]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    if (!editFullName.trim()) {
      setProfileErrorMsg('Nama lengkap tidak boleh kosong');
      return;
    }

    setIsSavingProfile(true);
    const result = await updateOwnProfile({
      fullName: editFullName.trim(),
      email: editEmail.trim(),
      facultyName: editFaculty.trim(),
      avatarUrl: editAvatarUrl.trim()
    });
    setIsSavingProfile(false);

    if (result.error) {
      setProfileErrorMsg(result.error);
    } else {
      setProfileSuccessMsg('Profil berhasil diperbarui!');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg(null);
    setPasswordErrorMsg(null);

    if (!currentPassword) {
      setPasswordErrorMsg('Masukkan kata sandi saat ini');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErrorMsg('Kata sandi baru minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    setIsChangingPassword(true);
    const result = await changeOwnPassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (result.error) {
      setPasswordErrorMsg(result.error);
    } else {
      setPasswordSuccessMsg('Kata sandi berhasil diperbarui! Silakan gunakan sandi baru ini untuk login berikutnya.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(null), 5000);
    }
  };

  const handleApplyNeutralAvatar = () => {
    if (user) {
      const neutral = getNeutralAvatarUrl(editFullName || user.fullName, user.nim, user.role);
      setEditAvatarUrl(neutral);
      setAvatarUploadNote('Avatar direset ke inisial nama standar');
      setTimeout(() => setAvatarUploadNote(null), 3500);
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setProfileErrorMsg(null);
    setAvatarUploadNote(null);

    try {
      const res = await uploadAvatarPhoto(user?.nim || user?.id || 'user', file);
      setEditAvatarUrl(res.url);
      if (res.isCloud) {
        setAvatarUploadNote(`Foto berhasil diunggah ke Supabase Storage (${res.fileSizeKb} KB)`);
      } else {
        setAvatarUploadNote(`Foto berhasil dioptimasi lokal (${res.fileSizeKb} KB)`);
      }
      setTimeout(() => setAvatarUploadNote(null), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Gagal memproses foto avatar');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = '';
      }
    }
  };

  const badges = [
    { name: 'First Step Green', icon: Award, desc: 'Aksi pertama diunggah ke I-CAN', unlocked: true, level: 'Bronze', rarity: 'Common' },
    { name: 'Streak Champion', icon: Flame, desc: '5 hari aktif berturut-turut', unlocked: true, level: 'Gold', rarity: 'Rare' },
    { name: 'Carbon Hero', icon: Leaf, desc: 'Hemat akumulasi 10 kg CO2e', unlocked: true, level: 'Silver', rarity: 'Rare' },
    { name: 'TFI Tree Planter', icon: ShieldCheck, desc: 'Tanam 5 bibit pohon berbatang keras', unlocked: true, level: 'Gold', rarity: 'Epic' },
    { name: 'SAT Master', icon: Trophy, desc: 'Kumpulkan 50 SAT Points riil', unlocked: false, level: 'Platinum', rarity: 'Epic' },
    { name: 'BEKEN Finalist', icon: Sparkles, desc: 'Masuk Top 10% Leaderboard tahunan', unlocked: false, level: 'Diamond', rarity: 'Legendary' },
  ];

  const isStudent = user?.role === 'MAHASISWA' || !user?.role;
  const isOrganizer = user?.role === 'ORGANIZER';
  const isAdmin = user?.role === 'SUPERADMIN';

  return (
    <div className="space-y-5 sm:space-y-6 pb-8">
      {/* 1. Dynamic Role Identity Card */}
      <Card className="p-5 sm:p-6 bg-white space-y-4 text-center border-surface-border shadow-eco-card relative overflow-hidden">
        {/* Background decorative halo */}
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
          isAdmin ? 'bg-purple-500/20' : isOrganizer ? 'bg-amber-500/20' : 'bg-eco-neon/20'
        }`} />

        <div className="relative inline-block mx-auto z-10">
          <img
            src={user?.avatarUrl || getNeutralAvatarUrl(user?.fullName || 'User', user?.nim, user?.role)}
            alt={user?.fullName || "User Avatar"}
            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl object-cover mx-auto shadow-neon-glow ring-4 ${
              isAdmin ? 'ring-purple-400/70' : isOrganizer ? 'ring-amber-400/70' : 'ring-eco-neon/60'
            }`}
          />
          <span className={`absolute -bottom-1 -right-1 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full ring-2 ring-white shadow-xs ${
            isAdmin ? 'bg-purple-700' : isOrganizer ? 'bg-amber-600' : 'bg-eco-700'
          }`}>
            {user?.role || 'MAHASISWA'}
          </span>
        </div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-0.5 border"
            style={{
              backgroundColor: isAdmin ? '#f3e8ff' : isOrganizer ? '#fef3c7' : '#dcfce7',
              borderColor: isAdmin ? '#d8b4fe' : isOrganizer ? '#fcd34d' : '#86efac',
              color: isAdmin ? '#581c87' : isOrganizer ? '#78350f' : '#14532d',
            }}
          >
            {isAdmin ? <Shield className="w-3.5 h-3.5 text-purple-700" /> : isOrganizer ? <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> : <Zap className="w-3 h-3 fill-eco-900" />}
            {isAdmin ? 'Super Administrator' : isOrganizer ? 'Tim SSO & Verifikator Resmi' : 'Lv. 3 Eco-Ksatria'}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-text-primary">{user?.fullName || 'Budi Santoso'}</h2>
          <p className="text-xs sm:text-sm text-text-secondary font-mono">
            {isStudent ? `NIM: ${user?.nim || '2602158890'}` : `Binus Number: ${user?.nim || 'BN19800101'}`}
          </p>
          <p className="text-xs sm:text-sm font-bold text-eco-800 mt-0.5">{user?.facultyName || 'School of Computer Science'}</p>
          <p className="text-[11px] text-text-muted font-mono">{user?.email || 'user@binus.ac.id'}</p>
        </div>

        {/* Stats Row Bento (Adaptive by Role) */}
        {isStudent ? (
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-surface-border/60 relative z-10">
            <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
              <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">CO2e Hemat</span>
              <p className="text-sm sm:text-base font-black text-eco-800 font-mono">{user?.totalCarbonSaved ?? 0} kg</p>
            </div>

            <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
              <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Green Coins</span>
              <p className="text-sm sm:text-base font-black text-amber-800 font-mono">{user?.totalGreenCoins ?? 0} GC</p>
            </div>

            <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
              <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Total SAT</span>
              <p className="text-sm sm:text-base font-black text-blue-700 font-mono">{user?.totalSatPoints ?? 0} SAT</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-surface-border/60 relative z-10">
            <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
              <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Verifikasi</span>
              <p className="text-sm sm:text-base font-black text-emerald-800 font-mono">{userActivities.length} Aksi</p>
            </div>

            <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
              <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Akses Otoritas</span>
              <p className="text-xs sm:text-sm font-black text-purple-900 font-mono">{isAdmin ? 'Superadmin' : 'Organizer'}</p>
            </div>

            <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
              <span className="text-[9px] text-text-secondary uppercase font-bold block mb-0.5">Aktif</span>
              <p className="text-sm sm:text-base font-black text-blue-700 font-mono">{user?.streakDays ?? 1} Hari</p>
            </div>
          </div>
        )}

        {/* Quick Portal Navigation Links for Staff / Admin */}
        {(isOrganizer || isAdmin) && (
          <div className="pt-2 flex gap-2 justify-center">
            {isOrganizer && (
              <Link
                to="/verify"
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Portal Verifikasi</span>
              </Link>
            )}
            <Link
              to="/admin"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>AdminLTE Panel</span>
            </Link>
          </div>
        )}
      </Card>

      {/* 2. Primary Tab Switcher: [ Ringkasan Profil | Pengaturan Akun & Sandi ] */}
      <div className="flex bg-surface-subtle p-1 rounded-2xl border border-surface-border">
        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'OVERVIEW'
              ? 'bg-eco-700 text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Ringkasan Profil</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SETTINGS')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'SETTINGS'
              ? 'bg-eco-700 text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Pengaturan Akun & Sandi</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: PENGATURAN AKUN & SANDI (PROFILE & SECURITY SETTINGS) */}
      {/* ========================================================================= */}
      {activeTab === 'SETTINGS' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* A1. Edit Data Profil Card */}
          <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-card">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-eco-neon/20 text-eco-900 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4 text-eco-700" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary">Perbarui Informasi Profil</h3>
                  <p className="text-[10px] text-text-secondary">Nama, foto profil, dan data kontak akun Anda</p>
                </div>
              </div>
              <Badge variant="eco" size="sm" className="font-bold">
                {user?.role}
              </Badge>
            </div>

            {/* Success / Error Alerts for Profile Update */}
            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{profileSuccessMsg}</span>
              </div>
            )}
            {profileErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{profileErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Avatar Selector & Direct Storage Upload */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1.5">
                  Foto Profil Mahasiswa
                </label>
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-subtle border border-surface-border">
                  {/* Avatar Preview with Camera Quick Click */}
                  <div className="relative group shrink-0">
                    <img
                      src={editAvatarUrl || getNeutralAvatarUrl(editFullName || user?.fullName || 'User', user?.nim, user?.role)}
                      alt="Preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-eco-400 shadow-xs transition-transform group-hover:scale-105 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      title="Klik untuk upload foto baru"
                      className="absolute inset-0 bg-black/45 hover:bg-black/60 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <span className="text-[9px] font-black mt-0.5">Ubah</span>
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Action Controls: File Upload & Reset */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="px-3 py-1.5 rounded-xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isUploadingAvatar ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Foto</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleApplyNeutralAvatar}
                        disabled={isUploadingAvatar}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-surface-border text-text-secondary text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Gunakan avatar inisial nama resmi"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Inisial Nama</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                        className="text-[10px] text-eco-800 hover:underline font-bold ml-auto"
                      >
                        {showManualUrlInput ? 'Tutup URL' : 'Input URL'}
                      </button>
                    </div>

                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleAvatarFileSelect}
                      className="hidden"
                    />

                    {avatarUploadNote && (
                      <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{avatarUploadNote}</span>
                      </p>
                    )}

                    {showManualUrlInput && (
                      <div className="pt-1 animate-in fade-in duration-150">
                        <input
                          type="url"
                          value={editAvatarUrl}
                          onChange={(e) => setEditAvatarUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... atau URL foto"
                          className="w-full text-xs p-2 rounded-xl border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
                        />
                      </div>
                    )}

                    <p className="text-[10px] text-text-muted leading-tight">
                      Mendukung format JPG, PNG, atau WebP. Foto otomatis dikompres & disimpan ke <strong>Supabase Storage</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    required
                    minLength={3}
                    maxLength={100}
                    placeholder="Nama Lengkap sesuai akun BINUS"
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-bold"
                  />
                  <User className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Identitas Primer (NIM / BN - Read Only) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-text-secondary">
                    {isStudent ? 'NIM (Nomor Induk Mahasiswa)' : 'Binus Number (BN)'}
                  </label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3" /> Identitas Terkunci
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={user?.nim || ''}
                    disabled
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-surface-border bg-slate-100 text-slate-500 cursor-not-allowed font-mono font-bold"
                  />
                  <Shield className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-text-muted mt-1">
                  NIM/BN terikat secara permanen pada sistem registrasi & transkrip resmi BINUS.
                </p>
              </div>

              {/* Program Studi / Fakultas (Mahasiswa) ATAU Unit Kerja (SSO / Admin) */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  {isStudent ? 'Program Studi / Fakultas' : 'Unit Kerja / Departemen'}
                </label>
                <div className="relative">
                  {isStudent ? (
                    <select
                      value={editFaculty}
                      onChange={(e) => setEditFaculty(e.target.value)}
                      className="w-full text-xs p-2.5 pl-8 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-bold"
                    >
                      {FACULTIES.map((fac) => (
                        <option key={fac} value={fac}>
                          {fac}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editFaculty}
                      onChange={(e) => setEditFaculty(e.target.value)}
                      placeholder="Contoh: Student Service Office (SSO)"
                      className="w-full text-xs p-2.5 pl-8 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-bold"
                    />
                  )}
                  <Building2 className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email BINUS */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Alamat Email BINUS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    placeholder="nama@binus.ac.id"
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
                  />
                  <Mail className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSavingProfile}
                className="w-full text-xs font-black py-2.5 mt-2 flex items-center justify-center gap-1.5 shadow-eco-sm"
              >
                {isSavingProfile ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* A2. Keamanan & Ganti Kata Sandi Card */}
          <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-card">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary">Ganti Kata Sandi</h3>
                  <p className="text-[10px] text-text-secondary">Kelola keamanan akun dan pembaruan password</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                SHA-256
              </span>
            </div>

            {/* Success / Error Alerts for Password Change */}
            {passwordSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{passwordSuccessMsg}</span>
              </div>
            )}
            {passwordErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              {/* Kata Sandi Lama */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Masukkan kata sandi lama"
                    className="w-full text-xs p-2.5 pl-8 pr-9 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                  />
                  <Lock className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    className="w-full text-xs p-2.5 pl-8 pr-9 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                  />
                  <Check className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={isChangingPassword}
                className="w-full text-xs font-black py-2.5 mt-2 flex items-center justify-center gap-1.5"
              >
                {isChangingPassword ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memperbarui Sandi...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>Perbarui Kata Sandi</span>
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* A3. Informasi Akun & Privasi */}
          <Card className="p-4 bg-surface-subtle border-surface-border/80 space-y-2 text-left text-xs">
            <div className="flex items-center gap-2 font-black text-text-primary">
              <ShieldCheck className="w-4 h-4 text-eco-700" />
              <span>Detail Keamanan & Sesi Akun</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-text-secondary pt-1">
              <div>
                <span className="text-slate-400 block">ID Sistem:</span>
                <span className="font-mono font-bold text-slate-700 truncate block">{user?.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Peran (Role):</span>
                <span className="font-bold text-slate-700">{user?.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="font-bold text-emerald-700">Aktif & Terverifikasi</span>
              </div>
              <div>
                <span className="text-slate-400 block">Terdaftar Sejak:</span>
                <span className="font-mono text-slate-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '2026-06-01'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB B: RINGKASAN PROFIL (OVERVIEW - EXISTING EXPERIENCE) */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
          {/* 2. Badge Collection Grid with Rarity (For Mahasiswa) */}
          {isStudent && (
            <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider">Koleksi Rarity Badge</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Pencapaian Aksi Berkelanjutan Kampus</p>
                </div>
                <Badge variant="success" size="sm">
                  4 / 6 Terbuka
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={i}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-center space-y-2 transition-all relative overflow-hidden ${
                        badge.unlocked
                          ? 'bg-amber-50/50 border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-gold-glow'
                          : 'bg-slate-50 border-slate-200/60 opacity-60'
                      }`}
                    >
                      {!badge.unlocked && (
                        <div className="absolute top-2.5 right-2.5 text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        badge.rarity === 'Legendary' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        badge.rarity === 'Epic' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        badge.rarity === 'Rare' ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {badge.rarity}
                      </span>

                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto shadow-xs ${
                          badge.unlocked 
                            ? 'bg-gradient-to-tr from-amber-200 to-amber-100 text-amber-800 ring-2 ring-amber-300/60 shadow-xs' 
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-text-primary leading-snug">{badge.name}</h4>
                        <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 3. Riwayat Aktivitas / Log Verifikasi Terkini */}
          <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-eco-neon/20 text-eco-900 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider">
                    {user?.role === 'ORGANIZER' ? 'Log Verifikasi Terkini SSO' : 'Riwayat Aksi 2 Minggu Terakhir'}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {userActivities.length} Kegiatan Terdata di Sistem
                  </p>
                </div>
              </div>
              <Link
                to={user?.role === 'ORGANIZER' ? '/verify' : '/wallet'}
                className="text-xs font-black text-eco-800 hover:underline flex items-center gap-0.5"
              >
                Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {userActivities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-1">
                  <p className="text-xs font-bold">Belum ada riwayat aksi terekam.</p>
                </div>
              ) : (
                userActivities.map((act) => {
                  const isApprovedFull = act.decision === 'APPROVED_FULL';
                  const isCoinsOnly = act.decision === 'APPROVED_COINS_ONLY';
                  const isPending = act.status === 'PENDING';
                  const isRejected = act.status === 'REJECTED';

                  return (
                    <div
                      key={act.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-surface-subtle border border-surface-border/60 hover:border-eco-300 transition-all flex items-start gap-3.5"
                    >
                      {act.photoUrl ? (
                        <img
                          src={act.photoUrl}
                          alt={act.categoryName}
                          className="w-14 h-14 rounded-2xl object-cover ring-1 ring-surface-border shrink-0 mt-0.5"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-eco-neon/20 text-eco-900 flex items-center justify-center shrink-0 mt-0.5 font-black text-sm">
                          🌱
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-text-primary truncate">
                            {act.categoryName}
                          </h4>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                            isApprovedFull ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                            isCoinsOnly ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            isPending ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                            'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {isApprovedFull ? '+SAT & Coins' :
                             isCoinsOnly ? 'Coins Only' :
                             isPending ? 'Pending' : 'Ditolak'}
                          </span>
                        </div>

                        <p className="text-xs text-text-secondary line-clamp-2 italic leading-relaxed">
                          "{act.story}"
                        </p>

                        <div className="flex items-center justify-between text-xs text-text-muted pt-1 font-mono border-t border-slate-100/70">
                          <span className="flex items-center gap-1 text-eco-800 font-bold">
                            <Clock className="w-3 h-3" />
                            {new Date(act.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="font-bold text-slate-700">
                            {act.carbonImpactKg > 0 ? `-${act.carbonImpactKg} kg CO2e` : 'Survey Validated'}
                          </span>
                          <span className="font-black text-amber-800">
                            +{act.greenCoinsEarned} GC
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* 4. Eco-Volunteer Application Card (For Mahasiswa) */}
          {isStudent && (
            <Card variant="subtle" className="p-5 sm:p-6 border-eco-200/80 bg-gradient-to-r from-eco-50 via-emerald-50/70 to-teal-50/50 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-eco-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-text-primary">Gabung Jadi Eco-Volunteer Kampus</h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Dapatkan sertifikat resmi Teach For Indonesia (TFI) dan klaim jam pengabdian masyarakat.
                  </p>
                  <p className="mt-3 text-xs font-medium text-eco-800">
                    Pendaftaran volunteer dibuka tiap awal semester melalui Teach For Indonesia (TFI).
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 5. Logout Action Button */}
      <div className="pt-2">
        <Button
          variant="danger"
          size="sm"
          className="w-full text-xs sm:text-sm font-bold py-3.5 flex items-center justify-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-2xl"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun (Logout)
        </Button>
      </div>
    </div>
  );
};
