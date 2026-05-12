"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { 
  Plus, 
  Stethoscope, 
  ChevronRight, 
  Loader2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoctors } from "@/modules/domain/doctor/hooks/useDoctors";
import { useCreateAppointment } from "@/modules/domain/appointment/hooks/useAppointments";
import { appointmentSchema } from "@/modules/features/appointment/validations/appointment-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAppointmentDialogProps {
  patientId: string;
  onSuccess?: () => void;
}

export function CreateAppointmentDialog({ patientId, onSuccess }: CreateAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { data: doctorsData } = useDoctors({ page: 0, size: 50 });

  const createAppointmentMutation = useCreateAppointment({
    onSuccess: () => {
      formik.resetForm();
      setOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "Ocurrió un error al agendar la cita. Por favor intenta de nuevo.");
    },
  });

  const formik = useFormik({
    initialValues: {
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
    },
    validationSchema: appointmentSchema,
    onSubmit: (values) => {
      if (!patientId) {
        setErrorMsg("Error: No se pudo verificar la sesión del paciente.");
        return;
      }
      setErrorMsg("");

      let formattedTime = values.appointmentTime;
      if (formattedTime.split(":").length === 2) {
        formattedTime += ":00";
      }

      createAppointmentMutation.mutate({
        patientId,
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate,
        appointmentTime: formattedTime,
        reason: values.reason,
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          formik.resetForm();
          setErrorMsg("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="celeste" 
          className="rounded-2xl h-auto py-4 px-8 font-bold w-full md:w-fit cursor-pointer shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-white dark:bg-zinc-950 p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-celeste" />
            Agendar Nueva Cita
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Selecciona tu médico preferido, la fecha y hora de tu cita médica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="doctorId" className="font-bold text-petroleo dark:text-white">Médico y Especialidad</Label>
              <Select
                onValueChange={(value) => formik.setFieldValue("doctorId", value)}
                value={formik.values.doctorId}
              >
                <SelectTrigger
                  id="doctorId"
                  className={`w-full h-12 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border text-sm font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-celeste focus:border-transparent transition-all cursor-pointer ${
                    formik.touched.doctorId && formik.errors.doctorId
                      ? "border-red-500 ring-1 ring-red-500 animate-shake"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <SelectValue placeholder="Selecciona un médico..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                  {doctorsData?.data?.content?.map((doc) => (
                    <SelectItem key={doc.id} value={String(doc.id)} className="rounded-xl focus:bg-celeste/10 focus:text-celeste cursor-pointer">
                      {doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : "Médico"} - {doc.specialties?.[0]?.name || "General"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            {formik.touched.doctorId && formik.errors.doctorId && (
              <p className="text-[11px] text-red-500 font-bold ml-1">{formik.errors.doctorId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate" className="font-bold text-petroleo dark:text-white">Fecha</Label>
              <Input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                value={formik.values.appointmentDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={new Date().toISOString().split("T")[0]}
                className={`h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300 ${
                  formik.touched.appointmentDate && formik.errors.appointmentDate
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              />
              {formik.touched.appointmentDate && formik.errors.appointmentDate && (
                <p className="text-[11px] text-red-500 font-bold ml-1">{formik.errors.appointmentDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime" className="font-bold text-petroleo dark:text-white">Hora</Label>
              <Input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                value={formik.values.appointmentTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300 ${
                  formik.touched.appointmentTime && formik.errors.appointmentTime
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              />
              {formik.touched.appointmentTime && formik.errors.appointmentTime && (
                <p className="text-[11px] text-red-500 font-bold ml-1">{formik.errors.appointmentTime}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="font-bold text-petroleo dark:text-white">Motivo de Consulta</Label>
            <Input
              id="reason"
              name="reason"
              type="text"
              placeholder="Ej. Chequeo anual, dolor de garganta..."
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300 ${
                formik.touched.reason && formik.errors.reason
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="text-[11px] text-red-500 font-bold ml-1">{formik.errors.reason}</p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="rounded-xl font-bold h-11 px-6 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="celeste" 
              className="rounded-xl font-bold h-11 px-8 cursor-pointer"
              disabled={createAppointmentMutation.isPending || !formik.isValid}
            >
              {createAppointmentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Agendar Cita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
