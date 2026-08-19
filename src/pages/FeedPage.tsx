import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Heart, MessageCircle, Sparkles, MapPin, Clock } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const [likes, setLikes] = useState<Record<string, number>>({
    '1': 24,
    '2': 18,
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
      author: 'Budi Santoso',
      faculty: 'Computer Science (SOCS)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      actionTitle: 'Bawa Tumbler ke Kantin Anggrek',
      category: 'Bina Diri',
      photo: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
      story: 'Hari ke-5 bawa tumbler sendiri ke kantin BINUS Anggrek! Hemat uang dan ga nyampah plastik 🌿',
      carbonSaved: '0.05 kg CO2e',
      coinsEarned: '+10 GC',
      location: 'BINUS Anggrek Campus',
      time: '2 jam yang lalu',
    },
    {
      id: '2',
      author: 'Siti Rahma',
      faculty: 'Information Systems (SIS)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      actionTitle: 'Naik Shuttle Bus Alam Sutera',
      category: 'Bina Lingkungan',
      photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      story: 'Hemat emisi perjalanan antar-kampus dengan Shuttle Bus BINUS 🚌✨',
      carbonSaved: '0.12 kg CO2e',
      coinsEarned: '+15 GC',
      location: 'BINUS Alam Sutera',
      time: '4 jam yang lalu',
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold-500" />
          Komunitas Aksi Hijau Kampus
        </h2>
        <span className="text-xs text-text-secondary">Live Feed</span>
      </div>

      {samplePosts.map((post) => (
        <Card key={post.id} className="p-4 space-y-3 bg-white">
          {/* Header Author */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={post.avatar}
                alt={post.author}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-eco-500/20"
              />
              <div>
                <h4 className="text-xs font-bold text-text-primary">{post.author}</h4>
                <p className="text-[11px] text-text-secondary">{post.faculty}</p>
              </div>
            </div>
            <Badge variant="eco" size="sm">
              {post.category}
            </Badge>
          </div>

          {/* Action Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200/60">
            <img
              src={post.photo}
              alt={post.actionTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-eco-400" />
                {post.location}
              </span>
              <span className="bg-eco-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                {post.coinsEarned}
              </span>
            </div>
          </div>

          {/* Description & Impact */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">{post.actionTitle}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{post.story}</p>
          </div>

          {/* Footer Interactions */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-xs text-text-secondary">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 font-semibold transition-colors ${
                  hasLiked[post.id] ? 'text-rose-600' : 'hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked[post.id] ? 'fill-rose-600' : ''}`} />
                <span>{likes[post.id]}</span>
              </button>

              <button className="flex items-center gap-1.5 font-semibold hover:text-eco-600 transition-colors">
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
  );
};
