"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  Building2,
  Stethoscope,
  Save,
  HelpCircle,
  Timer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SpecialtyResponse } from "@/core/specialty/interfaces";

interface SpecialtyScheduleDialogProps {
  specialty: SpecialtyResponse;
  trigger?: React.ReactNode;
}

const DAYS = [
  { id: "LUN", label: "Lunes" },
  { id: "MAR", label: "Martes" },
  { id: "MIE", label: "Miércoles" },
  { id: "JUE", label: "Jueves" },
  { id: "VIE", label: "Viernes" },
  { id: "SAB", label: "Sábado" },
];

export function SpecialtyScheduleDialog({
  specialty,
  trigger,
}: SpecialtyScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [shiftType, setShiftType] = useState("MORNING");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("13:00");
  const [slotDuration, setSlotDuration] = useState("20");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "LUN",
    "MAR",
    "MIE",
    "JUE",
    "VIE",
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleShiftChange = (value: string) => {
    setShiftType(value);
    if (value === "MORNING") {
      setStartTime("08:00");
      setEndTime("13:00");
    } else if (value === "AFTERNOON") {
      setStartTime("14:00");
      setEndTime("19:00");
    } else if (value === "FULL") {
      setStartTime("08:00");
      setEndTime("18:00");
    }
  };

  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayId));
      }
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulación de actualización de parámetros de horario de la especialidad
    setTimeout(() => {
      setIsSaving(false);
      setOpen(false);
      // Alerta visual Toast verde requerida en la Mejora 5.5 del informe
      toast.success("Horario actualizado exitosamente");
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold gap-2 cursor-pointer border-celeste/40 text-celeste hover:bg-celeste hover:text-white"
          >
            <Clock className="w-3.5 h-3.5" />
            Horarios
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950">
        {/* Cabecera Clínica */}
        <div className="bg-petroleo p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-celeste/15 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/20">
              <Clock className="w-6 h-6 text-celeste" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">
                Horario de Atención — {specialty.name}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-xs font-medium mt-1">
                Configura los turnos y horario operativo para esta especialidad médica.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario de Configuración de Horario */}
        <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Selector de Turno Predefinido */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Timer className="w-4 h-4 text-celeste" />
              1. Turno de Atención
            </label>
            <Select value={shiftType} onValueChange={handleShiftChange}>
              <SelectTrigger className="h-12 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Selecciona un turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MORNING">Turno Mañana (08:00 - 13:00)</SelectItem>
                <SelectItem value="AFTERNOON">Turno Tarde (14:00 - 19:00)</SelectItem>
                <SelectItem value="FULL">Jornada Completa (08:00 - 18:00)</SelectItem>
                <SelectItem value="CUSTOM">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Horas de Inicio y Fin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Hora Inicio
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setShiftType("CUSTOM");
                }}
                className="h-12 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-center text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Hora Fin
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setShiftType("CUSTOM");
                }}
                className="h-12 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-center text-sm"
              />
            </div>
          </div>

          {/* Días Operativos de la Especialidad */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-celeste" />
              2. Días de Atención Habilitados
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-petroleo dark:bg-celeste text-white border-petroleo dark:border-celeste shadow-sm"
                        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-celeste"
                    }`}
                  >
                    <span>{day.id}</span>
                    <span className="text-[10px] opacity-75 font-medium">{day.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duración de consulta por defecto */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              3. Duración Estimada por Consulta
            </label>
            <Select value={slotDuration} onValueChange={setSlotDuration}>
              <SelectTrigger className="h-12 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Selecciona duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos (Alta rotación)</SelectItem>
                <SelectItem value="20">20 minutos (Estándar recomendado)</SelectItem>
                <SelectItem value="30">30 minutos (Evaluación completa)</SelectItem>
                <SelectItem value="45">45 minutos (Procedimiento especializado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nota Aclaratoria sobre Especialidades vs Médicos */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-petroleo dark:text-white">
              <Stethoscope className="w-4 h-4 text-celeste" />
              Sincronización con Médicos Especialistas
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Este turno define el marco de atención de <strong>{specialty.name}</strong>. Para asignar consultorios específicos o turnos semanales detallados a cada doctor, puedes acceder a la gestión de médicos.
            </p>
          </div>
        </div>

        {/* Footer con Alerta visual Toast al confirmar */}
        <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl font-bold cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="celeste"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl font-bold px-6 shadow-md cursor-pointer gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Guardando..." : "Guardar Horario de Especialidad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

