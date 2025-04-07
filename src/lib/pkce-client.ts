'use client';

import { createBrowserClient } from '@supabase/ssr';
import { generatePKCEChallenge } from '@/lib/pkce-utils';

// Create Supabase client with your project credentials
const supabase = createBrowserClient(
  'https://htydmeedbkwavmwkgbeg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eWRtZWVkYmt3YXZtd2tnYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDY1MTEsImV4cCI6MjA1ODUyMjUxMX0.zmD6-eN59O5ph2lifO98oMguF6DaFzJ-ZS9-TE-XJMg'
);

// PKCE (Proof Key for Code Exchange) helper functions
export async function initiatePKCEFlow() {
  try {
    // Clear any existing code verifier
    sessionStorage.removeItem('code_verifier');
    
    // Generate new PKCE challenge
    const { codeVerifier, codeChallenge } = await generatePKCEChallenge();
    
    // Store code verifier in sessionStorage
    sessionStorage.setItem('code_verifier', codeVerifier);
    console.log('Stored code verifier:', codeVerifier);
    
    return { codeVerifier, codeChallenge };
  } catch (error) {
    console.error('Error initiating PKCE flow:', error);
    throw error;
  }
}

export function getStoredCodeVerifier() {
  const codeVerifier = sessionStorage.getItem('code_verifier');
  console.log('Retrieved code verifier:', codeVerifier);
  return codeVerifier;
}

export function clearStoredCodeVerifier() {
  sessionStorage.removeItem('code_verifier');
  console.log('Cleared code verifier from storage');
}

export async function handlePKCECallback(code: string) {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in the browser');
  }

  try {
    // Get the code verifier from sessionStorage
    const codeVerifier = sessionStorage.getItem('code_verifier');
    console.log('Retrieved code verifier:', codeVerifier);
    
    if (!codeVerifier) {
      throw new Error('No code verifier found in sessionStorage');
    }

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      throw error;
    }

    // Clear the code verifier from sessionStorage
    sessionStorage.removeItem('code_verifier');

    return data;
  } catch (error) {
    console.error('Error handling PKCE callback:', error);
    throw error;
  }
} 