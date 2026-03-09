'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith('/chat/');

  return (
    <div
      className="flex justify-center min-h-screen bg-[#E8E4DD]"
      style={{ fontFamily: "'Noto Sans SC', 'Noto Serif SC', sans-serif" }}
    >
      <div className="w-full max-w-[390px] min-h-screen bg-[#FAF7F2] relative flex flex-col shadow-2xl">
        <div className={`flex-1 overflow-y-auto ${hideNav ? '' : 'pb-20'}`}>{children}</div>
        {!hideNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}
