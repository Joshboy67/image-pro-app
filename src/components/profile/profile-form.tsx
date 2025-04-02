'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { ProfileAvatar } from './profile-avatar';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  display_name: string | null;
  bio: string | null;
  website: string | null;
  email_notifications: boolean;
  theme: string;
  image_quality: string;
};

type ProfileFormProps = {
  profile: Profile;
  user: User;
};

export function ProfileForm({ profile, user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    email_notifications: profile?.email_notifications || true,
    theme: profile?.theme || 'light',
    image_quality: profile?.image_quality || 'high',
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          display_name: formData.display_name,
          bio: formData.bio,
          website: formData.website,
          email_notifications: formData.email_notifications,
          theme: formData.theme,
          image_quality: formData.image_quality,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Profile updated successfully');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-600 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <ProfileAvatar 
            url={profile?.avatar_url} 
            uid={user.id} 
            onUploadComplete={() => router.refresh()} 
          />
        </div>
        
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is how your name will appear publicly
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="email_notifications"
              name="email_notifications"
              type="checkbox"
              checked={formData.email_notifications}
              onChange={handleCheckboxChange}
              className="rounded border-input h-4 w-4"
            />
            <label htmlFor="email_notifications" className="ml-2 block text-sm">
              Receive email notifications
            </label>
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="image_quality" className="block text-sm font-medium mb-1">
              Default Image Quality
            </label>
            <select
              id="image_quality"
              name="image_quality"
              value={formData.image_quality}
              onChange={handleChange}
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="low">Low (faster)</option>
              <option value="medium">Medium</option>
              <option value="high">High (best quality)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
} 