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
    this.axiosInstance = axios.create({ baseURL });
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

  public setToken(token: string) {
    this.token = token;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        return config;
      },
      (error: unknown) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        const { data } = response;

        if (data && typeof data === "object" && "code" in data) {
          const apiData = data as ApiResponse<unknown>;
          if (apiData.code !== "0000" && apiData.code !== "000") {
            throw new BusinessError(
              apiData.code,
              apiData.message || "Error de negocio",
            );
          }
        }

        return response;
      },
      async (error) => {
        if (error.response) {
          return Promise.reject({
            code: String(error.response.status),
            message: error.response.data?.message ?? "Error de red",
            status: error.response.status,
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

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

// Determinar baseURL dinámico
const isServer = typeof window === "undefined";

/**
 * Cliente HTTP para API principal
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const apiClient = HttpClient.getInstance(
  isServer ? process.env.BACKEND_URL || "" : "",
  "main",
);

/**
 * Cliente HTTP para API principal PUBLICO
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const publicClient = HttpClient.getInstance(
  isServer ? process.env.BACKEND_URL || "" : "",
  "public",
);

/**
 * Cliente HTTP para autenticación
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const authClient = HttpClient.getInstance(
  isServer ? process.env.BACKEND_AUTH_URL || "" : "",
  "auth",
);

/**
 * Cliente HTTP para archivos
 *
 * Nota: baseURL vacío porque las rutas son manejadas por rewrites de Next.js
 * Ver next.config.js para la configuración de rewrites
 */
export const fileClient = HttpClient.getInstance(
  isServer ? process.env.BACKEND_FILES_URL || "" : "",
  "files",
);
