import { type ApiResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  ConsultationRequest,
  ConsultationResponse,
  CompleteConsultationRequest,
} from "../interfaces";

/**
 * Obtener consulta médica por ID de cita
 */
export const getConsultationByAppointmentIdAction = async (appointmentId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<ConsultationResponse>>(
      `/api/v1/consultations/appointment/${appointmentId}`
    );
    return data;
  } catch (error) {
    console.error("Error in getConsultationByAppointmentIdAction:", error);
    throw error;
  }
};

/**
 * Obtener consultas médicas por ID de doctor y estado opcional
 */
export const getConsultationsAction = async (doctorId: string, status?: string) => {
  try {
    const params = new URLSearchParams();
    params.append("doctorId", doctorId);
    if (status) {
      params.append("status", status);
    }
    const { data } = await apiClient.get<ApiResponse<ConsultationResponse[]>>(
      `/api/v1/consultations?${params.toString()}`
    );
    return data;
  } catch (error) {
    console.error("Error in getConsultationsAction:", error);
    throw error;
  }
};

/**
 * Crear/iniciar una consulta médica vinculada a una cita
 */
export const createConsultationAction = async (request: ConsultationRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<ConsultationResponse>>(
      "/api/v1/consultations",
      request
    );
    return data;
  } catch (error) {
    console.error("Error in createConsultationAction:", error);
    throw error;
  }
};

/**
 * Finalizar la consulta completa (notas + vitales + diagnóstico + receta + alergias)
 */
export const completeConsultationAction = async (
  consultationId: string,
  request: CompleteConsultationRequest
) => {
  try {
    const { data } = await apiClient.post<ApiResponse<ConsultationResponse>>(
      `/api/v1/consultations/${consultationId}/complete`,
      request
    );
    return data;
  } catch (error) {
    console.error("Error in completeConsultationAction:", error);
    throw error;
  }
};
