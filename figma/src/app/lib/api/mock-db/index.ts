import 'server-only';

import { IMAGES, icebreakers, themeTags, type Message as MessageDTO } from '@/src/app/data/mockData';
import { prisma } from '@/src/app/lib/prisma';
import type {
  BookDetailResponse,
  ChatResponse,
  CommunityResponse,
  ExploreResponse,
  HomeResponse,
  MessagesResponse,
  ProfileResponse,
  PublishItem,
  PublishPayload,
  PublishResponse,
} from '../types';
import { CURRENT_USER_ID } from './constants';
import {
  mapBook,
  mapChatMessage,
  mapPublishItem,
  mapReadingTrace,
  mapStory,
  mapUser,
} from './mappers';
import { ensureSeeded, ensureThread } from './seed';
import { getProgressByStatus, hasQuery, nowLabel } from './utils';

export async function getHomeData(): Promise<HomeResponse> {
  await ensureSeeded();

  const [books, users, stories] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ orderBy: { id: 'asc' }, take: 4 }),
    prisma.story.findMany({ include: { user: true, book: true }, orderBy: { createdAt: 'desc' } }),
  ]);

  const mappedBooks = books.map(mapBook);

  return {
    readingBooks: mappedBooks.filter((book) => book.status === '在读'),
    activeUsers: users.map(mapUser),
    stories: stories.map(mapStory),
    recommendBooks: mappedBooks.filter((book) => book.status !== '在读').slice(0, 3),
  };
}

export async function getExploreData(params: { theme?: string; q?: string }): Promise<ExploreResponse> {
  await ensureSeeded();

  const theme = params.theme?.trim();
  const q = params.q?.trim() ?? '';

  const [books, users] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ orderBy: { id: 'asc' } }),
  ]);

  const filteredBooks = books
    .map(mapBook)
    .filter((book) => {
      const byTheme = !theme || book.moodTags.includes(theme) || book.themeTags.includes(theme);
      const byQuery = hasQuery(q, book.title, book.author, ...book.themeTags, ...book.moodTags);
      return byTheme && byQuery;
    });

  const filteredUsers = users
    .map(mapUser)
    .filter((user) => {
      const byTheme = !theme || user.identityTags.some((tag) => tag.includes(theme));
      const byQuery = hasQuery(q, user.name, user.bio, ...user.identityTags);
      return byTheme && byQuery;
    });

  return {
    books: filteredBooks,
    users: filteredUsers,
    themeTags,
  };
}

export async function getCommunityData(params: { filter?: string; q?: string }): Promise<CommunityResponse> {
  await ensureSeeded();

  const filter = params.filter?.trim();
  const q = params.q?.trim() ?? '';

  const stories = await prisma.story.findMany({ include: { user: true, book: true }, orderBy: { createdAt: 'desc' } });

  return {
    stories: stories
      .map(mapStory)
      .filter((story) => {
        const byFilter = !filter || filter === '全部' || story.type === filter;
        const byQuery = hasQuery(q, story.content, story.quote, story.user.name, story.book.title, story.book.author);
        return byFilter && byQuery;
      }),
    themeTags,
  };
}

export async function getMessagesData(params: { q?: string }): Promise<MessagesResponse> {
  await ensureSeeded();

  const q = params.q?.trim() ?? '';

  const threads = await prisma.messageThread.findMany({
    include: { user: true },
    orderBy: { updatedAt: 'desc' },
  });

  const messages: MessageDTO[] = threads
    .map((thread) => ({
      id: thread.id,
      user: mapUser(thread.user),
      lastMessage: thread.lastMessage,
      time: thread.timeLabel,
      unread: thread.unread,
      sharedBook: thread.sharedBook ?? undefined,
    }))
    .filter((item) => hasQuery(q, item.user.name, item.lastMessage, item.sharedBook));

  return { messages };
}

export async function getBookDetailData(bookId: string): Promise<BookDetailResponse> {
  await ensureSeeded();

  const book = await prisma.book.findUnique({ where: { id: bookId } });

  if (!book) {
    return {
      book: null,
      traces: [],
      readers: [],
    };
  }

  const [traces, readers] = await Promise.all([
    prisma.readingTrace.findMany({ where: { OR: [{ bookId }, { bookId: null }] }, orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ orderBy: { id: 'asc' }, take: 4 }),
  ]);

  return {
    book: mapBook(book),
    traces: traces.map(mapReadingTrace),
    readers: readers.map(mapUser),
  };
}

export async function getProfileData(profileId: string): Promise<ProfileResponse> {
  await ensureSeeded();

  const resolvedId = profileId === 'me' ? CURRENT_USER_ID : profileId;
  const user = await prisma.user.findUnique({ where: { id: resolvedId } });

  if (!user) {
    return {
      user: null,
      books: [],
      highlightBooks: [],
    };
  }

  const allBooks = (await prisma.book.findMany({ orderBy: { createdAt: 'desc' } })).map(mapBook);

  const books =
    resolvedId === CURRENT_USER_ID
      ? allBooks
      : allBooks.filter((_, index) => ((index + (Number.parseInt(resolvedId, 10) || 1)) % 2 === 0));

  const pickedBooks = books.length > 0 ? books : allBooks.slice(0, 3);

  return {
    user: mapUser(user),
    books: pickedBooks,
    highlightBooks: pickedBooks.filter((book) => book.highlights > 0).slice(0, 3),
  };
}

