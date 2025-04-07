import { createBrowserClient } from '@supabase/ssr';
import { User } from '@/types';
import { DatabaseError } from '@/lib/errors';
import { initiatePKCEFlow } from '@/lib/pkce-client';

// Create Supabase client with your project credentials
const supabase = createBrowserClient(
  'https://htydmeedbkwavmwkgbeg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eWRtZWVkYmt3YXZtd2tnYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDY1MTEsImV4cCI6MjA1ODUyMjUxMX0.zmD6-eN59O5ph2lifO98oMguF6DaFzJ-ZS9-TE-XJMg'
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
    try {
      // Use our PKCE helper
      const data = await initiatePKCEFlow();
      return data;
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  }

  async handleGoogleSignIn(user: User) {
    try {
      console.log('Handling Google sign-in for user:', user);
      
      // Generate a unique username if not provided
      const username = user.user_metadata?.username || `user_${user.id.substring(0, 8)}`;
      
      // Log the user metadata we're working with
      console.log('User metadata:', user.user_metadata);
      
      // Create or update profile with Google data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          google_avatar_url: user.user_metadata?.avatar_url || null,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || null,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      console.log('Profile updated successfully:', profile);

      // Download and store Google avatar if available
      if (user.user_metadata?.avatar_url) {
        try {
          const avatarUrl = await this.downloadAndStoreGoogleAvatar(user.id, user.user_metadata.avatar_url);
          if (avatarUrl) {
            console.log('Avatar processed:', avatarUrl);
          }
        } catch (error) {
          console.error('Error processing avatar:', error);
          // Continue even if avatar processing fails
        }
      }

      return profile;
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
      if (userError) {
        console.error('Auth user error:', userError);
        throw userError;
      }
      if (!user) return null;

      // First try to get the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: `user_${user.id.substring(0, 8)}`,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
          })
          .select()
          .single();

        if (createError) {
          console.error('Create profile error:', createError);
          throw new DatabaseError('Failed to create profile');
        }

        return {
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata,
          full_name: newProfile.full_name,
          username: newProfile.username,
          bio: newProfile.bio,
          website: newProfile.website,
          location: newProfile.location,
          avatar_url: newProfile.avatar_url,
          created_at: newProfile.created_at,
          updated_at: newProfile.updated_at,
        };
      }

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