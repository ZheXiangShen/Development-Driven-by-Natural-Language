'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Smile, BookOpen, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBubble } from '../components/ChatBubble';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingBlock } from '../components/shared/LoadingBlock';
import { useApiResource } from '../hooks/useApiResource';
import { fetchJson } from '../lib/api/client';
import type { ChatMessage } from '../data/mockData';
import type { ChatResponse } from '../lib/api/types';

interface ChatPageProps {
  userId?: string;
}

export function ChatPage({ userId }: ChatPageProps) {
  const router = useRouter();
  const resolvedUserId = userId ?? '2';
  const endpoint = `/api/chat/${resolvedUserId}`;

  const { data, loading, error, refetch } = useApiResource<ChatResponse>(endpoint);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(data?.messages ?? []);
  }, [data?.messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const content = inputText.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      const created = await fetchJson<{ message: ChatMessage }>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setMessages((prev) => [...prev, created.message]);
      setInputText('');
      setShowIcebreakers(false);
    } catch {
      // Keep the existing message list and let user retry.
    } finally {
      setSending(false);
    }
  };

  const handleIcebreaker = (text: string) => {
    setInputText(text);
    setShowIcebreakers(false);
  };

  if (error) {
    return (
      <div className="px-5 pt-16">
        <EmptyState
          emoji="⚠️"
          title="会话加载失败"
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

  if (!loading && !data?.user) {
    return (
      <div className="px-5 pt-16">
        <EmptyState emoji="👤" title="会话对象不存在" description="该用户可能已不可访问" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-white/80 backdrop-blur-lg border-b border-[#E8E4DD]/30">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} className="text-[#2C2C2C]" />
        </button>
        {loading ? (
          <>
            <LoadingBlock className="w-9 h-9 rounded-full" />
            <div className="flex-1">
              <LoadingBlock className="h-4 w-24" />
              <LoadingBlock className="h-3 w-28 mt-1" />
            </div>
          </>
        ) : (
          <>
            <img src={data?.user?.avatar} alt={data?.user?.name} className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1">
              <h4 className="text-sm text-[#2C2C2C]">{data?.user?.name}</h4>
              <p className="text-[10px] text-[#4A6741]">共同在读 {data?.sharedBooks.length ?? 0} 本书</p>
            </div>
          </>
        )}
        <button onClick={() => data?.user && router.push(`/profile/${data.user.id}`)}>
          <BookOpen size={18} className="text-[#8A8478]" />
        </button>
      </div>

      <div className="px-4 py-2 bg-[#4A6741]/5">
        <div className="flex items-center gap-2">
          <BookOpen size={13} className="text-[#4A6741]" />
          <span className="text-[11px] text-[#4A6741]">共同书籍：{data?.sharedBooks.join('、') || '暂无'}</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <>
            <LoadingBlock className="h-12 w-2/3 mb-3" />
            <LoadingBlock className="h-12 w-3/5 ml-auto mb-3" />
            <LoadingBlock className="h-12 w-2/3 mb-3" />
          </>
        ) : messages.length > 0 ? (
          messages.map((message) => <ChatBubble key={message.id} message={message} />)
        ) : (
          <EmptyState emoji="💬" title="还没有聊天记录" description="从一句破冰话题开始吧" compact />
        )}
      </div>

      <AnimatePresence>
        {showIcebreakers ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="px-4 pb-2">
            <p className="text-[10px] text-[#8A8478] mb-2">💡 快捷破冰</p>
            <div className="flex flex-wrap gap-2">
              {(data?.icebreakers ?? []).map((text) => (
                <motion.button key={text} whileTap={{ scale: 0.95 }} onClick={() => handleIcebreaker(text)} className="px-3 py-1.5 bg-white/80 text-xs text-[#2C2C2C] rounded-full border border-[#E8E4DD]">
                  {text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="px-4 pb-8 pt-2 bg-white/80 backdrop-blur-lg border-t border-[#E8E4DD]/30">
        <div className="flex items-end gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowIcebreakers(!showIcebreakers)} className="w-9 h-9 rounded-full bg-[#F0EBE3] flex items-center justify-center flex-shrink-0 mb-0.5">
            <ChevronUp size={16} className={`text-[#8A8478] transition-transform ${showIcebreakers ? 'rotate-180' : ''}`} />
          </motion.button>
          <div className="flex-1 bg-[#F5F0E8] rounded-2xl px-3 py-2 flex items-end gap-2">
            <textarea
              placeholder="说点什么..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              rows={1}
              className="flex-1 bg-transparent text-sm placeholder:text-[#8A8478]/60 outline-none resize-none max-h-20"
            />
            <button className="flex-shrink-0 mb-0.5">
              <Smile size={18} className="text-[#8A8478]" />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => void handleSend()}
            disabled={sending}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 transition-colors ${inputText.trim() ? 'bg-[#4A6741]' : 'bg-[#E8E4DD]'}`}
          >
            <Send size={16} className={inputText.trim() ? 'text-white' : 'text-[#8A8478]'} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
