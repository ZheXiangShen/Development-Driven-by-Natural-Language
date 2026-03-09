import type { Prisma } from '@prisma/client';
import type { Book as BookDTO } from '@/src/app/data/mockData';
import type { ReadingStatus } from '../types';

export function toStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item));
}

export function toStatus(status: string): BookDTO['status'] {
  if (status === '在读' || status === '已读' || status === '想读') return status;
  return '想读';
}

export function nowLabel() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export function normalize(input: string) {
  return input.trim().toLowerCase();
}

export function hasQuery(query: string, ...fields: Array<string | undefined>) {
  const needle = normalize(query);
  if (!needle) return true;
  return fields.some((field) => (field ?? '').toLowerCase().includes(needle));
}

export function getProgressByStatus(status: ReadingStatus) {
  if (status === '已读') return 100;
  if (status === '在读') return 12;
  return null;
}
