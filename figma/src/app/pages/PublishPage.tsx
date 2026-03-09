'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Highlighter, StickyNote, Hash, Smile, BookOpen, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TagBadge } from '../components/TagBadge';
import { themeTags } from '../data/mockData';
import { fetchJson } from '../lib/api/client';

type PublishType = '书籍' | '阅读痕迹' | '短内容';
type ReadingStatus = '在读' | '已读' | '想读';

export function PublishPage() {
  const router = useRouter();
  const [publishType, setPublishType] = useState<PublishType>('阅读痕迹');
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>('在读');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [highlightText, setHighlightText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [pageNum, setPageNum] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const toggleMood = (tag: string) => {
    setSelectedMoods((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const handlePublish = async () => {
    if (submitting) return;

    if (publishType === '书籍' && !bookTitle.trim()) {
      setSubmitError('请先填写书名');
      return;
    }

    if (publishType === '阅读痕迹' && !highlightText.trim() && !noteText.trim()) {
      setSubmitError('请至少填写摘录或批注内容');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitted(false);

    try {
      await fetchJson<{ item: { id: string } }>('/api/publish', {
        method: 'POST',
        body: JSON.stringify({
          publishType,
          readingStatus,
          bookTitle,
          bookAuthor,
          highlightText,
          noteText,
          pageNum,
          selectedMoods,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitError('发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-4">
      <div className="px-5 pt-14 pb-3 flex items-center justify-between">
        <button onClick={() => router.back()}>
          <X size={22} className="text-[#2C2C2C]" />
        </button>
        <h3 className="text-[#2C2C2C]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          发布
        </h3>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => void handlePublish()} disabled={submitting} className="px-4 py-1.5 bg-[#4A6741] text-white text-sm rounded-full disabled:opacity-70">
          {submitting ? '发布中...' : '发布'}
        </motion.button>
      </div>

      {submitError ? <p className="px-5 mb-3 text-xs text-[#C4533A]">{submitError}</p> : null}
      {submitted ? <p className="px-5 mb-3 text-xs text-[#4A6741]">发布成功，内容已提交到 API。</p> : null}

      <div className="px-5 mb-5">
        <div className="flex gap-2 bg-[#F0EBE3] rounded-xl p-1">
          {(['书籍', '阅读痕迹', '短内容'] as PublishType[]).map((type) => (
            <button
              key={type}
              onClick={() => setPublishType(type)}
              className={`flex-1 py-2 text-xs rounded-lg transition-all ${publishType === type ? 'bg-white text-[#2C2C2C] shadow-sm' : 'text-[#8A8478]'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {publishType === '书籍' ? (
          <motion.div key="book" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-5 space-y-4">
            <div className="flex gap-4">
              <div className="w-24 h-32 bg-[#F0EBE3] rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#D4CFC7]">
                <Camera size={20} className="text-[#8A8478]" />
                <span className="text-[10px] text-[#8A8478]">添加封面</span>
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="书名"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full bg-[#F5F0E8] rounded-lg px-3 py-2.5 text-sm placeholder:text-[#8A8478]/60 outline-none"
                />
                <input
                  type="text"
                  placeholder="作者"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full bg-[#F5F0E8] rounded-lg px-3 py-2.5 text-sm placeholder:text-[#8A8478]/60 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#8A8478] mb-2 block">阅读状态</label>
              <div className="relative">
                <button onClick={() => setShowStatusPicker(!showStatusPicker)} className="w-full bg-[#F5F0E8] rounded-lg px-3 py-2.5 text-sm flex items-center justify-between">
                  <span>{readingStatus}</span>
                  <ChevronDown size={16} className="text-[#8A8478]" />
                </button>
                <AnimatePresence>
                  {showStatusPicker ? (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-10">
                      {(['在读', '已读', '想读'] as ReadingStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setReadingStatus(status);
                            setShowStatusPicker(false);
                          }}
                          className="w-full px-3 py-2.5 text-sm text-left hover:bg-[#F5F0E8] flex items-center justify-between"
                        >
                          {status}
                          {readingStatus === status ? <Check size={14} className="text-[#4A6741]" /> : null}
                        </button>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : null}

        {publishType === '阅读痕迹' ? (
          <motion.div key="trace" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-5 space-y-4">
            <div className="bg-[#F5F0E8] rounded-xl p-3 flex items-center gap-3">
              <BookOpen size={18} className="text-[#4A6741]" />
              <span className="text-sm text-[#8A8478]">选择一本书...</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Highlighter size={14} className="text-[#8B7355]" />
                <label className="text-xs text-[#8A8478]">划线摘录</label>
              </div>
              <textarea
                placeholder="记录打动你的文字..."
                value={highlightText}
                onChange={(e) => setHighlightText(e.target.value)}
                className="w-full bg-[#F5F0E8] rounded-xl px-3 py-3 text-sm placeholder:text-[#8A8478]/60 outline-none resize-none min-h-[100px] leading-relaxed"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <StickyNote size={14} className="text-[#4A6741]" />
                <label className="text-xs text-[#8A8478]">我的批注</label>
              </div>
              <textarea
                placeholder="写下你的感想..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full bg-[#F5F0E8] rounded-xl px-3 py-3 text-sm placeholder:text-[#8A8478]/60 outline-none resize-none min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-[#8A8478]" />
                <label className="text-xs text-[#8A8478]">页码</label>
              </div>
              <input
                type="number"
                placeholder="0"
                value={pageNum}
                onChange={(e) => setPageNum(e.target.value)}
                className="w-20 bg-[#F5F0E8] rounded-lg px-3 py-2 text-sm text-center outline-none"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smile size={14} className="text-[#D4A574]" />
                <label className="text-xs text-[#8A8478]">阅读心情</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {themeTags.slice(0, 8).map((tag) => (
                  <TagBadge
                    key={tag.label}
                    label={tag.label}
                    emoji={tag.emoji}
                    active={selectedMoods.includes(tag.label)}
                    onClick={() => toggleMood(tag.label)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}

        {publishType === '短内容' ? (
          <motion.div key="short" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-5 space-y-4">
            <div className="flex gap-2">
              {['短评', '摘录', '读后感'].map((type) => (
                <button key={type} className="px-3 py-1.5 bg-white/80 text-xs text-[#2C2C2C] rounded-full border border-[#E8E4DD]">
                  {type}
                </button>
              ))}
            </div>

            <div className="bg-[#F5F0E8] rounded-xl p-3 flex items-center gap-3">
              <BookOpen size={18} className="text-[#4A6741]" />
              <span className="text-sm text-[#8A8478]">关联一本书...</span>
            </div>

            <textarea placeholder="分享你的阅读感悟..." className="w-full bg-transparent text-sm placeholder:text-[#8A8478]/60 outline-none resize-none min-h-[200px] leading-relaxed" />

            <div className="flex gap-2">
              <div className="w-16 h-16 bg-[#F0EBE3] rounded-lg flex items-center justify-center border border-dashed border-[#D4CFC7]">
                <Camera size={18} className="text-[#8A8478]" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
