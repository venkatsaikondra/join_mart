// app/api/room/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateRoomCode } from '@/lib/generateCode';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const { roomName, yourName, description } = await req.json();

  if (!roomName || !yourName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Ensure unique code
  let code = generateRoomCode();
  let existingRoom = await db.rooms.findByCode(code);
  while (existingRoom) {
    code = generateRoomCode();
    existingRoom = await db.rooms.findByCode(code);
  }

  const room = await db.rooms.create({
    id: randomUUID(),
    code,
    name: roomName,
    description,
    createdBy: yourName,
  });

  return NextResponse.json({ code: room.code, roomId: room.id });
}