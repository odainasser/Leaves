"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layouts/AdminLayout";

interface DashboardStats {
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export default function DashboardPage() {
  const { authenticated, user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({ pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login");
    } else if (!loading && authenticated && user?.role !== 1) {
      // Redirect non-admin users to their leave requests page
      router.push("/my-leave-requests");
    }
  }, [authenticated, loading, user, router]);

  useEffect(() => {
    if (authenticated && user?.role === 1) {
      fetchDashboardData();
    }
  }, [authenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Fetch all stats in parallel
      const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/LeaveRequests/stats/pending`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/LeaveRequests/stats/approved`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/LeaveRequests/stats/rejected`, { headers })
      ]);
      
      let pendingCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        pendingCount = pendingData.count;
      }
      
      if (approvedResponse.ok) {
        const approvedData = await approvedResponse.json();
        approvedCount = approvedData.count;
      }
      
      if (rejectedResponse.ok) {
        const rejectedData = await rejectedResponse.json();
        rejectedCount = rejectedData.count;
      }
      
      console.log('Stats from API:', { 
        pendingCount, 
        approvedCount, 
        rejectedCount 
      }); // Debug log
      
      setStats({
        pendingRequests: pendingCount,
        approvedRequests: approvedCount,
        rejectedRequests: rejectedCount
      });
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
      // Set fallback values on error
      setStats({ pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 });
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!authenticated || user?.role !== 1) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Requests
                </h3>
                <p className="text-2xl font-bold text-blue-600">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Approved Requests
                </h3>
                <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Rejected Requests</h3>
                <p className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}