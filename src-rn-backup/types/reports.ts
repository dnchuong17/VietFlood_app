export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ReportType = 'flood_damage' | 'evacuation' | 'resource_request' | 'other';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  province?: string;
  district?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  title: string;
  description: string;
  location: Location;
  photos: Photo[];
  status: ReportStatus;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  type: ReportType;
  title: string;
  description: string;
  location: Location;
  photos: Array<{
    uri: string;
    name: string;
    type: string;
  }>;
  severity?: string;
}

export type OperationStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface ReliefOperation {
  id: string;
  name: string;
  description: string;
  status: OperationStatus;
  location: Location;
  startDate: string;
  endDate?: string;
  teamLead: string;
  volunteers: string[];
  resources: Resource[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  type: string; // 'medical_supplies', 'food', 'water', etc.
  quantity: number;
  unit: string;
  status: 'available' | 'in_use' | 'depleted';
}

export interface CreateOperationRequest {
  name: string;
  description: string;
  location: Location;
  startDate: string;
}
