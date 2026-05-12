import { type ApiResponse, type PaginatedResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentFilters,
  GenerateSlotsRequest,
  DoctorScheduleSlotResponse,
  AvailableDoctorSlotsResponse,
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

/**
 * Generar slots de horario para un médico
 */
export const generateScheduleSlotsAction = async (request: GenerateSlotsRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<DoctorScheduleSlotResponse[]>>(
      "/api/v1/schedules/generate",
      request,
    );
    return data;
  } catch (error) {
    console.error("Error in generateScheduleSlotsAction:", error);
    throw error;
  }
};

/**
 * Obtener slots disponibles estructurados para Clínica Aviva
 */
export const getAvailableDoctorSlotsAction = async (params: {
  specialtyId: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const { data } = await apiClient.get<ApiResponse<AvailableDoctorSlotsResponse[]>>(
      "/api/v1/schedules/available-slots",
      { params },
    );
    return data;
  } catch (error) {
    console.error("Error in getAvailableDoctorSlotsAction:", error);
    throw error;
  }
};

/**
 * Obtener slots generados para un médico específico (disponibles o reservados)
 */
export const getSlotsByDoctorAction = async (
  doctorId: string,
  startDate?: string,
) => {
  try {
    const { data } = await apiClient.get<ApiResponse<DoctorScheduleSlotResponse[]>>(
      `/api/v1/schedules/doctor/${doctorId}`,
      { params: { startDate } },
    );
    return data;
  } catch (error) {
    console.error("Error in getSlotsByDoctorAction:", error);
    throw error;
  }
};
