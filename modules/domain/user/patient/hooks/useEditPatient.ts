import { getPatientByIdAction, updatePatientAction } from "@/core/user/patient/actions";
import { PatientRegisterRequest } from "@/core/user/patient/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditPatient = (patientId: string, open: boolean) => {
  const queryClient = useQueryClient();

  // Obtiene los datos del paciente solo cuando el modal está abierto y hay un ID válido
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientByIdAction(patientId),
    enabled: !!patientId && open, // no fetchea si el modal está cerrado
  });

  // Mutación para actualizar el paciente y refrescar la lista al completar
  const { mutate, isPending } = useMutation({
    mutationFn: (values: Partial<PatientRegisterRequest>) =>
      updatePatientAction(patientId, values),
    onSuccess: () => {
      toast.success("Paciente actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["patients"] }); // refresca la tabla
    },
    onError: (error) => {
      toast.error(error.message || "Error de conexión con el servidor");
    },
  });

  return { patient: data?.data, isFetching, mutate, isPending };
};