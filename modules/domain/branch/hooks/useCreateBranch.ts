import { createBranchAction } from "@/core/branch/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateBranchProps {
  onSuccess?: () => void;
}

export const useCreateBranch = ({ onSuccess }: UseCreateBranchProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranchAction,
    onSuccess: () => {
      toast.success("Sede registrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error de conexión con el servidor");
    },
  });
};
