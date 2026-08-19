import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { compressImage } from '@/utils/imageCompressor';
import { verifyActionWithGemini, AiVerificationResult } from '@/services/gemini';
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
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { id: 'tumbler', name: 'Pakai Tumbler', type: 'Bina Diri', icon: CupSoda, co2: 0.05, coins: 10, sat: 0 },
  { id: 'bus', name: 'Shuttle Bus Kampus', type: 'Bina Lingkungan', icon: Bus, co2: 0.12, coins: 15, sat: 1 },
  { id: 'trash', name: 'Pilah Sampah', type: 'Bina Lingkungan', icon: Trash2, co2: 0.08, coins: 10, sat: 0 },
  { id: 'energy', name: 'Hemat Listrik/AC', type: 'Bina Diri', icon: Zap, co2: 0.30, coins: 20, sat: 1 },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<string>('');
  const [story, setStory] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiVerificationResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Photo selection & Canvas Compression
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1280, 0.82);
      setPhotoPreview(compressed.previewUrl);
      setCompressedSize(`${(compressed.compressedSizeBytes / 1024).toFixed(0)} KB`);
      setAiResult(null); // Reset AI result
    } catch (err) {
      console.error('Compression error:', err);
      alert('Gagal memproses foto. Silakan coba lagi.');
    }
  };

  // Capture GPS Location
  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      setLocation({ lat: -6.2017, lng: 106.7822, label: 'BINUS Anggrek (Simulasi)' });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Kampus BINUS (GPS Verified)',
        });
        setIsGettingLocation(false);
      },
      () => {
        setLocation({ lat: -6.2017, lng: 106.7822, label: 'BINUS Anggrek (Default)' });
        setIsGettingLocation(false);
      }
    );
  };

  // Run AI Pre-Verification with Gemini Flash
  const handleAiCheck = async () => {
    if (!photoPreview) return;
    setIsAnalyzing(true);

    try {
      const result = await verifyActionWithGemini(selectedCat.name, photoPreview, story);
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Action
  const handleSubmit = () => {
    if (!photoPreview) {
      alert('Harap ambil atau unggah foto aksi hijau Anda!');
      return;
    }

    // Update user stats & celebrate
    updateUserStats({
      greenCoins: selectedCat.coins,
      satPoints: selectedCat.sat,
      carbonSaved: selectedCat.co2,
      streakDays: (user?.streakDays || 0) + 1,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E5631', '#2E8B57', '#FFB800', '#4CAF50'],
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 pb-20 pt-4">
        <Card variant="eco" className="text-center py-8 px-4 space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-white/10">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Aksi Berhasil Diunggah!</h2>
            <p className="text-xs text-eco-100 mt-1 max-w-xs mx-auto">
              Foto dan metadata aksi Anda telah tercatat. Verifikasi instan telah disetujui!
            </p>
          </div>

          {/* Reward summary pill */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 max-w-xs mx-auto space-y-2 border border-white/20 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-eco-100">Green Coins Didapat:</span>
              <b className="text-gold-400 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 fill-gold-400" />
                +{selectedCat.coins} GC
              </b>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-eco-100">Reduksi Karbon:</span>
              <b className="text-white font-bold">+{selectedCat.co2} kg CO2e</b>
            </div>
            {selectedCat.sat > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-eco-100">SAT Point Ekuivalen:</span>
                <b className="text-white font-bold">+{selectedCat.sat} SAT</b>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
            <Button variant="gold" onClick={() => navigate('/wallet')}>
              Lihat di Dompet →
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white border border-surface-border flex items-center justify-center text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-text-primary">Unggah Aksi Hijau</h2>
          <p className="text-[11px] text-text-secondary">Abadikan kontribusi nyata untuk kampus berkelanjutan</p>
        </div>
      </div>

      {/* 1. Category Selector Grid */}
      <Card className="p-3.5 bg-white space-y-2">
        <label className="text-xs font-bold text-text-primary block">Pilih Kategori Aksi</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat.id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCat(cat);
                  setAiResult(null);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-eco-50/80 border-eco-600 ring-1 ring-eco-600'
                    : 'bg-surface-subtle/50 border-surface-border hover:bg-surface-subtle'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-eco-600 text-white' : 'bg-white text-eco-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-primary truncate">{cat.name}</h4>
                  <span className="text-[10px] text-eco-600 font-semibold">+{cat.coins} GC</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Photo Capture / Upload Box */}
      <Card className="p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-text-primary">Foto Bukti Aksi</label>
          {compressedSize && (
            <span className="text-[10px] text-eco-600 font-semibold bg-eco-50 px-2 py-0.5 rounded-full">
              Ukuran Optimal: {compressedSize}
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />

        {photoPreview ? (
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              Ganti Foto
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[16/10] border-2 border-dashed border-eco-300 hover:border-eco-500 rounded-2xl bg-eco-50/40 hover:bg-eco-50/80 transition-all flex flex-col items-center justify-center p-4 text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-eco-600 group-hover:scale-110 transition-transform mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-text-primary">Buka Kamera / Ambil Foto</p>
            <p className="text-[11px] text-text-secondary mt-0.5">Kompresi otomatis ke &lt;200KB</p>
          </button>
        )}

        {/* GPS Location Pill */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin className="w-4 h-4 text-eco-600" />
            <span>{location ? location.label : 'Lokasi belum terdeteksi'}</span>
          </div>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className="text-xs font-semibold text-eco-600 hover:underline"
          >
            {isGettingLocation ? 'Mencari GPS...' : location ? 'Perbarui GPS' : 'Deteksi Lokasi'}
          </button>
        </div>
      </Card>

      {/* 3. AI Pre-Verification (Gemini 1.5 Flash) */}
      {photoPreview && (
        <Card variant="subtle" className="p-3.5 border-amber-200/80 bg-amber-50/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-text-primary">AI Verifikasi Cepat (Gemini)</h4>
            </div>
            {!aiResult && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAiCheck}
                isLoading={isAnalyzing}
                className="text-xs py-1 px-3 bg-white"
              >
                Cek Validitas AI
              </Button>
            )}
          </div>

          {aiResult && (
            <div className="bg-white rounded-xl p-3 border border-amber-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge variant={aiResult.confidence >= 0.8 ? 'success' : 'warning'} size="sm">
                  Confidence: {Math.round(aiResult.confidence * 100)}%
                </Badge>
                <span className="text-[11px] text-text-muted">Google Gemini Flash</span>
              </div>
              <p className="text-text-primary leading-relaxed">{aiResult.reason}</p>
            </div>
          )}
        </Card>
      )}

      {/* 4. Story & Description */}
      <Card className="p-3.5 bg-white space-y-2">
        <label className="text-xs font-bold text-text-primary block">
          Ceritakan Aksimu <span className="text-text-muted font-normal">(Opsional)</span>
        </label>
        <textarea
          rows={3}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Contoh: Mengisi tumbler di water refill station lantai 3 BINUS Anggrek..."
          className="w-full text-xs p-3 rounded-xl border border-surface-border bg-surface-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all resize-none"
        />
      </Card>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          size="lg"
          variant="primary"
          onClick={handleSubmit}
          className="w-full shadow-eco-float"
          disabled={!photoPreview}
        >
          Submit untuk Verifikasi (+{selectedCat.coins} GC)
        </Button>
      </div>
    </div>
  );
};
