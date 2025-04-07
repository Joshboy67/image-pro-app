import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { initializeSharp } from '@/lib/sharp-config';

export async function GET() {
  try {
    // Initialize Sharp
    await initializeSharp();

    // Create a test image
    const buffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    // Return the image
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="test.png"'
      }
    });
  } catch (error) {
    console.error('Sharp test error:', error);
    return NextResponse.json(
      { error: 'Failed to process image with Sharp' },
      { status: 500 }
    );
  }
} 