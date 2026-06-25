"use client";

import { useConsultationByAppointment } from "@/modules/domain/clinical/hooks/useConsultation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Calendar,
  Clock,
  Heart,
  Thermometer,
  Scale,
  Gauge,
  Activity,
  BookOpen,
  FileText,
  User,
  Pill,
  CornerDownRight,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewConsultationDialogProps {
  appointmentId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewConsultationDialog({
  appointmentId,
  isOpen,
  onOpenChange,
}: ViewConsultationDialogProps) {
  const {
    data: consultationRes,
    isLoading,
    error,
  } = useConsultationByAppointment(appointmentId);

  const consultation = consultationRes?.data;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2rem] p-8 gap-6 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 shadow-xl">
        <DialogHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight flex items-center gap-3">
            <ClipboardHeaderIcon />
            Detalle de Consulta
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Spinner className="w-10 h-10 text-celeste" />
            <p className="text-zinc-500 font-bold text-sm">
              Cargando expediente clínico...
            </p>
          </div>
        ) : error || !consultation ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-amber-500/10 dark:bg-amber-500/5 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-petroleo dark:text-zinc-200">
              No se encontraron detalles
            </h4>
            <p className="text-xs text-zinc-400 max-w-[280px] mt-1.5 leading-relaxed">
              No hay una consulta médica registrada aún para esta cita.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Info */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/35 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900/80 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-celeste text-white flex items-center justify-center text-md font-black shrink-0 shadow-sm">
                  {consultation.patientFirstName?.charAt(0)}
                  {consultation.patientLastName?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-petroleo dark:text-white leading-tight">
                    {consultation.patientFirstName}{" "}
                    {consultation.patientLastName}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-celeste" />
                    Paciente
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end justify-center text-xs text-zinc-500 dark:text-zinc-400 font-semibold gap-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-celeste" />
                  {consultation.appointmentDate
                    ? new Date(
                        `${consultation.appointmentDate}T00:00:00`,
                      ).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "--"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-celeste" />
                  {consultation.appointmentTime
                    ? consultation.appointmentTime.substring(0, 5)
                    : "--:--"}
                </span>
              </div>
            </div>

            {/* 1. Vital Signs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Signos Vitales
              </h3>
              {consultation.vitals ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      name: "Presión Arterial",
                      val: consultation.vitals.bloodPressure || "--",
                      icon: Gauge,
                      color: "text-amber-500 bg-amber-50 dark:bg-amber-900/10",
                    },
                    {
                      name: "Frecuencia Card.",
                      val: consultation.vitals.heartRate
                        ? `${consultation.vitals.heartRate} bpm`
                        : "--",
                      icon: Heart,
                      color: "text-rose-500 bg-rose-50 dark:bg-rose-900/10",
                    },
                    {
                      name: "Temperatura",
                      val: consultation.vitals.temperature
                        ? `${consultation.vitals.temperature} °C`
                        : "--",
                      icon: Thermometer,
                      color: "text-celeste bg-blue-50 dark:bg-blue-900/10",
                    },
                    {
                      name: "Peso / Talla",
                      val: consultation.vitals.weight
                        ? `${consultation.vitals.weight}kg / ${consultation.vitals.height || "--"}cm`
                        : "--",
                      icon: Scale,
                      color:
                        "text-tiffany bg-emerald-50 dark:bg-emerald-900/10",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900/80 bg-zinc-50/20 dark:bg-zinc-900/20 flex flex-col items-center text-center"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center mb-2",
                          item.color,
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                        {item.name}
                      </p>
                      <p className="text-xs font-black text-petroleo dark:text-white mt-1">
                        {item.val}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-400 italic border border-dashed border-zinc-100 dark:border-zinc-900">
                  No se registraron signos vitales en esta consulta.
                </div>
              )}
            </div>

            {/* 2. Diagnoses */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-celeste" /> Diagnóstico
                Clínico
              </h3>
              {consultation.diagnoses && consultation.diagnoses.length > 0 ? (
                <div className="space-y-2">
                  {consultation.diagnoses.map((diag) => (
                    <div
                      key={diag.id}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10"
                    >
                      <div
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border shrink-0",
                          diag.type === "PRIMARY" || diag.type === "PRINCIPAL"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
                        )}
                      >
                        {diag.type === "PRIMARY" || diag.type === "PRINCIPAL"
                          ? "Principal"
                          : "Secundario"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-petroleo dark:text-white">
                          {diag.description}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                          CIE-10: {diag.icd10}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-400 italic border border-dashed border-zinc-100 dark:border-zinc-900">
                  No se registraron diagnósticos específicos.
                </div>
              )}
            </div>

            {/* 3. Clinical Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> Notas Evolutivas
                / Observaciones
              </h3>
              <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/10 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold whitespace-pre-wrap">
                {consultation.notes || "Sin observaciones registradas."}
              </div>
            </div>

            {/* 4. Prescription */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-tiffany" /> Receta de
                Medicamentos
              </h3>
              {consultation.prescription &&
              consultation.prescription.items &&
              consultation.prescription.items.length > 0 ? (
                <div className="space-y-4">
                  {consultation.prescription.notes && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
                      <span className="font-bold text-zinc-650 dark:text-zinc-300 block mb-1">
                        Notas del Médico:
                      </span>
                      {consultation.prescription.notes}
                    </p>
                  )}
                  <div className="border border-zinc-100 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 dark:bg-zinc-900 text-zinc-450 dark:text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-900">
                            <th className="p-4 uppercase tracking-widest text-[9px]">
                              Medicamento
                            </th>
                            <th className="p-4 uppercase tracking-widest text-[9px]">
                              Dosis
                            </th>
                            <th className="p-4 uppercase tracking-widest text-[9px]">
                              Frecuencia
                            </th>
                            <th className="p-4 uppercase tracking-widest text-[9px]">
                              Duración
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50 text-zinc-600 dark:text-zinc-300">
                          {consultation.prescription.items.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10"
                            >
                              <td className="p-4 font-bold text-petroleo dark:text-white">
                                <span className="flex items-center gap-1.5">
                                  <Pill className="w-3.5 h-3.5 text-celeste" />
                                  {item.medicationName}
                                </span>
                                {item.instructions && (
                                  <span className="text-[10px] text-zinc-400 font-normal block mt-1.5 flex items-center gap-1">
                                    <CornerDownRight className="w-3 h-3 text-celeste" />
                                    {item.instructions}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 font-semibold">
                                {item.dosage || "—"}
                              </td>
                              <td className="p-4 font-semibold">
                                {item.frequency || "—"}
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center justify-center font-bold text-celeste bg-celeste/10 px-2.5 py-0.5 rounded-lg text-[10px]">
                                  {item.duration || "—"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-400 italic border border-dashed border-zinc-100 dark:border-zinc-900">
                  No se prescribieron medicamentos en esta consulta.
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ClipboardHeaderIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-celeste/10 text-celeste flex items-center justify-center">
      <Stethoscope className="w-5 h-5" />
    </div>
  );
}
