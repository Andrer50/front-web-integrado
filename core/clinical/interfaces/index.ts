export interface ConsultationRequest {
  appointmentId: string;
  notes: string;
}

export interface ConsultationResponse {
  id: string;
  appointmentId: string;
  patientFirstName?: string;
  patientLastName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes: string;
  status?: string;
  createdAt: string;
  vitals?: ConsultationVitalsResponse;
  diagnoses?: ConsultationDiagnosisResponse[];
  prescription?: PrescriptionResponse;
}

export interface ConsultationVitalsRequest {
  weight: number;
  height: number;
  bloodPressure: string;
  temperature: number;
  heartRate: number;
}

export interface ConsultationVitalsResponse {
  id: string;
  weight: number;
  height: number;
  bloodPressure: string;
  temperature: number;
  heartRate: number;
}

export interface ConsultationDiagnosisRequest {
  icd10: string;
  description: string;
  type: string; // PRIMARY, SECONDARY
}

export interface ConsultationDiagnosisResponse {
  id: string;
  icd10: string;
  description: string;
  type: string;
}

export interface PrescriptionItemRequest {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionItemResponse {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PrescriptionRequest {
  notes: string;
  items: PrescriptionItemRequest[];
}

export interface PrescriptionResponse {
  id: string;
  notes: string;
  issueDate: string;
  items: PrescriptionItemResponse[];
}

export interface AllergyConsultationRequest {
  type: string;
  severity: string;
}

export interface CompleteConsultationRequest {
  notes: string;
  vitals?: ConsultationVitalsRequest;
  diagnosis?: ConsultationDiagnosisRequest;
  prescription?: PrescriptionRequest;
  allergies?: AllergyConsultationRequest[];
}
