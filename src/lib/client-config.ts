// Client-side configuration
export const clientConfig = {
  // Supported formats
  supportedFormats: ['jpeg', 'jpg', 'png', 'webp'] as const,
  
  // Quality ranges
  qualityRange: {
    min: 1,
    max: 100,
    default: 80
  },
  
  // Memory limit (in bytes)
  memoryLimit: 1024 * 1024 * 50, // 50MB
};

export const supportedFormats = clientConfig.supportedFormats;
export const qualityRange = clientConfig.qualityRange;
export const memoryLimit = clientConfig.memoryLimit; 