import { useQuery } from "@tanstack/react-query";
import { getAuditLogsAction } from "@/core/audit/actions";
import { AuditLogFilters } from "@/core/audit/interfaces";

export const useAuditLogs = (params: AuditLogFilters) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogsAction(params),
  });
};
