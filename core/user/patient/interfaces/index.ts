import { Status } from "@/core/shared";

export interface Patient {
  id: string;
  email: string;
  status: Status;
  phone: string;
  birthDate: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  address: string;
}

export interface PatientFilters {
  query?: string;
  status?: string;
}

export interface PatientRegisterResponse {
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
}

export interface PatientRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  documentNumber: string;
}
