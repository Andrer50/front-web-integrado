import { getSession, signOut } from "next-auth/react";
// lib/http-client.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiResponse<T> {
  code: string;
  message: string;
  data?: T;
}

export interface NetworkError {
  code: string;
  message: string;
  status: number;
}

// Estructura de error estándar
export class BusinessError extends Error {
  constructor(
    public code: string,
    public message: string,
  ) {
    super(message);
    this.name = "BusinessError";
  }
}

export class HttpClient {
  private static instances: Map<string, HttpClient> = new Map();
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  private constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      // timeout: 30000,
    });

    this.setupInterceptors();
  }

  public static getInstance(
    baseURL: string,
    name: string = "default",
  ): HttpClient {
    if (!HttpClient.instances.has(name)) {
      HttpClient.instances.set(name, new HttpClient(baseURL));
    }
    return HttpClient.instances.get(name)!;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Nota el async
        // 1. Si ya tenemos token manual, úsalo
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        // 2. Si NO tenemos token y estamos en el navegador, intenta leer la sesión de NextAuth
        else if (typeof window !== "undefined") {
          const session = await getSession();
          if (session?.accessToken) {
            // Opcional: guardarlo en this.token para futuras peticiones
            this.token = session.accessToken;
            config.headers.Authorization = `Bearer ${session.accessToken}`;
          }
        }
        return config;
      },
      (error: unknown) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      <T>(
        response: AxiosResponse<ApiResponse<T>>,
      ): AxiosResponse<ApiResponse<T>> => {
        const data = response.data;

        // Si la respuesta es un Blob, retornamos directamente
        if (data instanceof Blob) {
          return response;
        }

        // Conversión segura para respuestas JSON esperadas
        const { code, message } = data as unknown as ApiResponse<T>;

        if (code && code !== "000") {
          const businessError: BusinessError = Object.assign(
            new Error(message || "Error en la operación"),
            {
              code,
              isBusinessError: true as const,
              data: response.data,
            },
          );
          throw businessError;
        }

        return response;
      },
      (error: unknown): Promise<NetworkError> => {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const err = error as {
            response: {
              status: number;
              data?: {
                message?: string;
                data?: {
                  currentTime?: string;
                  openTime?: string;
                  closeTime?: string;
                  nextOpenTime?: string;
                  message?: string;
                };
              };
            };
          };

          if (err.response.status === 401) {
            console.error("Token expirado o inválido");
            if (typeof window !== "undefined") {
              signOut({ callbackUrl: "/sign-in" });
            }
          }

          return Promise.reject({
            code: String(err.response.status),
            message: err.response.data?.message ?? "Error de red",
            status: err.response.status,
          });
        }

        return Promise.reject({
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Error desconocido",
          status: 500,
        });
      },
    );
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
  }

  public getToken(): string | null {
    return this.token;
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public delete<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, { ...config, data });
  }
}

/**
 * Cliente HTTP para API principal
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const apiClient = HttpClient.getInstance("", "main");

/**
 * Cliente HTTP para autenticación
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const authClient = HttpClient.getInstance("", "auth");

/**
 * Cliente HTTP para archivos
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const filesClient = HttpClient.getInstance("", "files");
