import { NextResponse } from 'next/server';
import { getBookDetailData } from '@/src/app/lib/api/mock-db';

export async function GET(_request: Request, { params }: { params: { bookId: string } }) {
  const data = await getBookDetailData(params.bookId);
  return NextResponse.json(data);
}
