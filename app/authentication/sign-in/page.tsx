"use client";

import { LoginAuthenticationRequest } from "@/core/auth/interfaces";
import { useFormik } from "formik";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LoginFormHeader from "@/presentation/authentication/components/login-form-header";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
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
      toast.error("Ocurrio un problema");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-petroleo via-[#236b8e] to-celeste w-full"></div>

        <div className="p-8 sm:p-10">
          <LoginFormHeader />

          <form onSubmit={formik.handleSubmit} className="space-y-5">
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
                placeholder="medico@clinica.com"
                startContent={<Mail className="h-4 w-4 text-gray-500" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
              />
            </div>

            {/* Password */}
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
                  className="text-[13px] font-semibold text-[#297da0] hover:text-celeste transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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

            {/* Button */}
            <Button
              type="submit"
              isLoading={isLogging}
              className="w-full mt-7 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-sm"
            >
              Iniciar Sesión Seguro
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Registro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{" "}
              <Link
                href="/authentication/sign-up"
                className="text-[#297da0] hover:text-celeste font-semibold"
              >
                Regístrate
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 text-center">
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-[280px] mx-auto">
              Solo acceso autorizado. Al iniciar sesión, aceptas los{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Términos de Servicio
              </Link>{" "}
              y la{" "}
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
