'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Heart, MessageCircle, Highlighter, StickyNote, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TagBadge } from '../components/TagBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { TabSwitch } from '../components/shared/TabSwitch';
import { useApiResource } from '../hooks/useApiResource';
import type { BookDetailResponse } from '../lib/api/types';

interface BookDetailPageProps {
  bookId?: string;
}

export function BookDetailPage({ bookId }: BookDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'痕迹' | '讨论'>('痕迹');
  const { data, loading, error, refetch } = useApiResource<BookDetailResponse>(`/api/books/${bookId ?? '1'}`);

  const book = data?.book;
  const traces = data?.traces ?? [];
  const readers = data?.readers ?? [];

  if (error) {
    return (
      <div className="px-5 pt-16">
        <EmptyState
          emoji="⚠️"
          title="书籍详情加载失败"
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

  if (!loading && !book) {
    return (
      <div className="px-5 pt-16">
        <EmptyState emoji="📕" title="找不到这本书" description="它可能已被删除或不存在" />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="relative">
        <div className="absolute inset-0 h-72">
          {loading || !book ? <LoadingBlock className="h-full rounded-none" /> : <img src={book.cover} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#FAF7F2]" />
        </div>

        <div className="relative z-10 px-5 pt-14 pb-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={18} className="text-white" />
          </button>
        </div>

        <div className="relative z-10 px-5 pt-8 flex gap-4">
          {loading || !book ? (
            <LoadingBlock className="w-28 h-40 rounded-xl flex-shrink-0" />
          ) : (
            <img src={book.cover} alt={book.title} className="w-28 h-40 rounded-xl object-cover shadow-lg flex-shrink-0" />
          )}
          <div className="flex-1 pt-6">
            {loading || !book ? (
              <>
                <LoadingBlock className="h-6 w-32" />
                <LoadingBlock className="h-4 w-24 mt-2" />
                <LoadingBlock className="h-4 w-20 mt-2" />
              </>
            ) : (
              <>
                <h2 className="text-[#2C2C2C]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {book.title}
                </h2>
                <p className="text-sm text-[#8A8478] mt-1">{book.author}</p>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={`text-sm ${index < (book.rating || 0) ? 'text-[#D4A574]' : 'text-[#E8E4DD]'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-[#4A6741] bg-[#4A6741]/10 px-2.5 py-1 rounded-full">{book.status}</span>
                  {book.progress !== undefined && book.progress < 100 ? <span className="text-xs text-[#8A8478]">{book.progress}%</span> : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-white/60 rounded-xl p-3 text-center">
            <Highlighter size={16} className="text-[#8B7355] mx-auto mb-1" />
            <p className="text-lg text-[#2C2C2C]">{book?.highlights ?? '-'}</p>
            <p className="text-[10px] text-[#8A8478]">划线</p>
          </div>
          <div className="flex-1 bg-white/60 rounded-xl p-3 text-center">
            <StickyNote size={16} className="text-[#4A6741] mx-auto mb-1" />
            <p className="text-lg text-[#2C2C2C]">{book?.notes ?? '-'}</p>
            <p className="text-[10px] text-[#8A8478]">批注</p>
          </div>
          <div className="flex-1 bg-white/60 rounded-xl p-3 text-center">
            <Heart size={16} className="text-[#C4533A] mx-auto mb-1" />
            <p className="text-lg text-[#2C2C2C]">12</p>
            <p className="text-[10px] text-[#8A8478]">收藏</p>
          </div>
        </div>
      </div>

      {book ? (
        <div className="px-5 mb-5">
          <p className="text-xs text-[#8A8478] mb-2">阅读气质</p>
          <div className="flex flex-wrap gap-2">
            {[...book.moodTags, ...book.themeTags].map((tag) => (
              <TagBadge key={tag} label={tag} size="sm" />
            ))}
          </div>
        </div>
      ) : null}

      <div className="px-5 mb-4">
        <TabSwitch
          options={['痕迹', '讨论'] as const}
          active={activeTab}
          onChange={setActiveTab}
          labelMap={{ 痕迹: '阅读痕迹', 讨论: '讨论区' }}
          layoutId="book-tab"
        />
      </div>

      {activeTab === '痕迹' ? (
        <div className="px-5 space-y-0">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <LoadingBlock key={index} className="h-20 mb-3" />)
            : traces.map((trace, index) => (
                <motion.div key={trace.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${trace.type === '划线' ? 'bg-[#8B7355]' : trace.type === '批注' ? 'bg-[#4A6741]' : 'bg-[#D4A574]'}`} />
                    {index < traces.length - 1 ? <div className="w-px flex-1 bg-[#E8E4DD] my-1" /> : null}
                  </div>

                  <div className="pb-5 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-[#8A8478]">{trace.createdAt}</span>
                      <span className="text-[10px] text-[#8A8478] bg-[#F0EBE3] px-1.5 py-0.5 rounded">P.{trace.page}</span>
                      {trace.mood ? <span className="text-[10px] text-[#4A6741] bg-[#4A6741]/8 px-1.5 py-0.5 rounded-full">{trace.mood}</span> : null}
                    </div>
                    <p className="text-sm text-[#2C2C2C] leading-relaxed" style={trace.type === '划线' ? { fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' } : undefined}>
                      {trace.type === '划线' ? `"${trace.content}"` : trace.content}
                    </p>
                    {trace.note ? <p className="text-xs text-[#8A8478] mt-1 pl-2 border-l-2 border-[#4A6741]/20">{trace.note}</p> : null}
                  </div>
                </motion.div>
              ))}
          {!loading && traces.length === 0 ? <EmptyState emoji="✍️" title="还没有阅读痕迹" description="先发布一条划线或批注" compact /> : null}
        </div>
      ) : (
        <div className="px-5">
          <div className="mb-4">
            <p className="text-xs text-[#8A8478] mb-3">也在读这本书的人</p>
            <div className="flex -space-x-2">
              {readers.map((user) => (
                <img key={user.id} src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#FAF7F2]" />
              ))}
              <div className="w-9 h-9 rounded-full bg-[#F0EBE3] border-2 border-[#FAF7F2] flex items-center justify-center">
                <span className="text-[10px] text-[#8A8478]">+8</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 rounded-xl p-4 text-center">
            <MessageCircle size={24} className="text-[#8A8478] mx-auto mb-2" />
            <EmptyState emoji="💬" title="还没有讨论" description="成为第一个分享感想的人" compact action={<button className="px-4 py-2 bg-[#4A6741] text-white text-sm rounded-full">写一条</button>} />
          </div>
        </div>
      )}

      <div className="px-5 mt-6">
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => router.push('/publish')} className="w-full py-3 bg-[#4A6741] text-white rounded-xl flex items-center justify-center gap-2">
          <BookOpen size={18} />
          <span className="text-sm">记录阅读痕迹</span>
        </motion.button>
      </div>
    </div>
  );
}
