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
  LucideIcon,
  LayoutDashboard,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/core/shared";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const adminItems: SidebarItem[] = [
  {
    title: "Panel General",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Médicos",
    href: "/dashboard/admin/doctors",
    icon: BriefcaseMedical,
  },
  {
    title: "Pacientes",
    href: "/dashboard/admin/patients",
    icon: Users,
  },
  {
    title: "Citas Médicas",
    href: "/dashboard/admin/appointments",
    icon: CalendarDays,
  },
];

const doctorItems: SidebarItem[] = [
  {
    title: "Panel Médico",
    href: "/dashboard/doctor",
    icon: LayoutDashboard,
  },
  {
    title: "Mi Agenda",
    href: "/dashboard/doctor/schedule",
    icon: CalendarDays,
  },
  {
    title: "Pacientes",
    href: "/dashboard/doctor/patients",
    icon: Users,
  },
  {
    title: "Consultas",
    href: "/dashboard/doctor/consultations",
    icon: ClipboardList,
  },
];

const patientItems: SidebarItem[] = [
  {
    title: "Inicio",
    href: "/dashboard/patient",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Citas",
    href: "/dashboard/patient/my-appointments",
    icon: CalendarDays,
  },
  {
    title: "Mis Recetas",
    href: "/dashboard/patient/prescriptions",
    icon: FileText,
  },
  {
    title: "Mi Salud",
    href: "/dashboard/patient/health",
    icon: SquarePlus,
  },
];

interface DashboardSidebarProps {
  role: Role;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const getSidebarItems = () => {
    switch (role) {
      case "ADMIN": return adminItems;
      case "DOCTOR": return doctorItems;
      case "PATIENT": return patientItems;
      default: return [];
    }
  };

  const filteredItems = getSidebarItems();

  return (
    <aside className="w-64 bg-blanco-azulado dark:bg-gris-azulado flex flex-col h-screen sticky top-0 transition-all duration-300 border-none shadow-none">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-celeste rounded-2xl flex items-center justify-center shadow-sm">
          <SquarePlus className="text-white w-7 h-7" />
        </div>
        <div>
          <h2 className="font-extrabold text-xl leading-none text-petroleo dark:text-white tracking-tight">
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
                  ? "bg-celeste text-white shadow-lg shadow-blue-200/20 dark:shadow-none"
                  : "text-petroleo/70 hover:bg-celeste/10 hover:text-petroleo dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-petroleo/70")} />
              {item.title}
              
              {/* Active indicator line on the right */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-8">
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-4 px-6 py-6 rounded-xl text-sm font-bold text-petroleo/70 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 transition-all duration-200 w-full"
          onClick={() => {/* Implement logout logic */}}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
