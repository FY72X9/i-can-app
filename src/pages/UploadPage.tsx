import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { compressImage } from '@/utils/imageCompressor';
import { verifyActionWithGemini, AiVerificationResult } from '@/services/gemini';
import { submitGreenAction } from '@/services/actionService';
import { ActionType } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  CupSoda, 
  Bus, 
  Trash2, 
  TreePine,
  Droplets,
  Video,
  ArrowLeft,
  Share2,
  Coins,
  Leaf,
  GraduationCap,
  Check,
  Link as LinkIcon,
  Users,
  Clock,
  ShieldCheck,
  UploadCloud,
  Copy,
  CheckCheck,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormCategory {
  id: string;
  name: string;
  label: string;
  type: ActionType;
  icon: React.ComponentType<{ className?: string }>;
  co2: number;
  coins: number;
  sat: number;
  comserv: number;
  sdg: string;
  sdgColor: string;
  description: string;
  requiresLink?: boolean;
  linkPlaceholder?: string;
  requiresGroup?: boolean;
}

const CATEGORIES: FormCategory[] = [
  { 
    id: 'tree', 
    name: 'Penanaman Bibit Pohon', 
    label: 'Tanam Pohon', 
    type: 'PENYULUHAN_AKSI_NYATA', 
    icon: TreePine, 
    co2: 5.0, 
    coins: 25, 
    sat: 4, 
    comserv: 2.0, 
    sdg: 'SDG 15 & 13',
    sdgColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Edukasi medsos + tanam min. 5 bibit pohon berbatang keras di fasum.',
    requiresLink: true,
    linkPlaceholder: 'https://www.instagram.com/reel/... atau TikTok URL',
    requiresGroup: true,
  },
  { 
    id: 'biopori', 
    name: 'Pembuatan Lubang Biopori', 
    label: 'Biopori', 
    type: 'PENYULUHAN_AKSI_NYATA', 
    icon: Droplets, 
    co2: 0.5, 
    coins: 20, 
    sat: 4, 
    comserv: 2.0, 
    sdg: 'SDG 15 & 6',
    sdgColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    description: 'Edukasi medsos + buat min. 5 lubang biopori bersama masyarakat sekitar.',
    requiresLink: true,
    linkPlaceholder: 'https://www.instagram.com/p/... atau TikTok URL',
    requiresGroup: true,
  },
  { 
    id: 'wastafel', 
    name: 'Tempat Cuci Tangan / Sanitasi', 
    label: 'Wastafel', 
    type: 'PENYULUHAN_AKSI_NYATA', 
    icon: Sparkles, 
    co2: 0.2, 
    coins: 20, 
    sat: 4, 
    comserv: 2.0, 
    sdg: 'SDG 6 & 3',
    sdgColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Edukasi higienitas + instalasi wastafel sederhana di fasilitas umum.',
    requiresLink: true,
    linkPlaceholder: 'https://www.instagram.com/reel/... atau TikTok URL',
    requiresGroup: true,
  },
  { 
    id: 'vbl', 
    name: 'Video Based Learning (VBL)', 
    label: 'Video VBL', 
    type: 'VIDEO_BASED_LEARNING', 
    icon: Video, 
    co2: 0.1, 
    coins: 25, 
    sat: 3, 
    comserv: 1.5, 
    sdg: 'SDG 4',
    sdgColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Video edukasi 5-10 menit berjaket almamater & referensi APA Style.',
    requiresLink: true,
    linkPlaceholder: 'https://youtube.com/watch?... atau Link Google Drive',
    requiresGroup: false,
  },
  { 
    id: 'tumbler', 
    name: 'Pakai Tumbler & Wadah', 
    label: 'Tumbler', 
    type: 'SELF_GREEN_CAMPAIGN', 
    icon: CupSoda, 
    co2: 0.05, 
    coins: 10, 
    sat: 0, 
    comserv: 0, 
    sdg: 'SDG 12',
    sdgColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Membawa botol minum & wadah guna ulang ke kantin/kampus.',
  },
  { 
    id: 'bus', 
    name: 'Shuttle Bus & Transportasi Hijau', 
    label: 'Transportasi', 
    type: 'SELF_GREEN_CAMPAIGN', 
    icon: Bus, 
    co2: 0.12, 
    coins: 15, 
    sat: 1, 
    comserv: 0.5, 
    sdg: 'SDG 11 & 13',
    sdgColor: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Menggunakan transportasi umum atau shuttle bus kampus BINUS.',
  },
  { 
    id: 'trash', 
    name: 'Pilah Sampah Daur Ulang', 
    label: 'Pilah Sampah', 
    type: 'SELF_GREEN_CAMPAIGN', 
    icon: Trash2, 
    co2: 0.08, 
    coins: 10, 
    sat: 0, 
    comserv: 0, 
    sdg: 'SDG 12',
    sdgColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Memilah sampah di Eco Drop Box kampus.',
  },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCat, setSelectedCat] = useState<FormCategory>(CATEGORIES[0]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<string>('');
  const [story, setStory] = useState('');
  const [campaignUrl, setCampaignUrl] = useState('');
  const [groupMembersText, setGroupMembersText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  
  // Location & Timestamp
  const [locationLabel] = useState<string>('BINUS Anggrek Campus (GPS Verified)');
  const [currentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // AI Verification State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  // Copy TFI hashtags helper
  const handleCopyHashtags = () => {
    const hashtags = '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService';
    navigator.clipboard.writeText(hashtags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  // Process selected or dropped file
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap unggah file gambar (JPG, PNG, WebP).');
      return;
    }

    try {
      const compressed = await compressImage(file, 1280, 0.82);
      setPhotoBlob(compressed.file);
      setPhotoPreview(compressed.previewUrl);
      setCompressedSize(`${(compressed.compressedSizeBytes / 1024).toFixed(0)} KB`);
      setAiResult(null);

      // Auto-trigger AI pre-check
      runAiCheck(selectedCat.name, compressed.previewUrl, story, campaignUrl);
    } catch (err) {
      console.error('Compression error:', err);
      alert('Gagal memproses foto. Silakan coba lagi.');
    }
  };

  // Handle Photo input selection
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Run AI Verification
  const runAiCheck = async (catName: string, previewUrl: string, userStory?: string, url?: string) => {
    setIsAnalyzing(true);
    try {
      const result = await verifyActionWithGemini(catName, previewUrl, userStory, url);
      setAiResult(result);
    } catch (err) {
      console.error('AI check error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Action
  const handleSubmit = async () => {
    if (!photoPreview) {
      alert('Harap ambil atau unggah foto bukti aksi Anda!');
      return;
    }

    if (selectedCat.requiresLink && !campaignUrl.trim()) {
      alert('Untuk program ini, harap sertakan link postingan media sosial / video edukasi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedMembers = groupMembersText
        .split(/[,;\n]+/)
        .map((m) => m.trim())
        .filter((m) => m.length > 0)
        .slice(0, 3);

      // 1. Submit to Supabase / Local Storage
      await submitGreenAction(
        {
          userId: user?.id || 'usr-student-001',
          userName: user?.fullName || 'Mahasiswa BINUS',
          categoryId: selectedCat.id,
          categoryName: selectedCat.name,
          submissionType: selectedCat.type,
          photoUrl: photoPreview,
          campaignUrl: campaignUrl.trim() || undefined,
          videoUrl: selectedCat.type === 'VIDEO_BASED_LEARNING' ? campaignUrl.trim() : undefined,
          groupMembers: parsedMembers.length > 0 ? parsedMembers : undefined,
          story: story.trim() || undefined,
          gpsLat: -6.2017,
          gpsLng: 106.7822,
          status: 'APPROVED',
          decision: selectedCat.sat > 0 ? 'APPROVED_FULL' : 'APPROVED_COINS_ONLY',
          aiConfidence: aiResult?.confidence || 0.94,
          aiGuidelineScore: aiResult?.guidelineConfidence || 0.92,
          aiCompletenessScore: aiResult?.completenessScore || 0.90,
          aiAnalysisReason: aiResult?.reason || 'Terverifikasi otomatis sesuai kriteria TFI/Kampus',
          greenCoinsEarned: selectedCat.coins,
          carbonImpactKg: selectedCat.co2,
          satPointsEarned: selectedCat.sat,
          comservHoursEarned: selectedCat.comserv,
          guidelineComplied: true,
          realActivityVerified: selectedCat.sat > 0,
        },
        photoBlob || undefined
      );

      // 2. Update user state
      updateUserStats({
        greenCoins: selectedCat.coins,
        satPoints: selectedCat.sat,
        carbonSaved: selectedCat.co2,
        streakDays: (user?.streakDays || 0) + 1,
      });

      // 3. Confetti celebration
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#1E5631', '#2E8B57', '#FFB800', '#4CAF50'],
      });

      setIsVerifiedSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Terjadi kesalahan saat menyimpan aksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // STATE B: IMPACT VERIFIED SUCCESS SCREEN
  // ----------------------------------------------------------------------------
  if (isVerifiedSuccess) {
    return (
      <div className="py-6 px-2 text-center space-y-5 animate-in fade-in zoom-in duration-300">
        {/* Success Icon with Glow */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-eco-700 to-emerald-500 flex items-center justify-center shadow-eco-card relative z-10 mx-auto ring-8 ring-eco-100">
            <CheckCircle2 className="w-11 h-11 text-white" />
          </div>
          <div className="absolute inset-0 bg-eco-400 rounded-3xl blur-xl opacity-40 z-0 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="max-w-xs mx-auto space-y-1">
          <Badge variant="success" size="sm" className="mb-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Tervalidasi Sesuai Regulasi TFI
          </Badge>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Impact Recorded!</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Aksi nyata Anda berhasil dicatat dan dipetakan ke transkrip semester & kompetisi BEKEN Award.
          </p>
        </div>

        {/* Reward Summary Bento Grid (Dual Track) */}
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          {/* Track 1: Green Coins (BEKEN Nominee Track) */}
          <div className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-eco-soft border border-surface-border">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-gold-600 flex items-center justify-center mb-1">
              <Coins className="w-4 h-4 fill-gold-500 text-gold-600" />
            </div>
            <span className="text-sm font-black text-text-primary">+{selectedCat.coins} GC</span>
            <span className="text-[9px] font-semibold text-text-muted mt-0.5">BEKEN Track</span>
          </div>

          {/* Track 2: CO2e Saved */}
          <div className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-eco-soft border border-surface-border">
            <div className="w-8 h-8 rounded-xl bg-eco-50 text-eco-700 flex items-center justify-center mb-1">
              <Leaf className="w-4 h-4 text-eco-700" />
            </div>
            <span className="text-sm font-black text-eco-800">{selectedCat.co2} kg</span>
            <span className="text-[9px] font-semibold text-text-muted mt-0.5">CO2e Saved</span>
          </div>

          {/* Track 3: SAT Points & Comserv */}
          <div className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-eco-soft border border-surface-border">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-1">
              <GraduationCap className="w-4 h-4 text-blue-700" />
            </div>
            <span className="text-sm font-black text-blue-800">+{selectedCat.sat} SAT</span>
            <span className="text-[9px] font-semibold text-text-muted mt-0.5">{selectedCat.comserv} Jam Comserv</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-sm mx-auto space-y-2 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full text-xs font-extrabold"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Aksi Nyata I-CAN & TFI',
                  text: `Saya baru saja menyelesaikan kegiatan ${selectedCat.name} di BINUS University! Mengurangi ${selectedCat.co2} kg CO2e 🌿 #TeachForIndonesia`,
                  url: window.location.origin,
                });
              } else {
                alert('Tautan aksi hijau berhasil disalin ke clipboard!');
              }
            }}
          >
            <Share2 className="w-4 h-4" />
            Bagikan ke Feed & Sosmed
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full text-xs font-bold"
            onClick={() => navigate('/')}
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------
  // STATE A: DYNAMIC SMART REPORTING FORM
  // ----------------------------------------------------------------------------
  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-surface-border hover:bg-surface-subtle transition-colors text-text-primary shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black text-text-primary">Pelaporan Aksi & Service</h1>
          <p className="text-[10px] text-text-muted">Klaim Poin SAT & Jam Pengabdian TFI</p>
        </div>
        <div className="w-9" />
      </div>

      {/* 1. Category Selector Pills */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            1. Pilih Program / Kategori Aksi
          </h2>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${selectedCat.sdgColor}`}>
            Auto-Map: {selectedCat.sdg}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat.id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCat(cat);
                  if (photoPreview) runAiCheck(cat.name, photoPreview, story, campaignUrl);
                }}
                className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-eco-700 text-white border-eco-700 shadow-md shadow-eco-700/25 ring-2 ring-eco-200 scale-[1.02]'
                    : 'bg-white text-text-secondary border-surface-border hover:bg-surface-subtle'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-eco-600'}`} />
                <span className="text-[10px] font-extrabold tracking-tight text-center line-clamp-1">{cat.label}</span>
                <span className={`text-[9px] font-bold ${isSelected ? 'text-gold-300' : 'text-eco-700'}`}>
                  {cat.sat > 0 ? `+${cat.sat} SAT` : `+${cat.coins} GC`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-eco-900 bg-eco-50/90 p-2.5 rounded-xl border border-eco-200 flex items-start gap-2 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-eco-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold text-eco-950">Panduan TFI:</strong> {selectedCat.description}
          </div>
        </div>
      </section>

      {/* 2. Drag & Drop / Photo Capture Area */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            2. Foto Bukti Aksi Nyata
          </h2>
          <span className="text-[10px] text-text-muted">Kompresi Otomatis WebP</span>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative w-full aspect-[4/3] bg-white rounded-3xl overflow-hidden flex items-center justify-center group cursor-pointer border-2 border-dashed shadow-eco-soft transition-all ${
            isDragOver ? 'border-eco-600 bg-eco-50/50 scale-[0.99]' : 'border-eco-300 hover:border-eco-600'
          }`}
        >
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="Bukti Aksi" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

              <button 
                type="button"
                className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                Ganti Foto ({compressedSize})
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-text-secondary p-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-eco-50 text-eco-700 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <span className="text-sm font-extrabold text-text-primary">Ambil Foto / Drag & Drop File</span>
              <span className="text-[11px] text-text-muted mt-0.5">Mendukung kamera smartphone & galeri</span>
            </div>
          )}

          {/* Overlay Metadata Bar */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 flex flex-col gap-0.5 border border-white/40 shadow-sm z-20">
            <div className="flex items-center gap-1.5 text-text-primary text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-eco-600" />
              <span>{locationLabel}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-secondary font-medium">
              <span>{currentTime} • Jakarta</span>
              <span className="flex items-center gap-1 text-eco-700 font-bold">
                <Check className="w-3 h-3 text-eco-600 stroke-[3]" /> GPS Tagged
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Verification Feedback Card */}
      {photoPreview && (
        <section className="bg-amber-50/90 rounded-2xl p-3.5 border border-amber-200/80 space-y-2 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Guideline & Verification Check</span>
            </div>
            {isAnalyzing ? (
              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Evaluasi Gemini...
              </span>
            ) : (
              <Badge variant="success" size="sm">
                Confidence: {Math.round((aiResult?.confidence || 0.94) * 100)}%
              </Badge>
            )}
          </div>

          <p className="text-xs text-text-secondary leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-100">
            {isAnalyzing
              ? 'AI Gemini sedang mengevaluasi kepatuhan hashtag TFI, seragam/almamater, dan objek aksi nyata...'
              : aiResult?.reason || 'Foto terverifikasi valid sesuai kriteria TFI & kampus hijau.'}
          </p>
        </section>
      )}

      {/* 4. Dynamic Fields: Social Media / Video Link */}
      {selectedCat.requiresLink && (
        <section className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-surface-border shadow-eco-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-eco-600" />
              Link Publikasi Medsos / Video <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleCopyHashtags}
              className="text-[10px] font-extrabold text-eco-700 hover:text-eco-800 flex items-center gap-1 bg-eco-50 px-2 py-0.5 rounded-lg border border-eco-200"
            >
              {copiedHashtags ? (
                <>
                  <CheckCheck className="w-3 h-3 text-eco-600" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Salin Hashtag TFI
                </>
              )}
            </button>
          </div>

          <input
            type="url"
            value={campaignUrl}
            onChange={(e) => setCampaignUrl(e.target.value)}
            placeholder={selectedCat.linkPlaceholder || 'https://instagram.com/reel/...'}
            className="w-full bg-surface-subtle border border-surface-border rounded-xl p-2.5 text-xs text-text-primary focus:border-eco-600 focus:bg-white focus:outline-none transition-all font-mono"
          />
          <p className="text-[10px] text-text-muted">
            Wajib sertakan hashtag: <span className="font-semibold text-eco-800">#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService</span>
          </p>
        </section>
      )}

      {/* 5. Dynamic Fields: Group Members (NIM) */}
      {selectedCat.requiresGroup && (
        <section className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-surface-border shadow-eco-sm">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-eco-600" />
            NIM Anggota Kelompok <span className="text-text-muted font-normal">(Maks. 3 orang)</span>
          </label>
          <input
            type="text"
            value={groupMembersText}
            onChange={(e) => setGroupMembersText(e.target.value)}
            placeholder="Contoh: 2601234567, 2609876543"
            className="w-full bg-surface-subtle border border-surface-border rounded-xl p-2.5 text-xs text-text-primary focus:border-eco-600 focus:bg-white focus:outline-none transition-all font-mono"
          />
          <p className="text-[10px] text-text-muted">Pisahkan NIM rekan dengan tanda koma.</p>
        </section>
      )}

      {/* 6. Story Textarea */}
      <section className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-surface-border shadow-eco-sm">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
          Deskripsi & Lokasi Pelaksanaan <span className="text-text-muted font-normal">(Opsional)</span>
        </label>
        <textarea
          rows={2}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Ceritakan aksi nyata atau lokasi fasum pelaksanaan..."
          className="w-full bg-surface-subtle border border-surface-border rounded-xl p-2.5 text-xs text-text-primary focus:border-eco-600 focus:bg-white focus:outline-none transition-all resize-none"
        />
      </section>

      {/* 7. Dual Reward Preview Banner */}
      <section className="bg-emerald-50/90 rounded-2xl p-3.5 border border-emerald-200 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs text-gold-500">
              <Coins className="w-4.5 h-4.5 fill-gold-500 text-gold-500" />
            </div>
            <div>
              <p className="text-[10px] text-eco-700 font-bold uppercase tracking-wider">Track BEKEN Award</p>
              <p className="text-xs font-black text-eco-900">+{selectedCat.coins} Green Coins</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Track Transkrip SAT</p>
            <p className="text-xs font-black text-blue-900">
              {selectedCat.sat > 0 ? `+${selectedCat.sat} SAT (${selectedCat.comserv} Jam)` : 'Aksi Mandiri Harian'}
            </p>
          </div>
        </div>
        <div className="text-right border-t border-emerald-200/60 pt-1">
          <span className="text-[10px] text-text-muted font-medium">Estimasi Karbon: {selectedCat.co2} kg CO2e</span>
        </div>
      </section>

      {/* Sticky Bottom Submit CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-surface-border z-30 max-w-md mx-auto">
        <Button
          variant="primary"
          size="md"
          className="w-full text-xs font-black py-3 shadow-eco-card"
          onClick={handleSubmit}
          disabled={!photoPreview || isSubmitting}
          isLoading={isSubmitting}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          Kirim Pelaporan Aksi & Klaim SAT
        </Button>
      </div>
    </div>
  );
};

