import { rootConfig } from "@/core/config/config";
import { StatusCode } from "@/core/config/network/StatusCode";
import { useToastStore } from "@/core/stores/toast";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { userStore } from "@/core/stores/userStore";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "X-Requested-With": "XMLHttpRequest",
};

const CSRF = "X-CSRF-TOKEN";

const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig | undefined => {
  try {
    const usuarioStore = userStore();
    const TOKEN = usuarioStore.data.token;
    if (!config.headers) {
      return config;
    }

    config.headers["Accept-Language"] = 'es';
    config.url = config.url;
    config.url = TOKEN ? config.url : `${config.url}`;
    config.headers.Authorization = TOKEN ? `Bearer ${TOKEN}` : "";
    // config.headers[CSRF] = config.method === "post" ? `${TOKEN}` : "";
    if (config.method === "post") {
      config.headers[CSRF] = `${TOKEN}`;
    }
    return config;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

// Configuración de Axios
export const axiosConfig: AxiosRequestConfig = {
  baseURL: rootConfig.apiURL,
  headers,
};

class Api {
  readonly #apiClient = axios.create(axiosConfig);

  constructor() {
    this.#apiClient.interceptors.request.use(injectToken, (error: unknown) =>
      Promise.reject(error)
    );
    this.#apiClient.interceptors.response.use(
      (response) => {
        Api.handleStates(response);
        return response;
      },
      (error) => {
        const { response } = error;
        return Api.handleError(response);
      }
    );
  }

  async request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.#apiClient.request(config);
  }

  async get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.#apiClient.get<T, R>(url, config);
  }

  async post<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.#apiClient.post<T, R>(url, data, config);
  }

  async put<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.#apiClient.put<T, R>(url, data, config);
  }

  delete<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.#apiClient.delete<T, R>(url, config);
  }

  private static handleStates(success: any) {
    const { message } = success.data || {};
    const { status } = success;
    const toastStore = useToastStore();
    switch (status) {
      // Manejo de diferentes códigos de estado HTTP
      case StatusCode.Accept:
        toastStore.onShowToast({
          title: "",
          message: message,
          type: "info",
          code: status,
        });
        break;
      case StatusCode.NoContent:
        break;
      case StatusCode.Ok:
        break;
      default:
        toastStore.onShowToast({
          title: "",
          message: message,
          type: "success",
          code: status,
        });
        break;
    }
  }

  private static handleError(error: any): Promise<never> {
    const { status, data } = error || {};
    const toastStore = useToastStore();
    let messageErrorData = "Error Interno";
    if (Object.prototype.hasOwnProperty.call(data, "status")) {
      const statusData = data.status;
      if (statusData !== 500) {
        messageErrorData = data.message;
      }
    }
    switch (status) {
      case StatusCode.NotFound:
        toastStore.onShowToast({
          title: "Recurso no encontrado",
          message: data.message,
          type: "error",
          code: status,
        });
        break;
      case StatusCode.TooManyRequests:
        toastStore.onShowToast({
          title: "Error",
          message: "Demasiados intentos",
          type: "error",
          code: status,
        });
        break;
      case StatusCode.Unauthorized:
        toastStore.onShowToast({
          title: "Error",
          message: "Sesión Caducada",
          type: "error",
          code: status,
        });
        break;
      case StatusCode.InternalServerError:
        toastStore.onShowToast({
          title: messageErrorData,
          message: "",
          type: "error",
          code: status,
        });
        break;
      default:
        toastStore.onShowToast({
          title: "",
          message: data.message,
          type: "error",
          code: status,
        });
        break;
    }
    return Promise.reject(error);
  }
}

export const api = new Api();
