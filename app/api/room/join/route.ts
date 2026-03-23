// app/api/room/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, name } = await req.json();

    if (!code || !name) {
      return NextResponse.json({ error: 'Room code and your name are required' }, { status: 400 });
    }

    // 1. Find the room
    const room = await db.rooms.findByCode(code.toUpperCase()); // Assume codes are uppercase
    if (!room) {
      return NextResponse.json({ error: 'Room not found. Check the code and try again.' }, { status: 404 });
    }

    // 2. Optional: Add user to a 'participants' table here if needed
    // await db.participants.add({ roomId: room.id, name });

    return NextResponse.json({ 
      success: true,
      roomId: room.id, 
      roomName: room.name,
      code: room.code 
    });

  } catch (error) {
    console.error('[ROOM_JOIN_ERROR]', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}