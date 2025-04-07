// This file should only be used on the server side
'use server';

import sharp from 'sharp';

// Server-side Sharp configuration
export const sharpConfig = {
  // Maximum image dimensions
  maxWidth: 4096,
  maxHeight: 4096,
};

// Initialize Sharp with default settings
export async function initializeSharp() {
  sharp.cache(false); // Disable caching for better memory management
  sharp.concurrency(1); // Limit concurrent operations
}

// Export the supported formats for client-side use
export const supportedFormats = sharpConfig.supportedFormats;
export const qualityRange = sharpConfig.qualityRange;
export const memoryLimit = sharpConfig.memoryLimit; 