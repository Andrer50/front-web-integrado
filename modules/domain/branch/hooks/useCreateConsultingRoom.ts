import { createConsultingRoomAction } from "@/core/branch/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateConsultingRoomProps {
  onSuccess?: () => void;
}

export const useCreateConsultingRoom = ({
  onSuccess,
}: UseCreateConsultingRoomProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConsultingRoomAction,
    onSuccess: () => {
      toast.success("Consultorio registrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["consultingRooms"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Conflicto al guardar el consultorio. ¿Ya existe en esta sede?",
      );
    },
  });
};
