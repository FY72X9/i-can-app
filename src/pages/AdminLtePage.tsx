import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, DEMO_PROFILES } from '@/stores/authStore';
import { getActions, updateActionVerification } from '@/services/actionService';
import { getStoredAccounts } from '@/services/authService';
import { GreenAction, UserProfile, UserRole, CampusEvent, EventActivity, EventStatus } from '@/types';
import { getEvents, getEventsByOrganizer, createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Search, 
  Download, 
  Plus, 
  Check, 
  X, 
  ExternalLink, 
  ArrowLeft,
  RefreshCw,
  Award,
  AlertCircle,
  Database,
  Smartphone,
  Monitor,
  QrCode,
  Calendar,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  CalendarPlus,
  Image,
  ListOrdered,
  LogOut,
  Pencil,
  RotateCcw,
  UserX,
  Shield
} from 'lucide-react';

export const AdminLtePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginAs, updateUserStats } = useAuthStore();

  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'users' | 'actions' | 'grant' | 'sdg' | 'events'>('dashboard');
  const [actionsList, setActionsList] = useState<GreenAction[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isWideView, setIsWideView] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Manual Grant Modal
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<string>('usr-student-001');
  const [grantSatAmount, setGrantSatAmount] = useState<number>(4);
  const [grantCoinsAmount, setGrantCoinsAmount] = useState<number>(25);
  const [grantReason, setGrantReason] = useState<string>('Pemberian SAT Manual oleh SSO');
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);

  // Event Management State
  const [eventsList, setEventsList] = useState<CampusEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [userFormError, setUserFormError] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    nim: '',
    fullName: '',
    email: '',
    password: '',
    role: 'MAHASISWA' as UserRole,
    facultyName: 'School of Computer Science'
  });

  // Edit User Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState({
    nim: '',
    fullName: '',
    email: '',
    facultyName: '',
    role: 'MAHASISWA' as UserRole,
    newPassword: '',
  });
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Status filter for user list
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    activities: [{ name: '', description: '', coinsReward: 10 }] as Array<{ name: string; description: string; coinsReward: number }>,
  });
  const [showQrModal, setShowQrModal] = useState<{ eventTitle: string; activity: EventActivity } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const actions = await getActions();
    setActionsList(actions);

    const accounts = await getStoredAccounts();
    if (accounts && accounts.length > 0) {
      setUsersList(accounts);
    } else {
      setUsersList(Object.values(DEMO_PROFILES));
    }

    // Load events (RBAC filtered)
    if (user?.role === 'SUPERADMIN') {
      const allEvents = await getEvents();
      setEventsList(allEvents);
    } else if (user?.role === 'ORGANIZER' && user?.id) {
      const myEvents = await getEventsByOrganizer(user.id);
      setEventsList(myEvents);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await useAuthStore.getState().updateUserRole(userId, newRole);
    await loadData();
    alert(`Role berhasil diperbarui menjadi ${newRole}`);
  };

  const handleAdminVerify = async (actionId: string, decision: 'APPROVED_FULL' | 'APPROVED_COINS_ONLY' | 'REJECTED') => {
    await updateActionVerification(
      actionId, 
      decision, 
      'usr-admin-005', 
      'Hendra Kusuma (SSO Super Admin)', 
      'Diverifikasi langsung oleh Super Admin SSO'
    );
    await loadData();
    alert(`Status aksi ${actionId} berhasil diperbarui.`);
  };

  const handleManualGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = usersList.find((u) => u.id === selectedUserForGrant);
    if (!targetUser) return;

    const updatedUsers = usersList.map((u) => {
      if (u.id === selectedUserForGrant) {
        return {
          ...u,
          totalSatPoints: (u.totalSatPoints || 0) + Number(grantSatAmount),
          totalGreenCoins: (u.totalGreenCoins || 0) + Number(grantCoinsAmount),
        };
      }
      return u;
    });

    setUsersList(updatedUsers);

    // Update in local accounts
    const raw = localStorage.getItem('i_can_registered_accounts');
    if (raw) {
      try {
        const stored = JSON.parse(raw);
        const next = stored.map((acc: any) =>
          acc.id === selectedUserForGrant
            ? {
                ...acc,
                totalSatPoints: (acc.totalSatPoints || 0) + Number(grantSatAmount),
                totalGreenCoins: (acc.totalGreenCoins || 0) + Number(grantCoinsAmount),
              }
            : acc
        );
        localStorage.setItem('i_can_registered_accounts', JSON.stringify(next));
      } catch {}
    }

    if (user?.id === selectedUserForGrant) {
      updateUserStats({
        satPoints: Number(grantSatAmount),
        greenCoins: Number(grantCoinsAmount),
      });
    }

    setGrantSuccessMsg(`Sukses menambahkan +${grantSatAmount} SAT dan +${grantCoinsAmount} GC ke ${targetUser.fullName}`);
    setTimeout(() => setGrantSuccessMsg(null), 3500);
  };

  const handleExportJson = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      system: 'I-CAN Super Admin Platform (AdminLTE)',
      institution: 'BINUS University - Student Service Office',
      usersCount: usersList.length,
      actionsCount: actionsList.length,
      users: usersList,
      actions: actionsList,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `i-can-sso-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);

    const identifierLabel = userFormData.role === 'MAHASISWA' ? 'NIM' : 'Binus Number (BN)';

    if (!userFormData.nim.trim()) {
      setUserFormError(`${identifierLabel} wajib diisi.`);
      return;
    }

    if (!userFormData.fullName.trim() || !userFormData.email.trim() || !userFormData.password) {
      setUserFormError('Semua kolom formulir wajib diisi.');
      return;
    }

    if (!userFormData.email.includes('@')) {
      setUserFormError('Format alamat email tidak valid.');
      return;
    }

    if (userFormData.password.length < 6) {
      setUserFormError('Kata sandi awal minimal 6 karakter.');
      return;
    }

    setIsCreatingUser(true);
    try {
      const result = await useAuthStore.getState().createUserAccount({
        nim: userFormData.nim.trim(),
        fullName: userFormData.fullName.trim(),
        email: userFormData.email.trim(),
        facultyName: userFormData.facultyName || 'School of Computer Science',
        password: userFormData.password,
        role: userFormData.role,
      });

      if (result.error) {
        setUserFormError(result.error);
        setIsCreatingUser(false);
      } else {
        alert(`Pengguna ${userFormData.fullName} (${userFormData.role}) dengan ${identifierLabel} ${userFormData.nim} berhasil ditambahkan!`);
        setShowUserForm(false);
        setUserFormData({
          nim: '',
          fullName: '',
          email: '',
          password: '',
          role: 'MAHASISWA' as UserRole,
          facultyName: 'School of Computer Science',
        });
        setUserFormError(null);
        setIsCreatingUser(false);
        await loadData();
      }
    } catch (err: any) {
      setUserFormError(err?.message || 'Terjadi kesalahan sistem saat membuat akun');
      setIsCreatingUser(false);
    }
  };

  // Real-time NIM/BN input sanitizer
  const sanitizeNimInput = (value: string, role: UserRole): string => {
    if (role === 'MAHASISWA') {
      // Only digits, max 10
      return value.replace(/\D/g, '').slice(0, 10);
    } else {
      // Staff BN format: ensure BN prefix + digits only, max 11 total
      let clean = value.toUpperCase();
      if (!clean.startsWith('BN')) {
        // Auto-prefix BN if user types digits directly
        const digits = clean.replace(/\D/g, '');
        clean = 'BN' + digits;
      } else {
        // Keep BN prefix, strip non-digits after it
        const afterBN = clean.slice(2).replace(/\D/g, '');
        clean = 'BN' + afterBN;
      }
      return clean.slice(0, 11); // BN + max 9 digits
    }
  };

  // Open Edit Modal with pre-filled data
  const handleOpenEditModal = (targetUser: UserProfile) => {
    setEditingUser(targetUser);
    setEditFormData({
      nim: targetUser.nim || '',
      fullName: targetUser.fullName || '',
      email: targetUser.email || '',
      facultyName: targetUser.facultyName || '',
      role: targetUser.role,
      newPassword: '',
    });
    setEditFormError(null);
    setShowEditPassword(false);
    setShowEditModal(true);
  };

  // Edit user form submit
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditFormError(null);

    if (!editFormData.fullName.trim() || !editFormData.nim.trim() || !editFormData.email.trim()) {
      setEditFormError('Nama, NIM/BN, dan Email wajib diisi.');
      return;
    }

    if (!editFormData.email.includes('@')) {
      setEditFormError('Format alamat email tidak valid.');
      return;
    }

    if (editFormData.newPassword && editFormData.newPassword.length < 6) {
      setEditFormError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setIsEditingUser(true);
    try {
      const result = await useAuthStore.getState().editUserAccount(editingUser.id, {
        fullName: editFormData.fullName.trim(),
        nim: editFormData.nim.trim(),
        email: editFormData.email.trim(),
        facultyName: editFormData.facultyName,
        role: editFormData.role,
        newPassword: editFormData.newPassword || undefined,
      });

      if (result.error) {
        setEditFormError(result.error);
      } else {
        alert(`Data pengguna ${editFormData.fullName} berhasil diperbarui.`);
        setShowEditModal(false);
        setEditingUser(null);
        await loadData();
      }
    } catch (err: any) {
      setEditFormError(err?.message || 'Terjadi kesalahan saat memperbarui akun');
    }
    setIsEditingUser(false);
  };

  // Soft delete (deactivate) user
  const handleSoftDelete = async (targetUser: UserProfile) => {
    if (!confirm(`Yakin ingin menonaktifkan akun "${targetUser.fullName}"?\n\nAkun yang dinonaktifkan tidak dapat login, namun datanya tetap tersimpan.`)) return;
    const result = await useAuthStore.getState().softDeleteUserAccount(targetUser.id);
    if (result.error) {
      alert(`Gagal: ${result.error}`);
    } else {
      alert(`Akun "${targetUser.fullName}" berhasil dinonaktifkan.`);
      await loadData();
    }
  };

  // Restore (reactivate) user
  const handleRestore = async (targetUser: UserProfile) => {
    if (!confirm(`Yakin ingin mengaktifkan kembali akun "${targetUser.fullName}"?`)) return;
    const result = await useAuthStore.getState().restoreUserAccount(targetUser.id);
    if (result.error) {
      alert(`Gagal: ${result.error}`);
    } else {
      alert(`Akun "${targetUser.fullName}" berhasil dipulihkan dan aktif kembali.`);
      await loadData();
    }
  };

  const handleEventFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventPayload = {
      organizerId: user?.id || 'usr-organizer-002',
      organizerName: user?.fullName || 'Penyelenggara',
      title: eventFormData.title,
      description: eventFormData.description,
      bannerUrl: eventFormData.bannerUrl,
      startDate: new Date(eventFormData.startDate).toISOString(),
      endDate: new Date(eventFormData.endDate).toISOString(),
      status: 'ACTIVE' as EventStatus,
      activities: eventFormData.activities.map((act, idx) => ({
        id: '',
        eventId: '',
        name: act.name,
        description: act.description,
        qrCodeValue: `ican-evt-${Date.now().toString(36)}-act${idx + 1}`,
        coinsReward: act.coinsReward,
        order: idx,
      })),
    };

    if (editingEvent) {
      await updateEvent(editingEvent.id, eventPayload);
      alert('Event berhasil diperbarui!');
    } else {
      await createEvent(eventPayload);
      alert('Event baru berhasil dibuat!');
    }

    setShowEventForm(false);
    setEditingEvent(null);
    setEventFormData({
      title: '',
      description: '',
      bannerUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      activities: [{ name: '', description: '', coinsReward: 10 }],
    });
    await loadData();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Yakin ingin menghapus event ini?')) return;
    await deleteEvent(eventId);
    alert('Event berhasil dihapus.');
    await loadData();
  };

  const handleEditEvent = (event: CampusEvent) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description,
      bannerUrl: event.bannerUrl,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      activities: event.activities.map((a) => ({ name: a.name, description: a.description, coinsReward: a.coinsReward })),
    });
    setShowEventForm(true);
  };

  const addActivityField = () => {
    setEventFormData((prev) => ({
      ...prev,
      activities: [...prev.activities, { name: '', description: '', coinsReward: 10 }],
    }));
  };

  const updateActivityField = (idx: number, field: string, value: string | number) => {
    setEventFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((a, i) => (i === idx ? { ...a, [field]: value } : a)),
    }));
  };

  const removeActivityField = (idx: number) => {
    setEventFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== idx),
    }));
  };

  // KPIs
  const totalUsers = usersList.length;
  const verifiedActions = actionsList.filter((a) => a.status === 'APPROVED').length;
  const totalSatAwarded = actionsList.reduce((acc, a) => {
    if (a.status === 'APPROVED' && a.decision === 'APPROVED_FULL') {
      return acc + (a.satPointsEarned || 0);
    }
    return acc;
  }, 0);
  const totalCo2Saved = actionsList.reduce((acc, a) => {
    if (a.status === 'APPROVED') {
      return acc + (a.carbonImpactKg || 0);
    }
    return acc;
  }, 0).toFixed(1);

  // Filtered Users List based on Search Term and Status Filter
  const filteredUsersList = usersList.filter((u) => {
    // Status filter
    if (statusFilter === 'active' && u.isDeleted) return false;
    if (statusFilter === 'inactive' && !u.isDeleted) return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(s) ||
      u.nim?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.facultyName?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s)
    );
  });

  // Count active superadmins for guardrail logic
  const activeSuperadminsCount = usersList.filter((u) => u.role === 'SUPERADMIN' && !u.isDeleted).length;

  return (
    <div className={`min-h-screen bg-[#f4f6f9] font-sans ${isWideView ? 'w-full' : 'max-w-[414px] mx-auto shadow-2xl relative'}`}>
      {/* 1. AdminLTE Inspired Header Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-xs ${user?.role === 'SUPERADMIN' ? 'bg-[#007bff]' : 'bg-amber-600'}`}>
              LTE
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight block">
                BINUS I-CAN • {user?.role === 'SUPERADMIN' ? 'Super Admin SSO Platform' : 'Event Organizer Portal'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold block">
                {user?.fullName} ({user?.facultyName || 'BINUS University'})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <button
            onClick={() => setIsWideView(!isWideView)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
            title={isWideView ? 'Mode Frame Smartphone' : 'Mode Fullscreen Desktop'}
          >
            {isWideView ? <Smartphone className="w-4 h-4 text-emerald-600" /> : <Monitor className="w-4 h-4 text-blue-600" />}
            <span className="hidden sm:inline text-[11px]">{isWideView ? 'Mobile Frame' : 'Fullscreen'}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportJson}
            className="px-2.5 py-1.5 rounded-lg bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export myBINUS</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              navigate('/login');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            title="Keluar dari sesi akun"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main AdminLTE Layout Grid (Sidebar + Content Body) */}
      <div className="flex flex-col md:flex-row min-h-[580px]">
        {/* Dark Navy AdminLTE Sidebar */}
        <aside className="w-full md:w-56 bg-[#343a40] text-[#c2c7d0] p-3 shrink-0 space-y-4">
          {/* User Profile Bar */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#4f5962]">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"}
              alt={user?.fullName || "User"}
              className={`w-9 h-9 rounded-full object-cover ring-2 ${user?.role === 'SUPERADMIN' ? 'ring-[#007bff]' : 'ring-amber-500'}`}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'User Online'}</h4>
              <p className={`text-[10px] flex items-center gap-1 font-bold ${user?.role === 'SUPERADMIN' ? 'text-[#28a745]' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-ping ${user?.role === 'SUPERADMIN' ? 'bg-[#28a745]' : 'bg-amber-400'}`} />
                {user?.role === 'SUPERADMIN' ? 'Super Admin Online' : 'Organizer Online'}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeMenu === 'dashboard' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Utama</span>
            </button>

            {user?.role === 'SUPERADMIN' && (
              <button
                onClick={() => setActiveMenu('users')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                  activeMenu === 'users' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Manajemen Akun</span>
                </div>
                <span className="bg-[#17a2b8] text-white text-[9px] px-1.5 py-0.2 rounded-full">{usersList.length}</span>
              </button>
            )}

            <button
              onClick={() => setActiveMenu('actions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeMenu === 'actions' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4" />
                <span>Log Verifikasi Aksi</span>
              </div>
              <span className="bg-[#ffc107] text-slate-900 text-[9px] px-1.5 py-0.2 rounded-full font-black">
                {actionsList.filter((a) => a.status === 'PENDING').length}
              </span>
            </button>

            {user?.role === 'SUPERADMIN' && (
              <button
                onClick={() => setActiveMenu('grant')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeMenu === 'grant' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Manual SAT Grant</span>
              </button>
            )}

            <button
              onClick={() => setActiveMenu('events')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeMenu === 'events' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Manajemen Event</span>
              </div>
              <span className="bg-[#28a745] text-white text-[9px] px-1.5 py-0.2 rounded-full">{eventsList.length}</span>
            </button>

            <button
              onClick={() => setActiveMenu('sdg')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeMenu === 'sdg' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analitik SDG Kampus</span>
            </button>

            <div className="pt-4 mt-4 border-t border-[#4f5962]">
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-900/30 hover:text-rose-300 transition-colors text-left font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-5 sm:p-6 space-y-6 overflow-x-auto">
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-base sm:text-xl font-black text-slate-800">
                {activeMenu === 'dashboard' && 'Dashboard Overview (SSO & TFI)'}
                {activeMenu === 'users' && 'Manajemen Pengguna & Pengaturan Role'}
                {activeMenu === 'actions' && 'Log & Validasi Aksi Nyata Mahasiswa'}
                {activeMenu === 'grant' && 'Pemberian Poin SAT & Jam Comserv Manual'}
                {activeMenu === 'sdg' && 'Metrik & Dampak Berkelanjutan SDG Kampus'}
                {activeMenu === 'events' && 'Manajemen Event Kampus & QR Pos'}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Panel Administrasi Terpusat • BINUS University
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl">
              Session: {user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Organizer'}
            </span>
          </div>

          {/* 3. Small KPI Boxes (Classic AdminLTE Style) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Box 1: Total Users (bg-info #17a2b8) */}
            <div className="bg-[#17a2b8] text-white p-4 sm:p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black">{totalUsers}</div>
                <p className="text-xs font-bold text-cyan-100 mt-0.5">Mahasiswa & Staff</p>
              </div>
              <Users className="w-12 h-12 text-white/20 absolute right-2 bottom-2" />
            </div>

            {/* Box 2: Verified Actions (bg-success #28a745) */}
            <div className="bg-[#28a745] text-white p-4 sm:p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black">{verifiedActions} Aksi</div>
                <p className="text-xs font-bold text-emerald-100 mt-0.5">Disetujui Resmi TFI</p>
              </div>
              <CheckSquare className="w-12 h-12 text-white/20 absolute right-2 bottom-2" />
            </div>

            {/* Box 3: SAT Distributed (bg-warning #ffc107) */}
            <div className="bg-[#ffc107] text-[#1f2d3d] p-4 sm:p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black">{totalSatAwarded} SAT</div>
                <p className="text-xs font-bold text-amber-900 mt-0.5">Poin SAT Transkrip</p>
              </div>
              <GraduationCap className="w-12 h-12 text-black/15 absolute right-2 bottom-2" />
            </div>

            {/* Box 4: Carbon Reduced (bg-danger #dc3545) */}
            <div className="bg-[#dc3545] text-white p-4 sm:p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black">{totalCo2Saved} kg</div>
                <p className="text-xs font-bold text-rose-100 mt-0.5">Emisi CO2e Ditekan</p>
              </div>
              <Award className="w-12 h-12 text-white/20 absolute right-2 bottom-2" />
            </div>
          </div>

          {/* 4. Tab Content: Dashboard & Table 1: Manajemen Akun */}
          {(activeMenu === 'users' || (activeMenu === 'dashboard' && user?.role === 'SUPERADMIN')) && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#007bff]" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-800">
                    Daftar Akun & Manajemen Hak Akses (Role)
                  </h3>
                  <span className="text-xs text-slate-500 font-bold hidden sm:inline ml-1">
                    ({filteredUsersList.length} Akun)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, NIM/BN, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff] w-48 sm:w-60"
                    />
                  </div>
                  {user?.role === 'SUPERADMIN' && (
                    <button
                      onClick={() => {
                        setShowUserForm(true);
                        setUserFormError(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                      title="Tambah Pengguna Baru (Khusus Superadmin)"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Tambah Pengguna</span>
                    </button>
                  )}
              </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5">
                {([
                  { key: 'all' as const, label: 'Semua', count: usersList.length },
                  { key: 'active' as const, label: 'Aktif', count: usersList.filter(u => !u.isDeleted).length },
                  { key: 'inactive' as const, label: 'Nonaktif', count: usersList.filter(u => u.isDeleted).length },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === tab.key
                        ? tab.key === 'inactive'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : tab.key === 'active'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#007bff] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-black">NIM / BN</th>
                      <th className="p-3 font-black">Nama Lengkap</th>
                      <th className="p-3 font-black">Fakultas / Unit</th>
                      <th className="p-3 font-black">Green Coins</th>
                      <th className="p-3 font-black">Poin SAT</th>
                      <th className="p-3 font-black">Role</th>
                      <th className="p-3 font-black">Status</th>
                      <th className="p-3 font-black">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsersList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <p className="text-xs font-bold text-slate-500">Tidak ada akun yang sesuai dengan filter</p>
                          {searchTerm && <p className="text-[11px] text-slate-400 mt-0.5">Kata kunci: "{searchTerm}"</p>}
                        </td>
                      </tr>
                    ) : (
                      filteredUsersList.map((u) => {
                        const isDeactivated = u.isDeleted === true;
                        const isSelf = user?.id === u.id;
                        const isLastSuperadmin = u.role === 'SUPERADMIN' && activeSuperadminsCount <= 1;
                        const canDeactivate = user?.role === 'SUPERADMIN' && !isSelf && !isLastSuperadmin && !isDeactivated;
                        const canRestore = user?.role === 'SUPERADMIN' && isDeactivated;

                        return (
                          <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${isDeactivated ? 'opacity-60' : ''}`}>
                            <td className="p-3 font-mono text-xs text-slate-600 font-semibold">{u.nim}</td>
                            <td className="p-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2.5">
                                <img src={u.avatarUrl} alt={u.fullName} className="w-7 h-7 rounded-full object-cover" />
                                <div>
                                  <span className="block">{u.fullName}</span>
                                  <span className="block text-[10px] font-medium text-slate-400">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-slate-600 text-xs">{u.facultyName}</td>
                            <td className="p-3 font-bold text-amber-700 font-mono text-xs">{u.totalGreenCoins || 0} GC</td>
                            <td className="p-3 font-bold text-blue-700 font-mono text-xs">{u.totalSatPoints || 0} SAT</td>
                            <td className="p-3">
                              <span className={`text-xs font-bold py-1 px-2.5 rounded-xl ${
                                u.role === 'SUPERADMIN'
                                  ? 'bg-purple-100 text-purple-900'
                                  : u.role === 'ORGANIZER'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">
                              {isDeactivated ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold py-1 px-2.5 rounded-xl bg-rose-100 text-rose-700">
                                  <UserX className="w-3 h-3" /> Nonaktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold py-1 px-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                                  <Shield className="w-3 h-3" /> Aktif
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                {user?.role === 'SUPERADMIN' && (
                                  <>
                                    {/* Edit Button */}
                                    <button
                                      onClick={() => handleOpenEditModal(u)}
                                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                      title="Edit Pengguna"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Deactivate / Restore Button */}
                                    {isDeactivated ? (
                                      <button
                                        onClick={() => handleRestore(u)}
                                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                                        title="Pulihkan / Aktifkan Kembali"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleSoftDelete(u)}
                                        disabled={!canDeactivate}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                          canDeactivate
                                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                        }`}
                                        title={
                                          isSelf
                                            ? 'Tidak dapat menonaktifkan akun sendiri'
                                            : isLastSuperadmin
                                            ? 'Tidak dapat menonaktifkan Superadmin terakhir'
                                            : 'Nonaktifkan Akun'
                                        }
                                      >
                                        <UserX className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </>
                                )}
                                {/* Login As Button */}
                                <button
                                  onClick={async () => {
                                    await loginAs(u.id);
                                    alert(`Beralih simulasi login sebagai ${u.fullName}`);
                                  }}
                                  disabled={isDeactivated}
                                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                                    isDeactivated
                                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                      : 'bg-slate-200 hover:bg-[#007bff] hover:text-white'
                                  }`}
                                >
                                  Login As
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Tab Content: Table 2: Log Verifikasi Aksi */}
          {(activeMenu === 'dashboard' || activeMenu === 'actions') && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#28a745]" />
                  Log Pengajuan Aksi & Keputusan SSO
                </h3>
                <span className="text-xs text-slate-500 font-bold">{actionsList.length} Total Pengajuan</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-black">Mahasiswa</th>
                      <th className="p-3 font-black">Kategori Aksi</th>
                      <th className="p-3 font-black">Tipe Program</th>
                      <th className="p-3 font-black">Potensi SAT</th>
                      <th className="p-3 font-black">AI Score</th>
                      <th className="p-3 font-black">Status</th>
                      <th className="p-3 font-black">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {actionsList.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{act.userName}</td>
                        <td className="p-3 text-slate-700 font-medium">{act.categoryName}</td>
                        <td className="p-3 text-xs text-slate-500 font-mono">{act.submissionType}</td>
                        <td className="p-3 font-bold text-blue-700 font-mono text-xs">+{act.satPointsEarned} SAT</td>
                        <td className="p-3 font-bold text-emerald-700 font-mono text-xs">
                          {Math.round((act.aiConfidence || 0.9) * 100)}%
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-black ${
                              act.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-900'
                                : act.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {act.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdminVerify(act.id, 'APPROVED_FULL')}
                              className="px-2.5 py-1 bg-[#28a745] hover:bg-[#218838] text-white rounded-lg text-xs font-bold transition-colors"
                              title="Approve Full SAT + Coins"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAdminVerify(act.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-lg text-xs font-bold transition-colors"
                              title="Tolak Aksi"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Tab Content: Manual SAT Grant Tool */}
          {activeMenu === 'grant' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 max-w-lg space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <GraduationCap className="w-5 h-5 text-[#007bff]" />
                <h3 className="text-sm sm:text-base font-black">Direct Manual SAT & Coins Granting</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Fitur khusus SSO untuk memberikan Poin SAT atau Green Coins langsung kepada mahasiswa (misalnya pemenang kompetisi lingkungan khusus atau aksi di luar jadwal).
              </p>

              {grantSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{grantSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleManualGrantSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Pilih Mahasiswa Penerima</label>
                  <select
                    value={selectedUserForGrant}
                    onChange={(e) => setSelectedUserForGrant(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                  >
                    {usersList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.nim}) - {u.facultyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Jumlah Poin SAT</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={grantSatAmount}
                      onChange={(e) => setGrantSatAmount(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Jumlah Green Coins</label>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={grantCoinsAmount}
                      onChange={(e) => setGrantCoinsAmount(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Keterangan / Alasan Resmi SSO</label>
                  <input
                    type="text"
                    value={grantReason}
                    onChange={(e) => setGrantReason(e.target.value)}
                    placeholder="Contoh: Juara 1 Lomba Inovasi Biopori Kampus"
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-2xl text-xs sm:text-sm font-black shadow-xs transition-colors"
                >
                  Eksekusi Pemberian Poin SAT →
                </button>
              </form>
            </div>
          )}

          {/* 7. Tab Content: SDG Analytics */}
          {activeMenu === 'sdg' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">Monitoring Target UN SDG BINUS University</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Agregasi capaian program keberlanjutan kampus semester aktif 2026</p>
                </div>
                <Link
                  to="/sdg-guideline"
                  className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Buka Panduan & Matriks SDG Lengkap →</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-xs sm:text-sm font-black text-emerald-800 block">SDG 15: Life on Land</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">1,420 Pohon</div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full w-[71%]" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold">71% dari target 2,000 pohon tahun 2026</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-xs sm:text-sm font-black text-cyan-800 block">SDG 6: Clean Water</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">890 Biopori</div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-cyan-500 h-2.5 rounded-full w-[89%]" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold">89% dari target 1,000 lubang biopori</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-xs sm:text-sm font-black text-purple-800 block">SDG 4: Quality Education</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">340 Video VBL</div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full w-[68%]" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold">68% terverifikasi berstandar APA Style</p>
                </div>
              </div>
            </div>
          )}

          {/* 8. Tab Content: Event Management & QR Pos */}
          {activeMenu === 'events' && (
            <div className="space-y-4">
              {/* Create Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#007bff]" />
                  Daftar Event Kampus
                </h3>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setEventFormData({
                      title: '',
                      description: '',
                      bannerUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                      activities: [{ name: '', description: '', coinsReward: 10 }],
                    });
                    setShowEventForm(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Event Baru
                </button>
              </div>

              {showUserForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Tambah Pengguna Baru
              </h3>
              <button onClick={() => setShowUserForm(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 overflow-y-auto">
              <form id="userForm" onSubmit={handleUserFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">NIM / NIP / ID</label>
                  <input type="text" required value={userFormData.nim} onChange={e => setUserFormData({...userFormData, nim: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                  <input type="text" required value={userFormData.fullName} onChange={e => setUserFormData({...userFormData, fullName: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input type="email" required value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                  <input type="password" required minLength={6} value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Fakultas / Departemen</label>
                  <input type="text" required value={userFormData.facultyName} onChange={e => setUserFormData({...userFormData, facultyName: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role / Hak Akses</label>
                  <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as UserRole})} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold">
                    <option value="MAHASISWA">MAHASISWA</option>
                    <option value="ORGANIZER">ORGANIZER (Penyelenggara)</option>
                    <option value="SUPERADMIN">SUPERADMIN (SSO)</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowUserForm(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">Batal</button>
              <button form="userForm" type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors">Buat Akun</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Event Form */}
              {showEventForm && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                  <h4 className="text-sm font-black text-slate-800">
                    {editingEvent ? 'Edit Event' : 'Buat Event Baru'}
                  </h4>
                  <form onSubmit={handleEventFormSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Event</label>
                      <input
                        type="text"
                        value={eventFormData.title}
                        onChange={(e) => setEventFormData((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Contoh: Waste for Change BINUS"
                        className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Deskripsi</label>
                      <textarea
                        value={eventFormData.description}
                        onChange={(e) => setEventFormData((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Deskripsi event kampanye hijau..."
                        rows={3}
                        className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">URL Banner</label>
                      <input
                        type="url"
                        value={eventFormData.bannerUrl}
                        onChange={(e) => setEventFormData((p) => ({ ...p, bannerUrl: e.target.value }))}
                        className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Tanggal Mulai</label>
                        <input
                          type="date"
                          value={eventFormData.startDate}
                          onChange={(e) => setEventFormData((p) => ({ ...p, startDate: e.target.value }))}
                          className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Tanggal Selesai</label>
                        <input
                          type="date"
                          value={eventFormData.endDate}
                          onChange={(e) => setEventFormData((p) => ({ ...p, endDate: e.target.value }))}
                          className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Pos Aktivitas / Station</label>
                        <button
                          type="button"
                          onClick={addActivityField}
                          className="text-xs font-bold text-[#007bff] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Tambah Pos
                        </button>
                      </div>
                      {eventFormData.activities.map((act, idx) => (
                        <div key={idx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder={`Nama Pos ${idx + 1}`}
                              value={act.name}
                              onChange={(e) => updateActivityField(idx, 'name', e.target.value)}
                              className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Deskripsi singkat"
                              value={act.description}
                              onChange={(e) => updateActivityField(idx, 'description', e.target.value)}
                              className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Reward:</span>
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={act.coinsReward}
                                onChange={(e) => updateActivityField(idx, 'coinsReward', Number(e.target.value))}
                                className="w-20 text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none font-mono"
                              />
                              <span className="text-xs text-amber-700 font-bold">GC</span>
                            </div>
                          </div>
                          {eventFormData.activities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeActivityField(idx)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-2xl text-xs font-black shadow-xs transition-colors"
                      >
                        {editingEvent ? 'Perbarui Event' : 'Buat Event →'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Events List */}
              {eventsList.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center space-y-2">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">Belum ada event.</p>
                  <p className="text-xs text-slate-500">Klik tombol "Buat Event Baru" untuk memulai.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsList.map((evt) => (
                    <div key={evt.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="flex gap-4 p-4">
                        {evt.bannerUrl && (
                          <img src={evt.bannerUrl} alt={evt.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        )}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{evt.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              evt.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900' : evt.status === 'DRAFT' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {evt.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{evt.description}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {new Date(evt.startDate).toLocaleDateString('id-ID')} — {new Date(evt.endDate).toLocaleDateString('id-ID')} • {evt.activities.length} Pos
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditEvent(evt)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#007bff] hover:text-white text-xs font-bold transition-colors"
                          >
                            Edit
                          </button>
                          {(user?.role === 'SUPERADMIN' || user?.id === evt.organizerId) && (
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-500 hover:text-white text-rose-700 text-xs font-bold transition-colors"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Activities QR Section */}
                      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Pos Aktivitas & QR Code</p>
                        <div className="flex flex-wrap gap-2">
                          {evt.activities.map((act) => (
                            <button
                              key={act.id}
                              onClick={() => setShowQrModal({ eventTitle: evt.title, activity: act })}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#007bff] hover:bg-blue-50 text-xs font-bold text-slate-700 transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5 text-[#007bff]" />
                              {act.name} (+{act.coinsReward} GC)
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* QR Code Modal */}
              {showQrModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowQrModal(null)}>
                  <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-800">QR Code Pos Aktivitas</h4>
                      <button onClick={() => setShowQrModal(null)} className="p-1 rounded-lg hover:bg-slate-100">
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2">
                        <QrCode className="w-16 h-16 text-[#007bff]" />
                        <p className="text-[10px] font-mono text-slate-500 px-2 break-all">{showQrModal.activity.qrCodeValue}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{showQrModal.eventTitle}</p>
                        <p className="text-xs text-slate-600 font-bold">{showQrModal.activity.name}</p>
                        <p className="text-xs text-amber-700 font-bold mt-1">+{showQrModal.activity.coinsReward} Green Coins</p>
                      </div>
                      <button
                        onClick={() => {
                          const qrText = `QR: ${showQrModal.activity.qrCodeValue}\nEvent: ${showQrModal.eventTitle}\nPos: ${showQrModal.activity.name}\nReward: +${showQrModal.activity.coinsReward} GC`;
                          navigator.clipboard?.writeText(qrText).then(() => alert('QR info disalin ke clipboard!'));
                        }}
                        className="w-full py-3 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-2xl text-xs font-black shadow-xs transition-colors"
                      >
                        Salin QR Code Info
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* User Creation Modal (Superadmin) */}
      {showUserForm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => !isCreatingUser && setShowUserForm(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Tambah Pengguna Baru</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Platform SSO & I-CAN BINUS University</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isCreatingUser) {
                    setShowUserForm(false);
                    setUserFormError(null);
                  }
                }}
                disabled={isCreatingUser}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {userFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{userFormError}</span>
              </div>
            )}

            <form onSubmit={handleUserFormSubmit} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Role / Hak Akses Akun
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MAHASISWA', 'ORGANIZER', 'SUPERADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setUserFormData((prev) => ({
                          ...prev,
                          role: r,
                          facultyName:
                            r === 'SUPERADMIN'
                              ? 'Student Service Office (SSO)'
                              : r === 'ORGANIZER'
                              ? 'Teach For Indonesia (TFI)'
                              : prev.facultyName || 'School of Computer Science',
                        }))
                      }
                      className={`py-2 px-2 rounded-xl text-xs font-black border transition-all text-center ${
                        userFormData.role === r
                          ? r === 'SUPERADMIN'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : r === 'ORGANIZER'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {userFormData.role === 'MAHASISWA' && 'Mahasiswa aktif BINUS: submit aksi hijau, kumpulkan SAT & GC.'}
                  {userFormData.role === 'ORGANIZER' && 'Penyelenggara Event: membuat kegiatan kampus & pos QR reward.'}
                  {userFormData.role === 'SUPERADMIN' && 'Super Admin SSO: verifikasi aksi, kelola akun, manual SAT grant.'}
                </p>
              </div>

              {/* Dynamic Identifier: NIM for Mahasiswa, Binus Number (BN) for Staff */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                  <span>
                    {userFormData.role === 'MAHASISWA' ? 'NIM (Nomor Induk Mahasiswa)' : 'Binus Number (BN) / ID Pegawai'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {userFormData.role === 'MAHASISWA' ? '10 Digit NIM' : 'Format BN / NIP'}
                  </span>
                </label>
                <input
                  type="text"
                  value={userFormData.nim}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, nim: sanitizeNimInput(e.target.value, prev.role) }))}
                  placeholder={
                    userFormData.role === 'MAHASISWA' ? 'Contoh: 2602158890' : 'Contoh: BN00123456 / 1980010101'
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff] font-mono"
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={userFormData.fullName}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Contoh: Siti Rahmawati, S.Kom"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Resmi</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder={
                    userFormData.role === 'MAHASISWA' ? 'siti.rahmawati@binus.ac.id' : 'siti.rahmawati@binus.edu'
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  required
                />
              </div>

              {/* Faculty / Unit */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Fakultas / Unit Kerja</label>
                <select
                  value={userFormData.facultyName}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, facultyName: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  required
                >
                  <option value="School of Computer Science">School of Computer Science</option>
                  <option value="School of Information Systems">School of Information Systems</option>
                  <option value="School of Design">School of Design</option>
                  <option value="BINUS Business School">BINUS Business School</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="Faculty of Humanities">Faculty of Humanities</option>
                  <option value="Faculty of Digital Communication & Hotel & Tourism">Faculty of Digital Communication & Hotel & Tourism</option>
                  <option value="Student Service Office (SSO)">Student Service Office (SSO)</option>
                  <option value="Teach For Indonesia (TFI)">Teach For Indonesia (TFI)</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                  <span>Kata Sandi Awal</span>
                  <span className="text-[10px] text-slate-400">Minimal 6 karakter</span>
                </label>
                <div className="relative">
                  <input
                    type={showUserPassword ? 'text' : 'password'}
                    value={userFormData.password}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Masukkan kata sandi awal pengguna"
                    className="w-full text-xs p-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPassword(!showUserPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="flex-1 py-3 bg-[#28a745] hover:bg-[#218838] text-white rounded-2xl text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isCreatingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan Akun...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Pengguna</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserForm(false);
                    setUserFormError(null);
                  }}
                  disabled={isCreatingUser}
                  className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal (Superadmin) */}
      {showEditModal && editingUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => !isEditingUser && setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Edit Data Pengguna</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Perbarui profil atau role pengguna</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isEditingUser) setShowEditModal(false);
                }}
                disabled={isEditingUser}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleEditFormSubmit} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Role / Hak Akses Akun</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MAHASISWA', 'ORGANIZER', 'SUPERADMIN'] as UserRole[]).map((r) => {
                    // Guardrails UI logic
                    let isDisabled = false;
                    let disabledReason = '';
                    if (editingUser?.role === 'SUPERADMIN' && r !== 'SUPERADMIN') {
                      if (user?.id === editingUser.id) {
                        isDisabled = true;
                        disabledReason = 'Tidak dapat menurunkan role akun sendiri';
                      } else if (activeSuperadminsCount <= 1) {
                        isDisabled = true;
                        disabledReason = 'Tidak dapat menurunkan role Superadmin terakhir';
                      }
                    }

                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) setEditFormData((prev) => ({ ...prev, role: r }));
                        }}
                        disabled={isDisabled}
                        title={isDisabled ? disabledReason : undefined}
                        className={`py-2 px-2 rounded-xl text-xs font-black border transition-all text-center ${
                          isDisabled
                            ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                            : editFormData.role === r
                            ? r === 'SUPERADMIN'
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : r === 'ORGANIZER'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Identifier: NIM for Mahasiswa, Binus Number (BN) for Staff */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                  <span>{editFormData.role === 'MAHASISWA' ? 'NIM (Nomor Induk Mahasiswa)' : 'Binus Number (BN) / ID Pegawai'}</span>
                </label>
                <input
                  type="text"
                  value={editFormData.nim}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, nim: sanitizeNimInput(e.target.value, prev.role) }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff] font-mono"
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Resmi</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  required
                />
              </div>

              {/* Faculty / Unit */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Fakultas / Unit Kerja</label>
                <select
                  value={editFormData.facultyName}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, facultyName: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  required
                >
                  <option value="School of Computer Science">School of Computer Science</option>
                  <option value="School of Information Systems">School of Information Systems</option>
                  <option value="School of Design">School of Design</option>
                  <option value="BINUS Business School">BINUS Business School</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="Faculty of Humanities">Faculty of Humanities</option>
                  <option value="Faculty of Digital Communication & Hotel & Tourism">Faculty of Digital Communication & Hotel & Tourism</option>
                  <option value="Student Service Office (SSO)">Student Service Office (SSO)</option>
                  <option value="Teach For Indonesia (TFI)">Teach For Indonesia (TFI)</option>
                </select>
              </div>

              {/* Optional Password Reset */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                  <span>Reset Kata Sandi (Opsional)</span>
                  <span className="text-[10px] text-slate-400">Kosongkan jika tidak diubah</span>
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editFormData.newPassword}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Masukkan kata sandi baru..."
                    className="w-full text-xs p-2.5 pr-10 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007bff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={isEditingUser}
                  className="flex-1 py-3 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-2xl text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isEditingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isEditingUser}
                  className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
