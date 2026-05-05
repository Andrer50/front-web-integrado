import { createPatientAction } from "@/core/user/patient/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreatePatient = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatientAction,
    onSuccess: (response) => {
      if (response.code === "000") {
        toast.success("Paciente registrado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        router.push("/dashboard/admin/patients");
      } else {
        toast.error(response.message || "Error al registrar paciente");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error de conexión con el servidor");
    },
  });
};
