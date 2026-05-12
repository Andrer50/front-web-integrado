import { type ApiResponse, type PaginatedResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentFilters,
} from "../interfaces";

/**
 * @description
 * Crear una cita médica
 */
export const createAppointmentAction = async (values: AppointmentRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<AppointmentResponse>>(
      "/api/v1/appointments",
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
 * Obtener citas médicas paginadas con filtros
 */
export const getAppointmentsAction = async (params: AppointmentFilters) => {
  try {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<AppointmentResponse>>
    >("/api/v1/appointments", { params });
    return data;
  } catch (error) {
    throw error;
  }
};
