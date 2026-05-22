import { getDoctorByIdAction, updateDoctorAction } from "@/core/doctor/actions";
import { DoctorUpdateRequest } from "@/core/doctor/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateDoctor = (doctorId: string, open: boolean) => {
  const queryClient = useQueryClient();

  // Obtiene los datos del doctor solo cuando el modal está abierto y hay un ID válido
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => getDoctorByIdAction(doctorId),
    enabled: !!doctorId && open, // no fetchea si el modal está cerrado
  });

  // Mutación para actualizar el doctor y refrescar la lista al completar
  const { mutate, isPending } = useMutation({
    mutationFn: (values: DoctorUpdateRequest) =>
      updateDoctorAction(doctorId, values),
    onSuccess: () => {
      toast.success("Doctor actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["doctors"] }); // refresca la tabla
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
    },
    onError: (error) => {
      toast.error(error.message || "Error de conexión con el servidor");
    },
  });

  return { doctor: data?.data, isFetching, mutate, isPending };
};
