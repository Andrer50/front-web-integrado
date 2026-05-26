"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Loader2,
  Stethoscope,
  Info,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useBranches } from "@/modules/domain/branch/hooks/useBranches";
import { useConsultingRooms } from "@/modules/domain/branch/hooks/useConsultingRooms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDoctorSlots } from "@/modules/domain/appointment/hooks/useDoctorSlots";
import { useDoctor } from "@/modules/domain/doctor/hooks/useDoctor";
import {
  useWeeklySchedule,
  useUpdateWeeklySchedule,
} from "@/modules/domain/appointment/hooks/useWeeklySchedule";
import {
  useDoctorOffDays,
  useCreateOffDay,
  useDeleteOffDay,
} from "@/modules/domain/appointment/hooks/useDoctorOffDays";
import {
  DoctorScheduleRequest,
  DoctorScheduleResponse,
} from "@/core/appointment/interfaces";

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const SLOT_DURATIONS = [
  { value: "15", label: "15 minutos (Recomendado)" },
  { value: "20", label: "20 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "60 minutos (Turno Largo)" },
];

export default function DoctorSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  // Local state for weekly configurations list
  const [localConfigs, setLocalConfigs] = useState<DoctorScheduleRequest[]>([]);
  const [prevConfigsData, setPrevConfigsData] = useState<
    DoctorScheduleResponse[] | null
  >(null);

  // Weekly Config Form state
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState(15);

  // Off Days Form state
  const [offDate, setOffDate] = useState("");
  const [offReason, setOffReason] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Queries
  const { data: doctorRes, isLoading: isLoadingDoctor } = useDoctor(doctorId);
  const { data: branchRes, isLoading: isLoadingBranches } = useBranches();
  const { data: roomRes, isLoading: isLoadingRooms } = useConsultingRooms();
  const { data: slotsRes, isLoading: isLoadingSlots } =
    useDoctorSlots(doctorId);

  // New Queries for configs and off days
  const { data: weeklyConfigRes, isLoading: isLoadingWeeklyConfig } =
    useWeeklySchedule(doctorId);
  const { data: offDaysRes, isLoading: isLoadingOffDays } =
    useDoctorOffDays(doctorId);

  // Sync weekly configs list when loaded from API during the render phase
  if (weeklyConfigRes?.data && weeklyConfigRes.data !== prevConfigsData) {
    setPrevConfigsData(weeklyConfigRes.data);
    setLocalConfigs(
      weeklyConfigRes.data.map((item) => ({
        id: item.id,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime.substring(0, 5),
        endTime: item.endTime.substring(0, 5),
        consultingRoomId: item.consultingRoomId,
        slotDurationMinutes: item.slotDurationMinutes,
        isActive: item.isActive,
      })),
    );
  }

  // Mutations
  const updateWeeklyScheduleMutation = useUpdateWeeklySchedule(doctorId);
  const createOffDayMutation = useCreateOffDay(doctorId, {
    onSuccess: () => {
      setOffDate("");
      setOffReason("");
    },
  });
  const deleteOffDayMutation = useDeleteOffDay(doctorId);

  const doctor = doctorRes?.data;
  const branches = branchRes?.data || [];
  const rooms = roomRes?.data || [];
  const slots = slotsRes?.data || [];
  const offDays = offDaysRes?.data || [];

  const isLoading =
    isLoadingDoctor ||
    isLoadingBranches ||
    isLoadingRooms ||
    isLoadingWeeklyConfig ||
    isLoadingOffDays;

  // Filter consulting rooms by selected branch
  const filteredRooms = rooms.filter(
    (r) => r.branchId === selectedBranchId && r.status === "ACTIVE",
  );

  // Add configuration to local list
  const handleAddLocalConfig = () => {
    if (!selectedDay) {
      toast.warning("Selecciona un día de la semana");
      return;
    }
    if (!selectedBranchId) {
      toast.warning("Selecciona una sede");
      return;
    }
    if (!selectedRoomId) {
      toast.warning("Selecciona un consultorio");
      return;
    }
    if (!startTime || !endTime) {
      toast.warning("Ingresa la hora de inicio y fin");
      return;
    }

    // Check if end time is after start time
    if (startTime >= endTime) {
      toast.warning("La hora de fin debe ser posterior a la de inicio");
      return;
    }

    const newConfig: DoctorScheduleRequest = {
      dayOfWeek: selectedDay,
      startTime,
      endTime,
      consultingRoomId: selectedRoomId,
      slotDurationMinutes: slotDuration,
      isActive: true,
    };

    setLocalConfigs([...localConfigs, newConfig]);

    // Reset some inputs
    setSelectedDay("");
    setStartTime("");
    setEndTime("");
    toast.info("Horario agregado a la lista. Recuerda guardar los cambios.");
  };

  // Remove configuration from local list
  const handleRemoveLocalConfig = (index: number) => {
    setLocalConfigs(localConfigs.filter((_, i) => i !== index));
  };

  // Save weekly configurations
  const handleSaveWeeklyConfigs = () => {
    updateWeeklyScheduleMutation.mutate(localConfigs);
  };

  // Register an off day
  const handleRegisterOffDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offDate) {
      toast.warning("Elige una fecha");
      return;
    }

    createOffDayMutation.mutate({
      offDate,
      reason: offReason,
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-zinc-400">
        <Loader2 className="w-10 h-10 animate-spin text-celeste" />
        <p className="text-sm font-medium animate-pulse">
          Cargando configuración de horarios del médico...
        </p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-zinc-500 font-bold mb-4">
          El médico seleccionado no existe o fue deshabilitado.
        </p>
        <Button
          onClick={() => router.push("/dashboard/admin/doctors")}
          className="bg-celeste text-white"
        >
          Volver a Directorio
        </Button>
      </div>
    );
  }

  // Group active slots by date
  const groupedSlots = slots.reduce<Record<string, typeof slots>>(
    (acc, slot) => {
      const dateStr = slot.slotDate;
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(slot);
      return acc;
    },
    {},
  );

  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button and Title */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/dashboard/admin/doctors")}
          className="flex items-center gap-2 text-zinc-500 hover:text-petroleo dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al directorio
        </button>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-petroleo dark:text-white tracking-tight leading-none">
              Configurar{" "}
              <span className="text-celeste">Horarios y Días Libres</span>
            </h1>
            <div className="relative inline-block mt-0.5">
              <button
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                onClick={() => setShowHelp(!showHelp)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-celeste transition-colors focus:outline-none shrink-0"
                aria-label="Ver funcionamiento"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {showHelp && (
                <div className="absolute left-0 mt-2 w-80 p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-petroleo dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-celeste" />
                      ¿Cómo funciona el flujo?
                    </h4>
                    <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed space-y-2 list-disc list-inside">
                      <li>
                        <strong className="text-petroleo dark:text-white">Horario Semanal:</strong> Define qué días y a qué horas atiende el médico normalmente. El backend generará los slots día a día con una ventana de 7 días.
                      </li>
                      <li>
                        <strong className="text-petroleo dark:text-white">Cambios de Horario:</strong> Si modificas la configuración, las citas ya programadas a 7 días no se perderán. El nuevo horario entrará en vigencia a partir del día 8.
                      </li>
                      <li>
                        <strong className="text-petroleo dark:text-white">Días Libres:</strong> Registra fechas excepcionales en que el médico no atenderá. Se limpiarán los slots libres automáticamente y se emitirá una alerta si hay conflictos con reservas previas.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm font-medium">
            Establece el horario recurrente del médico y administra sus días
            libres. El sistema generará ranuras automáticamente a 7 días.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Doctor Profile */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-celeste/10 text-celeste flex items-center justify-center font-black text-3xl shadow-inner mx-auto mb-4 border border-celeste/20">
                {doctor.user.firstName[0]}
                {doctor.user.lastName[0]}
              </div>

              <h2 className="text-xl font-black text-petroleo dark:text-white leading-tight">
                Dr. {doctor.user.firstName} {doctor.user.lastName}
              </h2>
              <p className="text-xs text-zinc-400 font-bold uppercase mt-1 tracking-wider">
                CMP: {doctor.medicalLicenseNumber}
              </p>

              {/* Specialties */}
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                {doctor.specialties.map((spec) => (
                  <span
                    key={spec.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-celeste/10 text-celeste dark:bg-celeste/20 border border-celeste/15 rounded-full text-[10px] font-black tracking-wider uppercase"
                  >
                    <Stethoscope className="w-3 h-3" />
                    {spec.name}
                  </span>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800 space-y-3 text-left">
                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                  <div className="w-7 h-7 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      Teléfono
                    </p>
                    <p className="font-extrabold text-petroleo dark:text-white mt-0.5">
                      {doctor.user.phone || "Sin teléfono"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                  <div className="w-7 h-7 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <Info className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      Biografía
                    </p>
                    <p className="text-[11px] leading-relaxed line-clamp-3 font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                      {doctor.bio ||
                        "Médico certificado comprometido con la salud y bienestar de sus pacientes."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Configuration & Off Days Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-xl w-full max-w-md grid grid-cols-2 h-11 mb-6">
              <TabsTrigger
                value="weekly"
                className="rounded-lg font-black text-xs uppercase tracking-wider transition-all"
              >
                <Clock className="w-3.5 h-3.5 mr-2 text-celeste" />
                Horario Recurrente
              </TabsTrigger>
              <TabsTrigger
                value="offdays"
                className="rounded-lg font-black text-xs uppercase tracking-wider transition-all"
              >
                <Calendar className="w-3.5 h-3.5 mr-2 text-celeste" />
                Días Libres
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT: WEEKLY CONFIG */}
            <TabsContent value="weekly" className="space-y-6 mt-0">
              <Card className="rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
                      <Clock className="w-5 h-5 text-celeste" />
                      Configuración de Horario Semanal
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-1">
                      Agrega los días y bloques horarios que trabaja el médico
                      en su consultorio asignado.
                    </p>
                  </div>

                  {/* Add Configuration Form */}
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 space-y-4">
                    <h4 className="text-xs font-black text-petroleo dark:text-white uppercase tracking-wider">
                      Agregar Bloque Horario
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Day of Week */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                          Día de la Semana
                        </label>
                        <Select
                          value={selectedDay}
                          onValueChange={(val) => setSelectedDay(val)}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-petroleo dark:text-white">
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Branch Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          Sede Clínicas
                        </label>
                        <Select
                          value={selectedBranchId}
                          onValueChange={(val) => {
                            setSelectedBranchId(val);
                            setSelectedRoomId("");
                          }}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-petroleo dark:text-white">
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Consulting Room Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                          Consultorio Físico
                        </label>
                        <Select
                          disabled={!selectedBranchId}
                          value={selectedRoomId}
                          onValueChange={(val) => setSelectedRoomId(val)}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-petroleo dark:text-white disabled:opacity-50">
                            <SelectValue
                              placeholder={
                                !selectedBranchId
                                  ? "Primero elige Sede"
                                  : "Selecciona..."
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredRooms.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Start Time */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                          Hora de Inicio
                        </label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold"
                        />
                      </div>

                      {/* End Time */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                          Hora de Fin
                        </label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold"
                        />
                      </div>

                      {/* Slot Duration */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                          Duración del Slot
                        </label>
                        <Select
                          value={String(slotDuration)}
                          onValueChange={(val) => setSlotDuration(Number(val))}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-petroleo dark:text-white">
                            <SelectValue placeholder="Selecciona..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SLOT_DURATIONS.map((dur) => (
                              <SelectItem key={dur.value} value={dur.value}>
                                {dur.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        onClick={handleAddLocalConfig}
                        className="bg-celeste hover:bg-celeste/95 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Agregar a la Lista
                      </Button>
                    </div>
                  </div>

                  {/* List of Local Configs */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-petroleo dark:text-white uppercase tracking-wider">
                      Lista de Horarios a Guardar
                    </h4>

                    {localConfigs.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400">
                        <Clock className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-zinc-400">
                          Sin Horarios Configurados
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                          Agrega bloques horarios arriba para estructurar la
                          agenda semanal.
                        </p>
                      </div>
                    ) : (
                      <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-800/80">
                        {localConfigs.map((cfg, idx) => {
                          const roomObj = rooms.find(
                            (r) => r.id === cfg.consultingRoomId,
                          );
                          const branchObj = branches.find(
                            (b) => b.id === roomObj?.branchId,
                          );
                          const dayLabel =
                            DAYS_OF_WEEK.find((d) => d.value === cfg.dayOfWeek)
                              ?.label || cfg.dayOfWeek;

                          return (
                            <div
                              key={idx}
                              className="p-4 bg-zinc-50/20 dark:bg-zinc-950/20 flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block">
                                    Día
                                  </span>
                                  <span className="font-extrabold text-petroleo dark:text-white">
                                    {dayLabel}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block">
                                    Sede y Consultorio
                                  </span>
                                  <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                                    {branchObj?.name} - C.{" "}
                                    {roomObj?.roomNumber || "S/N"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block">
                                    Bloque Horario
                                  </span>
                                  <span className="font-extrabold text-petroleo dark:text-white">
                                    {cfg.startTime} - {cfg.endTime}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block">
                                    Duración
                                  </span>
                                  <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                                    {cfg.slotDurationMinutes} min
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveLocalConfig(idx)}
                                className="text-zinc-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                                title="Eliminar horario"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-zinc-50 dark:border-zinc-800">
                    <Button
                      type="button"
                      disabled={updateWeeklyScheduleMutation.isPending}
                      onClick={handleSaveWeeklyConfigs}
                      className="h-11 px-6 bg-celeste hover:bg-celeste/95 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-celeste/10"
                    >
                      {updateWeeklyScheduleMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando configuración...
                        </>
                      ) : (
                        <>Guardar Configuración Semanal</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB CONTENT: OFF DAYS */}
            <TabsContent value="offdays" className="space-y-6 mt-0">
              <Card className="rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-celeste" />
                      Administración de Días Libres
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-1">
                      Agrega fechas específicas donde el médico no estará
                      disponible. El sistema liberará los slots no reservados.
                    </p>
                  </div>

                  {/* Register Off Day Form */}
                  <form
                    onSubmit={handleRegisterOffDay}
                    className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                        Fecha del Día Libre *
                      </label>
                      <Input
                        type="date"
                        required
                        value={offDate}
                        onChange={(e) => setOffDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-petroleo dark:text-zinc-400 uppercase tracking-wider">
                        Motivo / Descripción
                      </label>
                      <Input
                        type="text"
                        placeholder="Ej: Vacaciones, Congreso..."
                        value={offReason}
                        onChange={(e) => setOffReason(e.target.value)}
                        className="h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-xs font-semibold"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createOffDayMutation.isPending}
                      className="h-10 bg-celeste hover:bg-celeste/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      {createOffDayMutation.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Registrar Día Libre
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Registered Off Days List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-petroleo dark:text-white uppercase tracking-wider">
                      Días Libres Registrados a Futuro
                    </h4>

                    {offDays.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400">
                        <Calendar className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-zinc-400">
                          Sin Días Libres Registrados
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                          El médico no cuenta con suspensiones temporales de
                          agenda a futuro.
                        </p>
                      </div>
                    ) : (
                      <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-800/80">
                        {offDays.map((day) => {
                          const dateParts = day.offDate.split("-");
                          const dateObj = new Date(
                            Number(dateParts[0]),
                            Number(dateParts[1]) - 1,
                            Number(dateParts[2]),
                          );
                          const formattedDate = dateObj.toLocaleDateString(
                            "es-PE",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          );

                          return (
                            <div
                              key={day.id}
                              className="p-4 bg-zinc-50/20 dark:bg-zinc-950/20 flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="flex-1">
                                <span className="font-extrabold text-petroleo dark:text-white block capitalize">
                                  {formattedDate}
                                </span>
                                {day.reason && (
                                  <span className="text-[10px] text-zinc-400 font-semibold mt-0.5 block">
                                    Motivo: {day.reason}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                disabled={deleteOffDayMutation.isPending}
                                onClick={() =>
                                  deleteOffDayMutation.mutate(day.id)
                                }
                                className="text-zinc-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-50"
                                title="Eliminar día libre"
                              >
                                {deleteOffDayMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ACTIVE GENERATED SLOTS LOG */}
      <Card className="rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div>
              <h3 className="text-lg font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-celeste" />
                Ranuras de Atención Activas (Próximos 7 días)
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                Visualiza los horarios ya generados en la base de datos para
                este médico.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-verde-salud/20 border border-verde-salud" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-celeste/20 border border-celeste" />
                <span>Reservado</span>
              </div>
            </div>
          </div>

          {isLoadingSlots ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin text-celeste" />
              <p className="text-xs font-semibold">Cargando agenda...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                <Calendar className="w-6 h-6 text-zinc-400" />
              </div>
              <h4 className="text-sm font-bold text-petroleo dark:text-white">
                Sin Horarios Cargados
              </h4>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-1">
                Este médico no cuenta con bloques programados en la base de
                datos. Configura su horario semanal arriba para que comience la
                generación diaria.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateStr) => {
                const dateSlots = groupedSlots[dateStr];

                const dateParts = dateStr.split("-");
                const dateObj = new Date(
                  Number(dateParts[0]),
                  Number(dateParts[1]) - 1,
                  Number(dateParts[2]),
                );
                const formattedDate = dateObj.toLocaleDateString("es-PE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <div
                    key={dateStr}
                    className="border border-zinc-50 dark:border-zinc-800/50 rounded-2xl p-5 bg-zinc-50/20 dark:bg-zinc-950/20 space-y-4"
                  >
                    <h4 className="text-xs font-extrabold text-celeste uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-celeste rounded-full" />
                      {formattedDate}
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {dateSlots.map((slot) => {
                        const isAvailable = slot.status === "AVAILABLE";
                        return (
                          <div
                            key={slot.id}
                            className={`p-3 rounded-xl border flex flex-col justify-center items-center text-center transition-all ${
                              isAvailable
                                ? "bg-verde-salud/5 text-verde-salud border-verde-salud/15 hover:bg-verde-salud/10"
                                : "bg-celeste/5 text-celeste border-celeste/20 hover:bg-celeste/10"
                            }`}
                          >
                            <span className="text-xs font-extrabold">
                              {slot.startTime.substring(0, 5)} -{" "}
                              {slot.endTime.substring(0, 5)}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mt-1 block max-w-full truncate">
                              C. {slot.consultingRoomNumber}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-400 truncate max-w-full block">
                              {slot.branchName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
