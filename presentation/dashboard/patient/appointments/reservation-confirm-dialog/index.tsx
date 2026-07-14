"use client";

import { Loader2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AvailableDoctorSlotsResponse } from "@/core/appointment/interfaces";

interface SelectedSlot {
  slotId: string;
  doctorId: string;
  dateStr: string;
  timeStr: string;
}

interface ReservationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: SelectedSlot | null;
  activeBookingDoctor: AvailableDoctorSlotsResponse | null | undefined;
  reason: string;
  onReasonChange: (value: string) => void;
  errorMsg: string;
  onClearError: () => void;
  isPending: boolean;
  onConfirm: () => void;
}

export function ReservationConfirmDialog({
  open,
  onOpenChange,
  selectedSlot,
  activeBookingDoctor,
  reason,
  onReasonChange,
  errorMsg,
  onClearError,
  isPending,
  onConfirm,
}: ReservationConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-black text-petroleo dark:text-white tracking-tight">
            Confirmar reserva
          </DialogTitle>
          <DialogDescription className="text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
            Completa los detalles de tu cita a continuación. Al confirmar se
            registrará en el sistema.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        {selectedSlot && activeBookingDoctor && (
          <div className="space-y-6 pt-4">
            <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 space-y-4">
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-celeste shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    Especialista
                  </p>
                  <p className="text-sm font-extrabold text-petroleo dark:text-zinc-200">
                    {activeBookingDoctor.doctorName}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {activeBookingDoctor.specialty}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <div>
                  <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    Sede
                  </p>
                  <p className="text-xs font-bold text-petroleo dark:text-zinc-200">
                    {activeBookingDoctor.branchName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    Fecha y Hora
                  </p>
                  <p className="text-xs font-bold text-petroleo dark:text-zinc-200">
                    {selectedSlot.dateStr} a las {selectedSlot.timeStr}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="reason"
                className="font-bold text-petroleo dark:text-zinc-300"
              >
                Motivo de la consulta{" "}
                <span className="text-red-400 font-medium">*</span>
              </Label>
              <textarea
                id="reason"
                placeholder="Ej: Control de rutina, dolor persistente, etc."
                value={reason}
                onChange={(e) => {
                  onReasonChange(e.target.value);
                  if (errorMsg) onClearError();
                }}
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-celeste h-24 text-sm p-4 outline-none focus:ring-2 focus:ring-celeste"
              />
            </div>
          </div>
        )}

        <DialogFooter className="pt-6 gap-3 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold text-zinc-500 h-12 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            variant="celeste"
            className="rounded-xl font-black h-12 cursor-pointer shadow-md flex items-center justify-center gap-2 min-w-[150px]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            {isPending ? "Agendando..." : "Confirmar Reserva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}