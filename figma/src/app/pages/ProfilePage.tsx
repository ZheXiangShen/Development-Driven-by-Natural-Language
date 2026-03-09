'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Highlighter, BookOpen, Users, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookCard } from '../components/BookCard';
import { TagBadge } from '../components/TagBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { PageHeader } from '../components/shared/PageHeader';
import { TabSwitch } from '../components/shared/TabSwitch';
import { useApiResource } from '../hooks/useApiResource';
import type { ProfileResponse } from '../lib/api/types';

interface ProfilePageProps {
  profileId?: string;
}

export function ProfilePage({ profileId }: ProfilePageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'书单' | '痕迹' | '观点'>('书单');

  const isMe = !profileId;
  const endpointId = profileId ?? 'me';
  const { data, loading, error, refetch } = useApiResource<ProfileResponse>(`/api/profile/${endpointId}`);

  const user = data?.user ?? null;
  const books = data?.books ?? [];
  const highlightBooks = data?.highlightBooks ?? [];

  if (error) {
    return (
      <div className="px-5 pt-16">
        <EmptyState
          emoji="⚠️"
          title="个人主页加载失败"
          description={error}
          action={
            <button onClick={() => void refetch()} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
              重试
            </button>
          }
        />
      </div>
    );
  }

  if (!loading && !user) {
    return (
      <div className="px-5 pt-16">
        <EmptyState emoji="👤" title="用户不存在" description="该读者可能已注销" />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        title={isMe ? '我的' : ''}
        right={
          isMe ? (
            <button className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">
              <Settings size={18} className="text-[#2C2C2C]" />
            </button>
          ) : null
        }
      />

      <div className="px-5 mb-5">
        <div className="bg-white/70 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            {loading || !user ? <LoadingBlock className="w-18 h-18 rounded-2xl" /> : <img src={user.avatar} alt={user.name} className="w-18 h-18 rounded-2xl object-cover" />}
            <div className="flex-1">
              {loading || !user ? (
                <>
                  <LoadingBlock className="h-6 w-28" />
                  <LoadingBlock className="h-4 w-full mt-2" />
                  <LoadingBlock className="h-4 w-2/3 mt-2" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#2C2C2C]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                      {user.name}
                    </h2>
                    {isMe ? <Edit3 size={14} className="text-[#8A8478]" /> : null}
                  </div>
                  <p className="text-xs text-[#8A8478] mt-1 leading-relaxed">{user.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {user.identityTags.map((tag) => (
                      <TagBadge key={tag} label={tag} size="sm" />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-around mt-5 pt-4 border-t border-[#E8E4DD]/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <BookOpen size={13} className="text-[#4A6741]" />
                <span className="text-lg text-[#2C2C2C]">{user?.booksRead ?? '-'}</span>
              </div>
              <p className="text-[10px] text-[#8A8478]">已读</p>
            </div>
            <div className="w-px h-8 bg-[#E8E4DD]" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Highlighter size={13} className="text-[#8B7355]" />
                <span className="text-lg text-[#2C2C2C]">{user?.highlights ?? '-'}</span>
              </div>
              <p className="text-[10px] text-[#8A8478]">划线</p>
            </div>
            <div className="w-px h-8 bg-[#E8E4DD]" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Users size={13} className="text-[#C4533A]" />
                <span className="text-lg text-[#2C2C2C]">{user?.followers ?? '-'}</span>
              </div>
              <p className="text-[10px] text-[#8A8478]">关注者</p>
            </div>
          </div>
        </div>

        {!isMe && user ? (
          <div className="flex gap-3 mt-3">
            <motion.button whileTap={{ scale: 0.97 }} className="flex-1 py-2.5 bg-[#4A6741] text-white text-sm rounded-xl">
              关注
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/chat/${user.id}`)}
              className="flex-1 py-2.5 bg-white text-[#2C2C2C] text-sm rounded-xl border border-[#E8E4DD]"
            >
              私信
            </motion.button>
          </div>
        ) : null}
      </div>

      <div className="px-5 mb-5">
        <p className="text-xs text-[#8A8478] mb-2">📌 置顶观点</p>
        <div className="bg-[#4A6741]/5 rounded-xl p-4 border-l-3 border-[#4A6741]">
          <p className="text-sm text-[#2C2C2C] leading-relaxed italic" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            "阅读不是逃避现实，而是为了更好地理解这个世界，以及自己在其中的位置。"
          </p>
        </div>
      </div>

      <div className="px-5 mb-4">
        <TabSwitch options={['书单', '痕迹', '观点'] as const} active={activeTab} onChange={setActiveTab} layoutId="profile-tab" />
      </div>

      <div className="px-5">
        {activeTab === '书单' ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              {['全部', '在读', '已读', '想读'].map((status, idx) => (
                <button
                  key={status}
                  className={`px-3 py-1 text-xs rounded-full ${idx === 0 ? 'bg-[#4A6741] text-white' : 'bg-white/80 text-[#8A8478]'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-3">
                <LoadingBlock className="aspect-[3/4]" />
                <LoadingBlock className="aspect-[3/4]" />
                <LoadingBlock className="aspect-[3/4]" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} variant="compact" />
                ))}
              </div>
            )}
            {!loading && books.length === 0 ? <EmptyState emoji="📚" title="书单还是空的" description="先去添加几本书吧" compact /> : null}
          </div>
        ) : null}

        {activeTab === '痕迹' ? (
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => <LoadingBlock key={index} className="h-24" />)
              : highlightBooks.map((book) => <BookCard key={book.id} book={book} variant="horizontal" />)}
            {!loading && highlightBooks.length === 0 ? <EmptyState emoji="✍️" title="还没有痕迹内容" description="发布一条读书痕迹吧" compact /> : null}
          </div>
        ) : null}

        {activeTab === '观点' ? <EmptyState emoji="💭" title="还没有发布观点" description="分享你独特的阅读见解" compact /> : null}
      </div>
    </div>
  );
}
