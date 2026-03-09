interface LoadingBlockProps {
  className?: string;
}

export function LoadingBlock({ className }: LoadingBlockProps) {
  return <div className={`animate-pulse rounded-xl bg-[#E8E4DD]/70 ${className ?? ''}`.trim()} />;
}
