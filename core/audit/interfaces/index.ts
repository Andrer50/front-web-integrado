import { PaginationParams } from "@/core/shared";

export interface AuditLogResponse {
  id: string;
  module: string;
  entityType: string;
  entityId: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  actorEmail: string;
  actorRoles?: string;
  changedAt: string;
  description?: string;
}

export interface AuditLogFilters extends PaginationParams {
  module?: string;
  entityType?: string;
  entityId?: string;
}
