export type Severity = 'Minor' | 'Moderate' | 'Severe';

export interface DamageLocation {
  area: string;
  description: string;
  severity: Severity;
}

export interface DamageReport {
  id: string;
  timestamp: string;
  images: string[];
  damageLocations: DamageLocation[];
  severity: Severity;
  estimatedCost: number;
  recommendations: string[];
}

export interface ApiConfig {
  openai?: {
    apiKey: string;
    model: string;
  };
}

export interface Store {
  reports: DamageReport[];
  apiConfig: ApiConfig;
  addReport: (report: DamageReport) => void;
  setApiConfig: (config: ApiConfig) => void;
}