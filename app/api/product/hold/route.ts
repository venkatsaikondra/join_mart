// app/api/product/hold/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { productId, userName } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }

  const product = await db.products.findById(productId);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  if (product.status !== 'available') {
    return NextResponse.json(
      { error: `Cannot hold — item is already ${product.status}` },
      { status: 409 }
    );
  }

  const updated = await db.products.updateStatus(productId, 'held', userName ?? 'Someone');
  return NextResponse.json(updated);
}