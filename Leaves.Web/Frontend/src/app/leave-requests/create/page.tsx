'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';
import { leaveRequestService, CreateLeaveRequestRequest } from '@/services/leaveRequestService';
import Link from 'next/link';

export default function CreateLeaveRequestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: CreateLeaveRequestRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await leaveRequestService.create(data);
      router.push('/leave-requests');
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
              href="/leave-requests"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to Leave Requests
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Leave Request</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <LeaveRequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </AdminLayout>
  );
}