export async function getChatData(userId: string): Promise<ChatResponse> {
  await ensureSeeded();

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return {
      user: null,
      messages: [],
      sharedBooks: [],
      icebreakers,
    };
  }

  const thread = await ensureThread(userId);

  const [messages, books] = await Promise.all([
    prisma.chatMessage.findMany({ where: { threadId: thread.id }, orderBy: { createdAt: 'asc' } }),
    prisma.book.findMany({ orderBy: { createdAt: 'desc' }, take: 2 }),
  ]);

  return {
    user: mapUser(user),
    messages: messages.map(mapChatMessage),
    sharedBooks: books.map((book) => book.title),
    icebreakers,
  };
}

export async function createChatMessage(userId: string, content: string) {
  await ensureSeeded();

  const text = content.trim();
  if (!text) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const thread = await ensureThread(userId);
  const time = nowLabel();

  const created = await prisma.chatMessage.create({
    data: {
      id: `chat-${Date.now()}`,
      threadId: thread.id,
      sender: 'me',
      content: text,
      timeLabel: time,
      type: null,
      bookTitle: null,
    },
  });

  await prisma.messageThread.update({
    where: { id: thread.id },
    data: {
      lastMessage: text,
      timeLabel: time,
      unread: 0,
    },
  });

  return mapChatMessage(created);
}

export async function createPublish(payload: PublishPayload): Promise<PublishItem | null> {
  await ensureSeeded();

  if (!payload.publishType) return null;
  const publishType = payload.publishType;
  const publishId = `publish-${Date.now()}`;

  return prisma.$transaction(async (tx) => {
    const createdPublish = await tx.publishItem.create({
      data: {
        id: publishId,
        publishType,
        bookTitle: payload.bookTitle?.trim() || null,
        bookAuthor: payload.bookAuthor?.trim() || null,
        readingStatus: payload.readingStatus ?? null,
        highlightText: payload.highlightText?.trim() || null,
        noteText: payload.noteText?.trim() || null,
        pageNum: payload.pageNum?.trim() || null,
        selectedMoods: payload.selectedMoods ?? [],
      },
    });

    let linkedBook =
      payload.bookTitle?.trim()
        ? await tx.book.findFirst({ where: { title: payload.bookTitle.trim() }, orderBy: { createdAt: 'desc' } })
        : null;

    if (!linkedBook && (payload.publishType === '书籍' || payload.bookTitle?.trim())) {
      linkedBook = await tx.book.create({
        data: {
          id: `book-${publishId}`,
          title: payload.bookTitle?.trim() || '未命名书籍',
          author: payload.bookAuthor?.trim() || '佚名',
          cover: IMAGES.bookCover,
          status: payload.readingStatus ?? '在读',
          rating: null,
          highlights: payload.highlightText?.trim() ? 1 : 0,
          notes: payload.noteText?.trim() ? 1 : 0,
          moodTags: payload.selectedMoods ?? ['记录'],
          themeTags: payload.selectedMoods ?? ['个人发布'],
          progress: getProgressByStatus(payload.readingStatus ?? '在读'),
        },
      });
    }

    if (!linkedBook) {
      linkedBook = await tx.book.findFirst({ orderBy: { createdAt: 'asc' } });
    }

    if (linkedBook) {
      const currentUser = await tx.user.findUnique({ where: { id: CURRENT_USER_ID } });

      if (currentUser) {
        if (publishType === '书籍') {
          await tx.story.create({
            data: {
              id: `story-${publishId}`,
              userId: currentUser.id,
              bookId: linkedBook.id,
              type: '短评',
              content: `我刚刚发布了书籍《${linkedBook.title}》，欢迎一起交流。`,
              quote: null,
              page: null,
              likes: 0,
              comments: 0,
              bookmarks: 0,
              createdAtLabel: '刚刚',
            },
          });
        } else {
          const storyType = publishType === '阅读痕迹' ? '摘录' : '短评';
          const quote = publishType === '阅读痕迹' ? payload.highlightText?.trim() || null : null;
          const content =
            publishType === '阅读痕迹'
              ? payload.noteText?.trim() || ''
              : payload.noteText?.trim() || payload.highlightText?.trim() || '分享了新的阅读感受';
          const page = payload.pageNum ? Number.parseInt(payload.pageNum, 10) : null;

          await tx.story.create({
            data: {
              id: `story-${publishId}`,
              userId: currentUser.id,
              bookId: linkedBook.id,
              type: storyType,
              content,
              quote,
              page: Number.isFinite(page ?? Number.NaN) ? page : null,
              likes: 0,
              comments: 0,
              bookmarks: 0,
              createdAtLabel: '刚刚',
            },
          });
        }
      }
    }

    return mapPublishItem(createdPublish);
  });
}

export async function getPublishData(): Promise<PublishResponse> {
  await ensureSeeded();

  const items = await prisma.publishItem.findMany({ orderBy: { createdAt: 'desc' } });

  return {
    items: items.map(mapPublishItem),
  };
}
