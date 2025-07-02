import { api } from './api';
import { AxiosError } from 'axios';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: number;
  createdAt: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: number;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  role: number;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/api/users');
    return response.data;
  },

  async getById(id: string): Promise<User> {
    try {
      console.log('Fetching user with ID:', id);
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching user:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async create(request: CreateUserRequest): Promise<User> {
    try {
      const response = await api.post('/api/users', request);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error creating user:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async update(id: string, request: UpdateUserRequest): Promise<User> {
    try {
      const response = await api.put(`/api/users/${id}`, request);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error updating user:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/users/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting user:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  }
};