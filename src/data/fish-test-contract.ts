export interface SpeciesResult {
  method: 'species';
  classification: string;
  confidence_score: number | null;
}

export interface LengthResult {
  method: 'length';
  length: number;
  unit: string;
}

export type FishResult = SpeciesResult | LengthResult;

export interface FishSubmission {
  submission_id: string;
  results: FishResult[];
  errors: string[];
}

export interface FishResultsBatch {
  run_id: string;
  processed_at: string;
  api_version: string;
  submissions: FishSubmission[];
}
