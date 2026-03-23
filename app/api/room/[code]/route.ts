// app/api/room/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = await db.rooms.findByCode(code);
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const products = await db.products.findByRoom(room.id);

  return NextResponse.json({
    id: room.id,
    code: room.code,
    name: room.name,
    description: room.description,
    createdBy: room.createdBy,
    products,
  });
}