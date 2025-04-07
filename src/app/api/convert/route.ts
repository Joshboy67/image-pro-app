import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase';
import { initializeSharp } from '@/lib/sharp-config';

// Initialize Sharp on the server side
await initializeSharp();

export async function POST(request: NextRequest) {
  try {
    // Check if the request is valid
    if (!request.body) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string;
    const quality = parseInt(formData.get('quality') as string) || 80;

    if (!file || !targetFormat) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with Sharp
    let processedImage = sharp(buffer);

    // Set quality and format
    switch (targetFormat.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        processedImage = processedImage.jpeg({ quality });
        break;
      case 'png':
        processedImage = processedImage.png({ quality });
        break;
      case 'webp':
        processedImage = processedImage.webp({ quality });
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    // Get the processed image buffer
    const processedBuffer = await processedImage.toBuffer();

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name.split('.')[0];
    const newFilename = `${originalName}_converted_${timestamp}.${targetFormat}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('converted-images')
      .upload(`${session.user.id}/${newFilename}`, processedBuffer, {
        contentType: `image/${targetFormat}`,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to save converted image' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('converted-images')
      .getPublicUrl(`${session.user.id}/${newFilename}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: newFilename
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
} 