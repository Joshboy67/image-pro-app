import { useState } from 'react';
import { supportedFormats } from '@/lib/config';

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedFilename, setConvertedFilename] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(e.target.value);
    setError(null);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(parseInt(e.target.value));
  };

  const handleConvert = async () => {
    if (!selectedFile || !selectedFormat) {
      setError('Please select a file and format');
      return;
    }

    try {
      setIsConverting(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('format', selectedFormat);
      formData.append('quality', quality.toString());

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert image');
      }

      const data = await response.json();
      
      if (data.success) {
        setConvertedUrl(data.url);
        setConvertedFilename(data.filename);
      } else {
        throw new Error(data.error || 'Failed to convert image');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert image');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Format
        </label>
        <select
          value={selectedFormat}
          onChange={handleFormatChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select format</option>
          {supportedFormats.map((format: string) => (
            <option key={format} value={format}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quality ({quality}%)
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={handleQualityChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!selectedFile || !selectedFormat || isConverting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium
          ${isConverting || !selectedFile || !selectedFormat
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isConverting ? 'Converting...' : 'Convert Image'}
      </button>

      {convertedUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Converted: {convertedFilename}
          </p>
          <img
            src={convertedUrl}
            alt="Converted"
            className="max-w-full h-auto rounded-md"
          />
          <a
            href={convertedUrl}
            download={convertedFilename}
            className="mt-2 inline-block text-blue-600 hover:text-blue-800"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
} 