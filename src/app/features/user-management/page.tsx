'use client';

import { useState } from 'react';
import { FileText, Database, Upload, UserCircle, Key } from 'lucide-react';

export default function UserManagementFeature() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'database', name: 'Database Schema', icon: Database },
    { id: 'storage', name: 'Storage Setup', icon: Upload },
    { id: 'auth', name: 'Authentication', icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile Management</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Feature Overview</h2>
            <div className="prose max-w-none">
              <h3>User Profile Management System</h3>
              <p>
                A comprehensive user profile management system that handles user information,
                avatar storage, and OAuth integration with Google.
              </p>

              <h4>Core Features</h4>
              <ul>
                <li>User profile data management (CRUD operations)</li>
                <li>Avatar upload and storage using Supabase Storage</li>
                <li>Automatic profile data population from Google OAuth</li>
                <li>Profile editing interface</li>
                <li>Real-time updates</li>
              </ul>

              <h4>Data Structure</h4>
              <ul>
                <li>Full Name</li>
                <li>Location</li>
                <li>Bio</li>
                <li>Avatar URL</li>
                <li>Email (from OAuth)</li>
                <li>Last Updated</li>
              </ul>

              <h4>Technical Implementation</h4>
              <ul>
                <li>Frontend: Next.js with TypeScript</li>
                <li>Backend: Supabase</li>
                <li>Storage: Supabase Storage</li>
                <li>Authentication: Supabase Auth with Google OAuth</li>
                <li>State Management: React Context</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Database Schema</h2>
            <div className="prose max-w-none">
              <h3>Supabase Table: profiles</h3>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                {`CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  PRIMARY KEY (id)
);`}
              </pre>

              <h4>Row Level Security (RLS) Policies</h4>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                {`-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Storage Setup</h2>
            <div className="prose max-w-none">
              <h3>Supabase Storage Configuration</h3>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                {`-- Create storage bucket for avatars with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Storage policies with improved security
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid AND
    (storage.foldername(name))[2] = 'avatar' AND
    (storage.foldername(name))[3] IS NULL
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid AND
    (storage.foldername(name))[2] = 'avatar' AND
    (storage.foldername(name))[3] IS NULL
  );

-- Function to handle avatar deletion
CREATE OR REPLACE FUNCTION delete_old_avatar()
RETURNS trigger AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'avatars'
    AND name = OLD.avatar_url;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for avatar deletion
CREATE TRIGGER on_avatar_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
  EXECUTE FUNCTION delete_old_avatar();`}
              </pre>

              <h4>Storage Structure</h4>
              <ul>
                <li>Bucket Name: avatars</li>
                <li>Path Structure: avatars/{"{user_id}"}/avatar.{"{extension}"}</li>
                <li>Supported Formats: jpg, jpeg, png, gif, webp</li>
                <li>Max File Size: 5MB</li>
                <li>Automatic cleanup of old avatars</li>
                <li>Strict path validation in policies</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Authentication Flow</h2>
            <div className="prose max-w-none">
              <h3>Google OAuth Integration</h3>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                {`-- Enable Google OAuth in Supabase
-- Go to Authentication > Providers > Google
-- Configure with your Google OAuth credentials

-- Database function to handle new user creation with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    RETURN new;
  END IF;

  -- Insert new profile with error handling
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    email,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    new.email,
    NOW(),
    NOW()
  );

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return new user anyway
    RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to handle profile updates
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile updates
DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_update();`}
              </pre>

              <h4>Authentication Flow</h4>
              <ol>
                <li>User clicks "Sign in with Google"</li>
                <li>Google OAuth flow completes with proper error handling</li>
                <li>Supabase creates new user record with metadata</li>
                <li>Database trigger creates profile record with error handling</li>
                <li>Profile is populated with Google data and default values</li>
                <li>User is redirected to dashboard with session management</li>
              </ol>

              <h4>Security Features</h4>
              <ul>
                <li>Automatic timestamp management</li>
                <li>Error handling and logging</li>
                <li>Default values for required fields</li>
                <li>Duplicate profile prevention</li>
                <li>Session management</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 