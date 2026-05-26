import { type ApiResponse, type PaginatedResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentFilters,
  GenerateSlotsRequest,
  DoctorScheduleSlotResponse,
  AvailableDoctorSlotsResponse,
  DoctorScheduleRequest,
  DoctorScheduleResponse,
  DoctorOffDayRequest,
  DoctorOffDayResponse,
  DoctorOffDaySaveResponse,
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

/**
 * Obtener la configuración de horario semanal de un médico
 */
export const getWeeklyConfigAction = async (doctorId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<DoctorScheduleResponse[]>>(
      `/api/v1/schedules/doctor/${doctorId}/weekly-config`,
    );
    return data;
  } catch (error) {
    console.error("Error in getWeeklyConfigAction:", error);
    throw error;
  }
};

/**
 * Guardar la configuración de horario semanal de un médico
 */
export const saveWeeklyConfigAction = async (
  doctorId: string,
  request: DoctorScheduleRequest[],
) => {
  try {
    const { data } = await apiClient.post<ApiResponse<DoctorScheduleResponse[]>>(
      `/api/v1/schedules/doctor/${doctorId}/weekly-config`,
      request,
    );
    return data;
  } catch (error) {
    console.error("Error in saveWeeklyConfigAction:", error);
    throw error;
  }
};

/**
 * Obtener los días libres de un médico
 */
export const getOffDaysAction = async (doctorId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<DoctorOffDayResponse[]>>(
      `/api/v1/schedules/doctor/${doctorId}/off-days`,
    );
    return data;
  } catch (error) {
    console.error("Error in getOffDaysAction:", error);
    throw error;
  }
};

/**
 * Registrar un día libre para un médico
 */
export const saveOffDayAction = async (
  doctorId: string,
  request: DoctorOffDayRequest,
) => {
  try {
    const { data } = await apiClient.post<ApiResponse<DoctorOffDaySaveResponse>>(
      `/api/v1/schedules/doctor/${doctorId}/off-days`,
      request,
    );
    return data;
  } catch (error) {
    console.error("Error in saveOffDayAction:", error);
    throw error;
  }
};

/**
 * Eliminar un día libre registrado
 */
export const deleteOffDayAction = async (offDayId: string) => {
  try {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/schedules/doctor/off-days/${offDayId}`,
    );
    return data;
  } catch (error) {
    console.error("Error in deleteOffDayAction:", error);
    throw error;
  }
};

