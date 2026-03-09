import { motion } from 'motion/react';

interface TagBadgeProps {
  label: string;
  emoji?: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
  color?: string;
}

export function TagBadge({ label, emoji, active = false, onClick, size = 'md', color }: TagBadgeProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 rounded-full transition-all
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1.5 text-xs'}
        ${active
          ? 'bg-[#4A6741] text-white shadow-sm'
          : 'bg-white/80 text-[#2C2C2C] hover:bg-white'
        }
      `}
      style={active && color ? { backgroundColor: color } : undefined}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </motion.button>
  );
}
