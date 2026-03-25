import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const rooms = await db.rooms.findAll();
    
    // Enhance each room with product counts
    const enhancedRooms = await Promise.all(
      rooms.map(async (room) => {
        const products = await db.products.findByRoom(room.id);
        const productCount = {
          available: products.filter(p => p.status === 'available').length,
          held: products.filter(p => p.status === 'held').length,
          sold: products.filter(p => p.status === 'sold').length,
        };
        return {
          ...room,
          productCount,
        };
      })
    );

    return NextResponse.json(enhancedRooms, { status: 200 });
  } catch (error) {
    console.error('[ROOMS_FETCH_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
