import { NextResponse } from 'next/server';
import { createChatMessage, getChatData } from '@/src/app/lib/api/mock-db';

export async function GET(_request: Request, { params }: { params: { userId: string } }) {
  const data = await getChatData(params.userId);
  return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const body = (await request.json()) as { content?: string };
  const created = await createChatMessage(params.userId, body.content ?? '');

  if (!created) {
    return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
  }

  return NextResponse.json({ message: created }, { status: 201 });
}
