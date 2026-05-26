import { useQuery } from "@tanstack/react-query";
import { getBranchesAction } from "@/core/branch/actions";

export const useBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getBranchesAction,
    refetchOnWindowFocus: false,
  });
};
