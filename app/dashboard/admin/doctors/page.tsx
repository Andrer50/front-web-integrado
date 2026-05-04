"use client";

import { 
  Plus, 
  Filter, 
  MoreVertical, 
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Search
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDoctorsPage() {
  const doctors = [
    {
      id: "DOC-4829",
      name: "Dra. Sarah Jenkins",
      specialty: "Cardiología",
      email: "s.jenkins@mediconn...",
      phone: "+1 (555) 123-4567",
      status: "ACTIVO",
      image: "https://images.unsplash.com/photo-1559839734-2b71f1e9cbee?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "DOC-3910",
      name: "Dr. Michael Chen",
      specialty: "Neurología",
      email: "m.chen@mediconne...",
      phone: "+1 (555) 987-6543",
      status: "ACTIVO",
      initials: "MC"
    },
    {
      id: "DOC-7742",
      name: "Dra. Emily Rossi",
      specialty: "Pediatría",
      email: "e.rossi@mediconnec...",
      phone: "+1 (555) 345-6789",
      status: "DE LICENCIA",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "DOC-1102",
      name: "Dr. James Wilson",
      specialty: "Oncología",
      email: "j.wilson@mediconne...",
      phone: "+1 (555) 222-3333",
      status: "ACTIVO",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-petroleo dark:text-white mb-2 uppercase tracking-widest">
            Gestión de Médicos
          </p>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Directorio del Personal Médico
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Administra los perfiles de los médicos, sus especialidades y asignaciones clínicas.
          </p>
        </div>
        <Button variant="celeste" className="rounded-xl px-6 py-6 font-bold shadow-sm transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Nuevo Médico
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Stats */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-blanco-azulado rounded-3xl border-blue-50 relative overflow-hidden border-none shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-bold text-celeste uppercase tracking-widest">Total Médicos Activos</p>
              <div className="flex items-end gap-3 mt-2">
                <h3 className="text-4xl font-bold text-petroleo leading-none">124</h3>
                <div className="bg-verde-salud/20 text-verde-salud px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  +3 este mes
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-lg font-bold text-petroleo dark:text-white">Distribución por Especialidad</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {[
                  { label: "Cardiología", value: 35, color: "bg-celeste" },
                  { label: "Neurología", value: 25, color: "bg-verde-salud" },
                  { label: "Pediatría", value: 20, color: "bg-tiffany" },
                ].map((spec) => (
                  <div key={spec.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold">{spec.label}</span>
                      <span className="text-petroleo dark:text-white font-bold">{spec.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${spec.color} rounded-full`} 
                        style={{ width: `${spec.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Table */}
        <div className="lg:col-span-9">
          <Tabs defaultValue="all" className="w-full space-y-6">
            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <TabsList className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 h-auto">
                  <TabsTrigger 
                    value="all" 
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Todos los Médicos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="available" 
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Disponibles
                  </TabsTrigger>
                  <TabsTrigger 
                    value="onleave" 
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    De Licencia
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                    <Input 
                      type="text" 
                      placeholder="Buscar médico..." 
                      className="pl-10 h-auto py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus-visible:ring-celeste w-48 lg:w-64 font-medium"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-petroleo transition-colors rounded-xl">
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <TabsContent value="all" className="mt-0 border-none p-0 outline-none">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Nombre del Médico</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Especialidad</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Información de Contacto</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Estado</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {doctors.map((doc, i) => (
                          <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700">
                                  {doc.image ? (
                                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-sm font-bold text-celeste">{doc.initials}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-petroleo dark:text-white">{doc.name}</p>
                                  <p className="text-[11px] font-bold text-zinc-400 mt-0.5 tracking-wide uppercase">ID: {doc.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-bold bg-blanco-azulado text-celeste">
                                {doc.specialty}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{doc.email}</p>
                                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{doc.phone}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${
                                doc.status === 'ACTIVO' 
                                  ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb] dark:bg-zinc-800 dark:text-zinc-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'ACTIVO' ? 'bg-[#059669]' : 'bg-[#4b5563]'}`}></span>
                                {doc.status}
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
                  Mostrando <span className="text-petroleo dark:text-white">1 a 4</span> de 124 registros
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
