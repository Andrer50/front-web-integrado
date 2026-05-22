import { changeDoctorStatusAction } from "@/core/doctor/actions";
import { Status } from "@/core/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChangeDoctor = () => {
  const queryClient = useQueryClient();

  // Mutación para cambiar el estado del doctor (ACTIVE/INACTIVE)
  return useMutation({
    mutationFn: ({
      doctorId,
      status,
    }: {
      doctorId: string;
      status: Status;
    }) => changeDoctorStatusAction(doctorId, status),

    onSuccess: () => {
      toast.success("Estado del doctor actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["doctors"] }); // refresca la tabla
    },

    onError: (error) => {
      toast.error(error.message || "Error al cambiar el estado del doctor");
    },
  });
};
