"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Search,
  Stethoscope,
  Loader2,
  ChevronRight,
  Sparkles,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBranches } from "@/modules/domain/branch/hooks/useBranches";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import { useAvailableDoctorSlots } from "@/modules/domain/appointment/hooks/useAvailableDoctorSlots";
import { useCreateAppointment } from "@/modules/domain/appointment/hooks/useAppointments";
import { usePatients } from "@/modules/domain/user/patient/hooks/usePatients";

export default function ReservationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1. Obtener detalles del Paciente
  const { data: patientData, isLoading: isLoadingPatient } = usePatients(
    userId ? { userId: String(userId), size: 1 } : {},
  );
  const patient = patientData?.data?.content?.[0];
  const patientId = patient?.id;

  // 2. Obtener sedes y especialidades dinámicas del backend
  const { data: branchesData, isLoading: isLoadingBranches } = useBranches();
  const branches = useMemo(() => {
    return branchesData?.data || [];
  }, [branchesData]);

  const { data: specialtiesData, isLoading: isLoadingSpecialties } =
    useSpecialties({
      page: 0,
      size: 100,
    });
  const specialties = useMemo(() => {
    return specialtiesData?.data?.content || [];
  }, [specialtiesData]);

  // Estados de los Filtros
  const [selectedSedeId, setSelectedSedeId] = useState<string>("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");
  const [searchParams, setSearchParams] = useState<{
    specialtyId: string;
    branchId?: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 3. Obtener slots disponibles estructurados del backend
  const { data: slotsRes, isLoading: isLoadingSlots } = useAvailableDoctorSlots(
    searchParams || { specialtyId: "" },
  );
  const availableSlots = useMemo(() => {
    return slotsRes?.data || [];
  }, [slotsRes]);

  // Estados para Selección de Doctor, Día y Hora
  const [selectedDaysByDoctor, setSelectedDaysByDoctor] = useState<
    Record<string, string>
  >({}); // doctorId -> dateStr
  const [selectedSlot, setSelectedSlot] = useState<{
    doctorId: string;
    dateStr: string;
    timeStr: string;
  } | null>(null);

  // Formulario de Reserva
  const [reason, setReason] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Mutación de creación de cita
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

  // Especialidad seleccionada para mostrar textos dinámicos
  const selectedSpecialtyName = useMemo(() => {
    return specialties.find((s) => s.id === selectedSpecialtyId)?.name || "";
  }, [specialties, selectedSpecialtyId]);

  // Doctor seleccionado para la reserva final
  const activeBookingDoctor = useMemo(() => {
    if (!selectedSlot) return null;
    return availableSlots.find((doc) => doc.doctorId === selectedSlot.doctorId);
  }, [selectedSlot, availableSlots]);

  // Manejar búsqueda
  const handleSearch = () => {
    if (!selectedSpecialtyId) return;
    setSearchParams({
      specialtyId: selectedSpecialtyId,
      branchId: (selectedSedeId === "all" || !selectedSedeId) ? undefined : selectedSedeId,
    });
    setHasSearched(true);
  };

  // Manejar selección de horario
  const handleSlotClick = (
    doctorId: string,
    dateStr: string,
    timeStr: string,
  ) => {
    setSelectedSlot({ doctorId, dateStr, timeStr });
    setIsConfirmDialogOpen(true);
    setErrorMsg("");
  };

  // Enviar reserva al backend
  const handleConfirmReservation = () => {
    if (!selectedSlot || !patientId) return;

    let formattedTime = selectedSlot.timeStr;
    if (formattedTime.split(":").length === 2) {
      formattedTime += ":00";
    }

    createAppointmentMutation.mutate({
      patientId,
      doctorId: selectedSlot.doctorId,
      appointmentDate: selectedSlot.dateStr,
      appointmentTime: formattedTime,
      reason: reason || "Consulta médica general",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Cabecera y Navegación */}
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

      {/* Buscador de Sede y Especialidad */}
      <Card className="rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 shadow-xl shadow-blue-100/10 bg-white dark:bg-zinc-950 p-8 overflow-hidden">
        <CardContent className="p-0 flex flex-col lg:flex-row items-end gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
            <div className="space-y-3">
              <Label className="font-bold text-petroleo dark:text-zinc-200">
                Sede
              </Label>
              <Select value={selectedSedeId} onValueChange={setSelectedSedeId}>
                <SelectTrigger className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 font-semibold text-zinc-700 dark:text-zinc-300">
                  <SelectValue placeholder="Selecciona una sede (Opcional)..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                  <SelectItem value="all" className="rounded-xl cursor-pointer">
                    Todas las sedes
                  </SelectItem>
                  {branches.map((sede) => (
                    <SelectItem
                      key={sede.id}
                      value={sede.id}
                      className="rounded-xl cursor-pointer"
                    >
                      {sede.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-bold text-petroleo dark:text-zinc-200">
                Especialidad
              </Label>
              <Select
                value={selectedSpecialtyId}
                onValueChange={setSelectedSpecialtyId}
              >
                <SelectTrigger className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 font-semibold text-zinc-700 dark:text-zinc-300">
                  <SelectValue placeholder="Selecciona especialidad..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                  {specialties.map((spec) => (
                    <SelectItem
                      key={spec.id}
                      value={spec.id}
                      className="rounded-xl cursor-pointer"
                    >
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!selectedSpecialtyId}
            variant="celeste"
            className="h-14 px-8 rounded-2xl font-black w-full lg:w-fit cursor-pointer shadow-lg shadow-blue-200/20 dark:shadow-none hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Search className="w-5 h-5" />
            Reservar cita
          </Button>
        </CardContent>
      </Card>

      {/* Resultados de la búsqueda */}
      {isLoadingSlots ||
      isLoadingPatient ||
      isLoadingBranches ||
      isLoadingSpecialties ? (
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
              // Obtener la fecha seleccionada activa para este doctor (por defecto la primera fecha disponible)
              const selectedDateStr =
                selectedDaysByDoctor[doc.doctorId] ||
                doc.availableDates?.[0]?.date;
              const activeDaySchedule = doc.availableDates?.find(
                (d) => d.date === selectedDateStr,
              );

              // Generar iniciales del médico
              const initials = doc.doctorName
                ? doc.doctorName
                    .replace(/Dr\./g, "")
                    .trim()
                    .split(/[\s,]+/)
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "ME";

              return (
                <Card
                  key={doc.doctorId}
                  className="rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 overflow-hidden shadow-md flex flex-col xl:flex-row gap-8 items-start relative group hover:border-celeste/30 transition-all duration-300"
                >
                  {/* Bloque Izquierdo: Datos del Médico */}
                  <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-[40%]">
                    {/* Foto de perfil */}
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-celeste/20 to-blue-50 dark:to-zinc-900/40 flex items-center justify-center text-celeste font-bold text-3xl shadow-inner shrink-0 border border-celeste/10 relative">
                      {initials}
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-xs font-extrabold text-celeste uppercase tracking-widest">
                        {doc.specialty}
                      </p>
                      <h3 className="text-xl font-black text-petroleo dark:text-white leading-snug group-hover:text-celeste transition-colors">
                        {doc.doctorName}
                      </h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
                        CMP {doc.cmp || "82144"}
                      </p>

                      <div className="inline-flex px-3 py-1.5 rounded-xl bg-celeste/10 text-celeste text-xs font-black uppercase tracking-wider">
                        {doc.modality || "Presencial"}
                      </div>

                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 space-y-1.5">
                        <p className="text-xs font-black text-petroleo dark:text-zinc-300">
                          Sede {doc.branchName}
                        </p>
                        <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-celeste shrink-0" />
                          {doc.branchAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bloque Derecho: Horarios e Interacción */}
                  <div className="flex-1 w-full space-y-6">
                    {/* Carrusel de Días */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-celeste" />
                        Selecciona el día de tu consulta:
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {doc.availableDates?.map((day) => {
                          const isSelected = selectedDateStr === day.date;
                          return (
                            <button
                              key={day.date}
                              type="button"
                              onClick={() =>
                                setSelectedDaysByDoctor((prev) => ({
                                  ...prev,
                                  [doc.doctorId]: day.date,
                                }))
                              }
                              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl min-w-[85px] border cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "bg-celeste text-white border-celeste shadow-md shadow-blue-200/20"
                                  : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                              }`}
                            >
                              <span
                                className={`text-xs font-extrabold ${isSelected ? "text-white/80" : "text-zinc-400"}`}
                              >
                                {day.dayLabel}
                              </span>
                              <span className="text-sm font-black mt-1">
                                {day.dateLabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chips de Horas */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                        Horas disponibles para el día elegido:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {activeDaySchedule?.slots.map((slot) => {
                          return (
                            <button
                              key={slot.slotId}
                              type="button"
                              onClick={() =>
                                handleSlotClick(
                                  doc.doctorId,
                                  selectedDateStr,
                                  slot.time,
                                )
                              }
                              className="py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-celeste bg-white dark:bg-zinc-900 hover:bg-celeste/5 text-xs font-black text-zinc-700 dark:text-zinc-300 hover:text-celeste cursor-pointer text-center transition-all shadow-sm"
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Diálogo Modal de Confirmación de Reserva */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight">
              Confirmar reserva
            </DialogTitle>
            <DialogDescription className="text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
              Completa los detalles de tu cita a continuación. Al confirmar se
              registrará en el sistema.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-shake">
              {errorMsg}
            </div>
          )}

          {selectedSlot && activeBookingDoctor && (
            <div className="space-y-6 pt-4">
              {/* Tarjeta Resumen */}
              <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 space-y-4">
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-celeste shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                      Especialista
                    </p>
                    <p className="text-sm font-extrabold text-petroleo dark:text-zinc-200">
                      {activeBookingDoctor.doctorName}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {activeBookingDoctor.specialty}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                  <div>
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                      Sede
                    </p>
                    <p className="text-xs font-bold text-petroleo dark:text-zinc-200">
                      {activeBookingDoctor.branchName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                      Fecha y Hora
                    </p>
                    <p className="text-xs font-bold text-petroleo dark:text-zinc-200">
                      {selectedSlot.dateStr} a las {selectedSlot.timeStr}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campo para Motivo */}
              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="font-bold text-petroleo dark:text-zinc-300"
                >
                  Motivo de la consulta{" "}
                  <span className="text-zinc-400 font-medium">(Opcional)</span>
                </Label>
                <textarea
                  id="reason"
                  placeholder="Ej: Control de rutina, dolor persistente, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste h-24 text-sm p-4 outline-none focus:ring-2 focus:ring-celeste"
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-6 gap-3 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsConfirmDialogOpen(false)}
              className="rounded-xl font-bold text-zinc-500 h-12 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReservation}
              disabled={createAppointmentMutation.isPending}
              variant="celeste"
              className="rounded-xl font-black h-12 cursor-pointer shadow-md flex items-center justify-center gap-2 min-w-[150px]"
            >
              {createAppointmentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {createAppointmentMutation.isPending
                ? "Agendando..."
                : "Confirmar Reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
