import 'server-only';

import {
  mockBooks,
  mockChatMessages,
  mockMessages,
  mockStories,
  mockTraces,
  mockUsers,
} from '@/src/app/data/mockData';
import { prisma } from '@/src/app/lib/prisma';
import { SEED_BASE_TIME, THREAD_ID_PREFIX } from './constants';

let seedPromise: Promise<void> | null = null;

export async function ensureThread(userId: string) {
  const existing = await prisma.messageThread.findUnique({ where: { userId } });
  if (existing) return existing;

  const firstBook = await prisma.book.findFirst({ orderBy: { createdAt: 'asc' } });

  return prisma.messageThread.create({
    data: {
      id: `${THREAD_ID_PREFIX}${userId}`,
      userId,
      lastMessage: '开始聊天吧',
      timeLabel: '刚刚',
      unread: 0,
      sharedBook: firstBook?.title ?? null,
    },
  });
}

export async function ensureSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const userCount = await prisma.user.count();
    if (userCount > 0) return;

    await prisma.$transaction(async (tx) => {
      await tx.user.createMany({
        data: mockUsers.map((user, index) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          identityTags: user.identityTags,
          booksRead: user.booksRead,
          highlights: user.highlights,
          followers: user.followers,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
          updatedAt: new Date(SEED_BASE_TIME + index * 1000),
        })),
      });

      await tx.book.createMany({
        data: mockBooks.map((book, index) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          status: book.status,
          rating: book.rating ?? null,
          highlights: book.highlights,
          notes: book.notes,
          moodTags: book.moodTags,
          themeTags: book.themeTags,
          progress: book.progress ?? null,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
          updatedAt: new Date(SEED_BASE_TIME + index * 1000),
        })),
      });

      await tx.story.createMany({
        data: mockStories.map((story, index) => ({
          id: story.id,
          userId: story.user.id,
          bookId: story.book.id,
          type: story.type,
          content: story.content,
          quote: story.quote ?? null,
          page: story.page ?? null,
          likes: story.likes,
          comments: story.comments,
          bookmarks: story.bookmarks,
          createdAtLabel: story.createdAt,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
          updatedAt: new Date(SEED_BASE_TIME + index * 1000),
        })),
      });

      await tx.readingTrace.createMany({
        data: mockTraces.map((trace, index) => ({
          id: trace.id,
          type: trace.type,
          content: trace.content,
          page: trace.page,
          note: trace.note ?? null,
          mood: trace.mood ?? null,
          createdAtLabel: trace.createdAt,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
          bookId: '1',
        })),
      });

      await tx.messageThread.createMany({
        data: mockMessages.map((msg, index) => ({
          id: `${THREAD_ID_PREFIX}${msg.user.id}`,
          userId: msg.user.id,
          lastMessage: msg.lastMessage,
          timeLabel: msg.time,
          unread: msg.unread,
          sharedBook: msg.sharedBook ?? null,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
          updatedAt: new Date(SEED_BASE_TIME + index * 1000),
        })),
      });

      await tx.chatMessage.createMany({
        data: mockChatMessages.map((message, index) => ({
          id: `chat-2-${message.id}`,
          threadId: `${THREAD_ID_PREFIX}2`,
          sender: message.sender,
          content: message.content,
          timeLabel: message.time,
          type: message.type ?? null,
          bookTitle: message.bookTitle ?? null,
          createdAt: new Date(SEED_BASE_TIME + index * 1000),
        })),
      });
    });
  })();

  try {
    await seedPromise;
  } finally {
    seedPromise = null;
  }
}
