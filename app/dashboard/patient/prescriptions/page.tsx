"use client";

import { useSession } from "next-auth/react";
import { usePatients } from "@/modules/domain/user/patient/hooks/usePatients";
import { usePatientMedicalHistory } from "@/modules/domain/user/patient/hooks/usePatientMedicalHistory";
import { 
  ChevronRight, 
  Pill, 
  Search, 
  CalendarDays, 
  Stethoscope, 
  Clock, 
  FileText, 
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

export default function PatientPrescriptionsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1. Obtener los detalles del Paciente a partir del userId de la sesión
  const { data: patientData, isLoading: isLoadingPatient } = usePatients(
    userId ? { userId: String(userId), size: 1 } : {}
  );
  
  const patient = patientData?.data?.content?.[0];
  const patientId = patient?.id;

  // 2. Obtener el historial médico del paciente (que contiene las recetas)
  const { data: historyData, isLoading: isLoadingHistory, error } = usePatientMedicalHistory(
    patientId || ""
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const prescriptions = useMemo(() => {
    return historyData?.data?.prescriptions ?? [];
  }, [historyData]);

  // Filtrar y ordenar recetas
  const filteredPrescriptions = useMemo(() => {
    let result = [...prescriptions];

    // Búsqueda por doctor o medicamento
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((presc) => {
        const docName = `${presc.doctorFirstName || ""} ${presc.doctorLastName || ""}`.toLowerCase();
        const docSpecialty = (presc.doctorSpecialty || "").toLowerCase();
        const hasMatchingMed = presc.items?.some((item) => 
          item.medicationName.toLowerCase().includes(term) ||
          (item.instructions || "").toLowerCase().includes(term)
        );
        return docName.includes(term) || docSpecialty.includes(term) || hasMatchingMed;
      });
    }

    // Ordenamiento por fecha
    result.sort((a, b) => {
      const dateA = new Date(a.issueDate).getTime();
      const dateB = new Date(b.issueDate).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [prescriptions, searchTerm, sortBy]);

  const isLoading = isLoadingPatient || isLoadingHistory;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest">
            <span>Inicio</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-petroleo">Mis recetas</span>
          </nav>
          <h1 className="text-4xl font-black text-petroleo dark:text-white tracking-tight">
            Mis recetas médicas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Revisa las recetas emitidas por tus doctores, con las indicaciones de medicamentos y dosis.
          </p>
        </div>
      </div>

      {/* Controles de Búsqueda y Ordenamiento */}
      {patientId && prescriptions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900/40 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Buscar por médico, especialidad o medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-6 rounded-2xl border-zinc-200 focus-visible:ring-celeste bg-zinc-50/50 dark:bg-zinc-950/50"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
              className="rounded-2xl px-5 py-6 font-bold flex items-center gap-2 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 hover:text-petroleo"
            >
              <ArrowUpDown className="w-4 h-4 text-celeste" />
              Ordenar: {sortBy === "newest" ? "Más recientes" : "Más antiguas"}
            </Button>
          </div>
        </div>
      )}

      {/* Listado de Recetas */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner className="w-12 h-12 text-celeste" />
          <p className="text-zinc-500 font-bold text-sm">Cargando tus recetas médicas...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-red-200 dark:border-red-900/55 p-8 gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="font-bold text-lg text-petroleo dark:text-white">Error al cargar recetas</h3>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            Hubo un problema al conectar con el servidor médico. Por favor, intenta de nuevo más tarde.
          </p>
        </div>
      ) : !patientId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 p-8">
          <h3 className="font-bold text-lg text-petroleo dark:text-white">No se encontró perfil de paciente</h3>
          <p className="text-zinc-400 text-sm mt-1 max-w-sm text-center font-medium">
            No se pudo encontrar un perfil de paciente vinculado a tu cuenta de usuario.
          </p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 p-8">
          <div className="w-20 h-20 bg-blanco-azulado dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
            <Pill className="w-10 h-10 text-celeste" />
          </div>
          <h3 className="font-bold text-xl text-petroleo dark:text-white">Aún no tienes recetas médicas</h3>
          <p className="text-zinc-400 text-sm mt-2 max-w-md text-center font-medium">
            Cuando asistas a tus consultas médicas, los doctores registrarán tus recetas y aparecerán automáticamente aquí.
          </p>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 p-8">
          <h3 className="font-bold text-lg text-petroleo dark:text-white">No se encontraron resultados</h3>
          <p className="text-zinc-400 text-sm mt-1 max-w-md text-center font-medium">
            No encontramos recetas que coincidan con la búsqueda: &ldquo;{searchTerm}&rdquo;
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredPrescriptions.map((presc) => {
            const issueDateObj = new Date(presc.issueDate);
            const formattedIssueDate = issueDateObj.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            // Doctor full name and specialty
            const doctorName = presc.doctorFirstName && presc.doctorLastName 
              ? `Dr. ${presc.doctorFirstName} ${presc.doctorLastName}`
              : "Médico Especialista";
            const specialty = presc.doctorSpecialty || "Medicina General";

            // Appointment date and time
            let appointmentDetails = null;
            if (presc.appointmentDate) {
              const appDateObj = new Date(presc.appointmentDate + "T00:00:00");
              const formattedAppDate = appDateObj.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const formattedTime = presc.appointmentTime 
                ? presc.appointmentTime.substring(0, 5) 
                : "";
              appointmentDetails = `${formattedAppDate} ${formattedTime ? `a las ${formattedTime}` : ""}`;
            }

            return (
              <Card 
                key={presc.id} 
                className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 hover:shadow-md transition-all duration-300"
              >
                {/* Cabecera Premium */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-blanco-azulado/40 to-transparent dark:from-zinc-900/25 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-celeste/10 text-celeste rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
                        <Stethoscope className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-xl font-black text-petroleo dark:text-white leading-tight">
                            {doctorName}
                          </h2>
                          <span className="text-[10px] font-bold text-celeste bg-celeste/10 dark:bg-blue-900/35 px-3 py-1 rounded-full uppercase tracking-wider">
                            {specialty}
                          </span>
                        </div>
                        {appointmentDetails && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5 mt-1">
                            <CalendarDays className="w-3.5 h-3.5 text-[#64748b]" />
                            Consulta asociada: <span className="text-petroleo/80 dark:text-zinc-300 font-black capitalize">{appointmentDetails}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-900 pt-4 lg:pt-0">
                      <span className="text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 rounded-2xl">
                        ID: {presc.id.substring(0, 8).toUpperCase()}
                      </span>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        Emitido el {formattedIssueDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contenido / Tabla de medicamentos */}
                <div className="p-6 md:p-8 space-y-6">
                  {presc.notes && (
                    <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-500/10 flex items-start gap-3">
                      <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">
                          Indicaciones adicionales del doctor
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 italic font-semibold leading-relaxed">
                          &ldquo;{presc.notes}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="overflow-hidden border border-zinc-100 dark:border-zinc-850 rounded-[1.8rem] bg-white dark:bg-zinc-950 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[10px] w-1/3">
                              Medicamento
                            </th>
                            <th className="px-6 py-4 font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[10px]">
                              Dosis
                            </th>
                            <th className="px-6 py-4 font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[10px]">
                              Frecuencia
                            </th>
                            <th className="px-6 py-4 font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[10px]">
                              Duración
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                          {presc.items?.map((med, mIdx) => (
                            <tr key={mIdx} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                              <td className="px-6 py-4.5">
                                <div className="space-y-1">
                                  <div className="font-extrabold text-petroleo dark:text-white flex items-center gap-2">
                                    <Pill className="w-4 h-4 text-celeste shrink-0" />
                                    {med.medicationName}
                                  </div>
                                  {med.instructions && (
                                    <p className="text-xs text-zinc-400 font-medium pl-6">
                                      Instrucciones: {med.instructions}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4.5 font-bold text-zinc-700 dark:text-zinc-300">
                                {med.dosage}
                              </td>
                              <td className="px-6 py-4.5 font-bold text-zinc-700 dark:text-zinc-300">
                                {med.frequency}
                              </td>
                              <td className="px-6 py-4.5">
                                <span className="inline-flex items-center justify-center font-black text-celeste bg-celeste/10 px-3 py-1 rounded-xl text-xs">
                                  {med.duration}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
