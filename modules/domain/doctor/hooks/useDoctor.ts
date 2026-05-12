import { useQuery } from "@tanstack/react-query";
import { getDoctorByIdAction } from "@/core/doctor/actions";

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorByIdAction(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
