import { NextResponse } from 'next/server';
import { createPublish, getPublishData } from '@/src/app/lib/api/mock-db';
import type { PublishPayload } from '@/src/app/lib/api/types';

export async function POST(request: Request) {
  const body = (await request.json()) as PublishPayload;
  const item = await createPublish(body);

  if (!item) {
    return NextResponse.json({ error: '发布类型不能为空' }, { status: 400 });
  }

  return NextResponse.json({ item }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(await getPublishData());
}
