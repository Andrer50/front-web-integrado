"use client";

import { useState, useMemo } from "react";
import { useFormik } from "formik";
import { Plus, Stethoscope, Loader2, Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import { useAvailableDoctorSlots } from "@/modules/domain/appointment/hooks/useAvailableDoctorSlots";
import { useCreateAppointment } from "@/modules/domain/appointment/hooks/useAppointments";
import { usePatients } from "@/modules/domain/user/patient/hooks/usePatients"; 
import { appointmentValidationSchema } from "@/modules/features/appointment/validations/appointment-schema";

interface CreateAppointmentDialogProps {
  onSuccess?: () => void;
}

export function CreateAppointmentDialog({ onSuccess }: CreateAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [patientQuery, setPatientQuery] = useState("");

  const { data: specialtiesData } = useSpecialties({ page: 0, size: 100 });
  const specialties = specialtiesData?.data?.content || [];

  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    page: 0,
    size: 10,
    query: patientQuery || undefined,
  });
  const patients = patientsData?.data?.content || [];

  const { data: slotsRes } = useAvailableDoctorSlots(
    specialtyId ? { specialtyId } : { specialtyId: "" }
  );
  const availableDoctors = slotsRes?.data || [];

  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      formik.resetForm();
      setPatientQuery("");
      setSpecialtyId("");
      setOpen(false);
      onSuccess?.();
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "Ocurrió un error al agendar la cita.");
    },
  });

  const formik = useFormik({
    initialValues: { patientId: "", slotId: "", reason: "" },
    validationSchema: appointmentValidationSchema(true),
    onSubmit: (values) => {
      setErrorMsg("");
      createAppointmentMutation.mutate({
        patientId: values.patientId,
        slotId: values.slotId,
        reason: values.reason,
      });
    },
  });

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === formik.values.patientId),
    [patients, formik.values.patientId],
  );

  const slotOptions = useMemo(() => {
    return availableDoctors.flatMap((doc) =>
      doc.availableDates.flatMap((d) =>
        d.slots.map((s) => ({
          slotId: s.slotId,
          label: `${doc.doctorName} — ${d.dateLabel} ${s.time}`,
        })),
      ),
    );
  }, [availableDoctors]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        formik.resetForm();
        setErrorMsg("");
        setPatientQuery("");
        setSpecialtyId("");
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="celeste" className="rounded-2xl h-auto py-4 px-8 font-bold cursor-pointer">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-celeste" />
            Agendar Nueva Cita
          </DialogTitle>
          <DialogDescription>
            Selecciona el paciente, especialidad y el horario disponible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Buscador de paciente */}
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Input
              placeholder="Buscar por nombre o documento..."
              value={patientQuery}
              onChange={(e) => setPatientQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-zinc-400" />}
              className="h-12 rounded-2xl"
            />
            {patientQuery && (
              <div className="border rounded-2xl max-h-40 overflow-y-auto divide-y">
                {isLoadingPatients ? (
                  <p className="p-3 text-xs text-zinc-400">Buscando...</p>
                ) : patients.length === 0 ? (
                  <p className="p-3 text-xs text-zinc-400">Sin resultados</p>
                ) : (
                  patients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        formik.setFieldValue("patientId", p.id);
                        setPatientQuery(`${p.firstName} ${p.lastName}`);
                      }}
                      className="w-full text-left p-3 text-sm font-semibold hover:bg-celeste/10"
                    >
                      {p.firstName} {p.lastName} — {p.documentNumber}
                    </button>
                  ))
                )}
              </div>
            )}
            {selectedPatient && (
              <p className="text-xs text-emerald-600 font-bold">
                Paciente seleccionado: {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
            )}
            {formik.touched.patientId && formik.errors.patientId && (
              <p className="text-[11px] text-red-500 font-bold">{formik.errors.patientId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Especialidad</Label>
            <Select onValueChange={setSpecialtyId} value={specialtyId}>
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder="Selecciona especialidad..." />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Horario disponible</Label>
            <Select
              onValueChange={(v) => formik.setFieldValue("slotId", v)}
              value={formik.values.slotId}
              disabled={!specialtyId || slotOptions.length === 0}
            >
              <SelectTrigger className="h-12 rounded-2xl">
                <SelectValue placeholder={specialtyId ? "Selecciona un horario..." : "Elige especialidad primero"} />
              </SelectTrigger>
              <SelectContent>
                {slotOptions.map((opt) => (
                  <SelectItem key={opt.slotId} value={opt.slotId}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.slotId && formik.errors.slotId && (
              <p className="text-[11px] text-red-500 font-bold">{formik.errors.slotId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Motivo de Consulta</Label>
            <Input
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ej. Chequeo anual, dolor de garganta..."
              className="h-12 rounded-2xl"
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="text-[11px] text-red-500 font-bold">{formik.errors.reason}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="celeste" disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Agendar Cita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}