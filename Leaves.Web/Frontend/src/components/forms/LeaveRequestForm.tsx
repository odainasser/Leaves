'use client';

import { useState, useEffect } from 'react';
import { userService, User } from '@/services/userService';
import { LeaveRequest, CreateLeaveRequestRequest, UpdateLeaveRequestRequest } from '@/services/leaveRequestService';

interface LeaveRequestFormProps {
  leaveRequest?: LeaveRequest;
  onSubmit: (data: CreateLeaveRequestRequest | UpdateLeaveRequestRequest) => void;
  isLoading?: boolean;
  hideEmployeeField?: boolean;
}

export default function LeaveRequestForm({ 
  leaveRequest, 
  onSubmit, 
  isLoading = false,
  hideEmployeeField = false 
}: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    employeeId: leaveRequest?.employeeId || '',
    startDate: leaveRequest?.startDate ? leaveRequest.startDate.split('T')[0] : '',
    endDate: leaveRequest?.endDate ? leaveRequest.endDate.split('T')[0] : '',
    reason: leaveRequest?.reason || '',
  });

  const [employees, setEmployees] = useState<User[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(!hideEmployeeField);
  const [error, setError] = useState<string | null>(null);

  // Check if this is an edit form for a non-pending request
  const isEditingNonPendingRequest = leaveRequest && leaveRequest.status !== 0;
  const canEdit = !isEditingNonPendingRequest;

  useEffect(() => {
    if (!hideEmployeeField) {
      fetchEmployees();
    }
  }, [hideEmployeeField]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const data = await userService.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) return;
    
    if (!hideEmployeeField && !formData.employeeId) {
      setError('Please select an employee');
      return;
    }

    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    setError(null);
    onSubmit(formData);
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'text-yellow-600';
      case 1: return 'text-green-600';
      case 2: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isEditingNonPendingRequest) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Cannot Edit Leave Request
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This leave request cannot be edited because it has been{' '}
                <span className={`font-semibold ${getStatusColor(leaveRequest.status)}`}>
                  {getStatusText(leaveRequest.status)}
                </span>.
                Only pending leave requests can be modified.
              </p>
            </div>
          </div>
        </div>
        
        {/* Display read-only information */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Request Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Start Date:</span>
              <span className="ml-2 text-gray-900">
                {new Date(leaveRequest.startDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">End Date:</span>
              <span className="ml-2 text-gray-900">
                {new Date(leaveRequest.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium text-gray-600">Reason:</span>
            <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded border">
              {leaveRequest.reason}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!hideEmployeeField && (
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
            Employee *
          </label>
          {loadingEmployees ? (
            <div className="text-sm text-gray-500">Loading employees...</div>
          ) : (
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              disabled={!canEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} ({employee.email})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <div className="relative">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={!canEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100 [&::-webkit-input-placeholder]:text-gray-600 [&::-webkit-input-placeholder]:font-medium"
              placeholder="Select start date"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <div className="relative">
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={!canEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:hover:bg-gray-100 [&::-webkit-input-placeholder]:text-gray-600 [&::-webkit-input-placeholder]:font-medium"
              placeholder="Select end date"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason *
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          disabled={!canEdit}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400 placeholder:font-normal text-gray-900"
          placeholder="Please provide a reason for your leave request..."
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {canEdit && (
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : leaveRequest ? 'Update Request' : 'Create Request'}
          </button>
        </div>
      )}
    </form>
  );
}
