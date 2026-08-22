import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { getActions } from '@/services/actionService';
import { GreenAction } from '@/types';
import { 
  Coins, 
  History, 
  GraduationCap,
  Clock,
  FileCheck2,
  TreePine,
  Sparkles,
  Trophy,
  CheckCircle2,
  Copy,
  Zap,
  Target,
  ShieldCheck,
  Award
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { user } = useAuthStore();
  const [verifiedActions, setVerifiedActions] = useState<GreenAction[]>([]);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  // Sample default verified actions if local storage is empty
  const defaultVerified: GreenAction[] = [
    {
      id: 'act-done-1',
      userId: user?.id || 'usr-student-001',
      userName: user?.fullName || 'Budi Santoso',
      categoryId: 'tree',
      categoryName: 'Penanaman Bibit Pohon Tabebuya',
      submissionType: 'PENYULUHAN_AKSI_NYATA',
      photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      story: 'Penyuluhan medsos & tanam 5 bibit pohon keras di fasilitas umum.',
      status: 'APPROVED',
      decision: 'APPROVED_FULL',
      greenCoinsEarned: 25,
      carbonImpactKg: 5.0,
      satPointsEarned: 4,
      comservHoursEarned: 2.0,
      submittedAt: '2026-08-18T10:30:00Z',
      verifiedAt: '2026-08-18T14:15:00Z',
    },
    {
      id: 'act-done-2',
      userId: user?.id || 'usr-student-001',
      userName: user?.fullName || 'Budi Santoso',
      categoryId: 'biopori',
      categoryName: 'Pembuatan 5 Lubang Biopori',
      submissionType: 'PENYULUHAN_AKSI_NYATA',
      photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
      story: 'Pembuatan 5 lubang biopori bersama pengelola lingkungan RT setempat.',
      status: 'APPROVED',
      decision: 'APPROVED_FULL',
      greenCoinsEarned: 20,
      carbonImpactKg: 0.5,
      satPointsEarned: 4,
      comservHoursEarned: 2.0,
      submittedAt: '2026-08-15T09:00:00Z',
      verifiedAt: '2026-08-15T11:20:00Z',
    },
    {
      id: 'act-done-3',
      userId: user?.id || 'usr-student-001',
      userName: user?.fullName || 'Budi Santoso',
      categoryId: 'bus',
      categoryName: 'Shuttle Bus BINUS Campus',
      submissionType: 'SELF_GREEN_CAMPAIGN',
      photoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
      story: 'Menggunakan shuttle bus kampus BINUS Anggrek-Syahdan.',
      status: 'APPROVED',
      decision: 'APPROVED_FULL',
      greenCoinsEarned: 15,
      carbonImpactKg: 0.12,
      satPointsEarned: 1,
      comservHoursEarned: 0.5,
      submittedAt: '2026-08-12T08:15:00Z',
      verifiedAt: '2026-08-12T09:00:00Z',
    },
  ];

  useEffect(() => {
    async function load() {
      const actions = await getActions();
      const approved = actions.filter((a) => a.status === 'APPROVED');
      setVerifiedActions(approved.length > 0 ? approved : defaultVerified);
    }
    load();
  }, []);

  const totalSat = verifiedActions.reduce((acc, a) => acc + (a.satPointsEarned || 0), 0) || (user?.totalSatPoints || 9);
  const totalComserv = verifiedActions.reduce((acc, a) => acc + (a.comservHoursEarned || 0), 0) || 4.5;
  const totalCoins = user?.totalGreenCoins || 120;

  const handleExportTranscript = () => {
    const transcriptText = `--- TRANSKRIP PORTOFOLIO AKSI I-CAN & TFI ---
Nama: ${user?.fullName || 'Budi Santoso'}
NIM: ${user?.nim || '2602158890'}
Fakultas: ${user?.facultyName || 'School of Computer Science'}
Total Poin SAT: ${totalSat} SAT
Total Jam Community Service: ${totalComserv} Jam
Total Saldo Green Coins: ${totalCoins} GC

DAFTAR KEGIATAN RIIL TERVERIFIKASI:
${verifiedActions.map((a, idx) => `${idx + 1}. [${a.categoryName}] +${a.satPointsEarned} SAT (${a.comservHoursEarned || 0} Jam Comserv) - ${new Date(a.submittedAt).toLocaleDateString('id-ID')}`).join('\n')}

Status Regulasi: Sesuai Acuan Student Service Office (SSO) & Teach For Indonesia (TFI).`;

    navigator.clipboard.writeText(transcriptText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Header Dual-Track Standing Card */}
      <Card variant="eco" className="relative overflow-hidden text-center py-6 px-4 shadow-eco-float border-white/20">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-eco-100 text-[11px] font-black backdrop-blur-md border border-white/25 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-gold-neon" />
            Portofolio Rekognisi & Transkrip Mahasiswa
          </div>

          {/* Dual Balance Display Bento */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-1">
            {/* Track A: Green Coins (BEKEN Track) */}
            <div className="bg-black/25 rounded-2xl p-4 text-center border border-white/15 backdrop-blur-md">
              <span className="text-[10px] text-eco-200 font-black uppercase tracking-wider block mb-1">
                BEKEN Credits
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalCoins} <span className="text-xs font-semibold text-gold-neon">GC</span>
              </div>
              <span className="text-[10px] text-gold-neon font-black mt-1 inline-block">⚡ Top 15% Nominee</span>
            </div>

            {/* Track B: SAT & Comserv (Academic Track) */}
            <div className="bg-black/25 rounded-2xl p-4 text-center border border-white/15 backdrop-blur-md">
              <span className="text-[10px] text-eco-200 font-black uppercase tracking-wider block mb-1">
                Transkrip SAT
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalSat} <span className="text-xs font-semibold text-eco-neon">SAT</span>
              </div>
              <span className="text-[10px] text-eco-neon font-black mt-1 inline-block">{totalComserv} Jam Comserv</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Direct Activity Mapping Info & Export Banner */}
      <Card className="p-5 bg-white space-y-3.5 border-surface-border shadow-eco-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-eco-600" />
            <h3 className="text-xs font-black text-text-primary">Portofolio Aksi Terverifikasi</h3>
          </div>
          <Badge variant="success" size="sm">
            {verifiedActions.length} Aksi Selesai
          </Badge>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Seluruh kegiatan di bawah ini telah diverifikasi langsung oleh Admin SSO & TFI dan siap disinkronisasikan ke transkrip semester myBINUS.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs font-black flex items-center justify-center gap-1.5 py-3 shadow-xs"
          onClick={handleExportTranscript}
        >
          {copiedTranscript ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-eco-700" />
              Transkrip Berhasil Disalin ke Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-eco-700" />
              Salin Ringkasan Transkrip (myBINUS / TFI)
            </>
          )}
        </Button>
      </Card>

      {/* 3. List of Verified Real Actions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-text-muted" />
            Daftar Kegiatan Riil Terverifikasi
          </h3>
        </div>

        {verifiedActions.map((action) => (
          <Card key={action.id} className="p-3.5 bg-white border-surface-border shadow-eco-sm space-y-2 hover:border-eco-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-eco-50 text-eco-700 flex items-center justify-center font-bold shadow-xs">
                  {action.categoryId === 'tree' ? (
                    <TreePine className="w-5 h-5" />
                  ) : action.categoryId === 'vbl' ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-primary">{action.categoryName}</h4>
                  <p className="text-[10px] text-text-muted">
                    {new Date(action.submittedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })} • Terverifikasi SSO
                  </p>
                </div>
              </div>

              {/* Award Badges */}
              <div className="text-right">
                <span className="text-xs font-black text-blue-700 block">
                  {action.satPointsEarned > 0 ? `+${action.satPointsEarned} SAT` : '+0 SAT'}
                </span>
                <p className="text-[10px] font-black text-amber-800">+{action.greenCoinsEarned} GC</p>
              </div>
            </div>

            {action.story && (
              <p className="text-[11px] text-text-secondary bg-surface-subtle p-2 rounded-xl italic">
                "{action.story}"
              </p>
            )}

            <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-slate-100">
              <span>Status: <strong className="text-eco-800 font-bold">Directly Mapped</strong></span>
              <span>Dampak: <strong className="text-eco-900 font-black">{action.carbonImpactKg} kg CO2e</strong></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
