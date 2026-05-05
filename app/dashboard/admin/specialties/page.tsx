"use client";

import {
  Plus,
  Search,
  Stethoscope,
  Users,
  MoreVertical,
  Activity,
  ChevronRight,
  TrendingUp,
  Brain,
  Baby,
  Heart,
  Droplet,
  Scan,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CreateSpecialtyDialog } from "@/presentation/dashboard/admin/specialties/create-specialty-dialog";
import { useState } from "react";

export default function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const specialties = [
    {
      id: "SPEC-001",
      name: "Cardiología",
      description: "Estudio y tratamiento de enfermedades del corazón.",
      doctorsCount: 15,
      appointmentsToday: 42,
      status: "ACTIVO",
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      color: "from-rose-50 to-rose-100/50",
      accent: "bg-rose-500",
      textColor: "text-rose-700",
    },
    {
      id: "SPEC-002",
      name: "Neurología",
      description: "Trastornos que afectan al sistema nervioso.",
      doctorsCount: 10,
      appointmentsToday: 28,
      status: "ACTIVO",
      icon: <Brain className="w-5 h-5 text-violet-500" />,
      color: "from-violet-50 to-violet-100/50",
      accent: "bg-violet-500",
      textColor: "text-violet-700",
    },
    {
      id: "SPEC-003",
      name: "Pediatría",
      description: "Atención médica especializada para niños.",
      doctorsCount: 22,
      appointmentsToday: 65,
      status: "ACTIVO",
      icon: <Baby className="w-5 h-5 text-sky-500" />,
      color: "from-sky-50 to-sky-100/50",
      accent: "bg-sky-500",
      textColor: "text-sky-700",
    },
    {
      id: "SPEC-004",
      name: "Dermatología",
      description: "Enfermedades de la piel, pelo y uñas.",
      doctorsCount: 8,
      appointmentsToday: 15,
      status: "ACTIVO",
      icon: <Droplet className="w-5 h-5 text-orange-500" />,
      color: "from-orange-50 to-orange-100/50",
      accent: "bg-orange-500",
      textColor: "text-orange-700",
    },
    {
      id: "SPEC-005",
      name: "Radiología",
      description: "Técnicas de imagen para el diagnóstico.",
      doctorsCount: 6,
      appointmentsToday: 20,
      status: "ACTIVO",
      icon: <Scan className="w-5 h-5 text-emerald-500" />,
      color: "from-emerald-50 to-emerald-100/50",
      accent: "bg-emerald-500",
      textColor: "text-emerald-700",
    },
    {
      id: "SPEC-006",
      name: "Ginecología",
      description: "Salud del sistema reproductor femenino.",
      doctorsCount: 12,
      appointmentsToday: 30,
      status: "ACTIVO",
      icon: <ShieldCheck className="w-5 h-5 text-pink-500" />,
      color: "from-pink-50 to-pink-100/50",
      accent: "bg-pink-500",
      textColor: "text-pink-700",
    },
    {
      id: "SPEC-007",
      name: "Oftalmología",
      description: "Cuidado y tratamiento de la visión.",
      doctorsCount: 5,
      appointmentsToday: 12,
      status: "ACTIVO",
      icon: <Activity className="w-5 h-5 text-amber-500" />,
      color: "from-amber-50 to-amber-100/50",
      accent: "bg-amber-500",
      textColor: "text-amber-700",
    },
    {
      id: "SPEC-008",
      name: "Psiquiatría",
      description: "Tratamiento de trastornos mentales.",
      doctorsCount: 9,
      appointmentsToday: 18,
      status: "ACTIVO",
      icon: <Activity className="w-5 h-5 text-indigo-500" />,
      color: "from-indigo-50 to-indigo-100/50",
      accent: "bg-indigo-500",
      textColor: "text-indigo-700",
    },
  ];

  const filteredSpecialties = specialties.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddSpecialty = (data: {
    name: string;
    description: string;
    status: string;
  }) => {
    console.log("Nueva especialidad:", data);
    // Aquí iría la lógica para guardar en el backend
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Compacto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-petroleo dark:text-white tracking-tight leading-none">
            Especialidades <span className="text-celeste">Médicas</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">
            Gestiona las áreas médicas y supervisa la carga operativa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-celeste/10 transition-all font-medium"
            />
          </div>

          <CreateSpecialtyDialog onAdd={handleAddSpecialty} />
        </div>
      </div>

      {/* Stats Cards - Más pequeñas y compactas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-none shadow-none bg-gradient-to-br from-petroleo to-[#2c3e50] text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                Áreas
              </p>
              <h3 className="text-lg font-black leading-none">24</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-none shadow-none bg-celeste p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                Médicos
              </p>
              <h3 className="text-lg font-black leading-none">156</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-none shadow-none bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-verde-salud/10 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-verde-salud" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Capacidad
              </p>
              <h3 className="text-lg font-black leading-none text-petroleo dark:text-white">
                85%
              </h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-none shadow-none bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Citas Hoy
              </p>
              <h3 className="text-lg font-black leading-none text-petroleo dark:text-white">
                312
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de Especialidades - 4 por fila en LG, más compactas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSpecialties.map((spec) => (
          <Card
            key={spec.id}
            className="group relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${spec.color} flex items-center justify-center`}
                >
                  {spec.icon}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-300 hover:text-petroleo rounded-lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-petroleo dark:text-white tracking-tight truncate">
                  {spec.name}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-medium leading-normal line-clamp-2 min-h-[32px]">
                  {spec.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-zinc-400" />
                  <span className="text-xs font-bold text-petroleo dark:text-white">
                    {spec.doctorsCount}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-celeste" />
                  <span className="text-xs font-bold text-petroleo dark:text-white">
                    {spec.appointmentsToday || 0}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                className={`w-full mt-4 h-9 rounded-xl font-bold text-[10px] uppercase tracking-widest ${spec.textColor} bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all border border-zinc-100 dark:border-zinc-800`}
              >
                Ver Detalles
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
