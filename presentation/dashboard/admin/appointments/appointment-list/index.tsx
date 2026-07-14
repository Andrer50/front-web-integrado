"use client";

import { useState } from "react";
import { Calendar, Search, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import { useChangeAppointmentStatus } from "@/modules/domain/appointment/hooks/useChangeAppointmentStatus";
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
import { AppointmentCard } from "@/presentation/dashboard/admin/appointments/appointment-card";
import { CancelAppointmentDialog } from "@/presentation/dashboard/admin/appointments/cancel-appointment-dialog";

interface AppointmentListProps {
  patientId: string;
}

export function AppointmentList({ patientId }: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const {
    mutate: changeStatus,
    isPending: isCancelling,
  } = useChangeAppointmentStatus();

  const { data: upcomingAppointmentsData, isLoading: isLoadingUpcoming } =
    useAppointments({
      patientId,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      page: upcomingPage,
      size: 5,
      sort: "createdAt,desc",
    });

  const { data: historyAppointmentsData, isLoading: isLoadingHistory } =
    useAppointments({
      patientId,
      status: "COMPLETED",
      page: historyPage,
      size: 5,
      sort: "createdAt,desc",
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

  const handleCancelConfirm = () => {
    if (appointmentToCancel) {
      changeStatus({
        appointmentId: appointmentToCancel,
        status: "CANCELLED",
      });
      setAppointmentToCancel(null);
    }
  };

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
            {filteredUpcoming.map((app) => (
              <AppointmentCard
                key={app.id}
                app={app}
                variant="upcoming"
                onCancel={setAppointmentToCancel}
              />
            ))}

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
              <AppointmentCard
                key={app.id}
                app={app}
                variant="history"
                onViewConsultation={(id) => {
                  setSelectedAppointmentId(id);
                  setIsViewOpen(true);
                }}
              />
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

      <CancelAppointmentDialog
        appointmentToCancel={appointmentToCancel}
        isCancelling={isCancelling}
        onConfirm={handleCancelConfirm}
        onClose={() => setAppointmentToCancel(null)}
      />
    </Tabs>
  );
}