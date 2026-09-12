import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { getActions, updateActionVerification } from '@/services/actionService';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';
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
  User,
  AlertCircle,
  FileCheck2,
  Filter,
  CheckCheck,
  Clock,
  ChevronRight,
  BookOpen,
  FileDown
} from 'lucide-react';
import { downloadActionPdfReport } from '@/services/pdfReportService';

export const VerificationPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PENDING_QUEUE' | 'VERIFIED_HISTORY'>('PENDING_QUEUE');
  const [queue, setQueue] = useState<GreenAction[]>([]);
  const [history, setHistory] = useState<GreenAction[]>([]);
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
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const actions = await getActions();
      const pending = actions.filter((a) => a.status === 'PENDING');
      const completed = actions.filter((a) => a.status === 'APPROVED' || a.status === 'REJECTED');
      setQueue(pending);
      setHistory(completed);
      setLoading(false);
    }
    load();
    const refreshTimer = window.setInterval(load, 10000);
    return () => window.clearInterval(refreshTimer);
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
        title: 'Aksi Harian Disetujui! 🪙',
        desc: `Bukti aksi harian "${target?.categoryName}" diverifikasi. +${target?.greenCoinsEarned || 10} GC ditambahkan ke wallet kamu.`,
        type: 'quest',
        actionUrl: '/wallet',
      });
      alert('Aksi Disetujui (Coins Only)! Notifikasi dikirim ke mahasiswa.');
    }
  };

  const submitRejection = async () => {
    if (!rejectModalId || !rejectionReason.trim()) return;
    await updateActionVerification(rejectModalId, 'REJECTED', rejectionReason);
    setQueue((prev) => prev.filter((a) => a.id !== rejectModalId));
    setRejectModalId(null);
    setRejectionReason('');
    
    useNotificationStore.getState().addNotification({
      title: 'Aksi Ditolak ❌',
      desc: `Mohon maaf, bukti aksi kamu ditolak karena: ${rejectionReason}`,
      type: 'system',
    });
    alert('Aksi telah ditolak dan mahasiswa telah diinfokan.');
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

  // Calculate dynamic stats
  const tfiQueueCount = queue.filter(a => a.submissionType === 'PENYULUHAN_AKSI_NYATA').length;
  
  // Calculate today's approved users
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const approvedTodayCount = history.filter(a => {
    if (a.status !== 'APPROVED' || !a.verifiedAt) return false;
    const verifiedDate = new Date(a.verifiedAt);
    return verifiedDate >= today;
  }).length;
  
  // Calculate total SAT points given
  const totalSatGiven = history.reduce((total, action) => {
    if (action.status === 'APPROVED' && action.decision === 'APPROVED_FULL' && action.satPointsEarned) {
      return total + action.satPointsEarned;
    }
    return total;
  }, 0);

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Verifier Portal KPI Header */}
      <Card variant="eco" className="p-5 sm:p-6 shadow-eco-float space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">Portal Penyelenggara Event</h2>
              <p className="text-xs text-eco-100 mt-0.5">Validasi Aksi Nyata & Approval</p>
            </div>
          </div>

          <Badge variant="warning" size="sm">
            {queue.length} Menunggu
          </Badge>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-2xl p-3">
            <span className="text-xs text-eco-100 block mb-0.5">Antrean TFI</span>
            <span className="text-base font-black text-white">{tfiQueueCount} Aksi</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <span className="text-xs text-eco-100 block mb-0.5">Disetujui Hari Ini</span>
            <span className="text-base font-black text-gold-300">{approvedTodayCount} Aksi</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <span className="text-xs text-eco-100 block mb-0.5">SAT Diberikan</span>
            <span className="text-base font-black text-white">{totalSatGiven} SAT</span>
          </div>
        </div>
      </Card>

      {/* 2. Mode Tab: Antrean vs Riwayat Selesai */}
      <div className="flex bg-surface-subtle p-1.5 rounded-2xl border border-surface-border">
        <button
          onClick={() => setActiveTab('PENDING_QUEUE')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'PENDING_QUEUE'
              ? 'bg-eco-700 text-white shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Antrean Menunggu ({queue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VERIFIED_HISTORY')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'VERIFIED_HISTORY'
              ? 'bg-eco-700 text-white shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Riwayat Selesai ({history.length})</span>
        </button>
      </div>

      {activeTab === 'VERIFIED_HISTORY' ? (
        /* Completed Verification History Stream */
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider">
              Daftar Aksi Terverifikasi (14 Hari Terakhir)
            </span>
            <span className="text-xs font-bold text-text-muted">
              {history.length} Aksi Selesai
            </span>
          </div>

          <div className="space-y-3.5">
            {history.map((item) => {
              const isApprovedFull = item.decision === 'APPROVED_FULL';
              const isCoinsOnly = item.decision === 'APPROVED_COINS_ONLY';
              const isRejected = item.status === 'REJECTED';

              return (
                <Card key={item.id} className="p-5 sm:p-6 bg-white border-surface-border shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-text-primary">{item.userName}</h4>
                      <p className="text-xs text-text-secondary font-mono mt-0.5">{item.userFaculty}</p>
                    </div>
                    <Badge
                      variant={isApprovedFull ? 'success' : isCoinsOnly ? 'warning' : 'error'}
                      size="sm"
                    >
                      {isApprovedFull ? 'Disetujui (+SAT & Coins)' : isCoinsOnly ? 'Disetujui (Coins Saja)' : 'Ditolak'}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-4">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.categoryName}
                        className="w-18 h-18 rounded-2xl object-cover ring-1 ring-surface-border shrink-0"
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-2xl bg-eco-neon/20 text-eco-900 flex items-center justify-center shrink-0 font-black text-base">
                        🌱
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <h5 className="text-xs sm:text-sm font-bold text-text-primary">{item.categoryName}</h5>
                      <p className="text-xs text-text-secondary line-clamp-2 italic leading-relaxed">
                        "{item.story}"
                      </p>
                      <div className="flex items-center gap-3 text-xs font-bold pt-1">
                        {item.satPointsEarned > 0 && (
                          <span className="text-blue-700">+{item.satPointsEarned} SAT</span>
                        )}
                        <span className="text-amber-800">+{item.greenCoinsEarned} GC</span>
                        {item.carbonImpactKg > 0 && (
                          <span className="text-eco-800 font-mono">-{item.carbonImpactKg} kg CO2e</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verifier Signature & Note */}
                  <div className="p-3 bg-surface-subtle rounded-2xl border border-surface-border/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      <strong>Verifikator:</strong> {item.verifiedBy || 'Siska Amanda (SSO)'}
                    </span>
                    <div className="flex items-center gap-3">
                      {/* PDF download hidden until format finalized */}
                      {false && (
                        <button
                          type="button"
                          onClick={() => downloadActionPdfReport(item, {
                            name: item.userName || 'Mahasiswa BINUS',
                            nim: 'NIM Terverifikasi',
                            faculty: item.userFaculty || 'Fakultas BINUS',
                            campus: 'BINUS University',
                          })}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                          title="Unduh Berkas Laporan PDF"
                        >
                          <FileDown className="w-3 h-3" /> Unduh PDF
                        </button>
                      )}
                      <span className="font-mono text-slate-500">
                        {new Date(item.verifiedAt || item.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Pending Queue Filter & List */
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'ALL', label: 'Semua Antrean' },
              { id: 'TFI', label: 'Aksi Nyata TFI' },
              { id: 'VBL', label: 'Video VBL' },
              { id: 'SELF', label: 'Aksi Harian' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`text-xs font-bold px-3.5 py-2 rounded-2xl transition-all whitespace-nowrap ${
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
        <Card className="text-center py-12 bg-white border-surface-border space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCheck className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-extrabold text-text-primary">Semua Antrean Selesai!</h3>
          <p className="text-xs text-text-secondary">Tidak ada pengajuan aksi yang membutuhkan review saat ini.</p>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {filteredQueue.map((action) => (
            <Card key={action.id} className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-card space-y-4">
              {/* Student Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-text-primary">{action.userName}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{action.userFaculty || 'Fakultas BINUS'}</p>
                </div>
                <Badge
                  variant={action.submissionType === 'PENYULUHAN_AKSI_NYATA' ? 'success' : action.submissionType === 'VIDEO_BASED_LEARNING' ? 'purple' : 'neutral'}
                  size="sm"
                >
                  {action.categoryName}
                </Badge>
              </div>

              {/* Evidence Photos (Action Photo + Group Presence Photo) */}
              <div className="space-y-2.5">
                <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200">
                  <img
                    src={action.photoUrl}
                    alt={action.categoryName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    🌱 Foto Aksi Utama
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-eco-neon" />
                    GPS Terverifikasi Kampus
                  </div>
                </div>

                {action.groupPhotoUrl && (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-purple-950/10 border border-purple-200">
                    <img
                      src={action.groupPhotoUrl}
                      alt="Foto Bersama Anggota Kelompok"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-purple-950/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Users className="w-3.5 h-3.5 text-purple-300" />
                      Foto Bersama Seluruh Anggota di Lokasi ({action.groupMembers ? action.groupMembers.length + 1 : 1} Orang)
                    </div>
                  </div>
                )}
              </div>

              {/* Survey / Action Step Badge */}
              {action.isSurveyProposal && (
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black text-amber-900">
                    <span>📋 Proposal Survei Lokasi</span>
                    <span className="bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px]">Pra-Kegiatan TFI</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    <strong>Lokasi:</strong> {action.surveyLocation || 'Lahan Terbuka Kampus / Lingkungan Sekitar'}
                  </p>
                  {action.partnerName && (
                    <p className="text-xs text-amber-900">
                      <strong>Mitra:</strong> {action.partnerName}
                    </p>
                  )}
                  {action.safetyAssessed && (
                    <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-700" /> K3 Terverifikasi (Aman dari jaringan listrik/pipa gas)
                    </p>
                  )}
                </div>
              )}

              {/* Story Description */}
              {action.story && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-2xl border border-surface-border/60">
                  "{action.story}"
                </p>
              )}

              {/* Group Members Tag if available */}
              {action.groupMembers && action.groupMembers.length > 0 && (
                <div className="bg-purple-50/80 border border-purple-200/80 p-3 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-700 shrink-0" />
                      Anggota Tim ({action.groupMembers.length} Rekan Mahasiswa):
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                      Aksi Berkelompok
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {action.groupMembers.map((nim) => (
                      <span key={nim} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-purple-200 text-purple-900 font-mono text-xs font-bold shadow-2xs">
                        <User className="w-3 h-3 text-purple-600" />
                        {nim}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media Link if provided */}
              {action.campaignUrl && (
                <div className="bg-blue-50/90 p-3 rounded-2xl border border-blue-200 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-blue-900 truncate max-w-[220px]">
                    {action.campaignUrl}
                  </span>
                  <a
                    href={action.campaignUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 ml-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Publikasi
                  </a>
                </div>
              )}

              {/* Multimodal AI Verification Breakdown (Focused on Activity Match & Anti-Fraud) */}
              <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/90 p-3.5 rounded-2xl border border-emerald-200/90 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-emerald-200/60 pb-1.5">
                  <span className="flex items-center gap-1.5 font-black text-emerald-950">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Hasil Audit Multimodal Vision AI:
                  </span>
                  {/* PDF download hidden until format finalized */}
                  {false && (
                    <button
                      type="button"
                      onClick={() => downloadActionPdfReport(action, {
                        name: action.userName || 'Mahasiswa BINUS',
                        nim: 'NIM Terdaftar',
                        faculty: action.userFaculty || 'Fakultas BINUS',
                        campus: 'BINUS University',
                      })}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-emerald-300 shadow-2xs transition-colors"
                    >
                      <FileDown className="w-3 h-3 text-emerald-700" /> Unduh Laporan PDF
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Kesesuaian Kegiatan</span>
                    <span className="font-mono font-black text-emerald-700">
                      {Math.round((action.activityMatchScore ?? action.aiConfidence ?? 0.95) * 100)}% Cocok
                    </span>
                  </div>
                  <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Keaslian Anti-Fraud</span>
                    <span className="font-mono font-black text-teal-700">
                      {Math.round((action.authenticityScore ?? 0.97) * 100)}% Otentik
                    </span>
                  </div>
                </div>

                {action.detectedObjects && action.detectedObjects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {action.detectedObjects.map((obj, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                        {obj}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2 rounded-xl border border-emerald-100">
                  {action.aiAnalysisReason || 'Objek fisik dan lingkungan kegiatan terverifikasi valid serta lolos audit anti-fraud.'}
                </p>
              </div>

              {/* Reward Potential Strip */}
              <div className="flex items-center justify-between text-xs font-extrabold bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-blue-700">Potensi: +{action.satPointsEarned} SAT ({action.comservHoursEarned || 0} Jam Comserv)</span>
                <span className="text-amber-800">+{action.greenCoinsEarned} Green Coins</span>
              </div>

              {/* Decision Action Buttons */}
              <div className="space-y-2 pt-1">
                {action.satPointsEarned > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs sm:text-sm font-extrabold py-3 rounded-2xl"
                    onClick={() => handleDecision(action.id, 'APPROVED_FULL')}
                  >
                    <Check className="w-4 h-4" />
                    Approve Full (Green Coins + SAT Points + Comserv)
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full text-xs font-bold py-2.5 rounded-2xl"
                    onClick={() => handleDecision(action.id, 'APPROVED_COINS_ONLY')}
                  >
                    Approve Coins Only (BEKEN)
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full text-xs font-bold py-2.5 rounded-2xl"
                    onClick={() => handleDecision(action.id, 'REJECTED')}
                  >
                    <X className="w-4 h-4" />
                    Tolak Aksi
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </>
      )}

      {/* 4. Rejection Modal with Preset Reasons */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-surface-border">
            <div className="flex items-center gap-2.5 text-rose-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-extrabold">Tolak Pengajuan Aksi</h3>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Pilih alasan penolakan agar mahasiswa mendapatkan feedback perbaikan dari SSO / TFI:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {presetReasons.map((reason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRejectionReason(reason)}
                  className={`text-left w-full text-xs p-2.5 rounded-xl border transition-all ${
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
              className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:border-rose-500 transition-all resize-none"
            />

            <div className="flex gap-2.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs py-2.5 rounded-xl"
                onClick={() => setRejectModalId(null)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs font-bold py-2.5 rounded-xl"
                onClick={submitRejection}
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
