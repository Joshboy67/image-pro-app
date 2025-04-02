'use client';

import { useState, useRef } from 'react';
import { Download, Upload, Trash2, MousePointer, Undo } from 'lucide-react';

export function RemoveObject() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<{x: number, y: number}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      // Reset state for new image
      setSelectedImage(file);
      setOriginalPreview(URL.createObjectURL(file));
      setProcessedPreview(null);
      setSelectedPoints([]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setError(null);
    setSelectedPoints([]);
    setIsSelecting(false);
  };

  const startSelection = () => {
    setIsSelecting(true);
    setSelectedPoints([]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setSelectedPoints([...selectedPoints, {x, y}]);
    
    // Draw point on canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw line if we have multiple points
      if (selectedPoints.length > 0) {
        const lastPoint = selectedPoints[selectedPoints.length - 1];
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const undoLastPoint = () => {
    if (selectedPoints.length === 0) return;
    
    const newPoints = [...selectedPoints];
    newPoints.pop();
    setSelectedPoints(newPoints);
    
    // Redraw canvas
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
        
        // Redraw points and lines
        for (let i = 0; i < newPoints.length; i++) {
          const point = newPoints[i];
          
          // Draw point
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw line between points
          if (i > 0) {
            const prevPoint = newPoints[i - 1];
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        }
      }
    }
  };

  const handleRemoveObject = async () => {
    if (!selectedImage || selectedPoints.length < 3) {
      setError('Please select an area to remove by creating at least 3 points');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate API call to remove object
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demo purposes, just use the original image as "processed" result
      setProcessedPreview(originalPreview);
      setIsSelecting(false);
    } catch (err) {
      setError('Failed to remove object. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedPreview) {
      const link = document.createElement('a');
      link.href = processedPreview;
      link.download = 'object-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageLoad = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      
      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw image on canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
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
          <h3 className="text-sm font-medium text-gray-700">Select Object to Remove</h3>
          
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
              {/* Hidden image for reference */}
              <img 
                ref={imageRef}
                src={originalPreview} 
                alt="Original" 
                className="hidden"
                onLoad={handleImageLoad}
              />
              
              {/* Canvas for drawing selection */}
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`w-full h-full object-contain ${isSelecting ? 'cursor-crosshair' : ''}`}
              />
              
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={handleRemoveImage}
                  className="p-1 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
              
              {originalPreview && (
                <div className="absolute bottom-2 left-2 flex space-x-2">
                  <button
                    onClick={startSelection}
                    className={`p-2 rounded-md ${
                      isSelecting ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                    }`}
                  >
                    <MousePointer className="w-4 h-4" />
                  </button>
                  
                  {isSelecting && (
                    <button
                      onClick={undoLastPoint}
                      disabled={selectedPoints.length === 0}
                      className="p-2 bg-white text-blue-500 rounded-md disabled:opacity-50"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Results section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Result</h3>
          
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
              <p className="text-sm text-gray-500">
                {isProcessing ? 'Processing...' : 'Select an object and click "Remove Object"'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleRemoveObject}
          disabled={!selectedImage || isProcessing || selectedPoints.length < 3}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Remove Object'}
        </button>
      </div>
      
      <div className="text-sm text-gray-500 text-center">
        {isSelecting ? 'Click to create points around the object you want to remove' : ''}
      </div>
    </div>
  );
} 