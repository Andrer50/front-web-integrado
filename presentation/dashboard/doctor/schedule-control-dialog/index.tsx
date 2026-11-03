"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  CalendarCheck,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useDoctorSlots } from "@/modules/domain/appointment/hooks/useDoctorSlots";
import { useCreateAppointment } from "@/modules/domain/appointment/hooks/useAppointments";
import { DoctorScheduleSlotResponse } from "@/core/appointment/interfaces";

interface ScheduleControlDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
  doctorName?: string;
  patientId: string;
  patientName?: string;
}

export function ScheduleControlDialog({
  isOpen,
  onOpenChange,
  doctorId,
  doctorName,
  patientId,
  patientName,
}: ScheduleControlDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] =
    useState<DoctorScheduleSlotResponse | null>(null);
  const [controlReason, setControlReason] = useState(
    "Control y seguimiento de consulta médica",
  );

  // Consulta de slots del médico
  const { data: slotsRes, isLoading: isLoadingSlots } =
    useDoctorSlots(doctorId);

  // Filtrar slots disponibles desde hoy hacia adelante
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const availableSlots = useMemo(() => {
    const list = slotsRes?.data || [];
    return list.filter(
      (slot) => slot.status === "AVAILABLE" && slot.slotDate >= todayStr,
    );
  }, [slotsRes, todayStr]);

  // Agrupar slots por fecha
  const datesGrouped = useMemo(() => {
    const map = new Map<string, DoctorScheduleSlotResponse[]>();
    availableSlots.forEach((slot) => {
      const existing = map.get(slot.slotDate) || [];
      existing.push(slot);
      map.set(slot.slotDate, existing);
    });

    const entries = Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    // Ordenar los slots dentro de cada fecha por hora de inicio
    entries.forEach(([, slots]) => {
      slots.sort((s1, s2) => s1.startTime.localeCompare(s2.startTime));
    });

    return entries;
  }, [availableSlots]);

  // Fecha seleccionada por defecto si no hay una elegida
  const activeDate = useMemo(() => {
    if (selectedDate && datesGrouped.some(([d]) => d === selectedDate)) {
      return selectedDate;
    }
    return datesGrouped.length > 0 ? datesGrouped[0][0] : "";
  }, [selectedDate, datesGrouped]);

  const activeSlots = useMemo(() => {
    if (!activeDate) return [];
    const found = datesGrouped.find(([d]) => d === activeDate);
    return found ? found[1] : [];
  }, [activeDate, datesGrouped]);

  // Mutación para agendar la cita de control
  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      toast.success(
        `Cita de control agendada para el ${selectedSlot?.slotDate} a las ${selectedSlot?.startTime}`,
      );
      setSelectedSlot(null);
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(
        err.message || "Ocurrió un error al agendar la cita de control.",
      );
    },
  });

  const handleConfirm = () => {
    if (!selectedSlot) {
      toast.error("Por favor selecciona un horario para el control.");
      return;
    }
    if (!controlReason.trim()) {
      toast.error("Por favor ingresa el motivo del control.");
      return;
    }

    createAppointmentMutation.mutate({
      slotId: selectedSlot.id,
      patientId: patientId,
      reason: controlReason.trim(),
    });
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950">
        {/* Header con gradiente clínico */}
        <div className="bg-petroleo p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-celeste/15 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/20">
              <CalendarCheck className="w-6 h-6 text-celeste" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">
                Programar Cita de Control
              </DialogTitle>
              <DialogDescription className="text-white/70 text-xs font-medium mt-1">
                Agenda una consulta de seguimiento para el paciente evaluado.
              </DialogDescription>
            </div>
          </div>

          {/* Tarjeta de Resumen del Paciente */}
          <div className="mt-5 p-3.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/15 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-celeste" />
              <span>Paciente: <strong className="text-white font-bold">{patientName || "Paciente"}</strong></span>
            </div>
            {doctorName && (
              <span className="text-white/80">Dr(a). {doctorName}</span>
            )}
          </div>
        </div>

        {/* Contenido / Selector de Fecha y Horas */}
        <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {isLoadingSlots ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner className="w-10 h-10 text-celeste" />
              <p className="text-sm font-bold text-zinc-500">
                Consultando disponibilidad de agenda...
              </p>
            </div>
          ) : datesGrouped.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
              <h4 className="font-bold text-base text-petroleo dark:text-white">
                Sin horarios disponibles
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                No se encontraron turnos libres configurados en la agenda del médico para los próximos días.
              </p>
            </div>
          ) : (
            <>
              {/* Selector de Fechas (Pestañas horizontales) */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-celeste" />
                  1. Selecciona la Fecha del Control
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {datesGrouped.map(([dateStr, slots]) => {
                    const isSelected = activeDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedSlot(null);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer flex flex-col items-center min-w-[90px] border ${isSelected
                            ? "bg-petroleo dark:bg-celeste text-white border-petroleo dark:border-celeste shadow-sm scale-105"
                            : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-celeste"
                          }`}
                      >
                        <span className="capitalize">{formatDateLabel(dateStr)}</span>
                        <span className="text-[10px] font-bold opacity-80 mt-0.5">
                          {slots.length} turnos
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Turnos / Horarios */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-celeste" />
                  2. Horarios Disponibles ({activeSlots.length})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {activeSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center justify-center ${isSelected
                            ? "bg-celeste text-white border-celeste shadow-md ring-2 ring-celeste/20"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-petroleo dark:text-zinc-200 hover:border-celeste hover:bg-blue-50/40"
                          }`}
                      >
                        <span className="text-sm">{slot.startTime}</span>
                        <span className="text-[10px] font-medium opacity-80 mt-0.5">
                          hasta {slot.endTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalle del Slot Seleccionado */}
              {selectedSlot && (
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs text-petroleo dark:text-zinc-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-celeste shrink-0" />
                    <div>
                      <p className="font-black text-sm">
                        {formatDateLabel(selectedSlot.slotDate)} • {selectedSlot.startTime} a {selectedSlot.endTime}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-celeste" />
                        {selectedSlot.branchName || "Sede Principal"} — Consultorio {selectedSlot.consultingRoomNumber || "101"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Motivo o Indicación del Control */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-celeste" />
                  3. Indicaciones / Motivo del Control
                </label>
                <Input
                  value={controlReason}
                  onChange={(e) => setControlReason(e.target.value)}
                  placeholder="Ej. Control de evolución, revisión de exámenes de laboratorio..."
                  className="rounded-xl h-11 text-xs font-medium bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer con Acciones Claras */}
        <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="celeste"
            onClick={handleConfirm}
            disabled={!selectedSlot || createAppointmentMutation.isPending}
            className="rounded-xl font-bold px-6 shadow-md cursor-pointer gap-2"
          >
            {createAppointmentMutation.isPending ? (
              <Spinner className="w-4 h-4 text-white" />
            ) : (
              <CalendarCheck className="w-4 h-4" />
            )}
            Confirmar Cita de Control
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

