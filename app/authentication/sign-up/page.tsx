"use client";

import { PatientRegisterRequest } from "@/core/user/patient/interfaces";
import { useFormik } from "formik";
import {
  Mail,
  Lock,
  Phone,
  User,
  CreditCard,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RegisterFormHeader from "@/presentation/authentication/components/register-form-header";
import { useCreatePatient } from "@/modules/domain/user/patient/hooks/useCreatePatient";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const createPatientMutation = useCreatePatient();

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

      // 1. REGISTER
      await createPatientMutation.mutateAsync(payload);

      // 2. AUTO LOGIN
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error("Cuenta creada pero falló el inicio de sesión");
        router.push("/authentication/sign-in");
        return;
      }

      toast.success("Cuenta creada con éxito");

      // 3. REDIRECT
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Ocurrió un error durante el registro";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Top Gradient Border */}
        <div className="h-2 bg-gradient-to-r from-petroleo via-[#236b8e] to-celeste w-full" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <RegisterFormHeader />

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                  htmlFor="firstName"
                >
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  startContent={<User className="h-4 w-4 text-gray-500" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>

              <div>
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                  htmlFor="lastName"
                >
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  startContent={<User className="h-4 w-4 text-gray-500" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label
                className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                htmlFor="email"
              >
                Correo Electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="paciente@clinica.com"
                startContent={<Mail className="h-4 w-4 text-gray-500" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                  htmlFor="password"
                >
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  startContent={<Lock className="h-4 w-4 text-gray-500" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 placeholder:text-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>

              <div>
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                  htmlFor="confirmPassword"
                >
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  startContent={<Lock className="h-4 w-4 text-gray-500" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 placeholder:text-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Phone + Document Number */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                  htmlFor="phone"
                >
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+51999999999"
                  startContent={<Phone className="h-4 w-4 text-gray-500" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>

              <div>
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                  htmlFor="documentNumber"
                >
                  N° de Documento
                </Label>
                <Input
                  id="documentNumber"
                  name="documentNumber"
                  type="text"
                  placeholder="12345678"
                  startContent={<CreditCard className="h-4 w-4 text-gray-500" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.documentNumber}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <Label
                className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                htmlFor="birthDate"
              >
                Fecha de Nacimiento
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                startContent={<Calendar className="h-4 w-4 text-gray-500" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthDate}
                className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full mt-7 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-sm"
              onClick={formik.submitForm}
            >
              Crear Cuenta
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/authentication/sign-in"
                className="text-[#297da0] hover:text-celeste transition-colors font-semibold"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-[300px] mx-auto">
              Al crear una cuenta, aceptas los{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Términos de Servicio
              </Link>{" "}
              &{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
