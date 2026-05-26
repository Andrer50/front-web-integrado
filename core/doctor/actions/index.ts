import { apiClient, ApiResponse } from "@/libs/http-client";
import { DoctorRequest, DoctorResponse, DoctorUpdateRequest } from "../interfaces";
import { PaginatedResponse, PaginationParams, Status } from "@/core/shared";

export const createDoctorAction = async (request: DoctorRequest) => {
  try {
    const { data } = await apiClient.post<ApiResponse<DoctorResponse>>(
      "/api/v1/doctors",
      request,
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDoctorsAction = async (
  params: PaginationParams & { query?: string },
) => {
  try {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<DoctorResponse>>
    >("/api/v1/doctors", {
      params,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDoctorByIdAction = async (id: string) => {
  try {
    const { data } = await apiClient.get<ApiResponse<DoctorResponse>>(
      `/api/v1/doctors/${id}`,
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @description
 * Actualizar doctor
 */
export const updateDoctorAction = async (
  id: string,
  values: DoctorUpdateRequest,
) => {
  try {
    const { data } = await apiClient.put<ApiResponse<DoctorResponse>>(
      `/api/v1/doctors/${id}`,
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
 * Cambiar el estado de un doctor (ACTIVE/INACTIVE)
 */
export const changeDoctorStatusAction = async (
  doctorId: string,
  status: Status,
) => {
  try {
    const { data } = await apiClient.patch<ApiResponse<DoctorResponse>>(
      `/api/v1/doctors/${doctorId}/status`,
      null,
      { params: { status } },
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
