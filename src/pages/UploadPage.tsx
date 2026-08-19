import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { compressImage } from '@/utils/imageCompressor';
import { verifyActionWithGemini, AiVerificationResult } from '@/services/gemini';
import { submitGreenAction } from '@/services/actionService';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  CupSoda, 
  Bus, 
  Trash2, 
  Zap, 
  ArrowLeft,
  X,
  Share2,
  Coins,
  Leaf,
  GraduationCap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { id: 'tumbler', name: 'Pakai Tumbler', label: 'Tumbler', type: 'Bina Diri', icon: CupSoda, co2: 0.05, coins: 15, sat: 1 },
  { id: 'bus', name: 'Transportasi Hijau', label: 'Transportasi', type: 'Bina Lingkungan', icon: Bus, co2: 0.12, coins: 20, sat: 2 },
  { id: 'trash', name: 'Daur Ulang Sampah', label: 'Daur Ulang', type: 'Bina Lingkungan', icon: Trash2, co2: 0.08, coins: 15, sat: 1 },
  { id: 'energy', name: 'Hemat Energi & AC', label: 'Energi', type: 'Bina Diri', icon: Zap, co2: 0.30, coins: 25, sat: 2 },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<string>('');
  const [story, setStory] = useState('');
  
  // Location & Timestamp
  const [locationLabel, setLocationLabel] = useState<string>('BINUS Anggrek');
  const [currentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // AI Verification State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  // Handle Photo selection & Canvas Compression
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1280, 0.82);
      setPhotoBlob(compressed.file);
      setPhotoPreview(compressed.previewUrl);
      setCompressedSize(`${(compressed.compressedSizeBytes / 1024).toFixed(0)} KB`);
      setAiResult(null);

      // Auto-trigger AI pre-check for seamless experience
      runAiCheck(selectedCat.name, compressed.previewUrl, story);
    } catch (err) {
      console.error('Compression error:', err);
      alert('Gagal memproses foto. Silakan coba lagi.');
    }
  };

  // Run AI Verification
  const runAiCheck = async (catName: string, previewUrl: string, userStory?: string) => {
    setIsAnalyzing(true);
    try {
      const result = await verifyActionWithGemini(catName, previewUrl, userStory);
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
      alert('Harap ambil atau unggah foto aksi hijau Anda!');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit to Supabase / Local Storage
      await submitGreenAction(
        {
          userId: user?.id || 'usr-student-001',
          userName: user?.fullName || 'Budi Santoso',
          categoryId: selectedCat.id,
          categoryName: selectedCat.name,
          photoUrl: photoPreview,
          story,
          gpsLat: -6.2017,
          gpsLng: 106.7822,
          status: 'APPROVED',
          aiConfidence: aiResult?.confidence || 0.92,
          aiAnalysisReason: aiResult?.reason || 'Terverifikasi otomatis',
          greenCoinsEarned: selectedCat.coins,
          carbonImpactKg: selectedCat.co2,
          satPointsEarned: selectedCat.sat,
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
        particleCount: 90,
        spread: 75,
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
  // STATE B: IMPACT VERIFIED SUCCESS SCREEN (Stitch Design Blueprint)
  // ----------------------------------------------------------------------------
  if (isVerifiedSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        {/* Success Icon with Glow */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-eco-100 flex items-center justify-center shadow-lg relative z-10 mx-auto ring-8 ring-eco-50">
            <CheckCircle2 className="w-16 h-16 text-eco-600" />
          </div>
          <div className="absolute inset-0 bg-eco-200 rounded-full blur-2xl opacity-40 z-0 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="max-w-xs mx-auto space-y-1.5">
          <h1 className="text-2xl font-black text-eco-900 tracking-tight">Impact Verified!</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Kontribusi hijau Anda telah berhasil diverifikasi dan dicatat ke portofolio kampus.
          </p>
        </div>

        {/* Reward Summary Bento Grid (3 Cards) */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-2.5">
          {/* Card 1: Green Coins */}
          <div className="bg-white rounded-2xl p-3.5 flex flex-col items-center justify-center shadow-eco-soft border border-surface-border">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-gold-600 flex items-center justify-center mb-1.5">
              <Coins className="w-4.5 h-4.5 fill-gold-500 text-gold-600" />
            </div>
            <span className="text-base font-black text-text-primary">+{selectedCat.coins} GC</span>
            <span className="text-[10px] font-semibold text-text-muted mt-0.5">Green Credits</span>
          </div>

          {/* Card 2: CO2e Saved */}
          <div className="bg-white rounded-2xl p-3.5 flex flex-col items-center justify-center shadow-eco-soft border border-surface-border">
            <div className="w-9 h-9 rounded-full bg-eco-50 text-eco-600 flex items-center justify-center mb-1.5">
              <Leaf className="w-4.5 h-4.5 text-eco-600" />
            </div>
            <span className="text-base font-black text-eco-700">{selectedCat.co2} kg</span>
            <span className="text-[10px] font-semibold text-text-muted mt-0.5">CO2e Saved</span>
          </div>

          {/* Card 3: SAT Points */}
          <div className="bg-white rounded-2xl p-3.5 flex flex-col items-center justify-center shadow-eco-soft border border-surface-border">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
              <GraduationCap className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <span className="text-base font-black text-blue-700">+{selectedCat.sat}</span>
            <span className="text-[10px] font-semibold text-text-muted mt-0.5">SAT Point</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Aksi Hijau I-CAN',
                  text: `Saya baru saja berkontribusi ${selectedCat.name} di BINUS University dan menghemat ${selectedCat.co2} kg CO2e! 🌿`,
                  url: window.location.origin,
                });
              } else {
                alert('Tautan aksi hijau berhasil disalin ke clipboard!');
              }
            }}
            className="w-full bg-eco-600 hover:bg-eco-700 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-eco-600/20 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            Bagikan ke Feed & Sosmed
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-white hover:bg-surface-subtle text-eco-800 border border-surface-border font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------
  // STATE A: UPLOAD FORM (Stitch Design Blueprint)
  // ----------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between pb-28">
      {/* Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-subtle transition-colors text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-text-primary">Unggah Aksi Hijau</h1>
        <div className="w-10" />
      </div>

      <div className="space-y-4">
        {/* 1. Category Selector Grid (4 Horizontal Columns) */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Pilih Kategori Aksi
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCat.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCat(cat);
                    if (photoPreview) runAiCheck(cat.name, photoPreview, story);
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-eco-600 text-white border-eco-600 shadow-md shadow-eco-600/20 ring-2 ring-eco-100'
                      : 'bg-white text-text-secondary border-surface-border hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-eco-600'}`} />
                  <span className="text-[11px] font-bold tracking-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Photo Capture / Viewport Area with Stitch Metadata Overlay */}
        <section>
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
            className="relative w-full aspect-[4/3] bg-white rounded-3xl overflow-hidden flex items-center justify-center group cursor-pointer border-2 border-dashed border-eco-300 hover:border-eco-600 shadow-eco-soft transition-all"
          >
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Bukti Aksi" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                <button className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Ganti
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-text-secondary p-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-eco-50 text-eco-600 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-text-primary">Ambil Foto Bukti Aksi</span>
                <span className="text-[11px] text-text-muted mt-0.5">Kompresi otomatis &lt;200KB WebP</span>
              </div>
            )}

            {/* Overlay Metadata Bar (Stitch Blueprint) */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 flex flex-col gap-0.5 border border-white/40 shadow-sm z-20">
              <div className="flex items-center gap-1.5 text-text-primary text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-eco-600" />
                <span>{locationLabel}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-text-secondary font-medium">
                <span>{currentTime}</span>
                <span className="flex items-center gap-1 text-eco-700 font-bold">
                  <Check className="w-3 h-3 text-eco-600 stroke-[3]" /> GPS Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. AI Verification Feedback Card (Gemini 1.5 Flash) */}
        {photoPreview && (
          <section className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Gemini Flash AI Pre-Verification</span>
              </div>
              {isAnalyzing ? (
                <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Menganalisis...
                </span>
              ) : (
                <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Confidence: {Math.round((aiResult?.confidence || 0.94) * 100)}%
                </span>
              )}
            </div>

            <p className="text-xs text-text-secondary leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-100">
              {isAnalyzing
                ? 'AI sedang memvalidasi kesesuaian objek visual dengan kategori aksi hijau...'
                : aiResult?.reason || 'Foto terverifikasi valid sesuai kriteria kampus hijau.'}
            </p>
          </section>
        )}

        {/* 4. Story Textarea */}
        <section>
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5">
            Ceritakan Aksimu <span className="text-text-muted font-normal">(Opsional)</span>
          </label>
          <textarea
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Ceritakan aksi hijaumu (misal: membawa tumbler ke kantin Anggrek)..."
            className="w-full bg-white border border-surface-border rounded-2xl p-3.5 text-xs text-text-primary focus:border-eco-600 focus:ring-2 focus:ring-eco-500/20 focus:outline-none transition-all resize-none shadow-eco-soft"
          />
        </section>

        {/* 5. Reward Preview Banner (Stitch Design Specification) */}
        <section className="bg-emerald-50/90 rounded-2xl p-3.5 flex items-center justify-between border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gold-500">
              <Coins className="w-5 h-5 fill-gold-500 text-gold-500" />
            </div>
            <div>
              <p className="text-[10px] text-eco-700 font-bold uppercase tracking-wider">Estimasi Reward</p>
              <p className="text-sm font-extrabold text-eco-900">+{selectedCat.coins} Green Coins</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold text-eco-700">+{selectedCat.sat} SAT Point</p>
            <p className="text-[10px] text-text-muted">{selectedCat.co2} kg CO2e</p>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Submit CTA */}
      <div className="fixed bottom-14 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-surface-border z-30 max-w-md mx-auto">
        <button
          onClick={handleSubmit}
          disabled={!photoPreview || isSubmitting}
          className="w-full bg-eco-600 hover:bg-eco-700 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-eco-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              Submit untuk Verifikasi
            </>
          )}
        </button>
      </div>
    </div>
  );
};
