import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, QrCode, Zap, AlertCircle } from 'lucide-react';
import { CampusEvent } from '@/types';
import { getActiveEvents } from '@/services/eventService';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [activeEvents, setActiveEvents] = useState<CampusEvent[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadActiveEvents();
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const loadActiveEvents = async () => {
    const events = await getActiveEvents();
    setActiveEvents(events);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Kamera tidak tersedia. Gunakan mode simulasi di bawah.');
      setShowSimulation(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSimulationSelect = (eventId: string, activityId: string) => {
    stopCamera();
    onClose();
    navigate(`/upload?source=event&eventId=${eventId}&activityId=${activityId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-eco-700" />
            <h3 className="text-sm font-black text-text-primary">Scan QR Pos Event</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative bg-black aspect-square">
          {!cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-3 p-6">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <p className="text-xs text-center text-white/80">{cameraError}</p>
            </div>
          )}

          {/* Scan Frame Overlay */}
          {!cameraError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-eco-neon rounded-3xl shadow-neon-glow animate-pulse" />
            </div>
          )}
        </div>

        {/* Simulation Mode Toggle */}
        <div className="p-4 space-y-3">
          <button
            onClick={() => setShowSimulation(!showSimulation)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-black text-amber-800 transition-colors active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            {showSimulation ? 'Sembunyikan Simulasi' : 'Mode Simulasi Scan QR'}
          </button>

          {/* Simulation Quick Buttons */}
          {showSimulation && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeEvents.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-3">
                  Tidak ada event aktif saat ini. Buat event baru melalui AdminLTE.
                </p>
              ) : (
                activeEvents.map((evt) =>
                  evt.activities.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => handleSimulationSelect(evt.id, act.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-eco-50 hover:bg-eco-100 border border-eco-200 text-left transition-colors active:scale-95"
                    >
                      <QrCode className="w-5 h-5 text-eco-700 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-eco-900 truncate">{act.name}</div>
                        <div className="text-[10px] text-eco-700 truncate">{evt.title} • +{act.coinsReward} GC</div>
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
