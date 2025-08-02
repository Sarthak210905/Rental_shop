
"use client";

import { useAuth } from "@/hooks/use-auth.tsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login page
        router.push("/login");
      } else if (!isAdmin) {
        // If logged in but not an admin, redirect to dashboard or home
        router.push("/dashboard");
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
