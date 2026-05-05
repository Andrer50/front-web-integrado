"use client";

import { PatientRegisterRequest } from "@/core/user/patient/interfaces";
import { useCreatePatient } from "@/modules/user/patient/hooks/useCreatePatient";
import RegisterFormHeader from "@/presentation/authentication/components/register-form-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import {
  Mail,
  Lock,
  Phone,
  User,
  CreditCard,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

// ─── Estilos reutilizables ────────────────────────────────────────────────────
const inputClassName =
  "w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200";
const labelClassName =
  "block text-[13px] font-semibold text-gris-azulado mb-1.5";
const iconClassName =
  "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none";

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { createPatientMutation } = useCreatePatient();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const initialValues: PatientRegisterRequest & { confirmPassword: string } = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    documentNumber: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmitRegister(values),
  });

  // ─── Lógica de registro y auto-login ───────────────────────────────────────

  const handleSubmitRegister = async (
    values: PatientRegisterRequest & { confirmPassword: string },
  ) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...payload } = values;

      await createPatientMutation.mutateAsync(payload);

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error("Cuenta creada, pero hubo un error al iniciar sesión");
        router.push("/authentication/sign-in");
        return;
      }

      toast.success("¡Cuenta creada exitosamente!");

      let session = await getSession();

      if (!session?.user) {
        await new Promise((res) => setTimeout(res, 300));
        session = await getSession();
      }

      const role = session?.user?.role;

      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.replace(callbackUrl);
        return;
      }

      // fallback por rol
      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "DOCTOR") {
        router.push("/dashboard/doctor");
      } else if (role === "PATIENT") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Ocurrió un error durante el registro";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Borde superior degradado */}
        <div className="h-2 bg-gradient-to-r from-petroleo via-[#236b8e] to-celeste w-full" />

        <div className="p-8 sm:p-10">
          {/* Encabezado */}
          <RegisterFormHeader />

          {/* Formulario */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className={labelClassName} htmlFor="firstName">
                  Nombre
                </Label>
                <div className="relative">
                  <div className={iconClassName}>
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Juan"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <Label className={labelClassName} htmlFor="lastName">
                  Apellido
                </Label>
                <div className="relative">
                  <div className={iconClassName}>
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Pérez"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Correo electrónico */}
            <div>
              <Label className={labelClassName} htmlFor="email">
                Correo electrónico
              </Label>
              <div className="relative">
                <div className={iconClassName}>
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="paciente@clinica.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Contraseña y Confirmar contraseña */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className={labelClassName} htmlFor="password">
                  Contraseña
                </Label>
                <div className="relative">
                  <div className={iconClassName}>
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`${inputClassName} placeholder:text-lg`}
                  />
                </div>
              </div>

              <div>
                <Label className={labelClassName} htmlFor="confirmPassword">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <div className={iconClassName}>
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className={`${inputClassName} placeholder:text-lg`}
                  />
                </div>
              </div>
            </div>

            {/* Teléfono y Número de documento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className={labelClassName} htmlFor="phone">
                  Teléfono
                </Label>
                <div className="relative">
                  <div className={iconClassName}>
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+51999999999"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <Label className={labelClassName} htmlFor="documentNumber">
                  N° de documento
                </Label>
                <div className="relative">
                  <div className={iconClassName}>
                    <CreditCard className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="documentNumber"
                    name="documentNumber"
                    type="text"
                    placeholder="12345678"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.documentNumber}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <Label className={labelClassName} htmlFor="birthDate">
                Fecha de nacimiento
              </Label>
              <div className="relative">
                <div className={iconClassName}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.birthDate}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Botón de registro */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full mt-7 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-sm"
            >
              Crear cuenta
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Enlace a iniciar sesión */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/authentication/sign-in"
                className="text-[#297da0] hover:text-celeste transition-colors font-semibold"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Pie de página */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-[300px] mx-auto">
              Al crear una cuenta, aceptas los{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Términos de servicio
              </Link>{" "}
              y la{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
