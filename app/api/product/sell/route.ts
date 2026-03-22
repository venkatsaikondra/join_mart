// app/api/product/sell/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }

  const product = await db.products.findById(productId);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  if (product.status === 'sold') {
    return NextResponse.json({ error: 'Product already sold' }, { status: 409 });
  }

  const updated = await db.products.updateStatus(productId, 'sold');
  return NextResponse.json(updated);
}