"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeToken, getUser } from "@/lib/auth";
import { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        setUser(getUser());
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    removeToken();
    setAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return {
    authenticated,
    user,
    loading,
    logout,
  };
}