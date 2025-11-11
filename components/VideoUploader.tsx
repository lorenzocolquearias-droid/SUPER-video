
import React, { useRef, useState } from 'react';
import { VideoCameraIcon } from './icons/VideoCameraIcon';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect, isAnalyzing }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    } else if (file) {
      alert("Por favor, selecciona un archivo de video válido.");
    }
  };

  const handleButtonClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!videoSrc ? (
        <div 
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-xl hover:border-purple-500 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
          onClick={handleButtonClick}
        >
          <VideoCameraIcon className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-300">Sube tu video para analizar</h2>
          <p className="text-gray-500 mt-1">Haz clic para seleccionar un archivo</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*,.mp4,.mov,.avi,.webm"
            className="hidden"
            disabled={isAnalyzing}
          />
        </div>
      ) : (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <video src={videoSrc} controls className="w-full rounded-md mb-4 max-h-[400px]"></video>
          <p className="text-sm text-gray-400 text-center truncate">{fileName}</p>
        </div>
      )}
    </div>
  );
};
