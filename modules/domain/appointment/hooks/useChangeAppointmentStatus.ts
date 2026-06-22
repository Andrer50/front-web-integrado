// useChangeAppointmentStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changeAppointmentStatusAction } from "@/core/appointment/actions";

export const useChangeAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) =>
      changeAppointmentStatusAction(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al cambiar el estado.");
    },
  });
};