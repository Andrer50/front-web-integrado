"use client";

import {
  Search,
  Filter,
  MoreVertical,
  User,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppointmentResponse } from "@/core/appointment/interfaces";

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400",
  PENDING:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400",
  COMPLETED:
    "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
  CANCELLED:
    "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400",
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "CONFIRMADA",
  PENDING: "PENDIENTE",
  COMPLETED: "COMPLETADA",
  CANCELLED: "CANCELADA",
};

export interface ConfirmAction {
  appointmentId: string;
  newStatus: string;
  label: string;
}

interface AppointmentTableProps {
  appointments: AppointmentResponse[];
  isLoading: boolean;
  tab: "ALL" | "PENDING";
  page: number;
  totalPages: number;
  totalElements: number;
  searchQuery: string;
  isChanging: boolean;
  changingAppointmentId?: string;
  onTabChange: (tab: "ALL" | "PENDING") => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onViewConsultation: (appointmentId: string) => void;
  onConfirmAction: (action: ConfirmAction) => void;
}

export function AppointmentTable({
  appointments,
  isLoading,
  tab,
  page,
  totalPages,
  totalElements,
  searchQuery,
  isChanging,
  changingAppointmentId,
  onTabChange,
  onSearchChange,
  onPageChange,
  onViewConsultation,
  onConfirmAction,
}: AppointmentTableProps) {
  const renderActions = (app: AppointmentResponse) => {
    const isThisChanging = isChanging && changingAppointmentId === app.id;

    if (app.status === "COMPLETED") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-petroleo rounded-xl"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
          >
            <DropdownMenuItem
              onClick={() => onViewConsultation(app.id)}
              className="cursor-pointer font-semibold text-sm focus:bg-celeste/10 focus:text-celeste"
            >
              Ver Consulta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    const options: { label: string; status: string }[] = [];
    if (app.status === "PENDING") {
      options.push({ label: "Confirmar", status: "CONFIRMED" });
      options.push({ label: "Cancelar", status: "CANCELLED" });
    }
    if (app.status === "CONFIRMED") {
      options.push({ label: "Marcar como completada", status: "COMPLETED" });
      options.push({ label: "Cancelar", status: "CANCELLED" });
    }

    if (options.length === 0) {
      return (
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="text-zinc-300 rounded-xl"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isThisChanging}
            className="text-zinc-400 hover:text-petroleo rounded-xl"
          >
            {isThisChanging ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MoreVertical className="w-5 h-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
        >
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.status}
              onClick={() =>
                onConfirmAction({
                  appointmentId: app.id,
                  newStatus: opt.status,
                  label: opt.label,
                })
              }
              className="cursor-pointer font-semibold text-sm focus:bg-celeste/10 focus:text-celeste"
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => onTabChange(v as "ALL" | "PENDING")}
      className="w-full space-y-6"
    >
      <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <TabsList className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 h-auto">
            <TabsTrigger
              value="ALL"
              className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white text-zinc-500 dark:text-zinc-400"
            >
              Todas las Citas
            </TabsTrigger>
            <TabsTrigger
              value="PENDING"
              className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white text-zinc-500 dark:text-zinc-400"
            >
              Pendientes
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Buscar por paciente o médico..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              startContent={<Search className="w-4 h-4 text-zinc-400" />}
              className="h-auto py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm w-64 lg:w-80 font-medium"
            />
            <Button
              variant="outline"
              className="rounded-xl flex items-center gap-2 font-bold text-xs border-zinc-200"
            >
              <Filter className="w-4 h-4" />
              Filtros Avanzados
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <TabsContent
            value={tab}
            className="mt-0 border-none p-0 outline-none"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner className="w-10 h-10 text-celeste" />
                <p className="text-zinc-500 font-bold text-sm">
                  Cargando citas...
                </p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <CalendarDays className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
                <h3 className="font-bold text-lg text-petroleo dark:text-white">
                  No se encontraron citas
                </h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Ajusta los filtros o crea una nueva cita.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                      <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                        Paciente
                      </th>
                      <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                        Médico Especialista
                      </th>
                      <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                        Fecha y Hora
                      </th>
                      <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                        Motivo
                      </th>
                      <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                        Estado
                      </th>
                      <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                    {appointments.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blanco-azulado flex items-center justify-center text-celeste border border-zinc-100 dark:border-zinc-700">
                              <User className="w-4 h-4" />
                            </div>
                            <p className="font-bold text-petroleo dark:text-white text-sm">
                              {app.patientFirstName} {app.patientLastName}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-petroleo dark:text-white">
                              Dr. {app.doctorFirstName} {app.doctorLastName}
                            </p>
                            <p className="text-[11px] font-bold text-verde-salud uppercase tracking-wide">
                              {app.doctorSpecialty}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-petroleo dark:text-white">
                              {app.appointmentDate}
                            </p>
                            <p className="text-xs text-zinc-500 font-medium">
                              {app.appointmentTime
                                ? app.appointmentTime.substring(0, 5)
                                : "--:--"}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs text-zinc-500 font-medium max-w-[180px] truncate">
                            {app.reason || "—"}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${
                              STATUS_STYLE[app.status] ||
                              "bg-zinc-50 text-zinc-600 border-zinc-100"
                            }`}
                          >
                            {STATUS_LABEL[app.status] || app.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {renderActions(app)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </CardContent>

        {totalPages > 1 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-bold text-zinc-400">
              Página{" "}
              <span className="text-petroleo dark:text-white">
                {page + 1}
              </span>{" "}
              de {totalPages} — {totalElements} citas registradas
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={page === 0}
                onClick={() => onPageChange(Math.max(0, page - 1))}
                className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={idx === page ? "celeste" : "ghost"}
                  onClick={() => onPageChange(idx)}
                  className="w-9 h-9 rounded-lg text-sm font-bold transition-all p-0"
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                disabled={page >= totalPages - 1}
                onClick={() =>
                  onPageChange(Math.min(totalPages - 1, page + 1))
                }
                className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </Tabs>
  );
}