"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChangePatientStatus } from "@/modules/domain/user/patient/hooks/useChangePatientStatus";

/**
 * Componente de diálogo para cambiar el estado de un paciente (activar/desactivar).
 * Muestra una confirmación antes de realizar el cambio de estado. 
 * Al confirmar, se llama a la mutación para actualizar el estado del paciente en el backend. 
 * El diálogo se cierra automáticamente al completar la acción.
 */
interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPatient: {
    id: string;
    status: string;
  } | null;
}

export function ChangeStatusDialog({
  open,
  onOpenChange,
  selectedPatient,
}: ChangeStatusDialogProps) {
  const { mutate, isPending } = useChangePatientStatus();

  const handleChangeStatus = () => {
    if (!selectedPatient) return;

    const newStatus =
      selectedPatient.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    mutate(
      { patientId: selectedPatient.id, status: newStatus },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!selectedPatient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl bg-white dark:bg-zinc-950 p-8 border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <DialogTitle className="text-xl font-black text-petroleo dark:text-white">
              {selectedPatient.status === "ACTIVE"
                ? "Desactivar Paciente"
                : "Activar Paciente"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-600 dark:text-zinc-400 font-medium mt-4">
            {selectedPatient.status === "ACTIVE"
              ? "¿Estás seguro de que deseas desactivar este paciente? Los registros se mantendrán pero no podrá agendar nuevas citas."
              : "¿Estás seguro de que deseas reactivar este paciente? Podrá volver a agendar citas médicas."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-6 border-t border-zinc-100 dark:border-zinc-900">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-xl font-bold h-11 px-6 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isPending}
            className={`rounded-xl font-bold h-11 px-8 cursor-pointer text-white flex items-center gap-2 ${
              selectedPatient.status === "ACTIVE"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-verde-salud hover:bg-verde-salud/90"
            } disabled:opacity-50`}
            onClick={handleChangeStatus}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {selectedPatient.status === "ACTIVE" ? "Desactivar" : "Activar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}