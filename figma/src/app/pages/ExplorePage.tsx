'use client';

import { useMemo, useState } from 'react';
import { BookCard } from '../components/BookCard';
import { UserCard } from '../components/UserCard';
import { TagBadge } from '../components/TagBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { PageHeader } from '../components/shared/PageHeader';
import { SearchInput } from '../components/shared/SearchInput';
import { TabSwitch } from '../components/shared/TabSwitch';
import { useApiResource } from '../hooks/useApiResource';
import type { ExploreResponse } from '../lib/api/types';
import { IMAGES } from '../data/mockData';

export function ExplorePage() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'书' | '人'>('书');
  const [searchQuery, setSearchQuery] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (activeTheme) params.set('theme', activeTheme);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    const qs = params.toString();
    return `/api/explore${qs ? `?${qs}` : ''}`;
  }, [activeTheme, searchQuery]);

  const { data, loading, error, refetch } = useApiResource<ExploreResponse>(query);

  const themeCovers: Record<string, string> = {
    孤独: IMAGES.forest,
    治愈: IMAGES.ocean,
    女性主义: IMAGES.womanProfile,
    成长: IMAGES.library,
  };

  const themeTags = data?.themeTags ?? [];
  const books = data?.books ?? [];
  const users = data?.users ?? [];

  return (
    <div className="pb-4">
      <PageHeader title="探索" subtitle="按气质发现书与人" />

      <SearchInput placeholder="搜索书名、作者、主题..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <div className="px-5 mb-6">
        <p className="text-xs text-[#8A8478] mb-3">气质频道</p>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            <LoadingBlock className="h-28" />
            <LoadingBlock className="h-28" />
            <LoadingBlock className="h-28" />
            <LoadingBlock className="h-28" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {themeTags.slice(0, 4).map((tag) => (
              <button
                key={tag.label}
                onClick={() => setActiveTheme(activeTheme === tag.label ? null : tag.label)}
                className={`relative rounded-2xl overflow-hidden h-28 cursor-pointer ${activeTheme === tag.label ? 'ring-2 ring-[#4A6741]' : ''}`}
              >
                <img src={themeCovers[tag.label] || IMAGES.bookshelf} alt={tag.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{tag.emoji}</span>
                    <span className="text-white text-sm">{tag.label}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {!loading ? (
        <div className="px-5 mb-5">
          <div className="flex flex-wrap gap-2">
            {themeTags.slice(4).map((tag) => (
              <TagBadge
                key={tag.label}
                label={tag.label}
                emoji={tag.emoji}
                active={activeTheme === tag.label}
                onClick={() => setActiveTheme(activeTheme === tag.label ? null : tag.label)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="px-5 mb-4">
        <TabSwitch
          options={['书', '人'] as const}
          active={activeTab}
          onChange={setActiveTab}
          labelMap={{ 书: '相关书籍', 人: '气质相近的人' }}
          layoutId="explore-tab"
        />
      </div>

      {error ? (
        <EmptyState
          emoji="⚠️"
          title="探索数据加载失败"
          description={error}
          action={
            <button onClick={() => void refetch()} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
              重试
            </button>
          }
        />
      ) : null}

      <div className="px-5">
        {loading ? (
          <div className="space-y-2">
            <LoadingBlock className="h-24" />
            <LoadingBlock className="h-24" />
            <LoadingBlock className="h-24" />
          </div>
        ) : activeTab === '书' ? (
          <div className="space-y-2">
            {books.map((book) => (
              <BookCard key={book.id} book={book} variant="horizontal" />
            ))}
            {books.length === 0 ? (
              <EmptyState emoji="🔍" title={activeTheme ? `暂无"${activeTheme}"相关书籍` : '暂无书籍'} description="试试其他筛选条件" compact />
            ) : null}
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
            {users.length === 0 ? (
              <EmptyState emoji="👤" title={activeTheme ? `暂无"${activeTheme}"气质的读者` : '暂无读者'} description="探索更多主题" compact />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
