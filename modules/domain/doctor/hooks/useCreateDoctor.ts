import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoctorAction } from "@/core/doctor/actions";
import { DoctorRequest } from "@/core/doctor/interfaces";
import { toast } from "sonner";

interface UseCreateDoctorProps {
  onSuccess?: () => void;
}

export const useCreateDoctor = ({ onSuccess }: UseCreateDoctorProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DoctorRequest) => createDoctorAction(request),
    onSuccess: () => {
      toast.success("Médico registrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar el médico");
    },
  });
};
