import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert the File to Buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Get original image dimensions
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Calculate new dimensions (2x upscale)
    const newWidth = originalWidth * 2;
    const newHeight = originalHeight * 2;

    // Process the image with Sharp
    const processedImage = await sharp(buffer)
      .resize({
        width: newWidth,
        height: newHeight,
        fit: 'fill',
        withoutEnlargement: false,
        kernel: 'lanczos3'
      })
      .sharpen({
        sigma: 1.2,
        m1: 0.5,
        m2: 0.5
      })
      .jpeg({ 
        quality: 95,
        mozjpeg: true,
        chromaSubsampling: '4:4:4'
      })
      .toBuffer();

    // Return the processed image
    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename="upscaled-image.jpg"'
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 