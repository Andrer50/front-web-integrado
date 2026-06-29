import { type ApiResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  ConsultationRequest,
  ConsultationResponse,
  CompleteConsultationRequest,
  LabOrderResponse,
  LabResultRequest,
  LabResultResponse,
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

/**
 * Registrar el resultado de una solicitud de laboratorio o imagen
 */
export const recordLabResultAction = async (
  labOrderId: string,
  request: LabResultRequest,
) => {
  try {
    const { data } = await apiClient.post<ApiResponse<LabResultResponse>>(
      `/api/v1/lab-orders/${labOrderId}/result`,
      request,
    );
    return data;
  } catch (error) {
    console.error("Error in recordLabResultAction:", error);
    throw error;
  }
};

/**
 * Obtener las órdenes visibles para el usuario autenticado.
 * El backend aplica el alcance según el rol del token.
 */
export const getLabOrdersAction = async () => {
  try {
    const { data } = await apiClient.get<ApiResponse<LabOrderResponse[]>>(
      "/api/v1/lab-orders",
    );
    return data;
  } catch (error) {
    console.error("Error in getLabOrdersAction:", error);
    throw error;
  }
};
