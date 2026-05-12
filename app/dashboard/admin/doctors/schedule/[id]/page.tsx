"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building,
  DoorOpen,
  Plus,
  Loader2,
  Stethoscope,
  Info,
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
import { useDoctorSlots } from "@/modules/domain/appointment/hooks/useDoctorSlots";
import { useGenerateSlots } from "@/modules/domain/appointment/hooks/useGenerateSlots";
import { useDoctor } from "@/modules/domain/doctor/hooks/useDoctor";

export default function DoctorSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  // Form states
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState(15);

  // Queries
  const { data: doctorRes, isLoading: isLoadingDoctor } = useDoctor(doctorId);
  const { data: branchRes, isLoading: isLoadingBranches } = useBranches();
  const { data: roomRes, isLoading: isLoadingRooms } = useConsultingRooms();
  const { data: slotsRes, isLoading: isLoadingSlots } =
    useDoctorSlots(doctorId);

  // Mutation
  const generateSlotsMutation = useGenerateSlots({
    onSuccess: () => {
      // Clear times after success
      setStartTime("");
      setEndTime("");
    },
  });

  const doctor = doctorRes?.data;
  const branches = branchRes?.data || [];
  const rooms = roomRes?.data || [];
  const slots = slotsRes?.data || [];

  const isLoading = isLoadingDoctor || isLoadingBranches || isLoadingRooms;

  // Filtrar consultorios por la sede seleccionada
  const filteredRooms = rooms.filter(
    (r) => r.branchId === selectedBranchId && r.status === "ACTIVE",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBranchId) {
      toast.warning("Selecciona una sede de atención");
      return;
    }
    if (!selectedRoomId) {
      toast.warning("Asigna un consultorio físico");
      return;
    }
    if (!date) {
      toast.warning("Elige una fecha para la consulta");
      return;
    }
    if (!startTime || !endTime) {
      toast.warning("Ingresa la hora de inicio y fin");
      return;
    }

    // Convertir a formato HH:mm si es necesario (el input type=time ya devuelve HH:mm)
    generateSlotsMutation.mutate({
      doctorId,
      consultingRoomId: selectedRoomId,
      date,
      startTime,
      endTime,
      slotDurationMinutes: slotDuration,
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-zinc-400">
        <Loader2 className="w-10 h-10 animate-spin text-celeste" />
        <p className="text-sm font-medium animate-pulse">
          Cargando perfil médico y centros físicos...
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

  // Agrupar slots por fecha para visualizarlos de manera ordenada
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
      {/* Botón de Retorno y Título */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/dashboard/admin/doctors")}
          className="flex items-center gap-2 text-zinc-500 hover:text-petroleo dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al directorio
        </button>

        <div>
          <h1 className="text-2xl font-black text-petroleo dark:text-white tracking-tight leading-none">
            Programar <span className="text-celeste">Agenda</span> Médica
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">
            Define la jornada de trabajo, asigna consultorio y genera slots
            automáticos para el portal de pacientes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Perfil del Médico */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-6 text-center">
              {/* Avatar Simulado Premium */}
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

              {/* Especialidades Badges */}
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

              {/* Información Adicional */}
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

          {/* Tarjeta de Instrucciones del Operador */}
          <Card className="rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-5">
            <CardContent className="p-0 space-y-3">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-celeste shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-petroleo dark:text-white uppercase tracking-wider">
                    ¿Cómo funciona la asignación?
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-1">
                    Al ingresar el rango de horario, el sistema creará ranuras
                    de atención continuas. El motor de reservas se encarga de
                    proteger la agenda, impidiendo solapamientos para el Dr.{" "}
                    <strong>{doctor.user.lastName}</strong> o el uso duplicado
                    del consultorio seleccionado en otros turnos médicos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Formulario de Generación */}
        <div className="lg:col-span-2">
          <Card className="rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-lg font-black text-petroleo dark:text-white mb-6 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-celeste" />
                Nueva Jornada de Atención
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selector Sede */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-zinc-400" />
                      Sede Clínicas *
                    </label>
                    <Select
                      value={selectedBranchId}
                      onValueChange={(val) => {
                        setSelectedBranchId(val);
                        setSelectedRoomId("");
                      }}
                    >
                      <SelectTrigger className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-sm font-semibold text-petroleo dark:text-white">
                        <SelectValue placeholder="Selecciona Sede..." />
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

                  {/* Selector Consultorio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-zinc-400" />
                      Consultorio Físico *
                    </label>
                    <Select
                      disabled={!selectedBranchId}
                      value={selectedRoomId}
                      onValueChange={(val) => setSelectedRoomId(val)}
                    >
                      <SelectTrigger className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-sm font-semibold text-petroleo dark:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                        <SelectValue
                          placeholder={
                            !selectedBranchId
                              ? "Primero selecciona sede"
                              : "Selecciona Consultorio..."
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selector Fecha */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                      Fecha de Jornada *
                    </label>
                    <Input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-sm font-semibold focus-ring-celeste/20"
                    />
                  </div>

                  {/* Duración de Citas */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                      Duración del Slot *
                    </label>
                    <Select
                      value={String(slotDuration)}
                      onValueChange={(val) => setSlotDuration(Number(val))}
                    >
                      <SelectTrigger className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-sm font-semibold text-petroleo dark:text-white">
                        <SelectValue placeholder="Selecciona duración..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">
                          15 minutos (Recomendado)
                        </SelectItem>
                        <SelectItem value="20">20 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">
                          60 minutos (Turno Largo)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hora de Inicio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                      Hora de Inicio *
                    </label>
                    <Input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-sm font-semibold focus-ring-celeste/20"
                    />
                  </div>

                  {/* Hora de Fin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                      Hora de Cierre *
                    </label>
                    <Input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-sm font-semibold focus-ring-celeste/20"
                    />
                  </div>
                </div>

                {/* Resumen Informativo Dinámico */}
                {date && startTime && endTime && (
                  <div className="p-4 bg-celeste/5 border border-celeste/10 rounded-2xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-celeste shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-petroleo/80 dark:text-zinc-300 leading-relaxed">
                      Se generarán turnos de{" "}
                      <strong>{slotDuration} minutos</strong> el día{" "}
                      <strong>{date}</strong>, comenzando a las{" "}
                      <strong>{startTime}</strong> hasta las{" "}
                      <strong>{endTime}</strong>.
                      {selectedRoomId && (
                        <span>
                          {" "}
                          Asignado al consultorio{" "}
                          <strong>
                            {
                              rooms.find((r) => r.id === selectedRoomId)
                                ?.roomNumber
                            }
                          </strong>
                          .
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Botón de Enviar */}
                <div className="flex justify-end pt-4 border-t border-zinc-50 dark:border-zinc-800">
                  <Button
                    type="submit"
                    disabled={generateSlotsMutation.isPending}
                    className="h-12 px-8 bg-celeste hover:bg-celeste/95 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-celeste/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    {generateSlotsMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validando y programando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Generar Ranuras de Reserva
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Horarios Programados del Médico */}
      <Card className="rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div>
              <h3 className="text-lg font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-celeste" />
                Ranuras de Atención Activas
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                Visualiza los horarios ya cargados en la agenda de este médico.
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
                datos. Completa el formulario de arriba para habilitar sus
                primeras citas de reserva.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((dateStr) => {
                const dateSlots = groupedSlots[dateStr];

                // Formatear la fecha de forma bonita para el administrador (ej: "Lunes 14 de Mayo")
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
