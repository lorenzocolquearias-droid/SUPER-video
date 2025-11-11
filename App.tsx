
import React, { useState, useCallback } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { analyzeVideoForVirality } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    setAnalysisResult(null);
    setError(null);
  };
  
  const handleAnalyzeClick = useCallback(async () => {
    if (!videoFile) {
      setError("Por favor, selecciona un video primero.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Video = await fileToBase64(videoFile);
      const result = await analyzeVideoForVirality(base64Video, videoFile.type);
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message || "Ocurrió un error inesperado durante el análisis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [videoFile]);

  const handleReset = () => {
    setVideoFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <SparklesIcon className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Super VirAI
          </h1>
        </div>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Obtén feedback de IA para hacer tus videos virales. Sube tu video y recibe un análisis detallado para optimizarlo al máximo.
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        {!analysisResult && (
          <div className="w-full flex flex-col items-center gap-6">
            <VideoUploader onVideoSelect={handleVideoSelect} isAnalyzing={isAnalyzing} />
            {videoFile && !isAnalyzing && (
              <button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                <SparklesIcon className="w-6 h-6" />
                <span>Analizar Video</span>
              </button>
            )}
          </div>
        )}
        
        {isAnalyzing && <Loader />}

        {error && !isAnalyzing && <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">{error}</div>}

        {analysisResult && (
            <>
                <AnalysisDisplay result={analysisResult} />
                <button
                    onClick={handleReset}
                    className="mt-8 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                    Analizar Otro Video
                </button>
            </>
        )}
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Potenciado por Gemini 2.5 Pro</p>
      </footer>
    </div>
  );
};

export default App;
