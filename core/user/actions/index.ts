import { type ApiResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import { type User } from "../interfaces";

/**
 * @description
 * Crear un usuario paciente
 */
export const createPatientAction = async (values: RegisterUserRequest) => {
  try {
    const { data } =
      await apiClient.post<ApiResponse<User>>("/api/v1/patients",values );
      return data;
  } catch (error) {
    console.error();
    throw error;
  }
};
