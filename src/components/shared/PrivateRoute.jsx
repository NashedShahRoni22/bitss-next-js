"use client";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { authInfo, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !authInfo) {
      // Combine pathname and search params for redirect
      const currentUrl =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");
      const redirectUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      router.push(redirectUrl);
    }
  }, [authInfo, loading, router, pathname, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!authInfo) {
    return null; // Return null while redirecting
  }

  return children;
}
