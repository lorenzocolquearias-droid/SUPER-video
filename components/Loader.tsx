
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const loadingMessages = [
  "Cocinando la viralidad...",
  "Analizando cada fotograma...",
  "Buscando el factor X...",
  "Consultando las tendencias...",
  "Preparando la magia...",
];

export const Loader: React.FC = () => {
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg">
      <SparklesIcon className="w-16 h-16 text-purple-400 animate-pulse" />
      <h3 className="mt-4 text-xl font-semibold text-gray-200">Analizando Video</h3>
      <p className="mt-2 text-gray-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};
