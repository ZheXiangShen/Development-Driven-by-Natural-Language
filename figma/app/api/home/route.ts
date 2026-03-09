import { NextResponse } from 'next/server';
import { getHomeData } from '@/src/app/lib/api/mock-db';

export async function GET() {
  return NextResponse.json(await getHomeData());
}
