import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight, Sparkles, Clock, Trophy } from 'lucide-react';
import { CampusEvent } from '@/types';
import { getEvents, getEventTimelineCategory } from '@/services/eventService';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'PAST'>('ALL');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const all = await getEvents();
    setEvents(all);
  };

  const filtered = events.filter((e) => {
    if (filter === 'ALL') return true;
    const cat = getEventTimelineCategory(e);
    return cat === filter;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-black text-text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-eco-neon" />
          Event Kampus
        </h2>
        <p className="text-xs text-text-secondary">
          Jelajahi event kampanye hijau yang sedang berlangsung dan dapatkan Green Coins!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {([
          { id: 'ALL', label: 'Semua' },
          { id: 'TODAY', label: '🟢 Hari Ini' },
          { id: 'UPCOMING', label: '🗓️ Akan Datang' },
          { id: 'PAST', label: '🏁 Selesai' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 whitespace-nowrap ${
              filter === tab.id
                ? 'bg-eco-700 text-white shadow-eco-sm'
                : 'bg-surface-subtle text-text-secondary hover:bg-white border border-surface-border/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Calendar className="w-12 h-12 text-text-muted mx-auto" />
          <p className="text-sm font-bold text-text-secondary">
            {filter === 'ALL'
              ? 'Belum ada event yang tersedia.'
              : filter === 'TODAY'
              ? 'Tidak ada event yang berlangsung hari ini.'
              : filter === 'UPCOMING'
              ? 'Belum ada event mendatang yang dijadwalkan.'
              : 'Belum ada riwayat event yang selesai.'}
          </p>
          <p className="text-xs text-text-muted">Penyelenggara unit kampus dapat membuat event baru melalui portal AdminLTE.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => {
            const category = getEventTimelineCategory(event);
            return (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="block bg-white rounded-3xl border border-surface-border shadow-eco-soft overflow-hidden hover:shadow-eco-card transition-all active:scale-[0.98] group"
              >
                {/* Banner */}
                {event.bannerUrl && (
                  <div className="h-36 sm:h-44 overflow-hidden relative">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      {category === 'TODAY' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-eco-neon/90 text-eco-950 shadow-neon-glow flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-eco-950 animate-ping"></span>
                          🔴 LIVE / Hari Ini
                        </span>
                      )}
                      {category === 'UPCOMING' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600/90 text-white shadow-md">
                          🗓️ Akan Datang
                        </span>
                      )}
                      {category === 'PAST' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800/80 text-white">
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-black text-text-primary truncate group-hover:text-eco-700 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.organizerName}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted shrink-0 group-hover:text-eco-700 transition-colors" />
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Badges / Highlights */}
                  {(event.location || event.timeRange) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {event.location && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {event.location}
                        </span>
                      )}
                      {event.timeRange && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {event.timeRange}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-muted font-bold pt-1 border-t border-surface-border/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {formatDate(event.startDate)}
                      {event.startDate.split('T')[0] !== event.endDate.split('T')[0] && ` — ${formatDate(event.endDate)}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      {(event.activities?.length || 0) > 0
                        ? `${event.activities.length} Pos Aktivitas`
                        : 'Event Terpadu'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
