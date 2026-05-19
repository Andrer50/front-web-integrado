"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditPatient } from "@/modules/domain/user/patient/hooks/useEditPatient";
import { patientValidationSchema } from "@/modules/features/user/patient/validations";

/**
 * Componente de diálogo para editar la información de un paciente. 
 * Permite modificar campos como nombre, apellido, email, teléfono, fecha de nacimiento, DNI, género y dirección. 
 * Utiliza Formik para el manejo del formulario y validaciones con Yup. 
 * Al abrir el diálogo, se cargan los datos actuales del paciente y al guardar se actualizan en el backend.
 */

interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export function EditPatientDialog({
  open,
  onOpenChange,
  patientId,
}: EditPatientDialogProps) {
  const { patient, isFetching, mutate, isPending } = useEditPatient(
    patientId,
    open,
  );

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      documentNumber: "",
      gender: "",
      address: "",
    },
    validationSchema: patientValidationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => onOpenChange(false),
      });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (patient && open) {
      formik.setValues({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        email: patient.email || "",
        phone: patient.phone || "",
        birthDate: patient.birthDate || "",
        documentNumber: patient.documentNumber || "",
        gender: patient.gender || "",
        address: patient.address || "",
      });
    }
  }, [patient, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-white dark:bg-zinc-950 p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-celeste" />
            Editar Paciente
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Actualiza la información del paciente.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-celeste" />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="font-bold text-petroleo dark:text-white"
                >
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs font-semibold">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="font-bold text-petroleo dark:text-white"
                >
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs font-semibold">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-bold text-petroleo dark:text-white"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs font-semibold">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="font-bold text-petroleo dark:text-white"
                >
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-xs font-semibold">
                    {formik.errors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="birthDate"
                  className="font-bold text-petroleo dark:text-white"
                >
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <p className="text-red-500 text-xs font-semibold">
                    {formik.errors.birthDate}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="documentNumber"
                  className="font-bold text-petroleo dark:text-white"
                >
                  DNI
                </Label>
                <Input
                  id="documentNumber"
                  name="documentNumber"
                  type="text"
                  value={formik.values.documentNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
                />
                {formik.touched.documentNumber &&
                  formik.errors.documentNumber && (
                    <p className="text-red-500 text-xs font-semibold">
                      {formik.errors.documentNumber}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="font-bold text-petroleo dark:text-white"
                >
                  Género
                </Label>
                <Select
                  key={formik.values.gender || "empty"}
                  value={formik.values.gender}
                  onValueChange={(value) => {
                    formik.setFieldValue("gender", value);
                    formik.setFieldTouched("gender", true);
                  }}
                >
                  <SelectTrigger className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus:ring-celeste">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Masculino</SelectItem>
                    <SelectItem value="FEMALE">Femenino</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500 text-xs font-semibold">
                    {formik.errors.gender}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="font-bold text-petroleo dark:text-white"
              >
                Dirección
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-xs font-semibold">
                  {formik.errors.address}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl font-bold h-11 px-6 cursor-pointer"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="celeste"
                className="rounded-xl font-bold h-11 px-8 cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
