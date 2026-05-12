import { updateBranchAction } from "@/core/branch/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BranchRequest } from "@/core/branch/interfaces";

interface UseUpdateBranchProps {
  onSuccess?: () => void;
}

export const useUpdateBranch = ({ onSuccess }: UseUpdateBranchProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: BranchRequest }) =>
      updateBranchAction(id, request),
    onSuccess: () => {
      toast.success("Sede modificada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar la sede");
    },
  });
};
