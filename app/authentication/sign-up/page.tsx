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
  BriefcaseMedical,
  ShieldCheck,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useCreatePatient } from "@/modules/domain/user/patient/hooks/useCreatePatient";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";


export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const createPatientMutation = useCreatePatient();
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

      // 3. GET SESSION
      let session = await getSession();

      if (!session?.user) {
        await new Promise((res) => setTimeout(res, 300));
        session = await getSession();
      }

      const role = session?.user?.role;

      // 4. REDIRECT BASED ON CALLBACK OR ROLE
      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.replace(callbackUrl);
        return;
      }

      // Fallback por rol
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

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row antialiased bg-white">
      
      {/* Left Panel: Banner & Brand (Desktop only) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative flex-col justify-between p-12 lg:p-16 text-white overflow-hidden bg-petroleo">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 mix-blend-luminosity scale-100 transition-transform duration-700 hover:scale-105" 
          style={{ backgroundImage: "url('/auth_medical_banner.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-petroleo/95 via-[#13374f]/90 to-celeste/70 pointer-events-none"></div>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <BriefcaseMedical className="text-celeste w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">MediConnect</span>
        </div>

        {/* Bottom Brand Presentation */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            Únete a la Red de Salud Digital
          </h2>
          <p className="text-white/80 text-[14px] lg:text-[15px] leading-relaxed font-light max-w-md">
            Crea tu cuenta de paciente para gestionar de forma inmediata tus consultas, recetas digitales y acceder a telemedicina segura.
          </p>
          
          <div className="pt-4 flex items-center gap-2 text-xs text-celeste font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Protección y privacidad de datos</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-between p-8 sm:p-16 md:p-20 lg:p-24 bg-white relative min-h-screen">
        {/* Top colored line for mobile */}
        <div className="h-1.5 bg-gradient-to-r from-petroleo via-[#236b8e] to-celeste absolute top-0 left-0 right-0 w-full md:hidden"></div>

        {/* Spacer / Logo on mobile */}
        <div className="flex md:hidden flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blanco-azulado rounded-xl flex items-center justify-center mb-3">
            <BriefcaseMedical className="text-petroleo w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-petroleo tracking-tight">MediConnect</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Crea tu cuenta de paciente
          </p>
        </div>

        {/* Main Form Box */}
        <div className="my-auto w-full max-w-[500px] mx-auto space-y-5">
          <div className="hidden md:block">
            <h2 className="text-3xl font-extrabold text-petroleo tracking-tight mb-2">
              Crear Cuenta
            </h2>
            <p className="text-[14px] text-gray-500">
              Regístrate como paciente para empezar a gestionar tu salud
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
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
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
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
              className="w-full mt-6 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-md transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              Crear Cuenta
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-[13px] text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/authentication/sign-in"
                className="text-[#297da0] hover:text-celeste font-semibold hover:underline"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="pt-6 border-t border-gray-100 text-center w-full max-w-[500px] mx-auto mt-6">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Al crear una cuenta, aceptas los  {" "}
            <Link
              href="#"
              className="text-[#297da0] hover:text-celeste transition-colors font-medium hover:underline"
            >
              Términos de Servicio
            </Link>{" "}
            y la{" "}
            <Link
              href="#"
              className="text-[#297da0] hover:text-celeste transition-colors font-medium hover:underline"
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );

}