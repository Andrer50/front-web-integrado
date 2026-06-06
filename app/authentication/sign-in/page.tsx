"use client";

import { LoginAuthenticationRequest } from "@/core/auth/interfaces";
import { useFormik } from "formik";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  BriefcaseMedical,
  ShieldCheck,
} from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
          Cargando...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");
  const changeShowPassword = () => setShowPassword(!showPassword);
  const initialValues: LoginAuthenticationRequest = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: LoginAuthenticationRequest) => handleSubmitLogin(values),
  });

  const handleSubmitLogin = async (values: LoginAuthenticationRequest) => {
    setIsLogging(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success("Inicio de sesión exitoso");

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

        if (session?.user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (session?.user.role === "DOCTOR") {
          router.push("/dashboard/doctor");
        } else {
          router.push("/dashboard/patient");
        }
      }
    } catch {
      toast.error("Ocurrió un problema");
    } finally {
      setIsLogging(false);
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
            Excelencia Clínica mediante Acceso Seguro
          </h2>
          <p className="text-white/80 text-[14px] lg:text-[15px] leading-relaxed font-light max-w-md">
            Nuestra plataforma integrada le permite gestionar citas, visualizar
            historias clínicas y comunicarse con sus especialistas médicos con
            total confidencialidad.
          </p>

          <div className="pt-4 flex items-center gap-2 text-xs text-celeste font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Conexión cifrada de extremo a extremo</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Sign-In Form */}
      <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col justify-between p-8 sm:p-16 md:p-20 lg:p-24 bg-white relative min-h-screen">
        {/* Top colored line for mobile */}
        <div className="h-1.5 bg-gradient-to-r from-petroleo via-[#236b8e] to-celeste absolute top-0 left-0 right-0 w-full md:hidden"></div>

        {/* Spacer / Logo on mobile */}
        <div className="flex md:hidden flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blanco-azulado rounded-xl flex items-center justify-center mb-3">
            <BriefcaseMedical className="text-petroleo w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-petroleo tracking-tight">
            MediConnect
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Excelencia Clínica mediante Acceso Seguro
          </p>
        </div>

        {/* Main Form Box */}
        <div className="my-auto w-full max-w-[440px] mx-auto space-y-6">
          <div className="hidden md:block">
            <h2 className="text-3xl font-extrabold text-petroleo tracking-tight mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-[14px] text-gray-500">
              Ingresa tus credenciales para acceder a la plataforma
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label
                className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                htmlFor="email"
              >
                Correo Electrónico
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="medico@clinica.com"
                  startContent={<Mail className="h-4 w-4 text-gray-500" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label
                  className="block text-[13px] font-semibold text-gris-azulado"
                  htmlFor="password"
                >
                  Contraseña
                </Label>
                <Link
                  href="#"
                  className="text-[12px] font-semibold text-[#297da0] hover:text-celeste transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  startContent={<Lock className="h-4 w-4 text-gray-500" />}
                  endContent={
                    <button
                      type="button"
                      onClick={changeShowPassword}
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLogging}
              className="w-full mt-6 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-md transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              Iniciar Sesión Seguro
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Registration Link */}
          <div className="text-center">
            <p className="text-[13px] text-gray-500">
              ¿No tienes cuenta?{" "}
              <Link
                href="/authentication/sign-up"
                className="text-[#297da0] hover:text-celeste font-semibold hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Policy / Footer */}
        <div className="pt-6 border-t border-gray-100 text-center w-full max-w-[440px] mx-auto mt-6">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Solo acceso autorizado. Al iniciar sesión, aceptas los{" "}
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
