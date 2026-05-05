import { Status } from "@/core/shared";

export interface SpecialtyResponse {
  id: string;
  name: string;
  description: string;
  status: Status;
}

export interface SpecialtyFilters {
  query?: string;
  status?: Status;
}

export interface SpecialtyRequest {
  name: string;
  description: string;
  status: Status;
}
