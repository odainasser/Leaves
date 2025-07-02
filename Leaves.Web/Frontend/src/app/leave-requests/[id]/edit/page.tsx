'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';
import { leaveRequestService, LeaveRequest, UpdateLeaveRequestRequest } from '@/services/leaveRequestService';
import Link from 'next/link';

export default function EditLeaveRequestPage() {
  const params = useParams();
  const router = useRouter();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadLeaveRequest();
  }, [params.id]);

  const loadLeaveRequest = async () => {
    try {
      setLoading(true);
      const data = await leaveRequestService.getById(params.id as string);
      setLeaveRequest(data);
    } catch (err) {
      setError('Failed to load leave request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateLeaveRequestRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await leaveRequestService.update(params.id as string, data);
      router.push('/leave-requests');
    } catch (err) {
      setError('Failed to update leave request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: number) => {
    try {
      setActionLoading(true);
      
      if (newStatus === 1) {
        await leaveRequestService.approve(params.id as string);
      } else if (newStatus === 2) {
        await leaveRequestService.reject(params.id as string);
      }
      
      // Update the local state immediately
      setLeaveRequest(prev => prev ? { ...prev, status: newStatus } : null);
      
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !leaveRequest) {
    return (
      <AdminLayout>
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Leave request not found'}</div>
          <Link href="/leave-requests" className="text-blue-500 hover:text-blue-700">
            ← Back to Leave Requests
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/leave-requests"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to Leave Requests
            </Link>
            {leaveRequest && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  {leaveRequest.status === 0 ? (
                    <select
                      value={leaveRequest.status}
                      onChange={(e) => handleStatusChange(parseInt(e.target.value))}
                      disabled={actionLoading || isLoading}
                      className="text-xs font-semibold rounded-full px-2 py-1 border border-gray-300 bg-yellow-100 text-yellow-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value={0}>Pending</option>
                      <option value={1}>Approve</option>
                      <option value={2}>Reject</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leaveRequest.status)}`}>
                      {getStatusText(leaveRequest.status)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Leave Request</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <LeaveRequestForm leaveRequest={leaveRequest} onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </AdminLayout>
  );
}
