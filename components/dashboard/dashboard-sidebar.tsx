"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  BriefcaseMedical, 
  CalendarDays, 
  FileText, 
  LogOut,
  SquarePlus,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/core/shared";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Pacientes",
    href: "/dashboard/admin/patients",
    icon: Users,
    roles: ["ADMIN", "DOCTOR"],
  },
  {
    title: "Médicos",
    href: "/dashboard/admin/doctors",
    icon: BriefcaseMedical,
    roles: ["ADMIN"],
  },
  {
    title: "Citas Médicas",
    href: "/dashboard/appointments",
    icon: CalendarDays,
    roles: ["ADMIN", "DOCTOR", "PATIENT"],
  },
  {
    title: "Recetas",
    href: "/dashboard/prescriptions",
    icon: FileText,
    roles: ["ADMIN", "DOCTOR", "PATIENT"],
  },
];

interface DashboardSidebarProps {
  role: Role;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const filteredItems = sidebarItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-[#f1f5f9] dark:bg-[#0a0c10] flex flex-col h-screen sticky top-0 transition-all duration-300 border-none shadow-none">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#459bbe] rounded-2xl flex items-center justify-center shadow-sm">
          <SquarePlus className="text-white w-7 h-7" />
        </div>
        <div>
          <h2 className="font-extrabold text-xl leading-none text-[#1e293b] dark:text-white tracking-tight">
            MediConnect
          </h2>
          <p className="text-[11px] font-bold text-[#64748b] mt-1 uppercase tracking-wider">
            Excelencia Clínica
          </p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2 mt-8">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-200 relative group",
                isActive
                  ? "bg-[#e2e8f0] text-[#236b8e] dark:bg-zinc-800 dark:text-blue-400"
                  : "text-[#475569] hover:bg-[#e2e8f0]/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-[#236b8e] dark:text-blue-400" : "text-[#475569]")} />
              {item.title}
              
              {/* Active indicator line on the right */}
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#236b8e] rounded-l-full shadow-[0_0_10px_rgba(35,107,142,0.3)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-8">
        <button
          className="flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold text-[#475569] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 transition-all duration-200"
          onClick={() => {/* Implement logout logic */}}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
