import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { getActions } from '@/services/actionService';
import { GreenAction } from '@/types';
import { 
  Heart, 
  MessageCircle, 
  Sparkles, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  TreePine, 
  Droplets, 
  Video, 
  CupSoda,
  Award,
  Flame,
  Zap,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export const FeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TFI' | 'VBL' | 'SELF'>('ALL');
  const [postsList, setPostsList] = useState<any[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({
    '1': 48,
    '2': 34,
    '3': 22,
  });

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [reactions, setReactions] = useState<Record<string, { emoji: string; count: number }[]>>({
    '1': [{ emoji: '🔥', count: 18 }, { emoji: '🌱', count: 24 }, { emoji: '👏', count: 12 }],
    '2': [{ emoji: '🎬', count: 15 }, { emoji: '⚡', count: 19 }, { emoji: '🎓', count: 8 }],
    '3': [{ emoji: '💚', count: 14 }, { emoji: '🥤', count: 9 }],
  });

  useEffect(() => {
    async function load() {
      const actions = await getActions();
      const approved = actions.filter((a) => a.status === 'APPROVED');
      
      const mapped = approved.map((a, idx) => ({
        id: a.id || `post-${idx}`,
        author: a.userName || 'Mahasiswa BINUS',
        faculty: a.userFaculty || 'Fakultas BINUS',
        avatar: a.userAvatar || (idx % 2 === 0 ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'),
        actionTitle: a.categoryName || 'Aksi Hijau Kampus',
        category: a.categoryName,
        type: a.submissionType === 'PENYULUHAN_AKSI_NYATA' ? 'TFI' : a.submissionType === 'VIDEO_BASED_LEARNING' ? 'VBL' : 'SELF',
        photo: a.photoUrl,
        campaignUrl: a.campaignUrl,
        story: a.story,
        carbonSaved: `${a.carbonImpactKg} kg CO2e`,
        coinsEarned: `+${a.greenCoinsEarned} GC`,
        satEarned: a.satPointsEarned > 0 ? `+${a.satPointsEarned} SAT (${a.comservHoursEarned || 0} Jam)` : 'Aksi Mandiri Harian',
        location: 'Kampus BINUS & Sekitar',
        time: 'Terverifikasi SSO',
        sdgBadge: a.submissionType === 'PENYULUHAN_AKSI_NYATA' ? 'SDG 15 & 13' : a.submissionType === 'VIDEO_BASED_LEARNING' ? 'SDG 4 Quality Edu' : 'SDG 12 Consumption',
      }));

      setPostsList(mapped.length > 0 ? mapped : defaultSamplePosts);
    }
    load();
  }, []);

  const defaultSamplePosts = [
    {
      id: '1',
      author: 'Ahmad Fauzi & Tim',
      faculty: 'School of Computer Science (SOCS)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      actionTitle: 'Penanaman 5 Bibit Pohon Tabebuya di Taman Kota',
      category: 'Penyuluhan & Aksi Nyata TFI',
      type: 'TFI',
      photo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      campaignUrl: 'https://www.instagram.com/reel/C_samplePohon123',
      story: 'Bersama tim kami melakukan penyuluhan pentingnya penghijauan kota di IG Reels dan menanam 5 bibit pohon keras bersama pengelola taman setempat. #TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService 🌿🌳',
      carbonSaved: '5.0 kg CO2e',
      coinsEarned: '+25 GC',
      satEarned: '+4 SAT (2.0 Jam Comserv)',
      location: 'Taman Kota Jakarta Barat',
      time: '2 jam yang lalu',
      sdgBadge: 'SDG 15 & 13',
    },
  ];

  const toggleLike = (id: string) => {
    setHasLiked((prev) => {
      const isLiked = !prev[id];
      setLikes((l) => ({ ...l, [id]: (l[id] || 0) + (isLiked ? 1 : -1) }));
      return { ...prev, [id]: isLiked };
    });
  };

  const addReaction = (postId: string, emoji: string) => {
    setReactions((prev) => {
      const current = prev[postId] || [];
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
        <Badge variant="eco" size="sm">
          {filteredPosts.length} Cerita Inspiratif
        </Badge>
      </div>

      {/* Quick Guide Link Banner */}
      <Link
        to="/guide"
        className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-eco-200 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-eco-700" />
          <span className="text-xs font-black text-text-primary group-hover:text-eco-800 transition-colors">
            Ketentuan Storytelling & Format Sitasi APA Style →
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-eco-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* Feed Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'Semua Feed' },
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
      <div className="space-y-3.5">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-4 space-y-3 bg-white border-surface-border shadow-eco-card relative">
            {/* Header Author */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-eco-neon/60 shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-black text-text-primary flex items-center gap-1">
                    {post.author}
                    {post.type !== 'SELF' && (
                      <span title="Terverifikasi TFI" className="inline-flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-eco-600" />
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-text-secondary font-medium">{post.faculty}</p>
                </div>
              </div>
              <Badge variant={post.type === 'TFI' ? 'success' : post.type === 'VBL' ? 'purple' : 'neutral'} size="sm">
                {post.sdgBadge}
              </Badge>
            </div>

            {/* Action Image with Double-Tap Vibe */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 border border-surface-border group">
              <img
                src={post.photo}
                alt={post.actionTitle}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-eco-neon" />
                  {post.location}
                </span>
                <span className="bg-eco-700/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-neon-glow">
                  {post.coinsEarned}
                </span>
              </div>
            </div>

            {/* Description & Story */}
            <div className="space-y-1">
              <h3 className="text-xs font-black text-text-primary leading-snug">{post.actionTitle}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{post.story}</p>
            </div>

            {/* Social Media Publication Link if available */}
            {post.campaignUrl && (
              <div className="bg-blue-50/90 p-2.5 rounded-2xl border border-blue-200/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-blue-900 truncate max-w-[200px]">
                  {post.campaignUrl}
                </span>
                <a
                  href={post.campaignUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 ml-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Lihat Konten
                </a>
              </div>
            )}

            {/* SAT & Impact Badge */}
            <div className="flex items-center justify-between text-[10px] font-black bg-surface-subtle p-2 rounded-xl border border-surface-border/60">
              <span className="text-blue-700">{post.satEarned}</span>
              <span className="text-eco-800">{post.carbonSaved}</span>
            </div>

            {/* Emoji Reaction Bar (Gen Z Interaction) */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {(reactions[post.id] || []).map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => addReaction(post.id, r.emoji)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-black flex items-center gap-1 transition-all active:scale-90"
                >
                  <span>{r.emoji}</span>
                  <span className="text-[10px] text-text-secondary font-mono">{r.count}</span>
                </button>
              ))}

              <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                {['🔥', '🌱', '⚡'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(post.id, emoji)}
                    className="w-7 h-7 rounded-full bg-white hover:bg-eco-50 border border-surface-border text-xs flex items-center justify-center transition-all active:scale-95 shadow-2xs"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Likes & Timestamp */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-xs text-text-secondary">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 font-black transition-all active:scale-95 ${
                    hasLiked[post.id] ? 'text-rose-600' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked[post.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likes[post.id]} Suka</span>
                </button>

                <button 
                  onClick={() => alert('Fitur komentar komunitas akan segera hadir di pembaruan berikutnya!')}
                  className="flex items-center gap-1.5 font-bold hover:text-eco-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Komentar</span>
                </button>
              </div>

              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                <Clock className="w-3 h-3" />
                {post.time}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
