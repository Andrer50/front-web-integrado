"use client";

import { QueryProvider } from "./query-provider";
import React from "react";
import { Toaster } from "sonner";
import NextAuthProvider from "./session-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NextAuthProvider>{children}</NextAuthProvider>
      <Toaster position="top-center" richColors />
    </QueryProvider>
  );
}
