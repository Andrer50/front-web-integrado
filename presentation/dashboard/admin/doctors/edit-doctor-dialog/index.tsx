"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { Loader2, User } from "lucide-react";
import * as Yup from "yup";
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
import { useUpdateDoctor } from "@/modules/domain/doctor/hooks/useUpdateDoctor";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const doctorValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("El nombre es requerido"),
  lastName: Yup.string().required("El apellido es requerido"),
  phone: Yup.string().required("El teléfono es requerido"),
  medicalLicenseNumber: Yup.string().required("El CMP es requerido"),
  bio: Yup.string(),
  specialtyIds: Yup.array()
    .of(Yup.string())
    .min(1, "Debe seleccionar al menos una especialidad"),
});

/**
 * Componente de diálogo para editar la información de un doctor.
 * Permite modificar nombre, apellido, teléfono, CMP, biografía y especialidades.
 * Utiliza Formik para el manejo del formulario y validaciones con Yup.
 * Al abrir el diálogo, se cargan los datos actuales del doctor.
 */

interface EditDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
}

export function EditDoctorDialog({
  open,
  onOpenChange,
  doctorId,
}: EditDoctorDialogProps) {
  const { doctor, isFetching, mutate, isPending } = useUpdateDoctor(
    doctorId,
    open,
  );

  const { data: specialtiesResponse } = useSpecialties({
    page: 0,
    size: 100,
  });

  const specialties = specialtiesResponse?.data?.content || [];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      medicalLicenseNumber: "",
      bio: "",
      specialtyIds: [] as string[],
    },
    validationSchema: doctorValidationSchema,
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
    if (doctor && open) {
      formik.setValues({
        firstName: doctor.user.firstName || "",
        lastName: doctor.user.lastName || "",
        phone: doctor.user.phone || "",
        medicalLicenseNumber: doctor.medicalLicenseNumber || "",
        bio: doctor.bio || "",
        specialtyIds: doctor.specialties.map((s) => s.id) || [],
      });
    }
  }, [doctor, open]);

  const handleSpecialtyToggle = (specialtyId: string) => {
    const currentSpecialties = formik.values.specialtyIds;
    if (currentSpecialties.includes(specialtyId)) {
      formik.setFieldValue(
        "specialtyIds",
        currentSpecialties.filter((id) => id !== specialtyId),
      );
    } else {
      formik.setFieldValue("specialtyIds", [
        ...currentSpecialties,
        specialtyId,
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] bg-white dark:bg-zinc-950 p-8 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-celeste" />
            Editar Doctor
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Actualiza la información personal, CMP, especialidades y biografía
            del médico.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-celeste" />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
            {/* Nombre y Apellido */}
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

            {/* Teléfono y CMP */}
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
                  htmlFor="medicalLicenseNumber"
                  className="font-bold text-petroleo dark:text-white"
                >
                  CMP (Colegiatura)
                </Label>
                <Input
                  id="medicalLicenseNumber"
                  name="medicalLicenseNumber"
                  type="text"
                  value={formik.values.medicalLicenseNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-celeste font-semibold text-zinc-700 dark:text-zinc-300"
                />
                {formik.touched.medicalLicenseNumber &&
                  formik.errors.medicalLicenseNumber && (
                    <p className="text-red-500 text-xs font-semibold">
                      {formik.errors.medicalLicenseNumber}
                    </p>
                  )}
              </div>
            </div>

            {/* Biografía */}
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="font-bold text-petroleo dark:text-white"
              >
                Biografía
              </Label>
              <textarea
                id="bio"
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className="w-full h-24 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-celeste/20 font-semibold text-zinc-700 dark:text-zinc-300 p-3 resize-none focus:outline-none"
                placeholder="Información adicional del doctor..."
              />
              {formik.touched.bio && formik.errors.bio && (
                <p className="text-red-500 text-xs font-semibold">
                  {formik.errors.bio}
                </p>
              )}
            </div>

            {/* Especialidades */}
            <div className="space-y-3">
              <Label className="font-bold text-petroleo dark:text-white">
                Especialidades
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                {specialties.map((specialty) => (
                  <label
                    key={specialty.id}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formik.values.specialtyIds.includes(
                        specialty.id,
                      )}
                      onChange={() => handleSpecialtyToggle(specialty.id)}
                      className="w-4 h-4 rounded cursor-pointer accent-celeste"
                    />
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {specialty.name}
                    </span>
                  </label>
                ))}
              </div>
              {formik.touched.specialtyIds && formik.errors.specialtyIds && (
                <p className="text-red-500 text-xs font-semibold">
                  {formik.errors.specialtyIds}
                </p>
              )}
            </div>

            <DialogFooter className="pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="rounded-xl font-bold h-11 px-6 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || !formik.isValid}
                className="rounded-xl font-bold h-11 px-8 cursor-pointer bg-celeste hover:bg-celeste/90 text-white flex items-center gap-2 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
