"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import {
  useConsultationByAppointment,
  useCreateConsultation,
  useCompleteConsultation,
} from "@/modules/domain/clinical/hooks/useConsultation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  ArrowLeft,
  Activity,
  Stethoscope,
  Pill,
  AlertTriangle,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";

const parseDiagnosis = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^([A-Z]\d{2}(?:\.\d)?)\s+(.+)$/i);
  if (match) {
    return {
      icd10: match[1].toUpperCase(),
      description: match[2],
      type: "PRIMARY",
    };
  }
  if (/^[A-Z]\d{2}(?:\.\d)?$/i.test(trimmed)) {
    return {
      icd10: trimmed.toUpperCase(),
      description: "Diagnóstico registrado",
      type: "PRIMARY",
    };
  }
  return {
    icd10: "R69",
    description: trimmed,
    type: "PRIMARY",
  };
};

const mapSeverity = (sev: string): string => {
  switch (sev) {
    case "LEVE":
      return "LOW";
    case "MODERADA":
      return "MEDIUM";
    case "SEVERA":
      return "HIGH";
    default:
      return "LOW";
  }
};

const mapSeverityToUI = (sev: string): string => {
  switch (sev) {
    case "LOW":
      return "LEVE";
    case "MEDIUM":
      return "MODERADA";
    case "HIGH":
      return "SEVERA";
    default:
      return "LEVE";
  }
};

