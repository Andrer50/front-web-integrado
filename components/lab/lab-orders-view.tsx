"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileSearch,
  FlaskConical,
  ImageIcon,
  Search,
  Stethoscope,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLabOrders } from "@/modules/domain/clinical/hooks/useLabOrders";

interface LabOrdersViewProps {
  showPatient?: boolean;
}

const typeLabel = (type: string) =>
  type === "IMAGE" ? "Imagen" : "Laboratorio";

export function LabOrdersView({ showPatient = false }: LabOrdersViewProps) {
  const { data, isLoading, error } = useLabOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const orders = useMemo(() => data?.data ?? [], [data]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const searchableText = [
        order.name,
        order.patientFirstName,
        order.patientLastName,
        order.doctorFirstName,
        order.doctorLastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (statusFilter === "ALL" || order.status === statusFilter) &&
        (typeFilter === "ALL" || order.type === typeFilter)
      );
    });
  }, [orders, searchTerm, statusFilter, typeFilter]);

  const completed = orders.filter((order) => order.status === "COMPLETED").length;
  const pending = orders.length - completed;

  if (isLoading) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4">
        <Spinner className="h-11 w-11 text-celeste" />
        <p className="text-sm font-bold text-zinc-500">Cargando órdenes y resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <FileSearch className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-bold text-petroleo dark:text-white">No se pudieron cargar los exámenes</h2>
        <p className="text-sm text-zinc-500">Verifica la conexión con el backend e intenta nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Resumen de órdenes">
        {[
          { label: "Total de órdenes", value: orders.length, icon: FlaskConical, color: "text-celeste bg-blue-50" },
          { label: "Con resultado", value: completed, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Pendientes", value: pending, icon: Clock3, color: "text-amber-600 bg-amber-50" },
        ].map((item) => (
          <div key={item.label} className="flex min-h-24 items-center gap-4 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-zinc-400">{item.label}</p>
              <p className="text-2xl font-black text-petroleo dark:text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 border-y border-zinc-200 py-4 md:grid-cols-[1fr_190px_190px] dark:border-zinc-800" aria-label="Filtros">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={showPatient ? "Buscar examen, paciente o médico..." : "Buscar examen o médico..."}
          startContent={<Search className="h-4 w-4 text-zinc-400" />}
          className="h-11 rounded-lg bg-white dark:bg-zinc-950"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-bold dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="ALL">Todos los estados</option>
          <option value="PENDING">Pendientes</option>
          <option value="COMPLETED">Con resultado</option>
        </select>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-bold dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="ALL">Todos los tipos</option>
          <option value="LABORATORY">Laboratorio</option>
          <option value="IMAGE">Imagen</option>
        </select>
      </section>

      {filteredOrders.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center border-b border-dashed border-zinc-300 text-center dark:border-zinc-700">
          <FlaskConical className="mb-4 h-12 w-12 text-zinc-300" />
          <h3 className="font-bold text-petroleo dark:text-white">No hay órdenes para mostrar</h3>
          <p className="mt-1 text-sm text-zinc-500">Las nuevas solicitudes aparecerán en este apartado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === "COMPLETED";
            const TypeIcon = order.type === "IMAGE" ? ImageIcon : FlaskConical;
            return (
              <article key={order.id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <header className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-900">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-celeste dark:bg-blue-950/30">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-petroleo dark:text-white">{order.name}</h3>
                      <p className="text-xs font-bold uppercase text-zinc-400">{typeLabel(order.type)}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-black ${isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {isCompleted ? "CON RESULTADO" : "PENDIENTE"}
                  </span>
                </header>

                <div className="grid grid-cols-1 gap-2 py-4 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-300">
                  {showPatient && (
                    <p className="flex items-center gap-2 font-semibold"><User className="h-4 w-4 text-celeste" />{order.patientFirstName} {order.patientLastName}</p>
                  )}
                  <p className="flex items-center gap-2 font-semibold"><Stethoscope className="h-4 w-4 text-celeste" />Dr. {order.doctorFirstName} {order.doctorLastName}</p>
                  <p className="flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4 text-celeste" />{new Date(order.orderedAt).toLocaleString("es-PE")}</p>
                </div>

                <div className={`rounded-lg border p-4 ${isCompleted ? "border-emerald-100 bg-emerald-50/40" : "border-amber-100 bg-amber-50/40"}`}>
                  <p className="mb-1 text-xs font-black uppercase text-zinc-500">Resultado</p>
                  <p className="whitespace-pre-wrap text-sm font-medium text-zinc-700">
                    {order.resultDetails || "Resultado pendiente de registro."}
                  </p>
                  {order.resultRecordedAt && (
                    <p className="mt-3 text-xs font-semibold text-zinc-400">Registrado: {new Date(order.resultRecordedAt).toLocaleString("es-PE")}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
