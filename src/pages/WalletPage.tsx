import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { 
  Coins, 
  ArrowRight, 
  History, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WalletPage: React.FC = () => {
  const { user, updateUserStats } = useAuthStore();
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [isConverting, setIsConverting] = useState(false);
  const [successModal, setSuccessModal] = useState<{ satReceived: number; coinsSpent: number } | null>(null);

  // Conversion rate: 50 Green Coins = 1 SAT Point
  const CONVERSION_RATE = 50;
  const satEquivalent = Math.floor(convertAmount / CONVERSION_RATE);

  const handleConvert = () => {
    if (!user || user.totalGreenCoins < convertAmount) {
      alert('Saldo Green Coin Anda tidak mencukupi untuk nominal konversi ini!');
      return;
    }

    if (convertAmount < CONVERSION_RATE) {
      alert(`Minimal konversi adalah ${CONVERSION_RATE} Green Coins (1 SAT Point).`);
      return;
    }

    setIsConverting(true);

    setTimeout(() => {
      updateUserStats({
        greenCoins: -convertAmount,
        satPoints: satEquivalent,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFB800', '#E5A93C', '#2E8B57', '#1E5631'],
      });

      setIsConverting(false);
      setSuccessModal({ satReceived: satEquivalent, coinsSpent: convertAmount });
    }, 800);
  };

  const sampleHistory = [
    { id: '1', title: 'Konversi ke SAT Point', type: 'OUT', amount: '-100 GC', sat: '+2 SAT', date: 'Hari ini, 10:30' },
    { id: '2', title: 'Aksi Bawa Tumbler', type: 'IN', amount: '+10 GC', sat: '', date: 'Kemarin, 14:15' },
    { id: '3', title: 'Aksi Shuttle Bus BINUS', type: 'IN', amount: '+15 GC', sat: '+1 SAT', date: '17 Agt 2026' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Wallet Header Card */}
      <Card variant="eco" className="relative overflow-hidden text-center py-6 px-4">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold text-eco-100 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Coins className="w-4 h-4 text-gold-400 fill-gold-400" />
            Total Saldo Dompet Hijau
          </span>

          <div className="text-3xl font-extrabold text-white tracking-tight">
            {user?.totalGreenCoins || 450} <span className="text-sm font-medium text-eco-100">GC</span>
          </div>

          <p className="text-xs text-eco-100/90">
            Ekuivalen: <b className="text-gold-300 font-bold">{Math.floor((user?.totalGreenCoins || 450) / CONVERSION_RATE)} SAT Point</b> siap dikonversi
          </p>
        </div>
      </Card>

      {/* 2. SAT Converter Tool Card */}
      <Card className="p-4 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Konversi ke SAT Point</h3>
            <p className="text-[11px] text-text-secondary">Rate: 50 Green Coins = 1 SAT Point</p>
          </div>
          <Badge variant="gold" size="sm">
            Instant Sync
          </Badge>
        </div>

        {/* Quick Amount Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary block">Pilih Jumlah Green Coin</label>
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 200].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setConvertAmount(val)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  convertAmount === val
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-surface-subtle text-text-primary border-surface-border hover:bg-slate-100'
                }`}
              >
                {val} GC
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Calculator Box */}
        <div className="bg-surface-subtle p-3 rounded-2xl border border-surface-border/80 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Koin Ditukar</span>
            <p className="text-base font-extrabold text-text-primary">{convertAmount} GC</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-eco-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="text-right">
            <span className="text-[10px] text-eco-600 uppercase font-bold">SAT Didapat</span>
            <p className="text-base font-extrabold text-eco-700">+{satEquivalent} SAT</p>
          </div>
        </div>

        <Button
          size="lg"
          variant="gold"
          onClick={handleConvert}
          isLoading={isConverting}
          className="w-full"
          disabled={(user?.totalGreenCoins || 0) < convertAmount}
        >
          Konversi Sekarang (+{satEquivalent} SAT)
        </Button>
      </Card>

      {/* 3. Transaction History */}
      <Card className="p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-text-secondary" />
            <h3 className="text-xs font-bold text-text-primary">Riwayat Transaksi Dompet</h3>
          </div>
        </div>

        <div className="space-y-2.5 divide-y divide-surface-border/60">
          {sampleHistory.map((item) => (
            <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                <p className="text-[10px] text-text-muted">{item.date}</p>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-extrabold ${
                    item.type === 'IN' ? 'text-eco-600' : 'text-amber-600'
                  }`}
                >
                  {item.amount}
                </span>
                {item.sat && (
                  <p className="text-[10px] text-blue-600 font-semibold">{item.sat}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center mx-auto text-eco-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary">Konversi Berhasil!</h3>
              <p className="text-xs text-text-secondary mt-1">
                <b>{successModal.coinsSpent} Green Coins</b> berhasil ditukar menjadi{' '}
                <b className="text-eco-700">+{successModal.satReceived} SAT Point</b>.
              </p>
            </div>

            <div className="bg-eco-50 p-3 rounded-2xl text-xs text-eco-800 space-y-1">
              <p className="font-bold">Status Sinkronisasi myBINUS:</p>
              <p className="text-[11px] text-eco-700">✅ Terverifikasi & tercatat di log portofolio kampus</p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setSuccessModal(null)}
            >
              Selesai
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
