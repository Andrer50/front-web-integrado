"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import {
  useConsultationByAppointment,
  useCreateConsultation,
  useCompleteConsultation,
} from "@/modules/domain/clinical/hooks/useConsultation";
import { useRecordLabResult } from "@/modules/domain/clinical/hooks/useRecordLabResult";
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
  FlaskConical,
} from "lucide-react";

type DiagnosisType = "PRIMARY" | "SECONDARY";

interface DiagnosisForm {
  value: string;
  type: DiagnosisType;
}

interface LabOrderForm {
  id?: string;
  type: string;
  name: string;
  status?: string;
  resultDetails?: string;
  resultRecordedAt?: string;
}

const parseDiagnosis = (text: string, type: DiagnosisType) => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^([A-Z]\d{2}(?:\.\d)?)\s+(.+)$/i);
  if (match) {
    return {
      icd10: match[1].toUpperCase(),
      description: match[2],
      type,
    };
  }
  if (/^[A-Z]\d{2}(?:\.\d)?$/i.test(trimmed)) {
    return {
      icd10: trimmed.toUpperCase(),
      description: "Diagnóstico registrado",
      type,
    };
  }
  return {
    icd10: "R69",
    description: trimmed,
    type,
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
  const [diagnoses, setDiagnoses] = useState<DiagnosisForm[]>([
    { value: "", type: "PRIMARY" },
  ]);
  const [prescriptions, setPrescriptions] = useState([
    { name: "", dose: "", frequency: "", duration: "" },
  ]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [labOrders, setLabOrders] = useState<LabOrderForm[]>([
    { type: "LABORATORY", name: "" },
  ]);
  const [labResultDrafts, setLabResultDrafts] = useState<
    Record<string, string>
  >({});
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
            const loadedDiagnoses: DiagnosisForm[] = [...c.diagnoses]
              .sort((a, b) =>
                a.type === "PRIMARY" || a.type === "PRINCIPAL"
                  ? -1
                  : b.type === "PRIMARY" || b.type === "PRINCIPAL"
                    ? 1
                    : 0,
              )
              .map((diagnosis) => ({
                value: `${diagnosis.icd10} ${diagnosis.description}`,
                type:
                  diagnosis.type === "PRIMARY" ||
                  diagnosis.type === "PRINCIPAL"
                    ? "PRIMARY"
                    : "SECONDARY",
              }));
            if (!loadedDiagnoses.some(({ type }) => type === "PRIMARY")) {
              loadedDiagnoses.unshift({ value: "", type: "PRIMARY" });
            }
            setDiagnoses(loadedDiagnoses);
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

          if (c.labOrders && c.labOrders.length > 0) {
            setLabOrders(
              c.labOrders.map((order) => ({
                id: order.id,
                type: order.type || "LABORATORY",
                name: order.name || "",
                status: order.status,
                resultDetails: order.resultDetails,
                resultRecordedAt: order.resultRecordedAt,
              })),
            );
          } else if (c.status === "COMPLETED") {
            setLabOrders([]);
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

  const addSecondaryDiagnosis = () =>
    setDiagnoses([...diagnoses, { value: "", type: "SECONDARY" }]);
  const removeDiagnosis = (idx: number) =>
    setDiagnoses(diagnoses.filter((_, i) => i !== idx));

  const addLabOrder = () =>
    setLabOrders([...labOrders, { type: "LABORATORY", name: "" }]);
  const removeLabOrder = (idx: number) =>
    setLabOrders(labOrders.filter((_, i) => i !== idx));

  const addAllergy = () =>
    setAllergies([...allergies, { type: "", severity: "LEVE" }]);
  const removeAllergy = (idx: number) =>
    setAllergies(allergies.filter((_, i) => i !== idx));

  const completeMutation = useCompleteConsultation(consultationId || "");
  const recordLabResultMutation = useRecordLabResult(appointmentId, {
    onSuccess: (response, labOrderId) => {
      setLabOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === labOrderId
            ? {
                ...order,
                status: "COMPLETED",
                resultDetails: response.data.details,
                resultRecordedAt: response.data.recordedAt,
              }
            : order,
        ),
      );
      setLabResultDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[labOrderId];
        return nextDrafts;
      });
    },
  });

  const handleRecordLabResult = (labOrderId: string) => {
    const details = labResultDrafts[labOrderId]?.trim();
    if (!details) {
      toast.error("Escribe el resultado del examen antes de registrarlo.");
      return;
    }

    recordLabResultMutation.mutate({
      labOrderId,
      request: { details },
    });
  };

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

    const parsedDiagnoses = diagnoses
      .map((diagnosis) => parseDiagnosis(diagnosis.value, diagnosis.type))
      .filter((diagnosis) => diagnosis !== null);

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

    const validLabOrders = labOrders.filter((order) => order.name.trim() !== "");
    const parsedLabOrders = validLabOrders.map((order) => ({
      type: order.type,
      name: order.name.trim(),
    }));

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
        diagnoses: parsedDiagnoses.length > 0 ? parsedDiagnoses : undefined,
        prescription: parsedPrescription,
        labOrders: parsedLabOrders.length > 0 ? parsedLabOrders : undefined,
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
        <TabsList className="w-full !h-auto p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] grid grid-cols-2 md:grid-cols-5 gap-1.5 mb-8">
          {[
            { id: "resumen", label: "Historia Clínica", icon: Stethoscope },
            { id: "vitals", label: "Signos Vitales", icon: Activity },
            { id: "receta", label: "Diagnóstico y Receta", icon: Pill },
            { id: "examenes", label: "Exámenes", icon: FlaskConical },
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
                <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between gap-3">
                  <CardTitle className="text-lg font-bold text-petroleo">
                    Diagnósticos
                  </CardTitle>
                  {!isCompleted && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSecondaryDiagnosis}
                      className="rounded-xl font-bold shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Secundario
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-4">
                  {diagnoses.map((diagnosis, idx) => (
                    <div
                      key={`${diagnosis.type}-${idx}`}
                      className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            diagnosis.type === "PRIMARY"
                              ? "text-emerald-600"
                              : "text-celeste"
                          }`}
                        >
                          {diagnosis.type === "PRIMARY"
                            ? "Principal"
                            : `Secundario ${idx}`}
                        </span>
                        {!isCompleted && diagnosis.type === "SECONDARY" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDiagnosis(idx)}
                            className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            aria-label="Eliminar diagnóstico secundario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <textarea
                        placeholder={
                          diagnosis.type === "PRIMARY"
                            ? "Ej. J02.9 Faringitis aguda"
                            : "Código CIE-10 y descripción"
                        }
                        className="min-h-[105px] resize-none rounded-xl p-3 bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus-visible:ring-celeste w-full text-sm"
                        value={diagnosis.value}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>,
                        ) => {
                          const next = [...diagnoses];
                          next[idx] = {
                            ...next[idx],
                            value: e.target.value,
                          };
                          setDiagnoses(next);
                        }}
                        disabled={isCompleted}
                      />
                    </div>
                  ))}
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

        {/* CONTENIDO: EXAMENES */}
        <TabsContent value="examenes" className="focus-visible:outline-none">
          <Card className="rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between border-b border-zinc-50 pb-6 mb-6">
              <CardTitle className="text-xl font-bold text-petroleo flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-celeste" />
                Exámenes de Laboratorio e Imágenes
              </CardTitle>
              {!isCompleted && (
                <Button
                  onClick={addLabOrder}
                  variant="outline"
                  className="rounded-xl font-bold border-zinc-200"
                >
                  <Plus className="w-4 h-4 mr-2" /> Agregar Examen
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              {labOrders.length === 0 && (
                <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  <p className="text-zinc-500 font-bold">
                    No se solicitaron exámenes en esta consulta.
                  </p>
                </div>
              )}

              {labOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 group transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <select
                      className="h-11 px-4 rounded-xl border border-zinc-200 bg-white font-bold text-sm text-petroleo focus:outline-none focus:ring-2 focus:ring-celeste min-w-[170px]"
                      value={order.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const next = [...labOrders];
                        next[idx].type = e.target.value;
                        setLabOrders(next);
                      }}
                      disabled={isCompleted}
                    >
                      <option value="LABORATORY">Laboratorio</option>
                      <option value="IMAGE">Imagen</option>
                    </select>

                    <Input
                      placeholder="Nombre del examen (Ej. Hemograma completo, Radiografía de tórax)"
                      className="bg-white flex-1"
                      value={order.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const next = [...labOrders];
                        next[idx].name = e.target.value;
                        setLabOrders(next);
                      }}
                      disabled={isCompleted}
                    />

                    {isCompleted && (
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 ${
                          order.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status === "COMPLETED"
                          ? "Con resultado"
                          : "Pendiente"}
                      </span>
                    )}

                    {!isCompleted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLabOrder(idx)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"
                        aria-label="Eliminar examen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>

                  {isCompleted && order.resultDetails && (
                    <div className="rounded-xl border border-emerald-100 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                          Resultado registrado
                        </p>
                        {order.resultRecordedAt && (
                          <time className="text-xs font-medium text-zinc-400">
                            {new Date(order.resultRecordedAt).toLocaleString(
                              "es-PE",
                            )}
                          </time>
                        )}
                      </div>
                      <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                        {order.resultDetails}
                      </p>
                    </div>
                  )}

                  {isCompleted && order.id && !order.resultDetails && (
                    <div className="rounded-xl border border-amber-100 bg-white p-4 space-y-3">
                      <label
                        htmlFor={`lab-result-${order.id}`}
                        className="text-xs font-black uppercase tracking-widest text-zinc-500"
                      >
                        Resultado del examen
                      </label>
                      <textarea
                        id={`lab-result-${order.id}`}
                        value={labResultDrafts[order.id] || ""}
                        onChange={(e) =>
                          setLabResultDrafts((currentDrafts) => ({
                            ...currentDrafts,
                            [order.id as string]: e.target.value,
                          }))
                        }
                        placeholder="Registre hallazgos, valores y conclusiones del examen..."
                        className="min-h-[110px] resize-y rounded-xl p-3 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-celeste w-full text-sm"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="celeste"
                          onClick={() => handleRecordLabResult(order.id!)}
                          disabled={
                            recordLabResultMutation.isPending &&
                            recordLabResultMutation.variables?.labOrderId ===
                              order.id
                          }
                          className="rounded-xl font-bold"
                        >
                          {recordLabResultMutation.isPending &&
                          recordLabResultMutation.variables?.labOrderId ===
                            order.id ? (
                            <Spinner className="w-4 h-4 text-white" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Registrar Resultado
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
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
