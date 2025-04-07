'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { FileImage, Download, Loader2 } from 'lucide-react';
import { supportedFormats, qualityRange, memoryLimit } from '@/lib/client-config';
import { cn } from '@/lib/utils';

type Format = typeof supportedFormats[number];

export default function ImageConverter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('jpeg');
  const [quality, setQuality] = useState(qualityRange.default);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > memoryLimit) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setSelectedImage(file);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleConvert = async () => {
    if (!selectedImage || !user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('format', targetFormat);
      formData.append('quality', quality.toString());

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert image');
      }

      setConvertedUrl(data.url);
      toast({
        title: 'Success',
        description: 'Image converted successfully!',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image');
      toast({
        title: 'Error',
        description: 'Failed to convert image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl) return;
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `converted_image.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={cn(
            "w-full max-w-md aspect-video rounded-lg border-2 border-dashed",
            "flex flex-col items-center justify-center",
            "hover:border-blue-500 transition-colors",
            "cursor-pointer",
            previewUrl ? "border-transparent" : "border-gray-300"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center p-6">
              <FileImage className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload an image
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Format
          </label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value as Format)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {supportedFormats.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quality ({quality}%)
          </label>
          <input
            type="range"
            min={qualityRange.min}
            max={qualityRange.max}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="mt-1 w-full"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={!selectedImage || isProcessing}
          className={cn(
            "w-full py-2 px-4 rounded-md text-white",
            "flex items-center justify-center",
            "transition-colors",
            isProcessing || !selectedImage
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert Image'
          )}
        </button>

        {convertedUrl && (
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={convertedUrl}
                alt="Converted"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Converted Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 