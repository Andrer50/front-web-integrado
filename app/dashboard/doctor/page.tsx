"use client";

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
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function DoctorDashboardPage() {
  const nextPatients = [
    {
      name: "Juan Pérez",
      time: "09:00 AM",
      reason: "Control anual",
      status: "ESPERANDO",
      id: "PAT-2034",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      name: "María Garcia",
      time: "09:30 AM",
      reason: "Consulta general",
      status: "EN CAMINO",
      id: "PAT-8821",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      name: "Carlos Ruiz",
      time: "10:15 AM",
      reason: "Revisión de resultados",
      status: "PROGRAMADO",
      id: "PAT-3345",
      initials: "CR",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-celeste mb-1 uppercase tracking-widest">
            Panel del Médico
          </p>
          <h1 className="text-4xl font-black text-petroleo dark:text-white tracking-tight">
            Buenos días, Dr. Palma
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Hoy tienes{" "}
            <span className="text-petroleo dark:text-white font-bold">
              8 citas
            </span>{" "}
            programadas. 3 pacientes están esperando en sala.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-6 py-6 border-zinc-200 font-bold text-zinc-600"
          >
            <Clock className="w-5 h-5 mr-2" />
            Agenda de hoy
          </Button>
          <Button variant="celeste" className="rounded-xl px-6 py-6 font-bold">
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
            value: "8",
            icon: Users,
            color: "text-celeste",
            bg: "bg-blue-50",
          },
          {
            title: "Atendidos",
            value: "5",
            icon: UserCheck,
            color: "text-verde-salud",
            bg: "bg-emerald-50",
          },
          {
            title: "Pendientes",
            value: "3",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            title: "Historias Clínicas",
            value: "12",
            icon: ClipboardList,
            color: "text-tiffany",
            bg: "bg-indigo-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] overflow-hidden"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-zinc-800 flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-semibold text-petroleo dark:text-white leading-tight">
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
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-petroleo dark:text-white">
                  Próximos Pacientes
                </CardTitle>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  Lista de espera y citas inmediatas
                </p>
              </div>
              <Button variant="link" className="text-celeste font-bold p-0">
                Ver todos <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>

            <CardContent className="p-0 mt-6">
              <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {nextPatients.map((patient, i) => (
                  <div
                    key={i}
                    className="p-8 flex flex-col sm:flex-row items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all group"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-blanco-azulado shrink-0 border-2 border-white dark:border-zinc-800 shadow-sm">
                        {patient.image ? (
                          <img
                            src={patient.image}
                            alt={patient.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-celeste font-bold text-lg">
                            {patient.initials}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-petroleo dark:text-white group-hover:text-celeste transition-colors">
                          {patient.name}
                        </h3>
                        <p className="text-xs font-bold text-verde-salud">
                          {patient.reason}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-1 font-bold tracking-widest">
                          {patient.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-sm font-bold text-petroleo dark:text-white flex items-center gap-2 justify-end">
                          <Clock className="w-4 h-4 text-celeste" />
                          {patient.time}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border mt-2 ${
                            patient.status === "ESPERANDO"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-zinc-50 text-zinc-500 border-zinc-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${patient.status === "ESPERANDO" ? "bg-emerald-500" : "bg-zinc-400"}`}
                          ></span>
                          {patient.status}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-petroleo transition-colors rounded-xl"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Activity & Reminder */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold text-petroleo dark:text-white">
                Métricas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="p-5 bg-blanco-azulado rounded-[1.5rem] border border-blue-50 relative overflow-hidden group">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-bold text-celeste uppercase tracking-widest mb-1">
                      Eficiencia de atención
                    </p>
                    <h4 className="text-2xl font-semibold text-petroleo tracking-tight">
                      85%
                    </h4>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-verde-salud shadow-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-zinc-50 dark:bg-zinc-800 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
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

          <Card className="rounded-[2.5rem] bg-petroleo text-white shadow-lg shadow-blue-900/10 border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-celeste/20 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
            <CardContent className="p-8 relative z-10">
              <div className="w-12 h-12 bg-celeste/20 rounded-2xl flex items-center justify-center text-celeste mb-6">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3 tracking-tight text-white">
                Recordatorio
              </h3>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                No olvides completar la historia clínica del paciente{" "}
                <span className="text-white font-bold">Carlos Ruiz</span> antes
                de finalizar tu turno a las 02:00 PM.
              </p>
              <Button
                variant="ghost"
                className="mt-6 w-full py-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all"
              >
                Ir a pendientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
