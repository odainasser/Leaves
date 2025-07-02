'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { userService, User } from '@/services/userService';
import Link from 'next/link';

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setLoading(true);
        const data = await userService.getById(id as string);
        setUser(data);
      } catch (err) {
        setError('Failed to fetch user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'User not found'}</div>
          <Link href="/users" className="text-blue-500 hover:text-blue-700">
            ← Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/users"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to Users
            </Link>
            <Link
              href={`/users/${user.id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Edit User
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Full Name:</span> {user.fullName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Role:</span>{' '}
                {user.role === 1 ? 'Admin' : 'Employee'}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Account Information
              </h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">User ID:</span> {user.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Created At:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}