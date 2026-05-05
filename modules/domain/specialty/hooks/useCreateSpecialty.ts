import { createSpecialtyAction } from "@/core/specialty/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateSpecialtyProps {
  onSuccess?: () => void;
}

export const useCreateSpecialty = ({
  onSuccess,
}: UseCreateSpecialtyProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpecialtyAction,
    onSuccess: () => {
      toast.success("Especialidad registrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error de conexión con el servidor");
    },
  });
};
