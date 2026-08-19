import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';
import { Leaf, GraduationCap, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs, loginWithNim } = useAuthStore();
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim) {
      alert('Masukkan NIM BINUS Anda');
      return;
    }
    loginWithNim(nim, name || 'Mahasiswa BINUS');
    navigate('/');
  };

  const handleDemoStudent = () => {
    loginAs('student');
    navigate('/');
  };

  const handleDemoVerifier = () => {
    loginAs('verifier');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 max-w-md mx-auto py-8">
      {/* Top Brand Hero */}
      <div className="text-center space-y-3 pt-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-eco-600 to-eco-500 flex items-center justify-center mx-auto shadow-eco-card shadow-eco-600/30 ring-8 ring-eco-100">
          <Leaf className="w-9 h-9 text-white" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-eco-700 bg-eco-100 px-3 py-1 rounded-full">
            BINUS Innovation Award 2026
          </span>
          <h1 className="text-2xl font-black text-text-primary mt-2">I-CAN Platform</h1>
          <p className="text-xs text-text-secondary max-w-xs mx-auto mt-1">
            Ubah Aksi Hijau Sehari-hari Jadi <b>SAT Points</b> & Portofolio Berkelanjutan Kampus
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="space-y-4 my-6">
        <Card className="p-5 bg-white space-y-4 shadow-eco-card">
          <h2 className="text-sm font-bold text-text-primary">Masuk Mahasiswa BINUS</h2>

          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                placeholder="Contoh: 2602158890"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Nama Lengkap <span className="text-text-muted">(Opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Masuk Sekarang →
            </Button>
          </form>
        </Card>

        {/* 1-Click Demo Profiles for Jury */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px bg-surface-border flex-1" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Akses Demo Cepat (Juri / Testing)
            </span>
            <div className="h-px bg-surface-border flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoStudent}
              className="p-3 rounded-2xl bg-white border border-surface-border hover:border-eco-500 hover:bg-eco-50/50 transition-all text-left shadow-sm flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-eco-100 text-eco-700 flex items-center justify-center shrink-0 group-hover:bg-eco-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-text-primary truncate">Akun Mahasiswa</h4>
                <p className="text-[10px] text-text-secondary">Budi Santoso</p>
              </div>
            </button>

            <button
              onClick={handleDemoVerifier}
              className="p-3 rounded-2xl bg-white border border-surface-border hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left shadow-sm flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-text-primary truncate">Akun Verifikator</h4>
                <p className="text-[10px] text-text-secondary">Siska Amanda</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-text-muted">
        <p>I-CAN MVP • Integrated Gamified Carbon-Neutral Platform</p>
        <p className="mt-0.5">BINUS University • 100% Free-Tier Architecture</p>
      </div>
    </div>
  );
};
