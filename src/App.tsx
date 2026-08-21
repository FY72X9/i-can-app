import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { TopNavbar } from '@/components/common/TopNavbar';
import { BottomNav } from '@/components/common/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { FeedPage } from '@/pages/FeedPage';
import { UploadPage } from '@/pages/UploadPage';
import { WalletPage } from '@/pages/WalletPage';
import { VerificationPage } from '@/pages/VerificationPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { useAuthStore } from '@/stores/authStore';
import { 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  GraduationCap, 
  Leaf, 
  Flame, 
  ExternalLink,
  Award,
  Users,
  Compass
} from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode; title?: string; subtitle?: string }> = ({ 
  children, 
  title,
  subtitle 
}) => {
  const { user, loginAs } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-900/5 selection:bg-eco-100 selection:text-eco-800 relative overflow-x-hidden flex justify-center">
      {/* Ambient background glows for desktop aesthetic */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-eco-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-gold-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex justify-center lg:gap-8 lg:py-6 lg:px-4">
        {/* Left Desktop Companion Sidebar (Visible on lg+ screens) */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 space-y-4 sticky top-6 self-start">
          {/* Brand Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card p-5 border border-surface-border shadow-eco-soft space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl eco-gradient-hero flex items-center justify-center text-white shadow-md shadow-eco-600/30">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-eco-700 bg-eco-50 px-2 py-0.5 rounded-full border border-eco-200">
                  BINUS I-CAN
                </span>
                <h2 className="text-base font-black text-text-primary mt-0.5">Green Campus App</h2>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Platform aksi iklim & rekognisi transkrip mahasiswa (SAT & Jam Comserv TFI).
            </p>
          </div>

          {/* Quick Demo Switcher Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card p-4 border border-surface-border shadow-eco-soft space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Mode Demo Presentasi
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-eco-100 text-eco-800">
                Live Switch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginAs('student')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  user?.role === 'STUDENT'
                    ? 'bg-eco-600 text-white border-eco-600 shadow-sm'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1" />
                <div className="text-xs font-extrabold leading-tight">Mahasiswa</div>
                <div className="text-[9px] opacity-80 truncate">Budi Santoso</div>
              </button>

              <button
                onClick={() => loginAs('verifier')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  user?.role === 'VERIFIER'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-surface-subtle text-text-secondary hover:bg-white border-surface-border'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1" />
                <div className="text-xs font-extrabold leading-tight">Verifikator</div>
                <div className="text-[9px] opacity-80 truncate">Siska (SSO/TFI)</div>
              </button>
            </div>
          </div>

          {/* Campus Target Stats Widget */}
          <div className="bg-gradient-to-br from-eco-900 to-eco-800 text-white rounded-card p-4 shadow-eco-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-eco-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                SDG Campus Goals
              </span>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">
                Semester Ganjil
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-eco-100">
                <span>Pohon Tertanam:</span>
                <b className="text-white font-mono">1,420 / 2,000</b>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[71%]" />
              </div>

              <div className="flex justify-between items-center text-eco-100 pt-1">
                <span>Lubang Biopori:</span>
                <b className="text-white font-mono">890 / 1,000</b>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full w-[89%]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Center Mobile App Viewport (Sleek Smartphone Frame on Desktop) */}
        <div className="w-full max-w-md bg-surface-bg min-h-screen shadow-2xl lg:rounded-[36px] lg:border-[6px] lg:border-slate-800/10 lg:shadow-eco-float flex flex-col justify-between relative overflow-hidden">
          <TopNavbar title={title} subtitle={subtitle} />
          
          <main className="flex-1 p-4 pb-28 sm:pb-32 overflow-y-auto">
            {children}
          </main>
          
          <BottomNav />
        </div>

        {/* Right Desktop Companion Panel (Visible on xl+ screens) */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-4 sticky top-6 self-start">
          {/* QR Instant Onboarding Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-card p-5 border border-surface-border shadow-eco-soft text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-eco-50 text-eco-700 flex items-center justify-center mx-auto shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-text-primary">Akses Cepat Banner QR</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Simulasi pemindaian QR dari spanduk / poster fisik di kampus BINUS.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-eco-50 hover:bg-eco-100 text-eco-800 text-xs font-bold transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-eco-600" />
              Buka Form Pelaporan Instan
            </Link>
          </div>

          {/* Quick Regulatory Summary */}
          <div className="bg-surface-subtle rounded-card p-4 border border-surface-border/60 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Dual-Track System</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              1. <b>BEKEN Award:</b> Kompetisi koin hijau tahunan.<br />
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
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/feed"
          element={
            <AppLayout title="Feed & Inspirasi" subtitle="Storytelling Komunitas Kampus">
              <FeedPage />
            </AppLayout>
          }
        />
        <Route
          path="/upload"
          element={
            <AppLayout title="Pelaporan Aksi" subtitle="Verifikasi & Klaim Dual-Track">
              <UploadPage />
            </AppLayout>
          }
        />
        <Route
          path="/wallet"
          element={
            <AppLayout title="Portofolio Rekognisi" subtitle="Transkrip SAT & BEKEN Track">
              <WalletPage />
            </AppLayout>
          }
        />
        <Route
          path="/verify"
          element={
            <AppLayout title="Portal Verifikasi" subtitle="Validasi Admin SSO & TFI">
              <VerificationPage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout title="Profil Mahasiswa" subtitle="Rekam Jejak & Badge Prestasi">
              <ProfilePage />
            </AppLayout>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

