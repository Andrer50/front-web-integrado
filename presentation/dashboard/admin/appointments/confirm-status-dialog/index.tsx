"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ConfirmAction } from "@/presentation/dashboard/admin/appointments/appointment-table";

interface ConfirmStatusDialogProps {
  confirmAction: ConfirmAction | null;
  isChanging: boolean;
  onConfirm: (appointmentId: string, status: string) => void;
  onClose: () => void;
}

export function ConfirmStatusDialog({
  confirmAction,
  isChanging,
  onConfirm,
  onClose,
}: ConfirmStatusDialogProps) {
  return (
    <Dialog
      open={!!confirmAction}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-8 bg-white dark:bg-zinc-950 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black text-petroleo dark:text-white tracking-tight">
            <span
              className={`flex items-center justify-center w-11 h-11 rounded-full ${
                confirmAction?.newStatus === "CANCELLED"
                  ? "bg-red-50 dark:bg-red-950/30"
                  : "bg-emerald-50 dark:bg-emerald-950/30"
              }`}
            >
              {confirmAction?.newStatus === "CANCELLED" ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </span>
            {confirmAction?.label}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400 font-medium leading-relaxed">
            {confirmAction?.newStatus === "CANCELLED"
              ? "Esta acción no se puede deshacer. La cita será cancelada y se notificará al paciente."
              : confirmAction?.newStatus === "COMPLETED"
                ? "La cita se marcará como completada. Se notificará al paciente."
                : "La cita será confirmada. El paciente recibirá una notificación."}
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
            variant={
              confirmAction?.newStatus === "CANCELLED" ? "outline" : "celeste"
            }
            disabled={isChanging}
            onClick={() => {
              if (confirmAction) {
                onConfirm(confirmAction.appointmentId, confirmAction.newStatus);
                onClose();
              }
            }}
            className={
              confirmAction?.newStatus === "CANCELLED"
                ? "rounded-xl font-bold h-11 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-950/20 shadow-lg shadow-red-100/20"
                : "rounded-xl font-bold h-11 shadow-lg shadow-celeste/20"
            }
          >
            {isChanging && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Sí, {confirmAction?.label?.toLowerCase() || ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}