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
