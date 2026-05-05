import { useQuery } from "@tanstack/react-query";
import { getSpecialtiesAction } from "@/core/specialty/actions";
import { SpecialtyFilters } from "@/core/specialty/interfaces";
import { PaginationParams } from "@/core/shared";

export const useSpecialties = (params: PaginationParams & SpecialtyFilters) => {
  return useQuery({
    queryKey: ["specialties", params],
    queryFn: () => getSpecialtiesAction(params),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};
