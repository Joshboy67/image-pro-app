-- Add google_avatar_url column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS google_avatar_url text;

-- Create function to handle Google avatar updates
CREATE OR REPLACE FUNCTION handle_google_avatar_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If google_avatar_url has changed and is not null
  IF NEW.google_avatar_url IS NOT NULL AND 
     (OLD.google_avatar_url IS NULL OR NEW.google_avatar_url != OLD.google_avatar_url) THEN
    -- Update avatar_url to match google_avatar_url
    NEW.avatar_url = NEW.google_avatar_url;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for Google avatar updates
DROP TRIGGER IF EXISTS google_avatar_update_trigger ON profiles;
CREATE TRIGGER google_avatar_update_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_google_avatar_update();

-- Create RLS policy for avatar storage
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create function to sync Google avatar
CREATE OR REPLACE FUNCTION sync_google_avatar(user_id uuid)
RETURNS void AS $$
DECLARE
  google_url text;
  current_url text;
BEGIN
  -- Get current Google avatar URL
  SELECT google_avatar_url, avatar_url
  INTO google_url, current_url
  FROM profiles
  WHERE id = user_id;

  -- If Google URL exists and is different from current avatar
  IF google_url IS NOT NULL AND google_url != current_url THEN
    -- Update profile with new Google avatar URL
    UPDATE profiles
    SET google_avatar_url = google_url,
        avatar_url = google_url
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql; 