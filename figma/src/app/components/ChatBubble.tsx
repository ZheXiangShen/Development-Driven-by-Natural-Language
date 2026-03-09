import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import type { ChatMessage } from '../data/mockData';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isMe = message.sender === 'me';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {message.type === 'book-intro' && message.bookTitle && (
          <div className="flex items-center gap-1.5 mb-1 px-2">
            <BookOpen size={10} className="text-[#4A6741]" />
            <span className="text-[10px] text-[#4A6741]">共同在读 · {message.bookTitle}</span>
          </div>
        )}
        <div
          className={`
            px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isMe
              ? 'bg-[#4A6741] text-white rounded-br-md'
              : 'bg-white text-[#2C2C2C] rounded-bl-md shadow-sm'
            }
          `}
        >
          {message.content}
        </div>
        <span className={`text-[10px] text-[#8A8478] mt-1 px-2 block ${isMe ? 'text-right' : 'text-left'}`}>
          {message.time}
        </span>
      </div>
    </motion.div>
  );
}
