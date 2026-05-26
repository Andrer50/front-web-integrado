import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppointmentsAction,
  createAppointmentAction,
} from "@/core/appointment/actions";
import { 
  AppointmentFilters, 
  AppointmentRequest, 
  AppointmentResponse 
} from "@/core/appointment/interfaces";
import { type ApiResponse } from "@/core/shared";
import { toast } from "sonner";

export const useAppointments = (params: AppointmentFilters) => {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => getAppointmentsAction(params),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

interface UseCreateAppointmentProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateAppointment = ({
  onSuccess,
  onError,
}: UseCreateAppointmentProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<AppointmentResponse>, Error, AppointmentRequest>({
    mutationFn: createAppointmentAction,
    onSuccess: () => {
      toast.success("Cita médica agendada con éxito");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al agendar la cita");
      onError?.(error);
    },
  });
};
