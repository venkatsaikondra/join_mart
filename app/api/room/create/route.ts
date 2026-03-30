// app/api/room/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateRoomCode } from '@/lib/generateCode';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomName, yourName, description } = body;

    // 1. Validation
    if (!roomName?.trim() || !yourName?.trim()) {
      return NextResponse.json({ error: 'Room name and your name are required' }, { status: 400 });
    }

    // 2. Unique Code Generation (with safety limit)
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      code = generateRoomCode();
      const existing = await db.rooms.findByCode(code);
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: 'Failed to generate a unique room code. Try again.' }, { status: 500 });
    }

    // 3. Database Creation
    const room = await db.rooms.create({
      id: randomUUID(),
      code,
      name: roomName.trim(),
      description: description?.trim() || '',
      createdBy: yourName.trim(),
    });

    if (!room) {
      return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      code: room.code, 
      roomId: room.id 
    }, { status: 201 });

  } catch (error) {
    console.error('[ROOM_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}