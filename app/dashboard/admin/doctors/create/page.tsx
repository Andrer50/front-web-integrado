"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  UserPlus,
  Stethoscope,
  Briefcase,
  Loader2,
  CheckCircle2,
  ChevronRight,
  User,
  Mail,
  Lock,
  Phone,
  FileText,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateDoctor } from "@/modules/domain/doctor/hooks/useCreateDoctor";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import { doctorSchema } from "@/modules/features/doctor/validations/doctor-schema";
import { useState, useMemo } from "react";
import { DoctorRequest } from "@/core/doctor/interfaces";

export default function CreateDoctorPage() {
  const router = useRouter();
  // Stepper a 3 pasos (1: Datos Personales, 2: Especialidad, 3: Credenciales)
  const [step, setStep] = useState(1);

  const { data: specialtiesResponse, isLoading: isLoadingSpecialties } =
    useSpecialties({
      page: 0,
      size: 100, // Traemos todas para el selector
    });

  const specialties = specialtiesResponse?.data?.content || [];

  const { mutate: createDoctor, isPending } = useCreateDoctor({
    onSuccess: () => {
      router.push("/dashboard/admin/doctors");
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      medicalLicenseNumber: "",
      bio: "",
      specialtyIds: [] as string[],
    },
    validationSchema: doctorSchema,
    onSubmit: (values) => {
      createDoctor(values);
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = (
      step === 1
        ? ["firstName", "lastName", "phone"]
        : ["medicalLicenseNumber", "specialtyIds"]
    ) as (keyof DoctorRequest)[];

    const errors = await formik.validateForm();
    const hasErrors = fieldsToValidate.some((field) => !!errors[field]);

    if (!hasErrors) {
      setStep((prev) => prev + 1);
    } else {
      fieldsToValidate.forEach((field) => formik.setFieldTouched(field, true));
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const toggleSpecialty = (id: string) => {
    const current = formik.values.specialtyIds;
    if (current.includes(id)) {
      formik.setFieldValue(
        "specialtyIds",
        current.filter((s) => s !== id),
      );
    } else {
      formik.setFieldValue("specialtyIds", [...current, id]);
    }
  };

  // Nombres de las especialidades seleccionadas para el resumen del Paso 3
  const selectedSpecialtyNames = useMemo(() => {
    return specialties
      .filter((s) => formik.values.specialtyIds.includes(s.id))
      .map((s) => s.name);
  }, [specialties, formik.values.specialtyIds]);

  const stepLabels = [
    { num: 1, title: "Datos Personales", desc: "Nombres y teléfono" },
    { num: 2, title: "Especialidad", desc: "CMP y áreas médicas" },
    { num: 3, title: "Credenciales", desc: "Acceso y confirmación" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header con Indicador de Stepper a 3 Pasos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-celeste transition-colors text-sm font-bold mb-2 group cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver
          </Button>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight leading-none">
            Registrar <span className="text-celeste">Médico</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Completa los datos en 3 sencillos pasos para dar de alta a un profesional.
          </p>
        </div>

        {/* Stepper visual (Paso 1, 2 y 3) */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 flex items-center justify-center text-xs font-black transition-all ${
                  step >= i
                    ? "bg-celeste text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <div className="h-1.5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-celeste transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Barra de progreso de pestañas (Tabs Stepper) */}
      <div className="grid grid-cols-3 gap-3">
        {stepLabels.map((s) => (
          <div
            key={s.num}
            onClick={() => {
              if (s.num < step) setStep(s.num);
            }}
            className={`p-4 rounded-2xl border transition-all ${
              s.num < step ? "cursor-pointer" : ""
            } ${
              step === s.num
                ? "bg-white dark:bg-zinc-900 border-celeste shadow-sm"
                : step > s.num
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-700"
                  : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800 opacity-60"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                  step === s.num
                    ? "bg-celeste text-white"
                    : step > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <p className="text-xs font-black text-petroleo dark:text-white truncate">
                {s.title}
              </p>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="relative">
          {/* PASO 1: DATOS PERSONALES */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-petroleo/5 bg-white dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
                <div className="bg-petroleo p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-celeste/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/20">
                      <User className="w-7 h-7 text-celeste" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">
                        Datos Personales
                      </h2>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">
                        Paso 1 de 3: Identidad y Contacto
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        Nombres
                      </label>
                      <Input
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ej. Juan Carlos"
                        startContent={
                          <User className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                        }
                        className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold transition-all ${
                          formik.touched.firstName && formik.errors.firstName
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : "focus:ring-celeste/20"
                        }`}
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <p className="text-xs text-rose-500 font-bold ml-1">
                          {formik.errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Apellidos
                      </label>
                      <Input
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ej. Pérez García"
                        startContent={
                          <User className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                        }
                        className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold transition-all ${
                          formik.touched.lastName && formik.errors.lastName
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : "focus:ring-celeste/20"
                        }`}
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <p className="text-xs text-rose-500 font-bold ml-1">
                          {formik.errors.lastName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Número de Teléfono / Celular
                      </label>
                      <Input
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="999888777"
                        startContent={
                          <Phone className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                        }
                        className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold transition-all ${
                          formik.touched.phone && formik.errors.phone
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : "focus:ring-celeste/20"
                        }`}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-xs text-rose-500 font-bold ml-1">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="h-14 px-10 bg-celeste hover:bg-celeste/90 text-white rounded-2xl font-black shadow-lg shadow-celeste/20 flex items-center gap-3 transition-all group cursor-pointer"
                    >
                      Continuar a Especialidad
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PASO 2: ESPECIALIDAD Y PERFIL PROFESIONAL */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-petroleo/5 bg-white dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
                <div className="bg-petroleo p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-verde-salud/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/20">
                      <Briefcase className="w-7 h-7 text-verde-salud" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">
                        Especialidad y Perfil Profesional
                      </h2>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">
                        Paso 2 de 3: Colegiatura y Área Médica
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Número de Colegiatura Médica (CMP)
                      </label>
                      <Input
                        name="medicalLicenseNumber"
                        value={formik.values.medicalLicenseNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ej. CMP-084512"
                        startContent={
                          <FileText className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                        }
                        className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold transition-all ${
                          formik.touched.medicalLicenseNumber &&
                          formik.errors.medicalLicenseNumber
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : "focus:ring-celeste/20"
                        }`}
                      />
                      {formik.touched.medicalLicenseNumber &&
                        formik.errors.medicalLicenseNumber && (
                          <p className="text-xs text-rose-500 font-bold ml-1">
                            {formik.errors.medicalLicenseNumber}
                          </p>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Selecciona Especialidad(es) Asignada(s)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {isLoadingSpecialties ? (
                          <div className="col-span-full py-4 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-celeste" />
                          </div>
                        ) : (
                          specialties.map((spec) => (
                            <button
                              key={spec.id}
                              type="button"
                              onClick={() => toggleSpecialty(spec.id)}
                              className={`p-5 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-3 text-center group cursor-pointer ${
                                formik.values.specialtyIds.includes(spec.id)
                                  ? "bg-celeste border-celeste text-white shadow-lg shadow-celeste/20 scale-[1.02]"
                                  : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-celeste/50 hover:bg-celeste/[0.01]"
                              }`}
                            >
                              <Stethoscope
                                className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                                  formik.values.specialtyIds.includes(spec.id)
                                    ? "text-white"
                                    : "text-zinc-400 group-hover:text-celeste"
                                }`}
                              />
                              <span className="line-clamp-1 block w-full">
                                {spec.name}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                      {formik.touched.specialtyIds &&
                        formik.errors.specialtyIds && (
                          <p className="text-xs text-rose-500 font-bold ml-1">
                            {formik.errors.specialtyIds as string}
                          </p>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Biografía / Perfil Profesional
                      </label>
                      <textarea
                        name="bio"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Resume la trayectoria, subespecialidades o experiencia clínica del médico..."
                        className={`w-full min-h-[130px] p-5 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-[1.8rem] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-celeste/20 transition-all resize-none ${
                          formik.touched.bio && formik.errors.bio
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : ""
                        }`}
                      />
                      {formik.touched.bio && formik.errors.bio && (
                        <p className="text-xs text-rose-500 font-bold ml-1">
                          {formik.errors.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="h-14 px-8 rounded-2xl font-black text-zinc-400 hover:text-petroleo transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Atrás
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="h-14 px-10 bg-celeste hover:bg-celeste/90 text-white rounded-2xl font-black shadow-lg shadow-celeste/20 flex items-center gap-3 transition-all group cursor-pointer"
                    >
                      Continuar a Credenciales
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PASO 3: CREDENCIALES DE ACCESO Y CONFIRMACIÓN */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-petroleo/5 bg-white dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
                <div className="bg-petroleo p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-celeste/15 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/20">
                      <KeyRound className="w-7 h-7 text-celeste" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">
                        Credenciales de Acceso
                      </h2>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">
                        Paso 3 de 3: Cuenta y Activación
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Correo Electrónico Institucional
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="dr.garcia@mediconnect.com"
                        startContent={
                          <Mail className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                        }
                        className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold transition-all ${
                          formik.touched.email && formik.errors.email
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : "focus:ring-celeste/20"
                        }`}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-xs text-rose-500 font-bold ml-1">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Contraseña Provisional
                      </label>
                      <Input
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Mínimo 6 caracteres"
                        startContent={
                          <Lock className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
                        }
                        className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold transition-all ${
                          formik.touched.password && formik.errors.password
                            ? "ring-2 ring-rose-500/50 border-rose-500"
                            : "focus:ring-celeste/20"
                        }`}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-xs text-rose-500 font-bold ml-1">
                          {formik.errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resumen de Confirmación Rápido */}
                  <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-celeste">
                      <ShieldCheck className="w-4 h-4" />
                      Resumen del Médico a Registrar
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-zinc-400 font-bold">Médico:</p>
                        <p className="font-black text-petroleo dark:text-white mt-0.5">
                          {formik.values.firstName || "---"} {formik.values.lastName || "---"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 font-bold">Colegiatura:</p>
                        <p className="font-black text-petroleo dark:text-white mt-0.5">
                          {formik.values.medicalLicenseNumber || "---"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 font-bold">Especialidad(es):</p>
                        <p className="font-black text-celeste mt-0.5 truncate">
                          {selectedSpecialtyNames.length > 0
                            ? selectedSpecialtyNames.join(", ")
                            : "Ninguna seleccionada"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="h-14 px-8 rounded-2xl font-black text-zinc-400 hover:text-petroleo transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !formik.isValid}
                      className="h-14 px-12 bg-celeste hover:bg-celeste/90 text-white rounded-2xl font-black shadow-lg shadow-celeste/20 flex items-center gap-3 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Finalizar Registro
                          <UserPlus className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
