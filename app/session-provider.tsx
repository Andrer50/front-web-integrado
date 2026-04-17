"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={4 * 60} // Cada 4 min → refresca proactivamente antes de que expire el AT (15 min)
      refetchOnWindowFocus={true} // Al volver al tab → valida sesión de inmediato
    >
      {children}
    </SessionProvider>
  );
}
