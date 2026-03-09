import type { Book, ChatMessage, Message, ReadingTrace, Story, User } from '@/src/app/data/mockData';

export interface HomeResponse {
  readingBooks: Book[];
  activeUsers: User[];
  stories: Story[];
  recommendBooks: Book[];
}

export interface ExploreResponse {
  books: Book[];
  users: User[];
  themeTags: Array<{ label: string; emoji: string; color: string }>;
}

export interface CommunityResponse {
  stories: Story[];
  themeTags: Array<{ label: string; emoji: string; color: string }>;
}

export interface MessagesResponse {
  messages: Message[];
}

export interface BookDetailResponse {
  book: Book | null;
  traces: ReadingTrace[];
  readers: User[];
}

export interface ProfileResponse {
  user: User | null;
  books: Book[];
  highlightBooks: Book[];
}

export interface ChatResponse {
  user: User | null;
  messages: ChatMessage[];
  sharedBooks: string[];
  icebreakers: string[];
}

export type PublishType = '书籍' | '阅读痕迹' | '短内容';
export type ReadingStatus = '在读' | '已读' | '想读';

export interface PublishPayload {
  publishType?: PublishType;
  bookTitle?: string;
  bookAuthor?: string;
  readingStatus?: ReadingStatus;
  highlightText?: string;
  noteText?: string;
  pageNum?: string;
  selectedMoods?: string[];
}

export interface PublishItem {
  id: string;
  createdAt: string;
  publishType: PublishType;
  bookTitle?: string;
  bookAuthor?: string;
  readingStatus?: ReadingStatus;
  highlightText?: string;
  noteText?: string;
  pageNum?: string;
  selectedMoods: string[];
}

export interface PublishResponse {
  items: PublishItem[];
}
