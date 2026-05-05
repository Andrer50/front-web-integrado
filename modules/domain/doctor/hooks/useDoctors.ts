import { useQuery } from "@tanstack/react-query";
import { getDoctorsAction } from "@/core/doctor/actions";
import { PaginationParams } from "@/core/shared";

export const useDoctors = (params: PaginationParams & { query?: string }) => {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => getDoctorsAction(params),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};
