"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBranches } from "@/modules/domain/branch/hooks/useBranches";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import { useAvailableDoctorSlots } from "@/modules/domain/appointment/hooks/useAvailableDoctorSlots";
import { useCreateAppointment } from "@/modules/domain/appointment/hooks/useAppointments";
import { ReservationFilters } from "@/presentation/dashboard/patient/appointments/reservation-filters";
import { DoctorSlotCard } from "@/presentation/dashboard/patient/appointments/doctor-slot-card";
import { ReservationConfirmDialog } from "@/presentation/dashboard/patient/appointments/reservation-confirm-dialog";

export default function ReservationPage() {
  const router = useRouter();

  const { data: branchesData, isLoading: isLoadingBranches } = useBranches();
  const branches = useMemo(() => branchesData?.data || [], [branchesData]);

  const { data: specialtiesData, isLoading: isLoadingSpecialties } =
    useSpecialties({ page: 0, size: 100 });
  const specialties = useMemo(
    () => specialtiesData?.data?.content || [],
    [specialtiesData],
  );

  const [selectedSedeId, setSelectedSedeId] = useState<string>("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");
  const [searchParams, setSearchParams] = useState<{
    specialtyId: string;
    branchId?: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: slotsRes, isLoading: isLoadingSlots } = useAvailableDoctorSlots(
    searchParams || { specialtyId: "" },
  );
  const availableSlots = useMemo(() => slotsRes?.data || [], [slotsRes]);

  const [selectedDaysByDoctor, setSelectedDaysByDoctor] = useState<
    Record<string, string>
  >({});
  const [selectedSlot, setSelectedSlot] = useState<{
    slotId: string;
    doctorId: string;
    dateStr: string;
    timeStr: string;
  } | null>(null);

  const [reason, setReason] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      setIsConfirmDialogOpen(false);
      setSelectedSlot(null);
      setReason("");
      router.push("/dashboard/patient/my-appointments");
    },
    onError: (err: Error) => {
      setErrorMsg(
        err.message ||
          "Ocurrió un error al agendar la cita. Por favor intenta de nuevo.",
      );
    },
  });

  const selectedSpecialtyName = useMemo(
    () => specialties.find((s) => s.id === selectedSpecialtyId)?.name || "",
    [specialties, selectedSpecialtyId],
  );

  const activeBookingDoctor = useMemo(() => {
    if (!selectedSlot) return null;
    return availableSlots.find((doc) => doc.doctorId === selectedSlot.doctorId);
  }, [selectedSlot, availableSlots]);

  const handleSearch = () => {
    if (!selectedSpecialtyId) return;
    setSearchParams({
      specialtyId: selectedSpecialtyId,
      branchId:
        selectedSedeId === "all" || !selectedSedeId
          ? undefined
          : selectedSedeId,
    });
    setHasSearched(true);
  };

  const handleSlotClick = (
    doctorId: string,
    dateStr: string,
    timeStr: string,
    slotId: string,
  ) => {
    setSelectedSlot({ slotId, doctorId, dateStr, timeStr });
    setIsConfirmDialogOpen(true);
    setErrorMsg("");
  };

  const handleConfirmReservation = () => {
    if (!selectedSlot) return;

    if (!reason.trim() || reason.trim().length < 5) {
      setErrorMsg(
        "El motivo de la consulta es obligatorio (mínimo 5 caracteres).",
      );
      return;
    }

    createAppointmentMutation.mutate({
      slotId: selectedSlot.slotId,
      reason: reason.trim(),
    });
  };

  const isGlobalLoading =
    isLoadingSlots || isLoadingBranches || isLoadingSpecialties;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-xl text-zinc-400 hover:text-petroleo transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">
            <span>Inicio</span>
            <ChevronRight className="w-3 h-3" />
            <span>Mis citas</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-petroleo">Reservar cita</span>
          </nav>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
            Reservar nueva cita
          </h1>
        </div>
      </div>

      <ReservationFilters
        branches={branches}
        specialties={specialties}
        selectedSedeId={selectedSedeId}
        selectedSpecialtyId={selectedSpecialtyId}
        onSedeChange={setSelectedSedeId}
        onSpecialtyChange={setSelectedSpecialtyId}
        onSearch={handleSearch}
      />

      {isGlobalLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner className="w-10 h-10 text-celeste" />
          <p className="text-zinc-500 font-bold text-sm">
            Cargando médicos y horarios...
          </p>
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-col items-center justify-center py-16 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <div className="w-16 h-16 bg-celeste/10 rounded-3xl flex items-center justify-center text-celeste mb-6 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-xl text-petroleo dark:text-white">
            Encuentra a tu médico especialista
          </h3>
          <p className="text-zinc-400 text-sm mt-2 max-w-sm font-medium leading-relaxed">
            Selecciona la sede de tu preferencia y la especialidad médica para
            listar los horarios disponibles de nuestros doctores en tiempo real.
          </p>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <h3 className="font-extrabold text-xl text-petroleo dark:text-white">
            No se encontraron médicos
          </h3>
          <p className="text-zinc-400 text-sm mt-2 max-w-sm font-medium leading-relaxed">
            Lo sentimos, en este momento no hay médicos programados para la
            especialidad de <strong>{selectedSpecialtyName}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-2 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-xl font-extrabold text-petroleo dark:text-white tracking-tight">
              Médicos especialistas disponibles ({availableSlots.length})
            </h2>
          </div>

          <div className="space-y-8">
            {availableSlots.map((doc) => {
              const selectedDateStr =
                selectedDaysByDoctor[doc.doctorId] ||
                doc.availableDates?.[0]?.date;

              return (
                <DoctorSlotCard
                  key={doc.doctorId}
                  doctor={doc}
                  selectedDateStr={selectedDateStr}
                  onDaySelect={(doctorId, date) =>
                    setSelectedDaysByDoctor((prev) => ({
                      ...prev,
                      [doctorId]: date,
                    }))
                  }
                  onSlotClick={handleSlotClick}
                />
              );
            })}
          </div>
        </div>
      )}

      <ReservationConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedSlot={selectedSlot}
        activeBookingDoctor={activeBookingDoctor}
        reason={reason}
        onReasonChange={setReason}
        errorMsg={errorMsg}
        onClearError={() => setErrorMsg("")}
        isPending={createAppointmentMutation.isPending}
        onConfirm={handleConfirmReservation}
      />
    </div>
  );
}