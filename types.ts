export interface AnalysisSection {
  puntuacion: number;
  sugerencia: string;
  justificacion: string;
}

export interface AnalysisResult {
  resumenGeneral: AnalysisSection;
  analisisDetallado: {
    gancho: AnalysisSection;
    estructuraContenido: AnalysisSection;
    calidadEdicion: AnalysisSection;
    ritmoNarrativo: AnalysisSection;
    retencionAudiencia: AnalysisSection;
  };
  sugerenciasClave: string[];
  tituloSugerido: string;
}