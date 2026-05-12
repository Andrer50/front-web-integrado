import { useQuery } from "@tanstack/react-query";
import { getAvailableDoctorSlotsAction } from "@/core/appointment/actions";

interface UseAvailableDoctorSlotsParams {
  specialtyId: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export const useAvailableDoctorSlots = (params: UseAvailableDoctorSlotsParams) => {
  return useQuery({
    queryKey: ["availableDoctorSlots", params],
    queryFn: () => getAvailableDoctorSlotsAction(params),
    enabled: !!params.specialtyId,
    refetchOnWindowFocus: false,
  });
};
