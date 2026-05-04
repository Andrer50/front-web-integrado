import { useQuery } from "@tanstack/react-query";
import { getPatientsAction } from "@/core/user/patient/actions";
import { PatientFilters } from "@/core/user/patient/interfaces";
import { PaginationParams } from "@/core/shared";

export const usePatients = (params: PaginationParams & PatientFilters) => {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => getPatientsAction(params),
    placeholderData: (previousData) => previousData,
  });
};
