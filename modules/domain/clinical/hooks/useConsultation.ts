import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConsultationByAppointmentIdAction,
  getConsultationsAction,
  createConsultationAction,
  completeConsultationAction,
} from "@/core/clinical/actions";
import {
  ConsultationRequest,
  ConsultationResponse,
  CompleteConsultationRequest,
} from "@/core/clinical/interfaces";
import { type ApiResponse } from "@/core/shared";
import { toast } from "sonner";

export const useConsultations = (doctorId: string, status?: string) => {
  return useQuery({
    queryKey: ["consultations", doctorId, status],
    queryFn: () => getConsultationsAction(doctorId, status),
    enabled: !!doctorId,
  });
};

export const useConsultationByAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: ["consultation", appointmentId],
    queryFn: () => getConsultationByAppointmentIdAction(appointmentId),
    retry: false, // Don't retry since 404/500 indicates it doesn't exist yet
    refetchOnWindowFocus: false,
    enabled: !!appointmentId,
  });
};

interface UseCreateConsultationProps {
  onSuccess?: (data: ApiResponse<ConsultationResponse>) => void;
  onError?: (error: any) => void;
}

export const useCreateConsultation = ({
  onSuccess,
  onError,
}: UseCreateConsultationProps = {}) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ConsultationResponse>,
    Error,
    ConsultationRequest
  >({
    mutationFn: createConsultationAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["consultation", data.data.appointmentId],
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error?.message || "Error al iniciar la consulta médica");
      onError?.(error);
    },
  });
};

interface UseCompleteConsultationProps {
  onSuccess?: (data: ApiResponse<ConsultationResponse>) => void;
  onError?: (error: any) => void;
}

export const useCompleteConsultation = (
  consultationId: string,
  { onSuccess, onError }: UseCompleteConsultationProps = {},
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ConsultationResponse>,
    Error,
    CompleteConsultationRequest
  >({
    mutationFn: (request) =>
      completeConsultationAction(consultationId, request),
    onSuccess: (data) => {
      toast.success("Consulta médica finalizada con éxito");
      queryClient.invalidateQueries({
        queryKey: ["consultation", data.data.appointmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error?.message || "Error al finalizar la consulta médica");
      onError?.(error);
    },
  });
};
