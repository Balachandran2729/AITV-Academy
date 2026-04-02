import axios, { AxiosInstance, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { ApiError } from "./apiError";

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
  status?: number;
}

export interface ApiRequestConfig extends Record<string, any> {
  protected?: boolean;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private onUnauthorizedCallback?: () => void;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 60000,
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  public setOnUnauthorizedCallback(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  private initializeRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        config.headers = config.headers || {};

        const isProtected = (config as any).protected ?? true;

        if (isProtected) {
          try {
            const token = await SecureStore.getItemAsync("accessToken");

            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.warn(
              "Could not retrieve auth token from SecureStore:",
              error
            );
          }
        }

        // Content-Type handling
        if (config.data instanceof FormData) {
          config.headers["Content-Type"] = "multipart/form-data";
        } else {
          if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
          }
        }

        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );
  }

  private initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token on unauthorized
          try {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            
            // Import useAuthStore and clear auth state
            const { clearAuth } = await import("../../features/Auth/store/authStore").then(
              (module) => ({ clearAuth: module.useAuthStore.getState().clearAuth })
            );
            
            if (clearAuth) {
              await clearAuth();
            }
          } catch (err) {
            console.warn("Error clearing auth on 401:", err);
          }

          if (this.onUnauthorizedCallback) {
            this.onUnauthorizedCallback();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.code === "ERR_CANCELED") {
      return new ApiError("Request canceled", 0);
    }

    const status = error.response?.status ?? 500;

    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "An unexpected API error occurred";

    const details = error.response?.data || error;

    return new ApiError(message, status, details);
  }

  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return { data: response.data, loading: false, status: response.status };
    } catch (err) {
      const apiError = this.handleError(err as AxiosError);
      return { error: apiError, loading: false, status: apiError.status };
    }
  }

  async post<T>(
    url: string,
    body: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, body, config);
      return { data: response.data, loading: false, status: response.status };
    } catch (err) {
      const apiError = this.handleError(err as AxiosError);
      return { error: apiError, loading: false, status: apiError.status };
    }
  }

  async put<T>(
    url: string,
    body: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, body, config);
      return { data: response.data, loading: false, status: response.status };
    } catch (err) {
      const apiError = this.handleError(err as AxiosError);
      return { error: apiError, loading: false, status: apiError.status };
    }
  }

  async delete<T>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return { data: response.data, loading: false, status: response.status };
    } catch (err) {
      const apiError = this.handleError(err as AxiosError);
      return { error: apiError, loading: false, status: apiError.status };
    }
  }

  async patch<T>(
    url: string,
    body: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, body, config);
      return { data: response.data, loading: false, status: response.status };
    } catch (err) {
      const apiError = this.handleError(err as AxiosError);
      return { error: apiError, loading: false, status: apiError.status };
    }
  }
}