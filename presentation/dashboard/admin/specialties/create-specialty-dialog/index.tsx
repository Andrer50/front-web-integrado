"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CreateSpecialtyDialogProps {
  onAdd: (specialty: { name: string; description: string; status: string }) => void;
}

export function CreateSpecialtyDialog({ onAdd }: CreateSpecialtyDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVO"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: "", description: "", status: "ACTIVO" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-petroleo hover:bg-petroleo/90 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all text-xs">
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">Añadir</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none bg-white dark:bg-zinc-900 p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight">
            Nueva Especialidad
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Nombre de la Especialidad
            </label>
            <Input 
              required
              placeholder="Ej. Cardiología"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Descripción
            </label>
            <textarea 
              required
              placeholder="Describe las funciones de esta área..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full min-h-[120px] p-4 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-celeste/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Estado Inicial
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, status: "ACTIVO"})}
                className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                  formData.status === "ACTIVO" 
                  ? "bg-verde-salud/10 border-verde-salud text-verde-salud" 
                  : "border-zinc-100 text-zinc-400"
                }`}
              >
                Activo
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, status: "INACTIVO"})}
                className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                  formData.status === "INACTIVO" 
                  ? "bg-rose-50 border-rose-500 text-rose-500" 
                  : "border-zinc-100 text-zinc-400"
                }`}
              >
                Inactivo
              </button>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button 
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1 h-12 rounded-xl font-bold text-zinc-400"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 h-12 bg-celeste hover:bg-celeste/90 text-white rounded-xl font-bold shadow-lg shadow-celeste/20"
            >
              Crear Área
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
