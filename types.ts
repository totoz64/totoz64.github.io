
export interface Intervention {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  startTime?: string; // ISO 8601 string
  endTime?: string;   // ISO 8601 string
  remarks?: string;
  createdAt: string; // ISO 8601 string
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  coordinates?: Coordinates;
  address?: string;
  error?: string;
  loading: boolean;
}
