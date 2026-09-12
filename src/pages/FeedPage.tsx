import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { getActions, subscribeToActions } from '@/services/actionService';
import { GreenAction } from '@/types';
import { 
  Heart, 
  MessageCircle, 
  Sparkles, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle,
  Radio,
  Share2
} from 'lucide-react';

const STORAGE_LIKES_KEY = 'i_can_feed_likes';
const STORAGE_HAS_LIKED_KEY = 'i_can_feed_has_liked';
const STORAGE_REACTIONS_KEY = 'i_can_feed_reactions';

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Baru saja';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffInSeconds < 60) return 'Baru saja';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}j lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}h lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Baru saja';
  }
};

export const FeedPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'MY_ACTIVITIES' | 'TFI' | 'VBL' | 'SELF'>('ALL');
  const [postsList, setPostsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);

  // Persistent Likes State
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LIKES_KEY);
      return saved ? JSON.parse(saved) : { '1': 48, '2': 34, '3': 22 };
    } catch {
      return { '1': 48, '2': 34, '3': 22 };
    }
  });

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HAS_LIKED_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistent Reactions State
  const [reactions, setReactions] = useState<Record<string, { emoji: string; count: number }[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REACTIONS_KEY);
      return saved ? JSON.parse(saved) : {
        '1': [{ emoji: '🔥', count: 18 }, { emoji: '🌱', count: 24 }, { emoji: '👏', count: 12 }],
        '2': [{ emoji: '🎬', count: 15 }, { emoji: '⚡', count: 19 }, { emoji: '🎓', count: 8 }],
        '3': [{ emoji: '💚', count: 14 }, { emoji: '🥤', count: 9 }],
      };
    } catch {
      return {};
    }
  });

  // Save interactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(likes));
    } catch {
      // ignore
    }
  }, [likes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HAS_LIKED_KEY, JSON.stringify(hasLiked));
    } catch {
      // ignore
    }
  }, [hasLiked]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REACTIONS_KEY, JSON.stringify(reactions));
    } catch {
      // ignore
    }
  }, [reactions]);

  const loadPosts = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const actions = await getActions();
      // Hanya tampilkan aksi yang berstatus terverifikasi (APPROVED)
      const verifiedActions = actions.filter((a: GreenAction) => a.status === 'APPROVED');

      const mapped = verifiedActions.map((a: GreenAction, idx: number) => {
        // Categorize submission into tab types
        const isTfi = 
          a.submissionType === 'PENYULUHAN_AKSI_NYATA' ||
          a.submissionType === 'BINA_LINGKUNGAN' ||
          (a as any).actionSource === 'EVENT' ||
          (a as any).actionSource === 'PROGRAM' ||
          (a.categoryName && (
            a.categoryName.toLowerCase().includes('event') || 
            a.categoryName.toLowerCase().includes('lestari') || 
            a.categoryName.toLowerCase().includes('tfi')
          ));

        const isVbl = 
          a.submissionType === 'VIDEO_BASED_LEARNING' ||
          (a.categoryName && a.categoryName.toLowerCase().includes('video'));

        const postType: 'TFI' | 'VBL' | 'SELF' = isTfi ? 'TFI' : isVbl ? 'VBL' : 'SELF';

        // Author and Avatar fallback
        const authorName = a.userName || 'Mahasiswa BINUS';
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=059669&color=fff&bold=true&size=150`;

        return {
          id: a.id || `post-${idx}`,
          userId: a.userId,
          author: authorName,
          faculty: a.userFaculty || 'BINUS University',
          avatar: a.userAvatar || defaultAvatar,
          actionTitle: a.categoryName || 'Aksi Hijau Kampus',
          category: a.categoryName,
          type: postType,
          submissionType: a.submissionType,
          status: a.status || 'APPROVED',
          rejectionReason: a.rejectionReason,
          photo: a.photoUrl,
          campaignUrl: a.campaignUrl,
          story: a.story || 'Aksi nyata keberlanjutan lingkungan civitas akademika BINUS.',
          carbonSaved: `${Number(a.carbonImpactKg || 0).toFixed(1)} kg CO2e`,
          coinsEarned: `+${a.greenCoinsEarned || 10} GC`,
          satEarned: a.satPointsEarned > 0 ? `+${a.satPointsEarned} SAT (${a.comservHoursEarned || 0} Jam)` : 'Aksi Mandiri Harian',
          location: a.surveyLocation || 'Kampus BINUS & Sekitar',
          time: formatRelativeTime(a.verifiedAt || a.submittedAt),
          rawSubmittedAt: a.submittedAt,
          sdgBadge: isTfi ? 'SDG 15 & 13' : isVbl ? 'SDG 4 Quality Edu' : 'SDG 12 & 13',
        };
      });

      setPostsList(mapped);
    } catch (err) {
      console.error('[FeedPage] Failed to fetch actions:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();

    // Subscribe to realtime changes on actions table
    const unsubscribe = subscribeToActions((payload) => {
      console.log('[FeedPage] Realtime change detected in actions table:', payload);
      setIsRealtimeActive(true);
      loadPosts(true);
    });

    return () => {
      unsubscribe();
    };
  }, [loadPosts]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadPosts();
  };

  const getPostReactions = (postId: string, type: string) => {
    if (reactions[postId]) return reactions[postId];
    if (type === 'TFI') return [{ emoji: '🌱', count: 12 }, { emoji: '🌳', count: 8 }, { emoji: '👏', count: 5 }];
    if (type === 'VBL') return [{ emoji: '🎬', count: 14 }, { emoji: '🎓', count: 9 }, { emoji: '⚡', count: 6 }];
    return [{ emoji: '💚', count: 8 }, { emoji: '🔥', count: 5 }, { emoji: '🥤', count: 3 }];
  };

  const toggleLike = (id: string) => {
    setHasLiked((prev) => {
      const isLiked = !prev[id];
      setLikes((l) => ({ ...l, [id]: Math.max(0, (l[id] || 0) + (isLiked ? 1 : -1)) }));
      return { ...prev, [id]: isLiked };
    });
  };

  const addReaction = (postId: string, emoji: string, type: string = 'SELF') => {
    setReactions((prev) => {
      const current = prev[postId] || getPostReactions(postId, type);
      const exists = current.find((r) => r.emoji === emoji);
      if (exists) {
        return {
          ...prev,
          [postId]: current.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
        };
      }
      return {
        ...prev,
        [postId]: [...current, { emoji, count: 1 }],
      };
    });
  };

  const filteredPosts = postsList.filter((p) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'MY_ACTIVITIES') {
      const isMyId = user?.id && p.userId === user.id;
      const isMyName = user?.fullName && p.author.toLowerCase().includes(user.fullName.trim().toLowerCase());
      const isMyFirstName = user?.fullName && p.author.toLowerCase().includes(user.fullName.split(' ')[0].toLowerCase());
      return isMyId || isMyName || isMyFirstName;
    }
    if (activeTab === 'TFI') return p.type === 'TFI';
    if (activeTab === 'VBL') return p.type === 'VBL';
    if (activeTab === 'SELF') return p.type === 'SELF';
    return true;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-black text-text-primary flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-500" />
            Storytelling & Feed Komunitas
          </h2>
          <p className="text-[10px] text-text-secondary">Dampak Nyata Aksi Mahasiswa & Gerakan TFI</p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Live Realtime DB Indicator */}
          <span 
            title="Terkoneksi Realtime ke Database Supabase"
            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Realtime
          </span>

          <button
            onClick={handleManualRefresh}
            title="Segarkan Feed"
            disabled={isRefreshing}
            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border border-slate-200/80 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <Badge variant="eco" size="sm">
            {filteredPosts.length} Cerita
          </Badge>
        </div>
      </div>

      {/* Feed Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'Semua Feed' },
          { id: 'MY_ACTIVITIES', label: '👤 Aksi Saya' },
          { id: 'TFI', label: 'Aksi Nyata TFI' },
          { id: 'VBL', label: 'Video VBL' },
          { id: 'SELF', label: 'Aksi Harian' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-black px-3.5 py-1.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-eco-700 text-white shadow-sm'
                : 'bg-white text-text-secondary border border-surface-border hover:bg-surface-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Post List */}
      {isLoading ? (
        <Card className="p-8 text-center bg-white border-surface-border space-y-3 shadow-eco-card">
          <div className="w-10 h-10 rounded-full border-3 border-eco-200 border-t-eco-600 animate-spin mx-auto"></div>
          <p className="text-xs text-text-secondary font-medium">Memuat data feed realtime...</p>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-8 text-center bg-white border-surface-border space-y-3 shadow-eco-card">
          <div className="w-14 h-14 rounded-3xl bg-eco-50 text-eco-700 flex items-center justify-center mx-auto shadow-xs text-2xl">
            🌱
          </div>
          <h3 className="text-sm font-black text-text-primary">
            {activeTab === 'MY_ACTIVITIES' ? 'Belum Ada Aksi Pribadi Terverifikasi' : 'Belum Ada Aksi Terverifikasi'}
          </h3>
          <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
            {activeTab === 'MY_ACTIVITIES'
              ? 'Aksi yang kamu unggah sedang dalam proses review verifikator SSO/TFI atau belum dilaporkan. Yuk laporkan aksi hijau pertamamu!'
              : 'Belum ada aksi yang disetujui verifikator di kategori ini. Aksi mahasiswa akan otomatis muncul secara realtime begitu disetujui verifikator.'}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-eco-700 hover:bg-eco-800 text-white text-xs font-black shadow-neon-glow transition-all"
          >
            Lapor Aksi Sekarang →
          </Link>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-5 sm:p-6 space-y-4 bg-white border-surface-border shadow-eco-card relative">
              {/* Header Author & Verification Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=059669&color=fff&bold=true&size=150`;
                    }}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-eco-neon/60 shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-text-primary">
                        {post.author}
                      </h4>

                      {/* Status Badges */}
                      {post.status === 'APPROVED' ? (
                        <span 
                          title="Terverifikasi Verifikator SSO / TFI"
                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Terverifikasi SSO
                        </span>
                      ) : post.status === 'PENDING' ? (
                        <span 
                          title="Sedang menunggu peninjauan verifikator kampus"
                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                        >
                          <Clock className="w-3 h-3 text-amber-500" />
                          Menunggu Verifikasi
                        </span>
                      ) : (
                        <span 
                          title="Aksi ditolak atau memerlukan perbaikan bukti"
                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200"
                        >
                          Perlu Revisi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary font-medium mt-0.5">{post.faculty}</p>
                  </div>
                </div>

                <Badge variant={post.type === 'TFI' ? 'success' : post.type === 'VBL' ? 'purple' : 'neutral'} size="sm">
                  {post.sdgBadge}
                </Badge>
              </div>

              {/* Action Image with double badge overlay */}
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 border border-surface-border group">
                <img
                  src={post.photo || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                  alt={post.actionTitle}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-eco-neon" />
                    {post.location}
                  </span>
                  <span className={`backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full ${
                    post.status === 'APPROVED' ? 'bg-eco-700/95 shadow-neon-glow' : 'bg-amber-600/90 shadow-sm'
                  }`}>
                    {post.coinsEarned} {post.status === 'PENDING' ? '(Pending)' : ''}
                  </span>
                </div>
              </div>

              {/* Description & Story */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-black text-text-primary leading-snug">{post.actionTitle}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">{post.story}</p>
              </div>

              {/* Rejection Alert Box for Author */}
              {post.status === 'REJECTED' && post.rejectionReason && (
                <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs text-rose-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Catatan Review Verifikator SSO:
                  </p>
                  <p className="text-rose-700 pl-5.5">{post.rejectionReason}</p>
                </div>
              )}

              {/* Social Media Publication Link if available */}
              {post.campaignUrl && (
                <div className="bg-blue-50/90 p-3 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-blue-900 truncate max-w-[220px]">
                    {post.campaignUrl}
                  </span>
                  <a
                    href={post.campaignUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-black text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 ml-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Lihat Konten
                  </a>
                </div>
              )}

              {/* SAT & Impact Badge */}
              <div className="flex items-center justify-between text-xs font-black bg-surface-subtle p-3 rounded-2xl border border-surface-border/60">
                <span className={post.status === 'APPROVED' ? 'text-blue-700' : 'text-amber-700'}>
                  {post.status === 'APPROVED' ? post.satEarned : `${post.satEarned} (Dalam Tinjauan)`}
                </span>
                <span className="text-eco-800 font-mono">{post.carbonSaved}</span>
              </div>

              {/* Emoji Reaction Bar (Gen Z Interaction) */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                {(reactions[post.id] || getPostReactions(post.id, post.type)).map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => addReaction(post.id, r.emoji, post.type)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-black flex items-center gap-1.5 transition-all active:scale-90 shrink-0 whitespace-nowrap"
                  >
                    <span>{r.emoji}</span>
                    <span className="text-xs text-text-secondary font-mono">{r.count}</span>
                  </button>
                ))}

                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 shrink-0">
                  {['🔥', '🌱', '⚡', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(post.id, emoji, post.type)}
                      className="w-8 h-8 rounded-full bg-white hover:bg-eco-50 border border-surface-border text-xs flex items-center justify-center transition-all active:scale-95 shadow-2xs shrink-0"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Likes & Timestamp */}
              <div className="flex items-center justify-between pt-2.5 border-t border-surface-border/60 text-xs text-text-secondary">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 font-black transition-all active:scale-95 ${
                      hasLiked[post.id] ? 'text-rose-600' : 'hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked[post.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{likes[post.id] ?? 0} Suka</span>
                  </button>

                  <button 
                    onClick={() => alert('Fitur komentar komunitas akan segera hadir di pembaruan berikutnya!')}
                    className="flex items-center gap-1.5 font-bold hover:text-eco-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Komentar</span>
                  </button>
                </div>

                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {post.time}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
