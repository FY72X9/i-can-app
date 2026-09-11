import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  QrCode,
  Camera,
  Clock,
  MapPin,
  Coins,
  Star,
  Sparkles,
  Maximize2,
  X,
  ExternalLink,
  Shirt,
  User,
} from 'lucide-react';
import { CampusEvent, GreenAction } from '@/types';
import { getEventById, computeEventLeaderboard, EventLeaderboardEntry, getEventTimelineCategory } from '@/services/eventService';
import { getActions } from '@/services/actionService';
import { useAuthStore } from '@/stores/authStore';
import { FormattedText } from '@/components/common/FormattedText';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [leaderboard, setLeaderboard] = useState<EventLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'leaderboard'>('activities');
  const [showPosterModal, setShowPosterModal] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    setLoading(true);
    const evt = await getEventById(id);
    setEvent(evt);

    // Compute event leaderboard from actions
    const allActions = await getActions();
    const eventActions = allActions.filter((a: GreenAction) => a.eventId === id);
    const lb = computeEventLeaderboard(eventActions);
    setLeaderboard(lb);
    setLoading(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-eco-neon border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-sm font-bold text-text-secondary">Event tidak ditemukan.</p>
        <button
          onClick={() => navigate('/events')}
          className="px-4 py-2 rounded-2xl bg-eco-700 text-white text-xs font-black"
        >
          Kembali ke Daftar Event
        </button>
      </div>
    );
  }

  const category = getEventTimelineCategory(event);
  const isActionOpen = event.status === 'ACTIVE' || category === 'TODAY';

  return (
    <div className="space-y-5 -mt-2">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-eco-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Event
      </button>

      {/* Banner & Poster Preview Trigger */}
      {event.bannerUrl && (
        <div
          onClick={() => setShowPosterModal(true)}
          className="rounded-3xl overflow-hidden relative shadow-eco-card cursor-pointer group"
          title="Klik untuk melihat poster penuh"
        >
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-48 sm:h-64 object-cover object-top group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            {category === 'TODAY' && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-eco-neon/90 text-eco-950 shadow-neon-glow flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-eco-950 animate-ping"></span>
                🔴 LIVE / Hari Ini
              </span>
            )}
            {category === 'UPCOMING' && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                🗓️ Akan Datang
              </span>
            )}
            {category === 'PAST' && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800/80 text-white">
                Selesai
              </span>
            )}
          </div>

          {/* Poster Preview Button Overlay */}
          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPosterModal(true);
              }}
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 border border-white/20"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Lihat Poster Penuh</span>
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Notice */}
      {category === 'UPCOMING' && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900 font-bold">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Event ini dijadwalkan dibuka pada {formatDate(event.startDate)}. Pos aktivitas QR dapat dipindai saat event berlangsung.</span>
        </div>
      )}

      {/* Event Info */}
      <div className="space-y-3">
        <h1 className="text-lg sm:text-xl font-black text-text-primary leading-snug">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary font-bold">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
            <Users className="w-3.5 h-3.5 text-eco-700" />
            {event.organizerName}
          </span>
          {event.allowGroupMembers || (event.maxGroupMembers && event.maxGroupMembers > 0) ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-200">
              <Users className="w-3.5 h-3.5 text-purple-700" />
              Aksi Berkelompok (Maks. {event.maxGroupMembers || 3} Rekan Mahasiswa)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Aksi Individu
            </span>
          )}
        </div>

        {/* Structured Event Metadata Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* Tanggal Pelaksanaan */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-surface-border shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block">Tanggal Pelaksanaan</span>
              <p className="text-xs font-black text-slate-800 truncate">
                {formatDate(event.startDate)}
                {event.startDate.split('T')[0] !== event.endDate.split('T')[0] && ` — ${formatDate(event.endDate)}`}
              </p>
            </div>
          </div>

          {/* Jam / Waktu Pelaksanaan */}
          {event.timeRange && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-surface-border shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block">Waktu / Jam</span>
                <p className="text-xs font-black text-slate-800 truncate">{event.timeRange}</p>
              </div>
            </div>
          )}

          {/* Lokasi Event */}
          {event.location && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-surface-border shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block">Lokasi Kampus</span>
                <p className="text-xs font-black text-slate-800 truncate">{event.location}</p>
              </div>
            </div>
          )}

          {/* Dresscode */}
          {event.dressCode && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-surface-border shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <Shirt className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block">Dresscode / Pakaian</span>
                <p className="text-xs font-black text-slate-800 truncate">{event.dressCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Formatted Description Card */}
        {event.description && (
          <div className="bg-white rounded-3xl border border-surface-border p-4 sm:p-5 shadow-eco-soft space-y-2">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Tentang Event & Informasi</h3>
            <FormattedText content={event.description} />
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-surface-border pb-0.5">
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2.5 text-xs font-black transition-all border-b-2 ${
            activeTab === 'activities'
              ? 'border-eco-700 text-eco-700'
              : 'border-transparent text-text-muted hover:text-text-secondary'
          }`}
        >
          📍 Pos Aktivitas ({(event.activities || []).length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2.5 text-xs font-black transition-all border-b-2 ${
            activeTab === 'leaderboard'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-text-muted hover:text-text-secondary'
          }`}
        >
          🏆 Event Leaderboard
        </button>
      </div>

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-3">
          {(!event.activities || event.activities.length === 0) ? (
            <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 text-center space-y-3 shadow-eco-soft">
              <div className="w-12 h-12 rounded-2xl bg-eco-50 border border-eco-200 flex items-center justify-center mx-auto text-eco-700">
                <Sparkles className="w-6 h-6 text-eco-600" />
              </div>
              <div>
                <h4 className="text-sm font-black text-text-primary">Event Terpadu (Tanpa Pos Terpisah)</h4>
                <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto leading-relaxed">
                  Event ini tidak menggunakan pos aktivitas atau checkpoint terpisah. Seluruh kontribusi aksi dapat langsung dikirimkan untuk event ini.
                </p>
              </div>
              {isActionOpen ? (
                <Link
                  to={`/upload?source=event&eventId=${event.id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-colors shadow-eco-sm active:scale-95 mt-2"
                >
                  <Camera className="w-4 h-4" />
                  Kirim Bukti Aksi Event
                </Link>
              ) : category === 'UPCOMING' ? (
                <p className="text-xs font-bold text-blue-700 mt-2">
                  🔒 Pengiriman aksi dibuka saat event dimulai
                </p>
              ) : (
                <p className="text-xs font-bold text-slate-400 mt-2">
                  Event telah selesai
                </p>
              )}
            </div>
          ) : (
            event.activities
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl border border-surface-border p-4 space-y-2.5 shadow-eco-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-text-primary">{activity.name}</h4>
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                        <Coins className="w-3 h-3 text-amber-600" />
                        <span className="text-[11px] font-black text-amber-800">+{activity.coinsReward} GC</span>
                      </div>
                      {activity.satPointsReward !== undefined && activity.satPointsReward > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200">
                          <Star className="w-3 h-3 text-blue-600" />
                          <span className="text-[11px] font-black text-blue-800">+{activity.satPointsReward} SAT</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {isActionOpen ? (
                    <Link
                      to={`/upload?source=event&eventId=${event.id}&activityId=${activity.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-colors shadow-eco-sm active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      Kirim Bukti Aksi
                    </Link>
                  ) : category === 'UPCOMING' ? (
                    <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-500">
                      🔒 Pos akan dibuka saat event berlangsung
                    </div>
                  ) : (
                    <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-400">
                      Event telah selesai
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Trophy className="w-10 h-10 text-text-muted mx-auto" />
              <p className="text-sm font-bold text-text-secondary">Belum ada peserta.</p>
              <p className="text-xs text-text-muted">Jadilah yang pertama mengirim bukti aksi di event ini!</p>
            </div>
          ) : (
            leaderboard.map((entry) => {
              const isMe = entry.userId === user?.id;
              const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                    isMe
                      ? 'bg-eco-50 border-eco-200 ring-1 ring-eco-neon/40'
                      : 'bg-white border-surface-border'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-700 shrink-0">
                    {medal || `#${entry.rank}`}
                  </div>
                  {entry.userAvatar && (
                    <img src={entry.userAvatar} alt={entry.userName} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-text-primary truncate">
                      {entry.userName} {isMe && <span className="text-eco-700">(Kamu)</span>}
                    </div>
                    <div className="text-[10px] text-text-muted">{entry.totalActions} aksi disetujui</div>
                  </div>
                  <div className="text-xs font-black text-amber-700 font-mono shrink-0">
                    {entry.totalCoins} GC
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Poster Preview Modal (Full Aspect Ratio Lightbox) */}
      {showPosterModal && event.bannerUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowPosterModal(false)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white bg-slate-950/70">
              <div className="min-w-0 pr-2">
                <h4 className="text-sm font-black truncate">{event.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">Poster Resmi • {event.organizerName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={event.bannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Buka Gambar Asli di Tab Baru"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setShowPosterModal(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Tutup Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Poster Image (Full Uncropped Aspect Ratio) */}
            <div className="p-3 sm:p-4 overflow-auto flex-1 flex items-center justify-center bg-black/60 min-h-0">
              <img
                src={event.bannerUrl}
                alt={`Poster ${event.title}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
