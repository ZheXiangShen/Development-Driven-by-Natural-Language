import { NextResponse } from 'next/server';
import { getCommunityData } from '@/src/app/lib/api/mock-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const data = await getCommunityData({
    filter: searchParams.get('filter') ?? undefined,
    q: searchParams.get('q') ?? undefined,
  });

  return NextResponse.json(data);
}
