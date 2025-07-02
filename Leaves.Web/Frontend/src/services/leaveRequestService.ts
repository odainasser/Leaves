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
  }
};
