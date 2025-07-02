'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import UserForm from '@/components/forms/UserForm';
import { userService, User, UpdateUserRequest } from '@/services/userService';
import Link from 'next/link';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const data = await userService.getById(params.id as string);
        setUser(data);
      } catch (err) {
        setError('Failed to load user');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [params.id]);

  const handleSubmit = async (data: UpdateUserRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await userService.update(params.id as string, data);
      router.push('/users');
    } catch (err) {
      setError('Failed to update user');
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Link
              href="/users"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Back to Users
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <UserForm user={user} onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </AdminLayout>
  );
}