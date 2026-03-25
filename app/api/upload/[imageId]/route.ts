import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const image = await db.images.findById(imageId);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ data: image.data }, { status: 200 });
  } catch (error) {
    console.error('[IMAGE_FETCH_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
