"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  FileText,
  User as UserIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import { useChangeAppointmentStatus } from "@/modules/domain/appointment/hooks/useChangeAppointmentStatus"; // ← nuevo
import { ViewConsultationDialog } from "@/presentation/dashboard/admin/appointments/view-consultation-dialog";
import { type AppointmentResponse } from "@/core/appointment/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AppointmentListProps {
  patientId: string;
}

export function AppointmentList({ patientId }: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // ← nuevo: hook de cancelación
  const {
    mutate: changeStatus,
    isPending: isCancelling,
    variables,
  } = useChangeAppointmentStatus();

  const { data: upcomingAppointmentsData, isLoading: isLoadingUpcoming } =
    useAppointments({
      patientId,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      page: upcomingPage,
      size: 5,
    });

  const { data: historyAppointmentsData, isLoading: isLoadingHistory } =
    useAppointments({
      patientId,
      status: "COMPLETED",
      page: historyPage,
      size: 5,
    });

  const upcomingList = upcomingAppointmentsData?.data?.content || [];
  const historyList = historyAppointmentsData?.data?.content || [];
  const upcomingTotalPages = upcomingAppointmentsData?.data?.totalPages || 0;
  const historyTotalPages = historyAppointmentsData?.data?.totalPages || 0;

  const filterByQuery = (list: AppointmentResponse[]) => {
    if (!searchQuery) return list;
    return list.filter((app) => {
      const docName =
        `${app.doctorFirstName} ${app.doctorLastName}`.toLowerCase();
      const spec = (app.doctorSpecialty || "").toLowerCase();
      return (
        docName.includes(searchQuery.toLowerCase()) ||
        spec.includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredUpcoming = filterByQuery(upcomingList);
  const filteredHistory = filterByQuery(historyList);

  return (
    <Tabs
      defaultValue="upcoming"
      onValueChange={(val) => setActiveTab(val as "upcoming" | "history")}
      className="w-full space-y-8"
    >
      <TabsList className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 w-full justify-start rounded-none h-auto p-0 gap-8">
        <TabsTrigger
          value="upcoming"
          className="border-0 border-b-2 border-transparent data-[state=active]:border-b-celeste data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-celeste bg-transparent rounded-none px-4 py-4 text-sm font-bold text-zinc-400 transition-all cursor-pointer"
        >
          Próximas citas
          <span className="ml-2 px-2 py-0.5 bg-blanco-azulado text-celeste rounded-full text-[10px]">
            {upcomingList.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="border-0 border-b-2 border-transparent data-[state=active]:border-b-celeste data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-celeste bg-transparent rounded-none px-4 py-4 text-sm font-bold text-zinc-400 transition-all cursor-pointer"
        >
          Historial de citas
        </TabsTrigger>
      </TabsList>

      {/* Próximas citas */}
      <TabsContent
        value="upcoming"
        className="space-y-6 mt-0 border-none p-0 outline-none"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Buscar por médico o especialidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={
              <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
            }
            className="h-auto py-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl focus-visible:ring-celeste font-medium"
          />
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="h-12 px-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold text-zinc-600 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-celeste focus:border-transparent transition-all cursor-pointer min-w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
              <SelectItem
                value="ALL"
                className="rounded-xl focus:bg-celeste/10 focus:text-celeste cursor-pointer"
              >
                Todos los estados
              </SelectItem>
              <SelectItem
                value="PENDING"
                className="rounded-xl focus:bg-celeste/10 focus:text-celeste cursor-pointer"
              >
                Pendientes
              </SelectItem>
              <SelectItem
                value="CONFIRMED"
                className="rounded-xl focus:bg-celeste/10 focus:text-celeste cursor-pointer"
              >
                Confirmadas
              </SelectItem>
              <SelectItem
                value="CANCELLED"
                className="rounded-xl focus:bg-celeste/10 focus:text-celeste cursor-pointer"
              >
                Canceladas
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoadingUpcoming ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner className="w-10 h-10 text-celeste" />
            <p className="text-zinc-500 font-bold text-sm">
              Cargando tus citas programadas...
            </p>
          </div>
        ) : filteredUpcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
            <Calendar className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="font-bold text-lg text-petroleo dark:text-white">
              No tienes citas programadas
            </h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-sm text-center">
              Agenda una consulta médica con uno de nuestros especialistas
              calificados presionando el botón &quot;Nueva Cita&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUpcoming.map((app) => {
              const isCancellingThis =
                isCancelling && variables?.appointmentId === app.id;

              return (
                <Card
                  key={app.id}
                  className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                >
                  <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Doctor Info */}
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
                        <p className="text-[10px] text-zinc-400 mt-1.5 font-bold uppercase tracking-wider">
                          CMP: {app.doctorMedicalLicenseNumber}
                        </p>
                      </div>
                    </div>

                    {/* Appointment Details */}
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

                    {/* Actions & Status */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end shrink-0 pl-0 lg:pl-4">
                      <span
                        className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest border ${
                          app.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : app.status === "PENDING"
                              ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                              : "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
                        }`}
                      >
                        {app.status === "CONFIRMED"
                          ? "CONFIRMADA"
                          : app.status === "PENDING"
                            ? "PENDIENTE"
                            : "CANCELADA"}
                      </span>

                      {/* ← botón cancelar: solo si está PENDING */}
                      {app.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isCancellingThis}
                          onClick={() =>
                            changeStatus({
                              appointmentId: app.id,
                              status: "CANCELLED",
                            })
                          }
                          className="rounded-xl font-bold text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-950/20 cursor-pointer transition-all"
                        >
                          {isCancellingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" /> Cancelar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {upcomingTotalPages > 1 && (
              <div className="pt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (upcomingPage > 0)
                            setUpcomingPage(upcomingPage - 1);
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: upcomingTotalPages }).map(
                      (_, idx) => (
                        <PaginationItem key={idx}>
                          <PaginationLink
                            href="#"
                            isActive={idx === upcomingPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setUpcomingPage(idx);
                            }}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (upcomingPage < upcomingTotalPages - 1)
                            setUpcomingPage(upcomingPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </TabsContent>

      {/* Historial */}
      <TabsContent
        value="history"
        className="space-y-6 mt-0 border-none p-0 outline-none"
      >
        {isLoadingHistory ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner className="w-10 h-10 text-celeste" />
            <p className="text-zinc-500 font-bold text-sm">
              Cargando historial de citas...
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
            <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="font-bold text-lg text-petroleo dark:text-white">
              No tienes citas pasadas
            </h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-sm text-center">
              Una vez que completes o canceles citas, aparecerán en esta
              sección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredHistory.map((app) => (
              <Card
                key={app.id}
                className="rounded-[3rem] border-zinc-100 dark:border-zinc-800 shadow-sm group overflow-hidden"
              >
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
                        {app.status === "COMPLETED"
                          ? "COMPLETADA"
                          : "CANCELADA"}
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

                    {app.status === "COMPLETED" && (
                      <Button
                        onClick={() => {
                          setSelectedAppointmentId(app.id);
                          setIsViewOpen(true);
                        }}
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
            ))}

            {historyTotalPages > 1 && (
              <div className="pt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (historyPage > 0) setHistoryPage(historyPage - 1);
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: historyTotalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          isActive={idx === historyPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setHistoryPage(idx);
                          }}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (historyPage < historyTotalPages - 1)
                            setHistoryPage(historyPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </TabsContent>

      {selectedAppointmentId && (
        <ViewConsultationDialog
          appointmentId={selectedAppointmentId}
          isOpen={isViewOpen}
          onOpenChange={setIsViewOpen}
        />
      )}
    </Tabs>
  );
}
