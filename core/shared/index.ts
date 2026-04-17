export type Status = "ACTIVE" | "INACTIVE" | "PENDING";
export type Role = "ADMIN" | "CLIENT";

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}
