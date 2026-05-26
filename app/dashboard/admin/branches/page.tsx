"use client";

import { useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Building,
  Activity,
  Pencil,
  Loader2,
  ChevronRight,
  DoorOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { BranchResponse } from "@/core/branch/interfaces";
import { useBranches } from "@/modules/domain/branch/hooks/useBranches";
import { useConsultingRooms } from "@/modules/domain/branch/hooks/useConsultingRooms";
import { useCreateBranch } from "@/modules/domain/branch/hooks/useCreateBranch";
import { useUpdateBranch } from "@/modules/domain/branch/hooks/useUpdateBranch";
import { useCreateConsultingRoom } from "@/modules/domain/branch/hooks/useCreateConsultingRoom";

export default function BranchesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);

  // Estados de Formulario de Sede
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(
    null,
  );

  // Estados de Formulario de Consultorios
  const [newRoomNumber, setNewRoomNumber] = useState("");

  // Queries (Hooks)
  const { data: branchRes, isLoading: isLoadingBranches } = useBranches();
  const { data: roomRes, isLoading: isLoadingRooms } = useConsultingRooms();

  const branches = branchRes?.data || [];
  const rooms = roomRes?.data || [];
  const isLoading = isLoadingBranches || isLoadingRooms;

  // Mutations (Hooks)
  const createBranchMutation = useCreateBranch({
    onSuccess: () => {
      setBranchName("");
      setBranchAddress("");
      setIsCreateOpen(false);
    },
  });

  const updateBranchMutation = useUpdateBranch({
    onSuccess: () => {
      setIsEditOpen(false);
    },
  });

  const createRoomMutation = useCreateRoomHook();

  function useCreateRoomHook() {
    return useCreateConsultingRoom({
      onSuccess: () => {
        setNewRoomNumber("");
      },
    });
  }

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !branchAddress.trim()) {
      toast.warning("Por favor completa todos los campos requeridos");
      return;
    }

    createBranchMutation.mutate({
      name: branchName,
      address: branchAddress,
    });
  };

  const handleEditBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch || !branchName.trim() || !branchAddress.trim()) {
      toast.warning("Completa todos los campos requeridos");
      return;
    }

    updateBranchMutation.mutate({
      id: selectedBranch.id,
      request: {
        name: branchName,
        address: branchAddress,
      },
    });
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch || !newRoomNumber.trim()) {
      toast.warning("Ingresa un número o código de consultorio válido");
      return;
    }

    createRoomMutation.mutate({
      branchId: selectedBranch.id,
      roomNumber: newRoomNumber,
    });
  };

  // Filtrar sedes localmente por el campo de búsqueda
  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoomsForBranch = (branchId: string) => {
    return rooms.filter((r) => r.branchId === branchId);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Compacto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-petroleo dark:text-white tracking-tight leading-none">
            Nuestras <span className="text-celeste">Sedes</span> y Consultorios
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm font-medium">
            Registra locales físicos y asigna los consultorios médicos para
            citas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Buscar sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={
              <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-celeste transition-colors" />
            }
            className="w-full sm:w-64 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm transition-all font-medium"
          />

          {/* Modal Crear Sede */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setBranchName("");
                  setBranchAddress("");
                }}
                className="h-10 px-4 bg-celeste text-white hover:bg-celeste-oscuro rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-celeste/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Registrar Sede
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 border-none bg-white dark:bg-zinc-950">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-petroleo dark:text-white">
                  Registrar Nueva <span className="text-celeste">Sede</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBranch} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                    Nombre de la Sede *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Ej. Sede Los Olivos"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 font-medium text-sm focus-ring-celeste/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                    Dirección Física *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Ej. Av. Alfredo Mendiola 6301"
                    value={branchAddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                    className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 font-medium text-sm focus-ring-celeste/20"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      className="h-11 rounded-xl font-bold text-sm"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={createBranchMutation.isPending}
                    className="h-11 px-6 bg-celeste hover:bg-celeste/95 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                  >
                    {createBranchMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Guardar Sede"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-none shadow-none bg-gradient-to-br from-petroleo to-[#2c3e50] text-white p-5 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Building className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                Total Sedes
              </p>
              <h3 className="text-2xl font-black leading-none mt-1">
                {branches.length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-none shadow-none bg-celeste p-5 text-white relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <DoorOpen className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <DoorOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                Consultorios Físicos
              </p>
              <h3 className="text-2xl font-black leading-none mt-1">
                {rooms.length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-none shadow-none bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Activity className="w-40 h-40 text-celeste" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-verde-salud/10 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-verde-salud" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Sedes Activas
              </p>
              <h3 className="text-2xl font-black leading-none mt-1 text-petroleo dark:text-white">
                {branches.filter((b) => b.status === "ACTIVE").length}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Listing View */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <Loader2 className="w-10 h-10 animate-spin text-celeste" />
          <p className="text-sm font-medium animate-pulse">
            Sincronizando centros clínicos...
          </p>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-500 shadow-sm">
          <div className="w-20 h-20 bg-celeste/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-celeste/[0.02]">
            <MapPin className="w-10 h-10 text-celeste/40" />
          </div>
          <h3 className="text-xl font-black text-petroleo dark:text-white mb-2 tracking-tight">
            {searchTerm ? "Sedes no encontradas" : "No hay sedes registradas"}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8 max-w-[260px] text-center leading-relaxed">
            {searchTerm
              ? `No pudimos hallar ninguna sede que coincida con "${searchTerm}".`
              : "Comienza registrando la sede clínica principal para habilitar consultorios médicos."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-11 px-6 bg-celeste text-white rounded-xl font-bold text-sm"
            >
              Registrar Primera Sede
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => {
            const branchRooms = getRoomsForBranch(branch.id);
            return (
              <Card
                key={branch.id}
                className="group overflow-hidden rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-celeste/5 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-zinc-900"
              >
                <CardContent className="p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-celeste/10 to-celeste/5 flex items-center justify-center text-celeste shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-800">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          branch.status === "ACTIVE"
                            ? "bg-verde-salud"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="text-[10px] font-black text-petroleo dark:text-white uppercase tracking-wider">
                        {branch.status === "ACTIVE" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-petroleo dark:text-white tracking-tight leading-snug group-hover:text-celeste transition-colors">
                      {branch.name}
                    </h3>
                    <div className="flex items-start gap-2 text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 shrink-0 text-zinc-400 mt-0.5" />
                      <p className="text-xs font-medium leading-relaxed min-h-[32px] line-clamp-2">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  {/* Consulting Room counter */}
                  <div className="mt-5 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <DoorOpen className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                          Consultorios
                        </p>
                        <p className="text-xs font-extrabold text-petroleo dark:text-white leading-none mt-0.5">
                          {branchRooms.length} asignados
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Botón Editar */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBranch(branch);
                          setBranchName(branch.name);
                          setBranchAddress(branch.address);
                          setIsEditOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-celeste hover:bg-celeste/10 rounded-lg transition-colors"
                        title="Editar Sede"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      {/* Botón Administrar Consultorios */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBranch(branch);
                          setNewRoomNumber("");
                          setIsRoomsOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Gestionar Consultorios"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <Button
                    onClick={() => {
                      setSelectedBranch(branch);
                      setNewRoomNumber("");
                      setIsRoomsOpen(true);
                    }}
                    className="w-full mt-5 h-10 rounded-xl bg-zinc-50 hover:bg-celeste hover:text-white dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-petroleo/80 dark:text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-300"
                  >
                    Ver Consultorios
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog Editar Sede */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 border-none bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-petroleo dark:text-white">
              Modificar <span className="text-celeste">Sede</span>
            </DialogTitle>
          </DialogHeader>
          {selectedBranch && (
            <form onSubmit={handleEditBranch} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                  Nombre de la Sede *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Ej. Sede Los Olivos"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 font-medium text-sm focus-ring-celeste/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-petroleo dark:text-zinc-300 uppercase tracking-wider">
                  Dirección Física *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Ej. Av. Alfredo Mendiola 6301"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 font-medium text-sm focus-ring-celeste/20"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="h-11 rounded-xl font-bold text-sm"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={updateBranchMutation.isPending}
                  className="h-11 px-6 bg-celeste hover:bg-celeste/95 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  {updateBranchMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Administrar Consultorios */}
      <Dialog open={isRoomsOpen} onOpenChange={setIsRoomsOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 border-none bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-petroleo dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-celeste" />
              <span>
                Consultorios -{" "}
                <span className="text-celeste">{selectedBranch?.name}</span>
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedBranch && (
            <div className="space-y-6 mt-4">
              {/* Formulario Agregar Consultorio */}
              <form
                onSubmit={handleAddRoom}
                className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3"
              >
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                  Asignar Nuevo Consultorio Físico
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    required
                    placeholder="Ej. Consultorio 104, C-201"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="h-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-sm font-medium focus-ring-celeste/20"
                  />
                  <Button
                    type="submit"
                    disabled={createRoomMutation.isPending}
                    className="h-10 px-4 bg-celeste hover:bg-celeste/95 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shrink-0"
                  >
                    {createRoomMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Agregar
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Listado de Consultorios Actuales */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-petroleo dark:text-zinc-400 tracking-wider">
                  Consultorios Registrados (
                  {getRoomsForBranch(selectedBranch.id).length})
                </p>

                {getRoomsForBranch(selectedBranch.id).length === 0 ? (
                  <div className="py-8 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400">
                    <DoorOpen className="w-8 h-8 text-zinc-300 mb-2" />
                    <p className="text-xs font-bold text-center">
                      No hay consultorios asignados
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Usa el formulario de arriba para agregar uno.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                    {getRoomsForBranch(selectedBranch.id).map((room) => (
                      <div
                        key={room.id}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center gap-2.5 shadow-sm group hover:border-celeste/20 transition-all"
                      >
                        <div className="w-7 h-7 rounded-lg bg-celeste/10 text-celeste flex items-center justify-center shrink-0">
                          <DoorOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-black text-petroleo dark:text-white leading-tight">
                            {room.roomNumber}
                          </p>
                          <span className="text-[9px] font-black uppercase text-verde-salud tracking-tight">
                            Activo
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <DialogClose asChild>
                  <Button className="h-11 px-6 bg-petroleo hover:bg-petroleo/90 text-white rounded-xl font-bold text-sm">
                    Cerrar Panel
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
