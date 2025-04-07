import { createBrowserClient } from '@supabase/ssr';
import { generatePKCEChallenge } from '@/lib/utils';

// Create Supabase client with your project credentials
const supabase = createBrowserClient(
  'https://htydmeedbkwavmwkgbeg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eWRtZWVkYmt3YXZtd2tnYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDY1MTEsImV4cCI6MjA1ODUyMjUxMX0.zmD6-eN59O5ph2lifO98oMguF6DaFzJ-ZS9-TE-XJMg'
);

// PKCE (Proof Key for Code Exchange) helper functions
export async function initiatePKCEFlow() {
  try {
    // Clear any existing session first
    await supabase.auth.signOut();

    // Generate PKCE challenge
    const { codeVerifier, codeChallenge } = await generatePKCEChallenge();

    // Store the code verifier in a cookie
    document.cookie = `code_verifier=${codeVerifier}; path=/; max-age=3600; SameSite=Lax`;

    // Construct the OAuth URL with PKCE
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        },
      },
    });

    if (error) {
      console.error('PKCE flow error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error initiating PKCE flow:', error);
    throw error;
  }
}

export async function handlePKCECallback(code: string) {
  try {
    // Get the code verifier from the cookie
    const cookies = document.cookie.split(';');
    const codeVerifierCookie = cookies.find(cookie => cookie.trim().startsWith('code_verifier='));
    const codeVerifier = codeVerifierCookie ? codeVerifierCookie.split('=')[1] : null;
    
    if (!codeVerifier) {
      throw new Error('No code verifier found in cookies');
    }

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      throw error;
    }

    // Clear the code verifier cookie
    document.cookie = 'code_verifier=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    return data;
  } catch (error) {
    console.error('Error handling PKCE callback:', error);
    throw error;
  }
} 