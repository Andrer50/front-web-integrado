"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { Plus, Stethoscope, Loader2, Search, X, UserCircle2 } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import { useAvailableDoctorSlots } from "@/modules/domain/appointment/hooks/useAvailableDoctorSlots";
import { useCreateAppointment } from "@/modules/domain/appointment/hooks/useAppointments";
import { usePatients } from "@/modules/domain/user/patient/hooks/usePatients";
import { appointmentValidationSchema } from "@/modules/features/appointment/validations/appointment-schema";
import { DoctorSlotCard } from "@/presentation/dashboard/patient/appointments/doctor-slot-card";

interface CreateAppointmentDialogProps {
  onSuccess?: () => void;
}

export function CreateAppointmentDialog({ onSuccess }: CreateAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; firstName: string; lastName: string; documentNumber: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDaysByDoctor, setSelectedDaysByDoctor] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: specialtiesData } = useSpecialties({ page: 0, size: 100 });
  const specialties = specialtiesData?.data?.content || [];

  const shouldSearch = patientQuery.length > 0 && !selectedPatient;
  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    page: 0,
    size: 10,
    query: shouldSearch ? patientQuery : undefined,
  });
  const patients = patientsData?.data?.content || [];

  const { data: slotsRes, isLoading: isLoadingSlots } = useAvailableDoctorSlots(
    specialtyId ? { specialtyId } : { specialtyId: "" }
  );
  const availableDoctors = slotsRes?.data || [];

  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      formik.resetForm();
      setPatientQuery("");
      setSpecialtyId("");
      setSelectedPatient(null);
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

  const selectPatient = useCallback((p: { id: string; firstName: string; lastName: string; documentNumber: string }) => {
    setSelectedPatient(p);
    formik.setFieldValue("patientId", p.id);
    setPatientQuery("");
    setShowDropdown(false);
  }, [formik]);

  const removePatient = useCallback(() => {
    setSelectedPatient(null);
    formik.setFieldValue("patientId", "");
  }, [formik]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        formik.resetForm();
        setErrorMsg("");
        setPatientQuery("");
        setSpecialtyId("");
        setSelectedPatient(null);
        setShowDropdown(false);
        setSelectedDaysByDoctor({});
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="celeste" className="rounded-2xl h-auto py-4 px-8 font-bold cursor-pointer">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] lg:max-w-[900px] rounded-[2rem] p-8 bg-white dark:bg-zinc-950 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black text-petroleo dark:text-white tracking-tight">
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-celeste/10">
              <Stethoscope className="w-5 h-5 text-celeste" />
            </span>
            Agendar Nueva Cita
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400 font-medium">
            Selecciona el paciente, especialidad y el horario disponible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5 mt-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Buscador de paciente */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
              Paciente
            </Label>
            {selectedPatient ? (
              <div className="flex items-center gap-3 h-12 px-4 rounded-2xl bg-celeste/5 dark:bg-celeste/10 border border-celeste/20">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-celeste/10 shrink-0">
                  <UserCircle2 className="w-4 h-4 text-celeste" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-petroleo dark:text-white truncate">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    DNI: {selectedPatient.documentNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removePatient}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4 text-zinc-400 hover:text-red-500" />
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <Input
                  placeholder="Buscar por nombre o documento..."
                  value={patientQuery}
                  onChange={(e) => {
                    setPatientQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => patientQuery.length > 0 && setShowDropdown(true)}
                  startContent={<Search className="w-4 h-4 text-zinc-400" />}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                />
                {showDropdown && patientQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-zinc-100 dark:border-zinc-800 rounded-2xl max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 shadow-lg shadow-black/5">
                    {isLoadingPatients ? (
                      <div className="flex items-center gap-2 p-3">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-celeste" />
                        <p className="text-xs text-zinc-400 font-medium">Buscando pacientes...</p>
                      </div>
                    ) : patients.length === 0 ? (
                      <p className="p-3 text-xs text-zinc-400 font-medium text-center">No se encontraron resultados</p>
                    ) : (
                      patients.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => selectPatient(p)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-celeste/5 transition-colors flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl cursor-pointer"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            <UserCircle2 className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-petroleo dark:text-white truncate">
                              {p.firstName} {p.lastName}
                            </p>
                            <p className="text-[11px] text-zinc-400 font-medium">
                              DNI: {p.documentNumber}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            {formik.touched.patientId && formik.errors.patientId && (
              <p className="text-[11px] text-red-500 font-bold px-1">{formik.errors.patientId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
              Especialidad
            </Label>
            <Select onValueChange={setSpecialtyId} value={specialtyId}>
              <SelectTrigger className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
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
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
              Horario disponible
            </Label>
            {!specialtyId ? (
              <p className="text-sm text-zinc-400 font-medium px-1 py-4">
                Selecciona una especialidad primero
              </p>
            ) : isLoadingSlots ? (
              <div className="flex items-center justify-center py-8 gap-2">
                <Spinner className="w-5 h-5 text-celeste" />
                <p className="text-sm text-zinc-400 font-medium">
                  Buscando horarios disponibles...
                </p>
              </div>
            ) : availableDoctors.length === 0 ? (
              <p className="text-sm text-zinc-400 font-medium px-1 py-4">
                No hay médicos disponibles para esta especialidad
              </p>
            ) : (
              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
                {availableDoctors.map((doc) => {
                  const selectedDateStr =
                    selectedDaysByDoctor[doc.doctorId] ||
                    doc.availableDates?.[0]?.date;

                  return (
                    <DoctorSlotCard
                      key={doc.doctorId}
                      doctor={doc}
                      selectedDateStr={selectedDateStr}
                      selectedSlotId={formik.values.slotId}
                      className="!border-0 !ring-0 !shadow-none"
                      onDaySelect={(doctorId, date) =>
                        setSelectedDaysByDoctor((prev) => ({
                          ...prev,
                          [doctorId]: date,
                        }))
                      }
                      onSlotClick={(_doctorId, _dateStr, _timeStr, slotId) => {
                        formik.setFieldValue("slotId", slotId);
                      }}
                    />
                  );
                })}
              </div>
            )}
            {formik.touched.slotId && formik.errors.slotId && (
              <p className="text-[11px] text-red-500 font-bold px-1">{formik.errors.slotId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
              Motivo de Consulta
            </Label>
            <Input
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ej. Chequeo anual, dolor de garganta..."
              className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="text-[11px] text-red-500 font-bold px-1">{formik.errors.reason}</p>
            )}
          </div>

          <DialogFooter className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold h-11">
              Cancelar
            </Button>
            <Button type="submit" variant="celeste" className="rounded-xl font-bold h-11 shadow-lg shadow-celeste/20" disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Agendar Cita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}