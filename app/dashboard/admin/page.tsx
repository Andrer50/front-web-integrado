"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  Activity,
  Calendar,
  CalendarDays,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Building2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import { useDoctors } from "@/modules/domain/doctor/hooks/useDoctors";
import { usePatients } from "@/modules/domain/user/patient/hooks/usePatients";
import { AppointmentResponse } from "@/core/appointment/interfaces";

type DateFilterType = "today" | "week" | "month" | "all";

export default function AdminDashboardPage() {
  // Estado para el filtro de fecha (por defecto: 'month' - Mes actual, cumpliendo la tarea T2)
  const [dateFilter, setDateFilter] = useState<DateFilterType>("month");
  const [searchPatient, setSearchPatient] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Consultas de datos reales desde el backend
  const { data: appointmentsRes, isLoading: isLoadingAppointments } =
    useAppointments({
      page: 0,
      size: 200,
      sort: "appointmentDate,desc",
    });

  const { data: doctorsRes, isLoading: isLoadingDoctors } = useDoctors({
    page: 0,
    size: 100,
  });

  const { data: patientsRes, isLoading: isLoadingPatients } = usePatients({
    page: 0,
    size: 100,
  });

  const allAppointments = useMemo(
    () => appointmentsRes?.data?.content || [],
    [appointmentsRes],
  );
  const totalDoctors =
    doctorsRes?.data?.totalElements ||
    doctorsRes?.data?.content?.length ||
    0;
  const totalPatients =
    patientsRes?.data?.totalElements ||
    patientsRes?.data?.content?.length ||
    0;

  // Lógica de filtrado por fechas (Hoy, Esta Semana, Este Mes, Histórico)
  const filteredByDate = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // Calcular inicio de semana (Lunes)
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Lunes, 6 = Domingo
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    const startOfWeekStr = startOfWeek.toISOString().slice(0, 10);

    // Calcular inicio de mes
    const startOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    return allAppointments.filter((app) => {
      const appDate = app.appointmentDate;
      if (!appDate) return false;

      if (dateFilter === "today") {
        return appDate === todayStr;
      }
      if (dateFilter === "week") {
        return appDate >= startOfWeekStr && appDate <= todayStr;
      }
      if (dateFilter === "month") {
        return appDate >= startOfMonthStr;
      }
      return true; // 'all'
    });
  }, [allAppointments, dateFilter]);

  // Filtrar además por búsqueda de texto y estado
  const filteredAppointments = useMemo(() => {
    return filteredByDate.filter((app) => {
      const patientName =
        `${app.patientFirstName} ${app.patientLastName}`.toLowerCase();
      const doctorName =
        `${app.doctorFirstName} ${app.doctorLastName}`.toLowerCase();
      const specialty = (app.doctorSpecialty || "").toLowerCase();
      const query = searchPatient.toLowerCase().trim();

      const matchesSearch =
        !query ||
        patientName.includes(query) ||
        doctorName.includes(query) ||
        specialty.includes(query);

      const matchesStatus =
        statusFilter === "ALL" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [filteredByDate, searchPatient, statusFilter]);

  // Cálculos estadísticos basados en el período seleccionado
  const totalInPeriod = filteredByDate.length;
  const completedInPeriod = filteredByDate.filter(
    (a) => a.status === "COMPLETED",
  ).length;
  const pendingInPeriod = filteredByDate.filter(
    (a) => a.status === "PENDING",
  ).length;
  const confirmedInPeriod = filteredByDate.filter(
    (a) => a.status === "CONFIRMED",
  ).length;
  const cancelledInPeriod = filteredByDate.filter(
    (a) => a.status === "CANCELLED",
  ).length;

  const efficiencyRate =
    totalInPeriod > 0
      ? Math.round(
        ((completedInPeriod + confirmedInPeriod) / totalInPeriod) * 100,
      )
      : 100;

  // Generador de reporte en formato CSV (cumpliendo Tarea T2 del informe)
  const handleExportReport = () => {
    if (filteredByDate.length === 0) {
      toast.error("No hay citas registradas en el período seleccionado para exportar.");
      return;
    }

    const periodLabels: Record<DateFilterType, string> = {
      today: "Hoy",
      week: "Esta_Semana",
      month: "Mes_Actual",
      all: "Historico_Completo",
    };

    const headers = [
      "ID Cita",
      "Fecha",
      "Hora",
      "Paciente",
      "Médico",
      "Especialidad",
      "Estado",
      "Motivo",
    ];

    const rows = filteredByDate.map((app) => [
      `"${app.id}"`,
      `"${app.appointmentDate}"`,
      `"${app.appointmentTime || ""}"`,
      `"${app.patientFirstName} ${app.patientLastName}"`,
      `"Dr(a). ${app.doctorFirstName} ${app.doctorLastName}"`,
      `"${app.doctorSpecialty || "General"}"`,
      `"${app.status}"`,
      `"${(app.reason || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Reporte_Citas_Mediconnect_${periodLabels[dateFilter]}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `Reporte de citas (${periodLabels[dateFilter]}) generado y descargado exitosamente.`,
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Atendida
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-celeste border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Confirmada
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700">
            {status}
          </span>
        );
    }
  };

  const isLoading =
    isLoadingAppointments || isLoadingDoctors || isLoadingPatients;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header con Filtros Reubicados en la Esquina Superior Derecha (Mejora Capítulo V) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-celeste mb-1">
            <Activity className="w-4 h-4" />
            Panel General y Reportes
          </div>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Métricas de la Clínica
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm font-medium">
            Supervisa en tiempo real el flujo de citas, pacientes y la actividad del personal médico.
          </p>
        </div>

        {/* Controles de Filtro Temporal y Botón de Generar Reporte */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Botones de Segmentación de Fecha de Alto Contraste (Mejora 5.5 del Informe) */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex items-center gap-1 border border-zinc-200/60 dark:border-zinc-700">
            {[
              { id: "today", label: "Hoy" },
              { id: "week", label: "Semana" },
              { id: "month", label: "Mes Actual" },
              { id: "all", label: "Histórico" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDateFilter(f.id as DateFilterType)}
                className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${dateFilter === f.id
                    ? "bg-petroleo dark:bg-celeste text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Menú Desplegable complementario para vista móvil o selección directa */}
          <div className="sm:hidden">
            <Select
              value={dateFilter}
              onValueChange={(v) => setDateFilter(v as DateFilterType)}
            >
              <SelectTrigger className="h-11 rounded-xl font-bold bg-white dark:bg-zinc-800">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Mes actual</SelectItem>
                <SelectItem value="all">Todo el historial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón de Generación de Reporte (Tarea T2 del informe) */}
          <Button
            onClick={handleExportReport}
            variant="celeste"
            className="rounded-2xl h-11 px-5 font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas Dinámicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Citas del Período */}
        <Card className="rounded-[2rem] border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-celeste dark:bg-blue-950/40 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="bg-blue-50 text-celeste text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {dateFilter === "month"
                  ? "Mes Actual"
                  : dateFilter === "week"
                    ? "Esta Semana"
                    : dateFilter === "today"
                      ? "Hoy"
                      : "Total"}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Citas en el período
              </p>
              <h3 className="text-3xl font-black text-petroleo dark:text-white mt-1">
                {isLoadingAppointments ? <Spinner className="w-6 h-6" /> : totalInPeriod}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {allAppointments.length > 0
                  ? `${Math.round((totalInPeriod / (allAppointments.length || 1)) * 100)}% del total acumulado`
                  : "Sin citas previas"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pacientes Registrados */}
        <Card className="rounded-[2rem] border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Activos
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Total Pacientes
              </p>
              <h3 className="text-3xl font-black text-petroleo dark:text-white mt-1">
                {isLoadingPatients ? <Spinner className="w-6 h-6" /> : totalPatients}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Padrón clínico habilitado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Médicos del Sistema */}
        <Card className="rounded-[2rem] border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="bg-purple-50 text-purple-700 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Especialistas
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Médicos en Staff
              </p>
              <h3 className="text-3xl font-black text-petroleo dark:text-white mt-1">
                {isLoadingDoctors ? <Spinner className="w-6 h-6" /> : totalDoctors}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Profesionales autorizados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tasa de Efectividad en Citas */}
        <Card className="rounded-[2rem] border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="bg-amber-50 text-amber-700 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Eficiencia
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Tasa de Cumplimiento
              </p>
              <h3 className="text-3xl font-black text-petroleo dark:text-white mt-1">
                {efficiencyRate}%
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {completedInPeriod} atenciones completadas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desglose del Flujo de Estados de Citas */}
      <Card className="rounded-[2rem] border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
        <CardHeader className="p-6 md:p-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-black text-petroleo dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-celeste" />
                Desglose del Flujo de Citas
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Distribución operativa de las consultas para el período seleccionado.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completadas
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2"></span> Confirmadas
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span> Pendientes
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2"></span> Canceladas
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 pt-0 space-y-6">
          {/* Barra de Progreso Acumulada */}
          <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
            {totalInPeriod > 0 ? (
              <>
                <div
                  style={{ width: `${(completedInPeriod / totalInPeriod) * 100}%` }}
                  className="h-full bg-emerald-500 transition-all duration-500"
                  title={`Completadas: ${completedInPeriod}`}
                />
                <div
                  style={{ width: `${(confirmedInPeriod / totalInPeriod) * 100}%` }}
                  className="h-full bg-celeste transition-all duration-500"
                  title={`Confirmadas: ${confirmedInPeriod}`}
                />
                <div
                  style={{ width: `${(pendingInPeriod / totalInPeriod) * 100}%` }}
                  className="h-full bg-amber-400 transition-all duration-500"
                  title={`Pendientes: ${pendingInPeriod}`}
                />
                <div
                  style={{ width: `${(cancelledInPeriod / totalInPeriod) * 100}%` }}
                  className="h-full bg-rose-500 transition-all duration-500"
                  title={`Canceladas: ${cancelledInPeriod}`}
                />
              </>
            ) : (
              <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700" />
            )}
          </div>

          {/* Tarjetas de Estados Detalladas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Completadas
              </p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                {completedInPeriod}
              </p>
              <p className="text-[11px] text-emerald-600/80 font-semibold mt-0.5">
                {totalInPeriod > 0 ? Math.round((completedInPeriod / totalInPeriod) * 100) : 0}% del período
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
              <p className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Confirmadas
              </p>
              <p className="text-2xl font-black text-celeste dark:text-blue-300 mt-1">
                {confirmedInPeriod}
              </p>
              <p className="text-[11px] text-blue-600/80 font-semibold mt-0.5">
                {totalInPeriod > 0 ? Math.round((confirmedInPeriod / totalInPeriod) * 100) : 0}% del período
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
              <p className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                Pendientes
              </p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-300 mt-1">
                {pendingInPeriod}
              </p>
              <p className="text-[11px] text-amber-600/80 font-semibold mt-0.5">
                {totalInPeriod > 0 ? Math.round((pendingInPeriod / totalInPeriod) * 100) : 0}% del período
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <p className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                Canceladas
              </p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-300 mt-1">
                {cancelledInPeriod}
              </p>
              <p className="text-[11px] text-rose-600/80 font-semibold mt-0.5">
                {totalInPeriod > 0 ? Math.round((cancelledInPeriod / totalInPeriod) * 100) : 0}% del período
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flujo Detallado de Citas y Pacientes (Tarea T2 del informe) */}
      <Card className="rounded-[2.5rem] border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black text-petroleo dark:text-white">
                Flujo de Citas Médicas del Período
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Visualización detallada de citas filtradas por el intervalo seleccionado.
              </p>
            </div>

            {/* Filtros de la Tabla */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Buscar paciente o médico..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-xs font-medium border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-celeste/20"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="COMPLETED">Atendidas</option>
                <option value="CONFIRMED">Confirmadas</option>
                <option value="PENDING">Pendientes</option>
                <option value="CANCELLED">Canceladas</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="w-10 h-10 text-celeste" />
              <p className="text-sm font-bold text-zinc-500">Cargando flujo de citas...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-petroleo dark:text-white">
                No hay citas en este período
              </h4>
              <p className="text-sm text-zinc-500 max-w-sm mt-1">
                No se registraron atenciones médicas en el rango seleccionado. Intenta cambiando el filtro de fecha o buscando otro término.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/80 dark:bg-zinc-800/40 text-[11px] font-black uppercase text-zinc-400 tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Paciente</th>
                    <th className="px-6 py-4">Médico & Especialidad</th>
                    <th className="px-6 py-4">Fecha & Hora</th>
                    <th className="px-6 py-4">Motivo</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                  {filteredAppointments.slice(0, 10).map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-celeste/10 text-celeste flex items-center justify-center font-black text-xs shrink-0">
                            {app.patientFirstName?.charAt(0)}
                            {app.patientLastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-petroleo dark:text-white">
                              {app.patientFirstName} {app.patientLastName}
                            </p>
                            <p className="text-[11px] text-zinc-400 font-medium">
                              ID: {app.patientId?.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-petroleo dark:text-zinc-200">
                          Dr(a). {app.doctorFirstName} {app.doctorLastName}
                        </p>
                        <p className="text-xs text-celeste font-semibold">
                          {app.doctorSpecialty || "Medicina General"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <Clock className="w-4 h-4 text-zinc-400" />
                          <span className="font-bold">{app.appointmentTime || "--:--"}</span>
                          <span className="text-xs text-zinc-400">
                            {app.appointmentDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300 max-w-xs truncate">
                        {app.reason || "Consulta médica"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(app.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Módulos de Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/admin/doctors" className="group">
          <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 p-5 hover:border-celeste hover:shadow-md transition-all bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-celeste flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-celeste transition-colors" />
            </div>
            <h4 className="font-black text-petroleo dark:text-white mt-4">
              Gestión de Médicos
            </h4>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Dar de alta nuevos doctores y configurar credenciales.
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/appointments" className="group">
          <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 p-5 hover:border-celeste hover:shadow-md transition-all bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h4 className="font-black text-petroleo dark:text-white mt-4">
              Control de Citas
            </h4>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Supervisar, cambiar estados y programar consultas.
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/specialties" className="group">
          <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 p-5 hover:border-celeste hover:shadow-md transition-all bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h4 className="font-black text-petroleo dark:text-white mt-4">
              Especialidades y Áreas
            </h4>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Administrar especialidades y servicios clínicos.
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/admin/audit" className="group">
          <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800 p-5 hover:border-celeste hover:shadow-md transition-all bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <h4 className="font-black text-petroleo dark:text-white mt-4">
              Auditoría y Logs
            </h4>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Trazabilidad completa de operaciones del sistema.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
