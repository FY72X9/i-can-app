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
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CampusEvent, GreenAction } from '@/types';
import { getEventById, computeEventLeaderboard, EventLeaderboardEntry } from '@/services/eventService';
import { getActions } from '@/services/actionService';
import { useAuthStore } from '@/stores/authStore';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [leaderboard, setLeaderboard] = useState<EventLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'leaderboard'>('activities');

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

  const now = new Date().toISOString();
  const isActive = event.status === 'ACTIVE' && event.endDate >= now;

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

      {/* Banner */}
      {event.bannerUrl && (
        <div className="rounded-3xl overflow-hidden relative shadow-eco-card">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-44 sm:h-56 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isActive
                ? 'bg-eco-neon/90 text-eco-950 shadow-neon-glow'
                : 'bg-slate-800/70 text-white'
            }`}>
              {isActive ? '🔴 LIVE' : event.status}
            </span>
          </div>
        </div>
      )}

      {/* Event Info */}
      <div className="space-y-2">
        <h1 className="text-lg sm:text-xl font-black text-text-primary">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary font-bold">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-eco-700" />
            {event.organizerName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            {formatDate(event.startDate)} — {formatDate(event.endDate)}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{event.description}</p>
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
          📍 Pos Aktivitas ({event.activities.length})
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
          {event.activities
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
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 shrink-0">
                    <Coins className="w-3 h-3 text-amber-600" />
                    <span className="text-[11px] font-black text-amber-800">+{activity.coinsReward} GC</span>
                  </div>
                </div>

                {/* Action Button */}
                {isActive && (
                  <Link
                    to={`/upload?eventId=${event.id}&activityId=${activity.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black transition-colors shadow-eco-sm active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    Kirim Bukti Aksi
                  </Link>
                )}
              </div>
            ))}
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
    </div>
  );
};
