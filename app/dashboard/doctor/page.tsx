"use client";

import { useSession } from "next-auth/react";
import { useDoctors } from "@/modules/domain/doctor/hooks/useDoctors";
import { useAppointments } from "@/modules/domain/appointment/hooks/useAppointments";
import {
  Calendar,
  Users,
  ClipboardList,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMemo } from "react";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1. Cargar la lista de doctores para encontrar al actual mediante su userId
  const { data: doctorsData, isLoading: isLoadingDoctors } = useDoctors({
    page: 0,
    size: 100, // Asumimos un máximo de 100 doctores temporalmente
  });

  const currentDoctor = useMemo(() => {
    if (!userId || !doctorsData?.data?.content) return null;
    return doctorsData.data.content.find((doc) => String(doc.user.id) === String(userId));
  }, [userId, doctorsData]);

  // 2. Obtener las citas del doctor
  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useAppointments(
      currentDoctor?.id ? { doctorId: currentDoctor.id, size: 50, page: 0 } : {}
    );

  const appointmentsList = useMemo(() => {
    return appointmentsData?.data?.content || [];
  }, [appointmentsData]);

  // Filtrar citas del día de hoy
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  
  const todaysAppointments = useMemo(() => {
    return appointmentsList.filter(app => app.appointmentDate === todayStr);
  }, [appointmentsList, todayStr]);

  const upcomingPatients = useMemo(() => {
    // Para próximos pacientes, tomamos los pendientes/confirmados y ordenamos por hora
    return appointmentsList
      .filter(app => app.status === "PENDING" || app.status === "CONFIRMED")
      .sort((a, b) => {
        // Orden simplificado por fecha y hora
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime || "00:00:00"}`);
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime || "00:00:00"}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5); // Mostrar los próximos 5
  }, [appointmentsList]);

  // Métricas
  const totalHoy = todaysAppointments.length;
  const atendidosHoy = todaysAppointments.filter(a => a.status === "COMPLETED").length;
  const pendientesHoy = todaysAppointments.filter(a => a.status === "PENDING" || a.status === "CONFIRMED").length;
  const historiasClinicas = appointmentsList.filter(a => a.status === "COMPLETED").length;

  if (isLoadingDoctors || (currentDoctor?.id && isLoadingAppointments)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Spinner className="w-12 h-12 text-celeste" />
        <p className="text-zinc-500 font-bold">Cargando tu agenda de hoy...</p>
      </div>
    );
  }

  if (!currentDoctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h3 className="text-xl font-bold text-petroleo dark:text-white">Perfil no encontrado</h3>
        <p className="text-zinc-500 text-sm max-w-md text-center">
          No pudimos encontrar tu perfil de doctor asociado a esta cuenta. 
          Contacta al administrador del sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-celeste mb-1 uppercase tracking-widest">
            Panel del Médico
          </p>
          <h1 className="text-4xl font-black text-petroleo dark:text-white tracking-tight">
            Buenos días, Dr. {currentDoctor.user.lastName}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Hoy tienes{" "}
            <span className="text-petroleo dark:text-white font-bold">
              {totalHoy} citas
            </span>{" "}
            programadas en tu agenda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-6 py-6 border-zinc-200 font-bold text-zinc-600 cursor-pointer hover:bg-zinc-100"
          >
            <Clock className="w-5 h-5 mr-2" />
            Agenda de hoy
          </Button>
          <Button variant="celeste" className="rounded-xl px-6 py-6 font-bold cursor-pointer hover:shadow-lg transition-all">
            <Calendar className="w-5 h-5 mr-2" />
            Ver Calendario
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Pacientes Hoy",
            value: totalHoy.toString(),
            icon: Users,
            color: "text-celeste",
            bg: "bg-blue-50",
          },
          {
            title: "Atendidos",
            value: atendidosHoy.toString(),
            icon: UserCheck,
            color: "text-verde-salud",
            bg: "bg-emerald-50",
          },
          {
            title: "Pendientes",
            value: pendientesHoy.toString(),
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            title: "Historias Creadas",
            value: historiasClinicas.toString(),
            icon: ClipboardList,
            color: "text-tiffany",
            bg: "bg-indigo-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-zinc-800/50 flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-semibold text-petroleo dark:text-white leading-tight mt-1">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Next Patients */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between border-b border-zinc-50 dark:border-zinc-900 pb-6 mb-6">
              <div>
                <CardTitle className="text-xl font-bold text-petroleo dark:text-white">
                  Próximos Pacientes
                </CardTitle>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  Lista de espera y citas inmediatas
                </p>
              </div>
              <Button variant="link" className="text-celeste font-bold p-0 hover:text-blue-700">
                Ver todos <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {upcomingPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-300 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-petroleo dark:text-zinc-200">¡Agenda al día!</h4>
                  <p className="text-sm text-zinc-500">No hay pacientes esperando atención en este momento.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {upcomingPatients.map((app) => (
                    <div
                      key={app.id}
                      className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all group"
                    >
                      <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border-[3px] border-white dark:border-zinc-900 shadow-sm flex items-center justify-center text-zinc-400">
                          <span className="font-black text-lg text-celeste">
                            {app.patientFirstName.charAt(0)}{app.patientLastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-petroleo dark:text-white group-hover:text-celeste transition-colors truncate max-w-[200px]">
                            {app.patientFirstName} {app.patientLastName}
                          </h3>
                          <p className="text-xs font-bold text-verde-salud truncate max-w-[200px] mt-0.5">
                            {app.reason || "Consulta general"}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1 font-bold tracking-widest uppercase">
                            Cita #{app.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right flex flex-col items-end">
                          <p className="text-sm font-black text-petroleo dark:text-white flex items-center gap-2 justify-end bg-blue-50/50 dark:bg-blue-900/10 px-3 py-1.5 rounded-lg border border-blue-100/50 dark:border-blue-800/20">
                            <Clock className="w-4 h-4 text-celeste" />
                            {app.appointmentTime ? app.appointmentTime.substring(0, 5) : "--:--"}
                            <span className="text-[10px] text-zinc-400 font-bold ml-1">{new Date(`${app.appointmentDate}T00:00:00`).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }).replace('.', '')}</span>
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest border mt-2 ${
                              app.status === "PENDING"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${app.status === "PENDING" ? "bg-amber-500" : "bg-emerald-500"}`}
                            ></span>
                            {app.status === "PENDING" ? "POR ATENDER" : "CONFIRMADO"}
                          </span>
                        </div>
                        <Link href={`/dashboard/doctor/consultations/${app.id}`}>
                          <Button
                            variant="celeste"
                            size="sm"
                            className="rounded-xl font-bold shadow-sm cursor-pointer hover:shadow-md transition-all px-4"
                          >
                            Atender
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Activity & Reminder */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold text-petroleo dark:text-white">
                Métricas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="p-5 bg-blanco-azulado rounded-[1.5rem] border border-blue-50 relative overflow-hidden group hover:border-blue-100 transition-colors">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-bold text-celeste uppercase tracking-widest mb-1">
                      Eficiencia de atención
                    </p>
                    <h4 className="text-2xl font-semibold text-petroleo tracking-tight">
                      {totalHoy > 0 ? Math.round((atendidosHoy / totalHoy) * 100) : 100}%
                    </h4>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-verde-salud shadow-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  Tiempo promedio / paciente
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-petroleo dark:text-white">
                    24
                  </span>
                  <span className="text-sm font-bold text-zinc-500">
                    minutos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-petroleo text-white shadow-lg shadow-blue-900/20 border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-celeste/20 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
            <CardContent className="p-8 relative z-10">
              <div className="w-12 h-12 bg-celeste/20 rounded-2xl flex items-center justify-center text-celeste mb-6">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3 tracking-tight text-white">
                Recordatorio
              </h3>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                Al finalizar una consulta no olvides cambiar el estado de la cita a Completada para actualizar tus métricas de eficiencia automáticamente.
              </p>
              <Button
                variant="ghost"
                className="mt-6 w-full py-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all cursor-pointer"
              >
                Revisar Agenda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
