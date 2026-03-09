'use client';

import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/explore', icon: Compass, label: '探索' },
  { path: '/publish', icon: PlusCircle, label: '发布' },
  { path: '/messages', icon: MessageCircle, label: '消息' },
  { path: '/profile', icon: User, label: '我的' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[#E8E4DD]/60 px-2 pb-5 pt-1.5 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
          const isPublish = item.path === '/publish';

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
            >
              {isPublish ? (
                <div className="w-10 h-10 rounded-full bg-[#4A6741] flex items-center justify-center -mt-4 shadow-lg">
                  <PlusCircle size={22} className="text-white" />
                </div>
              ) : (
                <>
                  <item.icon
                    size={20}
                    className={isActive ? 'text-[#4A6741]' : 'text-[#8A8478]'}
                    strokeWidth={isActive ? 2.2 : 1.5}
                  />
                  <span className={`text-[10px] ${isActive ? 'text-[#4A6741]' : 'text-[#8A8478]'}`}>
                    {item.label}
                  </span>
                  {isActive ? (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -top-1.5 w-5 h-0.5 bg-[#4A6741] rounded-full"
                    />
                  ) : null}
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
