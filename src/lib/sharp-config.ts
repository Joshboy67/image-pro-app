// This file should only be used on the server side
'use server';

import sharp from 'sharp';

// Server-side Sharp configuration
export const sharpConfig = {
  // Default options for image processing
  defaultOptions: {
    quality: 80,
    compressionLevel: 6,
    effort: 6,
  },
  
  // Supported output formats
  supportedFormats: ['jpeg', 'png', 'webp'] as const,
  
  // Maximum image dimensions
  maxDimensions: {
    width: 4096,
    height: 4096,
  },
  
  // Maximum file size (10MB)
  maxFileSize: 10 * 1024 * 1024,

  // Quality range for image processing
  qualityRange: {
    min: 1,
    max: 100,
    default: 80,
  },

  // Memory limit for image processing (in bytes)
  memoryLimit: 256 * 1024 * 1024, // 256MB
};

// Initialize Sharp with default settings
export async function initializeSharp() {
  try {
    // Test Sharp installation
    await sharp({
      create: {
        width: 1,
        height: 1,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).toBuffer();
    
    console.log('Sharp initialized successfully');
  } catch (error) {
    console.error('Error initializing Sharp:', error);
    throw error;
  }
}

// Export the supported formats for client-side use
export const supportedFormats = sharpConfig.supportedFormats;
export const qualityRange = sharpConfig.qualityRange;
export const memoryLimit = sharpConfig.memoryLimit; 