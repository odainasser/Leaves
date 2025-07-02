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

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

class LeaveRequestService {
  // Admin methods - require admin role
  async getAll(): Promise<LeaveRequest[]> {
    try {
      const response = await api.get('/api/LeaveRequests');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  async getById(id: string): Promise<LeaveRequest> {
    try {
      const response = await api.get(`/api/LeaveRequests/${id}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  async create(data: CreateLeaveRequestRequest): Promise<LeaveRequest> {
    try {
      const response = await api.post('/api/LeaveRequests', data);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateLeaveRequestRequest): Promise<LeaveRequest> {
    try {
      const response = await api.put(`/api/LeaveRequests/${id}`, data);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/LeaveRequests/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  async approve(id: string): Promise<void> {
    try {
      await api.patch(`/api/LeaveRequests/${id}/approve`);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  async reject(id: string): Promise<void> {
    try {
      await api.patch(`/api/LeaveRequests/${id}/reject`);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      throw error;
    }
  }

  // Employee-specific methods - accessible to employees
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await api.get('/api/LeaveRequests/my-requests');
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Employee privileges required.');
      }
      throw error;
    }
  }

  async getMyLeaveRequestById(id: string): Promise<LeaveRequest> {
    try {
      const response = await api.get(`/api/LeaveRequests/my-requests/${id}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. You can only view your own leave requests.');
      }
      throw error;
    }
  }

  async createMyLeaveRequest(data: CreateLeaveRequestRequest): Promise<LeaveRequest> {
    try {
      // Remove employeeId from the request as it will be set by the backend
      const { employeeId, ...requestData } = data;
      const response = await api.post('/api/LeaveRequests/my-requests', requestData);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. Employee privileges required.');
      }
      throw error;
    }
  }

  async updateMyLeaveRequest(id: string, data: UpdateLeaveRequestRequest): Promise<LeaveRequest> {
    try {
      const response = await api.put(`/api/LeaveRequests/my-requests/${id}`, data);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. You can only edit your own leave requests.');
      }
      throw error;
    }
  }

  async deleteMyLeaveRequest(id: string): Promise<void> {
    try {
      await api.delete(`/api/LeaveRequests/my-requests/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        throw new Error('Access denied. You can only delete your own leave requests.');
      }
      throw error;
    }
  }
}

export const leaveRequestService = new LeaveRequestService();