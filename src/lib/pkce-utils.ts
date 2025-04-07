'use client';

export async function generatePKCEChallenge() {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in the browser');
  }

  // Generate a random string for the code verifier using Web Crypto API
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = btoa(Array.from(array).map(byte => String.fromCharCode(byte)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 43);

  // Generate code challenge using the Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the digest to base64url format
  const codeChallenge = btoa(Array.from(new Uint8Array(digest)).map(byte => String.fromCharCode(byte)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return {
    codeVerifier,
    codeChallenge,
  };
} 