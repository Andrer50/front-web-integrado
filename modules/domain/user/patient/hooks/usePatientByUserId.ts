import { useQuery } from "@tanstack/react-query";
import { getPatientByUserIdAction } from "@/core/user/patient/actions";

export const usePatientByUserId = (userId?: string) => {
  return useQuery({
    queryKey: ["patient-by-user", userId],
    queryFn: () => getPatientByUserIdAction(userId!),
    enabled: !!userId,
  });
};
