'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      router.push('/dashboard');
    }
  }, [authenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (authenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Leaves Management System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Streamline your leave requests and approvals
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-80">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-md font-medium transition-colors"
        >
          Login to Your Account
        </Link>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need an account? Contact your administrator
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-medium text-gray-900 mb-2">Easy Requests</h3>
            <p className="text-sm text-gray-600">Submit leave requests with just a few clicks</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-medium text-gray-900 mb-2">Quick Approvals</h3>
            <p className="text-sm text-gray-600">Managers can approve or reject requests instantly</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-medium text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor leave balances and request status</p>
          </div>
        </div>
      </div>
    </div>
  );
}