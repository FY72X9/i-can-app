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
  const { user, loadUsersList, updateUserStats } = useAuthStore();
  const [verifiedActions, setVerifiedActions] = useState<GreenAction[]>([]);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  const handleClaimComserv = (hours: number, coinsCost: number) => {
    if (!user) return;
    if ((user.totalGreenCoins || 0) < coinsCost) {
      alert(`Saldo Green Coins tidak mencukupi (butuh ${coinsCost} GC)`);
      return;
    }

    updateUserStats({
      greenCoins: -coinsCost,
      comservHours: hours,
    });

    setClaimSuccessMsg(
      `Berhasil klaim ${hours} Jam Comserv TFI! Saldo terpotong ${coinsCost} GC. Total akumulasi Green Coins & status Badge di Profil Anda tetap aman.`
    );
    setTimeout(() => setClaimSuccessMsg(null), 6000);
  };

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

  const approvedComserv = verifiedActions.reduce(
    (acc, a) => acc + (a.comservHoursEarned || 0),
    0
  );
  const approvedCoins = verifiedActions.reduce(
    (acc, a) => acc + (a.greenCoinsEarned || 0),
    0
  );

  const totalComserv = Math.max(user?.totalComservHours ?? 0, approvedComserv);
  const totalCoins = Math.max(user?.totalGreenCoins ?? 0, approvedCoins);

  const handleExportTranscript = () => {
    const transcriptText = `--- TRANSKRIP PORTOFOLIO AKSI I-CAN & TFI ---
Nama: ${user?.fullName || 'Budi Santoso'}
NIM: ${user?.nim || '2602158890'}
Fakultas: ${user?.facultyName || 'School of Computer Science'}
Total Jam Community Service (Comserv TFI): ${totalComserv} Jam
Total Saldo Green Coins: ${totalCoins} GC

DAFTAR KEGIATAN RIIL TERVERIFIKASI:
${verifiedActions.map((a, idx) => `${idx + 1}. [${a.categoryName}] +${a.comservHoursEarned || 0} Jam Comserv (+${a.greenCoinsEarned} GC) - ${new Date(a.submittedAt).toLocaleDateString('id-ID')}`).join('\n')}

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

            {/* Track B: Comserv TFI (Academic Track) */}
            <div className="bg-black/25 rounded-2xl p-4 sm:p-5 text-center border border-white/15 backdrop-blur-md">
              <span className="text-xs text-eco-200 font-black uppercase tracking-wider block mb-1">
                Jam Comserv TFI
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalComserv} <span className="text-xs font-semibold text-eco-neon">Jam</span>
              </div>
              <span className="text-xs text-eco-neon font-black mt-1.5 inline-block">Target 30 Jam Kelulusan</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 1B. Konversi Green Coins ke Jam Comserv TFI Card */}
      <Card className="p-5 sm:p-6 bg-white space-y-4 border-surface-border shadow-eco-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-text-primary">Klaim Jam Comserv TFI dari Green Coins</h3>
              <p className="text-xs text-text-secondary mt-0.5">Kurs: 50 Green Coins = 1 Jam Community Service TFI</p>
            </div>
          </div>
          <Badge variant="gold" size="sm">
            50 GC = 1 Jam
          </Badge>
        </div>

        {claimSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">{claimSuccessMsg}</p>
            </div>
          </div>
        )}

        <div className="bg-surface-subtle p-3.5 rounded-2xl border border-surface-border space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Saldo Green Coins Tersedia:</span>
            <span className="font-black text-amber-800 font-mono text-sm">{user?.totalGreenCoins ?? 0} GC</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              variant="primary"
              size="sm"
              disabled={(user?.totalGreenCoins ?? 0) < 50}
              onClick={() => handleClaimComserv(1, 50)}
              className="w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 shadow-eco-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Klaim 1 Jam Comserv (-50 GC)</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={(user?.totalGreenCoins ?? 0) < 100}
              onClick={() => handleClaimComserv(2, 100)}
              className="w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-neon" />
              <span>Klaim 2 Jam Comserv (-100 GC)</span>
            </Button>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            🛡️ <b>Ketentuan Badge & Leaderboard:</b> Penukaran Green Coins ini hanya memotong saldo dompet Anda untuk klaim jam Comserv TFI. <b>Total perolehan kotor (Lifetime Green Coins) dan perolehan Badge di Profile Anda tetap aman dan tidak akan berkurang.</b>
          </p>
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
                Setelah bukti aksi nyata atau event kamu disetujui oleh Tim SSO & Verifikator, jam community service dan Green Coins resmi akan terdata di sini.
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
                    +{action.comservHoursEarned || 0} Jam Comserv
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
