'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { leaveRequestService, LeaveRequest } from '@/services/leaveRequestService';
import Link from 'next/link';

export default function MyLeaveRequestDetailsPage() {
  const { id } = useParams();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequestDetails();
  }, [id]);

  const fetchLeaveRequestDetails = async () => {
    try {
      setLoading(true);
      const data = await leaveRequestService.getMyLeaveRequestById(id as string);
      setLeaveRequest(data);
    } catch (err) {
      setError('Failed to fetch leave request details');
      console.error(err);
    } finally {
      setLoading(false);
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
          <Link href="/my-leave-requests" className="text-blue-500 hover:text-blue-700">
            ← Back to My Leave Requests
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const startDate = new Date(leaveRequest.startDate);
  const endDate = new Date(leaveRequest.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/my-leave-requests"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to My Leave Requests
            </Link>
            {leaveRequest.status === 0 && (
              <Link
                href={`/my-leave-requests/${leaveRequest.id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Edit Request
              </Link>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Request Details</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Request Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <span className="ml-2 text-gray-900">
                    {startDate.toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">End Date:</span>
                  <span className="ml-2 text-gray-900">
                    {endDate.toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="ml-2 text-gray-900">
                    {daysDiff} {daysDiff === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leaveRequest.status)}`}>
                    {getStatusText(leaveRequest.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(leaveRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(leaveRequest.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reason</h3>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-md">
              {leaveRequest.reason}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
