import { createClient } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAMES = {
  AVATARS: 'avatars',
  PROCESSED_IMAGES: 'processed-images',
  TEMP_UPLOADS: 'temp-uploads',
} as const;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class StorageService {
  private supabase = createClient();

  private async uploadFile(
    bucket: string,
    file: File,
    path: string,
    options: { upsert?: boolean } = {}
  ) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options.upsert,
      });

    if (error) throw error;
    return data;
  }

  private async getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  private async deleteFile(bucket: string, path: string) {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }

  async uploadAvatar(userId: string, file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    await this.uploadFile(BUCKET_NAMES.AVATARS, file, filePath, { upsert: true });
    return this.getPublicUrl(BUCKET_NAMES.AVATARS, filePath);
  }

  async uploadImage(userId: string, file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    await this.uploadFile(BUCKET_NAMES.TEMP_UPLOADS, file, filePath);
    return this.getPublicUrl(BUCKET_NAMES.TEMP_UPLOADS, filePath);
  }

  async saveProcessedImage(userId: string, file: File, originalFileName: string) {
    const fileExt = originalFileName.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    await this.uploadFile(BUCKET_NAMES.PROCESSED_IMAGES, file, filePath);
    return this.getPublicUrl(BUCKET_NAMES.PROCESSED_IMAGES, filePath);
  }

  async deleteImage(bucket: string, path: string) {
    await this.deleteFile(bucket, path);
  }
}

export const storageService = new StorageService(); 