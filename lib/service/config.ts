/**
 * Configuration for Zillow Chat Experiment
 * Simplified config for browser-based chat overlay
 */

export interface ApiConfig {
  zillowApiUrl: string;
  clientId: string;
  timeout: number;
}

// Legacy lib/service/zillowApi.ts config. The React app uses lib/data/propertyDataFlow.ts.
export const apiConfig: ApiConfig = {
  zillowApiUrl: '/api/propertysearch',
  clientId: 'com.zillow.swagger',
  timeout: 10000
};

export const chatConfig = {
  maxMessages: 100,
  maxContextProperties: 50,
  trackingDebounceMs: 500,
  summarizeIntervalMs: 60000, // 1 minute
  conversationModel: 'gpt-4',
  conversationTemperature: 0.7
};

