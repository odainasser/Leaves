import { api } from './api';
import { AxiosError } from 'axios';

export interface LeaveRequest {
  id: string;
  status: number;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CreateLeaveRequestRequest {
  startDate: string;
  endDate: string;
  reason: string;
  employeeId: string;
}

export interface UpdateLeaveRequestRequest {
  startDate: string;
  endDate: string;
  reason: string;
}

export const leaveRequestService = {
  async getAll(): Promise<LeaveRequest[]> {
    try {
      const response = await api.get('/api/LeaveRequests');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching leave requests:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async getById(id: string): Promise<LeaveRequest> {
    try {
      console.log('Fetching leave request with ID:', id);
      const response = await api.get(`/api/LeaveRequests/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching leave request:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async create(request: CreateLeaveRequestRequest): Promise<LeaveRequest> {
    try {
      const response = await api.post('/api/LeaveRequests', request);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error creating leave request:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async update(id: string, request: UpdateLeaveRequestRequest): Promise<LeaveRequest> {
    try {
      const response = await api.put(`/api/LeaveRequests/${id}`, request);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error updating leave request:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/LeaveRequests/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting leave request:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async approve(id: string): Promise<void> {
    try {
      await api.patch(`/api/LeaveRequests/${id}/approve`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error approving leave request:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async reject(id: string): Promise<void> {
    try {
      await api.patch(`/api/LeaveRequests/${id}/reject`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error rejecting leave request:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  }
};
