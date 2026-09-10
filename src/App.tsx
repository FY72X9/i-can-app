import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LogtoProvider } from '@logto/react';
import { logtoConfig } from '@/services/logto';
import { TopNavbar } from '@/components/common/TopNavbar';
import { BottomNav } from '@/components/common/BottomNav';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { FeedPage } from '@/pages/FeedPage';
import { UploadPage } from '@/pages/UploadPage';
import { WalletPage } from '@/pages/WalletPage';
import { VerificationPage } from '@/pages/VerificationPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { CallbackPage } from '@/pages/CallbackPage';
import { GuidePage } from '@/pages/GuidePage';
import { SdgGuidelinePage } from '@/pages/SdgGuidelinePage';
import { AdminLtePage } from '@/pages/AdminLtePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { useAuthStore } from '@/stores/authStore';
import { useAppModeStore } from '@/stores/appModeStore';
import { 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  GraduationCap, 
  Leaf, 
  Award,
  Zap,
  Radio,
  BookOpen,
  LayoutDashboard,
  Shield,
  User,
  ToggleLeft,
  ToggleRight,
  Smartphone,
  Sliders
} from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode; title?: string; subtitle?: string }> = ({ 
  children, 
  title,
  subtitle 
}) => {
  const { user, usersList, loadUsersList, loginAs } = useAuthStore();
  const { mode, isDemoMode, isPrototypeMode, toggleMode } = useAppModeStore();

  useEffect(() => {
    loadUsersList();
  }, []);

  const canSwitchAccounts = isDemoMode() || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen eco-gradient-mesh selection:bg-eco-neon/30 selection:text-eco-900 relative overflow-x-hidden flex flex-col items-center">
      {/* Ambient background glows for Gen Z cyber-eco aesthetic */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-eco-neon/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-gold-neon/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-cyber-purple/15 rounded-full blur-3xl pointer-events-none" />

      {/* Global Environment & Mode Switcher Bar */}
      <div className="w-full bg-slate-900 text-white text-xs py-1.5 px-4 z-50 flex items-center justify-between border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 max-w-6xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isPrototypeMode() 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isPrototypeMode() ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              {isPrototypeMode() ? '📱 Mode Prototype End-User (Sesuai Role)' : '🛠️ Mode Dev / Demo Showcase (1-Klik Switch)'}
            </span>
            <span className="hidden sm:inline text-[11px] text-slate-400">
              {isPrototypeMode() 
                ? 'Akses role dibatasi ketat (Hanya Super Admin yang dapat ubah role)' 
                : 'Akses cepat 5 role demo & AdminLTE aktif untuk juri'}
            </span>
          </div>

          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold border border-slate-700 transition-all active:scale-95 text-slate-200"
            title="Ganti antara Mode Prototype Murni & Mode Demo Juri"
          >
            <Sliders className="w-3.5 h-3.5 text-eco-neon" />
            <span className="hidden xs:inline">Ganti Mode:</span>
            <strong className="text-eco-neon">{isPrototypeMode() ? 'Ke Dev Mode' : 'Ke Prototype'}</strong>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex justify-center lg:gap-8 lg:py-6 lg:px-4 flex-1">
        {/* Left Desktop Companion Sidebar (Visible on lg+ screens) */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 space-y-3.5 sticky top-14 self-start">
          {/* Brand Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-surface-border shadow-eco-card space-y-2.5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl eco-gradient-hero flex items-center justify-center text-white shadow-neon-glow shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-eco-900 bg-eco-neon/20 px-2.5 py-0.5 rounded-full border border-eco-neon/40 inline-block">
                  BINUS I-CAN
                </span>
                <h2 className="text-sm font-black text-text-primary mt-1 truncate">Gen Z Eco App</h2>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Platform aksi iklim: ubah kebiasaan hijau jadi <b>SAT Points</b> & perolehan <b>BEKEN Award</b>.
            </p>
          </div>

          {/* Account Simulation Sidebar Card (Shown only for Admin or in Demo Mode) */}
          {canSwitchAccounts ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-surface-border shadow-eco-soft space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-text-muted uppercase tracking-wider">
                  Simulasi Akun ({usersList.length} Akun • {user?.role === 'ADMIN' ? 'Admin Mode' : 'Dev Mode'})
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-eco-neon/20 text-eco-900 border border-eco-neon/40">
                  1-Klik
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5 no-scrollbar">
                {usersList.map((u) => {
                  const isActive = user?.id === u.id;
                  const isOrganizer = u.role === 'ORGANIZER';
                  const isAdmin = u.role === 'ADMIN';

                  return (
                    <button
                      key={u.id}
                      onClick={() => loginAs(u.id)}
                      className={`w-full p-2.5 rounded-2xl border text-left transition-all active:scale-95 flex items-center gap-2.5 ${
                        isActive
                          ? isAdmin
                            ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                            : isOrganizer
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-eco-700 text-white border-eco-700 shadow-xs'
                          : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border/60 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.fullName}
                        className="w-7 h-7 rounded-xl object-cover shrink-0 ring-1 ring-black/10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black leading-tight truncate">{u.fullName}</div>
                        <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80 font-medium' : 'text-slate-500'}`}>
                          {u.role} • {u.totalSatPoints || 0} SAT
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Prototype Clean Mode Card for regular users */
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-surface-border shadow-eco-soft space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-eco-700" />
                <span className="text-xs sm:text-sm font-black text-text-primary">Profil Aktif</span>
              </div>
              <div className="p-3 bg-surface-subtle rounded-2xl border border-surface-border/60 space-y-1">
                <div className="text-xs sm:text-sm font-black text-text-primary truncate">{user?.fullName}</div>
                <div className="text-[11px] text-text-secondary font-mono">NIM: {user?.nim}</div>
                <div className="text-[11px] text-eco-800 font-bold truncate">{user?.facultyName}</div>
                <div className="inline-block mt-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-eco-neon/20 text-eco-950">
                  Role: {user?.role}
                </div>
              </div>
            </div>
          )}

          {/* Quick Navigation Links */}
          <div className="grid grid-cols-2 gap-2.5">
            {(canSwitchAccounts || user?.role === 'ADMIN') && (
              <Link
                to="/admin"
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-left transition-all shadow-xs space-y-1 block"
              >
                <div className="flex items-center justify-between">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span className="text-[9px] font-black bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded">LTE</span>
                </div>
                <div className="text-xs font-black">Admin Panel</div>
                <div className="text-[10px] text-slate-400">Web View SSO</div>
              </Link>
            )}

            <Link
              to="/guide"
              className={`p-3 rounded-2xl bg-white hover:bg-eco-50/80 border border-surface-border text-left transition-all shadow-xs space-y-1 block ${
                !canSwitchAccounts && user?.role !== 'ADMIN' ? 'col-span-2' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-eco-700" />
                <span className="text-[9px] font-black bg-eco-neon/20 text-eco-900 px-1.5 py-0.2 rounded">TFI</span>
              </div>
              <div className="text-xs font-black text-text-primary">Panduan & FAQ</div>
              <div className="text-[10px] text-text-muted">Regulasi Resmi SSO</div>
            </Link>
          </div>
        </aside>

        {/* Center Smartphone Screen Canvas */}
        <div className="w-full max-w-[480px] lg:max-w-[500px] bg-surface-bg min-h-screen shadow-2xl lg:rounded-[36px] lg:border-[5px] lg:border-slate-800/15 lg:shadow-eco-float flex flex-col justify-between relative overflow-hidden">
          {/* Top Live Ticker Marquee */}
          <div className="bg-eco-forest text-eco-neon text-[11px] font-black py-2 px-4 flex items-center justify-between border-b border-eco-800">
            <span className="flex items-center gap-2 truncate">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400 shrink-0" />
              <span className="truncate">LIVE: SOCS memimpin peringkat BEKEN Award dengan 1,450 GC! 🚀</span>
            </span>
            <span className="text-white/80 shrink-0 font-mono text-[10px] ml-2">BINUS 2026</span>
          </div>

          <TopNavbar title={title} subtitle={subtitle} />
          
          <main className="flex-1 p-4 sm:p-5 pb-28 sm:pb-32 overflow-y-auto space-y-6">
            {children}
          </main>
          
          <BottomNav />
        </div>

        {/* Right Desktop Companion Panel (Visible on xl+ screens) */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-3.5 sticky top-14 self-start">
          {/* QR Instant Onboarding Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-surface-border shadow-eco-soft text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-eco-neon/20 text-eco-900 border border-eco-neon/40 flex items-center justify-center mx-auto shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary">Akses Cepat QR Banner</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Simulasi pemindaian QR dari standing banner fisik di kampus BINUS.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3.5 rounded-2xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-colors shadow-eco-sm"
            >
              <Zap className="w-3.5 h-3.5 text-gold-300" />
              Form Pelaporan Instan
            </Link>
          </div>

          {/* Quick Regulatory Summary with Link to Guide & SDG */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-surface-border shadow-eco-soft space-y-2.5 text-left">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-text-primary">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Dual-Track & SDGs</span>
              </div>
              <Link to="/sdg-guideline" className="text-xs text-eco-800 hover:underline font-bold">
                Matriks SDG →
              </Link>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              1. <b>BEKEN Award:</b> Gamifikasi koin hijau tahunan.<br />
              2. <b>SAT Transcript:</b> Poin terpetakan dari aksi TFI.<br />
              3. <b>UN SDGs:</b> 8 Target Prioritas SDG BINUS.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LogtoProvider config={logtoConfig}>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication & Entry Routes (Main Page is LoginPage) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />

          {/* Protected Main Application Dashboard Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <AppLayout title="Community Feed" subtitle="Storytelling & Aksi Mahasiswa">
                  <FeedPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <AppLayout title="Pelaporan Aksi" subtitle="AI Scanning & Klaim SAT">
                  <UploadPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <AppLayout title="Portofolio Rekognisi" subtitle="Transkrip SAT & BEKEN Track">
                  <WalletPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <AppLayout title="Papan Peringkat" subtitle="BEKEN Award & Aktivitas Mahasiswa">
                  <LeaderboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <AppLayout title="Portal Verifikasi" subtitle="Validasi Admin SSO & TFI">
                  <VerificationPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout title="Profil Mahasiswa" subtitle="Rekam Jejak & Rarity Badges">
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide"
            element={
              <ProtectedRoute>
                <AppLayout title="Pusat Panduan & FAQ" subtitle="Regulasi TFI & Standar SSO">
                  <GuidePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sdg-guideline"
            element={
              <ProtectedRoute>
                <AppLayout title="Panduan Target SDG BINUS" subtitle="Pemetaan Aksi I-CAN & Standar Saintifik IPCC">
                  <SdgGuidelinePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guidelines/sdg"
            element={
              <ProtectedRoute>
                <AppLayout title="Panduan Target SDG BINUS" subtitle="Pemetaan Aksi I-CAN & Standar Saintifik IPCC">
                  <SdgGuidelinePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                <AdminLtePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <AppLayout title="Event Kampus" subtitle="Jelajahi Kampanye Hijau Kampus">
                  <EventsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <AppLayout title="Detail Event" subtitle="Pos Aktivitas & Leaderboard">
                  <EventDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route -> redirect to home (which will route to /login if unauthenticated) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LogtoProvider>
  );
};
