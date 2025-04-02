export class BackgroundRemoverService {
  private static instance: BackgroundRemoverService;
  private readonly API_KEY = 'tyQHqM7k6wwK1FRwLPQi85Di';
  private readonly API_URL = 'https://api.remove.bg/v1.0/removebg';

  private constructor() {}

  static getInstance(): BackgroundRemoverService {
    if (!BackgroundRemoverService.instance) {
      BackgroundRemoverService.instance = new BackgroundRemoverService();
    }
    return BackgroundRemoverService.instance;
  }

  async removeBackground(imageFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('size', 'auto');

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': this.API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to remove background');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  }
} 