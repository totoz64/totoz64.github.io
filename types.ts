
export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export enum InterventionStatus {
  TODO = "À faire",
  IN_PROGRESS = "En cours",
  COMPLETED = "Terminée",
  CANCELLED = "Annulée",
}

export enum InterventionPriority {
  LOW = "Basse",
  MEDIUM = "Moyenne",
  HIGH = "Haute",
  URGENT = "Urgente",
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  address: string;
  location?: GeolocationCoords | null;
  status: InterventionStatus;
  priority: InterventionPriority;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  // photos?: string[]; // Future: base64 encoded images
}
