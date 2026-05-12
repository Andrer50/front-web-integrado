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

export interface GenerateSlotsRequest {
  doctorId: string;
  consultingRoomId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  slotDurationMinutes: number;
}

export interface DoctorScheduleSlotResponse {
  id: string;
  doctorId: string;
  doctorName: string;
  consultingRoomId: string;
  consultingRoomNumber: string;
  branchId: string;
  branchName: string;
  slotDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
}

export interface SlotItem {
  slotId: string;
  time: string; // "HH:mm"
}

export interface DateGroup {
  date: string; // "YYYY-MM-DD"
  dayLabel: string; // "Lun"
  dateLabel: string; // "14 May"
  slots: SlotItem[];
}

export interface AvailableDoctorSlotsResponse {
  doctorId: string;
  doctorName: string;
  cmp: string;
  specialty: string;
  branchName: string;
  branchAddress: string;
  modality: string;
  availableDates: DateGroup[];
}
