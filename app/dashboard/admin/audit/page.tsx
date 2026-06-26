"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  Database,
  FileClock,
  Filter,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuditLogs } from "@/modules/domain/audit/hooks/useAuditLogs";

const MODULE_LABEL: Record<string, string> = {
  APPOINTMENTS: "Citas",
  PRESCRIPTIONS: "Recetas",
};

const ACTION_LABEL: Record<string, string> = {
  CREATED: "Creación",
  STATUS_CHANGED: "Cambio de estado",
};

const ENTITY_LABEL: Record<string, string> = {
  APPOINTMENT: "Cita",
  PRESCRIPTION: "Receta",
};

export default function AdminAuditPage() {
  const [page, setPage] = useState(0);
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [entityTypeFilter, setEntityTypeFilter] = useState("ALL");
  const [entityId, setEntityId] = useState("");
  const size = 10;

  const params = useMemo(
    () => ({
      page,
      size,
      module: moduleFilter !== "ALL" ? moduleFilter : undefined,
      entityType: entityTypeFilter !== "ALL" ? entityTypeFilter : undefined,
      entityId: entityId.trim() || undefined,
    }),
    [page, moduleFilter, entityTypeFilter, entityId],
  );

  const { data, isLoading, isFetching } = useAuditLogs(params);
  const logs = data?.data?.content || [];
  const totalElements = data?.data?.totalElements || 0;
  const totalPages = data?.data?.totalPages || 0;

  const handleModuleChange = (value: string) => {
    setModuleFilter(value);
    setPage(0);
  };

  const handleEntityTypeChange = (value: string) => {
    setEntityTypeFilter(value);
    setPage(0);
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-celeste mb-1 uppercase tracking-widest">
            Administración
          </p>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Auditoría de Citas y Recetas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Registro de cambios críticos del sistema clínico.
          </p>
        </div>
        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <Spinner className="w-4 h-4 text-celeste" />
            Actualizando
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Eventos registrados",
            value: totalElements.toString(),
            icon: FileClock,
            color: "text-celeste bg-blue-50 dark:bg-blue-900/10",
          },
          {
            label: "Módulo",
            value: moduleFilter === "ALL" ? "Todos" : MODULE_LABEL[moduleFilter],
            icon: Database,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10",
          },
          {
            label: "Página actual",
            value: totalPages > 0 ? `${page + 1} de ${totalPages}` : "0 de 0",
            icon: CalendarClock,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-900/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-[2rem] bg-white dark:bg-zinc-950">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-xl font-black text-petroleo dark:text-white mt-1">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-900">
          <CardTitle className="text-lg font-bold text-petroleo dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-celeste" />
            Filtros
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <select
              value={moduleFilter}
              onChange={(e) => handleModuleChange(e.target.value)}
              className="h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-bold text-petroleo dark:text-white focus:outline-none focus:ring-2 focus:ring-celeste"
            >
              <option value="ALL">Todos los módulos</option>
              <option value="APPOINTMENTS">Citas</option>
              <option value="PRESCRIPTIONS">Recetas</option>
            </select>

            <select
              value={entityTypeFilter}
              onChange={(e) => handleEntityTypeChange(e.target.value)}
              className="h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-bold text-petroleo dark:text-white focus:outline-none focus:ring-2 focus:ring-celeste"
            >
              <option value="ALL">Todas las entidades</option>
              <option value="APPOINTMENT">Cita</option>
              <option value="PRESCRIPTION">Receta</option>
            </select>

            <Input
              value={entityId}
              onChange={(e) => {
                setEntityId(e.target.value);
                setPage(0);
              }}
              placeholder="ID de cita o receta"
              startContent={<Search className="w-4 h-4 text-zinc-400" />}
              className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl font-medium"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Spinner className="w-10 h-10 text-celeste" />
              <p className="text-zinc-500 font-bold text-sm">Cargando auditoría...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileClock className="w-14 h-14 text-zinc-300 mb-4" />
              <h3 className="font-bold text-lg text-petroleo dark:text-white">
                Sin registros de auditoría
              </h3>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {logs.map((log) => (
                <div key={log.id} className="p-6 flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-celeste border border-blue-100 text-[10px] font-black tracking-widest uppercase">
                        {MODULE_LABEL[log.module] || log.module}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-300 text-[10px] font-black tracking-widest uppercase">
                        {ACTION_LABEL[log.action] || log.action}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {ENTITY_LABEL[log.entityType] || log.entityType} #{log.entityId.substring(0, 8).toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                          Valor anterior
                        </p>
                        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 break-words">
                          {log.oldValue || "Sin valor previo"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/10 p-4 border border-emerald-100 dark:border-emerald-900/20">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                          Valor nuevo
                        </p>
                        <p className="text-sm font-bold text-petroleo dark:text-zinc-100 break-words">
                          {log.newValue || "Sin valor nuevo"}
                        </p>
                      </div>
                    </div>

                    {log.description && (
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {log.description}
                      </p>
                    )}
                  </div>

                  <div className="lg:w-72 shrink-0 space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-bold">
                      <User className="w-4 h-4 text-celeste" />
                      <span className="truncate">{log.actorEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-semibold">
                      <CalendarClock className="w-4 h-4 text-celeste" />
                      <span>{formatDate(log.changedAt)}</span>
                    </div>
                    {log.actorRoles && (
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Roles: {log.actorRoles}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          disabled={page === 0 || isLoading}
          onClick={() => setPage((current) => Math.max(current - 1, 0))}
          className="rounded-xl font-bold"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          disabled={totalPages === 0 || page >= totalPages - 1 || isLoading}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-xl font-bold"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
