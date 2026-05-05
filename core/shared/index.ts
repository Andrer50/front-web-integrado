export type Status = "ACTIVE" | "INACTIVE" | "PENDING";
export type Role = "ADMIN" | "DOCTOR" | "PATIENT";

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}
