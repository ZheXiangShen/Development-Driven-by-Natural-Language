'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookCard } from '../components/BookCard';
import { StoryCard } from '../components/StoryCard';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { PageHeader } from '../components/shared/PageHeader';
import { TabSwitch } from '../components/shared/TabSwitch';
import { useApiResource } from '../hooks/useApiResource';
import type { HomeResponse } from '../lib/api/types';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<'推荐' | '关注'>('推荐');
  const router = useRouter();
  const { data, loading, error, refetch } = useApiResource<HomeResponse>('/api/home');

  const readingBooks = data?.readingBooks ?? [];
  const activeUsers = data?.activeUsers ?? [];
  const stories = data?.stories ?? [];
  const recommendBooks = data?.recommendBooks ?? [];

  return (
    <div className="pb-4">
      <PageHeader
        title="拾光书屋"
        subtitle="下午好"
        className="pb-4"
        right={
          <>
            <button className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">
              <Search size={18} className="text-[#2C2C2C]" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center relative">
              <Bell size={18} className="text-[#2C2C2C]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C4533A] rounded-full" />
            </button>
          </>
        }
      />

      {error ? (
        <EmptyState
          emoji="⚠️"
          title="首页数据加载失败"
          description={error}
          action={
            <button onClick={() => void refetch()} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
              重试
            </button>
          }
        />
      ) : null}

      {loading ? (
        <div className="px-5 mb-6">
          <h3 className="text-sm text-[#8A8478] mb-3">继续阅读</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            <LoadingBlock className="w-36 h-60 flex-shrink-0" />
            <LoadingBlock className="w-36 h-60 flex-shrink-0" />
            <LoadingBlock className="w-36 h-60 flex-shrink-0" />
          </div>
        </div>
      ) : null}

      {!loading && !error && readingBooks.length > 0 ? (
        <div className="px-5 mb-6">
          <h3 className="text-sm text-[#8A8478] mb-3">继续阅读</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {readingBooks.map((book) => (
              <BookCard key={book.id} book={book} variant="vertical" />
            ))}
          </div>
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-[#8A8478]">最近活跃的读者</h3>
            <button className="text-xs text-[#4A6741]">查看更多</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {activeUsers.map((user) => (
              <motion.div key={user.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#4A6741]/20" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#4A6741] rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">📖</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#2C2C2C]">{user.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {!error ? (
        <div className="px-5 mb-4">
          <TabSwitch options={['推荐', '关注'] as const} active={activeTab} onChange={setActiveTab} layoutId="home-tab" />
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="px-5 space-y-3">
          {activeTab === '推荐' ? (
            stories.length > 0 ? (
              stories.map((story) => <StoryCard key={story.id} story={story} />)
            ) : (
              <EmptyState emoji="🗒️" title="暂无推荐内容" description="稍后再来看看新的阅读故事" compact />
            )
          ) : (
            <EmptyState
              emoji="📚"
              title="关注更多读者"
              description="发现与你阅读气质相近的人"
              action={
                <button onClick={() => router.push('/explore')} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
                  去探索
                </button>
              }
            />
          )}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-[#8A8478]">你可能想读</h3>
            <button onClick={() => router.push('/community')} className="text-xs text-[#4A6741]">
              更多
            </button>
          </div>
          <div className="space-y-2">
            {recommendBooks.map((book) => (
              <BookCard key={book.id} book={book} variant="horizontal" />
            ))}
            {recommendBooks.length === 0 ? <EmptyState emoji="📖" title="暂无推荐书籍" description="稍后会为你推荐" compact /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
