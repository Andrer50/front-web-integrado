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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CreateSpecialtyDialog } from "@/presentation/dashboard/admin/specialties/create-specialty-dialog";
import { EditSpecialtyDialog } from "@/presentation/dashboard/admin/specialties/edit-specialty-dialog";
import { useSpecialties } from "@/modules/domain/specialty/hooks/useSpecialties";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useSpecialties({
    query: searchTerm,
    page: page,
    size: 12,
  });
  const specialtiesData = response?.data?.content || [];
  const totalPages = response?.data?.totalPages || 0;

  // Estilo estandarizado para todas las especialidades
  const commonStyles = {
    icon: <Stethoscope className="w-5 h-5 text-celeste" />,
    color: "from-zinc-50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-800",
    textColor: "text-petroleo dark:text-celeste",
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="pl-9 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-celeste/10 transition-all font-medium"
            />
          </div>

          <CreateSpecialtyDialog />
        </div>
      </div>

      {/* Stats Cards ... (Keep existing stats or update later) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* ... stats content ... */}
        <Card className="rounded-2xl border-none shadow-none bg-gradient-to-br from-petroleo to-[#2c3e50] text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                Áreas
              </p>
              <h3 className="text-lg font-black leading-none">
                {response?.data?.totalElements || 0}
              </h3>
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
              <h3 className="text-lg font-black leading-none">0</h3>
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
                0%
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
                0
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {(isLoading || isFetching) && !response ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <Loader2 className="w-10 h-10 animate-spin text-celeste" />
          <p className="text-sm font-medium animate-pulse">
            Cargando especialidades...
          </p>
        </div>
      ) : specialtiesData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-500 shadow-sm">
          <div className="w-20 h-20 bg-celeste/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-celeste/[0.02]">
            <Stethoscope className="w-10 h-10 text-celeste/40" />
          </div>
          <h3 className="text-xl font-black text-petroleo dark:text-white mb-2 tracking-tight">
            {searchTerm
              ? "No se encontraron resultados"
              : "No hay especialidades"}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8 max-w-[240px] text-center leading-relaxed">
            {searchTerm
              ? `No pudimos encontrar nada para "${searchTerm}". Intenta con otro término.`
              : "Comienza registrando una nueva área médica para gestionar tus servicios."}
          </p>
          {!searchTerm && <CreateSpecialtyDialog />}
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
            {specialtiesData.map((spec) => (
              <Card
                key={spec.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${commonStyles.color} flex items-center justify-center`}
                    >
                      {commonStyles.icon}
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
                        0
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${spec.status === "ACTIVE" ? "bg-verde-salud" : "bg-rose-500"}`}
                      />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                        {spec.status === "ACTIVE" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  <EditSpecialtyDialog 
                    specialty={spec}
                    trigger={
                      <Button
                        variant="ghost"
                        className={`w-full mt-4 h-9 rounded-xl font-bold text-[10px] uppercase tracking-widest ${commonStyles.textColor} bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all border border-zinc-100 dark:border-zinc-800`}
                      >
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(page - 1)}
                      className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer select-none"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={page === i}
                        onClick={() => handlePageChange(i)}
                        className="cursor-pointer select-none"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(page + 1)}
                      className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer select-none"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
