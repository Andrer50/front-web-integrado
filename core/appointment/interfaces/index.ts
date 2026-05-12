import { PaginationParams } from "@/core/shared";

export interface AppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "HH:mm"
  reason?: string;
}

export interface AppointmentResponse {
  id: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorSpecialty: string;
  doctorMedicalLicenseNumber: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "HH:mm"
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  reason?: string;
}

export interface AppointmentFilters extends PaginationParams {
  patientId?: string;
  doctorId?: string;
  status?: string;
}
