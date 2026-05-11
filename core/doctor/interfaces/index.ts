import { SpecialtyResponse } from "@/core/specialty/interfaces";
import { User } from "@/core/user/interfaces";

export interface DoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  medicalLicenseNumber: string;
  bio: string;
  specialtyIds: string[];
}

export interface DoctorResponse {
  id: string;
  medicalLicenseNumber: string;
  bio: string;
  user: User;
  specialties: SpecialtyResponse[];
}
