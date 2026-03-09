import { NextResponse } from 'next/server';
import { getExploreData } from '@/src/app/lib/api/mock-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const data = await getExploreData({
    theme: searchParams.get('theme') ?? undefined,
    q: searchParams.get('q') ?? undefined,
  });

  return NextResponse.json(data);
}
