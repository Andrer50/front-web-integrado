"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { Role } from "@/core/shared";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  // En desarrollo/vista previa, si no hay sesión, usaremos un rol por defecto
  const userRole = (session?.user?.role as Role) || "ADMIN";

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardSidebar role={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
