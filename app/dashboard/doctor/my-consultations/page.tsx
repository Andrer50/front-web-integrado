"use client";

import { useSession } from "next-auth/react";
import { useDoctors } from "@/modules/domain/doctor/hooks/useDoctors";
import { useConsultations } from "@/modules/domain/clinical/hooks/useConsultation";
import {
  Calendar,
  Clock,
  ClipboardList,
  Search,
  User as UserIcon,
  Activity,
  FileText,
  ChevronRight,
  Filter,
  CheckCircle2,
  Heart,
  Thermometer,
  Scale,
  Gauge,
  BookOpen,
  CornerDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MyConsultationsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1. Cargar la lista de doctores para encontrar al actual mediante su userId
  const { data: doctorsData, isLoading: isLoadingDoctors } = useDoctors({
    page: 0,
    size: 100,
  });

  const currentDoctor = useMemo(() => {
    if (!userId || !doctorsData?.data?.content) return null;
    return doctorsData.data.content.find((doc) => String(doc.user.id) === String(userId));
  }, [userId, doctorsData]);

  // 2. Obtener las consultas completadas del doctor
  const { data: consultationsRes, isLoading: isLoadingConsultations } = useConsultations(
    currentDoctor?.id || "",
    "COMPLETED"
  );

  const consultationsList = useMemo(() => {
    return consultationsRes?.data || [];
  }, [consultationsRes]);

  // Estados locales para búsqueda y selección
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filtrado de consultas
  const filteredConsultations = useMemo(() => {
    return consultationsList.filter((c) => {
      const patientName = `${c.patientFirstName || ""} ${c.patientLastName || ""}`.toLowerCase();
      const diagnosisText = (c.diagnoses || [])
        .map((d) => `${d.icd10} ${d.description}`)
        .join(" ")
        .toLowerCase();
      const query = searchQuery.toLowerCase();
      return patientName.includes(query) || diagnosisText.includes(query) || c.notes?.toLowerCase().includes(query);
    });
  }, [consultationsList, searchQuery]);

  // Consulta seleccionada para detalle
  const selectedConsultation = useMemo(() => {
    if (!selectedId) return filteredConsultations[0] || null;
    return filteredConsultations.find((c) => c.id === selectedId) || filteredConsultations[0] || null;
  }, [filteredConsultations, selectedId]);

  // Métricas
  const totalConsultations = consultationsList.length;
  const uniquePatients = useMemo(() => {
    const patients = new Set();
    consultationsList.forEach((c) => {
      patients.add(`${c.patientFirstName} ${c.patientLastName}`);
    });
    return patients.size;
  }, [consultationsList]);

  const topDiagnosis = useMemo(() => {
    const counts: Record<string, number> = {};
    consultationsList.forEach((c) => {
      c.diagnoses?.forEach((d) => {
        counts[d.description] = (counts[d.description] || 0) + 1;
      });
    });
    let top = "Ninguno";
    let max = 0;
    Object.entries(counts).forEach(([desc, count]) => {
      if (count > max) {
        max = count;
        top = desc;
      }
    });
    return top.length > 25 ? top.substring(0, 25) + "..." : top;
  }, [consultationsList]);

  if (isLoadingDoctors || (currentDoctor?.id && isLoadingConsultations)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Spinner className="w-12 h-12 text-celeste" />
        <p className="text-zinc-500 font-bold">Cargando tu historial de consultas...</p>
      </div>
    );
  }

  if (!currentDoctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-petroleo dark:text-white">Perfil de médico no encontrado</h3>
        <p className="text-zinc-500 text-sm max-w-md text-center">
          No pudimos encontrar tu perfil de doctor asociado a esta cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <p className="text-sm font-bold text-celeste mb-1 uppercase tracking-widest">
          Historial Médico
        </p>
        <h1 className="text-4xl font-black text-petroleo dark:text-white tracking-tight">
          Mis Consultas Atendidas
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
          Accede al registro histórico de todos los pacientes que has atendido y sus respectivos informes.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-celeste">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Total Atendidas
              </p>
              <h3 className="text-2xl font-semibold text-petroleo dark:text-white leading-tight mt-1">
                {totalConsultations} consultas
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-verde-salud">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Pacientes Únicos
              </p>
              <h3 className="text-2xl font-semibold text-petroleo dark:text-white leading-tight mt-1">
                {uniquePatients} pacientes
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Diagnóstico Frecuente
              </p>
              <h3 className="text-lg font-semibold text-petroleo dark:text-white leading-tight mt-1 truncate max-w-[200px]">
                {topDiagnosis}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main split-screen layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Search & Consultation Cards List */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold text-petroleo dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-celeste" />
                Buscar Consulta
              </CardTitle>
              <div className="mt-4 relative">
                <Input
                  placeholder="Paciente, diagnóstico, notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-10 pr-4 py-6 font-medium text-sm text-petroleo dark:text-white placeholder:text-zinc-400 focus-visible:ring-celeste"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredConsultations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-300 mb-4">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-petroleo dark:text-zinc-200">Sin resultados</h4>
                  <p className="text-xs text-zinc-400 max-w-[250px] mt-1">
                    No encontramos consultas completadas que coincidan con la búsqueda.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50 max-h-[600px] overflow-y-auto">
                  {filteredConsultations.map((c) => {
                    const isSelected = selectedConsultation?.id === c.id;
                    const date = c.appointmentDate
                      ? new Date(`${c.appointmentDate}T00:00:00`).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Fecha desconocida";

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "p-6 flex items-start gap-4 cursor-pointer transition-all duration-200 border-l-4",
                          isSelected
                            ? "bg-blue-50/50 dark:bg-blue-900/10 border-l-celeste"
                            : "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 border-l-transparent"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-celeste/10 flex items-center justify-center text-celeste font-bold text-sm shrink-0">
                          {c.patientFirstName?.charAt(0)}
                          {c.patientLastName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm text-petroleo dark:text-white truncate">
                              {c.patientFirstName} {c.patientLastName}
                            </h4>
                            <span className="text-[10px] text-zinc-400 font-medium shrink-0 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-celeste" />
                              {date}
                            </span>
                          </div>
                          
                          {/* Diagnóstico principal */}
                          {c.diagnoses && c.diagnoses.length > 0 ? (
                            <p className="text-xs text-verde-salud font-bold mt-1 truncate">
                              {c.diagnoses[0].icd10} - {c.diagnoses[0].description}
                            </p>
                          ) : (
                            <p className="text-xs text-zinc-400 italic mt-1">Sin diagnóstico registrado</p>
                          )}

                          {/* Notas o receta */}
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                            {c.notes || "Sin observaciones adicionales."}
                          </p>

                          {/* Prescripciones indicadoras */}
                          {c.prescription?.items && c.prescription.items.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-celeste bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md w-fit">
                              <FileText className="w-3.5 h-3.5" />
                              {c.prescription.items.length}{" "}
                              {c.prescription.items.length === 1 ? "receta" : "recetas"}
                            </div>
                          )}
                        </div>
                        <ChevronRight className={cn("w-5 h-5 text-zinc-300 self-center transition-transform", isSelected && "translate-x-1 text-celeste")} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Complete Selected Consultation Details View */}
        <div className="lg:col-span-7">
          {selectedConsultation ? (
            <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-lg overflow-hidden bg-white dark:bg-zinc-950 sticky top-6">
              <CardHeader className="p-8 pb-6 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-celeste text-white flex items-center justify-center text-lg font-black shadow-md shadow-blue-200 dark:shadow-none">
                      {selectedConsultation.patientFirstName?.charAt(0)}
                      {selectedConsultation.patientLastName?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-petroleo dark:text-white leading-tight">
                        {selectedConsultation.patientFirstName} {selectedConsultation.patientLastName}
                      </h2>
                      <p className="text-xs text-zinc-400 font-semibold mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-celeste" />
                          {selectedConsultation.appointmentDate
                            ? new Date(`${selectedConsultation.appointmentDate}T00:00:00`).toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "--"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-celeste" />
                          {selectedConsultation.appointmentTime
                            ? selectedConsultation.appointmentTime.substring(0, 5)
                            : "--:--"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/doctor/consultations/${selectedConsultation.appointmentId}`}>
                    <Button variant="celeste" className="rounded-xl font-bold px-5 hover:shadow-md transition-all shrink-0">
                      Ver Workspace
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8 max-h-[700px] overflow-y-auto">
                {/* 1. Vital Signs */}
                {selectedConsultation.vitals ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" /> Signos Vitales
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        {
                          name: "Presión Arterial",
                          val: selectedConsultation.vitals.bloodPressure || "--",
                          icon: Gauge,
                          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/10",
                        },
                        {
                          name: "Frecuencia Card.",
                          val: selectedConsultation.vitals.heartRate ? `${selectedConsultation.vitals.heartRate} bpm` : "--",
                          icon: Heart,
                          color: "text-rose-500 bg-rose-50 dark:bg-rose-900/10",
                        },
                        {
                          name: "Temperatura",
                          val: selectedConsultation.vitals.temperature ? `${selectedConsultation.vitals.temperature} °C` : "--",
                          icon: Thermometer,
                          color: "text-celeste bg-blue-50 dark:bg-blue-900/10",
                        },
                        {
                          name: "Peso / Talla",
                          val: selectedConsultation.vitals.weight
                            ? `${selectedConsultation.vitals.weight}kg / ${selectedConsultation.vitals.height || "--"}cm`
                            : "--",
                          icon: Scale,
                          color: "text-tiffany bg-emerald-50 dark:bg-emerald-900/10",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/20 flex flex-col items-center text-center">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-2", item.color)}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">{item.name}</p>
                          <p className="text-sm font-bold text-petroleo dark:text-white mt-1">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-400 italic">
                    No se registraron signos vitales en esta consulta.
                  </div>
                )}

                {/* 2. Diagnoses */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-celeste" /> Diagnóstico Clínico
                  </h3>
                  {selectedConsultation.diagnoses && selectedConsultation.diagnoses.length > 0 ? (
                    <div className="space-y-3">
                      {selectedConsultation.diagnoses.map((diag) => (
                        <div
                          key={diag.id}
                          className="flex items-start gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10"
                        >
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border",
                            diag.type === "PRIMARY" || diag.type === "PRINCIPAL"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10"
                              : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10"
                          )}>
                            {diag.type === "PRIMARY" || diag.type === "PRINCIPAL" ? "Principal" : "Secundario"}
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
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-400 italic">
                      No se registraron diagnósticos específicos.
                    </div>
                  )}
                </div>

                {/* 3. Clinical Notes */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" /> Notas Evolutivas / Observaciones
                  </h3>
                  <div className="p-5 rounded-2xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/10 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedConsultation.notes || "Sin observaciones registradas."}
                  </div>
                </div>

                {/* 4. Prescription */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-tiffany" /> Receta de Medicamentos
                  </h3>
                  {selectedConsultation.prescription &&
                  selectedConsultation.prescription.items &&
                  selectedConsultation.prescription.items.length > 0 ? (
                    <div className="space-y-4">
                      {selectedConsultation.prescription.notes && (
                        <p className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                          <span className="font-bold text-zinc-600 dark:text-zinc-300 block mb-1">Notas del Médico:</span>
                          {selectedConsultation.prescription.notes}
                        </p>
                      )}
                      <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800">
                              <th className="p-4">Medicamento</th>
                              <th className="p-4">Dosis</th>
                              <th className="p-4">Frecuencia</th>
                              <th className="p-4">Duración</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-zinc-600 dark:text-zinc-300">
                            {selectedConsultation.prescription.items.map((item) => (
                              <tr key={item.id} className="hover:bg-zinc-50/20">
                                <td className="p-4 font-bold text-petroleo dark:text-white">
                                  {item.medicationName}
                                  {item.instructions && (
                                    <span className="text-[10px] text-zinc-400 font-normal block mt-1 flex items-center gap-1">
                                      <CornerDownRight className="w-3 h-3 text-celeste" />
                                      {item.instructions}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">{item.dosage}</td>
                                <td className="p-4">{item.frequency}</td>
                                <td className="p-4">{item.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 text-center text-xs text-zinc-400 italic">
                      No se prescribieron medicamentos en esta consulta.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
              <ClipboardList className="w-16 h-16 text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-petroleo dark:text-zinc-300">Selecciona una consulta</h3>
              <p className="text-sm text-zinc-400 mt-1 max-w-[250px] text-center">
                Elige una consulta de la lista izquierda para visualizar su informe detallado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
