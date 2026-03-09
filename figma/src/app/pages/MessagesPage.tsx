'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { PageHeader } from '../components/shared/PageHeader';
import { SearchInput } from '../components/shared/SearchInput';
import { useApiResource } from '../hooks/useApiResource';
import type { MessagesResponse } from '../lib/api/types';

export function MessagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    const qs = params.toString();
    return `/api/messages${qs ? `?${qs}` : ''}`;
  }, [searchQuery]);

  const { data, loading, error, refetch } = useApiResource<MessagesResponse>(query);

  const messages = data?.messages ?? [];

  return (
    <div className="pb-4">
      <PageHeader title="消息" />

      <SearchInput placeholder="搜索对话..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {error ? (
        <EmptyState
          emoji="⚠️"
          title="消息加载失败"
          description={error}
          action={
            <button onClick={() => void refetch()} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
              重试
            </button>
          }
        />
      ) : null}

      <div className="px-5 space-y-0.5">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <LoadingBlock key={index} className="h-20 mb-2" />)
          : messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/chat/${msg.user.id}`)}
                className="flex items-center gap-3 py-3.5 cursor-pointer border-b border-[#E8E4DD]/30 last:border-0"
              >
                <div className="relative flex-shrink-0">
                  <img src={msg.user.avatar} alt={msg.user.name} className="w-12 h-12 rounded-full object-cover" />
                  {msg.unread > 0 ? (
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C4533A] rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white">{msg.unread}</span>
                    </div>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm text-[#2C2C2C]">{msg.user.name}</h4>
                    <span className="text-[10px] text-[#8A8478]">{msg.time}</span>
                  </div>
                  <p className="text-xs text-[#8A8478] truncate">{msg.lastMessage}</p>
                  {msg.sharedBook ? (
                    <div className="flex items-center gap-1 mt-1">
                      <BookOpen size={10} className="text-[#4A6741]" />
                      <span className="text-[10px] text-[#4A6741]">共同在读 · {msg.sharedBook}</span>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
      </div>

      {!loading && messages.length === 0 ? (
        <EmptyState
          emoji="💌"
          title="还没有消息"
          description="遇到有趣的读者，开始一段对话吧"
          action={
            <button onClick={() => router.push('/explore')} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
              去探索
            </button>
          }
        />
      ) : null}
    </div>
  );
}
