import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWeeklyConfigAction,
  saveWeeklyConfigAction,
} from "@/core/appointment/actions";
import { DoctorScheduleRequest } from "@/core/appointment/interfaces";
import { toast } from "sonner";

export const useWeeklySchedule = (doctorId: string) => {
  return useQuery({
    queryKey: ["weeklySchedule", doctorId],
    queryFn: () => getWeeklyConfigAction(doctorId),
    enabled: !!doctorId,
    refetchOnWindowFocus: false,
  });
};

interface UseUpdateWeeklyScheduleProps {
  onSuccess?: () => void;
}

export const useUpdateWeeklySchedule = (
  doctorId: string,
  { onSuccess }: UseUpdateWeeklyScheduleProps = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DoctorScheduleRequest[]) =>
      saveWeeklyConfigAction(doctorId, request),
    onSuccess: () => {
      toast.success("Configuración semanal de horario guardada");
      queryClient.invalidateQueries({ queryKey: ["weeklySchedule", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctorSlots", doctorId] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        error?.message || "Error al guardar la configuración semanal.",
      );
    },
  });
};
