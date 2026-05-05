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
import { useCreateSpecialty } from "@/modules/domain/specialty/hooks/useCreateSpecialty";
import { Plus, Loader2 } from "lucide-react";
import { specialtySchema } from "@/modules/features/specialty/validations/specialty-schema";
import { Status } from "@/core/shared";

export function CreateSpecialtyDialog() {
  const [open, setOpen] = useState(false);

  const { mutate: createSpecialty, isPending } = useCreateSpecialty({
    onSuccess: () => {
      formik.resetForm();
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: "ACTIVE" as Status,
    },
    validationSchema: specialtySchema,
    onSubmit: (values) => {
      createSpecialty(values);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) formik.resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-petroleo hover:bg-petroleo/90 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all text-xs">
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">Añadir</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none bg-white dark:bg-zinc-900 p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight">
            Nueva Especialidad
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Nombre de la Especialidad
            </label>
            <Input
              name="name"
              placeholder="Ej. Cardiología"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl font-medium ${
                formik.touched.name && formik.errors.name
                  ? "ring-2 ring-rose-500/50"
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
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Descripción
            </label>
            <textarea
              name="description"
              placeholder="Describe las funciones de esta área..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full min-h-[120px] p-4 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-celeste/20 transition-all ${
                formik.touched.description && formik.errors.description
                  ? "ring-2 ring-rose-500/50"
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
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Estado Inicial
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => formik.setFieldValue("status", "ACTIVE")}
                className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                  formik.values.status === "ACTIVE"
                    ? "bg-verde-salud/10 border-verde-salud text-verde-salud"
                    : "border-zinc-100 dark:border-zinc-800 text-zinc-400"
                }`}
              >
                Activo
              </button>
              <button
                type="button"
                onClick={() => formik.setFieldValue("status", "INACTIVE")}
                className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                  formik.values.status === "INACTIVE"
                    ? "bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-500"
                    : "border-zinc-100 dark:border-zinc-800 text-zinc-400"
                }`}
              >
                Inactivo
              </button>
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
                "Crear Área"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
