import type { Prisma } from '@prisma/client';
import type {
  Book as BookDTO,
  ChatMessage as ChatMessageDTO,
  Story as StoryDTO,
  User as UserDTO,
} from '@/src/app/data/mockData';
import type { BookDetailResponse, PublishItem } from '../types';
import { toStatus, toStringArray } from './utils';

export function mapUser(user: {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  identityTags: Prisma.JsonValue;
  booksRead: number;
  highlights: number;
  followers: number;
}): UserDTO {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    identityTags: toStringArray(user.identityTags),
    booksRead: user.booksRead,
    highlights: user.highlights,
    followers: user.followers,
  };
}

export function mapBook(book: {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: string;
  rating: number | null;
  highlights: number;
  notes: number;
  moodTags: Prisma.JsonValue;
  themeTags: Prisma.JsonValue;
  progress: number | null;
}): BookDTO {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    status: toStatus(book.status),
    rating: book.rating ?? undefined,
    highlights: book.highlights,
    notes: book.notes,
    moodTags: toStringArray(book.moodTags),
    themeTags: toStringArray(book.themeTags),
    progress: book.progress ?? undefined,
  };
}

export function mapStory(story: {
  id: string;
  type: string;
  content: string;
  quote: string | null;
  page: number | null;
  likes: number;
  comments: number;
  bookmarks: number;
  createdAtLabel: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    identityTags: Prisma.JsonValue;
    booksRead: number;
    highlights: number;
    followers: number;
  };
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
    status: string;
    rating: number | null;
    highlights: number;
    notes: number;
    moodTags: Prisma.JsonValue;
    themeTags: Prisma.JsonValue;
    progress: number | null;
  };
}): StoryDTO {
  return {
    id: story.id,
    user: mapUser(story.user),
    book: mapBook(story.book),
    type: story.type as StoryDTO['type'],
    content: story.content,
    quote: story.quote ?? undefined,
    page: story.page ?? undefined,
    likes: story.likes,
    comments: story.comments,
    bookmarks: story.bookmarks,
    createdAt: story.createdAtLabel,
  };
}

export function mapChatMessage(message: {
  id: string;
  sender: string;
  content: string;
  timeLabel: string;
  type: string | null;
  bookTitle: string | null;
}): ChatMessageDTO {
  return {
    id: message.id,
    sender: message.sender as ChatMessageDTO['sender'],
    content: message.content,
    time: message.timeLabel,
    type: (message.type ?? undefined) as ChatMessageDTO['type'],
    bookTitle: message.bookTitle ?? undefined,
  };
}

export function mapReadingTrace(trace: {
  id: string;
  type: string;
  content: string;
  page: number;
  note: string | null;
  createdAtLabel: string;
  mood: string | null;
}): BookDetailResponse['traces'][number] {
  return {
    id: trace.id,
    type: trace.type as BookDetailResponse['traces'][number]['type'],
    content: trace.content,
    page: trace.page,
    note: trace.note ?? undefined,
    createdAt: trace.createdAtLabel,
    mood: trace.mood ?? undefined,
  };
}

export function mapPublishItem(item: {
  id: string;
  createdAt: Date;
  publishType: string;
  bookTitle: string | null;
  bookAuthor: string | null;
  readingStatus: string | null;
  highlightText: string | null;
  noteText: string | null;
  pageNum: string | null;
  selectedMoods: Prisma.JsonValue;
}): PublishItem {
  return {
    id: item.id,
    createdAt: item.createdAt.toISOString(),
    publishType: item.publishType as PublishItem['publishType'],
    bookTitle: item.bookTitle ?? undefined,
    bookAuthor: item.bookAuthor ?? undefined,
    readingStatus: (item.readingStatus ?? undefined) as PublishItem['readingStatus'],
    highlightText: item.highlightText ?? undefined,
    noteText: item.noteText ?? undefined,
    pageNum: item.pageNum ?? undefined,
    selectedMoods: toStringArray(item.selectedMoods),
  };
}
