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
