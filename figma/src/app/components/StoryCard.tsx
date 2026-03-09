'use client';

import { useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Bookmark, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Story } from '../data/mockData';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const [liked, setLiked] = useState(story.liked || false);
  const [likeCount, setLikeCount] = useState(story.likes);
  const [bookmarked, setBookmarked] = useState(story.bookmarked || false);
  const router = useRouter();

  const handleLike = (e: MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = (e: MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const typeColors: Record<string, string> = {
    短评: 'bg-[#4A6741]/10 text-[#4A6741]',
    摘录: 'bg-[#8B7355]/10 text-[#8B7355]',
    读后感: 'bg-[#C4533A]/10 text-[#C4533A]',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={story.user.avatar}
          alt={story.user.name}
          className="w-9 h-9 rounded-full object-cover cursor-pointer"
          onClick={() => router.push(`/profile/${story.user.id}`)}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2C2C2C]">{story.user.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${typeColors[story.type]}`}>{story.type}</span>
          </div>
          <span className="text-[11px] text-[#8A8478]">{story.createdAt}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 p-2 bg-[#FAF7F2] rounded-lg cursor-pointer" onClick={() => router.push(`/book/${story.book.id}`)}>
        <img src={story.book.cover} alt={story.book.title} className="w-8 h-10 rounded object-cover" />
        <div>
          <p className="text-xs text-[#2C2C2C]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {story.book.title}
          </p>
          <p className="text-[10px] text-[#8A8478]">{story.book.author}</p>
        </div>
      </div>

      {story.quote ? (
        <div className="relative pl-3 mb-3 border-l-2 border-[#4A6741]/30">
          <Quote size={12} className="absolute -left-1.5 -top-0.5 text-[#4A6741]/40 bg-white" />
          <p className="text-sm text-[#2C2C2C] italic leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            "{story.quote}"
          </p>
          {story.page ? <p className="text-[10px] text-[#8A8478] mt-1">— 第 {story.page} 页</p> : null}
        </div>
      ) : null}

      {story.content ? <p className="text-sm text-[#2C2C2C] leading-relaxed mb-3">{story.content}</p> : null}

      <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DD]/50">
        <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike} className="flex items-center gap-1.5 text-xs">
          <AnimatePresence mode="wait">
            <motion.div key={liked ? 'liked' : 'unliked'} initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
              <Heart size={16} className={liked ? 'fill-[#C4533A] text-[#C4533A]' : 'text-[#8A8478]'} />
            </motion.div>
          </AnimatePresence>
          <span className={liked ? 'text-[#C4533A]' : 'text-[#8A8478]'}>{likeCount}</span>
        </motion.button>

        <button className="flex items-center gap-1.5 text-xs text-[#8A8478]">
          <MessageCircle size={16} />
          <span>{story.comments}</span>
        </button>

        <motion.button whileTap={{ scale: 0.85 }} onClick={handleBookmark} className="flex items-center gap-1.5 text-xs">
          <Bookmark size={16} className={bookmarked ? 'fill-[#8B7355] text-[#8B7355]' : 'text-[#8A8478]'} />
          <span className={bookmarked ? 'text-[#8B7355]' : 'text-[#8A8478]'}>{story.bookmarks}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
