import { apiClient } from './api-client';
import {
  Report,
  CreateReportRequest,
  ReliefOperation,
  CreateOperationRequest,
} from '../types/reports';

export const reportService = {
  async getReports(): Promise<Report[]> {
    const response = await apiClient.get<Report[]>('/reports');
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  },

  async getReportById(id: string): Promise<Report> {
    const response = await apiClient.get<Report>(`/reports/${id}`);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },

  async createReport(data: CreateReportRequest): Promise<Report> {
    const response = await apiClient.post<Report>('/reports', data);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },

  async updateReport(id: string, data: Partial<CreateReportRequest>): Promise<Report> {
    const response = await apiClient.patch<Report>(`/reports/${id}`, data);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },

  async deleteReport(id: string): Promise<void> {
    const response = await apiClient.delete(`/reports/${id}`);
    if (!response.success) throw new Error(response.error);
  },
};

export const operationService = {
  async getOperations(): Promise<ReliefOperation[]> {
    const response = await apiClient.get<ReliefOperation[]>('/operations');
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  },

  async getOperationById(id: string): Promise<ReliefOperation> {
    const response = await apiClient.get<ReliefOperation>(`/operations/${id}`);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },

  async createOperation(data: CreateOperationRequest): Promise<ReliefOperation> {
    const response = await apiClient.post<ReliefOperation>('/operations', data);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },

  async updateOperation(
    id: string,
    data: Partial<CreateOperationRequest>
  ): Promise<ReliefOperation> {
    const response = await apiClient.patch<ReliefOperation>(`/operations/${id}`, data);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },

  async updateOperationStatus(id: string, status: string): Promise<ReliefOperation> {
    const response = await apiClient.patch<ReliefOperation>(`/operations/${id}`, {
      status,
    });
    if (!response.success) throw new Error(response.error);
    return response.data!;
  },
};
