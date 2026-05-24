"use client";

import { useParams, useRouter } from "next/navigation";
import { usePatientMedicalHistory } from "@/modules/domain/user/patient/hooks/usePatientMedicalHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FlaskConical,
  Pill,
  Clock,
  User,
  Heart,
  FileText,
  Activity,
  Layers,
  FileHeart,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [activeTab, setActiveTab] = useState("timeline");

  const { data: medicalHistoryRes, isLoading, error } = usePatientMedicalHistory(patientId);

  const medicalHistory = medicalHistoryRes?.data;
  const patient = medicalHistory?.patient;
  const allergies = medicalHistory?.allergies || [];
  const prescriptions = medicalHistory?.prescriptions || [];
  const labOrders = medicalHistory?.labOrders || [];

  // Calculate age from birthDate
  const age = useMemo(() => {
    if (!patient?.birthDate) return null;
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [patient?.birthDate]);

  // Combine prescriptions and lab orders into a single sorted timeline
  const timelineItems = useMemo(() => {
    const items: Array<
      | { type: "prescription"; date: string; data: any }
      | { type: "labOrder"; date: string; data: any }
    > = [];

    prescriptions.forEach((p) => {
      items.push({
        type: "prescription",
        date: p.issueDate,
        data: p,
      });
    });

    labOrders.forEach((l) => {
      items.push({
        type: "labOrder",
        date: l.orderedAt,
        data: l,
      });
    });

    // Sort by date descending
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [prescriptions, labOrders]);

  const severityBadgeColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "HIGH":
      case "SEVERA":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
      case "MEDIUM":
      case "MODERADA":
        return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
      default:
        return "bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30";
    }
  };

  const severityLabel = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "HIGH":
        return "SEVERA";
      case "MEDIUM":
        return "MODERADA";
      case "LOW":
        return "LEVE";
      default:
        return severity || "LEVE";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-12 h-12 text-celeste" />
        <p className="text-zinc-500 font-bold">Cargando perfil e historial médico...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-16 h-16 text-amber-500 animate-pulse" />
        <h3 className="text-xl font-bold text-petroleo dark:text-white">Paciente no encontrado</h3>
        <p className="text-zinc-500 text-sm max-w-md text-center">
          No se pudo recuperar la información del paciente. Por favor, verifica el ID o intenta de nuevo.
        </p>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl mt-2">
          Volver al Directorio
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Back Button and Actions Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-petroleo shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-petroleo dark:text-white tracking-tight">
            Perfil del Paciente
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
            Historial Médico y Diagnósticos
          </p>
        </div>
      </div>

      {/* Patient Basic Info Card */}
      <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar / Initials */}
            <div className="w-24 h-24 rounded-3xl bg-blanco-azulado dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 flex items-center justify-center text-3xl font-black text-celeste shadow-sm shrink-0">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>

            {/* Info Grid */}
            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-petroleo dark:text-white leading-tight">
                    {patient.firstName} {patient.lastName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-zinc-500 mt-1">
                    <span className="text-celeste uppercase">{patient.gender === "MALE" ? "Masculino" : patient.gender === "FEMALE" ? "Femenino" : patient.gender}</span>
                    <span>•</span>
                    <span>DNI: {patient.documentNumber}</span>
                    <span>•</span>
                    <span>{age !== null ? `${age} años` : "Edad no especificada"}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${
                      patient.status === "ACTIVE"
                        ? "bg-[#ecfdf5] text-[#059669] border-[#d1fae5] dark:bg-green-900/20 dark:text-green-400"
                        : "bg-[#fff7ed] text-[#d97706] border-[#ffedd5] dark:bg-amber-900/20 dark:text-amber-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${patient.status === "ACTIVE" ? "bg-[#059669]" : "bg-[#d97706]"}`}
                    ></span>
                    {patient.status === "ACTIVE" ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                    <Mail className="w-4 h-4 text-celeste" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-petroleo dark:text-white break-all">{patient.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                    <Phone className="w-4 h-4 text-celeste" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Teléfono</p>
                    <p className="text-sm font-bold text-petroleo dark:text-white">{patient.phone || "No registrado"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                    <MapPin className="w-4 h-4 text-celeste" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Dirección</p>
                    <p className="text-sm font-bold text-petroleo dark:text-white truncate max-w-[200px]" title={patient.address}>
                      {patient.address || "No registrada"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Antecedentes / Medical History Notes */}
              {patient.medicalHistory && (
                <div className="p-5 bg-blanco-azulado/50 dark:bg-zinc-900/50 rounded-2xl border border-blue-50/50 dark:border-zinc-800/50 mt-4">
                  <p className="text-[10px] font-bold text-celeste uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <FileHeart className="w-4 h-4" /> Antecedentes Médicos / Historia Clínica General
                  </p>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {patient.medicalHistory}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Menu */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full !h-auto p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-8">
          {[
            { id: "timeline", label: "Historial General", icon: Clock },
            { id: "allergies", label: "Alergias", icon: AlertTriangle },
            { id: "prescriptions", label: "Recetas Médicas", icon: Pill },
            { id: "labs", label: "Laboratorios", icon: FlaskConical },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-celeste data-[state=active]:shadow-sm rounded-xl py-3 font-bold transition-all gap-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* TAB 1: HISTORIAL GENERAL / TIMELINE */}
        <TabsContent value="timeline" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 p-8">
            <h3 className="text-xl font-black text-petroleo dark:text-white mb-8 flex items-center gap-2">
              <Clock className="w-6 h-6 text-celeste" /> Línea de Tiempo del Paciente
            </h3>

            {timelineItems.length > 0 ? (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-150 dark:border-zinc-800 space-y-10 ml-4 py-2">
                {timelineItems.map((item, idx) => {
                  const isPrescription = item.type === "prescription";
                  const dateObj = new Date(item.date);
                  const formattedDate = dateObj.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <span className={`absolute -left-[39px] sm:-left-[47px] top-0.5 rounded-2xl w-9 h-9 flex items-center justify-center shadow-sm border ${
                        isPrescription
                          ? "bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30"
                          : "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30"
                      }`}>
                        {isPrescription ? <Pill className="w-4.5 h-4.5" /> : <FlaskConical className="w-4.5 h-4.5" />}
                      </span>

                      {/* Timeline Content */}
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-900/80 hover:shadow-sm transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              isPrescription
                                ? "bg-amber-100/40 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-blue-100/40 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400"
                            }`}>
                              {isPrescription ? "Receta Médica" : "Laboratorio"}
                            </span>
                            <span className="text-xs font-bold text-zinc-400">
                              {formattedDate} a las {formattedTime}
                            </span>
                          </div>
                        </div>

                        {isPrescription ? (
                          <div className="space-y-4">
                            {item.data.notes && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium italic">
                                &ldquo;{item.data.notes}&rdquo;
                              </p>
                            )}
                            <div className="overflow-hidden border border-zinc-200/50 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-4 py-3 font-bold text-zinc-500">Medicamento</th>
                                    <th className="px-4 py-3 font-bold text-zinc-500">Dosis</th>
                                    <th className="px-4 py-3 font-bold text-zinc-500">Frecuencia</th>
                                    <th className="px-4 py-3 font-bold text-zinc-500">Duración</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                  {item.data.items?.map((med: any, mIdx: number) => (
                                    <tr key={mIdx}>
                                      <td className="px-4 py-3 font-bold text-petroleo dark:text-white">{med.medicationName}</td>
                                      <td className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">{med.dosage}</td>
                                      <td className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">{med.frequency}</td>
                                      <td className="px-4 py-3 font-bold text-celeste">{med.duration}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-base font-bold text-petroleo dark:text-white">
                                  {item.data.name}
                                </h4>
                                <p className="text-xs text-zinc-400 font-semibold mt-0.5 uppercase tracking-wider">
                                  Tipo: {item.data.type}
                                </p>
                              </div>
                              <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border ${
                                item.data.status === "COMPLETED"
                                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400"
                                  : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"
                              }`}>
                                {item.data.status === "COMPLETED" ? "COMPLETADO" : "PENDIENTE"}
                              </span>
                            </div>

                            {item.data.resultDetails && (
                              <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
                                <p className="text-[10px] font-black text-celeste uppercase tracking-widest mb-1.5">
                                  Resultados / Informe de Laboratorio
                                </p>
                                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 leading-relaxed whitespace-pre-line">
                                  {item.data.resultDetails}
                                </p>
                                {item.data.resultRecordedAt && (
                                  <p className="text-[10px] text-zinc-400 font-medium mt-2">
                                    Registrado el: {new Date(item.data.resultRecordedAt).toLocaleDateString("es-ES", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <FileText className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No se registran eventos médicos (recetas o laboratorios) para este paciente.</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 2: ALERGIAS */}
        <TabsContent value="allergies" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-red-50 dark:border-red-950/20 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 p-8">
            <h3 className="text-xl font-black text-petroleo dark:text-white mb-8 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" /> Alergias Documentadas
            </h3>

            {allergies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allergies.map((allergy) => (
                  <Card key={allergy.id} className="rounded-2xl border-zinc-150 dark:border-zinc-850 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="text-lg font-black text-petroleo dark:text-white">{allergy.type}</h4>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Tipo: {allergy.reaction ? allergy.reaction : "No especificado"}</p>
                        </div>
                        <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border ${severityBadgeColor(allergy.severity)}`}>
                          {severityLabel(allergy.severity)}
                        </span>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Alergeno registrado para seguimiento médico continuo en consultas y prescripciones.
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-red-50/20 dark:bg-red-950/5 rounded-[2rem] border border-dashed border-red-100 dark:border-red-900/30">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No se registran alergias para este paciente.</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 3: RECETAS MEDICAS */}
        <TabsContent value="prescriptions" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 p-8">
            <h3 className="text-xl font-black text-petroleo dark:text-white mb-8 flex items-center gap-2">
              <Pill className="w-6 h-6 text-celeste" /> Historial de Recetas Médicas
            </h3>

            {prescriptions.length > 0 ? (
              <div className="space-y-6">
                {prescriptions.map((presc) => {
                  const dateObj = new Date(presc.issueDate);
                  const formattedDate = dateObj.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  return (
                    <div key={presc.id} className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-900">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/50 dark:border-zinc-800 pb-4 mb-4">
                        <div className="flex items-center gap-2.5">
                          <Pill className="w-5 h-5 text-amber-500" />
                          <h4 className="font-black text-petroleo dark:text-white text-base">Receta emitida el {formattedDate}</h4>
                        </div>
                        <span className="text-xs font-bold text-zinc-400 bg-zinc-200/40 dark:bg-zinc-800 px-3 py-1 rounded-xl">
                          ID: {presc.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>

                      {presc.notes && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mb-4 font-medium">
                          Notas: &ldquo;{presc.notes}&rdquo;
                        </p>
                      )}

                      <div className="overflow-hidden border border-zinc-200/50 dark:border-zinc-850 rounded-xl bg-white dark:bg-zinc-950">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800">
                              <th className="px-4 py-3 font-bold text-zinc-500">Medicamento</th>
                              <th className="px-4 py-3 font-bold text-zinc-500">Dosis</th>
                              <th className="px-4 py-3 font-bold text-zinc-500">Frecuencia</th>
                              <th className="px-4 py-3 font-bold text-zinc-500">Duración</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-850">
                            {presc.items?.map((med: any, mIdx: number) => (
                              <tr key={mIdx}>
                                <td className="px-4 py-3 font-bold text-petroleo dark:text-white">{med.medicationName}</td>
                                <td className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">{med.dosage}</td>
                                <td className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">{med.frequency}</td>
                                <td className="px-4 py-3 font-bold text-celeste">{med.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <Pill className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No se registran recetas médicas para este paciente.</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 4: LABORATORIOS */}
        <TabsContent value="labs" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 p-8">
            <h3 className="text-xl font-black text-petroleo dark:text-white mb-8 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-celeste" /> Órdenes e Informes de Laboratorio
            </h3>

            {labOrders.length > 0 ? (
              <div className="space-y-6">
                {labOrders.map((lab) => {
                  const dateObj = new Date(lab.orderedAt);
                  const formattedDate = dateObj.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  return (
                    <div key={lab.id} className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-900">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-250/50 dark:border-zinc-800 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <FlaskConical className="w-5 h-5 text-blue-500" />
                            <h4 className="font-black text-petroleo dark:text-white text-base">{lab.name}</h4>
                          </div>
                          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                            Tipo de Prueba: {lab.type} | Ordenado el {formattedDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border ${
                            lab.status === "COMPLETED"
                              ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400"
                              : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"
                          }`}>
                            {lab.status === "COMPLETED" ? "COMPLETADO" : "PENDIENTE"}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-200/40 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                            ID: {lab.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {lab.resultDetails ? (
                        <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-850/80">
                          <p className="text-[10px] font-black text-celeste uppercase tracking-widest mb-2">
                            Resultados del Laboratorio
                          </p>
                          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                            {lab.resultDetails}
                          </p>
                          {lab.resultRecordedAt && (
                            <p className="text-[10px] text-zinc-400 font-bold mt-3 border-t border-zinc-50 pt-2 flex justify-end">
                              Fecha de Registro: {new Date(lab.resultRecordedAt).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50/30 dark:bg-amber-950/5 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl border border-amber-100/50 dark:border-amber-900/20">
                          El resultado de esta orden de laboratorio se encuentra en proceso de análisis por el personal médico.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <FlaskConical className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No se registran órdenes de laboratorio para este paciente.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
