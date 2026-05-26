"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // En desarrollo/vista previa, si no hay sesión, usaremos un rol por defecto
  const userRole = (session?.user?.role as Role) || "ADMIN";

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
