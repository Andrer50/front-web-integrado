"use client";

import { AlertTriangle, Loader2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CancelAppointmentDialogProps {
  appointmentToCancel: string | null;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelAppointmentDialog({
  appointmentToCancel,
  isCancelling,
  onConfirm,
  onClose,
}: CancelAppointmentDialogProps) {
  return (
    <Dialog
      open={!!appointmentToCancel}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-8 bg-white dark:bg-zinc-950 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black text-petroleo dark:text-white tracking-tight">
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/30">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </span>
            Cancelar Cita
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400 font-medium leading-relaxed">
            Esta acción no se puede deshacer. La cita será cancelada y se notificará al médico asignado.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl font-bold h-11"
          >
            Volver
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isCancelling}
            onClick={onConfirm}
            className="rounded-xl font-bold h-11 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-950/20 shadow-lg shadow-red-100/20"
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Sí, cancelar cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}