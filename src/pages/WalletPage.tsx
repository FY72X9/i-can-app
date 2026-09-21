import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { getActions, subscribeToActions } from '@/services/actionService';
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
  const { user, loadUsersList } = useAuthStore();
  const [verifiedActions, setVerifiedActions] = useState<GreenAction[]>([]);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!user?.id) return;
      const actions = await getActions();
      if (!isMounted) return;
      const userApproved = actions.filter(
        (a) => a.status === 'APPROVED' && (a.userId === user.id || (user.nim && a.userId === user.nim))
      );
      setVerifiedActions(userApproved);
    }

    load();

    const unsubscribe = subscribeToActions(() => {
      load();
      loadUsersList().catch(console.warn);
    });

    const handleLocalSync = () => {
      load();
      loadUsersList().catch(console.warn);
    };

    window.addEventListener('ican:actions-updated', handleLocalSync);
    window.addEventListener('focus', handleLocalSync);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener('ican:actions-updated', handleLocalSync);
      window.removeEventListener('focus', handleLocalSync);
    };
  }, [user?.id, user?.nim]);

  const approvedSat = verifiedActions.reduce(
    (acc, a) => acc + (a.decision === 'APPROVED_COINS_ONLY' ? 0 : (a.satPointsEarned || 0)),
    0
  );
  const approvedComserv = verifiedActions.reduce(
    (acc, a) => acc + (a.comservHoursEarned || 0),
    0
  );
  const approvedCoins = verifiedActions.reduce(
    (acc, a) => acc + (a.greenCoinsEarned || 0),
    0
  );

  const totalSat = Math.max(user?.totalSatPoints ?? 0, approvedSat);
  const totalComserv = approvedComserv > 0 ? Number(approvedComserv.toFixed(1)) : 0;
  const totalCoins = Math.max(user?.totalGreenCoins ?? 0, approvedCoins);

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
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Header Dual-Track Standing Card */}
      <Card variant="eco" className="relative overflow-hidden text-center py-7 px-5 sm:px-6 shadow-eco-float border-white/20">
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-eco-100 text-xs font-black backdrop-blur-md border border-white/25 shadow-xs">
            <Trophy className="w-4 h-4 text-gold-neon" />
            Portofolio Rekognisi & Transkrip Mahasiswa
          </div>

          {/* Dual Balance Display Bento */}
          <div className="grid grid-cols-2 gap-3.5 max-w-md mx-auto pt-1">
            {/* Track A: Green Coins (BEKEN Track) */}
            <div className="bg-black/25 rounded-2xl p-4 sm:p-5 text-center border border-white/15 backdrop-blur-md">
              <span className="text-xs text-eco-200 font-black uppercase tracking-wider block mb-1">
                BEKEN Credits
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalCoins} <span className="text-xs font-semibold text-gold-neon">GC</span>
              </div>
              <span className="text-xs text-gold-neon font-black mt-1.5 inline-block">⚡ Top 15% Nominee</span>
            </div>

            {/* Track B: SAT & Comserv (Academic Track) */}
            <div className="bg-black/25 rounded-2xl p-4 sm:p-5 text-center border border-white/15 backdrop-blur-md">
              <span className="text-xs text-eco-200 font-black uppercase tracking-wider block mb-1">
                Transkrip SAT
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalSat} <span className="text-xs font-semibold text-eco-neon">SAT</span>
              </div>
              <span className="text-xs text-eco-neon font-black mt-1.5 inline-block">{totalComserv} Jam Comserv</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Direct Activity Mapping Info & Export Banner */}
      <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-eco-600" />
            <h3 className="text-xs sm:text-sm font-black text-text-primary">Portofolio Aksi Terverifikasi</h3>
          </div>
          <Badge variant="success" size="sm">
            {verifiedActions.length} Aksi Selesai
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Seluruh kegiatan di bawah ini telah diverifikasi langsung oleh Admin SSO & TFI dan siap disinkronisasikan ke transkrip semester myBINUS.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs sm:text-sm font-black flex items-center justify-center gap-2 py-3.5 shadow-xs rounded-2xl"
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
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-black text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-text-muted" />
            Daftar Kegiatan Riil Terverifikasi
          </h3>
        </div>

        <div className="space-y-3">
          {verifiedActions.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-surface-border shadow-eco-sm space-y-3 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-eco-50 text-eco-700 flex items-center justify-center mx-auto shadow-xs">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-text-primary">Belum Ada Aksi yang Diverifikasi</h4>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Setelah bukti aksi nyata atau event kamu disetujui oleh Tim SSO & Verifikator, poin SAT resmi dan jam community service akan terdata di sini.
              </p>
            </Card>
          ) : (
            verifiedActions.map((action) => (
              <Card key={action.id} className="p-4 sm:p-5 bg-white border-surface-border shadow-eco-sm space-y-3 hover:border-eco-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-eco-50 text-eco-700 flex items-center justify-center font-bold shadow-xs shrink-0">
                    {action.categoryId === 'tree' ? (
                      <TreePine className="w-6 h-6" />
                    ) : action.categoryId === 'vbl' ? (
                      <GraduationCap className="w-6 h-6" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-black text-text-primary leading-snug truncate">{action.categoryName}</h4>
                    <p className="text-xs text-text-muted mt-0.5 truncate">
                      {new Date(action.submittedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })} • Terverifikasi SSO
                    </p>
                  </div>
                </div>

                {/* Award Badges */}
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-black text-blue-700 block">
                    {action.satPointsEarned > 0 ? `+${action.satPointsEarned} SAT` : '+0 SAT'}
                  </span>
                  <p className="text-xs font-black text-amber-800 mt-0.5">+{action.greenCoinsEarned} GC</p>
                </div>
              </div>

              {action.story && (
                <p className="text-xs text-text-secondary bg-surface-subtle p-3 rounded-2xl italic leading-relaxed">
                  "{action.story}"
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-slate-100">
                <span>Status: <strong className="text-eco-800 font-bold">Directly Mapped</strong></span>
                <span>Dampak: <strong className="text-eco-900 font-black font-mono">{action.carbonImpactKg} kg CO2e</strong></span>
              </div>
            </Card>
          )))}
        </div>
      </div>
    </div>
  );
};
