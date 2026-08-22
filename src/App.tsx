import React from 'react';
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
import { AdminLtePage } from '@/pages/AdminLtePage';
import { useAuthStore } from '@/stores/authStore';
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
  User
} from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode; title?: string; subtitle?: string }> = ({ 
  children, 
  title,
  subtitle 
}) => {
  const { user, loginAs } = useAuthStore();

  return (
    <div className="min-h-screen eco-gradient-mesh selection:bg-eco-neon/30 selection:text-eco-900 relative overflow-x-hidden flex justify-center">
      {/* Ambient background glows for Gen Z cyber-eco aesthetic */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-eco-neon/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-gold-neon/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-cyber-purple/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex justify-center lg:gap-8 lg:py-6 lg:px-4">
        {/* Left Desktop Companion Sidebar (Visible on lg+ screens) */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 space-y-3.5 sticky top-6 self-start">
          {/* Brand Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card-lg p-4 border border-surface-border shadow-eco-card space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl eco-gradient-hero flex items-center justify-center text-white shadow-neon-glow">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-eco-900 bg-eco-neon/20 px-2 py-0.5 rounded-full border border-eco-neon/40">
                  BINUS I-CAN
                </span>
                <h2 className="text-sm font-black text-text-primary mt-0.5">Gen Z Eco App</h2>
              </div>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Platform aksi iklim: ubah kebiasaan hijau jadi <b>SAT Points</b> & perolehan <b>BEKEN Award</b>.
            </p>
          </div>

          {/* Quick Demo Switcher Card (5 Accounts) */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card-lg p-3.5 border border-surface-border shadow-eco-soft space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">
                Simulasi Akun (5 Akun)
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-eco-neon/20 text-eco-900 border border-eco-neon/40">
                1-Klik
              </span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => loginAs('student')}
                className={`w-full p-2 rounded-xl border text-left transition-all active:scale-95 flex items-center gap-2 ${
                  user?.id === 'usr-student-001'
                    ? 'bg-eco-700 text-white border-eco-700 shadow-xs'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0 text-eco-neon" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black leading-tight truncate">Budi Santoso (SOCS)</div>
                  <div className={`text-[9px] truncate ${user?.id === 'usr-student-001' ? 'text-eco-100' : 'text-slate-400'}`}>Student • 45 SAT</div>
                </div>
              </button>

              <button
                onClick={() => loginAs('nadia')}
                className={`w-full p-2 rounded-xl border text-left transition-all active:scale-95 flex items-center gap-2 ${
                  user?.id === 'usr-student-003'
                    ? 'bg-eco-700 text-white border-eco-700 shadow-xs'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border/60'
                }`}
              >
                <Award className="w-4 h-4 shrink-0 text-gold-neon" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black leading-tight truncate">Nadia Safira (SOD)</div>
                  <div className={`text-[9px] truncate ${user?.id === 'usr-student-003' ? 'text-eco-100' : 'text-slate-400'}`}>Student • 68 SAT (Top)</div>
                </div>
              </button>

              <button
                onClick={() => loginAs('verifier')}
                className={`w-full p-2 rounded-xl border text-left transition-all active:scale-95 flex items-center gap-2 ${
                  user?.id === 'usr-verifier-002'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-300" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black leading-tight truncate">Siska Amanda (SIS)</div>
                  <div className={`text-[9px] truncate ${user?.id === 'usr-verifier-002' ? 'text-amber-100' : 'text-slate-400'}`}>Verifier SSO & TFI</div>
                </div>
              </button>

              <button
                onClick={() => loginAs('admin')}
                className={`w-full p-2 rounded-xl border text-left transition-all active:scale-95 flex items-center gap-2 ${
                  user?.id === 'usr-admin-005'
                    ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border/60'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0 text-purple-300" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black leading-tight truncate">Pak Hendra (SSO)</div>
                  <div className={`text-[9px] truncate ${user?.id === 'usr-admin-005' ? 'text-purple-100' : 'text-slate-400'}`}>Super Admin Panel</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/admin"
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-left transition-all shadow-xs space-y-1 block"
            >
              <div className="flex items-center justify-between">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span className="text-[8px] font-black bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded">LTE</span>
              </div>
              <div className="text-[11px] font-black">Admin Panel</div>
              <div className="text-[9px] text-slate-400">Web View SSO</div>
            </Link>

            <Link
              to="/guide"
              className="p-2.5 rounded-2xl bg-white hover:bg-eco-50/80 border border-surface-border text-left transition-all shadow-xs space-y-1 block"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-eco-700" />
                <span className="text-[8px] font-black bg-eco-neon/20 text-eco-900 px-1.5 py-0.2 rounded">TFI</span>
              </div>
              <div className="text-[11px] font-black text-text-primary">Panduan & FAQ</div>
              <div className="text-[9px] text-text-muted">Regulasi Resmi</div>
            </Link>
          </div>
        </aside>

        {/* Center Smartphone Screen Canvas */}
        <div className="w-full max-w-md bg-surface-bg min-h-screen shadow-2xl lg:rounded-[36px] lg:border-[6px] lg:border-slate-800/15 lg:shadow-eco-float flex flex-col justify-between relative overflow-hidden">
          {/* Top Live Ticker Marquee */}
          <div className="bg-eco-forest text-eco-neon text-[10px] font-black py-1 px-3 flex items-center justify-between border-b border-eco-800">
            <span className="flex items-center gap-1.5 truncate">
              <Radio className="w-3 h-3 animate-pulse text-rose-400" />
              <span>LIVE: SOCS memimpin peringkat BEKEN Award dengan 1,450 GC! 🚀</span>
            </span>
            <span className="text-white/80 shrink-0 font-mono text-[9px]">BINUS 2026</span>
          </div>

          <TopNavbar title={title} subtitle={subtitle} />
          
          <main className="flex-1 p-4 pb-28 sm:pb-32 overflow-y-auto">
            {children}
          </main>
          
          <BottomNav />
        </div>

        {/* Right Desktop Companion Panel (Visible on xl+ screens) */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-3.5 sticky top-6 self-start">
          {/* QR Instant Onboarding Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card-lg p-4 border border-surface-border shadow-eco-soft text-center space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-eco-neon/20 text-eco-900 border border-eco-neon/40 flex items-center justify-center mx-auto shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-text-primary">Akses Cepat QR Banner</h3>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Simulasi pemindaian QR dari standing banner fisik di kampus BINUS.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-colors shadow-eco-sm"
            >
              <Zap className="w-3.5 h-3.5 text-gold-300" />
              Form Pelaporan Instan
            </Link>
          </div>

          {/* Quick Regulatory Summary with Link to Guide */}
          <div className="bg-surface-subtle rounded-card-lg p-3.5 border border-surface-border space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-black text-text-primary">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Dual-Track System</span>
              </div>
              <Link to="/guide" className="text-[10px] text-eco-800 hover:underline">
                Panduan →
              </Link>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              1. <b>BEKEN Award:</b> Gamifikasi koin hijau tahunan.<br />
              2. <b>SAT Transcript:</b> Poin riil terpetakan langsung dari aksi TFI (Pohon, Biopori, VBL).
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
            path="/verify"
            element={
              <ProtectedRoute>
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
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLtePage />
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

