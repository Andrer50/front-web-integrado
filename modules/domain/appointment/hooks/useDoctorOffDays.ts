import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOffDaysAction,
  saveOffDayAction,
  deleteOffDayAction,
} from "@/core/appointment/actions";
import {
  DoctorOffDayRequest,
  DoctorOffDaySaveResponse,
} from "@/core/appointment/interfaces";
import { toast } from "sonner";

export const useDoctorOffDays = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctorOffDays", doctorId],
    queryFn: () => getOffDaysAction(doctorId),
    enabled: !!doctorId,
    refetchOnWindowFocus: false,
  });
};

interface UseCreateOffDayProps {
  onSuccess?: (data: DoctorOffDaySaveResponse) => void;
}

export const useCreateOffDay = (
  doctorId: string,
  { onSuccess }: UseCreateOffDayProps = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DoctorOffDayRequest) =>
      saveOffDayAction(doctorId, request),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["doctorOffDays", doctorId] });
      await queryClient.invalidateQueries({ queryKey: ["doctorSlots"] });
      await queryClient.refetchQueries({ queryKey: ["doctorSlots"] });
      await queryClient.invalidateQueries({ queryKey: ["availableDoctorSlots"] });

      const conflictsCount = response?.data?.conflicts?.length || 0;
      if (conflictsCount > 0) {
        toast.warning(
          `Día libre registrado, pero hay ${conflictsCount} citas programadas para ese día que requieren ser reprogramadas.`,
          { duration: 6000 },
        );
      } else {
        toast.success("Día libre registrado exitosamente.");
      }
      onSuccess?.(response.data);
    },
    onError: (error) => {
      toast.error(error?.message || "Error al registrar el día libre.");
    },
  });
};

interface UseDeleteOffDayProps {
  onSuccess?: () => void;
}

export const useDeleteOffDay = (
  doctorId: string,
  { onSuccess }: UseDeleteOffDayProps = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offDayId: string) => deleteOffDayAction(offDayId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctorOffDays", doctorId] });
      await queryClient.invalidateQueries({ queryKey: ["doctorSlots"] });
      await queryClient.refetchQueries({ queryKey: ["doctorSlots"] });
      await queryClient.invalidateQueries({ queryKey: ["availableDoctorSlots"] });
      toast.success(
        "Día libre eliminado. Se han restablecido los horarios para esta fecha.",
      );
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message || "Error al eliminar el día libre.");
    },
  });
};
