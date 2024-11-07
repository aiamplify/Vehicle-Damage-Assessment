export interface ApiConfig {
  openai?: {
    apiKey: string;
    model: string;
  };
}

// Default configuration
export const defaultConfig: ApiConfig = {
  openai: {
    apiKey: '',
    model: 'gpt-4o'
  }
};