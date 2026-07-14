"use client";

import {
  Calendar,
  MapPin,
  Clock,
  FileText,
  User as UserIcon,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppointmentResponse } from "@/core/appointment/interfaces";

interface AppointmentCardProps {
  app: AppointmentResponse;
  variant: "upcoming" | "history";
  onCancel?: (id: string) => void;
  onViewConsultation?: (id: string) => void;
}

export function AppointmentCard({
  app,
  variant,
  onCancel,
  onViewConsultation,
}: AppointmentCardProps) {
  if (variant === "history") {
    return (
      <Card className="rounded-[3rem] border-zinc-100 dark:border-zinc-800 shadow-sm group overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-zinc-50 dark:border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blanco-azulado shrink-0 flex items-center justify-center text-celeste">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-petroleo dark:text-white">
                  Dr. {app.doctorFirstName} {app.doctorLastName}
                </h3>
                <p className="text-xs font-bold text-verde-salud">
                  {app.doctorSpecialty}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 font-bold tracking-wider">
                  {app.appointmentDate} •{" "}
                  {app.appointmentTime
                    ? app.appointmentTime.substring(0, 5)
                    : "--:--"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest border ${
                  app.status === "COMPLETED"
                    ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                    : "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
                }`}
              >
                {app.status === "COMPLETED" ? "COMPLETADA" : "CANCELADA"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Diagnóstico / Observaciones
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic font-medium">
                  {app.reason || "Consulta de rutina completada."}
                </p>
              </div>
            </div>

            {app.status === "COMPLETED" && onViewConsultation && (
              <Button
                onClick={() => onViewConsultation(app.id)}
                variant="outline"
                className="rounded-xl font-bold border-zinc-200 dark:border-zinc-800 text-celeste hover:bg-celeste/10 hover:text-celeste cursor-pointer shrink-0"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Receta / Consulta
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      key={app.id}
      className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group overflow-hidden"
    >
      <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-5 shrink-0 w-full lg:w-72">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500 border-[3px] border-white dark:border-zinc-950 shadow-sm">
            <UserIcon className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-petroleo dark:text-white group-hover:text-celeste transition-colors truncate">
              Dr. {app.doctorFirstName} {app.doctorLastName}
            </h3>
            <p className="text-xs font-bold text-celeste truncate mt-0.5">
              {app.doctorSpecialty}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${
                  app.status === "CONFIRMED"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : app.status === "PENDING"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    app.status === "CONFIRMED"
                      ? "bg-emerald-500"
                      : app.status === "PENDING"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                />
                {app.status === "CONFIRMED"
                  ? "CONFIRMADA"
                  : app.status === "PENDING"
                    ? "PENDIENTE"
                    : "CANCELADA"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-black text-petroleo dark:text-zinc-100 whitespace-nowrap">
                {app.appointmentDate}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium truncate mt-0.5">
                Fecha de consulta
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-black text-petroleo dark:text-zinc-100 whitespace-nowrap">
                {app.appointmentTime
                  ? app.appointmentTime.substring(0, 5)
                  : "--:--"}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium truncate mt-0.5">
                Hora programada
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-black text-petroleo dark:text-zinc-100 whitespace-nowrap">
                Presencial
              </p>
              <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[140px] mt-0.5">
                {app.reason || "Consulta General"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end shrink-0 pl-0 lg:pl-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-petroleo rounded-xl cursor-pointer"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg"
            >
              <DropdownMenuItem
                disabled={app.status !== "PENDING"}
                onClick={() => {
                  if (app.status === "PENDING") {
                    onCancel?.(app.id);
                  }
                }}
                className={`cursor-pointer font-semibold text-sm ${
                  app.status === "PENDING"
                    ? "text-red-500 focus:bg-red-50 focus:text-red-600"
                    : "text-zinc-300 dark:text-zinc-600"
                }`}
              >
                Cancelar cita
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}