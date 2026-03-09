'use client';

import { motion } from 'motion/react';
import { Highlighter, StickyNote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Book } from '../data/mockData';

interface BookCardProps {
  book: Book;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

export function BookCard({ book, variant = 'vertical' }: BookCardProps) {
  const router = useRouter();

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push(`/book/${book.id}`)}
        className="flex gap-3 p-3 bg-white/60 rounded-xl cursor-pointer"
      >
        <img src={book.cover} alt={book.title} className="w-16 h-22 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-[#2C2C2C] truncate" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {book.title}
          </h4>
          <p className="text-[#8A8478] text-sm mt-0.5">{book.author}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-[#4A6741] bg-[#4A6741]/10 px-2 py-0.5 rounded-full">{book.status}</span>
            {book.highlights > 0 ? (
              <span className="text-xs text-[#8A8478] flex items-center gap-1">
                <Highlighter size={11} /> {book.highlights}
              </span>
            ) : null}
            {book.notes > 0 ? (
              <span className="text-xs text-[#8A8478] flex items-center gap-1">
                <StickyNote size={11} /> {book.notes}
              </span>
            ) : null}
          </div>
          {book.progress !== undefined && book.progress < 100 ? (
            <div className="mt-2 h-1 bg-[#E8E4DD] rounded-full overflow-hidden">
              <div className="h-full bg-[#4A6741] rounded-full transition-all" style={{ width: `${book.progress}%` }} />
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push(`/book/${book.id}`)}
        className="cursor-pointer"
      >
        <img src={book.cover} alt={book.title} className="w-full aspect-[3/4] rounded-lg object-cover" />
        <p className="text-sm text-[#2C2C2C] mt-1.5 truncate" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {book.title}
        </p>
        <p className="text-xs text-[#8A8478]">{book.author}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push(`/book/${book.id}`)}
      className="w-36 flex-shrink-0 cursor-pointer"
    >
      <div className="relative">
        <img src={book.cover} alt={book.title} className="w-full h-48 rounded-xl object-cover shadow-sm" />
        {book.status === '在读' && book.progress !== undefined ? (
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full bg-white rounded-full" style={{ width: `${book.progress}%` }} />
            </div>
          </div>
        ) : null}
      </div>
      <h4 className="text-[#2C2C2C] mt-2 truncate text-sm" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        {book.title}
      </h4>
      <p className="text-xs text-[#8A8478] mt-0.5">{book.author}</p>
      <div className="flex items-center gap-1 mt-1">
        {book.moodTags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] text-[#4A6741] bg-[#4A6741]/8 px-1.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
