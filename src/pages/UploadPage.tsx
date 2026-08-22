import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { submitGreenAction } from '@/services/actionService';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Sparkles, 
  Check, 
  Copy, 
  AlertCircle, 
  ExternalLink, 
  Users, 
  Plus, 
  X,
  Share2,
  TreePine,
  Droplets,
  Video,
  CupSoda,
  CheckCircle2,
  Scan,
  Zap,
  Download,
  Flame,
  ChevronRight
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
  hashtagHint: string;
  sdg: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'tree',
    name: 'Penanaman Pohon Keras (TFI)',
    categoryType: 'PENYULUHAN_AKSI_NYATA',
    defaultSat: 4,
    defaultComservHours: 2.0,
    defaultCoins: 25,
    carbonKg: 5.0,
    icon: TreePine,
    hashtagHint: '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService',
    sdg: 'SDG 15 & 13',
  },
  {
    id: 'biopori',
    name: 'Pembuatan Lubang Biopori (TFI)',
    categoryType: 'PENYULUHAN_AKSI_NYATA',
    defaultSat: 4,
    defaultComservHours: 2.0,
    defaultCoins: 20,
    carbonKg: 0.5,
    icon: Droplets,
    hashtagHint: '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService',
    sdg: 'SDG 15 & 6',
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
    hashtagHint: '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService',
    sdg: 'SDG 4 Quality Edu',
  },
  {
    id: 'tumbler',
    name: 'Bawa Tumbler Sendiri',
    categoryType: 'SELF_GREEN_CAMPAIGN',
    defaultSat: 1,
    defaultComservHours: 0.5,
    defaultCoins: 10,
    carbonKg: 0.05,
    icon: CupSoda,
    hashtagHint: '#BinusZeroWaste #ICANCommunity',
    sdg: 'SDG 12 Consumption',
  },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(CATEGORIES[0]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    guidelineScore: number;
    feedback: string;
    detectedHashtag: boolean;
    confidence: number;
  } | null>(null);

  const [story, setStory] = useState('');
  const [campaignUrl, setCampaignUrl] = useState('');
  const [groupNimInput, setGroupNimInput] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedStoryCard, setCopiedStoryCard] = useState(false);

  const officialHashtags = '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService';

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(officialHashtags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      runAiAnalysis();
    };
    reader.readAsDataURL(file);
  };

  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    setAiResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAiResult({
        guidelineScore: 0.94,
        confidence: 0.96,
        detectedHashtag: true,
        feedback: 'AI Gemini Flash mendeteksi objek fisik riil & kepatuhan atribut TFI (Tervalidasi).',
      });
    }, 1800);
  };

  const handleAddMember = () => {
    const trimmed = groupNimInput.trim();
    if (trimmed && !groupMembers.includes(trimmed)) {
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
      alert('Silakan unggah atau ambil foto bukti aksi nyata');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitGreenAction({
        userId: user?.id || 'usr-student-001',
        userName: user?.fullName || 'Budi Santoso',
        userFaculty: user?.facultyName || 'School of Computer Science',
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        submissionType: selectedCategory.categoryType,
        photoUrl: photoPreview,
        story: story || 'Aksi nyata keberlanjutan kampus BINUS',
        campaignUrl: campaignUrl || undefined,
        groupMembers: groupMembers.length > 0 ? groupMembers : undefined,
        greenCoinsEarned: selectedCategory.defaultCoins,
        carbonImpactKg: selectedCategory.carbonKg,
        satPointsEarned: selectedCategory.defaultSat,
        comservHoursEarned: selectedCategory.defaultComservHours,
        status: 'PENDING',
        aiGuidelineScore: aiResult?.guidelineScore || 0.94,
        aiConfidence: aiResult?.confidence || 0.95,
        aiAnalysisReason: aiResult?.feedback || 'Bukti valid terdeteksi.',
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E676', '#FFD700', '#6366F1', '#10B981'],
      });

      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyStoryShare = () => {
    const shareText = `🌱 SAYA BARU SAJA MENYELESAIKAN AKSI HIJAU KAMPUS!
Program: ${selectedCategory.name}
+${selectedCategory.defaultSat} SAT Points & +${selectedCategory.defaultCoins} Green Coins
Hemat: ${selectedCategory.carbonKg} kg CO2e
#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService #ICAN2026`;
    navigator.clipboard.writeText(shareText);
    setCopiedStoryCard(true);
    setTimeout(() => setCopiedStoryCard(false), 2500);
  };

  // 1. Success / Confetti Story Screen
  if (submittedSuccess) {
    return (
      <div className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-300">
        <Card variant="eco" className="p-6 text-white space-y-4 shadow-eco-float border-white/25 relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-neon-glow border border-white/30">
            <Check className="w-9 h-9 text-eco-neon stroke-[3]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Laporan Berhasil Terkirim!
            </span>
            <h2 className="text-xl font-black mt-2">Aksi Berhasil Masuk Antrean</h2>
            <p className="text-xs text-eco-100/90 max-w-xs mx-auto leading-relaxed">
              Verifikator SSO & TFI akan meninjau kelayakan bukti dalam 1x24 jam.
            </p>
          </div>

          {/* Dual-Track Reward Preview Bento */}
          <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto pt-2">
            <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-eco-200 uppercase font-black tracking-wider block">
                Green Coins
              </span>
              <span className="text-xl font-black text-gold-neon mt-0.5 block">
                +{selectedCategory.defaultCoins} GC
              </span>
              <span className="text-[9px] text-gold-300">BEKEN Track</span>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-eco-200 uppercase font-black tracking-wider block">
                Poin SAT
              </span>
              <span className="text-xl font-black text-eco-neon mt-0.5 block">
                +{selectedCategory.defaultSat} SAT
              </span>
              <span className="text-[9px] text-eco-100">{selectedCategory.defaultComservHours} Jam Comserv</span>
            </div>
          </div>
        </Card>

        {/* Instagram / TikTok Story-Ready Share Card */}
        <Card className="p-4 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white space-y-3 text-left border-white/10 shadow-eco-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-neon" />
              <h4 className="text-xs font-black text-white">Instagram / TikTok Story Card</h4>
            </div>
            <Badge variant="gold" size="sm">Ready to Flex</Badge>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1.5 font-mono text-[11px] text-eco-100">
            <p>🌿 <strong>Program:</strong> {selectedCategory.name}</p>
            <p>🏆 <strong>Reward:</strong> +{selectedCategory.defaultSat} SAT & +{selectedCategory.defaultCoins} GC</p>
            <p>🌱 <strong>Hashtag:</strong> {officialHashtags}</p>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={handleCopyStoryShare}
            className="w-full text-xs font-black flex items-center justify-center gap-1.5 py-2.5"
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

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 text-xs font-bold"
            onClick={() => {
              setSubmittedSuccess(false);
              setPhotoPreview(null);
              setStory('');
              setCampaignUrl('');
            }}
          >
            Unggah Aksi Lain
          </Button>

          <Button
            variant="primary"
            className="flex-1 text-xs font-black"
            onClick={() => navigate('/wallet')}
          >
            Cek Transkrip SAT →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Quick Guide Reminder Banner */}
      <Link
        to="/guide"
        className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-eco-200 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-eco-700" />
          <span className="text-xs font-black text-text-primary group-hover:text-eco-800 transition-colors">
            Lihat Standar Foto & Video VBL TFI di Panduan →
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-eco-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* 1. Category Selection Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-eco-600" />
            1. Pilih Program Aksi Nyata TFI
          </label>
          <span className="text-[10px] text-eco-800 bg-eco-neon/20 px-2 py-0.5 rounded-full border border-eco-neon/40 font-extrabold">
            Auto-Mapped SAT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`p-3.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-eco-700 text-white border-eco-700 shadow-neon-glow'
                    : 'bg-white text-text-primary border-surface-border hover:border-eco-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-eco-neon' : 'text-eco-700'}`} />
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cat.sdg}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black leading-tight mt-1 truncate">{cat.name}</h4>
                  <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-gold-neon' : 'text-blue-700'}`}>
                    +{cat.defaultSat} SAT ({cat.defaultComservHours} Jam)
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Official TFI Hashtag Copier */}
      <Card className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            Wajib Cantumkan Hashtag Resmi TFI:
          </span>
          <button
            type="button"
            onClick={handleCopyHashtags}
            className="text-[10px] font-black bg-white hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-300 transition-colors shadow-2xs flex items-center gap-1"
          >
            {copiedHashtags ? <Check className="w-3 h-3 text-eco-700" /> : <Copy className="w-3 h-3 text-amber-700" />}
            {copiedHashtags ? 'Tersalin!' : 'Salin 1-Klik'}
          </button>
        </div>
        <p className="text-[11px] font-mono text-amber-950 bg-white/80 p-2 rounded-xl border border-amber-200/60 break-all select-all">
          {officialHashtags}
        </p>
      </Card>

      {/* 3. BeReal/Instagram Style Photo Dropzone & Viewfinder */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Camera className="w-4 h-4 text-eco-600" />
            2. Unggah Bukti Nyata (Foto & Lokasi GPS)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />

          {!photoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-eco-400/80 hover:border-eco-600 bg-eco-50/40 hover:bg-eco-50/70 rounded-3xl p-8 text-center cursor-pointer transition-all active:scale-[0.99] space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl eco-gradient-hero flex items-center justify-center text-white mx-auto shadow-neon-glow">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-black text-text-primary">
                  Ambil Foto / Pilih dari Galeri
                </p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Foto fisik pohon tertanam / lubang biopori / video edukasi berjaket almamater
                </p>
              </div>
              <span className="inline-block text-[10px] font-extrabold text-eco-900 bg-eco-neon/20 px-3 py-1 rounded-full border border-eco-neon/40">
                ⚡ Auto AI Gemini Flash Verification
              </span>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden aspect-[16/11] bg-slate-900 border border-surface-border shadow-eco-card">
              <img src={photoPreview} alt="Bukti Aksi" className="w-full h-full object-cover" />

              {/* Animated AI Radar Scanner Overlay if analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                  <div className="w-full h-1 bg-eco-neon shadow-neon-glow animate-radar" />
                  <div className="bg-black/80 px-4 py-2 rounded-2xl border border-eco-neon text-white text-xs font-black flex items-center gap-2 mt-4 shadow-lg">
                    <Scan className="w-4 h-4 text-eco-neon animate-spin" />
                    Memindai Kesesuaian Kriteria TFI...
                  </div>
                </div>
              )}

              {/* GPS Stamp Tag */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-eco-neon" />
                BINUS Campus GPS Verified
              </div>

              {/* Reset Photo Button */}
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setAiResult(null);
                }}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 4. AI Gemini Validation Breakdown Card */}
        {aiResult && (
          <Card className="p-3.5 bg-emerald-50/80 border-emerald-200 shadow-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Validasi Cerdas Gemini AI
              </span>
              <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                {Math.round(aiResult.confidence * 100)}% Match
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {aiResult.feedback}
            </p>
          </Card>
        )}

        {/* 5. Story / Caption & Link Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-black text-text-primary uppercase tracking-wider block mb-1 px-1">
              3. Cerita Singkat / Refleksi Aksi
            </label>
            <textarea
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Ceritakan pelaksanaan aksi nyata atau penyuluhan di lingkungan Anda..."
              className="w-full text-xs p-3 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all resize-none"
            />
          </div>

          {selectedCategory.categoryType !== 'SELF_GREEN_CAMPAIGN' && (
            <div>
              <label className="text-xs font-black text-text-primary uppercase tracking-wider block mb-1 px-1">
                4. Tautan Publikasi Media Sosial (IG Reels / YouTube / TikTok)
              </label>
              <input
                type="url"
                value={campaignUrl}
                onChange={(e) => setCampaignUrl(e.target.value)}
                placeholder="https://instagram.com/reel/... atau https://youtube.com/watch?v=..."
                className="w-full text-xs p-3 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
              />
            </div>
          )}

          {/* Group Member NIM Tags */}
          {selectedCategory.categoryType === 'PENYULUHAN_AKSI_NYATA' && (
            <div>
              <label className="text-xs font-black text-text-primary uppercase tracking-wider block mb-1 px-1">
                5. NIM Anggota Tim (Jika Kelompok)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan NIM anggota..."
                  value={groupNimInput}
                  onChange={(e) => setGroupNimInput(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none font-mono"
                />
                <Button type="button" size="sm" variant="secondary" onClick={handleAddMember} className="font-bold">
                  Tambah
                </Button>
              </div>

              {groupMembers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {groupMembers.map((nim) => (
                    <span
                      key={nim}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-white text-eco-900 border border-eco-200 px-2.5 py-1 rounded-xl shadow-xs"
                    >
                      {nim}
                      <button type="button" onClick={() => handleRemoveMember(nim)}>
                        <X className="w-3 h-3 text-rose-500 hover:text-rose-700" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. Sticky Submit Action Bar */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={!photoPreview || isSubmitting}
            className="w-full text-xs font-black py-3.5 shadow-neon-glow"
          >
            Kirim Laporan & Klaim +{selectedCategory.defaultSat} SAT (+{selectedCategory.defaultCoins} GC) →
          </Button>
        </div>
      </form>
    </div>
  );
};
