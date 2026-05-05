"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Filter,
  MoreVertical,
  TrendingUp,
  Search,
  Stethoscope,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoctors } from "@/modules/domain/doctor/hooks/useDoctors";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminDoctorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: doctorsResponse, isLoading } = useDoctors({
    query: search,
    page,
    size,
  });

  const doctors = doctorsResponse?.data?.content || [];
  const totalPages = doctorsResponse?.data?.totalPages || 0;
  const totalElements = doctorsResponse?.data?.totalElements || 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-black text-celeste uppercase tracking-[0.2em] mb-1">
            Gestión de Médicos
          </p>
          <h1 className="text-4xl font-black text-petroleo dark:text-white tracking-tight leading-none">
            Directorio <span className="text-celeste">Médico</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium text-sm">
            Administra los perfiles de los profesionales y sus especialidades.
          </p>
        </div>
        <Button
          variant="celeste"
          onClick={() => router.push("/dashboard/admin/doctors/create")}
          className="rounded-[1.2rem] h-14 px-8 font-black shadow-lg shadow-celeste/20 hover:shadow-celeste/40 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus className="w-6 h-6" />
          Registrar Médico
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Stats */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-blanco-azulado dark:bg-zinc-900/50 rounded-[2rem] relative overflow-hidden border-none shadow-none">
            <CardContent className="p-8">
              <p className="text-[10px] font-black text-celeste uppercase tracking-widest mb-3">
                Total Activos
              </p>
              <div className="flex items-end gap-3">
                <h3 className="text-5xl font-black text-petroleo dark:text-white leading-none tracking-tighter">
                  {isLoading ? "..." : totalElements}
                </h3>
                <div className="bg-verde-salud/20 text-verde-salud px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 mb-1 shadow-sm">
                  <TrendingUp className="w-3 h-3" />
                  +3
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-zinc-100 dark:border-zinc-800 shadow-xl shadow-petroleo/5 overflow-hidden bg-white dark:bg-zinc-950">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-sm font-black text-petroleo dark:text-white uppercase tracking-widest">
                Especialidades
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {[
                  { label: "Cardiología", value: 35, color: "bg-celeste" },
                  { label: "Neurología", value: 25, color: "bg-verde-salud" },
                  { label: "Pediatría", value: 20, color: "bg-tiffany" },
                ].map((spec) => (
                  <div key={spec.label}>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold">
                        {spec.label}
                      </span>
                      <span className="text-petroleo dark:text-white font-black">
                        {spec.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${spec.color} rounded-full transition-all duration-1000`}
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
            <Card className="rounded-[2rem] border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-petroleo/5 overflow-hidden bg-white dark:bg-zinc-950">
              <div className="p-6 border-b border-zinc-50 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                <TabsList className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-1.5 h-auto">
                  <TabsTrigger
                    value="all"
                    className="px-6 py-2.5 text-xs font-black rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-celeste data-[state=active]:shadow-sm text-zinc-400 transition-all"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="px-6 py-2.5 text-xs font-black rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-verde-salud data-[state=active]:shadow-sm text-zinc-400 transition-all"
                  >
                    Activos
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Buscar por nombre o CMP..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-12 h-12 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm focus-visible:ring-2 focus-visible:ring-celeste/20 font-bold text-petroleo dark:text-white"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 text-zinc-400 hover:text-celeste hover:bg-celeste/5 transition-all rounded-2xl"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-50 dark:border-zinc-900 uppercase tracking-[0.15em]">
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-400">
                          Médico
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-400">
                          Especialidad
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-400">
                          Contacto
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-400">
                          Estado
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-400 text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50/50 dark:divide-zinc-900/50">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <Loader2 className="w-10 h-10 animate-spin text-celeste" />
                              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">
                                Cargando directorio...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : doctors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-zinc-300" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-lg font-black text-petroleo dark:text-white">
                                  No se encontraron médicos
                                </p>
                                <p className="text-sm font-medium text-zinc-400">
                                  Intenta con otros términos de búsqueda.
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => setSearch("")}
                                className="mt-2 rounded-xl font-bold border-zinc-200 dark:border-zinc-800"
                              >
                                Limpiar Búsqueda
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        doctors.map((doc) => (
                          <tr
                            key={doc.id}
                            className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all duration-300"
                          >
                            <td className="px-8 py-7">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-celeste/10 flex items-center justify-center shrink-0 border-2 border-white dark:border-zinc-800 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                  <span className="text-sm font-black text-celeste">
                                    {doc.user.firstName[0]}
                                    {doc.user.lastName[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-black text-petroleo dark:text-white text-sm group-hover:text-celeste transition-colors">
                                    {doc.user.firstName} {doc.user.lastName}
                                  </p>
                                  <p className="text-[10px] font-black text-zinc-400 mt-0.5 tracking-widest uppercase">
                                    CMP: {doc.medicalLicenseNumber}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-7">
                              <div className="flex flex-wrap gap-1.5">
                                {doc.specialties.map((spec) => (
                                  <span
                                    key={spec.id}
                                    className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black bg-blanco-azulado dark:bg-celeste/10 text-celeste uppercase tracking-tighter"
                                  >
                                    {spec.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-7">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 group-hover:text-petroleo transition-colors">
                                  <Mail className="w-3.5 h-3.5" />
                                  <p className="text-xs font-bold truncate max-w-[150px]">
                                    {doc.user.email}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                  <Phone className="w-3.5 h-3.5" />
                                  <p className="text-[11px] font-medium">
                                    {doc.user.phone || "Sin teléfono"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-7">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border transition-all ${
                                  doc.user.status === "ACTIVE"
                                    ? "bg-verde-salud/10 text-verde-salud border-verde-salud/20"
                                    : "bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${doc.user.status === "ACTIVE" ? "bg-verde-salud" : "bg-rose-500"}`}
                                ></span>
                                {doc.user.status === "ACTIVE"
                                  ? "ACTIVO"
                                  : "INACTIVO"}
                              </span>
                            </td>
                            <td className="px-8 py-7 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-zinc-400 hover:text-petroleo hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              {/* Pagination */}
              {totalElements > 0 && (
                <div className="p-8 border-t border-zinc-50 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Mostrando{" "}
                    <span className="text-petroleo dark:text-white">
                      {doctors.length}
                    </span>{" "}
                    de{" "}
                    <span className="text-petroleo dark:text-white">
                      {totalElements}
                    </span>{" "}
                    médicos
                  </p>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 0 && handlePageChange(page - 1)}
                          className={`cursor-pointer rounded-xl font-bold border-none hover:bg-zinc-50 ${page === 0 ? "opacity-50 pointer-events-none" : ""}`}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => handlePageChange(i)}
                            isActive={page === i}
                            className={`cursor-pointer rounded-xl font-bold w-10 h-10 transition-all ${
                              page === i
                                ? "bg-celeste text-white shadow-lg shadow-celeste/20 border-none"
                                : "border-none hover:bg-zinc-50 text-zinc-500"
                            }`}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            page < totalPages - 1 && handlePageChange(page + 1)
                          }
                          className={`cursor-pointer rounded-xl font-bold border-none hover:bg-zinc-50 ${page === totalPages - 1 ? "opacity-50 pointer-events-none" : ""}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
