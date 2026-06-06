import {
  type ApiResponse,
  type PaginatedResponse,
  type PaginationParams,
} from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  PatientRegisterRequest,
  PatientRegisterResponse,
  PatientFilters,
  PatientResponse,
} from "../interfaces";

/**
 * @description
 * Crear un usuario paciente
 */
export const createPatientAction = async (values: PatientRegisterRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<PatientRegisterResponse>>(
      "/api/v1/patients",
      values,
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @description
 * Obtener pacientes paginados con filtros
 */
export const getPatientsAction = async (
  params: PaginationParams & PatientFilters,
) => {
  try {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<PatientResponse>>
    >("/api/v1/patients", { params });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @description
 * Cambiar el estado de un paciente (ACTIVE/INACTIVE)
 */
export const changePatientStatusAction = async (
  patientId: string,
  status: "ACTIVE" | "INACTIVE",
) => {
  try {
    const { data } = await apiClient.patch<ApiResponse<PatientResponse>>(
      `/api/v1/patients/${patientId}/status`,
      null,
      { params: { status } }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Obtener un paciente por ID
export const getPatientByIdAction = async (patientId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<PatientResponse>>(
      `/api/v1/patients/${patientId}`
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Actualizar paciente
export const updatePatientAction = async (
  patientId: string,
  values: Partial<PatientRegisterRequest>
) => {
  try {
    const { data } = await apiClient.put<ApiResponse<PatientResponse>>(
      `/api/v1/patients/${patientId}`,
      values
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export interface MedicalHistoryResponse {
  patient: PatientResponse;
  allergies: {
    id: string;
    patientId: string;
    type: string;
    severity: string;
    reaction?: string;
  }[];
  prescriptions: {
    id: string;
    notes?: string;
    issueDate: string;
    items: {
      id: string;
      medicationName: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }[];
  }[];
  labOrders: {
    id: string;
    type: string;
    name: string;
    status: string;
    orderedAt: string;
    resultDetails?: string;
    resultRecordedAt?: string;
  }[];
}

// Obtener historial medico de un paciente
export const getPatientMedicalHistoryAction = async (patientId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<MedicalHistoryResponse>>(
      `/api/v1/patients/${patientId}/medical-history`
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Obtener paciente por ID de usuario
export const getPatientByUserIdAction = async (userId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<PatientResponse>>(
      `/api/v1/patients/user/${userId}`
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};