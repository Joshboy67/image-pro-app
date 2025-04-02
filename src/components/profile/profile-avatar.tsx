'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

type ProfileAvatarProps = {
  url: string | null;
  uid: string;
  onUploadComplete: () => void;
};

export function ProfileAvatar({ url, uid, onUploadComplete }: ProfileAvatarProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}/avatar.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user's avatar_url in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', uid);
      
      if (updateError) {
        throw updateError;
      }
      
      onUploadComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-muted">
        {url ? (
          <Image
            src={url}
            alt="Avatar"
            className="object-cover"
            fill
            sizes="128px"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <span className="text-3xl">
              {/* Placeholder user icon */}
              👤
            </span>
          </div>
        )}
      </div>
      
      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-input rounded-md text-sm font-medium">
        {uploading ? 'Uploading...' : 'Change Avatar'}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </label>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 