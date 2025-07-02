'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';
import { leaveRequestService, CreateLeaveRequestRequest } from '@/services/leaveRequestService';
import Link from 'next/link';

export default function CreateMyLeaveRequestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: CreateLeaveRequestRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await leaveRequestService.createMyLeaveRequest(data);
      router.push('/my-leave-requests');
    } catch (err) {
      setError('Failed to create leave request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Request New Leave</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <LeaveRequestForm onSubmit={handleSubmit} isLoading={isLoading} hideEmployeeField />
        </div>
      </div>
    </AdminLayout>
  );
}
