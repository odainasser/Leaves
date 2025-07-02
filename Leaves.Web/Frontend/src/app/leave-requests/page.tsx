'use client';

import { useState, useEffect } from 'react';
import { leaveRequestService, LeaveRequest } from '@/services/leaveRequestService';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import Pagination from '@/components/ui/Pagination';

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const data = await leaveRequestService.getAll();
      console.log('Leave requests data:', data);
      // Sort by creation date, newest first
      const sortedRequests = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLeaveRequests(sortedRequests);
    } catch (err) {
      setError('Failed to fetch leave requests');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this leave request?')) {
      try {
        await leaveRequestService.delete(id);
        setLeaveRequests(leaveRequests.filter((request) => request.id !== id));
      } catch (err) {
        setError('Failed to delete leave request');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: number) => {
    try {
      setActionLoading(id);
      
      if (newStatus === 1) {
        await leaveRequestService.approve(id);
      } else if (newStatus === 2) {
        await leaveRequestService.reject(id);
      }
      
      // Update the local state immediately for better UX
      setLeaveRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === id 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
    } catch (err) {
      setError(`Failed to update status`);
      console.error(err);
    } finally {
      setActionLoading(null);
    }
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
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(leaveRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = leaveRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests Management</h1>
          <Link
            href="/leave-requests/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add New Request
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRequests.map((request, index) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.employee?.fullName || 'Unknown Employee'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.status === 0 ? (
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, parseInt(e.target.value))}
                        disabled={actionLoading === request.id}
                        className="text-xs font-semibold rounded-full px-2 py-1 border border-gray-300 bg-yellow-100 text-yellow-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value={0}>Pending</option>
                        <option value={1}>Approve</option>
                        <option value={2}>Reject</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/leave-requests/${request.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      {request.status === 0 && (
                        <>
                          <Link
                            href={`/leave-requests/${request.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={leaveRequests.length}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
