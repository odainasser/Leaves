'use client';

import { useState, useEffect } from 'react';
import { CreateLeaveRequestRequest, UpdateLeaveRequestRequest, LeaveRequest } from '@/services/leaveRequestService';
import { userService, User } from '@/services/userService';

interface LeaveRequestFormProps {
  leaveRequest?: LeaveRequest;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function LeaveRequestForm({ leaveRequest, onSubmit, isLoading }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    employeeId: ''
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (leaveRequest) {
      setFormData({
        startDate: leaveRequest.startDate.split('T')[0], // Convert to YYYY-MM-DD format
        endDate: leaveRequest.endDate.split('T')[0],
        reason: leaveRequest.reason,
        employeeId: leaveRequest.employee.id
      });
    }
  }, [leaveRequest]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (leaveRequest) {
      // Update - don't include employeeId
      const updateData: UpdateLeaveRequestRequest = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      };
      await onSubmit(updateData);
    } else {
      // Create - include employeeId
      const createData: CreateLeaveRequestRequest = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        employeeId: formData.employeeId
      };
      await onSubmit(createData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loadingUsers) {
    return <div>Loading users...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!leaveRequest && (
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
            Employee
          </label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="">Select an employee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} - {user.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Enter the reason for leave request"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : leaveRequest ? 'Update Request' : 'Create Request'}
        </button>
      </div>
    </form>
  );
}
