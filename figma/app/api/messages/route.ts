import { NextResponse } from 'next/server';
import { getMessagesData } from '@/src/app/lib/api/mock-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const data = await getMessagesData({
    q: searchParams.get('q') ?? undefined,
  });

  return NextResponse.json(data);
}
