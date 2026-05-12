import { useQuery } from "@tanstack/react-query";
import { getConsultingRoomsAction } from "@/core/branch/actions";

export const useConsultingRooms = () => {
  return useQuery({
    queryKey: ["consultingRooms"],
    queryFn: getConsultingRoomsAction,
    refetchOnWindowFocus: false,
  });
};
