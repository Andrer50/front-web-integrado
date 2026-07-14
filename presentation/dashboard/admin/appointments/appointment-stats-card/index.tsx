"use client";

import { CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AppointmentStatsCardProps {
  totalElements: number;
  totalPending: number;
  totalConfirmed: number;
  totalCancelled: number;
}

export function AppointmentStatsCard({
  totalElements,
  totalPending,
  totalConfirmed,
  totalCancelled,
}: AppointmentStatsCardProps) {
  const stats = [
    {
      title: "Citas (página actual)",
      value: totalElements.toString(),
      icon: CalendarDays,
      color: "text-celeste",
      bg: "bg-blue-50",
    },
    {
      title: "Pendientes",
      value: totalPending.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Confirmadas",
      value: totalConfirmed.toString(),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Canceladas",
      value: totalCancelled.toString(),
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="border-none shadow-sm rounded-3xl overflow-hidden"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-zinc-800 flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-petroleo dark:text-white leading-tight">
                {stat.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}