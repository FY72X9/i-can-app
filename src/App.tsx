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
import { useAuthStore } from '@/stores/authStore';
import { 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  GraduationCap, 
  Leaf, 
  Award,
  Zap,
  Radio
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
        <aside className="hidden lg:flex flex-col w-72 shrink-0 space-y-4 sticky top-6 self-start">
          {/* Brand Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card-lg p-5 border border-surface-border shadow-eco-card space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl eco-gradient-hero flex items-center justify-center text-white shadow-neon-glow">
                <Leaf className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-eco-900 bg-eco-neon/20 px-2 py-0.5 rounded-full border border-eco-neon/40">
                  BINUS I-CAN
                </span>
                <h2 className="text-base font-black text-text-primary mt-0.5">Gen Z Eco App</h2>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Platform aksi iklim mahasiswa: ubah kebiasaan hijau jadi <b>SAT Points</b> & perolehan <b>BEKEN Award</b>.
            </p>
          </div>

          {/* Quick Demo Switcher Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card-lg p-4 border border-surface-border shadow-eco-soft space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-text-muted uppercase tracking-wider">
                Mode Demo Presentasi
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-eco-neon/20 text-eco-900 border border-eco-neon/40">
                1-Click Switch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginAs('student')}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                  user?.role === 'STUDENT'
                    ? 'bg-eco-700 text-white border-eco-700 shadow-sm'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1 text-eco-neon" />
                <div className="text-xs font-black leading-tight">Mahasiswa</div>
                <div className="text-[9px] opacity-80 truncate">{user?.role === 'STUDENT' ? user.fullName.split(' ')[0] : 'Budi'}</div>
              </button>

              <button
                onClick={() => loginAs('verifier')}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                  user?.role === 'VERIFIER'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1 text-gold-300" />
                <div className="text-xs font-black leading-tight">Verifikator</div>
                <div className="text-[9px] opacity-80 truncate">Siska (SSO/TFI)</div>
              </button>
            </div>
          </div>

          {/* Campus Target Stats Widget */}
          <div className="bg-gradient-to-br from-eco-forest via-eco-900 to-eco-800 text-white rounded-card-lg p-4 shadow-eco-card space-y-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-eco-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-neon" />
                Campus SDG Pulse
              </span>
              <span className="text-[9px] font-black bg-white/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live 2026
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-eco-100">
                <span>Pohon Tertanam:</span>
                <b className="text-white font-mono text-xs">1,420 / 2,000</b>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-eco-400 to-eco-neon h-full rounded-full w-[71%] shadow-sm" />
              </div>

              <div className="flex justify-between items-center text-eco-100 pt-1">
                <span>Lubang Biopori:</span>
                <b className="text-white font-mono text-xs">890 / 1,000</b>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full w-[89%] shadow-sm" />
              </div>
            </div>
          </div>
        </aside>

        {/* Center Smartphone Screen Canvas */}
        <div className="w-full max-w-md bg-surface-bg min-h-screen shadow-2xl lg:rounded-[36px] lg:border-[6px] lg:border-slate-800/15 lg:shadow-eco-float flex flex-col justify-between relative overflow-hidden">
          {/* Top Live Ticker Marquee */}
          <div className="bg-eco-forest text-eco-neon text-[10px] font-black py-1 px-3 flex items-center justify-between border-b border-eco-800">
            <span className="flex items-center gap-1.5 truncate">
              <Radio className="w-3 h-3 animate-pulse text-rose-400" />
              <span>LIVE: SOCS memimpin peringkat BEKEN Award dengan 1,240 GC! 🚀</span>
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
        <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-4 sticky top-6 self-start">
          {/* QR Instant Onboarding Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card-lg p-5 border border-surface-border shadow-eco-soft text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-eco-neon/20 text-eco-900 border border-eco-neon/40 flex items-center justify-center mx-auto shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-text-primary">Akses Cepat QR Banner</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Simulasi pemindaian QR dari spanduk / standing banner fisik di kampus BINUS.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-2xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-colors shadow-eco-sm"
            >
              <Zap className="w-3.5 h-3.5 text-gold-300" />
              Buka Form Pelaporan Instan
            </Link>
          </div>

          {/* Quick Regulatory Summary */}
          <div className="bg-surface-subtle rounded-card-lg p-4 border border-surface-border space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-black text-text-primary">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Dual-Track System Overview</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
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

          {/* Catch-all route -> redirect to home (which will route to /login if unauthenticated) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LogtoProvider>
  );
};
