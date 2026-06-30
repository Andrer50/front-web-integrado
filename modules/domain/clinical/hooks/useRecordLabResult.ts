import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recordLabResultAction } from "@/core/clinical/actions";
import {
  LabResultRequest,
  LabResultResponse,
} from "@/core/clinical/interfaces";
import { type ApiResponse } from "@/core/shared";
import { toast } from "sonner";

interface RecordLabResultVariables {
  labOrderId: string;
  request: LabResultRequest;
}

interface UseRecordLabResultProps {
  onSuccess?: (
    data: ApiResponse<LabResultResponse>,
    labOrderId: string,
  ) => void;
  onError?: (error: Error) => void;
}

export const useRecordLabResult = (
  appointmentId: string,
  { onSuccess, onError }: UseRecordLabResultProps = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<LabResultResponse>,
    Error,
    RecordLabResultVariables
  >({
    mutationFn: ({ labOrderId, request }) =>
      recordLabResultAction(labOrderId, request),
    onSuccess: (data, variables) => {
      toast.success("Resultado registrado con éxito");
      queryClient.invalidateQueries({
        queryKey: ["consultation", appointmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      onSuccess?.(data, variables.labOrderId);
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar el resultado");
      onError?.(error);
    },
  });
};
