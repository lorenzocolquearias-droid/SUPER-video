
import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const getColor = (s: number) => {
    if (s <= 3) return 'bg-red-500';
    if (s <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const width = `${Math.max(0, Math.min(10, score)) * 10}%`;

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 my-1">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${getColor(score)}`}
        style={{ width: width }}
      ></div>
    </div>
  );
};
