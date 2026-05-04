"use client";

import { 
  Calendar, 
  ChevronRight, 
  MapPin, 
  Clock, 
  MoreVertical,
  Plus,
  Search,
  Filter,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function PatientAppointmentsPage() {
  const upcomingAppointments = [
    {
      id: "APP-9283",
      doctor: "Dr. Ricardo Palma",
      specialty: "Cardiología",
      date: "Mañana, 15 de Mayo",
      time: "09:30 AM",
      type: "Presencial",
      location: "Sede San Isidro - Consultorio 402",
      status: "CONFIRMADA",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "APP-1102",
      doctor: "Dra. Sarah Jenkins",
      specialty: "Consulta General",
      date: "Jueves, 18 de Mayo",
      time: "04:00 PM",
      type: "Virtual",
      location: "Enlace de Zoom enviado",
      status: "PENDIENTE",
      image: "https://images.unsplash.com/photo-1559839734-2b71f1e9cbee?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  const appointmentHistory = [
    {
      id: "APP-8842",
      doctor: "Dr. Michael Chen",
      specialty: "Neurología",
      date: "10 de Abril, 2024",
      time: "11:00 AM",
      status: "COMPLETADA",
      diagnosis: "Migraña tensional. Se receta descanso y analgésicos.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "APP-7721",
      doctor: "Dra. Emily Rossi",
      specialty: "Pediatría",
      date: "25 de Marzo, 2024",
      time: "03:30 PM",
      status: "CANCELADA",
      reason: "Cancelado por el paciente",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

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
        <Button 
          variant="celeste" 
          className="rounded-2xl h-auto py-4 px-8 font-bold w-full md:w-fit"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full space-y-8">
        <TabsList className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-celeste data-[state=active]:text-celeste rounded-none px-4 py-4 text-sm font-bold text-zinc-400 transition-all"
          >
            Próximas citas
            <span className="ml-2 px-2 py-0.5 bg-blanco-azulado text-celeste rounded-full text-[10px]">
              {upcomingAppointments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-celeste data-[state=active]:text-celeste rounded-none px-4 py-4 text-sm font-bold text-zinc-400 transition-all"
          >
            Historial de citas
          </TabsTrigger>
        </TabsList>

        {/* Content for Upcoming */}
        <TabsContent value="upcoming" className="space-y-6 mt-0 border-none p-0 outline-none">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
              <Input 
                type="text" 
                placeholder="Buscar por médico o especialidad..." 
                className="pl-12 h-auto py-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl focus-visible:ring-celeste font-medium"
              />
            </div>
            <Button variant="outline" className="h-auto py-3 px-6 rounded-2xl font-bold text-petroleo flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {upcomingAppointments.map((app) => (
              <Card key={app.id} className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-6 flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex items-center gap-4 shrink-0 w-full lg:w-72">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blanco-azulado shrink-0">
                      <img src={app.image} alt={app.doctor} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-petroleo dark:text-white group-hover:text-celeste transition-colors">{app.doctor}</h3>
                      <p className="text-xs font-bold text-verde-salud">{app.specialty}</p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-bold uppercase tracking-wider">{app.id}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 flex-1 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blanco-azulado flex items-center justify-center text-celeste">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-petroleo dark:text-white">{app.date}</p>
                        <p className="text-xs text-zinc-500 font-medium">Fecha de consulta</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blanco-azulado flex items-center justify-center text-tiffany">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-petroleo dark:text-white">{app.time}</p>
                        <p className="text-xs text-zinc-500 font-medium">Hora programada</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blanco-azulado flex items-center justify-center text-verde-salud">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-petroleo dark:text-white">{app.type}</p>
                        <p className="text-xs text-zinc-500 font-medium truncate max-w-[150px]">{app.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <span className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest border ${
                      app.status === 'CONFIRMADA' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {app.status}
                    </span>
                    <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400 hover:text-petroleo">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content for History */}
        <TabsContent value="history" className="space-y-6 mt-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 gap-6">
            {appointmentHistory.map((app) => (
              <Card key={app.id} className="rounded-[3rem] border-zinc-100 dark:border-zinc-800 shadow-sm group overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blanco-azulado shrink-0">
                        <img src={app.image} alt={app.doctor} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-petroleo dark:text-white">{app.doctor}</h3>
                        <p className="text-xs font-bold text-verde-salud">{app.specialty}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 font-bold tracking-wider">{app.date} • {app.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest border ${
                        app.status === 'COMPLETADA' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {app.status}
                      </span>
                      <Button variant="ghost" size="icon" className="text-zinc-400">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Diagnóstico / Observaciones</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic font-medium">
                          {app.diagnosis || app.reason}
                        </p>
                      </div>
                    </div>
                    
                    {app.status === 'COMPLETADA' && (
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="ghost" className="bg-blanco-azulado text-celeste hover:bg-celeste hover:text-white rounded-xl font-bold">
                          Ver Receta
                        </Button>
                        <Button variant="outline" className="rounded-xl border-zinc-200 font-bold">
                          Detalles
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
