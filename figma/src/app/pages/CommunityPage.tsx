'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { StoryCard } from '../components/StoryCard';
import { TagBadge } from '../components/TagBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { PageHeader } from '../components/shared/PageHeader';
import { SearchInput } from '../components/shared/SearchInput';
import { TabSwitch } from '../components/shared/TabSwitch';
import { useApiResource } from '../hooks/useApiResource';
import type { CommunityResponse } from '../lib/api/types';

const filters = ['全部', '短评', '摘录', '读后感'] as const;
type Filter = (typeof filters)[number];

export function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (activeFilter !== '全部') params.set('filter', activeFilter);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    const qs = params.toString();
    return `/api/community${qs ? `?${qs}` : ''}`;
  }, [activeFilter, searchQuery]);

  const { data, loading, error, refetch } = useApiResource<CommunityResponse>(query);

  const stories = data?.stories ?? [];
  const themeTags = data?.themeTags ?? [];

  return (
    <div className="pb-4">
      <PageHeader title="故事" subtitle="每一段阅读，都是一个故事" />

      <SearchInput
        placeholder="搜索故事、摘录..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        trailing={<SlidersHorizontal size={16} className="text-[#8A8478]" />}
      />

      {loading ? (
        <div className="mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-5">
            <LoadingBlock className="h-8 w-16 rounded-full" />
            <LoadingBlock className="h-8 w-16 rounded-full" />
            <LoadingBlock className="h-8 w-16 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-5">
            {themeTags.slice(0, 6).map((tag) => (
              <TagBadge key={tag.label} label={tag.label} emoji={tag.emoji} size="sm" />
            ))}
          </div>
        </div>
      )}

      <div className="px-5 mb-4">
        <TabSwitch options={filters} active={activeFilter} onChange={setActiveFilter} layoutId="community-filter" />
      </div>

      {error ? (
        <EmptyState
          emoji="⚠️"
          title="社区内容加载失败"
          description={error}
          action={
            <button onClick={() => void refetch()} className="px-5 py-2 bg-[#4A6741] text-white text-sm rounded-full">
              重试
            </button>
          }
        />
      ) : null}

      <div className="px-5 space-y-3">
        {loading ? (
          <>
            <LoadingBlock className="h-48" />
            <LoadingBlock className="h-48" />
          </>
        ) : (
          stories.map((story) => <StoryCard key={story.id} story={story} />)
        )}

        {!loading && stories.length === 0 ? <EmptyState emoji="📝" title="暂无相关内容" description="换个筛选条件试试" /> : null}
      </div>
    </div>
  );
}
