import { useQuery } from "@tanstack/react-query";
import { getLabOrdersAction } from "@/core/clinical/actions";

export const useLabOrders = () => {
  return useQuery({
    queryKey: ["lab-orders"],
    queryFn: getLabOrdersAction,
  });
};
