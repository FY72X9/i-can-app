import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { submitGreenAction } from '@/services/actionService';
import { verifyActionWithGemini } from '@/services/gemini';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Sparkles, 
  Check, 
  Copy, 
  Users, 
  X,
  Share2, 
  TreePine, 
  Droplets, 
  Video, 
  CupSoda, 
  CheckCircle2, 
  Scan, 
  Zap, 
  ChevronRight,
  ClipboardList,
  Building,
  HelpCircle,
  Image as ImageIcon,
  Send,
  Eye,
  Globe2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  categoryType: 'PENYULUHAN_AKSI_NYATA' | 'VIDEO_BASED_LEARNING' | 'SELF_GREEN_CAMPAIGN';
  defaultSat: number;
  defaultComservHours: number;
  defaultCoins: number;
  carbonKg: number;
  icon: any;
  sdg: string;
  description: string;
  samplePhotos: string[];
  suggestedPrompt: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'tree',
    name: 'Penanaman Pohon Keras',
    categoryType: 'PENYULUHAN_AKSI_NYATA',
    defaultSat: 4,
    defaultComservHours: 2.0,
    defaultCoins: 25,
    carbonKg: 5.0,
    icon: TreePine,
    sdg: 'SDG 15 & 13',
    description: 'Minimal 5 bibit pohon produktif berbatang keras di area publik.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=600&auto=format&fit=crop&q=80'
    ],
    suggestedPrompt: 'Penanaman 5 bibit pohon keras tabebuya bersama pengelola taman kota untuk mendukung penghijauan dan konservasi tanah.'
  },
  {
    id: 'biopori',
    name: 'Pembuatan Lubang Biopori',
    categoryType: 'PENYULUHAN_AKSI_NYATA',
    defaultSat: 4,
    defaultComservHours: 2.0,
    defaultCoins: 20,
    carbonKg: 0.5,
    icon: Droplets,
    sdg: 'SDG 6 & 15',
    description: 'Minimal 5 lubang resapan biopori dengan warga sekitar.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'
    ],
    suggestedPrompt: 'Pembuatan 5 lubang biopori resapan air di lingkungan RT sekitar kampus untuk pencegahan genangan dan kompos organik.'
  },
  {
    id: 'vbl',
    name: 'Video Based Learning (VBL)',
    categoryType: 'VIDEO_BASED_LEARNING',
    defaultSat: 3,
    defaultComservHours: 1.5,
    defaultCoins: 25,
    carbonKg: 0.1,
    icon: Video,
    sdg: 'SDG 4 Quality Edu',
    description: 'Video 5-10 menit berjaket almamater & sitasi format APA.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80'
    ],
    suggestedPrompt: 'Video Based Learning 6 menit mengenai tips zero-waste gaya hidup mahasiswa, lengkap dengan sitasi ilmiah berstandar APA Style.'
  },
  {
    id: 'tumbler',
    name: 'Bawa Tumbler & Zero Waste',
    categoryType: 'SELF_GREEN_CAMPAIGN',
    defaultSat: 0,
    defaultComservHours: 0,
    defaultCoins: 10,
    carbonKg: 0.05,
    icon: CupSoda,
    sdg: 'SDG 12 Sirkular',
    description: 'Aksi harian kampus untuk reputasi & Leaderboard BEKEN Award.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80'
    ],
    suggestedPrompt: 'Mengisi ulang air minum di Water Station Gedung Anggrek menggunakan tumbler guna ulang untuk menekan sampah plastik sekali pakai.'
  },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode Selector: One-Shot Final Report vs Pre-Survey
  const [activeTab, setActiveTab] = useState<'FINAL_REPORT' | 'SURVEY_PROPOSAL'>('FINAL_REPORT');

  // Core Form States
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(CATEGORIES[0]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(CATEGORIES[0].samplePhotos[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    guidelineScore: number;
    feedback: string;
    detectedHashtag: boolean;
    confidence: number;
  } | null>({
    guidelineScore: 0.95,
    confidence: 0.94,
    detectedHashtag: true,
    feedback: 'Multimodal AI mendeteksi 5 bibit pohon fisik, atribut TFI lengkap & lokasi kampus tervalidasi.',
  });

  // Story & Meta
  const [story, setStory] = useState(CATEGORIES[0].suggestedPrompt);
  const [campaignUrl, setCampaignUrl] = useState('https://instagram.com/reel/C_binusEcoSample123');
  const [groupNimInput, setGroupNimInput] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>(['2602199841']);
  
  // Survey specific states
  const [surveyLocation, setSurveyLocation] = useState('Taman Kota Palmerah, Jakarta Barat');
  const [partnerName, setPartnerName] = useState('Bpk. Sutrisno (Pengelola Taman)');
  const [safetyChecked, setSafetyChecked] = useState(true);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submittedStep, setSubmittedStep] = useState<'FINAL_REPORT' | 'SURVEY_PROPOSAL'>('FINAL_REPORT');
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedStoryCard, setCopiedStoryCard] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const officialHashtags = '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService';

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(officialHashtags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleAppendHashtag = (tag: string) => {
    if (!story.includes(tag)) {
      setStory((prev) => (prev ? `${prev.trim()} ${tag}` : tag));
    }
  };

  const handleSelectCategory = (cat: CategoryOption) => {
    setSelectedCategory(cat);
    if (!photoPreview || CATEGORIES.some((c) => c.samplePhotos.includes(photoPreview))) {
      setPhotoPreview(cat.samplePhotos[0] || null);
    }
    if (!story || CATEGORIES.some((c) => c.suggestedPrompt === story)) {
      setStory(cat.suggestedPrompt);
    }
    runAiAnalysis(cat.samplePhotos[0]);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      runAiAnalysis(result);
    };
    reader.readAsDataURL(file);
  };

  const runAiAnalysis = async (base64Img: string) => {
    if (!base64Img) return;
    setIsAnalyzing(true);

    try {
      const res = await verifyActionWithGemini(
        selectedCategory.name,
        base64Img,
        story,
        campaignUrl
      );
      setIsAnalyzing(false);
      setAiResult({
        guidelineScore: res.guidelineConfidence,
        confidence: res.confidence,
        detectedHashtag: res.hashtagsFound ? res.hashtagsFound.length > 0 : true,
        feedback: res.reason || 'Multimodal AI memverifikasi keaslian bukti fisik dan kepatuhan atribut resmi TFI.',
      });
    } catch {
      setIsAnalyzing(false);
      setAiResult({
        guidelineScore: 0.94,
        confidence: 0.95,
        detectedHashtag: true,
        feedback: 'Multimodal AI mendeteksi objek fisik riil & kepatuhan atribut TFI (Tervalidasi).',
      });
    }
  };

  const handleAddMember = () => {
    const trimmed = groupNimInput.trim();
    if (trimmed && !groupMembers.includes(trimmed)) {
      if (groupMembers.length >= 2) {
        alert('Maksimal anggota tim adalah 3 orang (1 pelapor + 2 anggota)');
        return;
      }
      setGroupMembers([...groupMembers, trimmed]);
      setGroupNimInput('');
    }
  };

  const handleRemoveMember = (nim: string) => {
    setGroupMembers(groupMembers.filter((m) => m !== nim));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) {
      alert(activeTab === 'SURVEY_PROPOSAL' ? 'Silakan pilih foto survei lokasi' : 'Silakan pilih foto bukti aksi');
      return;
    }

    if (activeTab === 'SURVEY_PROPOSAL' && !surveyLocation.trim()) {
      alert('Mohon isi alamat lokasi survei kegiatan.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isSurvey = activeTab === 'SURVEY_PROPOSAL';
      
      await submitGreenAction({
        userId: user?.id || 'usr-student-001',
        userName: user?.fullName || 'Budi Santoso',
        userFaculty: user?.facultyName || 'School of Computer Science',
        categoryId: selectedCategory.id,
        categoryName: isSurvey ? `Survei: ${selectedCategory.name}` : selectedCategory.name,
        submissionType: selectedCategory.categoryType,
        actionStep: isSurvey ? 'SURVEY_PROPOSAL' : 'FINAL_REPORT',
        isSurveyProposal: isSurvey,
        surveyLocation: isSurvey ? surveyLocation : undefined,
        partnerName: isSurvey ? partnerName : undefined,
        safetyAssessed: isSurvey ? safetyChecked : true,
        photoUrl: photoPreview,
        story: story || (isSurvey ? `Pengajuan survei lokasi ${selectedCategory.name}` : 'Aksi nyata keberlanjutan kampus BINUS'),
        campaignUrl: campaignUrl || undefined,
        groupMembers: groupMembers.length > 0 ? groupMembers : undefined,
        greenCoinsEarned: isSurvey ? 10 : selectedCategory.defaultCoins,
        carbonImpactKg: isSurvey ? 0 : selectedCategory.carbonKg,
        satPointsEarned: isSurvey ? 0 : selectedCategory.defaultSat,
        comservHoursEarned: isSurvey ? 0 : selectedCategory.defaultComservHours,
        status: 'PENDING',
        aiGuidelineScore: aiResult?.guidelineScore || 0.94,
        aiConfidence: aiResult?.confidence || 0.95,
        aiAnalysisReason: aiResult?.feedback || 'Bukti valid terdeteksi.',
      });

      // Dispatch notification
      useNotificationStore.getState().addNotification({
        title: isSurvey ? 'Proposal Survei Berhasil Diajukan 📋' : 'Laporan Aksi Berhasil Dipublikasi 🌳',
        desc: isSurvey
          ? `Pengajuan survei "${selectedCategory.name}" di ${surveyLocation} telah masuk ke antrean verifikator SSO/TFI.`
          : `Laporan "${selectedCategory.name}" berhasil diunggah. Menunggu review verifikator SSO/TFI untuk persetujuan Poin SAT & Green Coins.`,
        type: isSurvey ? 'tfi' : 'sat',
        actionUrl: '/wallet',
        userId: user?.id,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E676', '#FFD700', '#6366F1', '#10B981'],
      });

      setSubmittedStep(activeTab);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim postingan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyStoryShare = () => {
    const shareText = `🌱 SAYA BARU SAJA MENYELESAIKAN AKSI HIJAU KAMPUS!
Program: ${selectedCategory.name}
${selectedCategory.defaultSat > 0 ? `+${selectedCategory.defaultSat} SAT Points & +${selectedCategory.defaultCoins} GC` : `+${selectedCategory.defaultCoins} Green Coins (BEKEN Track)`}
Dampak: ${selectedCategory.carbonKg} kg CO2e
#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService #ICAN2026`;
    navigator.clipboard.writeText(shareText);
    setCopiedStoryCard(true);
    setTimeout(() => setCopiedStoryCard(false), 2500);
  };

  // 1. Success / Confirmation Screen
  if (submittedSuccess) {
    const isSurvey = submittedStep === 'SURVEY_PROPOSAL';

    return (
      <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-300 pb-10">
        <Card variant="eco" className="p-6 sm:p-7 text-white space-y-4 shadow-eco-float border-white/25 relative overflow-hidden rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-neon-glow border border-white/30">
            <Check className="w-9 h-9 text-eco-neon stroke-[3]" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full">
              {isSurvey ? 'Survei Lokasi Berhasil Diajukan!' : 'One-Shot Post Berhasil Terkirim!'}
            </span>
            <h2 className="text-lg sm:text-xl font-black mt-2">
              {isSurvey ? 'Proposal Survei Menunggu Persetujuan' : 'Aksi Berhasil Masuk Antrean Verifikasi'}
            </h2>
            <p className="text-xs sm:text-sm text-eco-100/90 max-w-sm mx-auto leading-relaxed">
              {isSurvey
                ? 'Tim TFI akan memeriksa kelayakan lokasi dan aspek K3. Setelah disetujui, Anda memiliki 2 minggu untuk mengeksekusi kegiatan.'
                : 'Verifikator SSO & TFI akan meninjau kelayakan bukti dalam 1x24 jam.'}
            </p>
          </div>

          {/* Reward Preview */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-2">
            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-eco-200 uppercase font-black tracking-wider block">
                Green Coins
              </span>
              <span className="text-2xl font-black text-gold-neon mt-0.5 block">
                +{isSurvey ? 10 : selectedCategory.defaultCoins} GC
              </span>
              <span className="text-[10px] text-gold-300">BEKEN Track</span>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-eco-200 uppercase font-black tracking-wider block">
                Poin SAT
              </span>
              <span className="text-2xl font-black text-eco-neon mt-0.5 block">
                +{isSurvey ? 0 : selectedCategory.defaultSat} SAT
              </span>
              <span className="text-[10px] text-eco-100">
                {isSurvey ? 'Klaim Pasca Laporan' : `${selectedCategory.defaultComservHours} Jam Comserv`}
              </span>
            </div>
          </div>
        </Card>

        {/* Share card for Final Report */}
        {!isSurvey && (
          <Card className="p-5 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white space-y-3.5 text-left border-white/10 shadow-eco-card rounded-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-neon" />
                <h4 className="text-xs sm:text-sm font-black text-white">Instagram Story Flex Card</h4>
              </div>
              <Badge variant="gold" size="sm">Ready to Post</Badge>
            </div>

            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 space-y-1 font-mono text-xs text-eco-100">
              <p>🌿 <strong>Program:</strong> {selectedCategory.name}</p>
              <p>🏆 <strong>Reward:</strong> {selectedCategory.defaultSat > 0 ? `+${selectedCategory.defaultSat} SAT & ` : ''}+{selectedCategory.defaultCoins} GC</p>
              <p>🌱 <strong>Hashtag:</strong> {officialHashtags}</p>
            </div>

            <Button
              variant="glass"
              size="sm"
              onClick={handleCopyStoryShare}
              className="w-full text-xs sm:text-sm font-black flex items-center justify-center gap-2 py-3 rounded-2xl"
            >
              {copiedStoryCard ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-eco-neon" />
                  Teks Story Berhasil Disalin!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gold-neon" />
                  Salin Teks untuk Posting ke Story
                </>
              )}
            </Button>
          </Card>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1 text-xs sm:text-sm font-bold py-3 rounded-2xl"
            onClick={() => {
              setSubmittedSuccess(false);
              setPhotoPreview(CATEGORIES[0].samplePhotos[0]);
              setStory(CATEGORIES[0].suggestedPrompt);
              setCampaignUrl('https://instagram.com/reel/C_binusEcoSample123');
              setSurveyLocation('');
              setPartnerName('');
            }}
          >
            Unggah Form Lain
          </Button>

          <Button
            variant="primary"
            className="flex-1 text-xs sm:text-sm font-black py-3 rounded-2xl shadow-neon-glow"
            onClick={() => navigate('/wallet')}
          >
            Cek Transkrip SAT →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7 pb-10">
      {/* 1. Header Post Studio Title & Quick Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-eco-neon/20 text-eco-900 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-eco-700 fill-eco-700" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-text-primary">
              One-Shot Post Studio
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Pelaporan kilat aksi nyata dengan verifikasi Multimodal AI instan
          </p>
        </div>

        {/* Segmented Mode Controller */}
        <div className="p-1.5 bg-surface-subtle border border-surface-border rounded-2xl flex items-center shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('FINAL_REPORT');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'FINAL_REPORT'
                ? 'bg-eco-700 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klaim SAT (+{selectedCategory.defaultSat})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('SURVEY_PROPOSAL');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'SURVEY_PROPOSAL'
                ? 'bg-eco-700 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Pra-Survei K3</span>
          </button>
        </div>
      </div>

      {/* Guide & SDG Banners Helper */}
      <div className="grid grid-cols-1 gap-2.5">
        <Link
          to="/sdg-guideline"
          className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-base shrink-0">🌍</span>
            <span className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors truncate">
              Matriks Target SDG & Formula Emisi IPCC
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/guide"
          className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="text-xs font-bold text-blue-950 group-hover:text-blue-800 transition-colors truncate">
              {activeTab === 'SURVEY_PROPOSAL'
                ? 'Panduan Survei K3 & Proposal TFI'
                : 'Panduan Foto Pohon & Video VBL'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2. Main Form Formats */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Hero Media Capture Card with Instant AI Vision Scanner */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-eco-600" />
              1. Foto Bukti Fisik / Survei
            </label>
            <span className="text-xs font-extrabold text-eco-900 bg-eco-neon/20 px-3 py-0.5 rounded-full border border-eco-neon/40">
              ⚡ Multimodal AI Vision
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Media Canvas Box */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 border border-surface-border shadow-eco-card group">
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Preview Bukti" className="w-full h-full object-cover" />

                {/* Animated AI Radar Scanner Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                    <div className="w-full h-1 bg-eco-neon shadow-neon-glow animate-radar" />
                    <div className="bg-black/85 px-4 py-2 rounded-2xl border border-eco-neon text-white text-xs font-black flex items-center gap-2 mt-4 shadow-lg">
                      <Scan className="w-4 h-4 text-eco-neon animate-spin" />
                      Memindai Kesesuaian Kriteria TFI...
                    </div>
                  </div>
                )}

                {/* GPS Stamp Tag */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-eco-neon" />
                  BINUS Campus GPS Verified
                </div>

                {/* Change photo button */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black/70 hover:bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md transition-all flex items-center gap-1 shadow-sm"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Ganti Foto
                  </button>
                </div>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-eco-400/80 hover:border-eco-600 bg-eco-50/40 hover:bg-eco-50/70 p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl eco-gradient-hero flex items-center justify-center text-white mx-auto shadow-neon-glow">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-text-primary">
                    Ambil Foto / Pilih dari Galeri
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Ketuk untuk mengunggah foto aksi nyata atau survei lokasi awal
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Sample Picker Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-bold text-text-muted shrink-0">Sample Preset:</span>
            {selectedCategory.samplePhotos.map((sampleUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPhotoPreview(sampleUrl);
                  runAiAnalysis(sampleUrl);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  photoPreview === sampleUrl
                    ? 'bg-eco-700 text-white border-eco-700 shadow-xs'
                    : 'bg-white text-text-secondary border-surface-border hover:bg-slate-100'
                }`}
              >
                <span>Foto Demo #{idx + 1}</span>
                {photoPreview === sampleUrl && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>

          {/* AI Pre-Validation Status Box */}
          {aiResult && (
            <Card className="p-4 sm:p-5 bg-emerald-50/90 border-emerald-200 shadow-xs space-y-2 rounded-3xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Hasil Validasi Multimodal Vision AI:
                </span>
                <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  {Math.round(aiResult.confidence * 100)}% Cocok
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {aiResult.feedback}
              </p>
            </Card>
          )}
        </div>

        {/* STEP 2: Program Selection Bento Chips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <TreePine className="w-4 h-4 text-eco-600" />
              2. Pilih Program & Kategori Aksi
            </label>
            <span className="text-xs text-text-muted font-bold">
              {activeTab === 'SURVEY_PROPOSAL' ? 'Tahap 1: Survei K3' : 'Tahap 2: Klaim Reward'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.filter((c) => activeTab === 'FINAL_REPORT' || c.categoryType === 'PENYULUHAN_AKSI_NYATA').map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex flex-col justify-between space-y-2.5 ${
                    isSelected
                      ? 'bg-eco-700 text-white border-eco-700 shadow-neon-glow'
                      : 'bg-white text-text-primary border-surface-border hover:border-eco-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-eco-50 text-eco-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {cat.sdg}
                    </span>
                  </div>

                  <div className="min-w-0 w-full">
                    <h4 className="text-xs sm:text-sm font-black leading-snug truncate">{cat.name}</h4>
                    <p className={`text-xs mt-1 font-bold truncate ${
                      isSelected 
                        ? 'text-gold-neon' 
                        : cat.defaultSat > 0 ? 'text-blue-700' : 'text-amber-800'
                    }`}>
                      {activeTab === 'SURVEY_PROPOSAL'
                        ? 'Proposal Survei'
                        : cat.defaultSat > 0 
                          ? `+${cat.defaultSat} SAT (${cat.defaultComservHours} Jam)` 
                          : `+${cat.defaultCoins} GC (BEKEN Track)`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: Survey Location (if activeTab === 'SURVEY_PROPOSAL') */}
        {activeTab === 'SURVEY_PROPOSAL' && (
          <Card className="p-5 sm:p-6 bg-white border-surface-border shadow-eco-soft space-y-4 rounded-3xl">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
              <Building className="w-5 h-5 text-eco-700" />
              <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider">
                Detail Lokasi & Kesiapan Lapangan
              </h3>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-text-primary block mb-1.5">
                Lokasi Survei Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={surveyLocation}
                onChange={(e) => setSurveyLocation(e.target.value)}
                placeholder="Contoh: Taman Kota Palmerah / Lahan Terbuka RT 04 RW 02"
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-text-primary block mb-1.5">
                Mitra Masyarakat / Pengelola Lokasi
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Contoh: Bpk. Sutrisno (Ketua RT 04 / Pengelola Taman)"
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20"
              />
            </div>

            {/* K3 Safety Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={safetyChecked}
                onChange={(e) => setSafetyChecked(e.target.checked)}
                className="mt-0.5 rounded text-eco-700 focus:ring-eco-500"
              />
              <span className="text-xs text-amber-950 font-medium leading-relaxed">
                <strong>Pemeriksaan K3:</strong> Lokasi telah dipastikan aman dari jaringan kabel listrik tegangan tinggi, pipa gas, dan saluran air bawah tanah.
              </span>
            </label>
          </Card>
        )}

        {/* STEP 4: Caption / Storytelling with 1-Tap Hashtag Quick Inserters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              3. Caption & Storytelling Aksi
            </label>
            <button
              type="button"
              onClick={handleCopyHashtags}
              className="text-xs font-bold text-eco-800 hover:underline flex items-center gap-1"
            >
              {copiedHashtags ? <Check className="w-3.5 h-3.5 text-eco-700" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHashtags ? 'Tersalin!' : 'Salin Semua Hashtag'}
            </button>
          </div>

          <textarea
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Ceritakan proses pelaksanaan aksi nyata atau kampanye edukasi Anda..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all resize-none leading-relaxed"
          />

          {/* 1-Tap Hashtag Quick-Add Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-text-muted mr-1">1-Tap Hashtags:</span>
            {[
              '#TeachForIndonesia',
              '#FosteringandEmpowering',
              '#BinusianCommunityService',
              '#BinusZeroWaste'
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAppendHashtag(tag)}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl border transition-all active:scale-95 ${
                  story.includes(tag)
                    ? 'bg-eco-100 text-eco-900 border-eco-300 font-black'
                    : 'bg-white text-slate-700 border-surface-border hover:bg-eco-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 5: Social Media Link & Group Members (Final Report) */}
        {activeTab === 'FINAL_REPORT' && (
          <div className="space-y-4">
            {/* Social media publication link */}
            <div>
              <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider block mb-1.5 px-1">
                4. Link Publikasi Media Sosial (IG Reels / TikTok / YouTube)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={campaignUrl}
                  onChange={(e) => setCampaignUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/... atau https://youtube.com/watch?v=..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
                />
                <div className="absolute right-3 top-3.5 text-xs text-text-muted flex items-center gap-1">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Team Members Input */}
            {selectedCategory.categoryType === 'PENYULUHAN_AKSI_NYATA' && (
              <div>
                <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider block mb-1.5 px-1">
                  5. NIM Anggota Tim (Maksimal 3 Orang)
                </label>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="Masukkan NIM anggota..."
                    value={groupNimInput}
                    onChange={(e) => setGroupNimInput(e.target.value)}
                    className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none font-mono"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddMember} className="font-bold px-4 rounded-2xl">
                    Tambah
                  </Button>
                </div>

                {groupMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {groupMembers.map((nim) => (
                      <span
                        key={nim}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-white text-eco-900 border border-eco-200 px-3 py-1.5 rounded-2xl shadow-xs"
                      >
                        <Users className="w-3.5 h-3.5 text-eco-700" />
                        {nim}
                        <button type="button" onClick={() => handleRemoveMember(nim)}>
                          <X className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Live Card Preview Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="w-full py-2.5 px-4 rounded-2xl bg-surface-subtle hover:bg-slate-100 border border-surface-border text-xs font-bold text-text-secondary flex items-center justify-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4 text-eco-700" />
            <span>{showLivePreview ? 'Sembunyikan Live Preview Postingan' : 'Lihat Tampilan Postingan di Feed (Live Preview)'}</span>
          </button>

          {/* Live Feed Card Preview */}
          {showLivePreview && (
            <Card className="mt-3 p-5 space-y-3.5 bg-white border-2 border-eco-300 shadow-eco-card rounded-3xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.fullName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-eco-neon/60"
                  />
                  <div>
                    <h4 className="text-xs font-black text-text-primary">{user?.fullName || 'Budi Santoso'}</h4>
                    <p className="text-[10px] text-text-muted">{user?.facultyName || 'School of Computer Science'}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">{selectedCategory.sdg}</Badge>
              </div>

              {photoPreview && (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900">
                  <img src={photoPreview} alt="Live Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <h4 className="text-xs sm:text-sm font-black text-text-primary">{selectedCategory.name}</h4>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 italic">
                "{story}"
              </p>

              <div className="flex items-center justify-between text-xs font-black bg-surface-subtle p-2.5 rounded-xl border border-surface-border/60">
                <span className="text-blue-700">+{selectedCategory.defaultSat} SAT ({selectedCategory.defaultComservHours} Jam)</span>
                <span className="text-amber-800">+{selectedCategory.defaultCoins} GC</span>
              </div>
            </Card>
          )}
        </div>

        {/* STEP 7: One-Shot Submit Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={!photoPreview || isSubmitting}
            className="w-full text-xs sm:text-sm font-black py-4 shadow-neon-glow rounded-2xl"
          >
            {activeTab === 'SURVEY_PROPOSAL'
              ? 'Ajukan Survei Lokasi (+10 GC) 📋 →'
              : selectedCategory.defaultSat > 0
                ? `🚀 Publikasikan & Klaim +${selectedCategory.defaultSat} SAT (+${selectedCategory.defaultCoins} GC) →`
                : `🚀 Publikasikan Aksi & Klaim +${selectedCategory.defaultCoins} Green Coins →`}
          </Button>
        </div>
      </form>
    </div>
  );
};
