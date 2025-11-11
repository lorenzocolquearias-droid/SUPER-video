import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show this to the user in the UI.
  // For this context, throwing an error is sufficient.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSectionSchema = {
    type: Type.OBJECT,
    properties: {
        puntuacion: { type: Type.NUMBER, description: "Puntuación del 1 al 10." },
        sugerencia: { type: Type.STRING, description: "Sugerencia clave para mejorar." },
        justificacion: { type: Type.STRING, description: "Justificación detallada de la puntuación con ejemplos específicos del video." },
    },
    required: ["puntuacion", "sugerencia", "justificacion"],
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        resumenGeneral: analysisSectionSchema,
        analisisDetallado: {
            type: Type.OBJECT,
            properties: {
                gancho: analysisSectionSchema,
                estructuraContenido: analysisSectionSchema,
                calidadEdicion: analysisSectionSchema,
                ritmoNarrativo: analysisSectionSchema,
                retencionAudiencia: analysisSectionSchema,
            },
             required: ["gancho", "estructuraContenido", "calidadEdicion", "ritmoNarrativo", "retencionAudiencia"],
        },
        sugerenciasClave: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista de 3 a 5 acciones más importantes para mejorar el video."
        },
        tituloSugerido: {
            type: Type.STRING,
            description: "Un título atractivo y viral sugerido para el video."
        }
    },
    required: ["resumenGeneral", "analisisDetallado", "sugerenciasClave", "tituloSugerido"],
};


export const analyzeVideoForVirality = async (videoBase64: string, mimeType: string): Promise<AnalysisResult> => {
  const prompt = `
Eres 'Super VirAI', un experto en análisis de videos y estrategias de contenido viral para redes sociales como TikTok, Instagram Reels y YouTube Shorts.
Tu objetivo es analizar el video proporcionado y dar feedback accionable y específico para maximizar su potencial viral.
Analiza el video en base a los siguientes criterios:
1. Gancho Rápido (primeros 3 segundos): ¿Capta la atención inmediatamente?
2. Estructura y Narrativa: ¿Cuenta una historia, genera emoción, tiene valor?
3. Calidad de Edición y Producción: ¿La imagen y audio son claros? ¿Los cortes son dinámicos? ¿Se usan subtítulos?
4. Ritmo y Dinamismo: ¿El ritmo es rápido y mantiene el interés?
5. Retención de Audiencia: ¿Hay elementos que inviten a ver hasta el final?

Para cada criterio, proporciona:
- Una puntuación del 1 al 10.
- Una sugerencia concisa y accionable.
- Una justificación detallada que explique el porqué de la puntuación, citando ejemplos o momentos específicos del video si es posible.

Finalmente, proporciona una lista de 3 a 5 acciones clave generales para mejorar y un título viral y atractivo.
Devuelve tu análisis estrictamente en el formato JSON especificado en el esquema.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: videoBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing video with Gemini:", error);
    throw new Error("No se pudo obtener el análisis de la IA. El video podría ser demasiado largo o estar en un formato no compatible.");
  }
};
