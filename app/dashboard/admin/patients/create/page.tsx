"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import { useCreatePatient } from "@/modules/domain/user/patient/hooks/useCreatePatient";
import { PatientRegisterRequest } from "@/core/user/patient/interfaces";
import { patientValidationSchema } from "@/modules/features/user/patient/validations";

export default function CreatePatientPage() {
  const router = useRouter();
  const { mutate: createPatient, isPending } = useCreatePatient();

  const formik = useFormik<PatientRegisterRequest>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      birthDate: "",
      documentNumber: "",
      gender: "MALE",
      address: "",
    },
    validationSchema: patientValidationSchema,
    onSubmit: (values) => {
      createPatient(values);
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-xl text-zinc-400 hover:text-petroleo transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm font-bold text-petroleo dark:text-white mb-1 uppercase tracking-widest">
            Gestión de Pacientes
          </p>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Registrar Nuevo Paciente
          </h1>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <CardTitle className="text-xl font-bold text-petroleo dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-celeste/20 text-celeste flex items-center justify-center text-sm">
                  1
                </span>
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Nombres
                </Label>
                <Input
                  id="firstName"
                  {...formik.getFieldProps("firstName")}
                  placeholder="Ej: Juan"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-xs font-bold text-red-500">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Apellidos
                </Label>
                <Input
                  id="lastName"
                  {...formik.getFieldProps("lastName")}
                  placeholder="Ej: Pérez García"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-xs font-bold text-red-500">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="documentNumber"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  DNI / Documento
                </Label>
                <Input
                  id="documentNumber"
                  {...formik.getFieldProps("documentNumber")}
                  placeholder="8 dígitos"
                  maxLength={8}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                />
                {formik.touched.documentNumber &&
                  formik.errors.documentNumber && (
                    <p className="text-xs font-bold text-red-500">
                      {formik.errors.documentNumber}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="birthDate"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...formik.getFieldProps("birthDate")}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <p className="text-xs font-bold text-red-500">
                    {formik.errors.birthDate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Género
                </Label>
                <select
                  id="gender"
                  {...formik.getFieldProps("gender")}
                  className="w-full h-11 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-celeste text-sm font-medium"
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <CardTitle className="text-xl font-bold text-petroleo dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-verde-salud/20 text-verde-salud flex items-center justify-center text-sm">
                  2
                </span>
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-bold text-zinc-700 dark:text-zinc-300"
                  >
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                    placeholder="ejemplo@correo.com"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs font-bold text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="font-bold text-zinc-700 dark:text-zinc-300"
                  >
                    Teléfono / Celular
                  </Label>
                  <Input
                    id="phone"
                    {...formik.getFieldProps("phone")}
                    placeholder="Ej: +51 987 654 321"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-xs font-bold text-red-500">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Dirección
                </Label>
                <Input
                  id="address"
                  {...formik.getFieldProps("address")}
                  placeholder="Av. Las Magnolias 123, Lima"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <CardTitle className="text-xl font-bold text-petroleo dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-sm">
                  3
                </span>
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Contraseña Temporal
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  placeholder="******"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs font-bold text-red-500">
                    {formik.errors.password}
                  </p>
                )}
                <p className="text-[11px] text-zinc-400 font-medium">
                  El paciente podrá cambiar esta contraseña en su primer inicio
                  de sesión.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={isPending || !formik.isValid}
                  className="w-full h-12 bg-celeste hover:bg-petroleo text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isPending ? "Registrando..." : "Guardar Paciente"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="w-full h-12 text-zinc-500 font-bold rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-3xl bg-blanco-azulado border border-blue-50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-6 h-6 text-celeste" />
            </div>
            <h4 className="font-bold text-petroleo">Importante</h4>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              Al registrar al paciente, se le enviará automáticamente un correo
              electrónico con sus credenciales de acceso al sistema.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