export default function ConsultationWorkspace() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  // En un caso real habría un useAppointmentById. Por ahora filtramos de la lista global
  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useAppointments({ size: 100, page: 0 });

  const appointment = useMemo(() => {
    return appointmentsData?.data?.content?.find((a) => a.id === appointmentId);
  }, [appointmentsData, appointmentId]);

  // Consultations API Hooks
  const {
    data: consultationRes,
    error: consultationError,
    isLoading: isLoadingConsultation,
  } = useConsultationByAppointment(appointmentId);

  const createConsultationMutation = useCreateConsultation();
  const [consultationId, setConsultationId] = useState<string | null>(null);

  // Estados Locales
  const [activeTab, setActiveTab] = useState("resumen");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Formularios de estado
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [vitals, setVitals] = useState({
    weight: "",
    height: "",
    pressure: "",
    temperature: "",
    hr: "",
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { name: "", dose: "", frequency: "", duration: "" },
  ]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [allergies, setAllergies] = useState([{ type: "", severity: "LEVE" }]);

  // Guard state to track if consultation data has been loaded into form state
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to load or auto-create consultation
  useEffect(() => {
    if (!isLoadingConsultation && !isLoaded) {
      if (consultationRes?.data?.id) {
        const c = consultationRes.data;
        // Defer state updates asynchronously to avoid synchronous cascading renders
        setTimeout(() => {
          setConsultationId(c.id);
          setClinicalNotes(c.notes || "");

          if (c.vitals) {
            setVitals({
              weight: c.vitals.weight?.toString() || "",
              height: c.vitals.height?.toString() || "",
              pressure: c.vitals.bloodPressure || "",
              temperature: c.vitals.temperature?.toString() || "",
              hr: c.vitals.heartRate?.toString() || "",
            });
          }

          if (c.status === "COMPLETED") {
            setIsCompleted(true);
          }

          if (c.diagnoses && c.diagnoses.length > 0) {
            const d = c.diagnoses[0];
            setDiagnosis(`${d.icd10} ${d.description}`);
          }

          if (c.prescription) {
            setPrescriptionNotes(c.prescription.notes || "");
            setPrescriptions(
              c.prescription.items?.map((item) => ({
                name: item.medicationName || "",
                dose: item.dosage || "",
                frequency: item.frequency || "",
                duration: item.duration || "",
              })) || [],
            );
          }
          setIsLoaded(true);
        }, 0);
      } else if (
        (consultationError || !consultationRes) &&
        !consultationId &&
        !createConsultationMutation.isPending &&
        !createConsultationMutation.isSuccess
      ) {
        createConsultationMutation.mutate(
          { appointmentId, notes: "" },
          {
            onSuccess: (newRes) => {
              setTimeout(() => {
                setConsultationId(newRes.data.id);
                setIsLoaded(true);
              }, 0);
            },
          },
        );
      }
    }
  }, [
    consultationRes,
    consultationError,
    isLoadingConsultation,
    isLoaded,
    consultationId,
    appointmentId,
  ]);

  const addPrescription = () =>
    setPrescriptions([
      ...prescriptions,
      { name: "", dose: "", frequency: "", duration: "" },
    ]);
  const removePrescription = (idx: number) =>
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));

  const addAllergy = () =>
    setAllergies([...allergies, { type: "", severity: "LEVE" }]);
  const removeAllergy = (idx: number) =>
    setAllergies(allergies.filter((_, i) => i !== idx));

  const completeMutation = useCompleteConsultation(consultationId || "");

  const handleFinishConsultation = () => {
    if (!consultationId) {
      toast.error("La consulta no se ha iniciado correctamente.");
      return;
    }

    const hasVitals =
      vitals.weight ||
      vitals.height ||
      vitals.pressure ||
      vitals.temperature ||
      vitals.hr;
    const parsedVitals = hasVitals
      ? {
          weight: vitals.weight ? parseFloat(vitals.weight) : 0,
          height: vitals.height ? parseFloat(vitals.height) : 0,
          bloodPressure: vitals.pressure || "",
          temperature: vitals.temperature ? parseFloat(vitals.temperature) : 0,
          heartRate: vitals.hr ? parseInt(vitals.hr, 10) : 0,
        }
      : undefined;

    const parsedDiagnosis = parseDiagnosis(diagnosis);

    const validPrescriptions = prescriptions.filter(
      (p) => p.name.trim() !== "",
    );
    const parsedPrescription =
      validPrescriptions.length > 0
        ? {
            notes: prescriptionNotes || "Receta médica de la consulta",
            items: validPrescriptions.map((p) => ({
              medicationName: p.name,
              dosage: p.dose,
              frequency: p.frequency,
              duration: p.duration,
              instructions: p.dose,
            })),
          }
        : undefined;

    const validAllergies = allergies.filter((a) => a.type.trim() !== "");
    const parsedAllergies = validAllergies.map((a) => ({
      type: a.type,
      severity: mapSeverity(a.severity),
    }));

    setIsSaving(true);
    completeMutation.mutate(
      {
        notes: clinicalNotes,
        vitals: parsedVitals,
        diagnosis: parsedDiagnosis || undefined,
        prescription: parsedPrescription,
        allergies: parsedAllergies.length > 0 ? parsedAllergies : undefined,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsCompleted(true);
        },
        onError: () => {
          setIsSaving(false);
        },
      },
    );
  };

  const showLoading =
    isLoadingAppointments ||
    (isLoadingConsultation && !consultationRes && !consultationError) ||
    createConsultationMutation.isPending;

  if (showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-12 h-12 text-celeste" />
        <p className="text-zinc-500 font-bold">
          Cargando expediente clínico...
        </p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-16 h-16 text-amber-400" />
        <h3 className="text-xl font-bold text-petroleo dark:text-white">
          Cita no encontrada
        </h3>
        <Button onClick={() => router.back()} variant="outline">
          Volver a la Agenda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header del Espacio de Trabajo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-900 shadow-sm">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="w-12 h-12 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-petroleo shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border-[3px] border-white dark:border-zinc-900 shadow-sm flex items-center justify-center text-zinc-400">
              <span className="font-black text-xl text-celeste">
                {appointment.patientFirstName.charAt(0)}
                {appointment.patientLastName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-petroleo dark:text-white tracking-tight leading-none mb-1">
                {appointment.patientFirstName} {appointment.patientLastName}
              </h1>
              <div className="flex items-center gap-3 text-sm font-bold text-zinc-500">
                <span className="text-verde-salud">
                  {appointment.reason || "Consulta General"}
                </span>
                <span>•</span>
                <span>
                  CITA #{appointment.id.substring(0, 8).toUpperCase()}
                </span>
                <span>•</span>
                <span>
                  {new Date(
                    `${appointment.appointmentDate}T00:00:00`,
                  ).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              Consulta Finalizada
            </div>
          ) : (
            <Button
              variant="celeste"
              onClick={handleFinishConsultation}
              disabled={isSaving}
              className="rounded-xl px-8 py-6 font-bold shadow-md hover:shadow-lg transition-all text-base gap-2"
            >
              {isSaving ? (
                <Spinner className="w-5 h-5 text-white" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? "Guardando..." : "Finalizar Consulta"}
            </Button>
          )}
        </div>
      </div>

      {/* Workspace Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full !h-auto p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-8">
          {[
            { id: "resumen", label: "Historia Clínica", icon: Stethoscope },
            { id: "vitals", label: "Signos Vitales", icon: Activity },
            { id: "receta", label: "Diagnóstico y Receta", icon: Pill },
            { id: "alergias", label: "Alergias", icon: AlertTriangle },
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

        {/* CONTENIDO: HISTORIA CLINICA */}
        <TabsContent value="resumen" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-xl font-bold text-petroleo flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-celeste" />
                Notas de la Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-zinc-500 mb-2 block uppercase tracking-widest">
                    Motivo principal y evolución
                  </label>
                  <textarea
                    placeholder="Describa los síntomas principales, duración, intensidad y evolución documentada por el paciente..."
                    className="min-h-[250px] resize-none rounded-2xl p-6 text-base bg-zinc-50 border border-zinc-200 focus-visible:ring-celeste focus:outline-none focus:ring-2 w-full"
                    value={clinicalNotes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setClinicalNotes(e.target.value)
                    }
                    disabled={isCompleted}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENIDO: SIGNOS VITALES */}
        <TabsContent value="vitals" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-xl font-bold text-petroleo flex items-center gap-2">
                <Activity className="w-6 h-6 text-celeste" />
                Registro de Signos Vitales
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: "weight", label: "Peso (kg)", placeholder: "Ej. 75.5" },
                  {
                    id: "height",
                    label: "Altura (cm)",
                    placeholder: "Ej. 175",
                  },
                  {
                    id: "pressure",
                    label: "Presión Arterial",
                    placeholder: "Ej. 120/80",
                  },
                  {
                    id: "temperature",
                    label: "Temp (°C)",
                    placeholder: "Ej. 37.2",
                  },
                  {
                    id: "hr",
                    label: "Frecuencia Cardíaca",
                    placeholder: "Ej. 80 bpm",
                  },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      {field.label}
                    </label>
                    <Input
                      placeholder={field.placeholder}
                      className="rounded-xl h-14 bg-zinc-50 border-zinc-200"
                      value={vitals[field.id as keyof typeof vitals]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setVitals({ ...vitals, [field.id]: e.target.value })
                      }
                      disabled={isCompleted}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENIDO: RECETA Y DIAGNOSTICO */}
        <TabsContent value="receta" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white h-full">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="text-lg font-bold text-petroleo">
                    Diagnóstico Médico
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <textarea
                    placeholder="Código CIE-10 o descripción del diagnóstico (Ej. J02.9 Faringitis Aguda)..."
                    className="min-h-[150px] resize-none rounded-2xl p-4 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus-visible:ring-celeste w-full"
                    value={diagnosis}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDiagnosis(e.target.value)
                    }
                    disabled={isCompleted}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white">
                <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between border-b border-zinc-50 pb-6 mb-6">
                  <CardTitle className="text-xl font-bold text-petroleo flex items-center gap-2">
                    <Pill className="w-6 h-6 text-celeste" />
                    Receta Médica
                  </CardTitle>
                  {!isCompleted && (
                    <Button
                      onClick={addPrescription}
                      variant="outline"
                      className="rounded-xl font-bold border-zinc-200"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Agregar Medicamento
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-4">
                  {prescriptions.length === 0 && (
                    <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                      <p className="text-zinc-500 font-bold">
                        No se han añadido medicamentos a la receta.
                      </p>
                    </div>
                  )}
                  {prescriptions.map((presc, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 group transition-all"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-4 w-full">
                        <Input
                          placeholder="Medicamento (Ej. Paracetamol)"
                          className="sm:col-span-2 bg-white"
                          value={presc.name}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newP = [...prescriptions];
                            newP[idx].name = e.target.value;
                            setPrescriptions(newP);
                          }}
                          disabled={isCompleted}
                        />
                        <Input
                          placeholder="Dosis (Ej. 500mg)"
                          className="bg-white"
                          value={presc.dose}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newP = [...prescriptions];
                            newP[idx].dose = e.target.value;
                            setPrescriptions(newP);
                          }}
                          disabled={isCompleted}
                        />
                        <Input
                          placeholder="Frecuencia (Ej. c/ 8 hrs)"
                          className="bg-white"
                          value={presc.frequency}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newP = [...prescriptions];
                            newP[idx].frequency = e.target.value;
                            setPrescriptions(newP);
                          }}
                          disabled={isCompleted}
                        />
                        <Input
                          placeholder="Duración (Ej. 5 días)"
                          className="bg-white"
                          value={presc.duration}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newP = [...prescriptions];
                            newP[idx].duration = e.target.value;
                            setPrescriptions(newP);
                          }}
                          disabled={isCompleted}
                        />
                      </div>
                      {!isCompleted && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePrescription(idx)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Notas de la Receta */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900/60 mt-6 space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
                      Indicaciones / Notas de la Receta
                    </label>
                    <textarea
                      placeholder="Instrucciones adicionales para la receta médica (Ej. Tomar con abundante agua, evitar alcohol...)"
                      className="min-h-[100px] resize-none rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-celeste focus:outline-none focus:ring-2 w-full text-sm font-medium"
                      value={prescriptionNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setPrescriptionNotes(e.target.value)
                      }
                      disabled={isCompleted}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* CONTENIDO: ALERGIAS */}
        <TabsContent value="alergias" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-red-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between border-b border-zinc-50 pb-6 mb-6">
              <CardTitle className="text-xl font-bold text-petroleo flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Registro de Alergias
              </CardTitle>
              {!isCompleted && (
                <Button
                  onClick={addAllergy}
                  variant="outline"
                  className="rounded-xl font-bold border-zinc-200"
                >
                  <Plus className="w-4 h-4 mr-2" /> Agregar Alergia
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              {allergies.map((allergy, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100"
                >
                  <div className="flex-1 flex gap-4 w-full">
                    <Input
                      placeholder="Tipo de Alergia o Medicamento (Ej. Penicilina)"
                      className="bg-white border-red-100 focus-visible:ring-red-400"
                      value={allergy.type}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newA = [...allergies];
                        newA[idx].type = e.target.value;
                        setAllergies(newA);
                      }}
                      disabled={isCompleted}
                    />
                    <select
                      className="px-4 rounded-xl border border-red-100 bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                      value={allergy.severity}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newA = [...allergies];
                        newA[idx].severity = e.target.value;
                        setAllergies(newA);
                      }}
                      disabled={isCompleted}
                    >
                      <option value="LEVE">LEVE</option>
                      <option value="MODERADA">MODERADA</option>
                      <option value="SEVERA">SEVERA</option>
                    </select>
                  </div>
                  {!isCompleted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAllergy(idx)}
                      className="text-red-400 hover:text-red-600 hover:bg-white rounded-xl shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
