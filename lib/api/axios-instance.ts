import { applyBackendCookies, getCookieHeader } from "@/lib/cookies";
import {
  getResponseMessage,
  unwrapBackendPayload,
  type ApiResult,
  type BackendEnvelope,
} from "@/lib/types/api";
import { AUTH_API_BASE_URL } from "./endpoint";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  authenticated?: boolean;
  baseUrl?: string;
};

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = (await response.json()) as BackendEnvelope;
    return { data, message: getResponseMessage(data) };
  }

  const message = await response.text();
  return {
    data: null,
    message: message || "Something went wrong. Please try again.",
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResult<T>> {
  try {
    const headers = new Headers();
    const cookieHeader = await getCookieHeader();

    if (options.body && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    const response = await fetch(`${options.baseUrl ?? AUTH_API_BASE_URL}${endpoint}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
      cache: "no-store",
      credentials: "include",
    });

    await applyBackendCookies(response);

    const { data, message } = await parseResponseBody(response);

    if (!response.ok) {
      return {
        success: false,
        message,
        status: response.status,
      };
    }

    return {
      success: true,
      data: unwrapBackendPayload<T>(data as BackendEnvelope<T>),
      message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to connect to the authentication server.",
    };
  }
}
