import { generateScheduleSlotsAction } from "@/core/appointment/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseGenerateSlotsProps {
  onSuccess?: () => void;
}

export const useGenerateSlots = ({ onSuccess }: UseGenerateSlotsProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateScheduleSlotsAction,
    onSuccess: () => {
      toast.success("Horarios generados exitosamente para el médico");
      queryClient.invalidateQueries({ queryKey: ["availableDoctorSlots"] });
      queryClient.invalidateQueries({ queryKey: ["doctorSlots"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Error al generar los horarios. Verifica conflictos de horarios o consultorios.",
      );
    },
  });
};
