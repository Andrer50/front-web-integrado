"use client";

import { LoginAuthenticationRequest } from "@/core/auth/interfaces";
import { useFormik } from "formik";
import { Mail, Lock, ArrowRight, ArrowDownNarrowWide } from "lucide-react";
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
          Loading...
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
  const searchParams = useSearchParams(); // Aquí se usa el hook problemático

  const callbackUrl = searchParams.get("callbackUrl");

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

      if (formik.errors.email || formik.errors.password) {
        toast.error("Por favor, corrige los errores");
        return;
      }

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success("Inicio de sesión exitoso");
        const session = await getSession();

        if (callbackUrl) {
          router.replace(callbackUrl);
          return;
        }

        /*  if (session?.user.role === "ADMIN") {
          router.push("/dashboard/admin-home");
        } else if (session?.user.role === "DOCTOR") {
          router.push("/dashboard/home");
        } else {
          router.push("/dashboard");
        } */
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
        {/* Top Gradient Border */}
        <div className="h-2 bg-gradient-to-r from-petroleo via-[#236b8e] to-celeste w-full"></div>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <LoginFormHeader />

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div>
              <Label
                className="block text-[13px] font-semibold text-gris-azulado mb-1.5"
                htmlFor="email"
              >
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
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
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-[13px] font-semibold text-[#297da0] hover:text-celeste transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
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
                  className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 placeholder:text-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLogging}
              className="w-full mt-7 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-sm"
              onClick={formik.submitForm}
            >
              Secure Sign In
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Footer Text */}
          <div className="mt-8 pt-6 text-center">
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-[280px] mx-auto">
              Authorized access only. By signing in, you agree to the{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Terms of Service
              </Link>{" "}
              &{" "}
              <Link
                href="#"
                className="text-[#297da0] hover:text-celeste transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
