import { api } from './api';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CreateLeaveRequestRequest {
  employeeId?: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequestRequest {
  startDate: string;
  endDate: string;
  reason: string;
}

class LeaveRequestService {
  // Admin methods - require admin role
  async getAll(): Promise<LeaveRequest[]> {
    const response = await api.get('/api/LeaveRequests');
    return response.data;
  }

  async getById(id: string): Promise<LeaveRequest> {
    const response = await api.get(`/api/LeaveRequests/${id}`);
    return response.data;
  }

  async create(data: CreateLeaveRequestRequest): Promise<LeaveRequest> {
    const response = await api.post('/api/LeaveRequests', data);
    return response.data;
  }

  async update(id: string, data: UpdateLeaveRequestRequest): Promise<LeaveRequest> {
    const response = await api.put(`/api/LeaveRequests/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/api/LeaveRequests/${id}`);
  }

  async approve(id: string): Promise<void> {
    await api.patch(`/api/LeaveRequests/${id}/approve`);
  }

  async reject(id: string): Promise<void> {
    await api.patch(`/api/LeaveRequests/${id}/reject`);
  }

  // Employee-specific methods - separate endpoints
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/api/LeaveRequests/my-requests');
    return response.data;
  }

  async getMyLeaveRequestById(id: string): Promise<LeaveRequest> {
    const response = await api.get(`/api/LeaveRequests/my-requests/${id}`);
    return response.data;
  }

  async createMyLeaveRequest(data: CreateLeaveRequestRequest): Promise<LeaveRequest> {
    // Remove employeeId from the request as it will be set by the backend
    const { employeeId, ...requestData } = data;
    const response = await api.post('/api/LeaveRequests/my-requests', requestData);
    return response.data;
  }

  async updateMyLeaveRequest(id: string, data: UpdateLeaveRequestRequest): Promise<LeaveRequest> {
    const response = await api.put(`/api/LeaveRequests/my-requests/${id}`, data);
    return response.data;
  }

  async deleteMyLeaveRequest(id: string): Promise<void> {
    await api.delete(`/api/LeaveRequests/my-requests/${id}`);
  }
}

export const leaveRequestService = new LeaveRequestService();