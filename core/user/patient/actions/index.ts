import { type ApiResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import { PatientRegisterRequest, PatientRegisterResponse } from "../interfaces";

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
    console.error();
    throw error;
  }
};
