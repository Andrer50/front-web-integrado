import { changePatientStatusAction } from "@/core/user/patient/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChangePatientStatus = () => {
  const queryClient = useQueryClient();

  // Mutación para cambiar el estado del paciente (ACTIVE/INACTIVE)
  return useMutation({
    mutationFn: ({ 
      patientId, 
      status 
    }: { 
      patientId: string; 
      status: "ACTIVE" | "INACTIVE" 
    }) => changePatientStatusAction(patientId, status),
    
    onSuccess: () => {
      toast.success("Estado del paciente actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["patients"] }); // refresca la tabla
    },
    
    onError: (error) => {
      toast.error(error.message || "Error al cambiar el estado del paciente");
    },
  });
};