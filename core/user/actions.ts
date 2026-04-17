import { ApiResponse, publicClient } from "@/libs/http-client";
import { User } from "./interfaces";

/**
 * @description
 * Obtener usuaro por email
 * */
export const getUserByEmail = async (
  email: string,
  token: string,
): Promise<ApiResponse<User>> => {
  try {
    const { data } = await publicClient.get<ApiResponse<User>>(
      `/api/v1/users/email/${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  } catch (error) {
    throw error;
  }
};
