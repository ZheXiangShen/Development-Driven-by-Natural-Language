import { NextResponse } from 'next/server';
import { getProfileData } from '@/src/app/lib/api/mock-db';

export async function GET(_request: Request, { params }: { params: { userId: string } }) {
  const data = await getProfileData(params.userId);
  return NextResponse.json(data);
}
