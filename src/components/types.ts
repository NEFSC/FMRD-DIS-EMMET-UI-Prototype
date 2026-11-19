import type { FishResultsBatch } from '../data/fish-test-contract';

export type ModelId = 'cvision' | 'im';
export type ViewMode = 'administrator' | ModelId;

export type ModelOption = {
  id: ModelId;
  name: string;
};

export type ResultRow = {
  fishId: string;
  actualSpecies: string;
  predictedSpecies: string;
  confidence: number | null;
  length: number;
  lengthUnit: string;
  isCorrect: boolean;
};

export type RunSummary = {
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  errorRate: number;
  runPassed: boolean;
  runtimeSeconds: number;
};

export type RunOption = Pick<FishResultsBatch, 'run_id'>;
