import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  ShieldCheck, 
  MapPin, 
  Check, 
  X, 
  Sparkles
} from 'lucide-react';

interface PendingAction {
  id: string;
  studentName: string;
  nim: string;
  faculty: string;
  category: string;
  co2: string;
  coins: number;
  photo: string;
  story: string;
  location: string;
  time: string;
  aiConfidence: number;
  aiVerdict: string;
}

export const VerificationPage: React.FC = () => {
  const [queue, setQueue] = useState<PendingAction[]>([
    {
      id: 'act-101',
      studentName: 'Ahmad Fauzi',
      nim: '2602199841',
      faculty: 'Computer Science (SOCS)',
      category: 'Pakai Tumbler',
      co2: '0.05 kg',
      coins: 10,
      photo: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
      story: 'Bawa tumbler ke water station lantai 2 BINUS Anggrek.',
      location: 'BINUS Anggrek (GPS Match)',
      time: '15 menit yang lalu',
      aiConfidence: 0.94,
      aiVerdict: 'Objek tumbler dan lokasi kampus terdeteksi akurat.',
    },
    {
      id: 'act-102',
      studentName: 'Clarissa Putri',
      nim: '2602188412',
      faculty: 'School of Design (SOD)',
      category: 'Pilah Sampah',
      co2: '0.08 kg',
      coins: 10,
      photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
      story: 'Memilah botol plastik ke Eco Drop Box lantai dasar.',
      location: 'BINUS Syahdan (GPS Match)',
      time: '32 menit yang lalu',
      aiConfidence: 0.88,
      aiVerdict: 'Objek tempat pemilahan sampah terdeteksi.',
    },
  ]);

  const handleDecision = (actionId: string, isApproved: boolean) => {
    setQueue((prev) => prev.filter((a) => a.id !== actionId));
    alert(isApproved ? 'Aksi berhasil Disetujui! Koin telah dikirim ke mahasiswa.' : 'Aksi Ditolak.');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Verifier Portal Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">Portal Eco-Volunteer</h2>
            <p className="text-[11px] text-text-secondary">Antrean Review Aksi Hijau Mahasiswa</p>
          </div>
        </div>

        <Badge variant="warning" size="sm" className="font-bold">
          {queue.length} Pending Review
        </Badge>
      </div>

      {queue.length === 0 ? (
        <Card className="text-center py-12 px-4 bg-white space-y-3">
          <div className="w-12 h-12 rounded-full bg-eco-100 text-eco-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Semua Aksi Telah Diverifikasi!</h3>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Terima kasih atas kontribusi Anda sebagai verifikator Eco-Volunteer kampus.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {queue.map((action) => (
            <Card key={action.id} className="p-4 bg-white space-y-3 border-surface-border">
              {/* Student Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{action.studentName}</h4>
                  <p className="text-[11px] text-text-secondary">
                    NIM: {action.nim} • {action.faculty}
                  </p>
                </div>
                <Badge variant="eco" size="sm">
                  {action.category}
                </Badge>
              </div>

              {/* Photo Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200">
                <img src={action.photo} alt={action.category} className="w-full h-full object-cover" />
                <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-eco-400" />
                  {action.location}
                </div>
              </div>

              {/* Story */}
              <div className="bg-surface-subtle p-2.5 rounded-xl text-xs text-text-primary">
                <p className="italic">"{action.story}"</p>
              </div>

              {/* AI Suggestion Box */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Analisis AI (Gemini Flash)
                  </span>
                  <Badge variant="success" size="sm" className="text-[10px] py-0">
                    Confidence: {Math.round(action.aiConfidence * 100)}%
                  </Badge>
                </div>
                <p className="text-[11px] text-text-secondary">{action.aiVerdict}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<X className="w-4 h-4" />}
                  onClick={() => handleDecision(action.id, false)}
                >
                  Tolak Aksi
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Check className="w-4 h-4" />}
                  onClick={() => handleDecision(action.id, true)}
                >
                  Setujui (+{action.coins} GC)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
