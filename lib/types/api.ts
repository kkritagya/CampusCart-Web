import type { AuthUser } from "./auth";

export type ApiResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string; status?: number };

export type BackendEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
  user?: AuthUser;
};

export function getResponseMessage(payload: BackendEnvelope) {
  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (typeof payload.error === "string") {
    return payload.error;
  }

  return "Something went wrong. Please try again.";
}

export function unwrapBackendPayload<T>(payload: BackendEnvelope<T> | T): T {
  if (payload && typeof payload === "object") {
    const envelope = payload as BackendEnvelope<T>;

    if (envelope.user && typeof envelope.user === "object") {
      return envelope.user as T;
    }

    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }

  return payload as T;
}
