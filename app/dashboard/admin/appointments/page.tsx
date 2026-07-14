"use client";

import { useState } from "react";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import { useChangeAppointmentStatus } from "@/modules/domain/appointment/hooks/useChangeAppointmentStatus";
import { CreateAppointmentDialog } from "@/presentation/dashboard/admin/appointments/create-appointment-dialog";
import { ViewConsultationDialog } from "@/presentation/dashboard/admin/appointments/view-consultation-dialog";
import { AppointmentStatsCard } from "@/presentation/dashboard/admin/appointments/appointment-stats-card";
import { AppointmentTable } from "@/presentation/dashboard/admin/appointments/appointment-table";
import { ConfirmStatusDialog } from "@/presentation/dashboard/admin/appointments/confirm-status-dialog";
import type { ConfirmAction } from "@/presentation/dashboard/admin/appointments/appointment-table";

export default function AdminAppointmentsPage() {
  const [tab, setTab] = useState<"ALL" | "PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const size = 10;
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const { data, isLoading } = useAppointments({
    status: tab === "PENDING" ? "PENDING" : undefined,
    page,
    size,
    sort: "createdAt,desc",
  });

  const {
    mutate: changeStatus,
    isPending: isChanging,
    variables,
  } = useChangeAppointmentStatus();

  const appointments = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;
  const totalElements = data?.data?.totalElements || 0;

  const filtered = appointments.filter((app) => {
    if (!searchQuery) return true;
    const patient = `${app.patientFirstName} ${app.patientLastName}`.toLowerCase();
    const doctor = `${app.doctorFirstName} ${app.doctorLastName}`.toLowerCase();
    return (
      patient.includes(searchQuery.toLowerCase()) ||
      doctor.includes(searchQuery.toLowerCase())
    );
  });

  const totalPending = appointments.filter((a) => a.status === "PENDING").length;
  const totalConfirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const totalCancelled = appointments.filter((a) => a.status === "CANCELLED").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
        <CreateAppointmentDialog onSuccess={() => setPage(0)} />
      </div>

      <AppointmentStatsCard
        totalElements={totalElements}
        totalPending={totalPending}
        totalConfirmed={totalConfirmed}
        totalCancelled={totalCancelled}
      />

      <AppointmentTable
        appointments={filtered}
        isLoading={isLoading}
        tab={tab}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        searchQuery={searchQuery}
        isChanging={isChanging}
        changingAppointmentId={variables?.appointmentId}
        onTabChange={(t) => { setTab(t); setPage(0); }}
        onSearchChange={setSearchQuery}
        onPageChange={setPage}
        onViewConsultation={(id) => { setSelectedAppointmentId(id); setIsViewOpen(true); }}
        onConfirmAction={setConfirmAction}
      />

      {selectedAppointmentId && (
        <ViewConsultationDialog
          appointmentId={selectedAppointmentId}
          isOpen={isViewOpen}
          onOpenChange={setIsViewOpen}
        />
      )}

      <ConfirmStatusDialog
        confirmAction={confirmAction}
        isChanging={isChanging}
        onConfirm={(appointmentId, status) => changeStatus({ appointmentId, status })}
        onClose={() => setConfirmAction(null)}
      />
    </div>
  );
}