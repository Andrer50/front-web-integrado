"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { Role } from "@/core/shared";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const userRole = session?.user?.role?.toUpperCase() as Role | undefined;
  const roleBasePath = userRole
    ? `/dashboard/${userRole.toLowerCase()}`
    : undefined;
  const isAuthorizedPath = Boolean(
    roleBasePath &&
      (pathname === roleBasePath || pathname.startsWith(`${roleBasePath}/`)),
  );
  const hasInvalidSession = Boolean(session?.error);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || hasInvalidSession || !userRole) {
      router.replace(
        `/authentication/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
      );
      return;
    }

    if (!isAuthorizedPath && roleBasePath) {
      router.replace(roleBasePath);
    }
  }, [
    hasInvalidSession,
    isAuthorizedPath,
    pathname,
    roleBasePath,
    router,
    status,
    userRole,
  ]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    hasInvalidSession ||
    !userRole ||
    !isAuthorizedPath
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-celeste" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardSidebar 
        role={userRole} 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileOpenChange={setIsMobileSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
