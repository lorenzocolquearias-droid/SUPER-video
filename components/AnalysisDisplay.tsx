import React, { useState } from 'react';
import type { AnalysisResult, AnalysisSection } from '../types';
import { ScoreDisplay } from './ScoreDisplay';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const AnalysisCard: React.FC<{ title: string; data: AnalysisSection }> = ({ title, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6 cursor-pointer">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-purple-400 pr-4">{title}</h3>
            <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        <div className="flex items-center gap-4 my-2">
          <p className="text-2xl font-black text-white">{data.puntuacion}<span className="text-sm font-normal text-gray-400">/10</span></p>
          <div className="flex-grow">
            <ScoreDisplay score={data.puntuacion} />
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">{data.sugerencia}</p>

        <div 
          className="transition-all duration-500 ease-in-out overflow-hidden"
          style={{ maxHeight: isExpanded ? '500px' : '0px' }}
        >
          <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-semibold text-gray-200 mb-2">Justificación Detallada:</h4>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{data.justificacion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export const AnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const { resumenGeneral, analisisDetallado, sugerenciasClave, tituloSugerido } = result;
  
  const analysisItems = [
    { title: "Gancho Inicial", data: analisisDetallado.gancho },
    { title: "Estructura y Contenido", data: analisisDetallado.estructuraContenido },
    { title: "Calidad de Edición", data: analisisDetallado.calidadEdicion },
    { title: "Ritmo Narrativo", data: analisisDetallado.ritmoNarrativo },
    { title: "Retención de Audiencia", data: analisisDetallado.retencionAudiencia },
  ];

  return (
    <div className="space-y-8 w-full animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-white">¡Análisis Completo!</h2>
        <p className="text-purple-200 mt-2">Puntuación General: <span className="font-bold text-4xl">{resumenGeneral.puntuacion}</span>/10</p>
        <p className="text-white mt-4 max-w-2xl mx-auto">{resumenGeneral.sugerencia}</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6" />
          Título Viral Sugerido
        </h3>
        <p className="text-2xl font-semibold bg-gray-900 p-4 rounded-md">"{tituloSugerido}"</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {analysisItems.map(item => (
          <AnalysisCard key={item.title} title={item.title} data={item.data} />
        ))}
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-green-400 mb-4">Acciones Clave para Mejorar</h3>
        <ul className="space-y-3 list-disc list-inside">
          {sugerenciasClave.map((sugerencia, index) => (
            <li key={index} className="text-gray-300 leading-relaxed">{sugerencia}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};