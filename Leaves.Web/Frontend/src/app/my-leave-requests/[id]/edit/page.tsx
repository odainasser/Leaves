'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';
import { leaveRequestService, LeaveRequest, UpdateLeaveRequestRequest } from '@/services/leaveRequestService';
import Link from 'next/link';

export default function EditMyLeaveRequestPage() {
  const params = useParams();
  const router = useRouter();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaveRequest();
  }, [params.id]);

  const loadLeaveRequest = async () => {
    try {
      setLoading(true);
      const data = await leaveRequestService.getById(params.id as string);
      if (data.status !== 0) {
        setError('You can only edit pending leave requests');
        return;
      }
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
      await leaveRequestService.updateMyLeaveRequest(params.id as string, data);
      router.push('/my-leave-requests');
    } catch (err) {
      setError('Failed to update leave request');
      console.error(err);
    } finally {
      setIsLoading(false);
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

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Link
              href="/my-leave-requests"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to My Leave Requests
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Leave Request</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <LeaveRequestForm 
            leaveRequest={leaveRequest} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            hideEmployeeField 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
