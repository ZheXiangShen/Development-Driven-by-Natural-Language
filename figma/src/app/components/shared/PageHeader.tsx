import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <div className={`px-5 pt-14 pb-3 flex items-start justify-between ${className ?? ''}`.trim()}>
      <div>
        <h2 className="text-[#2C2C2C]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {title}
        </h2>
        {subtitle ? <p className="text-xs text-[#8A8478] mt-0.5">{subtitle}</p> : null}
      </div>
      {right ? <div className="ml-3 flex items-center gap-3">{right}</div> : null}
    </div>
  );
}
