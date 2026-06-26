import { type ApiResponse, type PaginatedResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import { AuditLogFilters, AuditLogResponse } from "../interfaces";

export const getAuditLogsAction = async (params: AuditLogFilters) => {
  try {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<AuditLogResponse>>
    >("/api/v1/audit-logs", { params });
    return data;
  } catch (error) {
    console.error("Error in getAuditLogsAction:", error);
    throw error;
  }
};
