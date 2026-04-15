export type ReliefUser = {
  id?: number;
  username?: string;
  email?: string;
  phone?: string;
  address_line?: string;
  role?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  province?: string;
  ward?: string;
  created_at?: string;
  updated_at?: string;
};

export type ReliefReportEvidence = {
  url: string;
  publicId: string;
  resourceType?: string;
};

export type ReliefReport = {
  id?: number;
  userId?: number;
  user?: ReliefUser;
  category?: string[];
  description?: string;
  images?: string[];
  evidences?: ReliefReportEvidence[];
  province?: string;
  ward?: string;
  addressLine?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  status?: string;
  isUrgent?: boolean;
  severity?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};

export type MapPoint = {
  lat: number;
  lng: number;
};
