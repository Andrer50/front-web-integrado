import {
  type ApiResponse,
  type PaginatedResponse,
  type PaginationParams,
} from "@/core/shared";
import { apiClient } from "@/libs/http-client";
import {
  SpecialtyFilters,
  SpecialtyRequest,
  SpecialtyResponse,
} from "../interfaces";

/**
 * @description
 * Crear una especialidad médica
 */
export const createSpecialtyAction = async (values: SpecialtyRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<SpecialtyResponse>>(
      "/api/v1/specialties",
      values,
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSpecialtyAction = async (
  id: string,
  request: SpecialtyRequest,
) => {
  try {
    const { data } = await apiClient.put<ApiResponse<SpecialtyResponse>>(
      `/api/v1/specialties/${id}`,
      request,
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @description
 * Obtener especialidades paginadas con filtros
 */
export const getSpecialtiesAction = async (
  params: PaginationParams & SpecialtyFilters,
) => {
  try {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<SpecialtyResponse>>
    >("/api/v1/specialties", { params });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
