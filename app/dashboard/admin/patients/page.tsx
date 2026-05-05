"use client";

import { useState } from "react";
import {
  Filter,
  MoreVertical,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Search,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatients } from "@/modules/user/patient/hooks/usePatients";

export default function AdminPatientsPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { data: apiResponse, isLoading, isPlaceholderData } = usePatients({
    page,
    size,
    query,
    status: status === "all" ? undefined : status,
  });

  const pagination = apiResponse?.data;
  const patients = pagination?.content || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(0);
  };

  const handleTabChange = (value: string) => {
    setStatus(value === "all" ? undefined : value.toUpperCase());
    setPage(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-petroleo dark:text-white mb-2 uppercase tracking-widest">
            Gestión de Pacientes
          </p>
          <h1 className="text-3xl font-black text-petroleo dark:text-white tracking-tight">
            Directorio de Pacientes
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Administra los registros de pacientes, historiales médicos y datos
            de contacto.
          </p>
        </div>
        <Button
          variant="celeste"
          className="rounded-xl px-6 py-6 font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Nuevo Paciente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Stats */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-blanco-azulado rounded-3xl border-blue-50 relative overflow-hidden border-none shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-bold text-celeste uppercase tracking-widest">
                Total Pacientes Registrados
              </p>
              <div className="flex items-end gap-3 mt-2">
                <h3 className="text-4xl font-bold text-petroleo leading-none">
                  {pagination?.totalElements || 0}
                </h3>
                <div className="bg-verde-salud/20 text-verde-salud px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  +45 este mes
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-lg font-bold text-petroleo dark:text-white">
                Distribución Demográfica
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {[
                  { label: "Mujeres", value: 52, color: "bg-pink-500" },
                  { label: "Hombres", value: 45, color: "bg-celeste" },
                  { label: "Otros", value: 3, color: "bg-zinc-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold">
                        {item.label}
                      </span>
                      <span className="text-petroleo dark:text-white font-bold">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
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
          <Tabs defaultValue="all" className="w-full space-y-6" onValueChange={handleTabChange}>
            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <TabsList className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 h-auto">
                  <TabsTrigger
                    value="all"
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Activos
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactive"
                    className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-celeste data-[state=active]:text-white data-[state=active]:shadow-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Inactivos
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Buscar paciente..."
                      value={query}
                      onChange={handleSearch}
                      className="pl-10 h-auto py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus-visible:ring-celeste w-48 lg:w-64 font-medium"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-400 hover:text-petroleo transition-colors rounded-xl"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-0 relative min-h-[400px]">
                {isLoading && !isPlaceholderData && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 flex items-center justify-center z-20">
                    <Loader2 className="w-8 h-8 animate-spin text-celeste" />
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                        <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                          Paciente
                        </th>
                        <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                          Documento (DNI)
                        </th>
                        <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                          Contacto
                        </th>
                        <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">
                          Estado
                        </th>
                        <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                      {patients.length > 0 ? (
                        patients.map((pat) => (
                          <tr
                            key={pat.id}
                            className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                  <span className="text-sm font-bold text-celeste">
                                    {pat.firstName[0]}{pat.lastName[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-bold text-petroleo dark:text-white">
                                    {pat.firstName} {pat.lastName}
                                  </p>
                                  <p className="text-[11px] font-bold text-zinc-400 mt-0.5 tracking-wide uppercase">
                                    {pat.gender}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-petroleo dark:text-white">
                                  {pat.documentNumber}
                                </p>
                                <p className="text-[11px] font-bold text-zinc-400 tracking-wide uppercase">
                                  ID: {pat.id.substring(0, 8)}...
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                  {pat.email}
                                </p>
                                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                  {pat.phone}
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border ${
                                  pat.status === "ACTIVE"
                                    ? "bg-[#ecfdf5] text-[#059669] border-[#d1fae5] dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-[#fff7ed] text-[#d97706] border-[#ffedd5] dark:bg-amber-900/20 dark:text-amber-400"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${pat.status === "ACTIVE" ? "bg-[#059669]" : "bg-[#d97706]"}`}
                                ></span>
                                {pat.status === "ACTIVE" ? "ACTIVO" : "INACTIVO"}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-zinc-400 hover:text-petroleo transition-colors rounded-xl"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-zinc-500 font-medium">
                            No se encontraron pacientes registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm font-bold text-zinc-400">
                  Mostrando{" "}
                  <span className="text-petroleo dark:text-white">
                    {patients.length > 0 ? page * size + 1 : 0} a {Math.min((page + 1) * size, pagination?.totalElements || 0)}
                  </span>{" "}
                  de {pagination?.totalElements || 0} registros
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination?.totalPages || 0) }).map((_, i) => {
                    const pageNumber = i; // Simplificado para las primeras 5 páginas
                    return (
                      <Button
                        key={i}
                        variant={page === pageNumber ? "celeste" : "ghost"}
                        onClick={() => setPage(pageNumber)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all p-0`}
                      >
                        {pageNumber + 1}
                      </Button>
                    );
                  })}
                  
                  {pagination?.totalPages && pagination.totalPages > 5 && (
                    <span className="px-2 text-zinc-400 font-bold">...</span>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pagination?.last || !pagination}
                    className="text-zinc-400 hover:text-petroleo disabled:opacity-50 rounded-xl"
                  >
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
