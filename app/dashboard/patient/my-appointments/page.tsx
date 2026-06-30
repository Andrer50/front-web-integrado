"use client";

import { useSession } from "next-auth/react";
import { usePatientByUserId } from "@/modules/domain/user/patient/hooks/usePatientByUserId";
import { ChevronRight, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppointmentList } from "@/presentation/dashboard/admin/appointments/appointment-list";

export default function PatientAppointmentsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1. Obtener los detalles del Paciente a partir del userId de la sesión directamente
  const { data: patientData, isLoading: isLoadingPatient } = usePatientByUserId(
    userId ? String(userId) : undefined,
  );
  
  const patient = patientData?.data;
  const patientId = patient?.id;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest">
            <span>Inicio</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-petroleo">Mis citas</span>
          </nav>
          <h1 className="text-4xl font-black text-petroleo dark:text-white tracking-tight">
            Mis citas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Gestiona tus consultas programadas y revisa tu historial médico.
          </p>
        </div>

        {patientId && (
          <Link href="/dashboard/patient/my-appointments/reservation">
            <Button 
              variant="celeste" 
              className="rounded-2xl h-auto py-4 px-8 font-bold w-full md:w-fit cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Cita
            </Button>
          </Link>
        )}
      </div>

      {/* Listado de Citas de Paciente */}
      {isLoadingPatient ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner className="w-10 h-10 text-celeste" />
          <p className="text-zinc-500 font-bold text-sm">Cargando información del paciente...</p>
        </div>
      ) : patientId ? (
        <AppointmentList patientId={patientId} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-lg text-petroleo dark:text-white">No se encontró perfil de paciente</h3>
          <p className="text-zinc-400 text-sm mt-1 max-w-sm text-center">
            No se pudo encontrar un perfil de paciente vinculado a tu cuenta de usuario.
          </p>
        </div>
      )}
    </div>
  );
}
