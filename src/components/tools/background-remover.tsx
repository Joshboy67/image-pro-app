'use client';

import { useState } from 'react';
import { Download, Upload, Trash2, Scissors, Loader2 } from 'lucide-react';

export function BackgroundRemover() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const API_KEY = 'fueabGQRmFcEBq7VPNMVyzbv';
  const API_URL = 'https://api.remove.bg/v1.0/removebg';

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG or PNG');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      validateFile(file);
      setError(null);
      
      // Clean up previous URL if exists
      if (originalPreview) {
        URL.revokeObjectURL(originalPreview);
      }
      if (processedPreview) {
        URL.revokeObjectURL(processedPreview);
      }
      
      setSelectedImage(file);
      setOriginalPreview(URL.createObjectURL(file));
      setProcessedPreview(null);
      setProgress(0);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveImage = () => {
    if (originalPreview) {
      URL.revokeObjectURL(originalPreview);
    }
    if (processedPreview) {
      URL.revokeObjectURL(processedPreview);
    }
    setSelectedImage(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setError(null);
    setProgress(0);
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image_file', selectedImage);
      formData.append('size', 'auto');
      formData.append('format', 'jpg');
      formData.append('bg_color', '');
      formData.append('bg_image_url', '');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.title || 'Failed to remove background. Please try again.');
      }

      const blob = await response.blob();
      
      // Create a new blob with proper MIME type for JPEG
      const processedBlob = new Blob([blob], { type: 'image/jpeg' });
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedPreview(processedUrl);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedPreview) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = processedPreview;
      
      // Generate a filename with timestamp and .jpg extension
      const timestamp = new Date().getTime();
      link.download = `removed-background-${timestamp}.jpg`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Upload/Original section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Original Image</h3>
          
          {!originalPreview ? (
            <label className="relative flex flex-col items-center justify-center h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/png,image/jpg" 
                onChange={handleImageSelect} 
              />
            </label>
          ) : (
            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={originalPreview} 
                alt="Original" 
                className="w-full h-full object-contain" 
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>
        
        {/* Results section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Processed Image</h3>
          
          <div className={`relative h-64 bg-gray-100 rounded-lg overflow-hidden ${!processedPreview ? 'flex items-center justify-center' : ''}`}>
            {processedPreview ? (
              <>
                <img 
                  src={processedPreview} 
                  alt="Processed" 
                  className="w-full h-full object-contain" 
                />
                <button
                  onClick={handleDownload}
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow hover:shadow-md"
                >
                  <Download className="w-5 h-5 text-blue-500" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Processing... {progress}%</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Upload an image and click "Remove Background"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleRemoveBackground}
          disabled={!selectedImage || isProcessing}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Scissors className="w-5 h-5 mr-2" />
              Remove Background
            </>
          )}
        </button>
      </div>
    </div>
  );
} 