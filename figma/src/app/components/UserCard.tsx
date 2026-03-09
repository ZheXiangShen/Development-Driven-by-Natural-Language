'use client';

import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User } from '../data/mockData';

interface UserCardProps {
  user: User;
  variant?: 'horizontal' | 'compact';
}

export function UserCard({ user, variant = 'horizontal' }: UserCardProps) {
  const router = useRouter();

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push(`/profile/${user.id}`)}
        className="flex flex-col items-center gap-2 cursor-pointer"
      >
        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
        <p className="text-xs text-[#2C2C2C]">{user.name}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/profile/${user.id}`)}
      className="flex items-center gap-3 p-3 bg-white/60 rounded-xl cursor-pointer"
    >
      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className="text-[#2C2C2C] text-sm">{user.name}</h4>
        <p className="text-xs text-[#8A8478] mt-0.5 truncate">{user.bio}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {user.identityTags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] text-[#4A6741] bg-[#4A6741]/8 px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-[#8A8478]">
          <BookOpen size={12} />
          <span>{user.booksRead}</span>
        </div>
      </div>
    </motion.div>
  );
}
