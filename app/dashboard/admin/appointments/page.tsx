"use client";

import { 
  CalendarDays, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import { type AppointmentResponse } from "@/core/appointment/interfaces";
import { Spinner } from "@/components/ui/spinner";

export default function AdminAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "today" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const size = 10;

  // 1. Fetch appointments for the current tab
  const { data: allAppointmentsResponse, isLoading: isLoadingAll } = useAppointments({
    page,
    size,
  });

  const { data: pendingAppointmentsResponse, isLoading: isLoadingPending } = useAppointments({
    status: "PENDING",
    page,
    size,
  });

  // Fetch a larger list for today's client-side date filter (the backend doesn't support date filters)
  const { data: allAppointmentsLargeResponse, isLoading: isLoadingLarge } = useAppointments({
    page: 0,
    size: 1000,
  });

  // 2. Fetch parallel counts for stats cards
  const { data: pendingStats } = useAppointments({ status: "PENDING", page: 0, size: 1 });
  const { data: confirmedStats } = useAppointments({ status: "CONFIRMED", page: 0, size: 1 });
  const { data: cancelledStats } = useAppointments({ status: "CANCELLED", page: 0, size: 1 });

  const pendingCount = pendingStats?.data?.totalElements ?? 0;
  const confirmedCount = confirmedStats?.data?.totalElements ?? 0;
  const cancelledCount = cancelledStats?.data?.totalElements ?? 0;

  // Local date handling (YYYY-MM-DD)
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - offset * 60 * 1000);
  const todayString = localToday.toISOString().split("T")[0];

  const largeList = allAppointmentsLargeResponse?.data?.content || [];
  const todayAppointments = largeList.filter((app) => app.appointmentDate === todayString);
  const totalCitasHoy = todayAppointments.length;

  // Helper filters
  const filterBySearch = (list: AppointmentResponse[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((app) => {
      const patientName = `${app.patientFirstName || ""} ${app.patientLastName || ""}`.toLowerCase();
      const doctorName = `${app.doctorFirstName || ""} ${app.doctorLastName || ""}`.toLowerCase();
      const specialty = (app.doctorSpecialty || "").toLowerCase();
      const reason = (app.reason || "").toLowerCase();
      const id = (app.id || "").toLowerCase();
      return (
        patientName.includes(q) ||
        doctorName.includes(q) ||
        specialty.includes(q) ||
        reason.includes(q) ||
        id.includes(q)
      );
    });
  };

  // Determine contents based on tab
  let rawContent: AppointmentResponse[] = [];
  let totalElements = 0;
  let totalPages = 0;

  if (activeTab === "all") {
    rawContent = allAppointmentsResponse?.data?.content || [];
    totalElements = allAppointmentsResponse?.data?.totalElements || 0;
    totalPages = allAppointmentsResponse?.data?.totalPages || 0;
  } else if (activeTab === "pending") {
    rawContent = pendingAppointmentsResponse?.data?.content || [];
    totalElements = pendingAppointmentsResponse?.data?.totalElements || 0;
    totalPages = pendingAppointmentsResponse?.data?.totalPages || 0;
  } else {
    // Today tab: client-side pagination
    const filteredToday = filterBySearch(todayAppointments);
    totalElements = filteredToday.length;
    totalPages = Math.ceil(totalElements / size);
    rawContent = filteredToday.slice(page * size, (page + 1) * size);
  }

  // Filter server-returned lists client-side for search queries
  const displayedAppointments = activeTab === "today" ? rawContent : filterBySearch(rawContent);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400";
      case "COMPLETED":
        return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      case "CANCELLED":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-100";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "CONFIRMADA";
      case "PENDING":
        return "PENDIENTE";
      case "COMPLETED":
        return "COMPLETADA";
      case "CANCELLED":
        return "CANCELADA";
      default:
        return status;
    }
  };

  const formatDateEs = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTimeEs = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    const paddedMinutes = minutes.padStart(2, "0");
    return `${formattedHours}:${paddedMinutes} ${ampm}`;
  };

  const isLoading =
    activeTab === "all"
      ? isLoadingAll
      : activeTab === "pending"
      ? isLoadingPending
      : isLoadingLarge;

  const startItem = totalElements > 0 ? page * size + 1 : 0;
  const endItem = Math.min((page + 1) * size, totalElements);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-petroleo dark:text-white mb-2 uppercase tracking-widest">
            Administración Clínica
          </p>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Gestión de Citas Médicas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Supervisa, programa y gestiona todas las consultas médicas del sistema.
          </p>
        </div>
        <Button variant="celeste" className="rounded-xl px-6 py-6 font-bold shadow-sm transition-all flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Programar Nueva Cita
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Citas Hoy", value: totalCitasHoy.toString(), icon: CalendarDays, color: "text-celeste", bg: "bg-blue-50" },
          { title: "Pendientes", value: pendingCount.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { title: "Confirmadas", value: confirmedCount.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
          { title: "Canceladas", value: cancelledCount.toString(), icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-zinc-800 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-2xl font-bold text-petroleo dark:text-white leading-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Table */}
        <div className="lg:col-span-12">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as "all" | "today" | "pending");
              setPage(0);
            }}
            className="w-full space-y-6"
          >
            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <TabsList className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 h-auto">
                  <TabsTrigger
                    value="all"
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Todas las Citas
                  </TabsTrigger>
                  <TabsTrigger
                    value="today"
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Hoy
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Pendientes
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Buscar por paciente o médico..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                    startContent={
                      <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                    }
                    className="h-auto py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus-visible:ring-celeste w-64 lg:w-80 font-medium"
                  />
                  <Button variant="outline" className="rounded-xl flex items-center gap-2 font-bold text-xs border-zinc-200">
                    <Filter className="w-4 h-4" />
                    Filtros Avanzados
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <TabsContent value={activeTab} className="mt-0 border-none p-0 outline-none">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">ID / Tipo</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Paciente</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Médico Especialista</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Fecha y Hora</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Estado</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="py-20 text-center">
                              <div className="flex flex-col items-center justify-center gap-4">
                                <Spinner className="w-10 h-10 text-celeste" />
                                <p className="text-zinc-500 font-bold text-sm">Cargando citas médicas...</p>
                              </div>
                            </td>
                          </tr>
                        ) : displayedAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-20 text-center">
                              <div className="flex flex-col items-center justify-center gap-4">
                                <AlertCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                                <h3 className="font-bold text-lg text-petroleo dark:text-white">No se encontraron citas</h3>
                                <p className="text-zinc-400 text-sm mt-1 max-w-sm">
                                  {searchQuery ? "Prueba a cambiar los términos de búsqueda." : "No hay citas registradas en esta categoría."}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          displayedAppointments.map((app) => {
                            const isVirtual =
                              app.reason?.toLowerCase().includes("virtual") ||
                              app.reason?.toLowerCase().includes("online");
                            const typeLabel = isVirtual ? "Virtual" : "Presencial";

                            return (
                              <tr key={app.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="px-8 py-6">
                                  <div className="space-y-1">
                                    <p className="text-sm font-bold text-petroleo dark:text-white truncate max-w-[120px]" title={app.id}>
                                      {app.id.substring(0, 8)}...
                                    </p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{typeLabel}</p>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blanco-azulado flex items-center justify-center text-celeste border border-zinc-100 dark:border-zinc-700 shrink-0">
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
                                    <p className="text-[11px] font-bold text-verde-salud uppercase tracking-wide">{app.doctorSpecialty}</p>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="space-y-1">
                                    <p className="text-sm font-bold text-petroleo dark:text-white">{formatDateEs(app.appointmentDate)}</p>
                                    <p className="text-xs text-zinc-500 font-medium">{formatTimeEs(app.appointmentTime)}</p>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${getStatusStyle(app.status)}`}>
                                    {translateStatus(app.status)}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-petroleo rounded-xl">
                                    <MoreVertical className="w-5 h-5" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </CardContent>

              {totalPages > 1 && (
                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm font-bold text-zinc-400">
                    Mostrando <span className="text-petroleo dark:text-white">{startItem} a {endItem}</span> de {totalElements} citas registradas
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      if (totalPages > 5 && Math.abs(idx - page) > 1 && idx !== 0 && idx !== totalPages - 1) {
                        if (idx === 1 || idx === totalPages - 2) {
                          return <span key={idx} className="px-1 text-zinc-400 font-bold">...</span>;
                        }
                        return null;
                      }
                      return (
                        <Button
                          key={idx}
                          variant={idx === page ? "celeste" : "ghost"}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition-all p-0`}
                          onClick={() => setPage(idx)}
                        >
                          {idx + 1}
                        </Button>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
