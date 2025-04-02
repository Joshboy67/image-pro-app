import { createBrowserClient } from '@supabase/ssr';
import { User } from '@/types';
import { DatabaseError } from '@/lib/errors';

// Create a single instance of the Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class AuthService {
  private static instance: AuthService;
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(email: string, password: string, fullName: string, username: string) {
    try {
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new DatabaseError('Failed to check username availability');
      }

      if (existingUser) {
        throw new Error('Username is already taken');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
          },
        },
      });

      if (authError) throw new DatabaseError('Failed to sign up');

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            full_name: fullName,
          });

        if (profileError) throw new DatabaseError('Failed to create profile');
      }

      return authData;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  }

  async handleGoogleSignIn(user: User) {
    try {
      const googleAvatarUrl = user.user_metadata?.avatar_url;
      
      if (googleAvatarUrl) {
        // Create or update profile with Google data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            google_avatar_url: googleAvatarUrl,
            full_name: user.user_metadata?.full_name,
            email: user.email,
            avatar_url: googleAvatarUrl, // Use Google avatar as default
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // Download and store Google avatar
        await this.downloadAndStoreGoogleAvatar(user.id, googleAvatarUrl);
      }

      return user;
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
      throw error;
    }
  }

  private async downloadAndStoreGoogleAvatar(userId: string, googleAvatarUrl: string) {
    try {
      // Download the avatar from Google
      const response = await fetch(googleAvatarUrl);
      if (!response.ok) throw new Error('Failed to download Google avatar');
      
      const blob = await response.blob();
      const fileExt = 'png';
      const filePath = `${userId}/avatar.${fileExt}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error processing Google avatar:', error);
      return null;
    }
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  }

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Get profile error:', profileError);
        throw new DatabaseError('Failed to get profile');
      }

      return {
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata,
        full_name: profile.full_name,
        username: profile.username,
        bio: profile.bio,
        website: profile.website,
        location: profile.location,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Get user error:', userError);
        throw new DatabaseError('Failed to get user');
      }
      if (!user) throw new DatabaseError('No user found');

      // Validate username if provided
      if (data.username) {
        try {
          // First, get the current user's profile to check if username is being changed
          const { data: currentProfile, error: currentProfileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (currentProfileError) {
            console.error('Get current profile error:', currentProfileError);
            throw new DatabaseError('Failed to get current profile');
          }

          // Only check username availability if it's different from current username
          if (data.username !== currentProfile?.username) {
            // Check if username is already taken by another user
            const { data: existingUser, error: checkError } = await supabase
              .from('profiles')
              .select('id')
              .eq('username', data.username)
              .neq('id', user.id)
              .maybeSingle();

            if (checkError) {
              console.error('Username check error:', checkError);
              throw new DatabaseError('Failed to check username availability');
            }

            if (existingUser) {
              throw new Error('Username is already taken');
            }
          }
        } catch (error) {
          console.error('Username validation error:', error);
          throw error;
        }
      }

      // Update profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          username: data.username,
          bio: data.bio,
          website: data.website,
          location: data.location,
          avatar_url: data.avatar_url,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new DatabaseError('Failed to update profile');
      }

      // If there's a new avatar, upload it
      if (data.avatar_url && data.avatar_url !== profile.avatar_url) {
        try {
          const response = await fetch(data.avatar_url);
          if (!response.ok) throw new Error('Failed to download avatar');
          
          const blob = await response.blob();
          const fileExt = 'png';
          const filePath = `${user.id}/avatar.${fileExt}`;
          
          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, {
              contentType: 'image/png',
              upsert: true
            });
          
          if (uploadError) {
            console.error('Avatar upload error:', uploadError);
            throw new DatabaseError('Failed to upload avatar');
          }
          
          // Get the public URL
          const { data: publicURL } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          
          // Update profile with new avatar URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicURL.publicUrl })
            .eq('id', user.id);
          
          if (updateError) {
            console.error('Avatar URL update error:', updateError);
            throw new DatabaseError('Failed to update avatar URL');
          }
        } catch (error) {
          console.error('Error processing avatar:', error);
          // Don't throw here, as the profile was already updated
        }
      }

      return profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async deleteAccount() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    // Delete profile and related data
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;

    // Delete user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id);

    if (settingsError) throw settingsError;

    // Delete user account
    const { error: accountError } = await supabase.auth.admin.deleteUser(user.id);
    if (accountError) throw accountError;
  }

  // OAuth methods
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = AuthService.getInstance(); 