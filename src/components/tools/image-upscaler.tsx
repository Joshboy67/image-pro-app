'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Image, Upload, Download } from 'lucide-react';

export function ImageUpscaler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scale, setScale] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [upscaledFilename, setUpscaledFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseInt(e.target.value));
  };

  const handleUpscale = async () => {
    if (!selectedFile || !user) {
      setError('Please select an image and make sure you are logged in');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('scale', scale.toString());

      const response = await fetch('/api/upscale', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upscale image');
      }

      const data = await response.json();
      
      if (data.success) {
        setUpscaledUrl(data.url);
        setUpscaledFilename(data.filename);
      } else {
        throw new Error(data.error || 'Failed to upscale image');
      }
    } catch (err) {
      console.error('Upscaling error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upscale image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className={cn(
                "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {selectedFile ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-w-full max-h-48 object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (MAX. 10MB)
                    </p>
                  </>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>

        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scale Factor: {scale}x
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={scale}
            onChange={handleScaleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isProcessing}
          />
        </div>

        {error && (
          <div className="w-full max-w-md p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={handleUpscale}
          disabled={!selectedFile || isProcessing}
          className={cn(
            "w-full max-w-md py-2 px-4 rounded-md text-white font-medium",
            !selectedFile || isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {isProcessing ? 'Upscaling...' : 'Upscale Image'}
        </button>

        {upscaledUrl && (
          <div className="w-full max-w-md space-y-4">
            <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
              <img
                src={upscaledUrl}
                alt="Upscaled"
                className="w-full h-full object-contain"
              />
            </div>
            <a
              href={upscaledUrl}
              download={upscaledFilename}
              className="flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Upscaled Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 