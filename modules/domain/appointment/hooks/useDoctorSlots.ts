import { useQuery } from "@tanstack/react-query";
import { getSlotsByDoctorAction } from "@/core/appointment/actions";

export const useDoctorSlots = (doctorId: string, startDate?: string) => {
  return useQuery({
    queryKey: ["doctorSlots", doctorId, startDate],
    queryFn: () => getSlotsByDoctorAction(doctorId, startDate),
    enabled: !!doctorId,
    refetchOnWindowFocus: false,
  });
};
