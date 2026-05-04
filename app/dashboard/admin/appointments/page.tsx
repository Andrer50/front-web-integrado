"use client";

import { 
  CalendarDays, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAppointmentsPage() {
  const appointments = [
    {
      id: "APP-9283",
      patient: "Juan Pérez García",
      doctor: "Dr. Ricardo Palma",
      specialty: "Cardiología",
      date: "15 de Mayo, 2024",
      time: "09:30 AM",
      status: "CONFIRMADA",
      type: "Presencial"
    },
    {
      id: "APP-1102",
      patient: "María Rodríguez Luna",
      doctor: "Dra. Sarah Jenkins",
      specialty: "Consulta General",
      date: "18 de Mayo, 2024",
      time: "04:00 PM",
      status: "PENDIENTE",
      type: "Virtual"
    },
    {
      id: "APP-8842",
      patient: "Carlos Mendoza Ruiz",
      doctor: "Dr. Michael Chen",
      specialty: "Neurología",
      date: "20 de Mayo, 2024",
      time: "11:00 AM",
      status: "COMPLETADA",
      type: "Presencial"
    },
    {
      id: "APP-7721",
      patient: "Ana Sofía Torres",
      doctor: "Dra. Emily Rossi",
      specialty: "Pediatría",
      date: "22 de Mayo, 2024",
      time: "03:30 PM",
      status: "CANCELADA",
      type: "Presencial"
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMADA': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'PENDIENTE': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
      case 'COMPLETADA': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'CANCELADA': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-petroleo dark:text-white mb-2 uppercase tracking-widest">
            Administración Clínica
          </p>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Gestión de Citas Médicas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Supervisa, programa y gestiona todas las consultas médicas del sistema.
          </p>
        </div>
        <Button variant="celeste" className="rounded-xl px-6 py-6 font-bold shadow-sm transition-all flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Programar Nueva Cita
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Citas Hoy", value: "48", icon: CalendarDays, color: "text-celeste", bg: "bg-blue-50" },
          { title: "Pendientes", value: "12", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { title: "Confirmadas", value: "32", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
          { title: "Canceladas", value: "4", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-zinc-800 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-2xl font-bold text-petroleo dark:text-white leading-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Table */}
        <div className="lg:col-span-12">
          <Tabs defaultValue="all" className="w-full space-y-6">
            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <TabsList className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 h-auto">
                  <TabsTrigger 
                    value="all" 
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Todas las Citas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="today" 
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Hoy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Pendientes
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                    <Input 
                      type="text" 
                      placeholder="Buscar por paciente o médico..." 
                      className="pl-10 h-auto py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus-visible:ring-celeste w-64 lg:w-80 font-medium"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl flex items-center gap-2 font-bold text-xs border-zinc-200">
                    <Filter className="w-4 h-4" />
                    Filtros Avanzados
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <TabsContent value="all" className="mt-0 border-none p-0 outline-none">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">ID / Tipo</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Paciente</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Médico Especialista</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Fecha y Hora</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Estado</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {appointments.map((app, i) => (
                          <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-petroleo dark:text-white">{app.id}</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{app.type}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blanco-azulado flex items-center justify-center text-celeste border border-zinc-100 dark:border-zinc-700">
                                  <User className="w-4 h-4" />
                                </div>
                                <p className="font-bold text-petroleo dark:text-white text-sm">{app.patient}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-petroleo dark:text-white">{app.doctor}</p>
                                <p className="text-[11px] font-bold text-verde-salud uppercase tracking-wide">{app.specialty}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-petroleo dark:text-white">{app.date}</p>
                                <p className="text-xs text-zinc-500 font-medium">{app.time}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${getStatusStyle(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-petroleo rounded-xl">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </CardContent>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm font-bold text-zinc-400">
                  Mostrando <span className="text-petroleo dark:text-white">1 a 4</span> de 1,248 citas registradas
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  {[1, 2, 3].map((page) => (
                    <Button 
                      key={page}
                      variant={page === 1 ? "celeste" : "ghost"}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all p-0`}
                    >
                      {page}
                    </Button>
                  ))}
                  <span className="px-2 text-zinc-400 font-bold">...</span>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-petroleo rounded-xl">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
