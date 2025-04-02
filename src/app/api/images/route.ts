import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withErrorHandler, Errors } from '@/middleware/error-handler';
import { Image } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  const { data: images, error, count } = await supabase
    .from('images')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return NextResponse.json({
    images,
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  });
});

export const POST = withErrorHandler(async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    throw Errors.badRequest('No file provided');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw Errors.badRequest('File must be an image');
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw Errors.badRequest('File size must be less than 5MB');
  }

  // Upload to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  // Create image record
  const { data: image, error: insertError } = await supabase
    .from('images')
    .insert({
      original_url: publicUrl,
      status: 'pending',
      metadata: {
        size: file.size,
        type: file.type,
      },
    })
    .select()
    .single();

  if (insertError) throw insertError;

  return NextResponse.json(image);
}); 