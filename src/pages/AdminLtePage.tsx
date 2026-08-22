import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, DEMO_PROFILES } from '@/stores/authStore';
import { getActions, updateActionVerification } from '@/services/actionService';
import { getStoredAccounts } from '@/services/authService';
import { GreenAction, UserProfile, UserRole } from '@/types';
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
  Monitor
} from 'lucide-react';

export const AdminLtePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginAs, updateUserStats } = useAuthStore();

  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'users' | 'actions' | 'grant' | 'sdg'>('dashboard');
  const [actionsList, setActionsList] = useState<GreenAction[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isWideView, setIsWideView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Manual Grant Modal
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<string>('usr-student-001');
  const [grantSatAmount, setGrantSatAmount] = useState<number>(4);
  const [grantCoinsAmount, setGrantCoinsAmount] = useState<number>(25);
  const [grantReason, setGrantReason] = useState<string>('Pemberian SAT Manual oleh SSO');
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);

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
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updatedUsers = usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsersList(updatedUsers);

    // Save to localStorage accounts
    const raw = localStorage.getItem('i_can_registered_accounts');
    if (raw) {
      try {
        const stored = JSON.parse(raw);
        const next = stored.map((acc: any) => (acc.id === userId ? { ...acc, role: newRole } : acc));
        localStorage.setItem('i_can_registered_accounts', JSON.stringify(next));
      } catch {}
    }

    if (user?.id === userId) {
      useAuthStore.getState().setUser({ ...user, role: newRole });
    }
    alert(`Role berhasil diperbarui menjadi ${newRole}`);
  };

  const handleAdminVerify = async (actionId: string, decision: 'APPROVED_FULL' | 'APPROVED_COINS_ONLY' | 'REJECTED') => {
    await updateActionVerification(actionId, decision, 'Diverifikasi langsung oleh Super Admin SSO');
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

  // KPIs
  const totalUsers = usersList.length;
  const verifiedActions = actionsList.filter((a) => a.status === 'APPROVED').length;
  const totalSatAwarded = actionsList.reduce((acc, a) => acc + (a.satPointsEarned || 0), 0) + 120;
  const totalCo2Saved = (actionsList.reduce((acc, a) => acc + (a.carbonImpactKg || 0), 0) + 85.5).toFixed(1);

  return (
    <div className={`min-h-screen bg-[#f4f6f9] text-[#212529] font-sans transition-all ${isWideView ? 'fixed inset-0 z-50 overflow-y-auto' : 'rounded-3xl border border-slate-300 shadow-xl overflow-hidden'}`}>
      {/* 1. AdminLTE Classic Top Navbar */}
      <header className="bg-white border-b border-[#dee2e6] px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
            title="Kembali ke App Mahasiswa"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke App</span>
          </Link>

          <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
            <div className="w-7 h-7 rounded-lg bg-[#007bff] text-white flex items-center justify-center font-black text-xs shadow-xs">
              LTE
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              AdminLTE <b>3.4</b> • SSO Panel
            </span>
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
        </div>
      </header>

      {/* 2. Main AdminLTE Layout Grid (Sidebar + Content Body) */}
      <div className="flex flex-col md:flex-row min-h-[580px]">
        {/* Dark Navy AdminLTE Sidebar */}
        <aside className="w-full md:w-56 bg-[#343a40] text-[#c2c7d0] p-3 shrink-0 space-y-4">
          {/* User Profile Bar */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#4f5962]">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
              alt="Hendra Admin"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#007bff]"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">Pak Hendra (SSO)</h4>
              <p className="text-[10px] text-[#28a745] flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28a745] animate-ping" />
                Super Admin Online
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

            <button
              onClick={() => setActiveMenu('grant')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeMenu === 'grant' ? 'bg-[#007bff] text-white shadow-xs' : 'hover:bg-[#494e53] text-[#c2c7d0]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Manual SAT Grant</span>
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
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-5 space-y-4 overflow-x-auto">
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-800">
                {activeMenu === 'dashboard' && 'Dashboard Overview (SSO & TFI)'}
                {activeMenu === 'users' && 'Manajemen Pengguna & Pengaturan Role'}
                {activeMenu === 'actions' && 'Log & Validasi Aksi Nyata Mahasiswa'}
                {activeMenu === 'grant' && 'Pemberian Poin SAT & Jam Comserv Manual'}
                {activeMenu === 'sdg' && 'Metrik & Dampak Berkelanjutan SDG Kampus'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Panel Administrasi Terpusat • BINUS University
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md">
              Session: Super Admin
            </span>
          </div>

          {/* 3. Small KPI Boxes (Classic AdminLTE Style) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Box 1: Total Users (bg-info #17a2b8) */}
            <div className="bg-[#17a2b8] text-white p-3.5 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-black">{totalUsers}</div>
                <p className="text-[11px] font-bold text-cyan-100">Mahasiswa & Staff</p>
              </div>
              <Users className="w-10 h-10 text-white/20 absolute right-2 bottom-2" />
            </div>

            {/* Box 2: Verified Actions (bg-success #28a745) */}
            <div className="bg-[#28a745] text-white p-3.5 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-black">{verifiedActions} Aksi</div>
                <p className="text-[11px] font-bold text-emerald-100">Disetujui Resmi TFI</p>
              </div>
              <CheckSquare className="w-10 h-10 text-white/20 absolute right-2 bottom-2" />
            </div>

            {/* Box 3: SAT Distributed (bg-warning #ffc107) */}
            <div className="bg-[#ffc107] text-[#1f2d3d] p-3.5 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-black">{totalSatAwarded} SAT</div>
                <p className="text-[11px] font-bold text-amber-900">Poin SAT Transkrip</p>
              </div>
              <GraduationCap className="w-10 h-10 text-black/15 absolute right-2 bottom-2" />
            </div>

            {/* Box 4: Carbon Reduced (bg-danger #dc3545) */}
            <div className="bg-[#dc3545] text-white p-3.5 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-black">{totalCo2Saved} kg</div>
                <p className="text-[11px] font-bold text-rose-100">Emisi CO2e Ditekan</p>
              </div>
              <Award className="w-10 h-10 text-white/20 absolute right-2 bottom-2" />
            </div>
          </div>

          {/* 4. Tab Content: Dashboard & Table 1: Manajemen Akun */}
          {(activeMenu === 'dashboard' || activeMenu === 'users') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#007bff]" />
                  Daftar Akun & Manajemen Hak Akses (Role)
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">{usersList.length} Akun Terdaftar</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-2.5 font-black">NIM / ID</th>
                      <th className="p-2.5 font-black">Nama Lengkap</th>
                      <th className="p-2.5 font-black">Fakultas</th>
                      <th className="p-2.5 font-black">Green Coins</th>
                      <th className="p-2.5 font-black">Poin SAT</th>
                      <th className="p-2.5 font-black">Role / Hak Akses</th>
                      <th className="p-2.5 font-black">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-mono text-[11px] text-slate-600">{u.nim}</td>
                        <td className="p-2.5 font-bold text-slate-900 flex items-center gap-2">
                          <img src={u.avatarUrl} alt={u.fullName} className="w-6 h-6 rounded-full object-cover" />
                          <span>{u.fullName}</span>
                        </td>
                        <td className="p-2.5 text-slate-600 text-[11px]">{u.facultyName}</td>
                        <td className="p-2.5 font-bold text-amber-700 font-mono">{u.totalGreenCoins || 0} GC</td>
                        <td className="p-2.5 font-bold text-blue-700 font-mono">{u.totalSatPoints || 0} SAT</td>
                        <td className="p-2.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className={`text-[11px] font-bold py-1 px-2 rounded-lg border cursor-pointer ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : u.role === 'VERIFIER'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="VERIFIER">VERIFIER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="p-2.5">
                          <button
                            onClick={() => {
                              loginAs(u.id === 'usr-student-001' ? 'student' : u.id === 'usr-verifier-002' ? 'verifier' : u.id === 'usr-student-003' ? 'nadia' : u.id === 'usr-student-004' ? 'farhan' : 'admin');
                              alert(`Beralih simulasi login sebagai ${u.fullName}`);
                            }}
                            className="px-2 py-1 rounded bg-slate-200 hover:bg-[#007bff] hover:text-white text-[10px] font-bold transition-colors"
                          >
                            Login As
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Tab Content: Table 2: Log Verifikasi Aksi */}
          {(activeMenu === 'dashboard' || activeMenu === 'actions') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#28a745]" />
                  Log Pengajuan Aksi & Keputusan SSO
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">{actionsList.length} Total Pengajuan</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-2.5 font-black">Mahasiswa</th>
                      <th className="p-2.5 font-black">Kategori Aksi</th>
                      <th className="p-2.5 font-black">Tipe Program</th>
                      <th className="p-2.5 font-black">Potensi SAT</th>
                      <th className="p-2.5 font-black">AI Score</th>
                      <th className="p-2.5 font-black">Status</th>
                      <th className="p-2.5 font-black">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {actionsList.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-900">{act.userName}</td>
                        <td className="p-2.5 text-slate-700">{act.categoryName}</td>
                        <td className="p-2.5 text-[11px] text-slate-500">{act.submissionType}</td>
                        <td className="p-2.5 font-bold text-blue-700 font-mono">+{act.satPointsEarned} SAT</td>
                        <td className="p-2.5 font-bold text-emerald-700 font-mono">
                          {Math.round((act.aiConfidence || 0.9) * 100)}%
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
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
                        <td className="p-2.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdminVerify(act.id, 'APPROVED_FULL')}
                              className="px-2 py-1 bg-[#28a745] hover:bg-[#218838] text-white rounded text-[10px] font-bold"
                              title="Approve Full SAT + Coins"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAdminVerify(act.id, 'REJECTED')}
                              className="px-2 py-1 bg-[#dc3545] hover:bg-[#c82333] text-white rounded text-[10px] font-bold"
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 max-w-lg space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <GraduationCap className="w-5 h-5 text-[#007bff]" />
                <h3 className="text-sm font-black">Direct Manual SAT & Coins Granting</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Fitur khusus SSO untuk memberikan Poin SAT atau Green Coins langsung kepada mahasiswa (misalnya pemenang kompetisi lingkungan khusus atau aksi di luar jadwal).
              </p>

              {grantSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{grantSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleManualGrantSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Mahasiswa Penerima</label>
                  <select
                    value={selectedUserForGrant}
                    onChange={(e) => setSelectedUserForGrant(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
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
                    <label className="text-xs font-bold text-slate-700 block mb-1">Jumlah Poin SAT</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={grantSatAmount}
                      onChange={(e) => setGrantSatAmount(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Jumlah Green Coins</label>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={grantCoinsAmount}
                      onChange={(e) => setGrantCoinsAmount(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Keterangan / Alasan Resmi SSO</label>
                  <input
                    type="text"
                    value={grantReason}
                    onChange={(e) => setGrantReason(e.target.value)}
                    placeholder="Contoh: Juara 1 Lomba Inovasi Biopori Kampus"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-xl text-xs font-black shadow-xs transition-colors"
                >
                  Eksekusi Pemberian Poin SAT →
                </button>
              </form>
            </div>
          )}

          {/* 7. Tab Content: SDG Analytics */}
          {activeMenu === 'sdg' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-black text-emerald-800 block">SDG 15: Life on Land</span>
                  <div className="text-2xl font-black text-slate-900">1,420 Pohon</div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[71%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">71% dari target 2,000 pohon tahun 2026</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-black text-cyan-800 block">SDG 6: Clean Water</span>
                  <div className="text-2xl font-black text-slate-900">890 Biopori</div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full w-[89%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">89% dari target 1,000 lubang biopori</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-black text-purple-800 block">SDG 4: Quality Education</span>
                  <div className="text-2xl font-black text-slate-900">340 Video VBL</div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-[68%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">68% terverifikasi berstandar APA Style</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
