import { apiClient, ApiResponse } from "@/libs/http-client";
import { DoctorRequest, DoctorResponse } from "../interfaces";
import { PaginatedResponse, PaginationParams } from "@/core/shared";

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
