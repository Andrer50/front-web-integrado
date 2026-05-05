"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateSpecialty } from "@/modules/domain/specialty/hooks/useUpdateSpecialty";
import { Loader2, Settings2 } from "lucide-react";
import { SpecialtyResponse } from "@/core/specialty/interfaces";
import { specialtySchema } from "@/modules/features/specialty/validations/specialty-schema";

interface EditSpecialtyDialogProps {
  specialty: SpecialtyResponse;
  trigger?: React.ReactNode;
}

export function EditSpecialtyDialog({
  specialty,
  trigger,
}: EditSpecialtyDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutate: updateSpecialty, isPending } = useUpdateSpecialty({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: specialty.name,
      description: specialty.description,
      status: specialty.status,
    },
    enableReinitialize: true,
    validationSchema: specialtySchema,
    onSubmit: (values) => {
      updateSpecialty({
        id: specialty.id,
        request: values,
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          formik.resetForm({
            values: {
              name: specialty.name,
              description: specialty.description,
              status: specialty.status,
            },
          });
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            className="w-full mt-4 h-9 rounded-xl font-bold text-[10px] uppercase tracking-widest text-petroleo dark:text-celeste bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all border border-zinc-100 dark:border-zinc-800"
          >
            Ver Detalles
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-xl rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-petroleo p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-celeste/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <DialogHeader>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <Settings2 className="w-6 h-6 text-celeste" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight leading-none">
              Editar <span className="text-celeste">Especialidad</span>
            </DialogTitle>
            <p className="text-white/60 text-xs font-medium mt-2 uppercase tracking-widest">
              ID: {specialty.id.substring(0, 8)}...
            </p>
          </DialogHeader>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="p-4 space-y-6 bg-white dark:bg-zinc-950"
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                Nombre del Área
              </label>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ej. Cardiología"
                className={`h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl focus:ring-celeste/20 transition-all font-bold text-petroleo dark:text-white ${
                  formik.touched.name && formik.errors.name
                    ? "ring-2 ring-rose-500/50 border-rose-500"
                    : ""
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe las funciones del área..."
                className={`w-full min-h-[100px] p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-celeste/20 outline-none transition-all font-medium text-sm text-petroleo dark:text-white resize-none ${
                  formik.touched.description && formik.errors.description
                    ? "ring-2 ring-rose-500/50 border-rose-500"
                    : ""
                }`}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                Estado Operativo
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("status", "ACTIVE")}
                  className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                    formik.values.status === "ACTIVE"
                      ? "bg-verde-salud/10 border-verde-salud text-verde-salud shadow-sm"
                      : "border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  Activo
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("status", "INACTIVE")}
                  className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                    formik.values.status === "INACTIVE"
                      ? "bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-500 shadow-sm"
                      : "border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  Inactivo
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setOpen(false)}
              className="flex-1 h-12 rounded-xl font-bold text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !formik.isValid}
              className="flex-1 h-12 bg-celeste hover:bg-celeste/90 text-white rounded-xl font-bold shadow-lg shadow-celeste/20 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
