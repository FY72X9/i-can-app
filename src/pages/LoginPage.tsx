import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { Leaf, GraduationCap, ShieldCheck, QrCode, Sparkles, ArrowRight, Compass, Zap } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col justify-between p-4 max-w-md mx-auto py-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-eco-neon/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-gold-neon/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Hero */}
      <div className="text-center space-y-3 pt-4 relative z-10">
        <div className="w-16 h-16 rounded-3xl eco-gradient-hero flex items-center justify-center mx-auto shadow-neon-glow ring-8 ring-eco-100/80">
          <Leaf className="w-9 h-9 text-white" />
        </div>

        <div>
          <Badge variant="eco" size="sm" className="mb-1 font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-gold-neon" />
            BINUS Sustainability 2026
          </Badge>
          <h1 className="text-2xl font-black text-text-primary mt-1">I-CAN Platform</h1>
          <p className="text-xs text-text-secondary max-w-xs mx-auto mt-1 leading-relaxed">
            Laporkan Aksi Hijau & Pengabdian TFI Menjadi <b>SAT Points</b> & Portofolio myBINUS.
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="space-y-4 my-6 relative z-10">
        <Card className="p-5 bg-white space-y-4 shadow-eco-card border-surface-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Masuk Mahasiswa BINUS
            </h2>
            <span className="text-[10px] text-eco-900 font-black bg-eco-neon/20 px-2 py-0.5 rounded-full border border-eco-neon/40">
              @binus.ac.id
            </span>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                placeholder="Contoh: 2602158890"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full text-xs p-3 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">
                Nama Lengkap <span className="text-text-muted font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full text-xs font-black py-3.5 shadow-neon-glow">
              Masuk ke Dashboard →
            </Button>
          </form>
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
                <p className="text-[10px] text-text-secondary truncate">Budi Santoso</p>
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
                <p className="text-[10px] text-text-secondary truncate">Siska Amanda</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-text-muted relative z-10">
        <p className="font-bold text-text-secondary">I-CAN MVP • Integrated Carbon-Neutral Platform</p>
        <p className="mt-0.5 font-medium">BINUS University • Student Service Office & TFI Standard</p>
      </div>
    </div>
  );
};
