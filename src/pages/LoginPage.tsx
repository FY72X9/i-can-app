import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLogto } from '@logto/react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { isLogtoConfigured } from '@/services/logto';
import { 
  Leaf, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  Gift,
  KeyRound,
  Shield
} from 'lucide-react';

const FACULTIES = [
  'School of Computer Science',
  'School of Information Systems',
  'School of Design',
  'BINUS Business School',
  'Faculty of Engineering',
  'Faculty of Humanities',
  'Faculty of Digital Communication & Hotel & Tourism',
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAs, loginWithPassword, register, authError, clearError, isLoading } = useAuthStore();
  const { signIn: logtoSignIn } = useLogto();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFaculty, setRegFaculty] = useState(FACULTIES[0]);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [formValidationMsg, setFormValidationMsg] = useState<string | null>(null);

  const handleTabSwitch = (tab: 'LOGIN' | 'REGISTER') => {
    setActiveTab(tab);
    clearError();
    setFormValidationMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationMsg(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setFormValidationMsg('Silakan masukkan NIM/Email dan kata sandi Anda');
      return;
    }

    const success = await loginWithPassword(loginIdentifier, loginPassword);
    if (success) {
      navigate('/home');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationMsg(null);

    if (!regFullName.trim() || !regNim.trim() || !regEmail.trim() || !regPassword.trim()) {
      setFormValidationMsg('Harap lengkapi semua kolom pendaftaran');
      return;
    }

    if (regPassword.length < 6) {
      setFormValidationMsg('Kata sandi minimal 6 karakter');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFormValidationMsg('Konfirmasi kata sandi tidak cocok');
      return;
    }

    const success = await register({
      fullName: regFullName,
      nim: regNim,
      email: regEmail,
      facultyName: regFaculty,
      password: regPassword,
      role: 'STUDENT',
    });

    if (success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2E8B57', '#00FF66', '#E5A93C'],
      });
      navigate('/home');
    }
  };

  const handleLogtoSSO = async () => {
    clearError();
    setFormValidationMsg(null);

    if (isLogtoConfigured) {
      try {
        const redirectUri = `${window.location.origin}/callback`;
        await logtoSignIn(redirectUri);
      } catch (err: any) {
        setFormValidationMsg(`Gagal memulai sesi Logto: ${err.message || 'Periksa koneksi provider'}`);
      }
    } else {
      setFormValidationMsg(
        'Logto SSO belum aktif. Silakan masukkan VITE_LOGTO_ENDPOINT & VITE_LOGTO_APP_ID di file .env, atau gunakan login password / akses cepat di bawah.'
      );
    }
  };

  const handleDemoStudent = () => {
    loginAs('student');
    navigate('/home');
  };

  const handleDemoVerifier = () => {
    loginAs('verifier');
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 max-w-md mx-auto py-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-eco-neon/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-gold-neon/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Hero */}
      <div className="text-center space-y-2 pt-2 relative z-10">
        <div className="w-14 h-14 rounded-3xl eco-gradient-hero flex items-center justify-center mx-auto shadow-neon-glow ring-8 ring-eco-100/80">
          <Leaf className="w-8 h-8 text-white" />
        </div>

        <div>
          <Badge variant="eco" size="sm" className="mb-1 font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-gold-neon" />
            BINUS Sustainability 2026
          </Badge>
          <h1 className="text-xl font-black text-text-primary mt-0.5">I-CAN Platform</h1>
          <p className="text-[11px] text-text-secondary max-w-xs mx-auto mt-0.5 leading-relaxed">
            Portal Aksi Hijau & Pengabdian TFI Menjadi <b>SAT Points</b> & Portofolio myBINUS.
          </p>
        </div>
      </div>

      {/* Auth Main Card */}
      <div className="space-y-4 my-4 relative z-10">
        {/* Active Session Callout if already logged in */}
        {user && (
          <div className="p-3 bg-gradient-to-r from-eco-700 to-eco-900 text-white rounded-3xl shadow-neon-glow flex items-center justify-between gap-2 border border-eco-neon/40">
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-eco-neon flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Sesi Akun Aktif
              </div>
              <div className="text-xs font-black truncate">{user.fullName} ({user.role})</div>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="px-3 py-1.5 bg-eco-neon text-eco-950 font-black text-xs rounded-xl shrink-0 hover:bg-emerald-300 transition-all active:scale-95 shadow-sm"
            >
              Buka Dashboard →
            </button>
          </div>
        )}

        <Card className="p-4 sm:p-5 bg-white space-y-4 shadow-eco-card border-surface-border">
          {/* Navigation Tabs */}
          <div className="flex bg-surface-subtle p-1 rounded-2xl border border-surface-border">
            <button
              type="button"
              onClick={() => handleTabSwitch('LOGIN')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'LOGIN'
                  ? 'bg-eco-700 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('REGISTER')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'REGISTER'
                  ? 'bg-eco-700 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Daftar Mahasiswa
            </button>
          </div>

          {/* Logto SSO Quick Action Button */}
          <button
            type="button"
            onClick={handleLogtoSSO}
            className="w-full py-2.5 px-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 hover:from-indigo-100 hover:to-purple-100 text-indigo-950 flex items-center justify-center gap-2 text-xs font-black transition-all shadow-xs group active:scale-98"
          >
            <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-3 h-3" />
            </div>
            <span>Masuk via Logto SSO (BINUS Identity)</span>
            <span className="text-[9px] font-bold bg-indigo-200/80 text-indigo-900 px-1.5 py-0.2 rounded-md uppercase ml-auto">
              OIDC
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="h-px bg-surface-border flex-1" />
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
              atau gunakan kata sandi
            </span>
            <div className="h-px bg-surface-border flex-1" />
          </div>

          {/* Error Banner */}
          {(authError || formValidationMsg) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <p className="flex-1 font-medium text-[11px] leading-tight">{authError || formValidationMsg}</p>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  NIM atau Email BINUS
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="2602158890 atau nama@binus.ac.id"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full text-xs p-3 pl-9 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
                    required
                  />
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi akun Anda"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-xs p-3 pl-9 pr-10 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                    required
                  />
                  <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-text-muted pt-0.5">
                <span className="font-mono">Default Demo: binus123</span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('REGISTER')}
                  className="text-eco-800 hover:underline font-bold"
                >
                  Belum punya akun?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full text-xs font-black py-3.5 shadow-neon-glow"
              >
                {isLoading ? 'Memverifikasi...' : 'Masuk ke Platform →'}
              </Button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              {/* Welcome Bonus Callout */}
              <div className="p-2.5 bg-gradient-to-r from-eco-50 to-emerald-50 border border-eco-200 rounded-2xl flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-eco-neon/20 text-eco-900 border border-eco-neon/40 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-[10px] leading-tight">
                  <span className="font-black text-eco-900">Bonus Selamat Datang: </span>
                  <span className="text-text-secondary">+50 Green Coins langsung aktif setelah daftar!</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Nama Lengkap Mahasiswa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Citra Kirana"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full text-xs p-2.5 pl-8 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">
                    NIM BINUS
                  </label>
                  <input
                    type="text"
                    placeholder="2602998811"
                    value={regNim}
                    onChange={(e) => setRegNim(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">
                    Email BINUS
                  </label>
                  <input
                    type="email"
                    placeholder="nama@binus.ac.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">
                  Fakultas / School
                </label>
                <div className="relative">
                  <select
                    value={regFaculty}
                    onChange={(e) => setRegFaculty(e.target.value)}
                    className="w-full text-xs p-2.5 pl-8 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all appearance-none cursor-pointer"
                  >
                    {FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                  </select>
                  <Building2 className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Min. 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text-secondary block mb-1">
                    Konfirmasi Sandi
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Ulangi sandi"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5">
                <input
                  type="checkbox"
                  id="showPass"
                  checked={showRegPassword}
                  onChange={(e) => setShowRegPassword(e.target.checked)}
                  className="rounded text-eco-700 focus:ring-eco-500 h-3.5 w-3.5"
                />
                <label htmlFor="showPass" className="text-[10px] text-text-secondary cursor-pointer">
                  Tampilkan kata sandi
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full text-xs font-black py-3.5 shadow-neon-glow mt-1"
              >
                {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang & Masuk →'}
              </Button>
            </form>
          )}
        </Card>

        {/* 1-Click Fast Demo Profile Switcher for Reviewers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px bg-surface-border flex-1" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">
              Akses Cepat Demo Reviewer
            </span>
            <div className="h-px bg-surface-border flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoStudent}
              className="p-3 rounded-2xl bg-white border border-surface-border hover:border-eco-500 hover:bg-eco-50/50 transition-all text-left shadow-sm flex items-center gap-2.5 group active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-eco-neon/20 text-eco-900 border border-eco-neon/40 flex items-center justify-center shrink-0 group-hover:bg-eco-700 group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-text-primary truncate">Mahasiswa</h4>
                <p className="text-[10px] text-text-secondary truncate font-mono">budi.santoso</p>
              </div>
            </button>

            <button
              onClick={handleDemoVerifier}
              className="p-3 rounded-2xl bg-white border border-surface-border hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left shadow-sm flex items-center gap-2.5 group active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-text-primary truncate">Verifikator</h4>
                <p className="text-[10px] text-text-secondary truncate font-mono">siska.amanda</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-text-muted relative z-10">
        <p className="font-bold text-text-secondary">I-CAN MVP • Integrated Carbon-Neutral Platform</p>
        <p className="mt-0.5 font-medium">BINUS University • Student Service Office & TFI Standard</p>
      </div>
    </div>
  );
};
