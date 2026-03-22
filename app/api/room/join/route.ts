// app/api/room/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { code, name } = await req.json();
  if (!code || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const room = await db.rooms.findByCode(code);
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  return NextResponse.json({ roomId: room.id, code: room.code });
}