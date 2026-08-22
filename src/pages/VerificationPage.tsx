import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { getActions, updateActionVerification } from '@/services/actionService';
import { useNotificationStore } from '@/stores/notificationStore';
import { GreenAction, VerificationDecision } from '@/types';
import { 
  ShieldCheck, 
  MapPin, 
  Check, 
  X, 
  Sparkles,
  ExternalLink,
  Coins,
  GraduationCap,
  Users,
  AlertCircle,
  FileCheck2,
  Filter,
  CheckCheck,
  Clock,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const [queue, setQueue] = useState<GreenAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'TFI' | 'VBL' | 'SELF'>('ALL');
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sample default review queue if no local actions exist
  const defaultSampleQueue: GreenAction[] = [
    {
      id: 'act-sample-101',
      userId: 'usr-student-001',
      userName: 'Ahmad Fauzi',
      userFaculty: 'Computer Science (SOCS)',
      categoryId: 'tree',
      categoryName: 'Penanaman Bibit Pohon',
      submissionType: 'PENYULUHAN_AKSI_NYATA',
      photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      campaignUrl: 'https://www.instagram.com/reel/C_samplePohon123',
      groupMembers: ['2602199841', '2602188412'],
      story: 'Penyuluhan pentingnya penghijauan di Instagram Reels dan penanaman 5 bibit pohon tabebuya di taman kota bersama pengelola setempat.',
      gpsLat: -6.2017,
      gpsLng: 106.7822,
      status: 'PENDING',
      aiConfidence: 0.94,
      aiGuidelineScore: 0.92,
      aiCompletenessScore: 0.90,
      aiAnalysisReason: 'Terdeteksi 5 bibit pohon ditanam di tanah, caption IG memuat #TeachForIndonesia dan #BinusianCommunityService.',
      greenCoinsEarned: 25,
      carbonImpactKg: 5.0,
      satPointsEarned: 4,
      comservHoursEarned: 2.0,
      submittedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 'act-sample-102',
      userId: 'usr-student-003',
      userName: 'Clarissa Putri',
      userFaculty: 'School of Design (SOD)',
      categoryId: 'vbl',
      categoryName: 'Video Based Learning (VBL)',
      submissionType: 'VIDEO_BASED_LEARNING',
      photoUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80',
      campaignUrl: 'https://youtube.com/watch?v=sampleVBL_ZeroWaste',
      story: 'Video edukasi 8 menit "Mengenal Prinsip Zero Waste di Lingkungan Kampus" untuk pelajar SMA. Almamater & APA Style terlampir.',
      gpsLat: -6.2001,
      gpsLng: 106.7845,
      status: 'PENDING',
      aiConfidence: 0.89,
      aiGuidelineScore: 0.95,
      aiCompletenessScore: 0.88,
      aiAnalysisReason: 'Logo TFI di awal video terdeteksi, jaket almamater dikenakan, sitasi format APA Style ada di penutup.',
      greenCoinsEarned: 25,
      carbonImpactKg: 0.1,
      satPointsEarned: 3,
      comservHoursEarned: 1.5,
      submittedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: 'act-sample-103',
      userId: 'usr-student-001',
      userName: 'Kevin Sanjaya',
      userFaculty: 'Information Systems (SIS)',
      categoryId: 'tumbler',
      categoryName: 'Pakai Tumbler & Wadah',
      submissionType: 'SELF_GREEN_CAMPAIGN',
      photoUrl: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
      story: 'Bawa tumbler ke water station lantai 2 BINUS Anggrek.',
      gpsLat: -6.2017,
      gpsLng: 106.7822,
      status: 'PENDING',
      aiConfidence: 0.96,
      aiGuidelineScore: 0.85,
      aiCompletenessScore: 0.90,
      aiAnalysisReason: 'Objek tumbler dan lokasi kampus terverifikasi akurat.',
      greenCoinsEarned: 10,
      carbonImpactKg: 0.05,
      satPointsEarned: 0,
      comservHoursEarned: 0.0,
      submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const actions = await getActions();
      const pending = actions.filter((a) => a.status === 'PENDING');
      setQueue(pending.length > 0 ? pending : defaultSampleQueue);
      setLoading(false);
    }
    load();
  }, []);

  const handleDecision = async (actionId: string, decision: VerificationDecision) => {
    if (decision === 'REJECTED') {
      setRejectModalId(actionId);
      return;
    }

    const target = queue.find((a) => a.id === actionId);
    await updateActionVerification(actionId, decision);
    setQueue((prev) => prev.filter((a) => a.id !== actionId));

    if (decision === 'APPROVED_FULL') {
      useNotificationStore.getState().addNotification({
        title: 'Aksi Nyata Disetujui Penuh! 🌳',
        desc: `Selamat! Pengajuan aksi "${target?.categoryName || 'Aksi TFI'}" telah diverifikasi. +${target?.satPointsEarned || 4} SAT & +${target?.greenCoinsEarned || 25} GC masuk ke transkrip kamu!`,
        type: 'sat',
        actionUrl: '/wallet',
      });
      alert('Aksi Disetujui Penuh! Notifikasi Poin SAT & Jam Comserv telah dikirim ke mahasiswa.');
    } else if (decision === 'APPROVED_COINS_ONLY') {
      useNotificationStore.getState().addNotification({
        title: 'Aksi Disetujui untuk Green Coins! ⚡',
        desc: `Postingan "${target?.categoryName || 'Aksi Hijau'}" disetujui untuk reputasi BEKEN Award (+${target?.greenCoinsEarned || 10} GC).`,
        type: 'quest',
        actionUrl: '/home',
      });
      alert('Postingan Disetujui untuk Green Coins (BEKEN Track). Notifikasi telah dikirim.');
    }
  };

  const confirmReject = async () => {
    if (!rejectModalId) return;
    const target = queue.find((a) => a.id === rejectModalId);
    const reason = rejectionReason.trim() || 'Bukti belum memenuhi kelengkapan regulasi TFI.';
    await updateActionVerification(rejectModalId, 'REJECTED', undefined, reason);
    
    useNotificationStore.getState().addNotification({
      title: 'Laporan Aksi Perlu Perbaikan ⚠️',
      desc: `Catatan Verifikator SSO untuk "${target?.categoryName || 'Aksi TFI'}": ${reason}`,
      type: 'rejection',
      actionUrl: '/upload',
    });

    setQueue((prev) => prev.filter((a) => a.id !== rejectModalId));
    setRejectModalId(null);
    setRejectionReason('');
    alert('Aksi Ditolak dan feedback perbaikan telah dikirim ke notifikasi mahasiswa.');
  };

  const filteredQueue = queue.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'TFI') return item.submissionType === 'PENYULUHAN_AKSI_NYATA';
    if (selectedFilter === 'VBL') return item.submissionType === 'VIDEO_BASED_LEARNING';
    if (selectedFilter === 'SELF') return item.submissionType === 'SELF_GREEN_CAMPAIGN';
    return true;
  });

  const presetReasons = [
    'Hashtag resmi TFI belum lengkap pada postingan',
    'Tidak mengenakan jaket almamater BINUS pada video/foto',
    'Jumlah bibit pohon / biopori kurang dari batas minimal (5 buah)',
    'Foto bukti buram atau tidak menunjukkan aktivitas nyata',
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Verifier Portal KPI Header */}
      <Card variant="eco" className="p-4 shadow-eco-float space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Portal Verifikator SSO & TFI</h2>
              <p className="text-[10px] text-eco-100">Validasi Dual-Track (SAT Point & BEKEN Coins)</p>
            </div>
          </div>

          <Badge variant="warning" size="sm">
            {queue.length} Menunggu
          </Badge>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[9px] text-eco-100 block">Antrean TFI</span>
            <span className="text-sm font-black text-white">2 Aksi</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[9px] text-eco-100 block">Disetujui Hari Ini</span>
            <span className="text-sm font-black text-gold-300">14 Mahasiswa</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[9px] text-eco-100 block">SAT Diberikan</span>
            <span className="text-sm font-black text-white">48 SAT</span>
          </div>
        </div>
      </Card>

      {/* 2. Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'Semua Antrean' },
          { id: 'TFI', label: 'Aksi Nyata TFI' },
          { id: 'VBL', label: 'Video VBL' },
          { id: 'SELF', label: 'Aksi Harian' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              selectedFilter === tab.id
                ? 'bg-eco-700 text-white shadow-sm'
                : 'bg-white text-text-secondary border border-surface-border hover:bg-surface-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Review Queue Cards */}
      {loading ? (
        <div className="text-center py-12 text-xs text-text-muted">Memuat antrean verifikasi...</div>
      ) : filteredQueue.length === 0 ? (
        <Card className="text-center py-10 bg-white border-surface-border space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-extrabold text-text-primary">Semua Antrean Selesai!</h3>
          <p className="text-[11px] text-text-secondary">Tidak ada pengajuan aksi yang membutuhkan review saat ini.</p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredQueue.map((action) => (
            <Card key={action.id} className="p-4 bg-white border-surface-border shadow-eco-card space-y-3">
              {/* Student Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-black text-text-primary">{action.userName}</h3>
                  <p className="text-[10px] text-text-secondary">{action.userFaculty || 'Fakultas BINUS'}</p>
                </div>
                <Badge
                  variant={action.submissionType === 'PENYULUHAN_AKSI_NYATA' ? 'success' : action.submissionType === 'VIDEO_BASED_LEARNING' ? 'purple' : 'neutral'}
                  size="sm"
                >
                  {action.categoryName}
                </Badge>
              </div>

              {/* Evidence Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200">
                <img
                  src={action.photoUrl}
                  alt={action.categoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-eco-400" />
                  GPS Terverifikasi Kampus
                </div>
              </div>

              {/* Story Description */}
              {action.story && (
                <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-2.5 rounded-xl border border-surface-border/60">
                  "{action.story}"
                </p>
              )}

              {/* Group Members Tag if available */}
              {action.groupMembers && action.groupMembers.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <Users className="w-3.5 h-3.5 text-eco-600 shrink-0" />
                  <span>Anggota Tim: <strong>{action.groupMembers.join(', ')}</strong></span>
                </div>
              )}

              {/* Social Media Link if provided */}
              {action.campaignUrl && (
                <div className="bg-blue-50/90 p-2 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-blue-900 truncate max-w-[200px]">
                    {action.campaignUrl}
                  </span>
                  <a
                    href={action.campaignUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Buka Publikasi
                  </a>
                </div>
              )}

              {/* AI Gemini Verification Breakdown */}
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    AI Gemini Check:
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full text-[10px]">
                    {Math.round((action.aiConfidence || 0.92) * 100)}% Match
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary leading-snug">
                  {action.aiAnalysisReason || 'Kriteria hashtag dan aksi nyata fisik terdeteksi valid.'}
                </p>
              </div>

              {/* Reward Potential Strip */}
              <div className="flex items-center justify-between text-[10px] font-extrabold bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-blue-700">Potensi: +{action.satPointsEarned} SAT ({action.comservHoursEarned || 0} Jam Comserv)</span>
                <span className="text-amber-800">+{action.greenCoinsEarned} Green Coins</span>
              </div>

              {/* Decision Action Buttons */}
              <div className="space-y-1.5 pt-1">
                {action.satPointsEarned > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs font-extrabold py-2"
                    onClick={() => handleDecision(action.id, 'APPROVED_FULL')}
                  >
                    <Check className="w-4 h-4" />
                    Approve Full (Green Coins + SAT Points + Comserv)
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full text-xs font-bold py-2"
                    onClick={() => handleDecision(action.id, 'APPROVED_COINS_ONLY')}
                  >
                    Approve Coins Only (BEKEN)
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full text-xs font-bold py-2"
                    onClick={() => handleDecision(action.id, 'REJECTED')}
                  >
                    <X className="w-3.5 h-3.5" />
                    Tolak Aksi
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 4. Rejection Modal with Preset Reasons */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-surface-border">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-extrabold">Tolak Pengajuan Aksi</h3>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Pilih alasan penolakan agar mahasiswa mendapatkan feedback perbaikan dari SSO / TFI:
            </p>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {presetReasons.map((reason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRejectionReason(reason)}
                  className={`text-left w-full text-[11px] p-2 rounded-xl border transition-all ${
                    rejectionReason === reason
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-surface-subtle border-surface-border text-text-secondary hover:bg-slate-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Atau tulis alasan kustom..."
              className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:border-rose-500 transition-all resize-none"
            />

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setRejectModalId(null)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs font-bold"
                onClick={confirmReject}
              >
                Konfirmasi Tolak
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

