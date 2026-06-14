// These are placeholder types. 
// Once the real API is ready, update these to match the exact JSON structures returned by the backend.

export interface IssueBenchmarkData {
  id: string;
  name: string;
  value: number;
  benchmark: number;
}

export interface AlertData {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}

export interface PersonData {
  id: string;
  name: string;
  role: string;
  mentionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
