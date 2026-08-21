import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
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
  Filter
} from 'lucide-react';

export const FeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TFI' | 'VBL' | 'SELF'>('ALL');
  const [likes, setLikes] = useState<Record<string, number>>({
    '1': 42,
    '2': 31,
    '3': 18,
  });

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setHasLiked((prev) => {
      const isLiked = !prev[id];
      setLikes((l) => ({ ...l, [id]: (l[id] || 0) + (isLiked ? 1 : -1) }));
      return { ...prev, [id]: isLiked };
    });
  };

  const samplePosts = [
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
    {
      id: '2',
      author: 'Clarissa Putri',
      faculty: 'School of Design (SOD)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      actionTitle: 'Video Edukasi Zero Waste Campus untuk Pelajar',
      category: 'Video Based Learning (VBL)',
      type: 'VBL',
      photo: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80',
      campaignUrl: 'https://youtube.com/watch?v=sampleVBL_ZeroWaste',
      story: 'Membuat video edukasi 8 menit berjaket almamater BINUS mengenai kiat zero waste gaya hidup mahasiswa. Sitasi format APA style terlampir lengkap di deskripsi! ✨',
      carbonSaved: '0.1 kg CO2e',
      coinsEarned: '+25 GC',
      satEarned: '+3 SAT (1.5 Jam Comserv)',
      location: 'BINUS Syahdan Studio',
      time: '5 jam yang lalu',
      sdgBadge: 'SDG 4 Quality Edu',
    },
    {
      id: '3',
      author: 'Budi Santoso',
      faculty: 'School of Information Systems (SIS)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      actionTitle: 'Bawa Tumbler & Wadah ke Kantin Anggrek',
      category: 'Self Green Campaign',
      type: 'SELF',
      photo: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
      story: 'Hari ke-7 bawa tumbler sendiri ke water station lantai 2 BINUS Anggrek! Mengurangi sampah plastik sekali pakai dan mendukung kampus ramah lingkungan.',
      carbonSaved: '0.05 kg CO2e',
      coinsEarned: '+10 GC',
      satEarned: 'Aksi Mandiri Harian',
      location: 'BINUS Anggrek Campus',
      time: '1 hari yang lalu',
      sdgBadge: 'SDG 12 Consumption',
    },
  ];

  const filteredPosts = samplePosts.filter((p) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'TFI') return p.type === 'TFI';
    if (activeTab === 'VBL') return p.type === 'VBL';
    if (activeTab === 'SELF') return p.type === 'SELF';
    return true;
  });

  return (
    <div className="space-y-4 pb-4">
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
          {samplePosts.length} Cerita Inspiratif
        </Badge>
      </div>

      {/* Feed Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'ALL', label: 'Semua Feed' },
          { id: 'TFI', label: 'Aksi Nyata TFI' },
          { id: 'VBL', label: 'Video VBL' },
          { id: 'SELF', label: 'Aksi Harian' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
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
          <Card key={post.id} className="p-4 space-y-3 bg-white border-surface-border shadow-eco-soft">
            {/* Header Author */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-eco-500/30 shadow-xs"
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
                  <p className="text-[10px] text-text-secondary">{post.faculty}</p>
                </div>
              </div>
              <Badge variant={post.type === 'TFI' ? 'success' : post.type === 'VBL' ? 'purple' : 'neutral'} size="sm">
                {post.sdgBadge}
              </Badge>
            </div>

            {/* Action Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200">
              <img
                src={post.photo}
                alt={post.actionTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-eco-400" />
                  {post.location}
                </span>
                <span className="bg-eco-700/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                  {post.coinsEarned}
                </span>
              </div>
            </div>

            {/* Description & Impact */}
            <div className="space-y-1">
              <h3 className="text-xs font-black text-text-primary leading-snug">{post.actionTitle}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{post.story}</p>
            </div>

            {/* Social Media Publication Link if available */}
            {post.campaignUrl && (
              <div className="bg-blue-50/90 p-2.5 rounded-xl border border-blue-200/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-blue-900 truncate max-w-[200px]">
                  {post.campaignUrl}
                </span>
                <a
                  href={post.campaignUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 ml-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Lihat Konten
                </a>
              </div>
            )}

            {/* SAT & Impact Badge */}
            <div className="flex items-center justify-between text-[10px] font-extrabold bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-blue-700">{post.satEarned}</span>
              <span className="text-eco-800">{post.carbonSaved}</span>
            </div>

            {/* Footer Interactions */}
            <div className="flex items-center justify-between pt-1 border-t border-surface-border/60 text-xs text-text-secondary">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition-all active:scale-95 ${
                    hasLiked[post.id] ? 'text-rose-600' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked[post.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likes[post.id]}</span>
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

