export interface CountryPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  faceSizePercentMin: number;
  faceSizePercentMax: number;
  bgColor: string; // Hex
  description: string;
}

export interface UploadedImage {
  originalUrl: string;
  width: number;
  height: number;
  file: File;
}

export interface CropState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

export interface AIAnalysisResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  score: number;
}

export enum AppStep {
  UPLOAD = 'UPLOAD',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
}

export interface ProcessingOptions {
  removeBackground: boolean;
  enhanceLighting: boolean;
}