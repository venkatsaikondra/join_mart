import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { imageData } = await req.json();

    // Validate image data
    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    // Check size limit (5MB)
    if (imageData.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 });
    }

    // Store image with a unique ID
    const imageId = randomUUID();
    const image = await db.images.create({
      id: imageId,
      data: imageData,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { imageId: image.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
