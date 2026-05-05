"use client";

import { PatientRegisterRequest } from "@/core/user/patient/interfaces";
import { useFormik } from "formik";
import { Mail, Lock, Phone, User, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RegisterFormHeader from "@/presentation/authentication/components/register-form-header";
import { useCreatePatient } from "@/modules/user/patient/hooks/useCreatePatient";

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { createPatientMutation } = useCreatePatient();

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
  values: PatientRegisterRequest & { confirmPassword: string }
) => {
  if (values.password !== values.confirmPassword) {
    toast.error("Passwords do not match");
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
      toast.error("Account created but login failed");
      router.push("/authentication/sign-in");
      return;
    }

    toast.success("Account created successfully");

    // 3. REDIRECT 
    router.push("/dashboard");

  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "An error occurred during registration";

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
                <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="firstName">
                  First Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="firstName" name="firstName" type="text" placeholder="John"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName}
                    className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="lastName">
                  Last Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="lastName" name="lastName" type="text" placeholder="Doe"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName}
                    className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="email">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <Input id="email" name="email" type="email" placeholder="patient@clinic.com"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                  className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="password">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="password" name="password" type="password" placeholder="••••••••"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                    className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 placeholder:text-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
                    className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 placeholder:text-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Phone + Document Number */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="phone">
                  Phone
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="phone" name="phone" type="tel" placeholder="+51999999999"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone}
                    className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="documentNumber">
                  Document No.
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="documentNumber" name="documentNumber" type="text" placeholder="12345678"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.documentNumber}
                    className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <Label className="block text-[13px] font-semibold text-gris-azulado mb-1.5" htmlFor="birthDate">
                Birth Date
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <Input id="birthDate" name="birthDate" type="date"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birthDate}
                  className="w-full pl-10 pr-4 py-3 bg-[#f3f6fc] border border-transparent rounded-lg text-sm text-petroleo placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-celeste/20 focus:border-celeste transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full mt-7 bg-[#2381a8] hover:bg-[#1f7396] text-white text-[15px] font-semibold py-6 rounded-lg shadow-sm"
              onClick={formik.submitForm}
            >
              Create Account
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </Button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-500">
              Already have an account?{" "}
              <Link href="/authentication/sign-in" className="text-[#297da0] hover:text-celeste transition-colors font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-[300px] mx-auto">
              By creating an account, you agree to the{" "}
              <Link href="#" className="text-[#297da0] hover:text-celeste transition-colors font-medium">
                Terms of Service
              </Link>{" "}
              &{" "}
              <Link href="#" className="text-[#297da0] hover:text-celeste transition-colors font-medium">
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