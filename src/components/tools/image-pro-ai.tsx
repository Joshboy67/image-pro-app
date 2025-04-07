'use client';

import { useState } from 'react';
import { Download, Upload, Trash2, Loader2, Wand2 } from 'lucide-react';

type EnhancementType = 'denoise' | 'sharpen' | 'color' | 'contrast';

export function ImageProAI() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [enhancementType, setEnhancementType] = useState<EnhancementType>('denoise');
  const [intensity, setIntensity] = useState<number>(50);

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png'];
    
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

  const handleEnhance = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('type', enhancementType);
      formData.append('intensity', intensity.toString());

      setProgress(20);

      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enhance image. Please try again.');
      }

      setProgress(60);

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      setProcessedPreview(processedUrl);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Failed to enhance image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedPreview) {
      const link = document.createElement('a');
      link.href = processedPreview;
      const timestamp = new Date().getTime();
      link.download = `enhanced-image-${timestamp}.jpg`;
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
                accept="image/jpeg,image/png" 
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
          <h3 className="text-sm font-medium text-gray-700">Enhanced Image</h3>
          
          <div className={`relative h-64 bg-gray-100 rounded-lg overflow-hidden ${!processedPreview ? 'flex items-center justify-center' : ''}`}>
            {processedPreview ? (
              <>
                <img 
                  src={processedPreview} 
                  alt="Enhanced" 
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
                    Upload an image and select enhancement options
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhancement Options */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enhancement Type
            </label>
            <select
              value={enhancementType}
              onChange={(e) => setEnhancementType(e.target.value as EnhancementType)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="denoise">Noise Reduction</option>
              <option value="sharpen">Sharpen</option>
              <option value="color">Color Enhancement</option>
              <option value="contrast">Contrast Adjustment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intensity ({intensity}%)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleEnhance}
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
              <Wand2 className="w-5 h-5 mr-2" />
              Enhance Image
            </>
          )}
        </button>
      </div>
    </div>
  );
} 