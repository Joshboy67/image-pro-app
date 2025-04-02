'use client';

import { useState } from 'react';
import { Download, Upload, Trash2, Wand2 } from 'lucide-react';

type EnhancementOption = {
  id: string;
  name: string;
  default: number;
  min: number;
  max: number;
  step: number;
};

const enhancementOptions: EnhancementOption[] = [
  { id: 'brightness', name: 'Brightness', default: 0, min: -100, max: 100, step: 1 },
  { id: 'contrast', name: 'Contrast', default: 0, min: -100, max: 100, step: 1 },
  { id: 'saturation', name: 'Saturation', default: 0, min: -100, max: 100, step: 1 },
  { id: 'sharpness', name: 'Sharpness', default: 0, min: 0, max: 100, step: 1 },
];

export function Enhancement() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    enhancementOptions.forEach(option => {
      initial[option.id] = option.default;
    });
    return initial;
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      // Reset state for new image
      setSelectedImage(file);
      setOriginalPreview(URL.createObjectURL(file));
      setProcessedPreview(null);
      
      // Reset settings
      const resetSettings: Record<string, number> = {};
      enhancementOptions.forEach(option => {
        resetSettings[option.id] = option.default;
      });
      setSettings(resetSettings);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setError(null);
  };

  const handleSliderChange = (id: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEnhanceImage = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate API call to enhance image
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, just use the original image as "processed" result
      setProcessedPreview(originalPreview);
    } catch (err) {
      setError('Failed to enhance image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetSettings = () => {
    const resetSettings: Record<string, number> = {};
    enhancementOptions.forEach(option => {
      resetSettings[option.id] = option.default;
    });
    setSettings(resetSettings);
  };

  const handleDownload = () => {
    if (processedPreview) {
      const link = document.createElement('a');
      link.href = processedPreview;
      link.download = 'enhanced-image.png';
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
                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
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
              <p className="text-sm text-gray-500">
                {isProcessing ? 'Processing...' : 'Adjust settings and click "Enhance Image"'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhancement controls */}
      {originalPreview && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Enhancement Settings</h3>
            <button
              onClick={handleResetSettings}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset All
            </button>
          </div>
          
          <div className="space-y-4">
            {enhancementOptions.map((option) => (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor={option.id} className="text-sm font-medium text-gray-700">
                    {option.name}
                  </label>
                  <span className="text-sm text-gray-500">{settings[option.id]}</span>
                </div>
                <input
                  id={option.id}
                  type="range"
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  value={settings[option.id]}
                  onChange={(e) => handleSliderChange(option.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={handleEnhanceImage}
          disabled={!selectedImage || isProcessing}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            'Processing...'
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