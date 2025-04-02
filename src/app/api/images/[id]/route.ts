import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';
import { databaseService } from '@/lib/database';
import { imageProcessingService } from '@/lib/image-processing';
import { withErrorHandler, Errors } from '@/middleware/error-handler';

// Get image details
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw Errors.Unauthorized();
  }

  const image = await databaseService.getImage(params.id);
  if (!image) {
    throw Errors.NotFound('Image not found');
  }

  if (image.user_id !== user.id) {
    throw Errors.Forbidden();
  }

  return NextResponse.json(image);
});

// Process image
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw Errors.Unauthorized();
  }

  const image = await databaseService.getImage(params.id);
  if (!image) {
    throw Errors.NotFound('Image not found');
  }

  if (image.user_id !== user.id) {
    throw Errors.Forbidden();
  }

  const options = await request.json();
  const processedUrl = await imageProcessingService.processImage(
    user.id,
    params.id,
    options
  );

  return NextResponse.json({ processed_url: processedUrl });
});

// Delete image
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw Errors.Unauthorized();
  }

  const image = await databaseService.getImage(params.id);
  if (!image) {
    throw Errors.NotFound('Image not found');
  }

  if (image.user_id !== user.id) {
    throw Errors.Forbidden();
  }

  await databaseService.deleteImage(params.id);
  return NextResponse.json({ success: true });
}); 