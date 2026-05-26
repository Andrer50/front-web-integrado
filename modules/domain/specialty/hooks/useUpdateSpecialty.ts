import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSpecialtyAction } from "@/core/specialty/actions";
import { SpecialtyRequest } from "@/core/specialty/interfaces";
import { toast } from "sonner";

interface UseUpdateSpecialtyProps {
  onSuccess?: () => void;
}

export const useUpdateSpecialty = ({
  onSuccess,
}: UseUpdateSpecialtyProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: SpecialtyRequest }) =>
      updateSpecialtyAction(id, request),
    onSuccess: () => {
      toast.success("Especialidad actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar la especialidad");
    },
  });
};
