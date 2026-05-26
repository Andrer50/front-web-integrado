import { type ApiResponse } from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  BranchRequest,
  BranchResponse,
  ConsultingRoomRequest,
  ConsultingRoomResponse,
} from "../interfaces";

/**
 * Crear una nueva sede
 */
export const createBranchAction = async (values: BranchRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<BranchResponse>>(
      "/api/v1/branches",
      values,
    );
    return data;
  } catch (error) {
    console.error("Error in createBranchAction:", error);
    throw error;
  }
};

/**
 * Actualizar una sede existente
 */
export const updateBranchAction = async (id: string, values: BranchRequest) => {
  try {
    const { data } = await apiClient.put<ApiResponse<BranchResponse>>(
      `/api/v1/branches/${id}`,
      values,
    );
    return data;
  } catch (error) {
    console.error("Error in updateBranchAction:", error);
    throw error;
  }
};

/**
 * Obtener listado de todas las sedes
 */
export const getBranchesAction = async () => {
  try {
    const { data } = await apiClient.get<ApiResponse<BranchResponse[]>>(
      "/api/v1/branches",
    );
    return data;
  } catch (error) {
    console.error("Error in getBranchesAction:", error);
    throw error;
  }
};

/**
 * Crear un nuevo consultorio físico
 */
export const createConsultingRoomAction = async (values: ConsultingRoomRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<ConsultingRoomResponse>>(
      "/api/v1/consulting-rooms",
      values,
    );
    return data;
  } catch (error) {
    console.error("Error in createConsultingRoomAction:", error);
    throw error;
  }
};

/**
 * Obtener todos los consultorios físicos
 */
export const getConsultingRoomsAction = async () => {
  try {
    const { data } = await apiClient.get<ApiResponse<ConsultingRoomResponse[]>>(
      "/api/v1/consulting-rooms",
    );
    return data;
  } catch (error) {
    console.error("Error in getConsultingRoomsAction:", error);
    throw error;
  }
};

/**
 * Obtener consultorios de una sede específica
 */
export const getConsultingRoomsByBranchAction = async (branchId: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<ConsultingRoomResponse[]>>(
      `/api/v1/consulting-rooms/branch/${branchId}`,
    );
    return data;
  } catch (error) {
    console.error("Error in getConsultingRoomsByBranchAction:", error);
    throw error;
  }
};
