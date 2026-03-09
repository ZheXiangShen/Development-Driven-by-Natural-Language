import type { ReactNode } from 'react';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ emoji, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-12' : 'py-16'}`}>
      <div className={`${compact ? 'w-14 h-14' : 'w-16 h-16'} bg-[#F0EBE3] rounded-full flex items-center justify-center mb-4`}>
        <span className={compact ? 'text-xl' : 'text-2xl'}>{emoji}</span>
      </div>
      <p className="text-sm text-[#8A8478]">{title}</p>
      <p className="text-xs text-[#8A8478]/60 mt-1">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
