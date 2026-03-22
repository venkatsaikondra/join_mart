// app/api/product/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const { roomId, name, description, price, imageUrl } = await req.json();

  if (!roomId || !name || price === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const room = await db.rooms.findById(roomId);
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const product = await db.products.create({
    id: randomUUID(),
    roomId,
    name,
    description: description ?? '',
    price: Number(price),
    imageUrl: imageUrl ?? '',
  });

  return NextResponse.json(product, { status: 201 });
}