"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { authenticated, user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login");
    }
  }, [authenticated, loading, router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!authenticated) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      {user && (
        <div className="mb-4">
          <p>Welcome, {user.fullName}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role === 1 ? "Admin" : "User"}</p>
        </div>
      )}
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
}